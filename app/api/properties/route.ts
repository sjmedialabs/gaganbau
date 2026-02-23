import { type NextRequest, NextResponse } from "next/server"
import {
  getAllProperties,
  getPropertiesByCategory,
  createProperty,
  getPropertiesContent,
  savePropertiesContent,
} from "@/lib/properties-store"
import type { Property, PropertyCategory } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") as PropertyCategory | null

    if (category) {
      const properties = await getPropertiesByCategory(category)
      return NextResponse.json({ properties })
    }

    const properties = await getAllProperties()
    return NextResponse.json({ properties })
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ properties: [], error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const property: Property = await request.json()
    
    // Validate required fields
    if (!property.slug || !property.projectName || !property.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Set timestamps
    property.createdAt = new Date()
    property.updatedAt = new Date()
    property.id = `property-${Date.now()}`

    const success = await createProperty(property)
    
    if (success) {
      return NextResponse.json({ success: true, property })
    }
    
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { properties } = await request.json()
    
    const content = await getPropertiesContent()
    content.properties = properties
    content.updatedAt = new Date()
    
    const success = await savePropertiesContent(content)
    
    if (success) {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: "Failed to update properties" }, { status: 500 })
  } catch (error) {
    console.error("Error updating properties:", error)
    return NextResponse.json({ error: "Failed to update properties" }, { status: 500 })
  }
}
