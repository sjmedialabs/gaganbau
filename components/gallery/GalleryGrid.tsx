"use client"

import React from "react"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GalleryAlbum, GalleryImage } from "@/lib/types"

interface GalleryGridProps {
  albums: GalleryAlbum[]
}

export function GalleryGrid({ albums }: GalleryGridProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (album: GalleryAlbum, index: number) => {
    setSelectedAlbum(album)
    setCurrentImageIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ""
  }

  const nextImage = () => {
    if (!selectedAlbum) return
    setCurrentImageIndex((prev) =>
      prev === selectedAlbum.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!selectedAlbum) return
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedAlbum.images.length - 1 : prev - 1
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
  }

  return (
    <>
      {/* Album Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.map((album) => (
          <div
            key={album.id}
            className="group cursor-pointer"
            onClick={() => setSelectedAlbum(album)}
          >
            {/* Cover Image */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
              <img
                src={album.coverImage || "/placeholder.svg"}
                alt={album.propertyName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Image count badge */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-navy px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                {album.images.length} Photos
              </div>
            </div>

            {/* Album Info */}
            <h3 className="text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
              {album.propertyName}
            </h3>
          </div>
        ))}
      </div>

      {/* Album View Modal */}
      {selectedAlbum && !lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedAlbum(null)}
        >
          <div
            className="bg-background rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-2xl font-semibold">{selectedAlbum.propertyName}</h2>
                <p className="text-muted-foreground">
                  {selectedAlbum.images.length} photos
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedAlbum(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Image Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedAlbum.images.map((image, index) => (
                  <div
                    key={image.id}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(selectedAlbum, index)}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.caption || `Photo ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && selectedAlbum && (
        <div
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
            onClick={prevImage}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
            onClick={nextImage}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          {/* Image */}
          <div className="max-w-[90vw] max-h-[90vh] flex flex-col items-center">
            <img
              src={selectedAlbum.images[currentImageIndex]?.url || "/placeholder.svg"}
              alt={selectedAlbum.images[currentImageIndex]?.caption || "Gallery image"}
              className="max-w-full max-h-[80vh] object-contain"
            />
            
            {/* Caption */}
            {selectedAlbum.images[currentImageIndex]?.caption && (
              <p className="text-white text-center mt-4 px-4">
                {selectedAlbum.images[currentImageIndex].caption}
              </p>
            )}

            {/* Counter */}
            <p className="text-white/60 text-sm mt-2">
              {currentImageIndex + 1} / {selectedAlbum.images.length}
            </p>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto py-2 px-4">
            {selectedAlbum.images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={`w-16 h-16 rounded overflow-hidden flex-shrink-0 transition-all ${
                  index === currentImageIndex
                    ? "ring-2 ring-white scale-110"
                    : "opacity-50 hover:opacity-100"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
