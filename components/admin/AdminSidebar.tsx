"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSimpleAuth } from "@/lib/simple-auth"
import {
  Home,
  ImageIcon,
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
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/home-page", label: "Home Page", icon: Home },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: ImageIcon },
  { href: "/admin/projects", label: "Projects Slider", icon: FileText },
  { href: "/admin/properties/list", label: "Properties", icon: Building2 },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/press", label: "Press Releases", icon: FileText },
  { href: "/admin/seo", label: "SEO Settings", icon: Settings },
  { href: "/admin/leads", label: "CRM / Leads", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useSimpleAuth()

  const handleSignOut = () => {
    signOut()
    router.push("/admin/login")
  }

  return (
    <aside className="w-64 bg-navy min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">GB</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Gagan Bau</p>
            <p className="text-white/50 text-xs">Admin CMS</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
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
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
