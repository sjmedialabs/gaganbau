"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Database, RefreshCw, CheckCircle2, AlertCircle, Upload, Building2, Images } from "lucide-react"

export default function DatabasePage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<{
    success: boolean
    message: string
    uploadedImages?: number
    propertiesCount?: number
    galleryAlbumsCount?: number
  } | null>(null)
  const { toast } = useToast()

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    setSeedResult(null)

    try {
      const res = await fetch("/api/seed", {
        method: "POST",
      })

      const data = await res.json()

      if (res.ok) {
        setSeedResult({
          success: true,
          message: data.message || "Database seeded successfully",
          uploadedImages: data.uploadedImages,
          propertiesCount: data.propertiesCount,
          galleryAlbumsCount: data.galleryAlbumsCount,
        })
        toast({
          title: "Success",
          description: `Database seeded: ${data.propertiesCount} properties, ${data.galleryAlbumsCount} gallery albums`,
        })
      } else {
        setSeedResult({
          success: false,
          message: data.error || "Failed to seed database",
        })
        toast({
          title: "Error",
          description: data.error || "Failed to seed database",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Seed error:", error)
      setSeedResult({
        success: false,
        message: "An error occurred while seeding the database",
      })
      toast({
        title: "Error",
        description: "An error occurred while seeding the database",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Database Management</h1>
        <p className="text-muted-foreground mt-1">
          Initialize and manage your database content
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Seed Database Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-gold" />
              Initialize Database
            </CardTitle>
            <CardDescription>
              Upload all images to Vercel Blob storage and initialize the home page content, properties, and gallery albums with proper URLs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>This will:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Upload all local images to Vercel Blob storage</li>
                <li>Create the home page content with blob URLs</li>
                <li>Create 6 comprehensive sample properties (2 On Sale, 2 In Planning, 2 Reference)</li>
                <li>Create 3 gallery albums with sample images</li>
                <li>Skip images that are already uploaded</li>
              </ul>
            </div>

            <Button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="w-full bg-gold hover:bg-gold-dark text-white"
            >
              {isSeeding ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Initialize Database
                </>
              )}
            </Button>

            {seedResult && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  seedResult.success
                    ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {seedResult.success ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{seedResult.message}</p>
                  {seedResult.uploadedImages !== undefined && (
                    <p className="text-sm mt-1">
                      {seedResult.uploadedImages} images uploaded to Blob storage
                    </p>
                  )}
                  {seedResult.propertiesCount !== undefined && (
                    <p className="text-sm mt-1">
                      {seedResult.propertiesCount} properties created
                    </p>
                  )}
                  {seedResult.galleryAlbumsCount !== undefined && (
                    <p className="text-sm mt-1">
                      {seedResult.galleryAlbumsCount} gallery albums created
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gold" />
              Content Status
            </CardTitle>
            <CardDescription>
              Current state of your database content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm">Home Page Content</span>
                <span className="text-xs px-2 py-1 rounded bg-muted">Check API</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm">Hero Slides</span>
                <span className="text-xs px-2 py-1 rounded bg-muted">3 slides</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gold" />
                  Properties
                </span>
                <span className="text-xs px-2 py-1 rounded bg-gold/10 text-gold font-medium">
                  {seedResult?.propertiesCount || "6"} properties
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm flex items-center gap-2">
                  <Images className="w-4 h-4 text-gold" />
                  Gallery Albums
                </span>
                <span className="text-xs px-2 py-1 rounded bg-gold/10 text-gold font-medium">
                  {seedResult?.galleryAlbumsCount || "3"} albums
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Press Releases</span>
                <span className="text-xs px-2 py-1 rounded bg-muted">3 items</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How it Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ol className="space-y-2">
              <li>
                <strong>Click "Initialize Database"</strong> to upload all images from the public folder to Vercel Blob storage.
              </li>
              <li>
                <strong>Images are stored with public access</strong> and served via Vercel&apos;s edge network for fast delivery.
              </li>
              <li>
                <strong>Content is stored as JSON</strong> in Blob storage and fetched by the frontend via API routes.
              </li>
              <li>
                <strong>Edit content</strong> using the other admin pages - all changes will be saved to the database.
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
