import { type NextRequest, NextResponse } from "next/server"
import { getGalleryAlbumById, updateGalleryAlbum, deleteGalleryAlbum } from "@/lib/properties-store"
import type { GalleryAlbum } from "@/lib/types"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const album = await getGalleryAlbumById(id)
    
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 })
    }
    
    return NextResponse.json(album)
  } catch (error) {
    console.error("Error fetching album:", error)
    return NextResponse.json({ error: "Failed to fetch album" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates: Partial<GalleryAlbum> = await request.json()
    
    const success = await updateGalleryAlbum(id, updates)
    
    if (success) {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 })
  } catch (error) {
    console.error("Error updating album:", error)
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await deleteGalleryAlbum(id)
    
    if (success) {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 })
  } catch (error) {
    console.error("Error deleting album:", error)
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 })
  }
}
