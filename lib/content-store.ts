import { getAdminFirestore, isFirebaseConfigured } from "./firebase-admin"
import { withTimeout, FIREBASE_READ_TIMEOUT_MS } from "./timeout"
import type { HomePageContent } from "./types"
import { defaultHomeContent } from "./default-content"

const CONTENT_DOC = "home"

/** Ensure blog section exists (migrate from legacy "press" if needed). */
function ensureBlogSection(content: Record<string, unknown>): HomePageContent["blog"] {
  const blog = content.blog as HomePageContent["blog"] | undefined
  if (blog && typeof blog.label === "string" && typeof blog.title === "string" && typeof blog.viewAllLink === "string") {
    return blog
  }
  const press = content.press as { label?: string; title?: string; viewAllLink?: string } | undefined
  if (press) {
    return {
      label: press.label ?? "Blog",
      title: press.title ?? defaultHomeContent.blog.title,
      viewAllLink: "/blog",
    }
  }
  return defaultHomeContent.blog
}

/** Ensure navbar has Contact (no Career) and footer Quick Links includes Career. */
function normalizeHomeContent(content: HomePageContent): HomePageContent {
  const nav = content.header?.navigation ?? []
  const hasContact = nav.some((item) => item.href === "/contact")
  const navFiltered = nav.filter((item) => item.href !== "/career")
  const navigation = hasContact
    ? navFiltered
    : [...navFiltered, { label: "Contact", href: "/contact" }]

  const columns = content.footer?.columns ?? []
  const quickLinksIndex = columns.findIndex((c) =>
    (c.title?.toLowerCase() ?? "").includes("quick")
  )
  let newColumns = [...columns]
  if (quickLinksIndex >= 0) {
    const quick = newColumns[quickLinksIndex]
    const hasCareer = quick.links?.some((l) => l.href === "/career")
    const links = hasCareer
      ? quick.links
      : [...(quick.links ?? []), { label: "Career", href: "/career" }]
    newColumns = newColumns.map((col, i) =>
      i === quickLinksIndex ? { ...col, links } : col
    )
  }

  return {
    ...content,
    header: { ...content.header, navigation },
    footer: { ...content.footer, columns: newColumns },
  }
}

export async function hasHomePageContent(): Promise<boolean> {
  try {
    if (!isFirebaseConfigured()) return false
    const db = getAdminFirestore()
    const doc = await db.collection("content").doc(CONTENT_DOC).get()
    return doc.exists
  } catch {
    return false
  }
}

async function fetchHomeContentFromFirebase(): Promise<HomePageContent> {
  if (!isFirebaseConfigured()) return normalizeHomeContent(defaultHomeContent)
  const db = getAdminFirestore()
  const doc = await db.collection("content").doc(CONTENT_DOC).get()
  if (!doc.exists) return normalizeHomeContent(defaultHomeContent)
  const data = doc.data()
  if (!data) return normalizeHomeContent(defaultHomeContent)
  const raw = data as Record<string, unknown>
  const content = {
    ...raw,
    blog: ensureBlogSection(raw),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt as string) : new Date(),
  } as HomePageContent
  return normalizeHomeContent(content)
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const defaultResult = normalizeHomeContent(defaultHomeContent)
  try {
    return await withTimeout(
      fetchHomeContentFromFirebase(),
      FIREBASE_READ_TIMEOUT_MS,
      defaultResult,
      "getHomePageContent"
    )
  } catch (error) {
    console.error("Error fetching home content:", error)
    return defaultResult
  }
}

export async function saveHomePageContent(content: HomePageContent): Promise<boolean> {
  try {
    if (!isFirebaseConfigured()) return false
    const db = getAdminFirestore()
    const payload = {
      ...content,
      updatedAt: content.updatedAt instanceof Date ? content.updatedAt.toISOString() : content.updatedAt,
    }
    await db.collection("content").doc(CONTENT_DOC).set(payload)
    return true
  } catch (error) {
    console.error("Error saving home content:", error)
    return false
  }
}

export async function initializeContent(): Promise<HomePageContent> {
  if (await hasHomePageContent()) {
    return getHomePageContent()
  }
  await saveHomePageContent(defaultHomeContent)
  return defaultHomeContent
}
