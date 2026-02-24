import { type NextRequest, NextResponse } from "next/server"
import { getAboutContent, saveAboutContent } from "@/lib/about-store"
import { defaultAboutContent } from "@/lib/default-about-content"
import type { AboutPageContent } from "@/lib/types"

export async function GET() {
  try {
    const content = await getAboutContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error("Error fetching about content:", error)
    return NextResponse.json(defaultAboutContent)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updatedContent: AboutPageContent = {
      ...body,
      updatedAt: new Date(),
    }
    const ok = await saveAboutContent(updatedContent)
    if (!ok) return NextResponse.json({ error: "Failed to save" }, { status: 500 })
    return NextResponse.json({ success: true, content: updatedContent })
  } catch (error) {
    console.error("Error updating about content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
