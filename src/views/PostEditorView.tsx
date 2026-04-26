import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePostStore } from '../store/postStore'
import { validateTitle, validateBody, validateStatus } from 'postkit-validation-library'
import { createSlugFromTitle } from 'postkit-slug'
import { createExcerpt } from 'postkit-excerpt'
import { readingTime, formatTime } from 'postkit-reading-time'
import { formatRelativeDate } from 'postkit-date-status-display'
import { STATUS_STYLES } from '../constants'
import type { PostStatus } from '../types'

export function PostEditorView() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { getPostBySlug, addPost, updatePost, deletePost } = usePostStore()

  const existingPost = slug ? getPostBySlug(slug) : undefined
  const isEditing = !!existingPost

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<PostStatus>('draft')
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title)
      setBody(existingPost.body)
      setAuthor(existingPost.author)
      setTags(existingPost.tags.join(', '))
      setCategory(existingPost.category)
      setStatus(existingPost.status)
    }
  }, [existingPost])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    const postData = {
      title: title.trim(), body: body.trim(), author: author.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      category: category.trim() || 'General', status,
    }
    const issues = [...validateTitle(postData.title).issues, ...validateBody(postData.body).issues, ...validateStatus(postData.status).issues]
    if (issues.length) { setErrors(issues.map((i: { message: string }) => i.message)); return }
    isEditing && existingPost ? updatePost(existingPost.id, postData) : addPost(postData)
    navigate('/')
  }

  const handleDelete = () => { if (existingPost && confirm('Delete this post?')) { deletePost(existingPost.id); navigate('/') } }

  const previewSlug = title.trim() ? createSlugFromTitle(title) : '...'
  const previewExcerpt = body.trim() ? createExcerpt(body, 80) : '...'
  const previewReadTime = body.trim() ? formatTime(readingTime(body)) : '...'
  const previewDate = existingPost ? formatRelativeDate(existingPost.updatedAt) : 'Now'

  const inputClass = "w-full px-4 py-2.5 bg-white border-2 border-stone-800 rounded-lg focus:outline-none focus:border-teal-600"

  return (
    <div className="min-h-screen bg-amber-50 pb-12">
      <header className="bg-teal-800 text-white px-6 py-6 mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-amber-400 font-semibold hover:underline">← Back</Link>
          <h1 className="text-2xl italic">{isEditing ? 'Edit Post' : 'New Post'}</h1>
          <button type="submit" form="post-form" className="bg-amber-400 text-teal-900 font-bold px-5 py-2 rounded-lg border-2 border-teal-900 shadow-[2px_2px_0_#134e4a] hover:shadow-[3px_3px_0_#134e4a] transition-all">
            {isEditing ? 'Save' : 'Publish'}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6">
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-xl">
            <p className="text-red-700 font-bold mb-1">Fix these errors:</p>
            {errors.map((e, i) => <p key={i} className="text-red-600 text-sm">{e}</p>)}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <form id="post-form" onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
            <div className="bg-white border-2 border-stone-800 rounded-xl p-6 shadow-[4px_4px_0_#d6d3d1]">
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full text-3xl text-stone-800 bg-transparent placeholder-stone-400 focus:outline-none mb-4 italic" placeholder="Your title..." />
              <div className="h-px bg-stone-200 mb-4" />
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={14} className="w-full bg-transparent placeholder-stone-400 focus:outline-none resize-none text-stone-600 leading-relaxed" placeholder="Start writing..." />
            </div>

            <div className="bg-amber-100 border-2 border-stone-800 rounded-xl p-6 shadow-[4px_4px_0_#d6d3d1] space-y-4">
              <h3 className="font-bold text-stone-800">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-stone-600 text-sm font-medium block mb-1">Author</label>
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className={inputClass} placeholder="Your name" />
                </div>
                <div>
                  <label className="text-stone-600 text-sm font-medium block mb-1">Category</label>
                  <input type="text" value={category} onChange={e => setCategory(e.target.value)} className={inputClass} placeholder="General" />
                </div>
              </div>
              <div>
                <label className="text-stone-600 text-sm font-medium block mb-1">Tags</label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} className={inputClass} placeholder="Comma separated" />
              </div>
              <div>
                <label className="text-stone-600 text-sm font-medium block mb-2">Status</label>
                <div className="flex gap-2">
                  {(['draft', 'review', 'published'] as PostStatus[]).map(s => (
                    <button key={s} type="button" onClick={() => setStatus(s)} className={`px-4 py-2 font-semibold rounded-lg border-2 border-stone-800 transition-all ${status === s ? STATUS_STYLES[s] : 'bg-white'}`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isEditing && <button type="button" onClick={handleDelete} className="text-red-500 font-semibold text-sm hover:underline">Delete this post</button>}
          </form>

          <aside className="bg-teal-600 border-2 border-stone-800 rounded-xl p-5 h-fit text-white shadow-[4px_4px_0_#d6d3d1]">
            <h3 className="font-bold mb-4 italic">Preview</h3>
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-xs font-bold uppercase block mb-1">Slug</span>
                <p className="font-mono text-sm bg-white/20 px-3 py-2 rounded break-all">/{previewSlug}</p>
              </div>
              <div>
                <span className="text-white/60 text-xs font-bold uppercase block mb-1">Excerpt</span>
                <p className="text-sm leading-relaxed">{previewExcerpt}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <span className="text-white/60 text-xs block">Read</span>
                  <p className="font-bold">{previewReadTime}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <span className="text-white/60 text-xs block">Updated</span>
                  <p className="font-bold">{previewDate}</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <span className="text-white/60 text-xs block mb-1">Status</span>
                <span className={`inline-block ${STATUS_STYLES[status]} font-bold text-sm px-3 py-1 rounded capitalize`}>{status}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
