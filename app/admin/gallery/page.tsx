"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import {
  Plus,
  Loader2,
  Trash2,
  GripVertical,
  ImageIcon,
  Upload,
  X,
  Eye,
  FolderOpen,
} from "lucide-react"
import type { GalleryAlbum, GalleryImage, Property } from "@/lib/types"

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [newAlbum, setNewAlbum] = useState({
    propertyId: "",
    propertyName: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [albumsRes, propertiesRes] = await Promise.all([
        fetch("/api/gallery"),
        fetch("/api/properties"),
      ])
      const albumsData = await albumsRes.json()
      const propertiesData = await propertiesRes.json()
      setAlbums(albumsData.albums || [])
      setProperties(propertiesData.properties || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlbum = async () => {
    if (!newAlbum.propertyId) {
      toast.error("Please select a property")
      return
    }

    const property = properties.find((p) => p.id === newAlbum.propertyId)
    if (!property) return

    setSaving(true)
    try {
      const album: Omit<GalleryAlbum, "id" | "createdAt" | "updatedAt"> = {
        propertyId: property.id,
        propertyName: property.projectName,
        coverImage: property.heroImage || "/placeholder.svg",
        images: [],
        order: albums.length,
        isActive: true,
      }

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(album),
      })

      if (res.ok) {
        toast.success("Album created successfully")
        setIsCreateDialogOpen(false)
        setNewAlbum({ propertyId: "", propertyName: "" })
        fetchData()
      } else {
        throw new Error("Failed to create album")
      }
    } catch (error) {
      console.error("Failed to create album:", error)
      toast.error("Failed to create album")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAlbum = async (albumId: string) => {
    try {
      const res = await fetch(`/api/gallery/${albumId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Album deleted successfully")
        setAlbums(albums.filter((a) => a.id !== albumId))
        if (selectedAlbum?.id === albumId) {
          setSelectedAlbum(null)
        }
      } else {
        throw new Error("Failed to delete album")
      }
    } catch (error) {
      console.error("Failed to delete album:", error)
      toast.error("Failed to delete album")
    }
  }

  const handleUploadImages = async (files: FileList) => {
    if (!selectedAlbum) return

    setUploadingImages(true)
    const newImages: GalleryImage[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`)
          continue
        }

        // Validate file size (10MB max for gallery)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 10MB)`)
          continue
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", `gallery/${selectedAlbum.propertyId}`)
        formData.append("maxSizeType", "gallery")

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          newImages.push({
            id: `img-${Date.now()}-${i}`,
            url: data.url,
            caption: "",
            order: selectedAlbum.images.length + i,
          })
        }
      }

      if (newImages.length > 0) {
        const updatedAlbum = {
          ...selectedAlbum,
          images: [...selectedAlbum.images, ...newImages],
          coverImage: selectedAlbum.images.length === 0 ? newImages[0].url : selectedAlbum.coverImage,
        }

        const res = await fetch(`/api/gallery/${selectedAlbum.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAlbum),
        })

        if (res.ok) {
          setSelectedAlbum(updatedAlbum)
          setAlbums(albums.map((a) => (a.id === selectedAlbum.id ? updatedAlbum : a)))
          toast.success(`${newImages.length} images uploaded successfully`)
        }
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload images")
    } finally {
      setUploadingImages(false)
      setIsUploadDialogOpen(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!selectedAlbum) return

    const updatedImages = selectedAlbum.images.filter((img) => img.id !== imageId)
    const updatedAlbum = {
      ...selectedAlbum,
      images: updatedImages,
      coverImage: updatedImages.length > 0 ? updatedImages[0].url : "/placeholder.svg",
    }

    try {
      const res = await fetch(`/api/gallery/${selectedAlbum.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAlbum),
      })

      if (res.ok) {
        setSelectedAlbum(updatedAlbum)
        setAlbums(albums.map((a) => (a.id === selectedAlbum.id ? updatedAlbum : a)))
        toast.success("Image deleted")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete image")
    }
  }

  const handleUpdateCaption = async (imageId: string, caption: string) => {
    if (!selectedAlbum) return

    const updatedImages = selectedAlbum.images.map((img) =>
      img.id === imageId ? { ...img, caption } : img
    )
    const updatedAlbum = { ...selectedAlbum, images: updatedImages }

    setSelectedAlbum(updatedAlbum)
    setAlbums(albums.map((a) => (a.id === selectedAlbum.id ? updatedAlbum : a)))

    // Debounced save
    try {
      await fetch(`/api/gallery/${selectedAlbum.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAlbum),
      })
    } catch (error) {
      console.error("Save error:", error)
    }
  }

  const handleSetCoverImage = async (imageUrl: string) => {
    if (!selectedAlbum) return

    const updatedAlbum = { ...selectedAlbum, coverImage: imageUrl }

    try {
      const res = await fetch(`/api/gallery/${selectedAlbum.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAlbum),
      })

      if (res.ok) {
        setSelectedAlbum(updatedAlbum)
        setAlbums(albums.map((a) => (a.id === selectedAlbum.id ? updatedAlbum : a)))
        toast.success("Cover image updated")
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Failed to update cover image")
    }
  }

  // Get properties that don't have albums yet
  const availableProperties = properties.filter(
    (p) => !albums.some((a) => a.propertyId === p.id)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gallery Management</h1>
          <p className="text-muted-foreground">
            Manage property photo albums and gallery images
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={availableProperties.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Create Album
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Album</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Property</Label>
                <Select
                  value={newAlbum.propertyId}
                  onValueChange={(value) => setNewAlbum({ ...newAlbum, propertyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.projectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableProperties.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    All properties already have albums. Create a new property first.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAlbum}
                  disabled={saving || !newAlbum.propertyId}
                >
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Album
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Albums List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Albums</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {albums.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No albums yet</p>
                  <p className="text-sm">Create your first album to get started</p>
                </div>
              ) : (
                albums.map((album) => (
                  <div
                    key={album.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedAlbum?.id === album.id
                        ? "bg-primary/10 border border-primary"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                    onClick={() => setSelectedAlbum(album)}
                  >
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={album.coverImage || "/placeholder.svg"}
                        alt={album.propertyName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{album.propertyName}</p>
                      <p className="text-sm text-muted-foreground">
                        {album.images.length} images
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Album</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this album? This will remove all
                            images in the album. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAlbum(album.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Album Images */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {selectedAlbum ? selectedAlbum.propertyName : "Select an Album"}
              </CardTitle>
              {selectedAlbum && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/gallery`, "_blank")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Images
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Images</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div
                          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {uploadingImages ? (
                            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                          ) : (
                            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          )}
                          <p className="font-medium">
                            {uploadingImages ? "Uploading..." : "Click to select images"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            JPEG, PNG, WebP up to 10MB each
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleUploadImages(e.target.files)
                            }
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {!selectedAlbum ? (
                <div className="text-center py-16 text-muted-foreground">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select an album to manage its images</p>
                </div>
              ) : selectedAlbum.images.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No images in this album</p>
                  <p className="text-sm">Upload images to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedAlbum.images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative rounded-lg overflow-hidden bg-muted"
                    >
                      <div className="aspect-square">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.caption || "Gallery image"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end gap-1">
                          {selectedAlbum.coverImage !== image.url && (
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-8 h-8"
                              onClick={() => handleSetCoverImage(image.url)}
                              title="Set as cover"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="destructive"
                            className="w-8 h-8"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <Input
                          placeholder="Enter caption"
                          value={image.caption || ""}
                          onChange={(e) => handleUpdateCaption(image.id, e.target.value)}
                          className="bg-white/90 text-foreground text-xs h-8"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Cover badge */}
                      {selectedAlbum.coverImage === image.url && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
