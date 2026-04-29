import { Link } from 'react-router-dom'
import type { Post } from '../types'
import { formatRelativeDate } from 'postkit-date-status-display'
import { readingTime, formatTime } from 'postkit-reading-time'
import { createExcerpt } from 'postkit-excerpt'
import { createSlugFromTitle } from 'postkit-slug'
import { getTagColor } from '../constants'

const PAPER = 'bg-amber-50'
const TAPES = [
  { color: 'from-amber-200 to-amber-300', pos: '-top-3 left-6 -rotate-12' },
  { color: 'from-sky-200 to-sky-300', pos: '-top-3 right-8 rotate-6' },
  { color: 'from-pink-200 to-pink-300', pos: '-top-3 left-1/3 -rotate-6' },
  { color: 'from-lime-200 to-lime-300', pos: '-top-3 right-1/4 rotate-12' },
  { color: 'from-violet-200 to-violet-300', pos: '-top-3 left-10 rotate-3' },
]
const OFFSETS = ['ml-0', 'ml-6', 'ml-2', 'ml-10', 'ml-4']
const TILTS = ['-rotate-[0.7deg]', 'rotate-[0.5deg]', '-rotate-[0.3deg]', 'rotate-[0.8deg]', '-rotate-[0.5deg]']
const STATUS = { draft: { icon: '○', color: 'text-stone-400' }, review: { icon: '◐', color: 'text-amber-500' }, published: { icon: '●', color: 'text-emerald-500' } }

export function PostList({ posts, allTags }: { posts: Post[]; allTags: string[] }) {
  if (!posts.length) return <div className="py-16 text-center"><p className="text-stone-400 italic">Nothing pinned yet...</p></div>

  return (
    <div className="p-8 rounded-2xl bg-gradient-to-b from-[#c4a176] to-[#a68856] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_8px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.2)]">
      <div className="space-y-7">
        {posts.map((post, i) => {
          const tape = TAPES[i % TAPES.length]
          const s = STATUS[post.status]
          return (
            <Link key={post.id} to={`/posts/${createSlugFromTitle(post.title)}`}
              className={`${PAPER} ${OFFSETS[i % OFFSETS.length]} ${TILTS[i % TILTS.length]} relative block max-w-lg rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.1),2px_4px_8px_rgba(100,70,40,0.12)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12),2px_6px_16px_rgba(100,70,40,0.15)] transition-shadow`}
              style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 26px, rgba(200,200,200,0.3) 26px, rgba(200,200,200,0.3) 27px)' }}>
              <div className={`${tape.pos} absolute w-16 h-6 bg-gradient-to-b ${tape.color} rounded-sm opacity-90 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_3px_rgba(0,0,0,0.15)]`} />
              <div className="p-5 pt-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-sm ${s.color}`}>{s.icon}</span>
                  <span className="text-[11px] text-stone-400 font-medium tracking-wide uppercase">{post.status === 'review' ? 'in review' : post.status}</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-1 leading-snug">
                  <span className="border-b-2 border-stone-700">{post.title}</span>
                </h3>
                <p className="text-[11px] text-stone-400 mb-3 italic">~{formatTime(readingTime(post.body))} read</p>
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">{createExcerpt(post.body, 100)}</p>
                {post.tags.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {post.tags.slice(0, 3).map(t => <span key={t} className={`${getTagColor(t, allTags).highlight} px-2 py-0.5 text-xs font-medium rounded`}>{t}</span>)}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-200/50">
                  <span className="font-medium text-stone-500">— {post.author}</span>
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
