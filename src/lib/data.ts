import { put, list, del } from '@vercel/blob';
import { ForumPost, Comment, AdminStats, Neighborhood } from '@/types';

const POSTS_BLOB_KEY = 'data/posts.json';
const COMMENTS_BLOB_KEY = 'data/comments.json';

async function readBlobJson<T>(key: string, defaultValue: T): Promise<T> {
  try {
    // List blobs to find our data file
    const { blobs } = await list({ prefix: key });

    if (blobs.length === 0) {
      return defaultValue;
    }

    // Fetch the blob content
    const response = await fetch(blobs[0].url);
    if (!response.ok) {
      return defaultValue;
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      return defaultValue;
    }

    const data = JSON.parse(text);
    return data as T;
  } catch (error) {
    console.error(`Error reading blob ${key}:`, error);
    return defaultValue;
  }
}

async function writeBlobJson<T>(key: string, data: T): Promise<void> {
  try {
    // Delete existing blob if it exists
    const { blobs } = await list({ prefix: key });
    for (const blob of blobs) {
      await del(blob.url);
    }

    // Write new data
    const jsonString = JSON.stringify(data, null, 2);
    await put(key, jsonString, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
  } catch (error) {
    console.error(`Error writing blob ${key}:`, error);
    throw error;
  }
}

// Posts
export async function getPosts(options?: {
  includeDeleted?: boolean;
  filter?: 'recent' | 'needs-id' | Neighborhood;
  limit?: number;
  offset?: number;
}): Promise<ForumPost[]> {
  const posts = await readBlobJson<ForumPost[]>(POSTS_BLOB_KEY, []);
  const comments = await readBlobJson<Comment[]>(COMMENTS_BLOB_KEY, []);

  let filtered = options?.includeDeleted
    ? posts
    : posts.filter(p => !p.isDeleted);

  // Add comment counts
  filtered = filtered.map(post => ({
    ...post,
    commentCount: comments.filter(c => c.postId === post.id && !c.isDeleted).length,
  }));

  // Apply filters
  if (options?.filter === 'needs-id') {
    filtered = filtered.filter(p => p.needsIdHelp);
  } else if (options?.filter && options.filter !== 'recent') {
    filtered = filtered.filter(p => p.neighborhood === options.filter);
  }

  // Sort by most recent
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply pagination
  const offset = options?.offset || 0;
  const limit = options?.limit || filtered.length;

  return filtered.slice(offset, offset + limit);
}

export async function getPost(id: string): Promise<ForumPost | null> {
  const posts = await readBlobJson<ForumPost[]>(POSTS_BLOB_KEY, []);
  const post = posts.find(p => p.id === id);

  if (!post) return null;

  const comments = await readBlobJson<Comment[]>(COMMENTS_BLOB_KEY, []);
  return {
    ...post,
    commentCount: comments.filter(c => c.postId === id && !c.isDeleted).length,
  };
}

export async function createPost(post: ForumPost): Promise<ForumPost> {
  const posts = await readBlobJson<ForumPost[]>(POSTS_BLOB_KEY, []);
  posts.push(post);
  await writeBlobJson(POSTS_BLOB_KEY, posts);
  return post;
}

export async function deletePost(id: string, adminId: string): Promise<boolean> {
  const posts = await readBlobJson<ForumPost[]>(POSTS_BLOB_KEY, []);
  const index = posts.findIndex(p => p.id === id);

  if (index === -1) return false;

  posts[index] = {
    ...posts[index],
    isDeleted: true,
    deletedAt: new Date().toISOString(),
    deletedBy: adminId,
  };

  await writeBlobJson(POSTS_BLOB_KEY, posts);
  return true;
}

// Comments
export async function getComments(postId: string, includeDeleted = false): Promise<Comment[]> {
  const comments = await readBlobJson<Comment[]>(COMMENTS_BLOB_KEY, []);

  let filtered = comments.filter(c => c.postId === postId);
  if (!includeDeleted) {
    filtered = filtered.filter(c => !c.isDeleted);
  }

  return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function createComment(comment: Comment): Promise<Comment> {
  const comments = await readBlobJson<Comment[]>(COMMENTS_BLOB_KEY, []);
  comments.push(comment);
  await writeBlobJson(COMMENTS_BLOB_KEY, comments);
  return comment;
}

export async function deleteComment(id: string): Promise<boolean> {
  const comments = await readBlobJson<Comment[]>(COMMENTS_BLOB_KEY, []);
  const index = comments.findIndex(c => c.id === id);

  if (index === -1) return false;

  comments[index] = {
    ...comments[index],
    isDeleted: true,
  };

  await writeBlobJson(COMMENTS_BLOB_KEY, comments);
  return true;
}

// Admin Stats
export async function getAdminStats(): Promise<AdminStats> {
  const posts = await readBlobJson<ForumPost[]>(POSTS_BLOB_KEY, []);
  const comments = await readBlobJson<Comment[]>(COMMENTS_BLOB_KEY, []);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return {
    totalPosts: posts.filter(p => !p.isDeleted).length,
    postsThisWeek: posts.filter(p => !p.isDeleted && new Date(p.createdAt) > oneWeekAgo).length,
    totalComments: comments.filter(c => !c.isDeleted).length,
    commentsThisWeek: comments.filter(c => !c.isDeleted && new Date(c.createdAt) > oneWeekAgo).length,
    deletedPosts: posts.filter(p => p.isDeleted).length,
    deletedComments: comments.filter(c => c.isDeleted).length,
  };
}
