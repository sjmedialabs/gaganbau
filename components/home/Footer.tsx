"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { FooterContent } from "@/lib/types"

interface FooterProps {
  content: FooterContent
}

export function Footer({ content }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = footerRef.current
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
    <footer ref={footerRef} className="bg-navy-dark py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Logo & Contact Info */}
          <div 
            className={`lg:col-span-2 space-y-6 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.logo || "/placeholder.svg"}
                alt="Gagan Bau GmbH"
                className="h-10 w-auto object-contain"
              />
              <span className="text-white font-serif text-lg whitespace-pre-line leading-tight">
                {content.companyName}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-white/70 text-xs leading-relaxed whitespace-pre-line group-hover:text-white/90 transition-colors">
                  {content.address}
                </p>
              </div>
              <div className="flex items-center gap-3 group">
                <svg className="w-5 h-5 text-gold flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <Link href={`tel:${content.phone.replace(/\s/g, "")}`} className="text-white/70 text-xs hover:text-gold transition-colors link-hover-underline">
                  {content.phone}
                </Link>
              </div>
              <div className="flex items-center gap-3 group">
                <svg className="w-5 h-5 text-gold flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <Link href={`mailto:${content.email}`} className="text-white/70 text-xs hover:text-gold transition-colors link-hover-underline">
                  {content.email}
                </Link>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {content.columns.map((column, colIndex) => (
            <div 
              key={column.title}
              className={`${isVisible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${100 + colIndex * 100}ms` }}
            >
              <h3 className="text-white text-sm font-medium mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li 
                    key={link.label}
                    className={`${isVisible ? "animate-fade-left" : "opacity-0"}`}
                    style={{ animationDelay: `${200 + colIndex * 100 + linkIndex * 50}ms` }}
                  >
                    <Link
                      href={link.href}
                      className="text-white/60 text-xs hover:text-gold transition-colors link-hover-underline inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div 
            className={`${isVisible ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: `${100 + content.columns.length * 100}ms` }}
          >
            <h3 className="text-white text-sm font-medium mb-4">Get Social</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {content.socialItems && content.socialItems.length > 0
                ? content.socialItems
                    .filter((item) => item.url?.trim())
                    .map((item) => (
                      <Link
                        key={item.label}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className="transition-transform duration-300 hover:scale-125 hover:-translate-y-1"
                      >
                        {item.icon?.trim() ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.icon}
                            alt={item.label}
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <span className="text-white/70 hover:text-gold text-xs font-medium">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    ))
                : [
                    { url: content.socialLinks.facebook, icon: content.socialIcons?.facebook, label: "Facebook" },
                    { url: content.socialLinks.twitter, icon: content.socialIcons?.twitter, label: "Twitter" },
                    { url: content.socialLinks.instagram, icon: content.socialIcons?.instagram, label: "Instagram" },
                    { url: content.socialLinks.youtube, icon: content.socialIcons?.youtube, label: "YouTube" },
                  ]
                    .filter((item) => item.url?.trim())
                    .map((item) => (
                      <Link
                        key={item.label}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className="transition-transform duration-300 hover:scale-125 hover:-translate-y-1"
                      >
                        {item.icon?.trim() ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.icon}
                            alt={item.label}
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <span className="text-white/70 hover:text-gold text-xs font-medium">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div 
          className={`mt-12 pt-8 border-t border-white/10 text-center ${isVisible ? "animate-blur-in" : "opacity-0"}`}
          style={{ animationDelay: '500ms' }}
        >
          <p className="text-white/50 text-xs">{content.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
