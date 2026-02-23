"use client"

import React from "react"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { JSX } from "react/jsx-runtime" // Added import for JSX

type AnimationType = 
  | "fade-up" 
  | "fade-down" 
  | "fade-left" 
  | "fade-right" 
  | "zoom-in" 
  | "zoom-out"
  | "flip-up"
  | "slide-up"
  | "rotate-in"
  | "blur-in"

interface ScrollAnimationProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  threshold?: number
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function ScrollAnimation({
  children,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
  className = "",
  as: Component = "div",
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold])

  const delayClass = delay > 0 ? `animate-delay-${delay}` : ""

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${isVisible ? `animate-${animation} ${delayClass}` : "opacity-0"} ${className}`}
      style={delay > 0 && delay % 100 !== 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  )
}

// Parallax effect wrapper
interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.3, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      
      // Calculate how far into the viewport the element is
      const scrollProgress = (windowHeight - elementTop) / (windowHeight + rect.height)
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress))
      
      // Apply parallax offset
      setOffset((clampedProgress - 0.5) * 100 * speed)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div 
        className="will-change-transform transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${offset}px)` }}
      >
        {children}
      </div>
    </div>
  )
}

// Staggered children animation
interface StaggeredProps {
  children: ReactNode[]
  animation?: AnimationType
  staggerDelay?: number
  className?: string
}

export function Staggered({ 
  children, 
  animation = "fade-up", 
  staggerDelay = 100,
  className = "" 
}: StaggeredProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
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
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={isVisible ? `animate-${animation}` : "opacity-0"}
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
