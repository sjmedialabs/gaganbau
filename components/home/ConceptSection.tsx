"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { ConceptSection as ConceptSectionType } from "@/lib/types"

interface ConceptSectionProps {
  content: ConceptSectionType
}

export function ConceptSection({ content }: ConceptSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate parallax offset based on scroll position
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height)
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress))
      setScrollY(clampedProgress * 100)
      
      // Visibility check for animations
      if (rect.top < windowHeight * 0.8) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-24 lg:py-32 relative overflow-hidden min-h-[500px]"
    >
      {/* Parallax Background Image */}
      <div 
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{ 
          transform: `translateY(${scrollY * 0.4}px)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.backgroundImage || "/images/concept-bg.jpg"}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0" />
      </div>
      
      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
        {/* Label */}
        <span 
          className={`inline-block text-xs tracking-[0.2em] text-gold font-medium mb-6 uppercase border border-gold/30 px-4 py-2 transition-all duration-700 ${
            isVisible ? "animate-fade-down" : "opacity-0"
          }`}
        >
          {content.label}
        </span>

        {/* Title with subtle parallax */}
        <h2 
          className={`text-2xl md:text-3xl lg:text-4xl text-navy font-normal leading-tight mb-6 text-balance transition-all duration-700 ${
            isVisible ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ 
            transform: isVisible ? `translateY(${scrollY * -0.15}px)` : 'translateY(20px)',
            animationDelay: '100ms'
          }}
        >
          {content.title}
        </h2>

        {/* Description */}
        <p 
          className={`text-navy text-sm md:text-base leading-relaxed mb-8 max-w-[600px] mx-auto transition-all duration-700 ${
            isVisible ? "animate-blur-in" : "opacity-0"
          }`}
          style={{ animationDelay: '200ms' }}
        >
          {content.description}
        </p>

        {/* Button with hover effects */}
        <Link
          href={content.buttonLink}
          className={`inline-block bg-gold hover:bg-gold-dark text-white px-8 py-3 text-sm font-medium tracking-wider uppercase
            btn-hover-shine btn-hover-lift transition-all duration-300 ${
            isVisible ? "animate-zoom-in" : "opacity-0"
          }`}
          style={{ animationDelay: '300ms' }}
        >
          {content.buttonText}
        </Link>
      </div>
    </section>
  )
}
