"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { Property, ConstructionPhase } from "@/lib/types"
import { ChevronLeft, ChevronRight, ImageIcon, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const MIN_SCALE = 1
const MAX_SCALE = 4
const ZOOM_STEP = 0.5

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
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 })
  const positionRef = useRef(position)
  positionRef.current = position

  const plans = property.constructionPhases || []
  if (plans.length === 0) return null

  const activePlan = plans[activePlanIndex]
  const images = getPlanImages(activePlan)
  const currentImage = images[activeImageIndex]

  const hasMultipleImages = images.length > 1
  const isZoomed = scale > 1
  const showPrevNext = hasMultipleImages && !isZoomed

  const goToPrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
    resetZoom()
  }
  const goToNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length)
    resetZoom()
  }

  const resetZoom = useCallback(() => {
    setScale(MIN_SCALE)
    setPosition({ x: 0, y: 0 })
  }, [])

  const handlePlanTabClick = (index: number) => {
    setActivePlanIndex(index)
    setActiveImageIndex(0)
    resetZoom()
  }

  const zoomIn = () => {
    setScale((s) => Math.min(MAX_SCALE, s + ZOOM_STEP))
  }

  const zoomOut = () => {
    setScale((s) => {
      const next = Math.max(MIN_SCALE, s - ZOOM_STEP)
      if (next <= MIN_SCALE) setPosition({ x: 0, y: 0 })
      return next
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, posX: positionRef.current.x, posY: positionRef.current.y }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      setPosition({
        x: dragStart.current.posX + (e.clientX - dragStart.current.x),
        y: dragStart.current.posY + (e.clientY - dragStart.current.y),
      })
    }
    const handleMouseUp = () => setIsDragging(false)
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1) return
    const t = e.touches[0]
    dragStart.current = { x: t.clientX, y: t.clientY, posX: positionRef.current.x, posY: positionRef.current.y }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (scale <= 1 || e.touches.length !== 1) return
    e.preventDefault()
    const t = e.touches[0]
    const dx = t.clientX - dragStart.current.x
    const dy = t.clientY - dragStart.current.y
    setPosition({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy,
    })
    dragStart.current = { x: t.clientX, y: t.clientY, posX: dragStart.current.posX + dx, posY: dragStart.current.posY + dy }
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

          {/* Right: Image viewer with zoom and pan */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              {currentImage ? (
                <div
                  className={`rounded-md overflow-hidden bg-white/5 relative group transition-all duration-300 ${
                    isZoomed ? "min-h-[60vh] touch-none" : "aspect-[16/9]"
                  } ${isZoomed ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  style={{ touchAction: isZoomed ? "none" : "auto" }}
                >
                  <div
                    className={`flex items-center justify-center w-full h-full ${isZoomed ? "min-h-[60vh]" : "aspect-[16/9]"} overflow-hidden`}
                    style={{ pointerEvents: isZoomed ? "auto" : "none" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentImage}
                      alt={activePlan.title}
                      draggable={false}
                      className={`select-none transition-transform duration-100 ${
                        isZoomed ? "max-w-none max-h-none" : "w-full h-full object-cover"
                      }`}
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: "center center",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  {/* Zoom controls - always visible when image exists */}
                  <div
                    className="absolute bottom-3 right-3 flex items-center gap-2"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={zoomIn}
                      disabled={scale >= MAX_SCALE}
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={zoomOut}
                      disabled={scale <= MIN_SCALE}
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </Button>
                    {isZoomed && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="bg-black/60 hover:bg-black/80 text-white rounded-full px-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={resetZoom}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/9] rounded-md bg-white/5 flex flex-col items-center justify-center gap-3">
                  <ImageIcon className="w-12 h-12 text-white/20" />
                  <span className="text-white/30 text-sm">
                    No image uploaded for this plan
                  </span>
                </div>
              )}

              {/* Prev/Next: cycle through images of the current plan */}
              {showPrevNext && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 z-10"
                    onClick={goToPrevImage}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="sr-only">Previous image</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 z-10"
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
              {hasMultipleImages && !isZoomed && (
                <p className="text-white/30 text-xs mt-4">
                  Image {activeImageIndex + 1} / {images.length}
                </p>
              )}
              {isZoomed && (
                <p className="text-white/50 text-xs mt-4">
                  Drag to pan · Zoom out or Reset to return
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
