import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getHomePageContent, saveHomePageContent, hasHomePageContent } from "@/lib/content-store"
import { defaultHomeContent } from "@/lib/default-content"

export async function GET() {
  try {
    const content = await getHomePageContent()
    return NextResponse.json(content ?? defaultHomeContent)
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
    await saveHomePageContent(updatedContent as Parameters<typeof saveHomePageContent>[0])
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, content: updatedContent })
  } catch (error) {
    console.error("Error updating home content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

export async function POST() {
  try {
    if (await hasHomePageContent()) {
      const existing = await getHomePageContent()
      return NextResponse.json({
        message: "Content already exists",
        content: existing,
      })
    }
    await saveHomePageContent(defaultHomeContent)
    return NextResponse.json({
      success: true,
      message: "Content initialized",
      content: defaultHomeContent,
    })
  } catch (error) {
    console.error("Error initializing content:", error)
    return NextResponse.json({ error: "Failed to initialize content" }, { status: 500 })
  }
}
