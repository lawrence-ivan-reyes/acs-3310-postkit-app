import { Link } from 'react-router-dom'
import type { Post } from '../types'
import { formatRelativeDate } from 'postkit-date-status-display'
import { readingTime, formatTime } from 'postkit-reading-time'
import { createExcerpt } from 'postkit-excerpt'
import { createSlugFromTitle } from 'postkit-slug'

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  review: 'bg-amber-100 text-amber-700',
  published: 'bg-green-100 text-green-700',
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  review: 'In Review',
  published: 'Published',
}

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-500">No posts yet. Create your first one!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => {
        const slug = createSlugFromTitle(post.title)
        const initial = post.author.charAt(0).toUpperCase()
        
        return (
          <Link
            key={post.id}
            to={`/posts/${slug}`}
            className="block bg-white rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shrink-0">
                {initial}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{post.author}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400 text-sm">{formatRelativeDate(post.updatedAt)}</span>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[post.status]}`}>
                    {statusLabels[post.status]}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{createExcerpt(post.body, 120)}</p>
                
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                  <span>{formatTime(readingTime(post.body))} read</span>
                  {post.tags.length > 0 && (
                    <div className="flex gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-purple-500">#{tag}</span>
                      ))}
                      {post.tags.length > 3 && <span>+{post.tags.length - 3}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
