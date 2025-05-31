"use client"

import { useRef } from "react"
import {
  Type,
  ImageIcon,
  FootprintsIcon as FooterIcon,
  MousePointer,
  Heading1,
  LayoutGrid,
  Columns,
  LayoutList,
} from "lucide-react"

interface HtmlEmailBlockSelectorProps {
  position?: { x: number; y: number }
  isFixed?: boolean
  isFloating?: boolean
  onSelectBlock: (blockId: string) => void
  onClose: () => void
}

export function HtmlEmailBlockSelector({
  position,
  isFixed = false,
  isFloating = false,
  onSelectBlock,
  onClose,
}: HtmlEmailBlockSelectorProps) {
  const selectorRef = useRef<HTMLDivElement>(null)

  const availableBlocks = [
    { id: "header-banner", name: "Header Banner", icon: "header", category: "header" },
    { id: "text-section", name: "Text Section", icon: "text", category: "content" },
    { id: "full-width-image", name: "Full Width Image", icon: "image", category: "media" },
    { id: "two-column-images", name: "Two Column Images", icon: "columns-2", category: "layout" },
    { id: "three-column-images", name: "Three Column Images", icon: "columns-3", category: "layout" },
    { id: "hero-banner", name: "Hero Banner", icon: "hero", category: "header" },
    { id: "image-text-section", name: "Image & Text", icon: "image-text", category: "content" },
    { id: "button-grid", name: "Button Grid", icon: "buttons", category: "buttons" },
    { id: "single-button", name: "Single Button", icon: "button", category: "buttons" },
    { id: "footer", name: "Footer", icon: "footer", category: "footer" },
  ]

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "header":
        return <Heading1 className="h-6 w-6" />
      case "text":
        return <Type className="h-6 w-6" />
      case "image":
        return <ImageIcon className="h-6 w-6" />
      case "columns-2":
        return <Columns className="h-6 w-6" />
      case "columns-3":
        return <LayoutGrid className="h-6 w-6" />
      case "button":
        return <MousePointer className="h-6 w-6" />
      case "buttons":
        return <LayoutList className="h-6 w-6" />
      case "image-text":
        return <LayoutGrid className="h-6 w-6" />
      case "hero":
        return <ImageIcon className="h-6 w-6" />
      case "footer":
        return <FooterIcon className="h-6 w-6" />
      default:
        return <Type className="h-6 w-6" />
    }
  }

  const handleSelectBlock = (blockId: string) => {
    console.log("Block selected:", blockId)

    // Add more detailed logging
    console.log("Calling onSelectBlock with:", blockId)
    console.log("isFloating:", isFloating)

    // Call the onSelectBlock function
    onSelectBlock(blockId)

    // Close the selector if it's floating
    if (isFloating) {
      console.log("Closing floating selector")
      onClose()
    }
  }

  // Replace the grid rendering with an icons-only version
  return (
    <div ref={selectorRef} onClick={(e) => e.stopPropagation()}>
      <div className="mb-4">
        <h3 className="text-sm font-medium">Blocks</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {availableBlocks.map((block) => (
          <button
            key={block.id}
            className="flex flex-col items-center justify-center p-3 rounded hover:bg-gray-50 transition-colors"
            onClick={() => handleSelectBlock(block.id)}
            draggable="true"
            title={block.name}
          >
            <div className="text-gray-600">{getIconComponent(block.icon)}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
