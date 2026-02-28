import { getAdminFirestore, isFirebaseConfigured } from "./firebase-admin"
import { withTimeout, FIREBASE_READ_TIMEOUT_MS } from "./timeout"
import type { PropertiesContent, Property, GalleryAlbum } from "./types"

const PROPERTIES_DOC = "properties"

const defaultPropertiesContent: PropertiesContent = {
  properties: [],
  galleryAlbums: [],
  updatedAt: new Date(),
}

function parsePropertiesContent(data: Record<string, unknown> | null): PropertiesContent {
  if (!data || typeof data !== "object") return defaultPropertiesContent

  const updatedAt = data.updatedAt
  const properties = Array.isArray(data.properties) ? data.properties : []
  const galleryAlbums = Array.isArray(data.galleryAlbums) ? data.galleryAlbums : []

  return {
    properties: properties.map((p: Record<string, unknown>) => ({
      ...p,
      createdAt: p.createdAt ? new Date(p.createdAt as string) : new Date(),
      updatedAt: p.updatedAt ? new Date(p.updatedAt as string) : new Date(),
    })) as Property[],
    galleryAlbums: galleryAlbums.map((a: Record<string, unknown>) => ({
      ...a,
      createdAt: a.createdAt ? new Date(a.createdAt as string) : new Date(),
      updatedAt: a.updatedAt ? new Date(a.updatedAt as string) : new Date(),
    })) as GalleryAlbum[],
    updatedAt: updatedAt ? new Date(updatedAt as string) : new Date(),
  }
}

function serializeForFirestore(content: PropertiesContent): Record<string, unknown> {
  return {
    properties: content.properties.map((p) => ({
      ...p,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    })),
    galleryAlbums: content.galleryAlbums.map((a) => ({
      ...a,
      createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
      updatedAt: a.updatedAt instanceof Date ? a.updatedAt.toISOString() : a.updatedAt,
    })),
    updatedAt: content.updatedAt instanceof Date ? content.updatedAt.toISOString() : content.updatedAt,
  }
}

async function fetchPropertiesContentFromFirebase(): Promise<PropertiesContent> {
  if (!isFirebaseConfigured()) return defaultPropertiesContent
  const db = getAdminFirestore()
  const doc = await db.collection("content").doc(PROPERTIES_DOC).get()
  if (!doc.exists) return defaultPropertiesContent
  return parsePropertiesContent(doc.data() as Record<string, unknown>)
}

export async function getPropertiesContent(): Promise<PropertiesContent> {
  try {
    return await withTimeout(
      fetchPropertiesContentFromFirebase(),
      FIREBASE_READ_TIMEOUT_MS,
      defaultPropertiesContent,
      "getPropertiesContent"
    )
  } catch (error) {
    console.error("Error fetching properties content:", error)
    return defaultPropertiesContent
  }
}

export async function savePropertiesContent(content: PropertiesContent): Promise<boolean> {
  try {
    if (!isFirebaseConfigured()) return false
    const db = getAdminFirestore()
    await db.collection("content").doc(PROPERTIES_DOC).set(serializeForFirestore(content))
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
