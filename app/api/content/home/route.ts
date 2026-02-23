import { type NextRequest, NextResponse } from "next/server"
import { put, list, del } from "@vercel/blob"
import { defaultHomeContent } from "@/lib/default-content"

const CONTENT_FILE = "content/home-page.json"

async function getContentFromBlob() {
  try {
    const { blobs } = await list({ prefix: "content/" })
    const contentBlob = blobs.find((b) => b.pathname === CONTENT_FILE)
    
    if (contentBlob) {
      const response = await fetch(contentBlob.url)
      const content = await response.json()
      return { content, url: contentBlob.url }
    }
    return null
  } catch (error) {
    console.error("Error fetching content from blob:", error)
    return null
  }
}

async function saveContentToBlob(content: typeof defaultHomeContent) {
  try {
    // First, try to delete existing blob if it exists
    const existing = await getContentFromBlob()
    if (existing?.url) {
      try {
        await del(existing.url)
      } catch (e) {
        // Ignore deletion errors
        console.log("Could not delete existing blob:", e)
      }
    }
    
    // Now create the new blob
    const blob = await put(CONTENT_FILE, JSON.stringify(content, null, 2), {
      access: "public",
      contentType: "application/json",
    })
    return blob
  } catch (error) {
    console.error("Error saving content to blob:", error)
    throw error
  }
}

export async function GET() {
  try {
    const result = await getContentFromBlob()
    
    if (result?.content) {
      return NextResponse.json(result.content)
    }
    
    // Return default content if nothing in blob
    return NextResponse.json(defaultHomeContent)
  } catch (error) {
    console.error("Error fetching home content:", error)
    return NextResponse.json(defaultHomeContent)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updatedContent = {
      ...body,
      updatedAt: new Date().toISOString(),
    }
    
    await saveContentToBlob(updatedContent)
    
    return NextResponse.json({ success: true, content: updatedContent })
  } catch (error) {
    console.error("Error updating home content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

// Initialize content with default data
export async function POST() {
  try {
    const existing = await getContentFromBlob()
    
    if (existing?.content) {
      return NextResponse.json({ 
        message: "Content already exists", 
        content: existing.content 
      })
    }
    
    await saveContentToBlob(defaultHomeContent)
    
    return NextResponse.json({ 
      success: true, 
      message: "Content initialized",
      content: defaultHomeContent 
    })
  } catch (error) {
    console.error("Error initializing content:", error)
    return NextResponse.json({ error: "Failed to initialize content" }, { status: 500 })
  }
}
