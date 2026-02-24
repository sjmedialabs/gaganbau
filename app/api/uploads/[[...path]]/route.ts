import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

const UPLOADS_DIR = "public/uploads"

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
}

/**
 * Serves uploaded files from public/uploads. Used on VPS so that uploads are
 * served by the same process that wrote them (avoids static file / cwd issues).
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params
    if (!pathSegments?.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Prevent path traversal
    const safe = pathSegments.filter((p) => p && !p.includes(".."))
    if (safe.length !== pathSegments.length) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 })
    }

    const root = path.join(process.cwd(), UPLOADS_DIR)
    const filePath = path.join(root, ...safe)

    // Ensure resolved path is still under root
    const resolved = path.resolve(filePath)
    if (!resolved.startsWith(path.resolve(root))) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const buffer = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream"

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code
    if (code === "ENOENT") return NextResponse.json({ error: "Not found" }, { status: 404 })
    console.error("Upload serve error:", err)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}
