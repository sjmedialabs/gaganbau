import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getBlogDoc, saveBlogDoc } from "@/lib/blog-store"
import type { BlogPost, BlogPageHero } from "@/lib/types"

export async function GET() {
  try {
    const doc = await getBlogDoc()
    return NextResponse.json(doc)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ posts: [], hero: null }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updates: { posts?: BlogPost[]; hero?: BlogPageHero } = {}
    if (Array.isArray(body.posts)) {
      updates.posts = body.posts as BlogPost[]
    }
    if (body.hero && typeof body.hero === "object" && typeof body.hero.tagline === "string") {
      updates.hero = body.hero as BlogPageHero
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Invalid payload: provide posts and/or hero" }, { status: 400 })
    }
    await saveBlogDoc(updates)
    revalidatePath('/blog')
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving blog:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
