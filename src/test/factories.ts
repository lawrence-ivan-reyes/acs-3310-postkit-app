import type { Post } from '../types'

let counter = 0

export function makePost(overrides: Partial<Post> = {}): Post {
  counter++
  const status = overrides.status ?? 'draft'
  const now = new Date().toISOString()
  return {
    id: `post-${counter}`,
    title: `Test Post ${counter}`,
    body: 'Body text.',
    author: 'Test Author',
    tags: ['test'],
    category: 'General',
    status,
    createdAt: now,
    updatedAt: now,
    publishedAt: status === 'published' ? now : null,
    ...overrides,
  }
}

export function resetPostCounter() {
  counter = 0
}
