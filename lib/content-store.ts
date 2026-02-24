import { getAdminFirestore } from "./firebase-admin"
import type { HomePageContent } from "./types"
import { defaultHomeContent } from "./default-content"

const CONTENT_DOC = "home"

export async function hasHomePageContent(): Promise<boolean> {
  try {
    const db = getAdminFirestore()
    const doc = await db.collection("content").doc(CONTENT_DOC).get()
    return doc.exists
  } catch {
    return false
  }
}

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    const db = getAdminFirestore()
    const doc = await db.collection("content").doc(CONTENT_DOC).get()

    if (!doc.exists) {
      return defaultHomeContent
    }

    const data = doc.data()
    if (!data) return defaultHomeContent

    const content = data as Omit<HomePageContent, "updatedAt"> & { updatedAt: string }
    return {
      ...content,
      updatedAt: content.updatedAt ? new Date(content.updatedAt) : new Date(),
    } as HomePageContent
  } catch (error) {
    console.error("Error fetching home content:", error)
    return defaultHomeContent
  }
}

export async function saveHomePageContent(content: HomePageContent): Promise<boolean> {
  try {
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
