/**
 * Upload environment helpers. Used by the upload API to ensure production
 * always uses Firebase Storage so images persist across deploys.
 * Tested by __tests__/upload-env.test.ts.
 */

/** True when running on Vercel or similar serverless where local files don't persist. */
export function isServerless(env = process.env): boolean {
  return env.VERCEL === "1" || !!env.AWS_LAMBDA_FUNCTION_NAME
}

/** In production, local uploads are lost on every deploy. Use Firebase Storage only. */
export function isProduction(env = process.env): boolean {
  return env.NODE_ENV === "production"
}

/**
 * True if the upload API is allowed to save to local disk (public/uploads).
 * When false, only Firebase Storage must be used so URLs persist after deploy.
 */
export function isLocalUploadAllowed(env = process.env): boolean {
  if (env.UPLOAD_USE_LOCAL !== "true") return false
  if (isServerless(env)) return false
  if (isProduction(env)) return false
  return true
}

/**
 * True if the given URL is a persistent URL (will still work after a new deploy).
 * Local URLs (/uploads/...) are not persistent on Vercel or after redeploy.
 */
export function isPersistentImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false
  const trimmed = url.trim()
  if (trimmed.startsWith("/uploads/")) return false
  if (trimmed.startsWith("https://firebasestorage.googleapis.com/")) return true
  if (trimmed.startsWith("https://storage.googleapis.com/")) return true
  if (/^https:\/\//.test(trimmed)) return true
  return false
}
