"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  currentImageUrl?: string
  componentId?: string // Add component ID to isolate image state
}

export function ImageUpload({ onImageUploaded, currentImageUrl, componentId }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize preview with currentImageUrl when component mounts or currentImageUrl changes
  useEffect(() => {
    // Only log when the image URL actually changes
    if (currentImageUrl !== imageUrl) {
      console.log(`ImageUpload for component ${componentId || "unknown"} - Image URL updated`)
    }

    if (currentImageUrl) {
      setPreview(currentImageUrl)
      setImageUrl(currentImageUrl)
    } else {
      setPreview(null)
      setImageUrl(null)
    }
  }, [currentImageUrl, componentId])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)

      // Create a preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      // In v0 environment, we'll simulate a successful upload
      // In a real app, you would upload to a server
      setTimeout(() => {
        setIsUploading(false)
        // Use the object URL as the image URL
        setImageUrl(objectUrl)
        onImageUploaded(objectUrl)
      }, 1000)
    } catch (err) {
      console.error("Error in handleFileChange:", err)
      setError("An unexpected error occurred")
      setIsUploading(false)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    if (url) {
      setPreview(url)
      onImageUploaded(url)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onImageUploaded("/placeholder.jpg") // Reset to placeholder
  }

  // Helper function to get a display URL for the image preview
  const getDisplayUrl = () => {
    if (preview) return preview
    if (currentImageUrl) return currentImageUrl
    return "/placeholder.jpg"
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />

      {getDisplayUrl() ? (
        <div className="relative border rounded-md overflow-hidden">
          <img
            src={getDisplayUrl() || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-auto max-h-48 object-contain"
            onError={() => {
              console.log("Image preview error, falling back to placeholder")
              setPreview("/placeholder.jpg")
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleButtonClick}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
        >
          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to upload an image</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WebP</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="text-xs flex-1"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-3 w-3 mr-1" />
              {preview ? "Change Image" : "Upload Image"}
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <Input
          type="text"
          value={imageUrl || ""}
          onChange={handleUrlChange}
          placeholder="Or enter image URL"
          className="mt-2"
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
