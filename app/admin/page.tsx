"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ImageIcon, FileText, Users, Eye, TrendingUp, Database } from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Hero Slides", value: "3", icon: ImageIcon, href: "/admin/hero-slides" },
  { label: "Projects", value: "3", icon: FileText, href: "/admin/projects" },
  { label: "Press Releases", value: "3", icon: FileText, href: "/admin/press" },
  { label: "Leads", value: "12", icon: Users, href: "/admin/leads" },
]

const quickActions = [
  { label: "Initialize Database", href: "/admin/database", icon: Database },
  { label: "Edit Home Page", href: "/admin/home-page", icon: Home },
  { label: "Manage Hero Slides", href: "/admin/hero-slides", icon: ImageIcon },
  { label: "View Leads", href: "/admin/leads", icon: Users },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to Gagan Bau GmbH Admin CMS
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="hover:shadow-lg hover:border-gold transition-all cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                    <action.icon className="w-6 h-6 text-gold" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gold" />
              Recent Changes
            </CardTitle>
            <CardDescription>Latest content updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Updated Hero Slide 1", time: "2 hours ago" },
                { action: "Added new project", time: "1 day ago" },
                { action: "Modified footer content", time: "2 days ago" },
                { action: "Updated SEO settings", time: "3 days ago" },
              ].map((item) => (
                <div key={item.action} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-sm">{item.action}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              Lead Statistics
            </CardTitle>
            <CardDescription>Contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">New Leads</span>
                <span className="font-semibold text-gold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Contacted</span>
                <span className="font-semibold">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Closed</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="pt-4 border-t">
                <Link
                  href="/admin/leads"
                  className="text-sm text-gold hover:underline"
                >
                  View all leads
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
