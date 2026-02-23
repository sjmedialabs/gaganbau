"use client"

import { useRef, useState, useEffect } from "react"
import type { Property } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Trees,
  Dumbbell,
  Car,
  ShieldCheck,
  Waves,
  Theater,
  Dog,
  Goal,
  TreePine,
  Baby,
  Bike,
  Gamepad2,
  Music,
  Wifi,
  Zap,
  Heart,
  Sun,
  Coffee,
  BookOpen,
  Utensils,
  Flower2,
  Mountain,
  Umbrella,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Trees, Dumbbell, Car, ShieldCheck, Waves, Theater, Dog, Goal,
  TreePine, Baby, Bike, Gamepad2, Music, Wifi, Zap, Heart,
  Sun, Coffee, BookOpen, Utensils, Flower2, Mountain, Umbrella,
}

interface PropertyAmenitiesProps {
  property: Property
}

export function PropertyAmenities({ property }: PropertyAmenitiesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const amenities = property.amenities || []
  if (amenities.length === 0) return null

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    })
    setTimeout(checkScroll, 400)
  }

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif text-navy">
            AMENITIES
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        <div className="relative px-12">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="icon"
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-md border border-border bg-background text-foreground hover:bg-muted disabled:opacity-30"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="sr-only">Scroll left</span>
          </Button>

          {/* Scrollable Row */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 lg:gap-10 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {amenities.map((amenity) => {
              const Icon = iconMap[amenity.icon] || Trees
              return (
                <div
                  key={amenity.id}
                  className="flex flex-col items-center gap-4 flex-shrink-0 snap-center"
                  style={{ minWidth: "140px" }}
                >
                  <div className="w-[88px] h-[88px] rounded-full border-2 border-gold/40 flex items-center justify-center transition-all duration-300 hover:border-gold hover:bg-gold/5 hover:shadow-lg hover:shadow-gold/10">
                    <Icon className="w-9 h-9 text-gold" strokeWidth={1.2} />
                  </div>
                  <span className="text-xs font-semibold text-navy uppercase tracking-wider text-center leading-tight max-w-[140px]">
                    {amenity.name}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="icon"
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-md border border-border bg-background text-foreground hover:bg-muted disabled:opacity-30"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-5 h-5" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
