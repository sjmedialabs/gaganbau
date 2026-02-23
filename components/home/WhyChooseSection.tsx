"use client"

import { useEffect, useRef, useState } from "react"
import type { WhyChooseSection as WhyChooseSectionType, WhyChooseItem } from "@/lib/types"

interface WhyChooseSectionProps {
  content: WhyChooseSectionType
}

// Animation types for icons
const iconAnimations = [
  "animate-icon-float",
  "animate-icon-float",
  "animate-icon-float",
  "animate-icon-float"
]

// Icon component - uses uploaded image if available, otherwise falls back to SVG
function FeatureIcon({ item, index }: { item: WhyChooseItem; index: number }) {
  const animationClass = iconAnimations[index % iconAnimations.length]
  
  if (item.iconImage) {
    return (
      <div className={`${animationClass}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={item.iconImage || "/placeholder.svg"} 
          alt={item.title} 
          className="w-12 h-12 object-contain"
        />
      </div>
    )
  }

  switch (item.icon) {
    case "experience":
      return (
        <div className={`${animationClass}`}>
          <svg className="w-10 h-10 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      )
    case "satisfaction":
      return (
        <div className={`${animationClass}`}>
          <svg className="w-10 h-10 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
      )
    case "projects":
      return (
        <div className={`${animationClass}`}>
          <svg className="w-10 h-10 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
      )
    case "decades":
      return (
        <div className={`${animationClass}`}>
          <svg className="w-10 h-10 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      )
    default:
      return (
        <div className={`${animationClass}`}>
          <svg className="w-10 h-10 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
          </svg>
        </div>
      )
  }
}

export function WhyChooseSection({ content }: WhyChooseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sortedItems = [...content.items].sort((a, b) => a.order - b.order)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            {/* Label */}
            <span 
              className={`inline-block text-xs tracking-[0.15em] text-foreground font-medium mb-4 border border-foreground/20 px-3 py-1 ${
                isVisible ? "animate-fade-right" : "opacity-0"
              }`}
            >
              {content.label}
            </span>

            {/* Title */}
            <h2 
              className={`text-2xl md:text-3xl lg:text-4xl text-navy font-normal leading-tight mb-12 whitespace-pre-line ${
                isVisible ? "animate-fade-up" : "opacity-0"
              }`}
              style={{ animationDelay: '100ms' }}
            >
              {content.title}
            </h2>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-8">
              {sortedItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`space-y-3 group cursor-default ${
                    isVisible ? "animate-flip-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <FeatureIcon item={item} index={index} />
                  <h3 className="text-sm font-semibold text-gold tracking-wide whitespace-pre-line uppercase group-hover:translate-x-1 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image with reveal animation */}
          <div 
            className={`relative h-[400px] lg:h-[500px] overflow-hidden ${
              isVisible ? "animate-zoom-out" : "opacity-0"
            }`}
            style={{ animationDelay: '300ms' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image || "/placeholder.svg"}
              alt="Why Choose Us"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
