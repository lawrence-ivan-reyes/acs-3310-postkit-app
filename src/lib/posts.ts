// Post utilities - create, update, generate id

import type { Post, PostStatus } from '../types'

export function generateId(): string {
  return crypto.randomUUID()
}

export function createPost(data: {
  title: string
  body: string
  author: string
  tags?: string[]
  category?: string
  status?: PostStatus
}): Post {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: data.title,
    body: data.body,
    author: data.author,
    tags: data.tags ?? [],
    category: data.category ?? 'General',
    status: data.status ?? 'draft',
    createdAt: now,
    updatedAt: now,
  }
}

export function updatePost(post: Post, updates: Partial<Omit<Post, 'id' | 'createdAt'>>): Post {
  return {
    ...post,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
}
