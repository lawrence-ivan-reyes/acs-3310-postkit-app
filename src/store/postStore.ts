import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSlugFromTitle } from 'postkit-slug'
import type { Post } from '../types'
import { samplePosts } from '../data/samplePosts'

interface PostStore {
  posts: Post[]
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void
  updatePost: (id: string, updates: Partial<Omit<Post, 'id' | 'createdAt'>>) => void
  deletePost: (id: string) => void
  getPostBySlug: (slug: string) => Post | undefined
  importPosts: (posts: Post[]) => void
  getAllTags: () => string[]
}

export const usePostStore = create<PostStore>()(
  persist(
    (set, get) => ({
      posts: samplePosts,

      addPost: (postData) => {
        const now = new Date().toISOString()
        const newPost: Post = {
          ...postData,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ posts: [...state.posts, newPost] }))
      },

      updatePost: (id, updates) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? { ...post, ...updates, updatedAt: new Date().toISOString() }
              : post
          ),
        }))
      },

      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        }))
      },

      getPostBySlug: (slug) => {
        return get().posts.find((post) => createSlugFromTitle(post.title) === slug)
      },

      importPosts: (importedPosts) => {
        set((state) => {
          const merged = new Map(state.posts.map((p) => [p.id, p]))
          importedPosts.forEach((p) => merged.set(p.id, p))
          return { posts: [...merged.values()] }
        })
      },

      getAllTags: () => {
        return [...new Set(get().posts.flatMap((p) => p.tags))].sort()
      },
    }),
    {
      name: 'postkit-posts',
    }
  )
)
