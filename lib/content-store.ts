import { list, put, del } from "@vercel/blob"
import type { HomePageContent } from "./types"
import { defaultHomeContent } from "./default-content"

const CONTENT_FILE = "content/home-page.json"

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    let blobs: Awaited<ReturnType<typeof list>>["blobs"]
    try {
      const result = await list({ prefix: "content/" })
      blobs = result.blobs
    } catch {
      // Blob store unavailable (blocked, misconfigured, etc.) - use defaults
      return defaultHomeContent
    }

    const contentBlob = blobs.find((b) => b.pathname === CONTENT_FILE)
    if (!contentBlob) {
      return defaultHomeContent
    }

    // Use downloadUrl (token-authenticated) instead of url (public, can be blocked)
    const fetchUrl = contentBlob.downloadUrl || contentBlob.url
    const response = await fetch(fetchUrl, { cache: "no-store" })
    if (!response.ok) {
      return defaultHomeContent
    }

    const content = await response.json()
    return content as HomePageContent
  } catch (error) {
    console.error("Error fetching home content:", error)
    return defaultHomeContent
  }
}

export async function saveHomePageContent(content: HomePageContent): Promise<boolean> {
  try {
    // Delete existing blob first to avoid conflicts
    try {
      const { blobs } = await list({ prefix: "content/" })
      const existingBlob = blobs.find((b) => b.pathname === CONTENT_FILE)
      if (existingBlob) {
        await del(existingBlob.url)
      }
    } catch {
      // Ignore list/deletion errors - store may be temporarily unavailable
    }
    
    // Save new content
    await put(CONTENT_FILE, JSON.stringify(content, null, 2), {
      access: "public",
      contentType: "application/json",
    })
    return true
  } catch (error) {
    console.error("Error saving home content:", error)
    return false
  }
}

export async function initializeContent(): Promise<HomePageContent> {
  // Check if content exists
  const existing = await getHomePageContent()
  if (existing) {
    return existing
  }

  // Save default content
  await saveHomePageContent(defaultHomeContent)
  return defaultHomeContent
}
