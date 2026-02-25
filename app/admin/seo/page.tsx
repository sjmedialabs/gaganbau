"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Save, Eye, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { defaultHomeContent } from "@/lib/default-content"
import type { SEOData, HomePageContent } from "@/lib/types"
import { ImageUpload } from "@/components/admin/ImageUpload"

export default function SEOEditor() {
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [seo, setSeo] = useState<SEOData>(defaultHomeContent.seo)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content/home")
        if (res.ok) {
          const data = await res.json()
          setContent(data)
          setSeo(data.seo || defaultHomeContent.seo)
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
        seo,
      }

      const res = await fetch("/api/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      })

      if (res.ok) {
        toast.success("SEO settings saved successfully!")
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

  // SEO validation
  const titleLength = seo.metaTitle.length
  const descriptionLength = seo.metaDescription.length
  const isTitleOptimal = titleLength >= 50 && titleLength <= 60
  const isDescriptionOptimal = descriptionLength >= 150 && descriptionLength <= 160

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage search engine optimization for your home page
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* SEO Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meta Tags</CardTitle>
              <CardDescription>
                Configure meta tags for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <span className={`text-xs ${isTitleOptimal ? "text-green-600" : "text-amber-600"}`}>
                    {titleLength}/60 characters
                  </span>
                </div>
                <Input
                  id="meta-title"
                  value={seo.metaTitle}
                  onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                  placeholder="Enter meta title"
                />
                <p className="text-xs text-muted-foreground">
                  Optimal length: 50-60 characters
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <span className={`text-xs ${isDescriptionOptimal ? "text-green-600" : "text-amber-600"}`}>
                    {descriptionLength}/160 characters
                  </span>
                </div>
                <Textarea
                  id="meta-description"
                  value={seo.metaDescription}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  placeholder="Enter meta description"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Optimal length: 150-160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical">Canonical URL</Label>
                <Input
                  id="canonical"
                  value={seo.canonicalUrl}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  placeholder="Enter canonical URL"
                />
              </div>

              <div className="space-y-2">
                <ImageUpload
                  label="Open Graph Image"
                  value={seo.ogImage}
                  onChange={(url) => setSeo({ ...seo, ogImage: url })}
                  folder="seo"
                  aspectRatio="video"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200x630 pixels
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label htmlFor="no-index">No Index</Label>
                  <p className="text-xs text-muted-foreground">
                    Prevent search engines from indexing this page
                  </p>
                </div>
                <Switch
                  id="no-index"
                  checked={seo.noIndex}
                  onCheckedChange={(checked) => setSeo({ ...seo, noIndex: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Status */}
        <div className="space-y-6">
          {/* Google Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Google Search Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-white rounded border">
                <p className="text-blue-700 text-lg font-medium truncate hover:underline cursor-pointer">
                  {seo.metaTitle || "Page Title"}
                </p>
                <p className="text-green-700 text-sm truncate">
                  {seo.canonicalUrl || "https://example.com"}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                  {seo.metaDescription || "Meta description will appear here..."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {isTitleOptimal ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-sm">Meta title length</span>
              </div>
              <div className="flex items-center gap-2">
                {isDescriptionOptimal ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-sm">Meta description length</span>
              </div>
              <div className="flex items-center gap-2">
                {seo.ogImage ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-sm">OG Image set</span>
              </div>
              <div className="flex items-center gap-2">
                {seo.canonicalUrl ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-sm">Canonical URL set</span>
              </div>
              <div className="flex items-center gap-2">
                {!seo.noIndex ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-sm">Page is indexable</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
