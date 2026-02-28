import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"
import { getDownloadURL } from "firebase-admin/storage"
import { getAdminStorage } from "@/lib/firebase-admin"

const UPLOADS_DIR = "public/uploads"

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
}

/** Path segments to storage path (e.g. ["images", "123.jpg"] => "images/123.jpg") */
function toStoragePath(segments: string[]): string {
  return segments.filter(Boolean).join("/")
}

/**
 * Try to get a public or signed URL for a file in Firebase Storage.
 * Returns null if bucket not configured or file does not exist.
 */
async function getFirebaseUrl(storagePath: string): Promise<string | null> {
  try {
    const storage = getAdminStorage()
    const projectId = process.env.FIREBASE_PROJECT_ID
    const envBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    const bucketName =
      envBucket?.includes("firebasestorage.app") && projectId
        ? `${projectId}.appspot.com`
        : (envBucket ?? (projectId ? `${projectId}.appspot.com` : undefined))
    const bucket = bucketName ? storage.bucket(bucketName) : storage.bucket()
    const file = bucket.file(storagePath)

    const [exists] = await file.exists()
    if (!exists) return null

    try {
      return await getDownloadURL(file)
    } catch {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)
      const [signedUrl] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: expiresAt,
      })
      return signedUrl
    }
  } catch {
    return null
  }
}

/**
 * Serves uploaded files: first from public/uploads (local), then from Firebase Storage.
 * After deploy, local files are gone so we fall back to Firebase so existing /uploads/* URLs still work.
 * If not in Firebase either, redirect to placeholder so the UI does not show broken images.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params
    if (!pathSegments?.length) {
      return placeholderResponse()
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
      return placeholderResponse()
    }

    try {
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
      if (code === "ENOENT") {
        // File not on disk (e.g. after deploy). Try Firebase Storage so /uploads/* URLs still work.
        const storagePath = toStoragePath(safe)
        const firebaseUrl = await getFirebaseUrl(storagePath)
        if (firebaseUrl) {
          return NextResponse.redirect(firebaseUrl, 302)
        }
        return placeholderResponse()
      }
      console.error("Upload serve error:", err)
      return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
    }
  } catch (err) {
    console.error("Uploads route error:", err)
    return placeholderResponse()
  }
}

/** Minimal 1x1 transparent PNG so the UI does not show broken images. */
const PLACEHOLDER_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
)

function placeholderResponse(): NextResponse {
  return new NextResponse(PLACEHOLDER_PNG, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
