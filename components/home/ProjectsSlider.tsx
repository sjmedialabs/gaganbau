"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { ArrowRight } from "lucide-react"
import type { ProjectSlide, CarouselAnimation } from "@/lib/types"

interface ProjectsSliderProps {
  projects: ProjectSlide[]
  animation?: CarouselAnimation
  autoPlaySpeed?: number
}

export function ProjectsSlider({ projects, animation = "fade", autoPlaySpeed = 6000 }: ProjectsSliderProps) {
  const [currentProject, setCurrentProject] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const activeProjects = projects.filter((p) => p.isActive).sort((a, b) => a.order - b.order)

  const nextProject = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentProject((prev) => (prev + 1) % activeProjects.length)
    setTimeout(() => setIsAnimating(false), 1000)
  }, [activeProjects.length, isAnimating])

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextProject, autoPlaySpeed)
    return () => clearInterval(timer)
  }, [nextProject, autoPlaySpeed])

  if (activeProjects.length === 0) return null

  const project = activeProjects[currentProject]

  // Animation classes based on type
  const getAnimationClasses = (index: number) => {
    const isActive = index === currentProject
    
    switch (animation) {
      case "slide":
        return `transition-transform duration-1000 ease-in-out ${
          isActive ? "translate-x-0 opacity-100" : index < currentProject ? "-translate-x-full opacity-0" : "translate-x-full opacity-0"
        }`
      case "zoom":
        return `transition-all duration-1000 ease-in-out ${
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-110"
        }`
      case "flip":
        return `transition-all duration-1000 ease-in-out [transform-style:preserve-3d] ${
          isActive ? "opacity-100 [transform:rotateY(0deg)]" : "opacity-0 [transform:rotateY(180deg)]"
        }`
      case "kenburns":
        return `transition-opacity duration-1000 ${
          isActive ? "opacity-100" : "opacity-0"
        }`
      case "blur":
        return `transition-all duration-1000 ease-in-out ${
          isActive ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-xl scale-105"
        }`
      case "cube":
        return `transition-all duration-1000 ease-in-out [transform-style:preserve-3d] origin-left ${
          isActive ? "opacity-100 [transform:rotateY(0deg)]" : index < currentProject ? "opacity-0 [transform:rotateY(-90deg)]" : "opacity-0 [transform:rotateY(90deg)]"
        }`
      case "cards":
        return `transition-all duration-700 ease-out ${
          isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 -translate-y-4 z-0"
        }`
      case "vertical":
        return `transition-all duration-1000 ease-in-out ${
          isActive ? "translate-y-0 opacity-100" : index < currentProject ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
        }`
      case "creative":
        return `transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 rotate-3"
        }`
      case "parallax":
        return `transition-all duration-1200 ease-out ${
          isActive ? "opacity-100 scale-100 translate-x-0" : index < currentProject ? "opacity-0 scale-110 -translate-x-20" : "opacity-0 scale-110 translate-x-20"
        }`
      case "shutters":
        return `transition-all duration-800 ease-in-out ${
          isActive ? "opacity-100 [clip-path:inset(0_0_0_0)]" : "opacity-0 [clip-path:inset(0_50%_0_50%)]"
        }`
      case "fade":
      default:
        return `transition-opacity duration-1000 ${
          isActive ? "opacity-100" : "opacity-0"
        }`
    }
  }

  // Get image-specific animation for Ken Burns effect
  const getImageClasses = (index: number) => {
    const isActive = index === currentProject
    if (animation === "kenburns" && isActive) {
      return "animate-kenburns"
    }
    if (animation === "parallax" && isActive) {
      return "animate-parallax-zoom"
    }
    return ""
  }

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Full-width Background Image */}
      {activeProjects.map((p, index) => (
        <div
          key={p.id}
          className={`absolute inset-0 ${getAnimationClasses(index)}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.images[0] || "/placeholder.svg"}
            alt={p.title}
            className={`w-full h-full object-cover ${getImageClasses(index)}`}
          />
        </div>
      ))}

      {/* Content Box - Left Side */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 ml-8 lg:ml-16 xl:ml-24">
        <div className="bg-navy/95 backdrop-blur-sm p-8 lg:p-12 max-w-[450px]">
          {/* Label Badge */}
          <span className="inline-block text-[10px] tracking-[0.2em] text-foreground font-medium mb-6 uppercase bg-white/90 px-4 py-2 border border-white/20">
            {project.label}
          </span>

          {/* Title */}
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl text-gold leading-tight mb-6 whitespace-pre-line"
            style={{ fontFamily: 'var(--font-display), Cormorant Garamond, Georgia, serif' }}
          >
            {project.title}
          </h2>

          {/* Description */}
          <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-[350px]">
            {project.description}
          </p>

          {/* Button */}
          <Link
            href={project.buttonLink}
            className="inline-block bg-gold hover:bg-gold-dark text-white px-8 py-3 text-xs font-medium tracking-wider transition-all duration-300 uppercase btn-hover-shine btn-hover-lift"
          >
            {project.buttonText}
          </Link>
        </div>
      </div>

      {/* Pagination - Bottom Right */}
      <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-16 z-10 flex items-center gap-6">
        {/* Page Numbers */}
        <div className="flex items-center gap-4">
          {activeProjects.map((_, index) => (
            <button
              key={`project-num-${index}`}
              type="button"
              onClick={() => setCurrentProject(index)}
              className={`text-base font-medium transition-all duration-300 ${
                index === currentProject 
                  ? "text-white" 
                  : "text-white/40 hover:text-white/70"
              }`}
              aria-label={`Go to project ${index + 1}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>

        {/* Next Button - Circle with Arrow */}
        <button
          type="button"
          onClick={nextProject}
          className="w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-navy hover:scale-110 transition-all duration-300 group"
          aria-label="Next project"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </section>
  )
}
