"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Save, Eye, Loader2, Plus, Trash2 } from "lucide-react"
import { defaultAboutContent } from "@/lib/default-about-content"
import type { AboutPageContent, AboutVisionPoint, AboutSustainabilityItem } from "@/lib/types"
import { ImageUpload } from "@/components/admin/ImageUpload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ICON_OPTIONS = ["Building2", "ShieldCheck", "Handshake", "TreePine", "Zap", "Droplets", "Recycle", "Leaf", "MapPin"]

export default function AboutPageEditor() {
  const [content, setContent] = useState<AboutPageContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content/about")
        if (res.ok) {
          const data = await res.json()
          setContent(data)
        } else {
          setContent(defaultAboutContent)
        }
      } catch {
        toast.error("Failed to load content")
        setContent(defaultAboutContent)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    try {
      const res = await fetch("/api/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...content, updatedAt: new Date() }),
      })
      if (res.ok) {
        toast.success("About page saved successfully!")
      } else {
        toast.error("Failed to save")
      }
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  const setHero = (u: Partial<typeof content.hero>) => setContent({ ...content, hero: { ...content.hero, ...u } })
  const setVision = (u: Partial<typeof content.vision>) => setContent({ ...content, vision: { ...content.vision, ...u } })
  const setMission = (u: Partial<typeof content.mission>) => setContent({ ...content, mission: { ...content.mission, ...u } })
  const setResponsibility = (u: Partial<typeof content.responsibility>) =>
    setContent({ ...content, responsibility: { ...content.responsibility, ...u } })
  const setLandPurchase = (u: Partial<typeof content.landPurchase>) =>
    setContent({ ...content, landPurchase: { ...content.landPurchase, ...u } })
  const setCta = (u: Partial<typeof content.cta>) => setContent({ ...content, cta: { ...content.cta, ...u } })

  const updateVisionPoint = (index: number, u: Partial<AboutVisionPoint>) => {
    const points = [...content.vision.points]
    points[index] = { ...points[index], ...u }
    setVision({ points })
  }
  const addVisionPoint = () => {
    const points = [...content.vision.points, { id: `vp-${Date.now()}`, icon: "Building2", title: "", description: "", order: content.vision.points.length + 1 }]
    setVision({ points })
  }
  const removeVisionPoint = (index: number) => {
    const points = content.vision.points.filter((_, i) => i !== index)
    setVision({ points })
  }

  const updateInitiative = (index: number, u: Partial<AboutSustainabilityItem>) => {
    const initiatives = [...content.responsibility.initiatives]
    initiatives[index] = { ...initiatives[index], ...u }
    setResponsibility({ initiatives })
  }
  const addInitiative = () => {
    const initiatives = [...content.responsibility.initiatives, { id: `si-${Date.now()}`, icon: "TreePine", title: "", description: "", order: content.responsibility.initiatives.length + 1 }]
    setResponsibility({ initiatives })
  }
  const removeInitiative = (index: number) => {
    const initiatives = content.responsibility.initiatives.filter((_, i) => i !== index)
    setResponsibility({ initiatives })
  }

  const updateLookingFor = (index: number, value: string) => {
    const lookingFor = [...content.landPurchase.lookingFor]
    lookingFor[index] = value
    setLandPurchase({ lookingFor })
  }
  const addLookingFor = () => setLandPurchase({ lookingFor: [...content.landPurchase.lookingFor, ""] })
  const removeLookingFor = (index: number) =>
    setLandPurchase({ lookingFor: content.landPurchase.lookingFor.filter((_, i) => i !== index) })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">About Page Editor</h1>
          <p className="text-muted-foreground mt-1">Edit all sections of the About page</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <a href="/about" target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </a>
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold-dark text-white">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="bg-white border flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="vision">Vision</TabsTrigger>
          <TabsTrigger value="mission">Mission</TabsTrigger>
          <TabsTrigger value="responsibility">Responsibility</TabsTrigger>
          <TabsTrigger value="land">Land Purchase</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner at the top of the About page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload label="Hero background image" value={content.hero.image || ""} onChange={(url) => setHero({ image: url })} folder="images" />
              <div className="space-y-2">
                <Label>Label</Label>
                <Input value={content.hero.label} onChange={(e) => setHero({ label: e.target.value })} placeholder="Enter hero label" />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={content.hero.title} onChange={(e) => setHero({ title: e.target.value })} placeholder="Enter hero title" />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea value={content.hero.subtitle} onChange={(e) => setHero({ subtitle: e.target.value })} rows={3} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision">
          <Card>
            <CardHeader>
              <CardTitle>Vision / Who We Are</CardTitle>
              <CardDescription>Section label, title, and vision points (cards)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Section label</Label>
                  <Input value={content.vision.label} onChange={(e) => setVision({ label: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Section title</Label>
                  <Input value={content.vision.title} onChange={(e) => setVision({ title: e.target.value })} />
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <Label>Vision points</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVisionPoint}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-4">
                  {content.vision.points.map((point, i) => (
                    <div key={point.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Point {i + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeVisionPoint(i)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <Select value={point.icon} onValueChange={(v) => updateVisionPoint(i, { icon: v })}>
                        <SelectTrigger><SelectValue placeholder="Select icon" /></SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input value={point.title} onChange={(e) => updateVisionPoint(i, { title: e.target.value })} placeholder="Enter title" />
                      <Textarea value={point.description} onChange={(e) => updateVisionPoint(i, { description: e.target.value })} placeholder="Enter description" rows={3} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mission">
          <Card>
            <CardHeader>
              <CardTitle>Mission Statement</CardTitle>
              <CardDescription>Quote and caption block</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Quote</Label>
                <Textarea value={content.mission.quote} onChange={(e) => setMission({ quote: e.target.value })} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Caption</Label>
                <Input value={content.mission.caption} onChange={(e) => setMission({ caption: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responsibility">
          <Card>
            <CardHeader>
              <CardTitle>Responsibility / Sustainability</CardTitle>
              <CardDescription>Intro text, image, and initiative items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section label</Label>
                <Input value={content.responsibility.label} onChange={(e) => setResponsibility({ label: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Section title</Label>
                <Input value={content.responsibility.title} onChange={(e) => setResponsibility({ title: e.target.value })} />
              </div>
              <Textarea value={content.responsibility.intro} onChange={(e) => setResponsibility({ intro: e.target.value })} placeholder="Enter intro paragraph" rows={2} />
              <Textarea value={content.responsibility.intro2} onChange={(e) => setResponsibility({ intro2: e.target.value })} placeholder="Enter second paragraph" rows={2} />
              <ImageUpload label="Section image" value={content.responsibility.image || ""} onChange={(url) => setResponsibility({ image: url })} folder="images" />
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <Label>Initiatives</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addInitiative}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-4">
                  {content.responsibility.initiatives.map((item, i) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Item {i + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeInitiative(i)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <Select value={item.icon} onValueChange={(v) => updateInitiative(i, { icon: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input value={item.title} onChange={(e) => updateInitiative(i, { title: e.target.value })} placeholder="Enter title" />
                      <Textarea value={item.description} onChange={(e) => updateInitiative(i, { description: e.target.value })} placeholder="Enter description" rows={2} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="land">
          <Card>
            <CardHeader>
              <CardTitle>Land Purchase Section</CardTitle>
              <CardDescription>Title, intro, bullet list, and contact card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Section label</Label>
                  <Input value={content.landPurchase.label} onChange={(e) => setLandPurchase({ label: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Section title</Label>
                  <Input value={content.landPurchase.title} onChange={(e) => setLandPurchase({ title: e.target.value })} />
                </div>
              </div>
              <Textarea value={content.landPurchase.intro} onChange={(e) => setLandPurchase({ intro: e.target.value })} rows={2} />
              <Textarea value={content.landPurchase.intro2} onChange={(e) => setLandPurchase({ intro2: e.target.value })} rows={2} />
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <Label>What we are looking for (bullets)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLookingFor}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {content.landPurchase.lookingFor.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={item} onChange={(e) => updateLookingFor(i, e.target.value)} placeholder="Enter bullet item" />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeLookingFor(i)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4 space-y-4">
                <Label>Contact card</Label>
                <Input value={content.landPurchase.contactCardTitle} onChange={(e) => setLandPurchase({ contactCardTitle: e.target.value })} placeholder="Enter card title" />
                <Textarea value={content.landPurchase.contactCardDescription} onChange={(e) => setLandPurchase({ contactCardDescription: e.target.value })} rows={2} />
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value={content.landPurchase.contactAddress} onChange={(e) => setLandPurchase({ contactAddress: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={content.landPurchase.contactPhone} onChange={(e) => setLandPurchase({ contactPhone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={content.landPurchase.contactEmail} onChange={(e) => setLandPurchase({ contactEmail: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Button text</Label>
                  <Input value={content.landPurchase.contactButtonText} onChange={(e) => setLandPurchase({ contactButtonText: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>CTA Section</CardTitle>
              <CardDescription>Explore Our Work block at the bottom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section label</Label>
                <Input value={content.cta.label} onChange={(e) => setCta({ label: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={content.cta.title} onChange={(e) => setCta({ title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={content.cta.description} onChange={(e) => setCta({ description: e.target.value })} rows={2} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Projects button text</Label>
                  <Input value={content.cta.projectsText} onChange={(e) => setCta({ projectsText: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Gallery button text</Label>
                  <Input value={content.cta.galleryText} onChange={(e) => setCta({ galleryText: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
