import { type NextRequest, NextResponse } from "next/server"
import {
  getAllGalleryAlbums,
  createGalleryAlbum,
  getPropertiesContent,
  savePropertiesContent,
} from "@/lib/properties-store"
import type { GalleryAlbum } from "@/lib/types"

export async function GET() {
  try {
    const albums = await getAllGalleryAlbums()
    return NextResponse.json({ albums })
  } catch (error) {
    console.error("Error fetching gallery albums:", error)
    return NextResponse.json({ albums: [], error: "Failed to fetch gallery albums" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const album: GalleryAlbum = await request.json()
    
    if (!album.propertyName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    album.id = `album-${Date.now()}`
    album.createdAt = new Date()
    album.updatedAt = new Date()

    const success = await createGalleryAlbum(album)
    
    if (success) {
      return NextResponse.json({ success: true, album })
    }
    
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 })
  } catch (error) {
    console.error("Error creating album:", error)
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { galleryAlbums } = await request.json()
    
    const content = await getPropertiesContent()
    content.galleryAlbums = galleryAlbums
    content.updatedAt = new Date()
    
    const success = await savePropertiesContent(content)
    
    if (success) {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: "Failed to update gallery" }, { status: 500 })
  } catch (error) {
    console.error("Error updating gallery:", error)
    return NextResponse.json({ error: "Failed to update gallery" }, { status: 500 })
  }
}
