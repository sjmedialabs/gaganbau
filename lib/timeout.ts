/**
 * Run a promise with a timeout. If it exceeds ms, return fallback instead of hanging.
 * Prevents serverless 503 (temporarily busy) when Firebase or cold start is slow.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
  label?: string
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null
  try {
    const result = await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("timeout")), ms)
      }),
    ])
    if (timer) clearTimeout(timer)
    return result
  } catch (e) {
    if (timer) clearTimeout(timer)
    if (e instanceof Error && e.message === "timeout" && label) {
      console.warn(`[timeout] ${label} exceeded ${ms}ms, using fallback`)
    }
    return fallback
  }
}

/** Default timeout for Firestore reads in serverless (stay under 10s limit). */
export const FIREBASE_READ_TIMEOUT_MS = 8000
