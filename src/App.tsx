import { Routes, Route } from 'react-router-dom'
import { PostListView } from './views/PostListView'
import { PostEditorView } from './views/PostEditorView'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<PostListView />} />
        <Route path="/posts/new" element={<PostEditorView />} />
        <Route path="/posts/:slug" element={<PostEditorView />} />
      </Routes>
    </div>
  )
}

export default App
