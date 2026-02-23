import { type NextRequest, NextResponse } from "next/server"
import { getPropertyById, updateProperty, deleteProperty } from "@/lib/properties-store"
import type { Property } from "@/lib/types"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const property = await getPropertyById(id)
    
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }
    
    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates: Partial<Property> = await request.json()
    
    const success = await updateProperty(id, updates)
    
    if (success) {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await deleteProperty(id)
    
    if (success) {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
  }
}
