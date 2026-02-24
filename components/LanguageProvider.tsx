"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getT, type Locale } from "@/lib/translations"

const LOCALE_COOKIE = "locale"
const LOCALE_STORAGE = "locale"

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function setLocaleCookie(value: Locale) {
  if (typeof document === "undefined") return
  document.cookie = `${LOCALE_COOKIE}=${value};path=/;max-age=31536000;SameSite=Lax`
}

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const stored = (typeof localStorage !== "undefined" ? localStorage.getItem(LOCALE_STORAGE) : null) as Locale | null
    if (stored === "en" || stored === "de") {
      setLocaleState(stored)
      setLocaleCookie(stored)
    }
  }, [mounted])

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale)
      setLocaleCookie(newLocale)
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(LOCALE_STORAGE, newLocale)
      }
      router.refresh()
    },
    [router]
  )

  const t = useMemo(() => getT(locale), [locale])

  const value: LanguageContextValue = { locale, setLocale, t }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return ctx
}

export function useLanguageOptional() {
  return useContext(LanguageContext)
}
