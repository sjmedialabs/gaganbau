"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { Property, ConstructionPhase, PlanSubCategory } from "@/lib/types"
import { ImageIcon, ZoomIn, ZoomOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MIN_SCALE = 1
const MAX_SCALE = 4
const ZOOM_STEP = 0.25

/** Effective sub-categories for a phase: use subCategories if present, else one legacy sub-category from images. */
function getEffectiveSubCategories(phase: ConstructionPhase): PlanSubCategory[] {
  if (phase.subCategories && phase.subCategories.length > 0) {
    return phase.subCategories
  }
  const legacyImages = (phase.images && phase.images.length > 0)
    ? phase.images.filter(Boolean)
    : phase.image
      ? [phase.image]
      : []
  if (legacyImages.length === 0) return []
  return [
    { id: `legacy-${phase.id}`, title: phase.title || "Plans", images: legacyImages },
  ]
}

/** All phases with at least one effective sub-category. */
function getPhasesWithSubs(phases: ConstructionPhase[]): ConstructionPhase[] {
  return phases.filter((p) => getEffectiveSubCategories(p).length > 0)
}

interface PropertyPhasesProps {
  property: Property
}

export function PropertyPhases({ property }: PropertyPhasesProps) {
  const plans = property.constructionPhases || []
  const phasesWithSubs = getPhasesWithSubs(plans)

  const [activePlanIndex, setActivePlanIndex] = useState(0)
  const activePhase = phasesWithSubs[activePlanIndex] ?? null
  const subCategories = activePhase ? getEffectiveSubCategories(activePhase) : []

  const [selectedSubId, setSelectedSubId] = useState<string>(() => {
    if (subCategories.length > 0) return subCategories[0].id
    return ""
  })

  const selectedSub = subCategories.find((s) => s.id === selectedSubId) ?? subCategories[0] ?? null
  const images = selectedSub?.images?.filter(Boolean) ?? []
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const modalImageSrc = images[modalImageIndex]
  const activePlan = activePhase && selectedSub ? { ...activePhase, title: selectedSub.title } : null

  const [modalOpen, setModalOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 })
  const positionRef = useRef(position)
  positionRef.current = position

  // When plan type tab changes, select first sub-category of that plan
  useEffect(() => {
    const subs = activePhase ? getEffectiveSubCategories(activePhase) : []
    if (subs.length > 0) {
      const firstId = subs[0].id
      setSelectedSubId((prev) => (subs.some((s) => s.id === prev) ? prev : firstId))
    } else {
      setSelectedSubId("")
    }
  }, [activePlanIndex, activePhase])

  const openModal = (imageIndex: number) => {
    setModalImageIndex(imageIndex)
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setModalOpen(true)
  }

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

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

  const resetZoom = () => {
    setScale(MIN_SCALE)
    setPosition({ x: 0, y: 0 })
  }

  const handleModalMouseDown = (e: React.MouseEvent) => {
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    if (modalOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [modalOpen, closeModal])

  const handleModalTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1) return
    const t = e.touches[0]
    dragStart.current = { x: t.clientX, y: t.clientY, posX: positionRef.current.x, posY: positionRef.current.y }
  }

  const handleModalTouchMove = (e: React.TouchEvent) => {
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

  if (phasesWithSubs.length === 0) return null

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
          <div className="flex lg:flex-col flex-wrap gap-2 lg:min-w-[200px] lg:max-w-[220px]">
              {phasesWithSubs.map((phase, index) => (
                <button
                  type="button"
                  key={phase.id}
                  onClick={() => setActivePlanIndex(index)}
                  className={`px-4 py-3 text-left text-sm font-medium transition-all duration-200 border lg:border-l-4 ${
                    activePlanIndex === index
                      ? "bg-gold border-gold text-white lg:border-l-gold"
                      : "bg-white/5 border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {phase.title || `Plan ${index + 1}`}
                </button>
              ))}
          </div>

          {/* Right: Sub-category dropdown + image grid */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Dropdown: sub-categories of the selected plan type only */}
            {subCategories.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Select value={selectedSubId} onValueChange={setSelectedSubId}>
                  <SelectTrigger
                    id="sub-category-select"
                    className="w-full sm:max-w-[280px] bg-white/5 border-white/20 text-white hover:bg-white/10 focus:ring-gold"
                  >
                    <SelectValue placeholder="Select sub-category" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy border-white/20">
                    {subCategories.map((sub) => (
                      <SelectItem
                        key={sub.id}
                        value={sub.id}
                        className="text-white focus:bg-white/10 focus:text-white"
                      >
                        {sub.title || "Plans"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Image grid for selected sub-category */}
            <div className="min-w-0">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((src, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => openModal(index)}
                    className="aspect-[4/3] rounded-md overflow-hidden bg-white/5 border border-white/10 hover:border-gold/50 transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={activePlan ? `${activePlan.title} ${index + 1}` : `Plan ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="aspect-video rounded-md bg-white/5 flex flex-col items-center justify-center gap-3">
                <ImageIcon className="w-12 h-12 text-white/20" />
                <span className="text-white/30 text-sm">
                  No images for this sub-category
                </span>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery modal */}
      {modalOpen && modalImageSrc && activePlan && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10"
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
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10"
              onClick={zoomOut}
              disabled={scale <= MIN_SCALE}
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
            {scale > 1 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white rounded-full px-3 text-xs"
                onClick={resetZoom}
              >
                Reset
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10"
              onClick={closeModal}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div
            className="flex-1 flex items-center justify-center overflow-hidden min-h-0 p-4 pt-16"
            onMouseDown={handleModalMouseDown}
            onTouchStart={handleModalTouchStart}
            onTouchMove={handleModalTouchMove}
            style={{
              cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              touchAction: scale > 1 ? "none" : "auto",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={modalImageSrc}
              alt={activePlan.title}
              draggable={false}
              className="select-none max-w-full max-h-full w-auto h-auto object-contain pointer-events-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "center center",
              }}
            />
          </div>

          <div className="shrink-0 px-4 pb-6 pt-2 text-center border-t border-white/10">
            {activePlan.title && (
              <h3 className="text-lg font-medium text-white">{activePlan.title}</h3>
            )}
            {activePlan.description && (
              <p className="text-white/60 text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
                {activePlan.description}
              </p>
            )}
            <p className="text-white/40 text-xs mt-4">
              {scale > 1 ? "Drag to pan · Zoom with buttons" : "Use zoom buttons for step-by-step zoom"}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
