import { type NextRequest, NextResponse } from "next/server"
import { getAdminStorage } from "@/lib/firebase-admin"

function pathFromFirebaseStorageUrl(url: string): string | null {
  try {
    const match = url.match(/\/o\/(.+?)(\?|$)/)
    if (!match) return null
    return decodeURIComponent(match[1])
  } catch {
    return null
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, path: pathParam } = body as { url?: string; path?: string }

    const path = pathParam ?? (url ? pathFromFirebaseStorageUrl(url) : null)
    if (!path) {
      return NextResponse.json(
        { error: "Provide 'url' (Firebase Storage URL) or 'path' (storage path) to delete." },
        { status: 400 }
      )
    }
    const storage = getAdminStorage()
    const bucket = storage.bucket()
    const file = bucket.file(path)
    await file.delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
