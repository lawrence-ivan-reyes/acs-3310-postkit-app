import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { usePostStore } from '../store/postStore'
import { makePost, resetPostCounter } from '../test/factories'

vi.mock('postkit-date-status-display', () => ({
  formatRelativeDate: (date: string) => 'recently',
}))

vi.mock('postkit-reading-time', () => ({
  readingTime: () => 1,
  formatTime: () => '1 min',
}))

vi.mock('postkit-excerpt', () => ({
  createExcerpt: (text: string) => text.slice(0, 50),
}))

import { PostListView } from './PostListView'

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <PostListView />
    </MemoryRouter>
  )
}

describe('PostListView', () => {
  beforeEach(() => {
    resetPostCounter()
    usePostStore.setState({ posts: [] })
  })

  describe('status filter', () => {
    it('clicking Draft filter shows only draft posts', async () => {
      const user = userEvent.setup()
      
      usePostStore.setState({
        posts: [
          makePost({ title: 'Draft Post', status: 'draft' }),
          makePost({ title: 'Published Post', status: 'published' }),
        ],
      })

      renderWithRouter()

      expect(screen.getByText('Draft Post')).toBeInTheDocument()
      expect(screen.getByText('Published Post')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Draft' }))

      expect(screen.getByText('Draft Post')).toBeInTheDocument()
      expect(screen.queryByText('Published Post')).not.toBeInTheDocument()
    })

    it('clicking Published filter shows only published posts', async () => {
      const user = userEvent.setup()
      
      usePostStore.setState({
        posts: [
          makePost({ title: 'Draft Post', status: 'draft' }),
          makePost({ title: 'Live Post', status: 'published' }),
        ],
      })

      renderWithRouter()

      await user.click(screen.getByRole('button', { name: 'Published' }))

      expect(screen.queryByText('Draft Post')).not.toBeInTheDocument()
      expect(screen.getByText('Live Post')).toBeInTheDocument()
    })
  })

  describe('sort', () => {
    it('clicking A-Z sorts posts alphabetically by title', async () => {
      const user = userEvent.setup()
      
      usePostStore.setState({
        posts: [
          makePost({ title: 'Zebra Post' }),
          makePost({ title: 'Alpha Post' }),
        ],
      })

      renderWithRouter()

      await user.click(screen.getByRole('button', { name: /A-Z/i }))

      const postTitles = screen.getAllByRole('heading', { level: 3 })
      const titleTexts = postTitles.map(h => h.textContent)
      
      expect(titleTexts.indexOf('Alpha Post')).toBeLessThan(titleTexts.indexOf('Zebra Post'))
    })
  })

  describe('search', () => {
    it('typing in search filters posts by title', async () => {
      const user = userEvent.setup()
      
      usePostStore.setState({
        posts: [
          makePost({ title: 'React Hooks Guide', body: 'Learn about hooks' }),
          makePost({ title: 'Vue Basics', body: 'Vue fundamentals' }),
        ],
      })

      renderWithRouter()

      expect(screen.getByText('React Hooks Guide')).toBeInTheDocument()
      expect(screen.getByText('Vue Basics')).toBeInTheDocument()

      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, 'React')

      await waitFor(() => {
        expect(screen.queryByText('Vue Basics')).not.toBeInTheDocument()
      })
      expect(screen.getByText('React Hooks Guide')).toBeInTheDocument()
    })
  })

  describe('post count display', () => {
    it('shows correct post count after filtering', async () => {
      const user = userEvent.setup()
      
      usePostStore.setState({
        posts: [
          makePost({ status: 'draft' }),
          makePost({ status: 'draft' }),
          makePost({ status: 'published' }),
        ],
      })

      renderWithRouter()

      expect(screen.getByText('3 posts')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Draft' }))

      expect(screen.getByText('2 posts')).toBeInTheDocument()
    })
  })
})
