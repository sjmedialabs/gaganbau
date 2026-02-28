import { getApps, initializeApp, cert, type App } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

/** Use this to avoid calling Firebase when env is missing (e.g. prevents 500 on Edge or bad deploy). */
export function isFirebaseConfigured(): boolean {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (!projectId || !clientEmail || !privateKey) return false
  if (privateKey.includes("YOUR_PRIVATE_KEY_HERE") || privateKey.includes("PRIVATE_KEY")) return false
  return true
}

function getAdminApp(): App {
  const existing = getApps()[0]
  if (existing) return existing as App

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin config. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env"
    )
  }

  // Normalize private key: trim, strip surrounding quotes, fix newlines from .env
  let parsedKey = privateKey.trim()
  if (parsedKey.startsWith('"') && parsedKey.endsWith('"')) {
    parsedKey = parsedKey.slice(1, -1)
  }
  parsedKey = parsedKey.replace(/\\n/g, "\n")

  if (parsedKey.includes("YOUR_PRIVATE_KEY_HERE") || parsedKey.includes("PRIVATE_KEY")) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY is still the placeholder. Replace it with the real private key from Firebase Console → Project Settings → Service Accounts → Generate new private key (download JSON and copy the 'private_key' value)."
    )
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: parsedKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || undefined,
  })
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp())
}

export function getAdminStorage() {
  return getStorage(getAdminApp())
}
