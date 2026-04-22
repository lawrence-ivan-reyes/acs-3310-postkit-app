import { useState } from 'react'
import { PostList } from './components/PostList'
import { samplePosts } from './data/samplePosts'
import { filterByStatus, sortByDate, sortByTitle } from 'postkit-filter-sort'
import { SearchInput } from 'postkit-ui-component-library'
import type { Post, PostStatus } from './types'

// TODO: Replace with postkit-search-library when fixed (ESM/CJS mismatch)
function searchPosts(posts: Post[], query: string): Post[] {
  if (!query.trim()) return posts
  const q = query.toLowerCase()
  return posts.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.body.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  )
}

function App() {
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')

  let filteredPosts = [...samplePosts]
  filteredPosts = searchPosts(filteredPosts, searchQuery)
  if (statusFilter !== 'all') {
    filteredPosts = filterByStatus(filteredPosts, statusFilter)
  }
  filteredPosts = sortBy === 'date' 
    ? sortByDate(filteredPosts, sortDir) 
    : sortByTitle(filteredPosts, sortDir)

  return (
    <div className="max-w-3xl mx-auto p-5">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-900">PostKit</h1>
        <p className="mt-2 text-gray-500">A lightweight content publishing tool</p>
      </header>

      <main>
        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>

        <div className="flex flex-wrap gap-3 mb-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search posts..."
            debounceMs={300}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PostStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
          <button
            onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-50"
          >
            {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredPosts.length} of {samplePosts.length} posts
        </p>

        <PostList posts={filteredPosts} />
      </main>
    </div>
  )
}

export default App
