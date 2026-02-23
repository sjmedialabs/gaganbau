"use client"

import Link from "next/link"
import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { HeroSlide, CarouselAnimation } from "@/lib/types"

interface HeroSliderProps {
  slides: HeroSlide[]
  animation?: CarouselAnimation
  autoPlaySpeed?: number
}

export function HeroSlider({ slides, animation = "fade", autoPlaySpeed = 6000 }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [previousSlide, setPreviousSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [contentVisible, setContentVisible] = useState(true)
  const activeSlides = slides.filter((s) => s.isActive).sort((a, b) => a.order - b.order)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const changeSlide = useCallback((newIndex: number) => {
    if (isAnimating || newIndex === currentSlide) return
    
    // Start transition - fade out content first
    setIsAnimating(true)
    setContentVisible(false)
    
    // After content fades out, change the slide
    setTimeout(() => {
      setPreviousSlide(currentSlide)
      setCurrentSlide(newIndex)
      
      // Fade content back in after image transition starts
      setTimeout(() => {
        setContentVisible(true)
      }, 300)
      
      // Complete animation
      setTimeout(() => {
        setIsAnimating(false)
      }, 1000)
    }, 200)
  }, [currentSlide, isAnimating])

  const nextSlide = useCallback(() => {
    const newIndex = (currentSlide + 1) % activeSlides.length
    changeSlide(newIndex)
  }, [currentSlide, activeSlides.length, changeSlide])

  const prevSlide = useCallback(() => {
    const newIndex = (currentSlide - 1 + activeSlides.length) % activeSlides.length
    changeSlide(newIndex)
  }, [currentSlide, activeSlides.length, changeSlide])

  const goToSlide = useCallback((index: number) => {
    changeSlide(index)
  }, [changeSlide])

  useEffect(() => {
    timeoutRef.current = setInterval(nextSlide, autoPlaySpeed)
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current)
    }
  }, [nextSlide, autoPlaySpeed])

  if (activeSlides.length === 0) return null

  const slide = activeSlides[currentSlide]

  // Get z-index for layering
  const getZIndex = (index: number) => {
    if (index === currentSlide) return 2
    if (index === previousSlide) return 1
    return 0
  }

  // Animation classes based on type - smoother transitions
  const getAnimationClasses = (index: number) => {
    const isActive = index === currentSlide
    const wasPrevious = index === previousSlide
    
    const baseClasses = "will-change-transform will-change-opacity"
    
    switch (animation) {
      case "slide":
        if (isActive) return `${baseClasses} translate-x-0 opacity-100 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
        if (wasPrevious) return `${baseClasses} -translate-x-full opacity-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
        return `${baseClasses} translate-x-full opacity-0`
      case "zoom":
        if (isActive) return `${baseClasses} opacity-100 scale-100 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
        return `${baseClasses} opacity-0 scale-105 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
      case "flip":
        if (isActive) return `${baseClasses} opacity-100 [transform:perspective(1200px)_rotateY(0deg)] transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] [transform-style:preserve-3d]`
        return `${baseClasses} opacity-0 [transform:perspective(1200px)_rotateY(90deg)] transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] [transform-style:preserve-3d]`
      case "kenburns":
        if (isActive) return `${baseClasses} opacity-100 transition-opacity duration-[1500ms] ease-in-out`
        return `${baseClasses} opacity-0 transition-opacity duration-[1500ms] ease-in-out`
      case "blur":
        if (isActive) return `${baseClasses} opacity-100 blur-0 scale-100 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
        return `${baseClasses} opacity-0 blur-md scale-102 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
      case "cube":
        if (isActive) return `${baseClasses} opacity-100 [transform:perspective(1200px)_rotateY(0deg)] transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] [transform-style:preserve-3d] origin-right`
        if (wasPrevious) return `${baseClasses} opacity-0 [transform:perspective(1200px)_rotateY(-90deg)] transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] [transform-style:preserve-3d] origin-left`
        return `${baseClasses} opacity-0 [transform:perspective(1200px)_rotateY(90deg)] [transform-style:preserve-3d] origin-right`
      case "cards":
        if (isActive) return `${baseClasses} opacity-100 scale-100 translate-y-0 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]`
        return `${baseClasses} opacity-0 scale-95 translate-y-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]`
      case "vertical":
        if (isActive) return `${baseClasses} translate-y-0 opacity-100 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
        if (wasPrevious) return `${baseClasses} -translate-y-full opacity-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
        return `${baseClasses} translate-y-full opacity-0`
      case "creative":
        if (isActive) return `${baseClasses} opacity-100 scale-100 rotate-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]`
        return `${baseClasses} opacity-0 scale-95 rotate-1 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]`
      case "parallax":
        if (isActive) return `${baseClasses} opacity-100 scale-100 translate-x-0 transition-all duration-[1400ms] ease-out`
        if (wasPrevious) return `${baseClasses} opacity-0 scale-105 -translate-x-[5%] transition-all duration-[1400ms] ease-out`
        return `${baseClasses} opacity-0 scale-105 translate-x-[5%]`
      case "shutters":
        if (isActive) return `${baseClasses} opacity-100 [clip-path:inset(0_0_0_0)] transition-all duration-[1000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
        return `${baseClasses} opacity-0 [clip-path:inset(0_50%_0_50%)] transition-all duration-[1000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
      case "fade":
      default:
        if (isActive) return `${baseClasses} opacity-100 transition-opacity duration-[1200ms] ease-in-out`
        return `${baseClasses} opacity-0 transition-opacity duration-[1200ms] ease-in-out`
    }
  }

  // Get image-specific animation for Ken Burns effect
  const getImageClasses = (index: number) => {
    const isActive = index === currentSlide
    if (animation === "kenburns" && isActive) {
      return "animate-kenburns"
    }
    if (animation === "parallax" && isActive) {
      return "animate-parallax-zoom"
    }
    return ""
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-navy">
      {/* Background Images */}
      {activeSlides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 ${getAnimationClasses(index)}`}
          style={{ zIndex: getZIndex(index) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.backgroundImage || "/placeholder.svg"}
            alt={s.title}
            className={`absolute inset-0 w-full h-full object-cover ${getImageClasses(index)}`}
          />
        </div>
      ))}

      {/* Content with smooth fade */}
      <div 
        className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-6 transition-all duration-500 ease-out ${
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="font-aurallia text-4xl md:text-5xl lg:text-7xl text-white mb-4 text-balance tracking-wide">
          {slide.title}
        </h1>
        <p className="text-white text-lg md:text-xl mb-8 font-light">
          {slide.subtitle}
        </p>
        <Link
          href={slide.buttonLink}
          className="bg-gold hover:bg-gold-dark text-white px-8 py-3 text-sm font-medium transition-all duration-300 btn-hover-shine btn-hover-lift"
        >
          {slide.buttonText}
        </Link>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          type="button"
          onClick={prevSlide}
          disabled={isAnimating}
          className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-navy hover:border-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          {activeSlides.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed ${
                index === currentSlide 
                  ? "text-white scale-110" 
                  : "text-white/50 hover:text-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={isAnimating}
          className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-navy hover:border-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}
