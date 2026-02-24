import { type NextRequest, NextResponse } from "next/server"
import { getDownloadURL } from "firebase-admin/storage"
import { getAdminStorage } from "@/lib/firebase-admin"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const MAX_FILE_SIZES: Record<string, number> = {
  image: 5 * 1024 * 1024,
  logo: 2 * 1024 * 1024,
  gallery: 10 * 1024 * 1024,
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]

const UPLOADS_DIR = "public/uploads"

async function saveToLocal(buffer: Buffer, filePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), UPLOADS_DIR, filePath)
  await mkdir(path.dirname(fullPath), { recursive: true })
  await writeFile(fullPath, buffer)
  // public/ is served from root, so URL is /uploads/...
  return `/uploads/${filePath}`.replace(/\/+/g, "/")
}

function isBucketNotFound(error: unknown): boolean {
  const err = error as { code?: number; message?: string; error?: { code?: number } }
  return (
    err?.code === 404 ||
    err?.error?.code === 404 ||
    (typeof err?.message === "string" && err.message.includes("bucket does not exist"))
  )
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "images"
    const maxSizeType = (formData.get("maxSizeType") as string) || "image"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG" },
        { status: 400 }
      )
    }

    const maxSize = MAX_FILE_SIZES[maxSizeType] ?? MAX_FILE_SIZES.image
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSizeMB}MB` },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "")
    const filePath = `${folder}/${timestamp}-${sanitizedName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const useLocalOnly = process.env.UPLOAD_USE_LOCAL === "true"

    if (!useLocalOnly) {
      try {
        const storage = getAdminStorage()
        const projectId = process.env.FIREBASE_PROJECT_ID
        const envBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        const bucketName =
          envBucket?.includes("firebasestorage.app") && projectId
            ? `${projectId}.appspot.com`
            : (envBucket ?? (projectId ? `${projectId}.appspot.com` : undefined))
        const bucket = bucketName ? storage.bucket(bucketName) : storage.bucket()
        const storageFile = bucket.file(filePath)

        await storageFile.save(buffer, { metadata: { contentType: file.type } })

        let url: string
        try {
          url = await getDownloadURL(storageFile)
        } catch {
          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + 7)
          const [signedUrl] = await storageFile.getSignedUrl({
            version: "v4",
            action: "read",
            expires: expiresAt,
          })
          url = signedUrl
        }

        return NextResponse.json({
          url,
          path: filePath,
          filename: file.name,
          size: file.size,
          type: file.type,
        })
      } catch (firebaseError) {
        if (isBucketNotFound(firebaseError)) {
          console.warn(
            "Firebase Storage bucket not found (enable Storage in Firebase Console). Using local uploads."
          )
          const url = await saveToLocal(buffer, filePath)
          return NextResponse.json({
            url,
            path: filePath,
            filename: file.name,
            size: file.size,
            type: file.type,
          })
        }
        throw firebaseError
      }
    }

    const url = await saveToLocal(buffer, filePath)
    return NextResponse.json({
      url,
      path: filePath,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed", details: message },
      { status: 500 }
    )
  }
}
