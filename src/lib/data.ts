import { promises as fs } from 'fs';
import path from 'path';
import { ForumPost, Comment, AdminStats, Neighborhood } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Posts
export async function getPosts(options?: {
  includeDeleted?: boolean;
  filter?: 'recent' | 'needs-id' | Neighborhood;
  limit?: number;
  offset?: number;
}): Promise<ForumPost[]> {
  const posts = await readJsonFile<ForumPost[]>(POSTS_FILE, []);
  const comments = await readJsonFile<Comment[]>(COMMENTS_FILE, []);

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
  const posts = await readJsonFile<ForumPost[]>(POSTS_FILE, []);
  const post = posts.find(p => p.id === id);

  if (!post) return null;

  const comments = await readJsonFile<Comment[]>(COMMENTS_FILE, []);
  return {
    ...post,
    commentCount: comments.filter(c => c.postId === id && !c.isDeleted).length,
  };
}

export async function createPost(post: ForumPost): Promise<ForumPost> {
  const posts = await readJsonFile<ForumPost[]>(POSTS_FILE, []);
  posts.push(post);
  await writeJsonFile(POSTS_FILE, posts);
  return post;
}

export async function deletePost(id: string, adminId: string): Promise<boolean> {
  const posts = await readJsonFile<ForumPost[]>(POSTS_FILE, []);
  const index = posts.findIndex(p => p.id === id);

  if (index === -1) return false;

  posts[index] = {
    ...posts[index],
    isDeleted: true,
    deletedAt: new Date().toISOString(),
    deletedBy: adminId,
  };

  await writeJsonFile(POSTS_FILE, posts);
  return true;
}

// Comments
export async function getComments(postId: string, includeDeleted = false): Promise<Comment[]> {
  const comments = await readJsonFile<Comment[]>(COMMENTS_FILE, []);

  let filtered = comments.filter(c => c.postId === postId);
  if (!includeDeleted) {
    filtered = filtered.filter(c => !c.isDeleted);
  }

  return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function createComment(comment: Comment): Promise<Comment> {
  const comments = await readJsonFile<Comment[]>(COMMENTS_FILE, []);
  comments.push(comment);
  await writeJsonFile(COMMENTS_FILE, comments);
  return comment;
}

export async function deleteComment(id: string): Promise<boolean> {
  const comments = await readJsonFile<Comment[]>(COMMENTS_FILE, []);
  const index = comments.findIndex(c => c.id === id);

  if (index === -1) return false;

  comments[index] = {
    ...comments[index],
    isDeleted: true,
  };

  await writeJsonFile(COMMENTS_FILE, comments);
  return true;
}

// Admin Stats
export async function getAdminStats(): Promise<AdminStats> {
  const posts = await readJsonFile<ForumPost[]>(POSTS_FILE, []);
  const comments = await readJsonFile<Comment[]>(COMMENTS_FILE, []);

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
