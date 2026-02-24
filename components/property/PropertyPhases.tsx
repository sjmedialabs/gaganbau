"use client"

import { useState } from "react"
import type { Property } from "@/lib/types"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyPhasesProps {
  property: Property
}

export function PropertyPhases({ property }: PropertyPhasesProps) {
  const [activeIndex, setActiveIndex] = useState(0)

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

        {/* Tab Navigation */}
        {phases.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {phases.map((phase, index) => (
              <button
                type="button"
                key={phase.id}
                onClick={() => setActiveIndex(index)}
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 border ${
                  activeIndex === index
                    ? "bg-gold border-gold text-white"
                    : "bg-transparent border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {phase.title || `Phase ${index + 1}`}
              </button>
            ))}
          </div>
        )}

        {/* Phase Content */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {activePhase.image ? (
              <div className="aspect-[16/9] rounded-md overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePhase.image || "/placeholder.svg"}
                  alt={activePhase.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[16/9] rounded-md bg-white/5 flex flex-col items-center justify-center gap-3">
                <ImageIcon className="w-12 h-12 text-white/20" />
                <span className="text-white/30 text-sm">
                  No image uploaded for this phase
                </span>
              </div>
            )}

            {/* Arrows */}
            {phases.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                  onClick={() =>
                    setActiveIndex(
                      (prev) => (prev - 1 + phases.length) % phases.length,
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

          {/* Phase Title and Description */}
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
    </section>
  )
}
