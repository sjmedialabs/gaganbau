"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  Save,
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Building2,
  MapPin,
  Phone,
  ImageIcon,
  FileText,
  Settings,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/ImageUpload"
import type { Property, PropertyCategory, PropertyStatus, ConstructionPhase, PropertyAmenity, PropertySpecItem } from "@/lib/types"

/** Build heroSpecifications and keySpecifications arrays from legacy specifications object. */
function migrateLegacySpecs(data: Property): void {
  const specs = data.specifications
  if (!specs) return

  const items: PropertySpecItem[] = []
  const ts = () => `spec-${Date.now()}-${Math.random().toString(36).slice(2)}`

  if (specs.rooms) items.push({ id: ts(), icon: "Home", title: "Rooms", description: specs.rooms })
  if (specs.livingArea) items.push({ id: ts(), icon: "Maximize", title: "Total Building Built-up Area", description: specs.livingArea })
  if (specs.purchasePrice) items.push({ id: ts(), icon: "BadgeEuro", title: "Purchase Price", description: specs.purchasePrice })
  if (specs.address) items.push({ id: ts(), icon: "MapPin", title: "Address", description: specs.address })
  if (specs.availability?.length) {
    specs.availability.forEach((a) => items.push({ id: ts(), icon: "CalendarCheck", title: "Unit Type", description: a }))
  }

  if (items.length === 0) return

  if (!Array.isArray(data.heroSpecifications) || data.heroSpecifications.length === 0) {
    data.heroSpecifications = items.slice(0, 5)
  }
  if (!Array.isArray(data.keySpecifications) || data.keySpecifications.length === 0) {
    data.keySpecifications = [...items]
  }
}

const AMENITY_ICONS = [
  "Home", "Maximize", "BadgeEuro", "MapPin", "CalendarCheck", "Building2",
  "Trees", "Dumbbell", "Car", "ShieldCheck", "Waves", "Theater",
  "Dog", "Goal", "TreePine", "Baby", "Bike",
  "Gamepad2", "Music", "Wifi", "Zap", "Heart", "Sun",
  "Coffee", "BookOpen", "Utensils", "Flower2", "Mountain", "Umbrella",
]

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState<Property | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`)
        if (res.ok) {
          const data = await res.json()
          if (data) {
            if (!Array.isArray(data.heroSpecifications)) data.heroSpecifications = []
            if (!Array.isArray(data.keySpecifications)) data.keySpecifications = []
            migrateLegacySpecs(data)
          }
          setProperty(data)
        } else {
          toast.error("Property not found")
          router.push("/admin/properties/list")
        }
      } catch (error) {
        toast.error("Failed to load property")
        router.push("/admin/properties/list")
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id, router])

  const updateProperty = (updates: Partial<Property>) => {
    setProperty((prev) => (prev ? { ...prev, ...updates } : null))
  }

  const updateSpecifications = (updates: Partial<Property["specifications"]>) => {
    setProperty((prev) =>
      prev
        ? {
            ...prev,
            specifications: { ...prev.specifications, ...updates },
          }
        : null
    )
  }

  const handleSave = async () => {
    if (!property) return

    if (!property.projectName) {
      toast.error("Project name is required")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...property, updatedAt: new Date() }),
      })

      if (res.ok) {
        toast.success("Property updated successfully!")
        router.push("/admin/properties/list")
      } else {
        toast.error("Failed to update property")
      }
    } catch (error) {
      toast.error("Failed to update property")
    } finally {
      setSaving(false)
    }
  }

  // Construction phase handlers
  const addConstructionPhase = () => {
    const newPhase: ConstructionPhase = {
      id: `phase-${Date.now()}`,
      title: "",
      image: "",
      description: "",
    }
    updateProperty({
      constructionPhases: [...(property?.constructionPhases || []), newPhase],
    })
  }

  const updateConstructionPhase = (phaseId: string, updates: Partial<ConstructionPhase>) => {
    updateProperty({
      constructionPhases: property?.constructionPhases?.map((p) =>
        p.id === phaseId ? { ...p, ...updates } : p
      ),
    })
  }

  const removeConstructionPhase = (phaseId: string) => {
    updateProperty({
      constructionPhases: property?.constructionPhases?.filter((p) => p.id !== phaseId),
    })
  }

  // Special features handlers
  const addSpecialFeature = () => {
    updateProperty({
      specialFeatures: [...(property?.specialFeatures || []), ""],
    })
  }

  const updateSpecialFeature = (index: number, value: string) => {
    const features = [...(property?.specialFeatures || [])]
    features[index] = value
    updateProperty({ specialFeatures: features })
  }

  const removeSpecialFeature = (index: number) => {
    updateProperty({
      specialFeatures: property?.specialFeatures?.filter((_, i) => i !== index),
    })
  }

  // Amenity handlers
  const addAmenity = () => {
    const newAmenity: PropertyAmenity = {
      id: `amenity-${Date.now()}`,
      name: "",
      icon: "Trees",
    }
    updateProperty({
      amenities: [...(property?.amenities || []), newAmenity],
    })
  }

  const updateAmenity = (amenityId: string, updates: Partial<PropertyAmenity>) => {
    updateProperty({
      amenities: property?.amenities?.map((a) =>
        a.id === amenityId ? { ...a, ...updates } : a
      ),
    })
  }

  const removeAmenity = (amenityId: string) => {
    updateProperty({
      amenities: property?.amenities?.filter((a) => a.id !== amenityId),
    })
  }

  // Location highlights handlers
  const addLocationHighlight = () => {
    updateProperty({
      locationHighlights: [...(property?.locationHighlights || []), ""],
    })
  }

  const updateLocationHighlight = (index: number, value: string) => {
    const highlights = [...(property?.locationHighlights || [])]
    highlights[index] = value
    updateProperty({ locationHighlights: highlights })
  }

  const removeLocationHighlight = (index: number) => {
    updateProperty({
      locationHighlights: property?.locationHighlights?.filter((_, i) => i !== index),
    })
  }

  // Availability handlers
  const addAvailability = () => {
    updateSpecifications({
      availability: [...(property?.specifications?.availability || []), ""],
    })
  }

  const updateAvailability = (index: number, value: string) => {
    const availability = [...(property?.specifications?.availability || [])]
    availability[index] = value
    updateSpecifications({ availability })
  }

  const removeAvailability = (index: number) => {
    updateSpecifications({
      availability: property?.specifications?.availability?.filter((_, i) => i !== index),
    })
  }

  const addHeroSpec = () => {
    const list = property?.heroSpecifications ?? []
    if (list.length >= 5) return
    updateProperty({
      heroSpecifications: [...list, { id: `hero-spec-${Date.now()}`, icon: "Home", title: "", description: "" }],
    })
  }
  const updateHeroSpec = (id: string, updates: Partial<PropertySpecItem>) => {
    updateProperty({
      heroSpecifications: (property?.heroSpecifications ?? []).map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })
  }
  const removeHeroSpec = (id: string) => {
    updateProperty({ heroSpecifications: (property?.heroSpecifications ?? []).filter((s) => s.id !== id) })
  }

  const addKeySpec = () => {
    updateProperty({
      keySpecifications: [...(property?.keySpecifications ?? []), { id: `key-spec-${Date.now()}`, icon: "Home", title: "", description: "" }],
    })
  }
  const updateKeySpec = (id: string, updates: Partial<PropertySpecItem>) => {
    updateProperty({
      keySpecifications: (property?.keySpecifications ?? []).map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })
  }
  const removeKeySpec = (id: string) => {
    updateProperty({ keySpecifications: (property?.keySpecifications ?? []).filter((s) => s.id !== id) })
  }

  // Gallery handlers
  const addGalleryImage = () => {
    updateProperty({
      galleryImages: [...(property?.galleryImages || []), ""],
    })
  }

  const updateGalleryImage = (index: number, value: string) => {
    const images = [...(property?.galleryImages || [])]
    images[index] = value
    updateProperty({ galleryImages: images })
  }

  const removeGalleryImage = (index: number) => {
    updateProperty({
      galleryImages: property?.galleryImages?.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!property) {
    return null
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/properties/list">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Property</h1>
            <p className="text-muted-foreground mt-1">{property.projectName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="active">Active</Label>
            <Switch
              id="active"
              checked={property.isActive}
              onCheckedChange={(checked) => updateProperty({ isActive: checked })}
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold hover:bg-gold/90 text-white"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic" className="gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden md:inline">Basic</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="specs" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Specs</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden md:inline">Location</span>
          </TabsTrigger>
          <TabsTrigger value="phases" className="gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden md:inline">Phases</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Phone className="w-4 h-4" />
            <span className="hidden md:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="gallery" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            <span className="hidden md:inline">Gallery</span>
          </TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Property name, category, and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={property.projectName}
                    onChange={(e) => updateProperty({ projectName: e.target.value })}
                    placeholder="e.g., Linden Park"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={property.slug}
                    onChange={(e) => updateProperty({ slug: e.target.value })}
                    placeholder="auto-generated-from-name"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /projects/{property.slug}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectTagline">Project Tagline</Label>
                  <Input
                    id="projectTagline"
                    value={property.projectTagline}
                    onChange={(e) => updateProperty({ projectTagline: e.target.value })}
                    placeholder="e.g., MILBERTSHOFEN | AM HART"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={property.category}
                      onValueChange={(value) => updateProperty({ category: value as PropertyCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-sale">On Sale</SelectItem>
                        <SelectItem value="in-planning">In Planning</SelectItem>
                        <SelectItem value="reference">Reference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={property.status}
                      onValueChange={(value) => updateProperty({ status: value as PropertyStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ready-for-occupancy">Ready for Occupancy</SelectItem>
                        <SelectItem value="sold-out">Sold Out</SelectItem>
                        <SelectItem value="under-construction">Under Construction</SelectItem>
                        <SelectItem value="coming-soon">Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={property.order}
                    onChange={(e) => updateProperty({ order: Number.parseInt(e.target.value) || 1 })}
                    min={1}
                    className="w-24"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Main banner image and titles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload
                  label="Hero Background Image"
                  value={property.heroImage || ""}
                  onChange={(url) => updateProperty({ heroImage: url })}
                  folder="properties/hero"
                  aspectRatio="video"
                  maxSizeType="gallery"
                  helpText="Recommended: 1920x1080px, max 10MB"
                />

                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={property.heroTitle}
                    onChange={(e) => updateProperty({ heroTitle: e.target.value })}
                    placeholder="e.g., MILBERTSHOFEN - AT THE HEART"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={property.heroSubtitle}
                    onChange={(e) => updateProperty({ heroSubtitle: e.target.value })}
                    placeholder="e.g., LINDEN.PARK"
                  />
                </div>

                <ImageUpload
                  label="Project Logo"
                  value={property.projectLogo || ""}
                  onChange={(url) => updateProperty({ projectLogo: url })}
                  folder="properties/logos"
                  aspectRatio="auto"
                  maxSizeType="logo"
                  helpText="Recommended: PNG with transparency, max 2MB"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Description</CardTitle>
                <CardDescription>Subtitle and main description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={property.subtitle}
                    onChange={(e) => updateProperty({ subtitle: e.target.value })}
                    placeholder="e.g., Condominiums in Milbertshofen - Am Hart"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livingTitle">Living Section Title</Label>
                  <Input
                    id="livingTitle"
                    value={property.livingTitle}
                    onChange={(e) => updateProperty({ livingTitle: e.target.value })}
                    placeholder="e.g., Living near the Panzerwiese"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livingDescription">Living Description</Label>
                  <Textarea
                    id="livingDescription"
                    value={property.livingDescription}
                    onChange={(e) => updateProperty({ livingDescription: e.target.value })}
                    placeholder="Main description of the living experience..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livingDescriptionExtended">Extended Description</Label>
                  <Textarea
                    id="livingDescriptionExtended"
                    value={property.livingDescriptionExtended}
                    onChange={(e) => updateProperty({ livingDescriptionExtended: e.target.value })}
                    placeholder="Additional details about the property..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Special Features */}
            <Card>
              <CardHeader>
                <CardTitle>Special Features</CardTitle>
                <CardDescription>Highlight key features of the property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialFeaturesTitle">Section Title</Label>
                  <Input
                    id="specialFeaturesTitle"
                    value={property.specialFeaturesTitle}
                    onChange={(e) => updateProperty({ specialFeaturesTitle: e.target.value })}
                    placeholder="e.g., Special features"
                  />
                </div>

                <div className="space-y-3">
                  {property.specialFeatures?.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateSpecialFeature(index, e.target.value)}
                        placeholder="e.g., Close to nature, family-friendly"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeSpecialFeature(index)}
                        className="flex-shrink-0 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addSpecialFeature}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Video Section */}
            <Card>
              <CardHeader>
                <CardTitle>Video Section</CardTitle>
                <CardDescription>Showcase video with description text</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video Embed URL</Label>
                  <Input
                    id="videoUrl"
                    value={property.videoUrl || ""}
                    onChange={(e) => updateProperty({ videoUrl: e.target.value })}
                    placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the embed URL from YouTube or Vimeo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoDescription">Video Section Description</Label>
                  <Textarea
                    id="videoDescription"
                    value={property.videoDescription || ""}
                    onChange={(e) => updateProperty({ videoDescription: e.target.value })}
                    placeholder="e.g., Take a walk with us through the land of joy..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>Property amenities shown as icons in a carousel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {property.amenities?.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-3 border rounded-lg p-3">
                      <Select
                        value={amenity.icon}
                        onValueChange={(value) => updateAmenity(amenity.id, { icon: value })}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {AMENITY_ICONS.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        value={amenity.name}
                        onChange={(e) => updateAmenity(amenity.id, { name: e.target.value })}
                        placeholder="e.g., Swimming Pool"
                        className="flex-1"
                      />

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeAmenity(amenity.id)}
                        className="flex-shrink-0 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addAmenity}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Amenity
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Search engine optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={property.metaTitle}
                    onChange={(e) => updateProperty({ metaTitle: e.target.value })}
                    placeholder="Page title for search engines"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={property.metaDescription}
                    onChange={(e) => updateProperty({ metaDescription: e.target.value })}
                    placeholder="Page description for search engines (150-160 characters)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Specifications Tab */}
        <TabsContent value="specs">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero specifications (below hero)</CardTitle>
                <CardDescription>Up to 5 items. Each needs icon, title, and description.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(property.heroSpecifications ?? []).map((item) => (
                  <div key={item.id} className="flex flex-wrap items-start gap-3 p-4 border rounded-lg">
                    <div className="w-24 shrink-0">
                      <ImageUpload
                        label="Icon"
                        value={item.iconImage ?? ""}
                        onChange={(url) => updateHeroSpec(item.id, { iconImage: url })}
                        folder="properties/spec-icons"
                        aspectRatio="square"
                        helpText="Icon image"
                      />
                    </div>
                    <Input value={item.title} onChange={(e) => updateHeroSpec(item.id, { title: e.target.value })} placeholder="Title" className="flex-1 min-w-[120px]" />
                    <Input value={item.description} onChange={(e) => updateHeroSpec(item.id, { description: e.target.value })} placeholder="Description" className="flex-1 min-w-[180px]" />
                    <Button variant="outline" size="icon" onClick={() => removeHeroSpec(item.id)} className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addHeroSpec} disabled={(property.heroSpecifications?.length ?? 0) >= 5}>
                  <Plus className="w-4 h-4 mr-2" /> Add hero spec (max 5)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key specifications (below amenities)</CardTitle>
                <CardDescription>Unlimited items. Each needs icon, title, and description. Shown in two columns on the project page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(property.keySpecifications ?? []).map((item) => (
                  <div key={item.id} className="flex flex-wrap items-start gap-3 p-4 border rounded-lg">
                    <div className="w-24 shrink-0">
                      <ImageUpload
                        label="Icon"
                        value={item.iconImage ?? ""}
                        onChange={(url) => updateKeySpec(item.id, { iconImage: url })}
                        folder="properties/spec-icons"
                        aspectRatio="square"
                        helpText="Icon image"
                      />
                    </div>
                    <Input value={item.title} onChange={(e) => updateKeySpec(item.id, { title: e.target.value })} placeholder="Title" className="flex-1 min-w-[120px]" />
                    <Input value={item.description} onChange={(e) => updateKeySpec(item.id, { description: e.target.value })} placeholder="Description" className="flex-1 min-w-[180px]" />
                    <Button variant="outline" size="icon" onClick={() => removeKeySpec(item.id)} className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addKeySpec}>
                  <Plus className="w-4 h-4 mr-2" /> Add key specification
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>Address, highlights, and map</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address (for location section)</Label>
                <Input
                  id="address"
                  value={property.specifications?.address}
                  onChange={(e) => updateSpecifications({ address: e.target.value })}
                  placeholder="e.g., Martonstrasse 26, 80937 Munich"
                />
                <p className="text-xs text-muted-foreground">
                  Shown in the location block and in the hero bar when no hero specifications are set
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationTitle">Location Section Title</Label>
                <Input
                  id="locationTitle"
                  value={property.locationTitle}
                  onChange={(e) => updateProperty({ locationTitle: e.target.value })}
                  placeholder="e.g., THE LOCATION"
                />
              </div>

              <div className="space-y-3">
                <Label>Location Highlights</Label>
                {property.locationHighlights?.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateLocationHighlight(index, e.target.value)}
                      placeholder="e.g., Vast, protected natural landscapes"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeLocationHighlight(index)}
                      className="flex-shrink-0 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addLocationHighlight}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Highlight
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationDescription">Location Description</Label>
                <Textarea
                  id="locationDescription"
                  value={property.locationDescription}
                  onChange={(e) => updateProperty({ locationDescription: e.target.value })}
                  placeholder="Detailed description of the location advantages..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
                <Input
                  id="mapEmbedUrl"
                  value={property.mapEmbedUrl}
                  onChange={(e) => updateProperty({ mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?..."
                />
                <p className="text-xs text-muted-foreground">
                  Paste the embed URL from Google Maps
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Construction Phases Tab */}
        <TabsContent value="phases">
          <Card>
            <CardHeader>
              <CardTitle>Construction Phases</CardTitle>
              <CardDescription>Add multiple construction phase tabs, each with its own image and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="constructionPhasesTitle">Section Title</Label>
                <Input
                  id="constructionPhasesTitle"
                  value={property.constructionPhasesTitle}
                  onChange={(e) => updateProperty({ constructionPhasesTitle: e.target.value })}
                  placeholder="e.g., ALL CONSTRUCTION PHASES"
                />
              </div>

              <div className="space-y-6">
                {property.constructionPhases?.map((phase, index) => (
                  <div key={phase.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Phase {index + 1}: {phase.title || "Untitled"}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeConstructionPhase(phase.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tab Title *</Label>
                        <Input
                          value={phase.title}
                          onChange={(e) => updateConstructionPhase(phase.id, { title: e.target.value })}
                          placeholder="e.g., Phase 1 - Foundation"
                        />
                        <p className="text-xs text-muted-foreground">
                          This title will appear as a clickable tab on the property page
                        </p>
                      </div>

                      <ImageUpload
                        label="Phase Image"
                        value={phase.image}
                        onChange={(url) => updateConstructionPhase(phase.id, { image: url })}
                        folder="properties/phases"
                        aspectRatio="video"
                        helpText="Upload a construction phase photo"
                      />

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={phase.description}
                          onChange={(e) => updateConstructionPhase(phase.id, { description: e.target.value })}
                          placeholder="Additional details about this construction phase..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addConstructionPhase} className="w-full border-dashed bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Construction Phase Tab
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Contact</CardTitle>
              <CardDescription>Contact information for appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="consultationTitle">Section Title</Label>
                <Input
                  id="consultationTitle"
                  value={property.consultationTitle}
                  onChange={(e) => updateProperty({ consultationTitle: e.target.value })}
                  placeholder="e.g., SCHEDULE A PERSONAL CONSULTATION APPOINTMENT"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consultationPhone">Phone Number</Label>
                  <Input
                    id="consultationPhone"
                    value={property.consultationPhone}
                    onChange={(e) => updateProperty({ consultationPhone: e.target.value })}
                    placeholder="e.g., 089 710 409 96"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultationEmail">Email</Label>
                  <Input
                    id="consultationEmail"
                    value={property.consultationEmail}
                    onChange={(e) => updateProperty({ consultationEmail: e.target.value })}
                    placeholder="e.g., lindenpark@conceptbau.de"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultationDisclaimer">Disclaimer Text</Label>
                <Textarea
                  id="consultationDisclaimer"
                  value={property.consultationDisclaimer}
                  onChange={(e) => updateProperty({ consultationDisclaimer: e.target.value })}
                  placeholder="Legal disclaimer or additional information..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Property Gallery</CardTitle>
              <CardDescription>Additional images for the gallery section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {property.galleryImages?.map((image, index) => (
                  <div key={index} className="relative">
                    <ImageUpload
                      label={`Gallery Image ${index + 1}`}
                      value={image}
                      onChange={(url) => updateGalleryImage(index, url)}
                      folder="properties/gallery"
                      aspectRatio="video"
                      maxSizeType="gallery"
                      helpText="Max 10MB"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-8 right-2"
                      onClick={() => removeGalleryImage(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addGalleryImage}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-gold hover:text-gold transition-colors bg-transparent"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-sm">Add Image</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
