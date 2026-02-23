"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Save, Plus, Trash2, GripVertical, Loader2 } from "lucide-react"
import { defaultHomeContent } from "@/lib/default-content"
import type { HeroSlide, HomePageContent } from "@/lib/types"
import { ImageUpload } from "@/components/admin/ImageUpload"

export default function HeroSlidesEditor() {
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [slides, setSlides] = useState<HeroSlide[]>(defaultHomeContent.heroSlides)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content/home")
        if (res.ok) {
          const data = await res.json()
          setContent(data)
          setSlides(data.heroSlides || defaultHomeContent.heroSlides)
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
        heroSlides: slides,
      }

      const res = await fetch("/api/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      })

      if (res.ok) {
        toast.success("Hero slides saved successfully!")
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

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `hero-${Date.now()}`,
      title: "New Slide",
      subtitle: "Enter subtitle here",
      buttonText: "Learn More",
      buttonLink: "/",
      backgroundImage: "",
      order: slides.length + 1,
      isActive: true,
    }
    setSlides([...slides, newSlide])
  }

  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSlides(slides.map((slide) => (slide.id === id ? { ...slide, ...updates } : slide)))
  }

  const deleteSlide = (id: string) => {
    if (slides.length <= 1) {
      toast.error("You must have at least one hero slide")
      return
    }
    setSlides(slides.filter((slide) => slide.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hero Slides</h1>
          <p className="text-muted-foreground mt-1">
            Manage the hero slider on your home page
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addSlide}>
            <Plus className="w-4 h-4 mr-2" />
            Add Slide
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold-dark text-white">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Slides List */}
      <div className="space-y-4">
        {slides
          .sort((a, b) => a.order - b.order)
          .map((slide, index) => (
            <Card key={slide.id} className={!slide.isActive ? "opacity-60" : ""}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                    <CardTitle className="text-lg">Slide {index + 1}</CardTitle>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${slide.id}`} className="text-sm">
                        Active
                      </Label>
                      <Switch
                        id={`active-${slide.id}`}
                        checked={slide.isActive}
                        onCheckedChange={(checked) => updateSlide(slide.id, { isActive: checked })}
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteSlide(slide.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Image Upload */}
                  <ImageUpload
                    label="Background Image"
                    value={slide.backgroundImage}
                    onChange={(url) => updateSlide(slide.id, { backgroundImage: url })}
                    folder="hero"
                    aspectRatio="video"
                  />

                  {/* Content */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={slide.title}
                          onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                          placeholder="Rising With Vision"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input
                          value={slide.subtitle}
                          onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })}
                          placeholder="Your Next Level of Living"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input
                          value={slide.buttonText}
                          onChange={(e) => updateSlide(slide.id, { buttonText: e.target.value })}
                          placeholder="Discover More"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Button Link</Label>
                        <Input
                          value={slide.buttonLink}
                          onChange={(e) => updateSlide(slide.id, { buttonLink: e.target.value })}
                          placeholder="/projects"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={slide.order}
                        onChange={(e) => updateSlide(slide.id, { order: Number.parseInt(e.target.value) || 1 })}
                        min={1}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
