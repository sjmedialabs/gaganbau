/**
 * Tests that the upload strategy ensures images persist after deploy.
 * In production we must never use local uploads (/uploads/...) so that
 * after a new deployment, image URLs still work (Firebase Storage).
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import {
  isServerless,
  isProduction,
  isLocalUploadAllowed,
  isPersistentImageUrl,
} from "@/lib/upload-env"

const env = (overrides: Record<string, string | undefined> = {}) => ({
  ...process.env,
  ...overrides,
})

describe("upload-env: images persist after deploy", () => {
  const originalEnv = { ...process.env }

  afterEach(() => {
    Object.assign(process.env, originalEnv)
  })

  describe("isProduction", () => {
    it("returns true when NODE_ENV is production", () => {
      expect(isProduction(env({ NODE_ENV: "production" }))).toBe(true)
    })
    it("returns false when NODE_ENV is development", () => {
      expect(isProduction(env({ NODE_ENV: "development" }))).toBe(false)
    })
    it("returns false when NODE_ENV is unset", () => {
      expect(isProduction(env({ NODE_ENV: undefined }))).toBe(false)
    })
  })

  describe("isServerless", () => {
    it("returns true when VERCEL is 1", () => {
      expect(isServerless(env({ VERCEL: "1" }))).toBe(true)
    })
    it("returns true when AWS_LAMBDA_FUNCTION_NAME is set", () => {
      expect(isServerless(env({ AWS_LAMBDA_FUNCTION_NAME: "my-fn" }))).toBe(true)
    })
    it("returns false when neither is set", () => {
      expect(isServerless(env({ VERCEL: undefined, AWS_LAMBDA_FUNCTION_NAME: undefined }))).toBe(false)
    })
  })

  describe("isLocalUploadAllowed", () => {
    it("returns false in production even when UPLOAD_USE_LOCAL is true (so deploy keeps images)", () => {
      expect(
        isLocalUploadAllowed(env({ NODE_ENV: "production", UPLOAD_USE_LOCAL: "true" }))
      ).toBe(false)
    })
    it("returns false on serverless (Vercel) when UPLOAD_USE_LOCAL is true", () => {
      expect(
        isLocalUploadAllowed(env({ VERCEL: "1", UPLOAD_USE_LOCAL: "true", NODE_ENV: "development" }))
      ).toBe(false)
    })
    it("returns false when UPLOAD_USE_LOCAL is not true", () => {
      expect(isLocalUploadAllowed(env({ NODE_ENV: "development", UPLOAD_USE_LOCAL: "false" }))).toBe(false)
      expect(isLocalUploadAllowed(env({ NODE_ENV: "development", UPLOAD_USE_LOCAL: undefined }))).toBe(false)
    })
    it("returns true only in development, non-serverless, with UPLOAD_USE_LOCAL=true", () => {
      expect(
        isLocalUploadAllowed(env({
          NODE_ENV: "development",
          VERCEL: undefined,
          AWS_LAMBDA_FUNCTION_NAME: undefined,
          UPLOAD_USE_LOCAL: "true",
        }))
      ).toBe(true)
    })
  })

  describe("isPersistentImageUrl", () => {
    it("returns false for local /uploads/ URLs (lost on deploy)", () => {
      expect(isPersistentImageUrl("/uploads/images/123.jpg")).toBe(false)
      expect(isPersistentImageUrl("/uploads/hero/456.png")).toBe(false)
    })
    it("returns true for Firebase Storage URLs (persist after deploy)", () => {
      expect(
        isPersistentImageUrl("https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Ffile.jpg?alt=media")
      ).toBe(true)
    })
    it("returns true for other https URLs", () => {
      expect(isPersistentImageUrl("https://storage.googleapis.com/bucket/path.jpg")).toBe(true)
      expect(isPersistentImageUrl("https://example.com/image.png")).toBe(true)
    })
    it("returns false for empty or invalid input", () => {
      expect(isPersistentImageUrl("")).toBe(false)
      expect(isPersistentImageUrl("   ")).toBe(false)
    })
  })

  describe("production deploy: no local uploads", () => {
    it("production never allows local uploads so images exist after deploy", () => {
      const productionEnv = env({ NODE_ENV: "production" })
      expect(isLocalUploadAllowed(productionEnv)).toBe(false)
    })
    it("Vercel deploy never allows local uploads", () => {
      const vercelEnv = env({ VERCEL: "1", NODE_ENV: "production" })
      expect(isLocalUploadAllowed(vercelEnv)).toBe(false)
    })
  })
})
