"use client"

import { useState } from "react"
import type { Property, ConstructionPhase } from "@/lib/types"
import { ChevronLeft, ChevronRight, ImageIcon, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

function getPlanImages(phase: ConstructionPhase): string[] {
  if (phase.images && phase.images.length > 0) return phase.images.filter(Boolean)
  if (phase.image) return [phase.image]
  return []
}

interface PropertyPhasesProps {
  property: Property
}

export function PropertyPhases({ property }: PropertyPhasesProps) {
  const [activePlanIndex, setActivePlanIndex] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const plans = property.constructionPhases || []
  if (plans.length === 0) return null

  const activePlan = plans[activePlanIndex]
  const images = getPlanImages(activePlan)
  const currentImage = images[activeImageIndex]

  const hasMultipleImages = images.length > 1
  const showPrevNext = hasMultipleImages && !zoomed

  const goToPrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }
  const goToNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length)
  }

  const handlePlanTabClick = (index: number) => {
    setActivePlanIndex(index)
    setActiveImageIndex(0)
    setZoomed(false)
  }

  return (
    <section className="py-16 md:py-24 bg-navy">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-white">
            {property.constructionPhasesTitle || "Project Plans"}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Plan type tabs */}
          {plans.length > 1 && (
            <div className="flex lg:flex-col flex-wrap gap-2 lg:min-w-[200px] lg:max-w-[220px]">
              {plans.map((plan, index) => (
                <button
                  type="button"
                  key={plan.id}
                  onClick={() => handlePlanTabClick(index)}
                  className={`px-4 py-3 text-left text-sm font-medium transition-all duration-200 border lg:border-l-4 ${
                    activePlanIndex === index
                      ? "bg-gold border-gold text-white lg:border-l-gold"
                      : "bg-white/5 border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {plan.title || `Plan ${index + 1}`}
                </button>
              ))}
            </div>
          )}

          {/* Right: Image viewer - next/prev cycle through images of current plan */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              {currentImage ? (
                <div
                  className={`rounded-md overflow-hidden bg-white/5 relative group transition-all duration-300 ${
                    zoomed ? "min-h-[70vh] flex items-center justify-center" : "aspect-[16/9]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImage}
                    alt={activePlan.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      zoomed ? "max-h-[85vh] w-auto object-contain cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                    onClick={() => (zoomed ? setZoomed(false) : setZoomed(true))}
                  />
                  {!zoomed && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setZoomed(true)}
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </Button>
                  )}
                  {zoomed && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10"
                      onClick={() => setZoomed(false)}
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="aspect-[16/9] rounded-md bg-white/5 flex flex-col items-center justify-center gap-3">
                  <ImageIcon className="w-12 h-12 text-white/20" />
                  <span className="text-white/30 text-sm">
                    No image uploaded for this plan
                  </span>
                </div>
              )}

              {/* Prev/Next: cycle through images of the current plan (not tabs) */}
              {showPrevNext && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                    onClick={goToPrevImage}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="sr-only">Previous image</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                    onClick={goToNextImage}
                  >
                    <ChevronRight className="w-5 h-5" />
                    <span className="sr-only">Next image</span>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-lg font-medium text-white">
                {activePlan.title}
              </h3>
              {activePlan.description && (
                <p className="text-white/60 text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
                  {activePlan.description}
                </p>
              )}
              {hasMultipleImages && !zoomed && (
                <p className="text-white/30 text-xs mt-4">
                  Image {activeImageIndex + 1} / {images.length}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
