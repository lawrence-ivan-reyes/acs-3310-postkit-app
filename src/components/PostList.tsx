import { Link } from 'react-router-dom'
import type { Post } from '../types'
import { formatRelativeDate } from 'postkit-date-status-display'
import { readingTime, formatTime } from 'postkit-reading-time'
import { createExcerpt } from 'postkit-excerpt'
import { createSlugFromTitle } from 'postkit-slug'
import { getTagColor } from '../constants'

const PAPERS = ['bg-yellow-50', 'bg-amber-50', 'bg-orange-50', 'bg-lime-50', 'bg-sky-50']
const TAPES = [
  { color: 'bg-amber-300/90', pos: '-top-3 left-6 -rotate-12' },
  { color: 'bg-sky-300/90', pos: '-top-3 right-8 rotate-6' },
  { color: 'bg-pink-300/90', pos: '-top-3 left-1/3 -rotate-6' },
  { color: 'bg-lime-300/90', pos: '-top-3 right-1/4 rotate-12' },
  { color: 'bg-purple-300/90', pos: '-top-3 left-10 rotate-3' },
]
const OFFSETS = ['ml-0', 'ml-8', 'ml-2', 'ml-12', 'ml-4']
const TILTS = ['-rotate-[0.5deg]', 'rotate-[0.8deg]', '-rotate-[0.3deg]', 'rotate-[0.5deg]', '-rotate-[1deg]']
const STATUS_LABELS: Record<string, { icon: string; text: string }> = {
  draft: { icon: '', text: 'todo' },
  review: { icon: '~', text: 'in progress' },
  published: { icon: '✓', text: 'done' },
}

export function PostList({ posts, allTags }: { posts: Post[]; allTags: string[] }) {
  if (!posts.length) return <div className="py-16 text-center"><p className="text-stone-500 italic">Nothing here yet...</p></div>

  return (
    <div className="p-8 rounded-xl" style={{ backgroundColor: '#b8956e', backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")` }}>
      <div className="space-y-6">
        {posts.map((post, i) => {
          const tape = TAPES[i % TAPES.length]
          const status = STATUS_LABELS[post.status]
          return (
            <Link key={post.id} to={`/posts/${createSlugFromTitle(post.title)}`}
              className={`${PAPERS[i % PAPERS.length]} ${OFFSETS[i % OFFSETS.length]} ${TILTS[i % TILTS.length]} relative block max-w-lg hover:shadow-lg transition-shadow duration-150`}
              style={{ boxShadow: '1px 2px 6px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)', backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e5e5e5 28px)' }}>
              
              <div className={`${tape.color} ${tape.pos} absolute w-14 h-5 rounded-sm`} style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
              
              {i % 3 === 0 && <div className="absolute bottom-0 right-0 w-8 h-8" style={{ background: 'linear-gradient(135deg, transparent 50%, #d4d4d4 50%, #e5e5e5 60%, #f5f5f5 100%)' }} />}
              
              <div className="p-5 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-stone-400 rounded-sm text-[10px]">{status.icon}</span>
                  <span className="text-xs text-stone-500 font-mono">{status.text}</span>
                </div>

                <h3 className="text-xl font-semibold text-stone-800 mb-1 leading-snug"><span className="border-b-2 border-stone-800">{post.title}</span></h3>
                <p className="text-[11px] text-stone-400 mb-3 italic">~{formatTime(readingTime(post.body))} read</p>
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">{createExcerpt(post.body, 100)}</p>
                
                {post.tags.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {post.tags.slice(0, 3).map(t => <span key={t} className={`${getTagColor(t, allTags).highlight} px-1.5 py-0.5 text-xs rounded`}>{t}</span>)}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
                  <span className="italic">— {post.author}</span>
                  <span>{formatRelativeDate(post.updatedAt)}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
