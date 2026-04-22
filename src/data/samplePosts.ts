import type { Post } from '../types'

// Sample hardcoded posts for testing
export const samplePosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with PostKit',
    body: 'PostKit is a lightweight content publishing tool for writers who manage multiple posts in different states of completion. This guide will walk you through the basics of creating and managing your posts. You can write, organize, and move posts through a workflow from draft to published.',
    author: 'Ivan',
    tags: ['tutorial', 'getting-started'],
    category: 'Documentation',
    status: 'published',
    createdAt: '2026-04-15T10:00:00Z',
    updatedAt: '2026-04-18T14:30:00Z',
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    body: 'In this post, we explore TypeScript best practices for building maintainable applications. Topics include proper typing, avoiding any, using interfaces vs types, and leveraging the type system to catch bugs at compile time rather than runtime.',
    author: 'Ivan',
    tags: ['typescript', 'programming'],
    category: 'Development',
    status: 'draft',
    createdAt: '2026-04-19T09:00:00Z',
    updatedAt: '2026-04-19T09:00:00Z',
  },
  {
    id: '3',
    title: 'Building React Components',
    body: 'React components are the building blocks of any React application. Learn how to create reusable, composable components that follow best practices. We will cover functional components, hooks, props, and state management patterns.',
    author: 'Ivan',
    tags: ['react', 'javascript', 'components'],
    category: 'Development',
    status: 'review',
    createdAt: '2026-04-17T16:00:00Z',
    updatedAt: '2026-04-19T08:00:00Z',
  },
]
