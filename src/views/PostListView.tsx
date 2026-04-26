import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePostStore } from '../store/postStore'
import { PostList } from '../components/PostList'
import { filterByStatus, sortByDate, sortByTitle } from 'postkit-filter-sort'
import { SearchInput } from 'postkit-ui-component-library'
import type { Post, PostStatus } from '../types'

function searchPosts(posts: Post[], query: string): Post[] {
  if (!query.trim()) return posts
  const q = query.toLowerCase()
  return posts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.body.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  )
}

function filterByTags(posts: Post[], selectedTags: string[]): Post[] {
  if (selectedTags.length === 0) return posts
  return posts.filter(post =>
    selectedTags.some(tag => post.tags.includes(tag))
  )
}

export function PostListView() {
  const { posts, getAllTags, importPosts } = usePostStore()
  const allTags = getAllTags()

  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')

  let filteredPosts = [...posts]
  filteredPosts = searchPosts(filteredPosts, searchQuery)
  if (statusFilter !== 'all') {
    filteredPosts = filterByStatus(filteredPosts, statusFilter)
  }
  filteredPosts = filterByTags(filteredPosts, selectedTags)
  filteredPosts = sortBy === 'date'
    ? sortByDate(filteredPosts, sortDir)
    : sortByTitle(filteredPosts, sortDir)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'postkit-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const data = JSON.parse(text) as Post[]
        importPosts(data)
      } catch (err) {
        alert('Failed to import: Invalid JSON file')
      }
    }
    input.click()
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      <header className="sticky top-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 pt-6 pb-4 -mx-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            PostKit
          </h1>
          <Link
            to="/posts/new"
            className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl hover:opacity-90"
          >
            +
          </Link>
        </div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search posts..."
          debounceMs={300}
        />

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {['all', 'draft', 'review', 'published'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as PostStatus | 'all')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          <div className="border-l border-gray-200 mx-1" />
          <button
            onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 rounded-full text-sm bg-white text-gray-600 border border-gray-200"
          >
            {sortBy === 'date' ? (sortDir === 'desc' ? 'Newest' : 'Oldest') : (sortDir === 'asc' ? 'A→Z' : 'Z→A')}
          </button>
          <button
            onClick={() => setSortBy(s => s === 'date' ? 'title' : 'date')}
            className="px-3 py-1 rounded-full text-sm bg-white text-gray-600 border border-gray-200"
          >
            {sortBy === 'date' ? '📅' : '🔤'}
          </button>
        </div>

        {allTags.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-0.5 rounded-full text-sm whitespace-nowrap ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-400 hover:text-purple-500'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="py-4">
        <PostList posts={filteredPosts} />
      </main>

      <footer className="sticky bottom-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-3 -mx-4 px-4 border-t border-gray-100">
        <div className="flex justify-center gap-4 text-sm">
          <button onClick={handleImport} className="text-gray-500 hover:text-purple-500">
            Import
          </button>
          <button onClick={handleExport} className="text-gray-500 hover:text-purple-500">
            Export
          </button>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">{posts.length} posts</span>
        </div>
      </footer>
    </div>
  )
}
