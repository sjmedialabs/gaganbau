"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Save, Plus, Trash2, Loader2 } from "lucide-react"
import { defaultHomeContent } from "@/lib/default-content"
import type { PressItem, PressSection, HomePageContent } from "@/lib/types"

export default function PressEditor() {
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [press, setPress] = useState<PressSection>(defaultHomeContent.press)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content/home")
        if (res.ok) {
          const data = await res.json()
          setContent(data)
          setPress(data.press || defaultHomeContent.press)
        }
      } catch (error) {
        console.error("Failed to fetch content:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatedContent = {
        ...content,
        press,
      }

      const res = await fetch("/api/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      })

      if (res.ok) {
        toast.success("Press releases saved successfully!")
      } else {
        toast.error("Failed to save changes")
      }
    } catch (error) {
      toast.error("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  const addPressItem = () => {
    const newItem: PressItem = {
      id: `press-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      title: "NEW PRESS RELEASE TITLE",
      link: "/press/new-release",
      order: press.items.length + 1,
      isActive: true,
    }
    setPress({ ...press, items: [...press.items, newItem] })
  }

  const updateItem = (id: string, updates: Partial<PressItem>) => {
    setPress({
      ...press,
      items: press.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })
  }

  const deleteItem = (id: string) => {
    setPress({
      ...press,
      items: press.items.filter((item) => item.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Press Releases</h1>
          <p className="text-muted-foreground mt-1">
            Manage press release section on your home page
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addPressItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Press Item
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold-dark text-white">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Section Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Section Settings</CardTitle>
          <CardDescription>Configure the press section header</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Section Label</Label>
              <Input
                value={press.label}
                onChange={(e) => setPress({ ...press, label: e.target.value })}
                placeholder="Press Release"
              />
            </div>
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={press.title}
                onChange={(e) => setPress({ ...press, title: e.target.value })}
                placeholder="Expert tips and insights..."
              />
            </div>
            <div className="space-y-2">
              <Label>View All Link</Label>
              <Input
                value={press.viewAllLink}
                onChange={(e) => setPress({ ...press, viewAllLink: e.target.value })}
                placeholder="/press"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Press Items */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Press Items</h2>
        {press.items
          .sort((a, b) => a.order - b.order)
          .map((item, index) => (
            <Card key={item.id} className={!item.isActive ? "opacity-60" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        value={item.date}
                        onChange={(e) => updateItem(item.id, { date: e.target.value })}
                        placeholder="January 20, 2026"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                        placeholder="PRESS: TITLE HERE"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link</Label>
                      <Input
                        value={item.link}
                        onChange={(e) => updateItem(item.id, { link: e.target.value })}
                        placeholder="/press/article-slug"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={(checked) => updateItem(item.id, { isActive: checked })}
                      />
                    </div>
                    <Input
                      type="number"
                      value={item.order}
                      onChange={(e) => updateItem(item.id, { order: Number.parseInt(e.target.value) || 1 })}
                      className="w-16"
                      min={1}
                    />
                    <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
