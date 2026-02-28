import { getAdminFirestore, isFirebaseConfigured } from "./firebase-admin"
import { withTimeout, FIREBASE_READ_TIMEOUT_MS } from "./timeout"
import type { BlogPost, BlogPageHero } from "./types"
import { defaultBlogPosts } from "./default-blog-posts"
import { defaultBlogHero } from "./default-blog-hero"

const BLOG_DOC = "blog"
const CONTENT_COLLECTION = "content"
const defaultBlogDoc = { posts: [...defaultBlogPosts], hero: defaultBlogHero }

export { defaultBlogHero }

export type BlogDoc = {
  posts: BlogPost[]
  hero?: BlogPageHero
  updatedAt?: string
}

async function fetchBlogDocFromFirebase(): Promise<BlogDoc> {
  if (!isFirebaseConfigured()) return defaultBlogDoc
  const db = getAdminFirestore()
  const snap = await db.collection(CONTENT_COLLECTION).doc(BLOG_DOC).get()
  if (!snap.exists) return defaultBlogDoc
  const data = snap.data() as BlogDoc | undefined
  const posts = Array.isArray(data?.posts) ? data.posts : [...defaultBlogPosts]
  const hero: BlogPageHero = data?.hero && typeof data.hero.tagline === "string"
    ? data.hero as BlogPageHero
    : defaultBlogHero
  return { posts, hero }
}

export async function getBlogDoc(): Promise<BlogDoc> {
  try {
    return await withTimeout(
      fetchBlogDocFromFirebase(),
      FIREBASE_READ_TIMEOUT_MS,
      defaultBlogDoc,
      "getBlogDoc"
    )
  } catch (error) {
    console.error("Error fetching blog doc:", error)
    return defaultBlogDoc
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const doc = await getBlogDoc()
  return doc.posts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!slug || typeof slug !== "string") return null
  const posts = await getBlogPosts()
  const normalized = slug.trim().toLowerCase()
  return posts.find((p) => p.slug?.trim().toLowerCase() === normalized) ?? null
}

export async function getBlogPageHero(): Promise<BlogPageHero> {
  const doc = await getBlogDoc()
  return doc.hero ?? defaultBlogHero
}

export async function saveBlogDoc(updates: Partial<BlogDoc>): Promise<boolean> {
  try {
    if (!isFirebaseConfigured()) return false
    const db = getAdminFirestore()
    const current = await getBlogDoc()
    const payload: BlogDoc = {
      posts: updates.posts ?? current.posts,
      hero: updates.hero ?? current.hero,
      updatedAt: new Date().toISOString(),
    }
    await db.collection(CONTENT_COLLECTION).doc(BLOG_DOC).set(payload)
    return true
  } catch (error) {
    console.error("Error saving blog doc:", error)
    return false
  }
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<boolean> {
  return saveBlogDoc({ posts })
}

export async function saveBlogPageHero(hero: BlogPageHero): Promise<boolean> {
  return saveBlogDoc({ hero })
}
