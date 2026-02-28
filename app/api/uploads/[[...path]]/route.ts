import { type NextRequest, NextResponse } from "next/server"
import path from "path"

/** Use Node.js runtime so fs and firebase-admin are available (Edge would 500). */
export const runtime = "nodejs"

const UPLOADS_DIR = "public/uploads"

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
}

/** Minimal 1x1 transparent PNG - defined early so we never need to throw. */
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

/** Path segments to storage path (e.g. ["images", "123.jpg"] => "images/123.jpg") */
function toStoragePath(segments: string[]): string {
  return segments.filter(Boolean).join("/")
}

/**
 * Try to get a public or signed URL for a file in Firebase Storage.
 * Returns null if bucket not configured, file does not exist, or any error (never throws).
 */
async function getFirebaseUrl(storagePath: string): Promise<string | null> {
  try {
    const { getDownloadURL } = await import("firebase-admin/storage")
    const { getAdminStorage } = await import("@/lib/firebase-admin")
    const storage = getAdminStorage()
    const bucket = storage.bucket()
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

/** Try to read file from local disk. Returns null if not found or any error (never throws). */
async function readLocalFile(root: string, segments: string[]): Promise<{ buffer: Buffer; ext: string } | null> {
  try {
    const { readFile } = await import("fs/promises")
    const filePath = path.join(root, ...segments)
    const resolved = path.resolve(filePath)
    const rootResolved = path.resolve(root)
    if (!resolved.startsWith(rootResolved)) return null
    const buffer = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    return { buffer, ext }
  } catch {
    return null
  }
}

/**
 * Serves uploaded files: first from public/uploads (local), then from Firebase Storage.
 * After deploy, local files are gone so we fall back to Firebase. Never returns 500.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params
    if (!pathSegments?.length) {
      return placeholderResponse()
    }

    const safe = pathSegments.filter((p) => p && !p.includes(".."))
    if (safe.length !== pathSegments.length) {
      return placeholderResponse()
    }

    const root = path.join(process.cwd(), UPLOADS_DIR)
    const resolved = path.resolve(path.join(root, ...safe))
    if (!resolved.startsWith(path.resolve(root))) {
      return placeholderResponse()
    }

    const local = await readLocalFile(root, safe)
    if (local) {
      const contentType = CONTENT_TYPES[local.ext] ?? "application/octet-stream"
      return new NextResponse(local.buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      })
    }

    const storagePath = toStoragePath(safe)
    const firebaseUrl = await getFirebaseUrl(storagePath)
    if (firebaseUrl) {
      return NextResponse.redirect(firebaseUrl, 302)
    }

    return placeholderResponse()
  } catch {
    return placeholderResponse()
  }
}
