import { getAdminFirestore, isFirebaseConfigured } from "./firebase-admin"
import { withTimeout, FIREBASE_READ_TIMEOUT_MS } from "./timeout"
import type { AboutPageContent } from "./types"
import { defaultAboutContent } from "./default-about-content"

const ABOUT_DOC = "about"

export async function hasAboutContent(): Promise<boolean> {
  try {
    if (!isFirebaseConfigured()) return false
    const db = getAdminFirestore()
    const doc = await db.collection("content").doc(ABOUT_DOC).get()
    return doc.exists
  } catch {
    return false
  }
}

async function fetchAboutContentFromFirebase(): Promise<AboutPageContent> {
  if (!isFirebaseConfigured()) return defaultAboutContent
  const db = getAdminFirestore()
  const doc = await db.collection("content").doc(ABOUT_DOC).get()
  if (!doc.exists) return defaultAboutContent
  const data = doc.data()
  if (!data) return defaultAboutContent
  const content = data as Omit<AboutPageContent, "updatedAt"> & { updatedAt: string }
  return {
    ...content,
    updatedAt: content.updatedAt ? new Date(content.updatedAt) : new Date(),
  } as AboutPageContent
}

export async function getAboutContent(): Promise<AboutPageContent> {
  try {
    return await withTimeout(
      fetchAboutContentFromFirebase(),
      FIREBASE_READ_TIMEOUT_MS,
      defaultAboutContent,
      "getAboutContent"
    )
  } catch (error) {
    console.error("Error fetching about content:", error)
    return defaultAboutContent
  }
}

export async function saveAboutContent(content: AboutPageContent): Promise<boolean> {
  try {
    if (!isFirebaseConfigured()) return false
    const db = getAdminFirestore()
    const payload = {
      ...content,
      updatedAt: content.updatedAt instanceof Date ? content.updatedAt.toISOString() : content.updatedAt,
    }
    await db.collection("content").doc(ABOUT_DOC).set(payload)
    return true
  } catch (error) {
    console.error("Error saving about content:", error)
    return false
  }
}
