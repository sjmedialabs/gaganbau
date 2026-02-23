"use client"

import type { Property } from "@/lib/types"
import { Play } from "lucide-react"

interface PropertyVideoProps {
  property: Property
}

function getEmbedUrl(url: string): string {
  // Convert youtube.com/watch?v=xxx to youtube.com/embed/xxx
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`
    }
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${parsed.pathname}`
    }
  } catch {
    // already an embed URL or invalid
  }
  return url
}

export function PropertyVideo({ property }: PropertyVideoProps) {
  const hasVideo = !!property.videoUrl
  const hasDescription = !!property.videoDescription

  if (!hasVideo && !hasDescription) return null

  const embedUrl = hasVideo ? getEmbedUrl(property.videoUrl!) : ""

  return (
    <section className="py-0">
      <div
        className={`grid ${hasVideo && hasDescription ? "lg:grid-cols-2" : "grid-cols-1"} min-h-[420px] lg:min-h-[500px]`}
      >
        {/* Left - Description Panel */}
        {hasDescription && (
          <div className="bg-[#faf6ef] flex items-center justify-center p-10 lg:p-16 relative">
            <div className="max-w-lg space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-gold" />
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
                  Project Walkthrough
                </span>
              </div>
              <p className="text-xl md:text-2xl lg:text-3xl font-serif text-navy leading-relaxed text-balance">
                {property.videoDescription}
              </p>
            </div>
          </div>
        )}

        {/* Right - Video Player */}
        {hasVideo && (
          <div className="relative bg-navy min-h-[320px] lg:min-h-0">
            <iframe
              src={embedUrl}
              title={`${property.projectName} video`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  )
}
