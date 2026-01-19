import { put, list, del } from '@vercel/blob';
import { ForumPost, Comment, AdminStats, Neighborhood } from '@/types';
import * as fs from 'fs';
import * as path from 'path';

const POSTS_BLOB_KEY = 'data/posts.json';
const COMMENTS_BLOB_KEY = 'data/comments.json';

// Check if we're in local development mode (no Vercel Blob token)
const isLocalDev = !process.env.BLOB_READ_WRITE_TOKEN;

// Local file storage paths
const DATA_DIR = path.join(process.cwd(), 'data');
const getLocalFilePath = (key: string) => path.join(DATA_DIR, path.basename(key));

// Ensure data directory exists for local development
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Local file-based storage functions
function readLocalJson<T>(key: string, defaultValue: T): T {
  try {
    ensureDataDir();
    const filePath = getLocalFilePath(key);
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const text = fs.readFileSync(filePath, 'utf-8');
    if (!text || text.trim() === '') {
      return defaultValue;
    }
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(`Error reading local file ${key}:`, error);
    return defaultValue;
  }
}

function writeLocalJson<T>(key: string, data: T): void {
  try {
    ensureDataDir();
    const filePath = getLocalFilePath(key);
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf-8');
  } catch (error) {
    console.error(`Error writing local file ${key}:`, error);
    throw error;
  }
}

// Vercel Blob storage functions
async function readBlobJson<T>(key: string, defaultValue: T): Promise<T> {
  try {
    // List blobs to find our data file
    const { blobs } = await list({ prefix: key });

    if (blobs.length === 0) {
      return defaultValue;
    }

    // Sort by uploadedAt descending to get the most recent blob
    const sortedBlobs = [...blobs].sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    // Fetch the blob content with cache-busting
    const url = new URL(sortedBlobs[0].url);
    url.searchParams.set('_t', Date.now().toString());
    
    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
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
    // Write new data first (this creates a new blob or overwrites)
    const jsonString = JSON.stringify(data, null, 2);
    const newBlob = await put(key, jsonString, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    // Clean up any old blobs with the same prefix (except the one we just created)
    const { blobs } = await list({ prefix: key });
    for (const blob of blobs) {
      if (blob.url !== newBlob.url) {
        await del(blob.url);
      }
    }
  } catch (error) {
    console.error(`Error writing blob ${key}:`, error);
    throw error;
  }
}

// Unified storage functions that choose between local and blob storage
async function readJson<T>(key: string, defaultValue: T): Promise<T> {
  if (isLocalDev) {
    return readLocalJson(key, defaultValue);
  }
  return readBlobJson(key, defaultValue);
}

async function writeJson<T>(key: string, data: T): Promise<void> {
  if (isLocalDev) {
    writeLocalJson(key, data);
    return;
  }
  return writeBlobJson(key, data);
}

// Posts
export async function getPosts(options?: {
  includeDeleted?: boolean;
  filter?: 'recent' | 'needs-id' | Neighborhood;
  limit?: number;
  offset?: number;
}): Promise<ForumPost[]> {
  const posts = await readJson<ForumPost[]>(POSTS_BLOB_KEY, []);
  const comments = await readJson<Comment[]>(COMMENTS_BLOB_KEY, []);

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
  const posts = await readJson<ForumPost[]>(POSTS_BLOB_KEY, []);
  const post = posts.find(p => p.id === id);

  if (!post) return null;

  const comments = await readJson<Comment[]>(COMMENTS_BLOB_KEY, []);
  return {
    ...post,
    commentCount: comments.filter(c => c.postId === id && !c.isDeleted).length,
  };
}

export async function createPost(post: ForumPost): Promise<ForumPost> {
  const posts = await readJson<ForumPost[]>(POSTS_BLOB_KEY, []);
  posts.push(post);
  await writeJson(POSTS_BLOB_KEY, posts);
  return post;
}

export async function deletePost(id: string, adminId: string): Promise<boolean> {
  const posts = await readJson<ForumPost[]>(POSTS_BLOB_KEY, []);
  const index = posts.findIndex(p => p.id === id);

  if (index === -1) return false;

  posts[index] = {
    ...posts[index],
    isDeleted: true,
    deletedAt: new Date().toISOString(),
    deletedBy: adminId,
  };

  await writeJson(POSTS_BLOB_KEY, posts);
  return true;
}

// Comments
export async function getComments(postId: string, includeDeleted = false): Promise<Comment[]> {
  const comments = await readJson<Comment[]>(COMMENTS_BLOB_KEY, []);

  let filtered = comments.filter(c => c.postId === postId);
  if (!includeDeleted) {
    filtered = filtered.filter(c => !c.isDeleted);
  }

  return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function createComment(comment: Comment): Promise<Comment> {
  const comments = await readJson<Comment[]>(COMMENTS_BLOB_KEY, []);
  comments.push(comment);
  await writeJson(COMMENTS_BLOB_KEY, comments);
  return comment;
}

export async function deleteComment(id: string): Promise<boolean> {
  const comments = await readJson<Comment[]>(COMMENTS_BLOB_KEY, []);
  const index = comments.findIndex(c => c.id === id);

  if (index === -1) return false;

  comments[index] = {
    ...comments[index],
    isDeleted: true,
  };

  await writeJson(COMMENTS_BLOB_KEY, comments);
  return true;
}

// Admin Stats
export async function getAdminStats(): Promise<AdminStats> {
  const posts = await readJson<ForumPost[]>(POSTS_BLOB_KEY, []);
  const comments = await readJson<Comment[]>(COMMENTS_BLOB_KEY, []);

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
