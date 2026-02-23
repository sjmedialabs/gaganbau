import { list, put, del } from "@vercel/blob"
import type { PropertiesContent, Property, GalleryAlbum } from "./types"

const PROPERTIES_FILE = "content/properties.json"

const defaultPropertiesContent: PropertiesContent = {
  properties: [],
  galleryAlbums: [],
  updatedAt: new Date(),
}

export async function getPropertiesContent(): Promise<PropertiesContent> {
  try {
    let blobs: Awaited<ReturnType<typeof list>>["blobs"]
    try {
      const result = await list({ prefix: "content/" })
      blobs = result.blobs
    } catch {
      // Blob store unavailable (blocked, misconfigured, etc.) - use defaults
      return defaultPropertiesContent
    }

    const contentBlob = blobs.find((b) => b.pathname === PROPERTIES_FILE)
    if (!contentBlob) {
      return defaultPropertiesContent
    }

    // Use downloadUrl (token-authenticated) instead of url (public, can be blocked)
    const fetchUrl = contentBlob.downloadUrl || contentBlob.url
    const response = await fetch(fetchUrl, { cache: "no-store" })
    if (!response.ok) {
      return defaultPropertiesContent
    }

    const content = await response.json()
    return content as PropertiesContent
  } catch (error) {
    console.error("Error fetching properties content:", error)
    return defaultPropertiesContent
  }
}

export async function savePropertiesContent(content: PropertiesContent): Promise<boolean> {
  try {
    try {
      const { blobs } = await list({ prefix: "content/" })
      const existingBlob = blobs.find((b) => b.pathname === PROPERTIES_FILE)
      if (existingBlob) {
        await del(existingBlob.url)
      }
    } catch {
      // Ignore list/deletion errors - store may be temporarily unavailable
    }
    
    await put(PROPERTIES_FILE, JSON.stringify(content, null, 2), {
      access: "public",
      contentType: "application/json",
    })
    return true
  } catch (error) {
    console.error("Error saving properties content:", error)
    return false
  }
}

// Property CRUD operations
export async function getAllProperties(): Promise<Property[]> {
  const content = await getPropertiesContent()
  return content.properties.sort((a, b) => a.order - b.order)
}

export async function getPropertiesByCategory(category: Property["category"]): Promise<Property[]> {
  const properties = await getAllProperties()
  return properties.filter((p) => p.category === category && p.isActive)
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const properties = await getAllProperties()
  return properties.find((p) => p.slug === slug) || null
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const properties = await getAllProperties()
  return properties.find((p) => p.id === id) || null
}

export async function createProperty(property: Property): Promise<boolean> {
  const content = await getPropertiesContent()
  content.properties.push(property)
  content.updatedAt = new Date()
  return savePropertiesContent(content)
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<boolean> {
  const content = await getPropertiesContent()
  const index = content.properties.findIndex((p) => p.id === id)
  if (index === -1) return false
  
  content.properties[index] = { ...content.properties[index], ...updates, updatedAt: new Date() }
  content.updatedAt = new Date()
  return savePropertiesContent(content)
}

export async function deleteProperty(id: string): Promise<boolean> {
  const content = await getPropertiesContent()
  content.properties = content.properties.filter((p) => p.id !== id)
  content.updatedAt = new Date()
  return savePropertiesContent(content)
}

// Gallery CRUD operations
export async function getAllGalleryAlbums(): Promise<GalleryAlbum[]> {
  const content = await getPropertiesContent()
  return content.galleryAlbums.sort((a, b) => a.order - b.order)
}

export async function getGalleryAlbumById(id: string): Promise<GalleryAlbum | null> {
  const content = await getPropertiesContent()
  return content.galleryAlbums.find((a) => a.id === id) || null
}

export async function getGalleryAlbumByPropertyId(propertyId: string): Promise<GalleryAlbum | null> {
  const content = await getPropertiesContent()
  return content.galleryAlbums.find((a) => a.propertyId === propertyId) || null
}

export async function createGalleryAlbum(album: GalleryAlbum): Promise<boolean> {
  const content = await getPropertiesContent()
  content.galleryAlbums.push(album)
  content.updatedAt = new Date()
  return savePropertiesContent(content)
}

export async function updateGalleryAlbum(id: string, updates: Partial<GalleryAlbum>): Promise<boolean> {
  const content = await getPropertiesContent()
  const index = content.galleryAlbums.findIndex((a) => a.id === id)
  if (index === -1) return false
  
  content.galleryAlbums[index] = { ...content.galleryAlbums[index], ...updates, updatedAt: new Date() }
  content.updatedAt = new Date()
  return savePropertiesContent(content)
}

export async function deleteGalleryAlbum(id: string): Promise<boolean> {
  const content = await getPropertiesContent()
  content.galleryAlbums = content.galleryAlbums.filter((a) => a.id !== id)
  content.updatedAt = new Date()
  return savePropertiesContent(content)
}
