"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { logger } from "@/utils/logger"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  style,
  priority = false,
  objectFit = "cover",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || "/placeholder.jpg")
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Update source if prop changes
  useEffect(() => {
    if (src !== imgSrc && !hasError) {
      setImgSrc(src)
      setIsLoading(true)
    }
  }, [src, imgSrc, hasError])

  // Handle image loading error
  const handleError = () => {
    if (!hasError) {
      logger.warn("Image failed to load, using placeholder", { src })
      setHasError(true)
      setImgSrc("/placeholder.jpg")
      setIsLoading(false)
      onError?.()
    }
  }

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  // Determine if we should use next/image or a regular img tag
  const isNextImage =
    !imgSrc.startsWith("blob:") && !imgSrc.startsWith("data:") && (imgSrc.startsWith("/") || imgSrc.startsWith("http"))

  if (isNextImage) {
    return (
      <div className={`relative ${className || ""}`} style={style}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          src={imgSrc || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={className}
          style={{
            objectFit,
            ...style,
          }}
          onLoad={handleLoad}
          onError={handleError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    )
  }

  // Fallback to regular img for blob URLs and data URLs
  return (
    <div className={`relative ${className || ""}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={className}
        style={{
          objectFit,
          width: "100%",
          height: "auto",
          ...style,
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
