"use client"

import { useState } from "react"
import type { Property } from "@/lib/types"
import { ChevronLeft, ChevronRight, ImageIcon, ZoomIn, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyPhasesProps {
  property: Property
}

export function PropertyPhases({ property }: PropertyPhasesProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  const phases = property.constructionPhases || []
  if (phases.length === 0) return null

  const activePhase = phases[activeIndex]

  return (
    <section className="py-16 md:py-24 bg-navy">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-white">
            {property.constructionPhasesTitle || "LAYOUT"}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Phase tabs (vertical on desktop) */}
          {phases.length > 1 && (
            <div className="flex lg:flex-col flex-wrap gap-2 lg:min-w-[200px] lg:max-w-[220px]">
              {phases.map((phase, index) => (
                <button
                  type="button"
                  key={phase.id}
                  onClick={() => setActiveIndex(index)}
                  className={`px-4 py-3 text-left text-sm font-medium transition-all duration-200 border lg:border-l-4 ${
                    activeIndex === index
                      ? "bg-gold border-gold text-white lg:border-l-gold"
                      : "bg-white/5 border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {phase.title || `Phase ${index + 1}`}
                </button>
              ))}
            </div>
          )}

          {/* Right: Image with zoom */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              {activePhase.image ? (
                <div className="aspect-[16/9] rounded-md overflow-hidden bg-white/5 relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePhase.image || "/placeholder.svg"}
                    alt={activePhase.title}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setZoomOpen(true)}
                    aria-label="Zoom image"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="aspect-[16/9] rounded-md bg-white/5 flex flex-col items-center justify-center gap-3">
                  <ImageIcon className="w-12 h-12 text-white/20" />
                  <span className="text-white/30 text-sm">
                    No image uploaded for this phase
                  </span>
                </div>
              )}

              {phases.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                    onClick={() =>
                      setActiveIndex(
                        (prev) => (prev - 1 + phases.length) % phases.length
                      )
                    }
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="sr-only">Previous phase</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                    onClick={() =>
                      setActiveIndex((prev) => (prev + 1) % phases.length)
                    }
                  >
                    <ChevronRight className="w-5 h-5" />
                    <span className="sr-only">Next phase</span>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-lg font-medium text-white">
                {activePhase.title}
              </h3>
              {activePhase.description && (
                <p className="text-white/60 text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
                  {activePhase.description}
                </p>
              )}
              {phases.length > 1 && (
                <p className="text-white/30 text-xs mt-4">
                  {activeIndex + 1} / {phases.length}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom modal */}
      {zoomOpen && activePhase?.image && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed image"
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activePhase.image}
            alt={activePhase.title}
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
