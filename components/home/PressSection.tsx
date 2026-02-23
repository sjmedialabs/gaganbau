"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { PressSection as PressSectionType } from "@/lib/types"

interface PressSectionProps {
  content: PressSectionType
}

export function PressSection({ content }: PressSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const activeItems = content.items.filter((item) => item.isActive).sort((a, b) => a.order - b.order)

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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-navy overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        {/* Label */}
        <span 
          className={`inline-block text-xs tracking-[0.15em] text-gold font-medium mb-4 border border-gold/30 px-3 py-1 ${
            isVisible ? "animate-fade-down" : "opacity-0"
          }`}
        >
          {content.label}
        </span>

        {/* Title */}
        <h2 
          className={`text-2xl md:text-3xl lg:text-4xl text-white font-normal leading-tight mb-12 ${
            isVisible ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: '100ms' }}
        >
          {content.title}
        </h2>

        {/* Press Items */}
        <div className="space-y-0">
          {activeItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`border-t border-white/10 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 group hover:bg-white/5 transition-colors duration-300 px-4 -mx-4 ${
                isVisible ? "animate-fade-left" : "opacity-0"
              }`}
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <div>
                <p className="text-white/50 text-xs mb-2 group-hover:text-gold/70 transition-colors">{item.date}</p>
                <h3 className="text-white text-sm md:text-base font-normal uppercase tracking-wide group-hover:text-gold transition-colors duration-300">
                  {item.title}
                </h3>
              </div>
              <Link
                href={item.link}
                className="inline-flex items-center gap-4 text-white text-sm font-medium hover:text-gold transition-all duration-300 shrink-0 link-hover-underline"
              >
                <span className="w-16 h-px bg-white/30 group-hover:bg-gold/50 group-hover:w-20 transition-all duration-300" />
                VIEW
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div 
          className={`mt-8 ${isVisible ? "animate-zoom-in" : "opacity-0"}`}
          style={{ animationDelay: `${200 + activeItems.length * 100}ms` }}
        >
          <Link
            href={content.viewAllLink}
            className="inline-block border border-white/30 text-white px-6 py-2.5 text-xs font-medium tracking-wider 
              hover:bg-white hover:text-navy transition-all duration-300 btn-hover-expand"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  )
}
