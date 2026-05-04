# Test Targets for PostKit

## T1: Status Filter Pipeline (High Priority)

**Behaviour:** clicking the 'Draft' filter button shows only draft posts in the list

**Setup:** store contains two posts: one with status 'draft', one with status 'published'

**Action:** render PostListView, click the button labeled 'Draft'

**Assert:**
- The draft post title appears in the document
- The published post title does NOT appear in the document

**Failure this catches:** filter button not connected to store, wrong status passed to filterByStatus, filterByStatus bug

---

## T2: Sort by Title

**Behavior:** clicking the 'A-Z' sort button sorts posts alphabetically by title

**Setup:** store contains posts with titles "Zebra Post" and "Alpha Post"

**Action:** render PostListView, click the button labeled 'A-Z'

**Assert:**
- "Alpha Post" appears before "Zebra Post" in the document
- Clicking 'A-Z' again reverses the order (Zebra before Alpha)

**Failure this catches:** sortByTitle not called, wrong sort direction, sort not connected to state

---

## T3: Search Filters Posts

**Behavior:** typing in the search input filters posts by title match

**Setup:** store contains posts with titles "React Hooks Guide" and "Vue Basics"

**Action:** render PostListView, type "React" in the search input

**Assert:**
- "React Hooks Guide" appears in the document
- "Vue Basics" does NOT appear in the document

**Failure this catches:** search input not connected, searchPosts function bug, filter pipeline not applied

---

## T4: Add Post to Store

**Behavior:** addPost creates a new post with generated id and timestamps

**Setup:** store is empty (cleared)

**Action:** call addPost with title, body, author, tags, category, status

**Assert:**
- Store now contains one post
- Post has the correct title
- Post has a non-empty id
- Post has createdAt and updatedAt timestamps

**Failure this catches:** addPost not adding to store, missing id generation, missing timestamps

---

## T5: Delete Post from Store

**Behavior:** deletePost removes a post from the store

**Setup:** store contains one post with known id

**Action:** call deletePost with that id

**Assert:**
- Store is now empty
- The post with that id no longer exists

**Failure this catches:** deletePost not filtering correctly, wrong id comparison

---

## T6: Get Post by Slug

**Behavior:** getPostBySlug returns the correct post when slug matches

**Setup:** store contains a post with title "My Test Post" (slug: "my-test-post")

**Action:** call getPostBySlug("my-test-post")

**Assert:**
- Returns the post with title "My Test Post"
- Returns undefined for non-existent slug

**Failure this catches:** slug generation mismatch, find logic bug
