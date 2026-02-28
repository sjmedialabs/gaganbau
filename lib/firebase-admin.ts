import { getApps, initializeApp, cert, type App } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

/** Project ID: server env first, then public (from your .env Firebase config). */
function getProjectId(): string | undefined {
  return (
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    undefined
  )
}

/** Storage bucket: server env first, then public. */
export function getFirebaseStorageBucket(): string | undefined {
  return (
    process.env.FIREBASE_STORAGE_BUCKET?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
    undefined
  )
}

/** Use this to avoid calling Firebase when env is missing (e.g. prevents 500 on Edge or bad deploy). */
export function isFirebaseConfigured(): boolean {
  const projectId = getProjectId()
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim()
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim()
  if (!projectId || !clientEmail || !privateKey) return false
  if (privateKey.includes("YOUR_PRIVATE_KEY_HERE") || privateKey.includes("PRIVATE_KEY")) return false
  return true
}

function getAdminApp(): App {
  const existing = getApps()[0]
  if (existing) return existing as App

  const projectId = getProjectId()
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim()
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim()

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin config. In .env set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (from Firebase Console → Project Settings → Service Accounts → JSON). Project ID can be FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID."
    )
  }

  // Normalize private key: strip surrounding quotes, fix newlines from .env (literal \n → real newline)
  let parsedKey = privateKey
  if (parsedKey.startsWith('"') && parsedKey.endsWith('"')) {
    parsedKey = parsedKey.slice(1, -1)
  }
  parsedKey = parsedKey.replace(/\\n/g, "\n")

  if (parsedKey.includes("YOUR_PRIVATE_KEY_HERE") || parsedKey.includes("PRIVATE_KEY")) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY is still a placeholder. Use the real private_key value from the service account JSON."
    )
  }

  const storageBucket = getFirebaseStorageBucket()

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: parsedKey,
    }),
    ...(storageBucket && { storageBucket }),
  })
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp())
}

export function getAdminStorage() {
  return getStorage(getAdminApp())
}
