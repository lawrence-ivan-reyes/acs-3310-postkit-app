import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePostStore } from '../store/postStore'
import { validateTitle, validateBody, validateStatus } from 'postkit-validation-library'
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
      title: title.trim(),
      body: body.trim(),
      author: author.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      category: category.trim() || 'General',
      status,
    }

    const titleValidation = validateTitle(postData.title)
    const bodyValidation = validateBody(postData.body)
    const statusValidation = validateStatus(postData.status)
    
    const allIssues = [
      ...titleValidation.issues,
      ...bodyValidation.issues,
      ...statusValidation.issues,
    ]
    
    if (allIssues.length > 0) {
      setErrors(allIssues.map((issue: { message: string }) => issue.message))
      return
    }

    if (isEditing && existingPost) {
      updatePost(existingPost.id, postData)
    } else {
      addPost(postData)
    }

    navigate('/')
  }

  const handleDelete = () => {
    if (existingPost && confirm('Delete this post?')) {
      deletePost(existingPost.id)
      navigate('/')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      <header className="flex items-center justify-between py-4 border-b border-gray-100">
        <Link to="/" className="text-gray-400 hover:text-gray-600">
          ← Back
        </Link>
        <h1 className="font-semibold text-gray-900">
          {isEditing ? 'Edit' : 'New Post'}
        </h1>
        <button
          type="submit"
          form="post-form"
          className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:opacity-90"
        >
          {isEditing ? 'Save' : 'Post'}
        </button>
      </header>

      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 rounded-xl text-red-600 text-sm">
          {errors.map((error, i) => (
            <div key={i}>• {error}</div>
          ))}
        </div>
      )}

      <form id="post-form" onSubmit={handleSubmit} className="py-4 space-y-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shrink-0">
            {author.charAt(0).toUpperCase() || '?'}
          </div>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="flex-1 text-sm border-none bg-transparent placeholder-gray-400 focus:outline-none"
            placeholder="Your name"
          />
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-semibold border-none bg-transparent placeholder-gray-300 focus:outline-none"
          placeholder="Title"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className="w-full border-none bg-transparent placeholder-gray-300 focus:outline-none resize-none"
          placeholder="What's on your mind?"
        />

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm w-16">Tags</span>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="flex-1 text-sm border-none bg-gray-50 rounded-lg px-3 py-2 focus:outline-none focus:bg-gray-100"
              placeholder="react, tutorial, tips"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm w-16">Category</span>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 text-sm border-none bg-gray-50 rounded-lg px-3 py-2 focus:outline-none focus:bg-gray-100"
              placeholder="General"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm w-16">Status</span>
            <div className="flex gap-2">
              {(['draft', 'review', 'published'] as PostStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    status === s
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-500 text-sm hover:text-red-600"
            >
              Delete post
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
