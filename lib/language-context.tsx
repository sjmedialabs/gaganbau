"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Locale } from "./translations"
import { getT, translateLabel as translateLabelFn } from "./translations"

const STORAGE_KEY = "gaganbau-lang"
const DEFAULT_LOCALE: Locale = "en"

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  translateLabel: (label: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === "de" ? "de" : "en"
  } catch {
    return DEFAULT_LOCALE
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLocaleState(getStoredLocale())
    setMounted(true)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = next === "de" ? "de" : "en"
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.lang = locale === "de" ? "de" : "en"
  }, [mounted, locale])

  const tFn = getT(locale)
  const value: LanguageContextValue = {
    locale,
    setLocale,
    t: tFn,
    translateLabel: (label: string) => translateLabelFn(locale, label),
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key: string) => key,
      translateLabel: (label: string) => label,
    }
  }
  return ctx
}
