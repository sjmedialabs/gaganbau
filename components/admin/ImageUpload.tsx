"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ImageIcon, Loader2, Upload, Trash2 } from "lucide-react"

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  folder?: string
  aspectRatio?: "video" | "square" | "auto" | "portrait"
  className?: string
  maxSizeType?: "image" | "logo" | "gallery"
  helpText?: string
}

export function ImageUpload({
  label,
  value,
  onChange,
  folder = "images",
  aspectRatio = "video",
  className = "",
  maxSizeType = "image",
  helpText,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)
      formData.append("maxSizeType", maxSizeType)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        const url = data?.url
        if (typeof url === "string" && url.trim()) {
          onChange(url.trim())
          toast.success("Image uploaded successfully!")
        } else {
          toast.error("Upload succeeded but no image URL was returned.")
        }
      } else {
        const data = await res.json().catch(() => ({}))
        const message = data?.details || data?.error || "Failed to upload image"
        toast.error(message)
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  const aspectClass = {
    video: "aspect-video",
    square: "aspect-square",
    auto: "min-h-[120px]",
    portrait: "aspect-[3/4]",
  }[aspectRatio]

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
      <div className={`relative max-w-[160px] max-h-[100px] ${aspectClass} bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors`}>
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={value}
              src={value || "/placeholder.svg"}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => toast.error("Image failed to load. The URL may be invalid or the file was not saved (e.g. enable Firebase Storage if deployed).")}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span className="ml-2">Replace</span>
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm">Click to upload</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
