"use client"

import { useState, useCallback, useEffect } from "react"
import type { Property } from "@/lib/types"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyGalleryProps {
  property: Property
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const images = property.galleryImages?.filter(Boolean) || []

  const openLightbox = (index: number) => {
    setActiveIndex(index)
    setLightboxOpen(true)
  }

  const goNext = useCallback(
    () => setActiveIndex((prev) => (prev + 1) % images.length),
    [images.length],
  )
  const goPrev = useCallback(
    () =>
      setActiveIndex((prev) => (prev - 1 + images.length) % images.length),
    [images.length],
  )

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "Escape") setLightboxOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightboxOpen, goNext, goPrev])

  if (images.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-navy">
            GALLERY
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        {/* Dense Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {images.map((image, index) => {
            // First image gets featured treatment
            const isFeature = index === 0 && images.length >= 4
            return (
              <button
                type="button"
                key={index}
                className={`group relative overflow-hidden cursor-pointer bg-muted ${
                  isFeature
                    ? "col-span-2 row-span-2"
                    : ""
                }`}
                onClick={() => openLightbox(index)}
              >
                <div
                  className={`${isFeature ? "aspect-square" : "aspect-[4/3]"} w-full`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${property.projectName} - image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <ZoomIn className="w-5 h-5 text-navy" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Full-screen Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between p-4">
            <span className="text-white/50 text-sm">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
              <span className="sr-only">Close gallery</span>
            </button>
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center relative px-16">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 w-12 h-12"
              onClick={goPrev}
            >
              <ChevronLeft className="w-7 h-7" />
              <span className="sr-only">Previous</span>
            </Button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeIndex] || "/placeholder.svg"}
              alt={`${property.projectName} - image ${activeIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 w-12 h-12"
              onClick={goNext}
            >
              <ChevronRight className="w-7 h-7" />
              <span className="sr-only">Next</span>
            </Button>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center justify-center gap-1.5 p-4 overflow-x-auto">
            {images.map((img, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-14 h-10 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                  i === activeIndex
                    ? "border-gold opacity-100"
                    : "border-white/10 opacity-50 hover:opacity-80"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
