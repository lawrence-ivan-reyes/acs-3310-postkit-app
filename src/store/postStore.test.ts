import { describe, it, expect, beforeEach } from 'vitest'
import { usePostStore } from './postStore'
import { makePost, resetPostCounter } from '../test/factories'

describe('postStore', () => {
  beforeEach(() => {
    resetPostCounter()
    usePostStore.setState({ posts: [] })
  })

  describe('addPost', () => {
    it('creates a new post with generated id and timestamps', () => {
      const { addPost, posts } = usePostStore.getState()
      
      addPost({
        title: 'New Post',
        body: 'Post body content',
        author: 'Test Author',
        tags: ['react', 'testing'],
        category: 'Tech',
        status: 'draft',
      })

      const updatedPosts = usePostStore.getState().posts
      expect(updatedPosts).toHaveLength(1)
      
      const post = updatedPosts[0]
      expect(post.title).toBe('New Post')
      expect(post.id).toBeTruthy()
      expect(post.createdAt).toBeTruthy()
      expect(post.updatedAt).toBeTruthy()
    })
  })

  describe('deletePost', () => {
    it('removes a post from the store', () => {
      const testPost = makePost({ title: 'To Delete' })
      usePostStore.setState({ posts: [testPost] })
      
      expect(usePostStore.getState().posts).toHaveLength(1)
      
      usePostStore.getState().deletePost(testPost.id)
      
      expect(usePostStore.getState().posts).toHaveLength(0)
    })
  })

  describe('getPostBySlug', () => {
    it('returns the correct post when slug matches', () => {
      const testPost = makePost({ title: 'My Test Post' })
      usePostStore.setState({ posts: [testPost] })
      
      const found = usePostStore.getState().getPostBySlug('my-test-post')
      
      expect(found).toBeDefined()
      expect(found?.title).toBe('My Test Post')
    })

    it('returns undefined for non-existent slug', () => {
      const testPost = makePost({ title: 'My Test Post' })
      usePostStore.setState({ posts: [testPost] })
      
      const found = usePostStore.getState().getPostBySlug('does-not-exist')
      
      expect(found).toBeUndefined()
    })
  })

  describe('getAllTags', () => {
    it('returns unique sorted tags from all posts', () => {
      usePostStore.setState({
        posts: [
          makePost({ tags: ['react', 'testing'] }),
          makePost({ tags: ['testing', 'vitest'] }),
        ],
      })

      const tags = usePostStore.getState().getAllTags()
      
      expect(tags).toEqual(['react', 'testing', 'vitest'])
    })
  })

  describe('publishedAt', () => {
    it('sets publishedAt when creating a post with published status', () => {
      usePostStore.getState().addPost({
        title: 'Published Post',
        body: 'Content',
        author: 'Author',
        tags: [],
        category: 'General',
        status: 'published',
      })

      const post = usePostStore.getState().posts[0]
      expect(post.publishedAt).toBeTruthy()
      expect(post.publishedAt).toBe(post.createdAt)
    })

    it('sets publishedAt to null when creating a draft post', () => {
      usePostStore.getState().addPost({
        title: 'Draft Post',
        body: 'Content',
        author: 'Author',
        tags: [],
        category: 'General',
        status: 'draft',
      })

      const post = usePostStore.getState().posts[0]
      expect(post.publishedAt).toBeNull()
    })

    it('sets publishedAt when updating a draft to published', () => {
      const draftPost = makePost({ status: 'draft', publishedAt: null })
      usePostStore.setState({ posts: [draftPost] })

      usePostStore.getState().updatePost(draftPost.id, { status: 'published' })

      const updatedPost = usePostStore.getState().posts[0]
      expect(updatedPost.publishedAt).toBeTruthy()
      expect(updatedPost.status).toBe('published')
    })

    it('preserves publishedAt when updating a published post', () => {
      const originalPublishedAt = '2026-01-01T00:00:00Z'
      const publishedPost = makePost({ status: 'published', publishedAt: originalPublishedAt })
      usePostStore.setState({ posts: [publishedPost] })

      usePostStore.getState().updatePost(publishedPost.id, { title: 'Updated Title' })

      const updatedPost = usePostStore.getState().posts[0]
      expect(updatedPost.publishedAt).toBe(originalPublishedAt)
    })
  })
})
