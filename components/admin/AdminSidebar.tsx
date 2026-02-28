"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSimpleAuth } from "@/lib/simple-auth"
import { useLanguage } from "@/lib/language-context"
import {
  Home,
  FileText,
  Settings,
  Users,
  LogOut,
  LayoutDashboard,
  Building2,
  Images,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", labelKey: "admin.dashboard", icon: LayoutDashboard },
  { href: "/admin/home-page", labelKey: "admin.homePage", icon: Home },
  { href: "/admin/about-page", labelKey: "admin.aboutPage", icon: FileText },
  { href: "/admin/properties/list", labelKey: "admin.properties", icon: Building2 },
  { href: "/admin/gallery", labelKey: "admin.gallery", icon: Images },
  { href: "/admin/blog", labelKey: "admin.blog", icon: FileText },
  { href: "/admin/seo", labelKey: "admin.seoSettings", icon: Settings },
  { href: "/admin/leads", labelKey: "admin.crmLeads", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useSimpleAuth()
  const { locale, setLocale, t } = useLanguage()
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/content/home")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!cancelled && data?.header?.logo) setLogoUrl(data.header.logo)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const handleSignOut = () => {
    signOut()
    router.push("/admin/login")
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-navy shrink-0">
      {/* Logo - top */}
      <div className="shrink-0 p-4 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoUrl}
              alt="Gagan Bau"
              className="h-10 w-auto max-w-[140px] object-contain brightness-0 invert"
            />
          ) : (
            <div className="w-10 h-10 bg-gold rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">GB</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">Gagan Bau</p>
            <p className="text-white/50 text-xs">{t("common.adminCms")}</p>
          </div>
        </Link>
      </div>

      {/* Navigation - scrollable */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const label = t(item.labelKey)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-gold text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Language selector */}
      <div className="shrink-0 px-4 py-2 border-t border-white/10">
        <p className="text-white/50 text-xs mb-2">Language</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium transition-colors",
              locale === "en" ? "bg-gold text-white" : "text-white/70 hover:bg-white/10"
            )}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLocale("de")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium transition-colors",
              locale === "de" ? "bg-gold text-white" : "text-white/70 hover:bg-white/10"
            )}
          >
            DE
          </button>
        </div>
      </div>

      {/* Sign Out - bottom */}
      <div className="shrink-0 p-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          {t("language.signOut")}
        </button>
      </div>
    </aside>
  )
}
