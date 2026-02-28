"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, Menu, X, ChevronRight } from "lucide-react"
import type { HeaderContent, Property } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"

interface HeaderProps {
  content: HeaderContent
  isTransparent?: boolean
  properties?: Property[]
}

interface CategoryPropertiesMap {
  "on-sale": Property[]
  "in-planning": Property[]
}

const categoryKey: Record<string, string> = {
  "on-sale": "categories.onSale",
  "in-planning": "categories.inPlanning",
}

const categoryLinks: Record<string, string> = {
  "on-sale": "/projects/category/on-sale",
  "in-planning": "/projects/category/in-planning",
}

export function Header({ content, isTransparent = true, properties = [] }: HeaderProps) {
  const { locale, setLocale, translateLabel, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const projectsRef = useRef<HTMLDivElement>(null)

  // Only show nav items that are enabled
  const visibleNavigation = content.navigation.filter((item) => item.enabled !== false)

  // Group properties by category
  const categorizedProperties: CategoryPropertiesMap = {
    "on-sale": properties.filter((p) => p.category === "on-sale" && p.isActive),
    "in-planning": properties.filter((p) => p.category === "in-planning" && p.isActive),
  }

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectsRef.current && !projectsRef.current.contains(event.target as Node)) {
        setProjectsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isWhiteBackground = scrolled || !isTransparent

  const renderProjectsDropdown = () => {
    const categories = ["on-sale", "in-planning"] as const
    const hasProperties = categories.some((cat) => categorizedProperties[cat].length > 0)

    if (!hasProperties) {
      return (
        <div className="p-6 text-center text-muted-foreground">
          {t("categories.noPropertiesAvailable")}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-0 min-w-[480px]">
        {categories.map((category) => (
          <div key={category} className="border-r border-border last:border-r-0">
            {/* Category Header */}
            <Link
              href={categoryLinks[category]}
              className="block px-5 py-4 bg-muted/50 hover:bg-muted transition-colors border-b border-border"
              onClick={() => setProjectsOpen(false)}
            >
              <div className="flex items-center justify-between">
<span className="text-sm font-semibold text-navy uppercase tracking-wide">
                {t(categoryKey[category])}
              </span>
                <ChevronRight className="w-4 h-4 text-gold" />
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">
                {categorizedProperties[category].length} {t("categories.properties")}
              </span>
            </Link>

            {/* Properties List */}
            <div className="max-h-[300px] overflow-y-auto">
              {categorizedProperties[category].length === 0 ? (
                <div className="px-5 py-4 text-sm text-muted-foreground">
                  {t("categories.noProperties")}
                </div>
              ) : (
                categorizedProperties[category].slice(0, 5).map((property) => (
                  <Link
                    key={property.id}
                    href={`/projects/${property.slug}`}
                    className="block px-5 py-3 hover:bg-muted/50 transition-colors group"
                    onClick={() => setProjectsOpen(false)}
                  >
                    <span className="text-sm text-navy group-hover:text-gold transition-colors line-clamp-1">
                      {property.projectName}
                    </span>
                    {property.specifications?.address && (
                      <span className="text-xs text-muted-foreground block mt-0.5 line-clamp-1">
                        {property.specifications.address}
                      </span>
                    )}
                  </Link>
                ))
              )}
              {categorizedProperties[category].length > 5 && (
                <Link
                  href={categoryLinks[category]}
                  className="block px-5 py-3 text-sm text-gold hover:text-gold-dark transition-colors font-medium"
                  onClick={() => setProjectsOpen(false)}
                >
                  {t("common.viewAll")} {categorizedProperties[category].length} {t("categories.properties")}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isWhiteBackground 
          ? "bg-white shadow-md backdrop-blur-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-2">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.logo || "/placeholder.svg"}
              alt="Gagan Bau GmbH"
              className={`h-18 w-auto object-contain transition-all duration-500 ${
                isWhiteBackground ? "brightness-0 contrast-100" : "brightness-100"
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {visibleNavigation.map((item) => {
              // Special handling for Projects with dropdown (hover trigger)
              if (item.label === "Projects") {
                return (
                  <div 
                    key={item.label} 
                    className="relative" 
                    ref={projectsRef}
                    onMouseEnter={() => setProjectsOpen(true)}
                    onMouseLeave={() => setProjectsOpen(false)}
                  >
                    <Link
                      href="/projects"
                      className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 ${
                        isWhiteBackground
                          ? "text-navy hover:text-gold"
                          : "text-white hover:text-gold"
                      }`}
                    >
                      {translateLabel(item.label)}
                      <ChevronDown className={`w-4 h-4 transition-transform ${projectsOpen ? "rotate-180" : ""}`} />
                    </Link>

                    {/* Projects Mega Dropdown - appears on hover */}
                    {projectsOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                        <div className="bg-white rounded-lg shadow-2xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          {renderProjectsDropdown()}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isWhiteBackground
                      ? "text-navy hover:text-gold"
                      : "text-white hover:text-gold"
                  }`}
                >
                  {translateLabel(item.label)}
                </Link>
              )
            })}

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLanguageOpen(!languageOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 ${
                  isWhiteBackground
                    ? "text-navy hover:text-gold"
                    : "text-white hover:text-gold"
                }`}
              >
                {locale === "de" ? "DE" : "EN"}
                <ChevronDown className="w-4 h-4" />
              </button>
              {languageOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded shadow-lg py-2 min-w-[100px]">
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-navy hover:bg-muted transition-colors"
                    onClick={() => { setLocale("en"); setLanguageOpen(false) }}
                  >
                    {t("language.en")}
                  </button>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-navy hover:bg-muted transition-colors"
                    onClick={() => { setLocale("de"); setLanguageOpen(false) }}
                  >
                    {t("language.de")}
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`lg:hidden p-2 transition-colors duration-300 ${
              isWhiteBackground ? "text-navy" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10">
          <nav className="px-6 py-4 space-y-2">
            {visibleNavigation.map((item) => {
              if (item.label === "Projects") {
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                      className="flex items-center justify-between w-full text-white text-base font-normal hover:text-gold transition-colors py-2"
                    >
                      {translateLabel(item.label)}
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileProjectsOpen ? "rotate-180" : ""}`} />
                    </button>

                    {mobileProjectsOpen && (
                      <div className="ml-4 mt-2 space-y-4 border-l-2 border-gold/30 pl-4">
                        {(["on-sale", "in-planning"] as const).map((category) => (
                          <div key={category}>
                            <Link
                              href={categoryLinks[category]}
                              className="text-gold text-sm font-medium uppercase tracking-wide block py-1"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t(categoryKey[category])}
                            </Link>
                            <div className="mt-1 space-y-1">
                              {categorizedProperties[category].slice(0, 3).map((property) => (
                                <Link
                                  key={property.id}
                                  href={`/projects/${property.slug}`}
                                  className="block text-white/70 text-sm py-1 hover:text-white transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {property.projectName}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-white text-base font-normal hover:text-gold transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {translateLabel(item.label)}
                </Link>
              )
            })}
            <div className="pt-4 border-t border-white/10">
              <button
                type="button"
                className="block w-full text-left text-white text-base py-2 hover:text-gold transition-colors"
                onClick={() => { setLocale("en"); setMobileMenuOpen(false) }}
              >
                {t("language.en")}
              </button>
              <button
                type="button"
                className="block w-full text-left text-white text-base py-2 hover:text-gold transition-colors"
                onClick={() => { setLocale("de"); setMobileMenuOpen(false) }}
              >
                {t("language.de")}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
