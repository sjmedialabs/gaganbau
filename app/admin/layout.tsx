"use client"

import React, { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SimpleAuthProvider, useSimpleAuth } from "@/lib/simple-auth"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Toaster } from "@/components/ui/sonner"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSimpleAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if on login page
    if (pathname === "/admin/login") return
    
    if (!loading && !user) {
      router.push("/admin/login")
    }
  }, [user, loading, router, pathname])

  // If on login page, just render children without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SimpleAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <Toaster />
    </SimpleAuthProvider>
  )
}
