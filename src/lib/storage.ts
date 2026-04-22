// TODO: Replace with postkit-storage-lib when fixed
// Issue: Package published without compiled output (src/index.ts is empty, no dist/)
// Tracking: https://github.com/ddoherty145/postkit-storage-lib/issues

import type { Post } from '../types'

const STORAGE_KEY = 'postkit-posts'

export function savePosts(posts: Post[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export function loadPosts(): Post[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  try {
    return JSON.parse(data) as Post[]
  } catch {
    return []
  }
}

export function clearPosts(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function exportPosts(posts: Post[]): string {
  return JSON.stringify(posts, null, 2)
}

export function importPosts(json: string): Post[] {
  try {
    const data = JSON.parse(json)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
