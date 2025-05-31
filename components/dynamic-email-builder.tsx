"use client"

import type React from "react"
import { useState, useEffect } from "react"

// Skeleton loader for the email builder
function EmailBuilderSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="h-16 bg-gray-200 rounded-md mb-8 animate-pulse"></div>
        <div className="flex gap-8">
          <div className="w-20 h-[calc(100vh-150px)] bg-gray-200 rounded-md animate-pulse"></div>
          <div className="flex-1 h-[calc(100vh-150px)] bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-80 h-[calc(100vh-150px)] bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

// This component handles the dynamic import of the EmailBuilder
export default function DynamicEmailBuilder() {
  const [EmailBuilderComponent, setEmailBuilderComponent] = useState<React.ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only import the component on the client side
    const importEmailBuilder = async () => {
      try {
        const module = await import("./email-builder")
        setEmailBuilderComponent(() => module.default)
      } catch (error) {
        console.error("Failed to load EmailBuilder:", error)
      } finally {
        setIsLoading(false)
      }
    }

    importEmailBuilder()
  }, [])

  if (isLoading || !EmailBuilderComponent) {
    return <EmailBuilderSkeleton />
  }

  return <EmailBuilderComponent />
}
