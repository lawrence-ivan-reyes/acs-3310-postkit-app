import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePostStore } from '../store/postStore'
import { PostList } from '../components/PostList'
import { filterByStatus, sortByDate, sortByTitle } from 'postkit-filter-sort'
import { SearchInput } from 'postkit-ui-component-library'
import { TAG_COLORS, getStatusCounts } from '../constants'
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
  return posts.filter(post => selectedTags.some(tag => post.tags.includes(tag)))
}

const PANEL = "bg-white border-2 border-stone-800 rounded-xl p-4 shadow-[3px_3px_0_#d6d3d1]"

export function PostListView() {
  const { posts, getAllTags, importPosts } = usePostStore()
  const allTags = getAllTags()
  const counts = getStatusCounts(posts)

  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')

  let filteredPosts = searchPosts([...posts], searchQuery)
  if (statusFilter !== 'all') filteredPosts = filterByStatus(filteredPosts, statusFilter)
  filteredPosts = filterByTags(filteredPosts, selectedTags)
  filteredPosts = sortBy === 'date' ? sortByDate(filteredPosts, sortDir) : sortByTitle(filteredPosts, sortDir)

  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  const handleExport = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' }))
    Object.assign(document.createElement('a'), { href: url, download: 'postkit-export.json' }).click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = Object.assign(document.createElement('input'), { type: 'file', accept: '.json' })
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try { importPosts(JSON.parse(await file.text()) as Post[]) }
        catch { alert('Failed to import: Invalid JSON file') }
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <header className="bg-teal-800 text-white px-6 py-8 mb-8">
        <div className="max-w-6xl mx-auto flex items-end justify-between">
          <div>
            <span className="bg-amber-400 text-teal-900 text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded mb-2 inline-block">Content Management</span>
            <h1 className="text-5xl italic">PostKit</h1>
          </div>
          <Link to="/posts/new" className="bg-amber-400 text-teal-900 font-bold px-5 py-2.5 rounded-lg border-2 border-teal-900 shadow-[3px_3px_0_#134e4a] hover:shadow-[1px_1px_0_#134e4a] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
            + New Post
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 flex gap-6">
        <aside className="w-64 flex-shrink-0 space-y-4">
          <div className={PANEL}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Overview</h3>
            {(['draft', 'review', 'published'] as const).map(s => (
              <div key={s} className="flex justify-between items-center mb-1 last:mb-0">
                <span className="text-stone-600 capitalize">{s === 'review' ? 'In Review' : s}</span>
                <span className={`font-bold px-2 py-0.5 rounded text-sm ${s === 'draft' ? 'bg-stone-200 text-stone-700' : s === 'review' ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'}`}>{counts[s]}</span>
              </div>
            ))}
          </div>

          <div className={PANEL}>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search..." debounceMs={300} />
          </div>

          <div className="bg-amber-100 border-2 border-stone-800 rounded-xl p-4 shadow-[3px_3px_0_#d6d3d1]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Status</h3>
            {(['all', 'draft', 'review', 'published'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`block w-full px-3 py-1.5 text-left text-sm font-medium rounded-lg mb-1 last:mb-0 transition-colors ${statusFilter === s ? 'bg-stone-800 text-white' : 'hover:bg-amber-200'}`}>
                {s === 'all' ? 'All Posts' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className={PANEL}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Sort</h3>
            <div className="flex gap-2">
              {[{ key: 'date', label: 'Date' }, { key: 'title', label: 'A-Z' }].map(({ key, label }) => (
                <button key={key} onClick={() => { if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortBy(key as 'date'|'title'); setSortDir(key === 'date' ? 'desc' : 'asc') }}}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg border-2 border-stone-800 transition-colors ${sortBy === key ? 'bg-stone-800 text-white' : 'bg-white hover:bg-stone-100'}`}>
                  {label} {sortBy === key && (sortDir === 'desc' ? '↓' : '↑')}
                </button>
              ))}
            </div>
          </div>

          {allTags.length > 0 && (
            <div className={PANEL}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag, i) => {
                  const c = TAG_COLORS[i % TAG_COLORS.length]
                  const sel = selectedTags.includes(tag)
                  return <button key={tag} onClick={() => toggleTag(tag)} className={`px-2 py-0.5 text-xs font-semibold rounded-full border-2 transition-colors ${sel ? c.active : c.base + ' bg-white hover:opacity-70'}`}>{tag}</button>
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={handleImport} className="flex-1 px-3 py-2 text-sm font-medium text-stone-600 bg-white border-2 border-stone-300 rounded-lg hover:border-stone-800 transition-colors">Import</button>
            <button onClick={handleExport} className="flex-1 px-3 py-2 text-sm font-medium text-stone-600 bg-white border-2 border-stone-300 rounded-lg hover:border-stone-800 transition-colors">Export</button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl italic text-stone-800">{statusFilter === 'all' ? 'All Posts' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</h2>
            <span className="text-sm text-stone-500">{filteredPosts.length} posts</span>
          </div>
          <PostList posts={filteredPosts} allTags={allTags} />
        </main>
      </div>
    </div>
  )
}
