import type { Post } from '../types'
import { formatRelativeDate, statusToLabel, statusToColor } from 'postkit-date-status-display'
import { readingTime, formatTime } from 'postkit-reading-time'
import { createExcerpt } from 'postkit-excerpt'
import { createSlugFromTitle } from 'postkit-slug'

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-center text-gray-500 py-10">No posts yet.</p>
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <span
              className="px-2 py-1 rounded-full text-xs font-semibold text-white uppercase"
              style={{ backgroundColor: statusToColor(post.status) ?? 'gray' }}
            >
              {statusToLabel(post.status)}
            </span>
          </div>

          <p className="text-gray-400 text-sm font-mono mb-2">/{createSlugFromTitle(post.title)}</p>
          <p className="text-gray-600 mb-3">{createExcerpt(post.body, 150)}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
            <span>By {post.author}</span>
            <span>{formatTime(readingTime(post.body))} read</span>
            <span>Updated {formatRelativeDate(post.updatedAt)}</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
