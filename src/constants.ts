export const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-stone-500 text-white',
  review: 'bg-amber-500 text-white',
  published: 'bg-emerald-600 text-white',
}

export const TAG_COLORS = [
  { base: 'border-amber-700 text-amber-700', active: 'bg-amber-700 text-white border-amber-700', highlight: 'bg-amber-200 text-amber-800' },
  { base: 'border-teal-700 text-teal-700', active: 'bg-teal-700 text-white border-teal-700', highlight: 'bg-teal-200 text-teal-800' },
  { base: 'border-purple-700 text-purple-700', active: 'bg-purple-700 text-white border-purple-700', highlight: 'bg-purple-200 text-purple-800' },
  { base: 'border-sky-700 text-sky-700', active: 'bg-sky-700 text-white border-sky-700', highlight: 'bg-sky-200 text-sky-800' },
  { base: 'border-rose-600 text-rose-600', active: 'bg-rose-600 text-white border-rose-600', highlight: 'bg-rose-200 text-rose-800' },
]

export function getTagColor(tag: string, allTags: string[]) {
  const index = allTags.indexOf(tag)
  return TAG_COLORS[index === -1 ? 0 : index % TAG_COLORS.length]
}

export function getStatusCounts(posts: { status: string }[]) {
  return posts.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1
      return acc
    },
    { draft: 0, review: 0, published: 0 } as Record<string, number>
  )
}
