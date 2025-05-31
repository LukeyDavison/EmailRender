"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Copy, Trash, ChevronUp, ChevronDown, Settings } from "lucide-react"

interface EmailComponent {
  id: string
  type: string
  props: any
  children?: EmailComponent[]
  selected?: boolean
}

interface ComponentProps {
  component: EmailComponent
  onClick: (component: EmailComponent, e: React.MouseEvent) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onMove: (id: string, direction: "up" | "down") => void
  onUpdateProps: (id: string, props: any) => void
}

export function Component({ component, onClick, onDelete, onDuplicate, onMove, onUpdateProps }: ComponentProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [renderKey, setRenderKey] = useState(0)
  const [editingButtonIndex, setEditingButtonIndex] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<{ field: string; index?: number } | null>(null)

  // Individual drag states for each text overlay
  const [isDraggingOverlay, setIsDraggingOverlay] = useState(false)
  const [isDraggingCTA, setIsDraggingCTA] = useState(false)
  const [isDraggingSubtitle2, setIsDraggingSubtitle2] = useState(false)

  const buttonTextRef = useRef<HTMLButtonElement>(null)
  const componentRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Default font settings
  const defaultFontFamily = "Georgia, 'Times New Roman', Times, serif"
  const defaultFontSize = 17
  const defaultTextColor = "#000000"
  const defaultFontWeight = "normal"
  const defaultLineHeight = 1.8
  const defaultLetterSpacing = "2px"
  const defaultTextAlign = "center"

  // Helper function to convert hex to rgba
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
      : "0, 0, 0"
  }

  // Ensure each component has its own isolated state
  useEffect(() => {
    if (component.selected) {
      console.log(`Component ${component.id} (${component.type}) is selected`)
    }
  }, [component.selected, component.id, component.type])

  // Optimized re-render handling - only when necessary
  useEffect(() => {
    setRenderKey((prev) => prev + 1)
  }, [component.props])

  // Optimized image URL handling
  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.jpg"
    if (url.startsWith("blob:") || url.startsWith("http") || url.startsWith("https")) return url
    return url
  }

  // Optimized SafeImage component
  const SafeImage = ({
    src,
    alt,
    className,
    style,
  }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) => {
    const [imgSrc, setImgSrc] = useState(getImageUrl(src))
    const [hasErrored, setHasErrored] = useState(false)

    const handleError = () => {
      if (!hasErrored) {
        setHasErrored(true)
        setImgSrc("/placeholder.jpg")
      }
    }

    return (
      <img src={imgSrc || "/placeholder.jpg"} alt={alt} className={className} style={style} onError={handleError} />
    )
  }

  // Optimized keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      ;(e.target as HTMLElement).blur()
    }
  }

  // Optimized cog click handler
  const handleCogClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick(component, e)
  }

  // Individual drag handlers for each text overlay
  const createDragHandler = (textType: "overlay" | "cta" | "subtitle2") => {
    return (e: React.MouseEvent) => {
      if (component.type !== "full-width-image") return

      const editModeKey =
        textType === "overlay" ? "overlayEditMode" : textType === "cta" ? "ctaEditMode" : "subtitle2EditMode"

      if (!component.props[editModeKey]) return

      e.preventDefault()
      e.stopPropagation()

      const container = imageContainerRef.current
      if (!container) return

      // Set the appropriate dragging state
      if (textType === "overlay") setIsDraggingOverlay(true)
      else if (textType === "cta") setIsDraggingCTA(true)
      else if (textType === "subtitle2") setIsDraggingSubtitle2(true)

      // Throttle updates for better performance
      let lastUpdate = 0
      const throttleMs = 16 // ~60fps

      const handleMouseMove = (e: MouseEvent) => {
        const now = Date.now()
        if (now - lastUpdate < throttleMs) return
        lastUpdate = now

        if (!container) return

        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Calculate percentage positions (0-100%)
        const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100))
        const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100))

        // Update component props with the appropriate keys
        const xKey = textType === "overlay" ? "overlayTextX" : textType === "cta" ? "ctaTextX" : "subtitle2TextX"
        const yKey = textType === "overlay" ? "overlayTextY" : textType === "cta" ? "ctaTextY" : "subtitle2TextY"

        onUpdateProps(component.id, {
          [xKey]: `${Math.round(xPercent)}%`,
          [yKey]: `${Math.round(yPercent)}%`,
        })
      }

      const handleMouseUp = () => {
        // Reset all dragging states
        setIsDraggingOverlay(false)
        setIsDraggingCTA(false)
        setIsDraggingSubtitle2(false)

        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
  }

  // Helper function for position display
  const getPositionKeywords = (xPercent: string, yPercent: string) => {
    const x = Number.parseFloat(xPercent)
    const y = Number.parseFloat(yPercent)

    let xPos = "center"
    let yPos = "center"

    if (x <= 25) xPos = "left"
    else if (x >= 75) xPos = "right"

    if (y <= 25) yPos = "top"
    else if (y >= 75) yPos = "bottom"

    return `${xPos} ${yPos}`
  }

  // Helper function to get text alignment styles
  const getTextAlignStyle = (align: string) => {
    switch (align) {
      case "left":
        return { left: "10%", transform: "translateY(-50%)" }
      case "right":
        return { right: "10%", transform: "translateY(-50%)" }
      default:
        return { left: "50%", transform: "translate(-50%, -50%)" }
    }
  }

  const renderComponentContent = () => {
    // Ensure props exists
    const props = component.props || {}

    switch (component.type) {
      case "brand-header":
        return (
          <table width="650" cellPadding="0" cellSpacing="0" border="0">
            <tbody>
              <tr>
                <td height={props.spacingTop || 30} bgcolor={props.backgroundColor || "#ffffff"}></td>
              </tr>
              <tr>
                <td height={props.borderHeight || 3} bgcolor={props.borderColor || "#000000"}></td>
              </tr>
              <tr>
                <td height={props.spacingBottom || 30}></td>
              </tr>
              <tr>
                <td bgcolor={props.backgroundColor || "#ffffff"}>
                  <table cellPadding="0" cellSpacing="0" width="100%">
                    <tbody>
                      <tr>
                        <td width="20"></td>
                        <td align="center">
                          <a
                            href="#"
                            target="_blank"
                            style={{ textDecoration: "none", fontWeight: "normal", color: "#000000" }}
                            rel="noreferrer"
                          >
                            <SafeImage
                              src={
                                props.logoUrl || "https://link.email.lkbennett.com/custloads/816689973/vce/logo1.png"
                              }
                              alt={props.logoAlt || "LK Bennett London"}
                              style={{ display: "block", width: `${props.logoWidth || 218}px`, border: 0 }}
                            />
                          </a>
                        </td>
                        <td width="20"></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td height={props.spacingBottom || 30}></td>
              </tr>
            </tbody>
          </table>
        )
      case "header-banner":
        return (
          <div
            className="p-4 bg-gray-100 text-center"
            style={{
              backgroundColor: props.backgroundColor || "#f8f9fa",
              color: props.textColor || defaultTextColor,
              padding: `${props.padding || 16}px`,
              borderRadius: `${props.borderRadius || 0}px`,
              borderWidth: props.borderWidth ? `${props.borderWidth}px` : 0,
              borderStyle: props.borderWidth ? "solid" : "none",
              borderColor: props.borderColor || "#cccccc",
              fontFamily: props.fontFamily || defaultFontFamily,
            }}
          >
            <h2
              className={`${editingField?.field === "title" ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
              style={{
                fontSize: `${props.fontSize || 35}px`,
                fontWeight: props.fontWeight || "normal",
                lineHeight: props.lineHeight || 1,
                letterSpacing: props.letterSpacing || defaultLetterSpacing,
              }}
              contentEditable="true"
              suppressContentEditableWarning={true}
              onFocus={() => setEditingField({ field: "title" })}
              onBlur={(e) => {
                const newText = e.currentTarget.textContent || "Header Title"
                onUpdateProps(component.id, { title: newText })
                setEditingField(null)
              }}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
            >
              {props.title || "Header Title"}
            </h2>
            {editingField?.field === "title" && (
              <div className="text-xs text-blue-500 animate-pulse mt-1">
                Editing... Click outside or press Enter when done
              </div>
            )}
          </div>
        )
      case "text-section":
        return (
          <div
            className="p-4"
            style={{
              backgroundColor: props.backgroundColor || "#ffffff",
              color: props.textColor || defaultTextColor,
              padding: `${props.padding || 16}px`,
              borderRadius: `${props.borderRadius || 0}px`,
              borderWidth: props.borderWidth ? `${props.borderWidth}px` : 0,
              borderStyle: props.borderWidth ? "solid" : "none",
              borderColor: props.borderColor || "#cccccc",
              fontFamily: props.fontFamily || defaultFontFamily,
              textAlign: props.textAlign || defaultTextAlign,
            }}
          >
            <p
              className={`${editingField?.field === "text" ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
              style={{
                fontSize: `${props.fontSize || defaultFontSize}px`,
                fontWeight: props.fontWeight || defaultFontWeight,
                fontStyle: props.italic ? "italic" : "normal",
                textDecoration: props.underline ? "underline" : "none",
                textAlign: props.textAlign || defaultTextAlign,
                lineHeight: props.lineHeight || defaultLineHeight,
                letterSpacing: props.letterSpacing || defaultLetterSpacing,
                whiteSpace: "pre-wrap",
              }}
              contentEditable="true"
              suppressContentEditableWarning={true}
              onFocus={() => setEditingField({ field: "text" })}
              onBlur={(e) => {
                const newText = e.currentTarget.textContent || "Text content goes here"
                onUpdateProps(component.id, { text: newText })
                setEditingField(null)
              }}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
            >
              {props.text || "Text content goes here"}
            </p>
            {editingField?.field === "text" && (
              <div className="text-xs text-blue-500 animate-pulse mt-1">
                Editing... Click outside or press Enter when done
              </div>
            )}
          </div>
        )
      case "full-width-image":
        const isOverlayEditMode = props.overlayEditMode || false
        const isCTAEditMode = props.ctaEditMode || false
        const isSubtitle2EditMode = props.subtitle2EditMode || false

        return (
          <div
            ref={imageContainerRef}
            style={{
              position: "relative",
              padding: `${props.padding || 0}px`,
              borderRadius: `${props.borderRadius || 0}px`,
              borderWidth: props.borderWidth ? `${props.borderWidth}px` : 0,
              borderStyle: props.borderWidth ? "solid" : "none",
              borderColor: props.borderColor || "#cccccc",
              overflow: "hidden",
              width: "100%",
              aspectRatio: "3/4",
              border: isOverlayEditMode || isCTAEditMode || isSubtitle2EditMode ? "2px dashed #3b82f6" : undefined,
            }}
          >
            {/* Edit mode indicators */}
            {(isOverlayEditMode || isCTAEditMode || isSubtitle2EditMode) && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(59, 130, 246, 0.9)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                  pointerEvents: "none",
                  zIndex: 20,
                }}
              >
                🎯 Edit Mode - Drag text to position
              </div>
            )}

            {/* Drag indicators */}
            {isDraggingOverlay && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  background: "rgba(0,0,0,0.8)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                  pointerEvents: "none",
                  zIndex: 25,
                }}
              >
                📍 Main Text: {getPositionKeywords(props.overlayTextX || "50%", props.overlayTextY || "50%")}
              </div>
            )}

            {isDraggingCTA && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  left: "10px",
                  background: "rgba(0,0,0,0.8)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                  pointerEvents: "none",
                  zIndex: 25,
                }}
              >
                📍 CTA: {getPositionKeywords(props.ctaTextX || "50%", props.ctaTextY || "70%")}
              </div>
            )}

            {isDraggingSubtitle2 && (
              <div
                style={{
                  position: "absolute",
                  top: "70px",
                  left: "10px",
                  background: "rgba(0,0,0,0.8)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                  pointerEvents: "none",
                  zIndex: 25,
                }}
              >
                📍 Subtitle 2: {getPositionKeywords(props.subtitle2TextX || "50%", props.subtitle2TextY || "30%")}
              </div>
            )}

            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${props.imageUrl || "/placeholder.jpg"})`,
                backgroundSize: `${props.backgroundScale || 100}%`,
                backgroundPosition: `${props.backgroundPositionX || "50%"} ${props.backgroundPositionY || "50%"}`,
                backgroundRepeat: "no-repeat",
                transition: "background-position 0.1s ease",
              }}
            />

            {/* Gradient Overlay */}
            {(props.overlayStartOpacity > 0 || props.overlayEndOpacity > 0) &&
              (props.overlayStartColor || props.overlayEndColor) && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      props.overlayStartColor === props.overlayEndColor
                        ? `rgba(${hexToRgb(props.overlayStartColor || "#000000")}, ${(props.overlayStartOpacity || 0) / 100})`
                        : `linear-gradient(to right, rgba(${hexToRgb(props.overlayStartColor || "#000000")}, ${(props.overlayStartOpacity || 0) / 100}), rgba(${hexToRgb(props.overlayEndColor || "#000000")}, ${(props.overlayEndOpacity || 0) / 100}))`,
                    pointerEvents: "none",
                  }}
                />
              )}

            {/* Main Text Overlay */}
            {props.overlayText && (
              <div
                style={{
                  position: "absolute",
                  top: props.overlayTextY || "50%",
                  ...getTextAlignStyle(props.overlayTextAlign || "center"),
                  color: props.overlayTextColor || "#ffffff",
                  fontSize: `${props.overlayTextSize || 24}px`,
                  fontWeight: props.overlayTextWeight || "bold",
                  fontFamily: props.overlayTextFont || "Georgia, 'Times New Roman', Times, serif",
                  textAlign: props.overlayTextAlign || "center",
                  textShadow: "none",
                  zIndex: 10,
                  cursor: isOverlayEditMode ? (isDraggingOverlay ? "grabbing" : "grab") : "default",
                  userSelect: isOverlayEditMode ? "none" : "auto",
                  pointerEvents: isOverlayEditMode ? "auto" : "none",
                }}
                onMouseDown={createDragHandler("overlay")}
                contentEditable={!isOverlayEditMode}
                suppressContentEditableWarning={true}
                onFocus={() => !isOverlayEditMode && setEditingField({ field: "overlayText" })}
                onBlur={(e) => {
                  if (!isOverlayEditMode) {
                    const newText = e.currentTarget.textContent || ""
                    onUpdateProps(component.id, { overlayText: newText })
                    setEditingField(null)
                  }
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => !isOverlayEditMode && e.stopPropagation()}
              >
                {props.overlayText}
              </div>
            )}

            {/* CTA Text Overlay */}
            {props.ctaText && (
              <div
                style={{
                  position: "absolute",
                  top: props.ctaTextY || "70%",
                  ...getTextAlignStyle(props.ctaTextAlign || "center"),
                  color: props.ctaTextColor || "#ffffff",
                  fontSize: `${props.ctaTextSize || 18}px`,
                  fontWeight: props.ctaTextWeight || "bold",
                  fontFamily: props.ctaTextFont || "Georgia, 'Times New Roman', Times, serif",
                  textAlign: props.ctaTextAlign || "center",
                  textShadow: "none",
                  zIndex: 11,
                  cursor: isCTAEditMode ? (isDraggingCTA ? "grabbing" : "grab") : "default",
                  userSelect: isCTAEditMode ? "none" : "auto",
                  pointerEvents: isCTAEditMode ? "auto" : "none",
                  padding: "8px 16px",
                  backgroundColor: props.ctaBackgroundColor || "rgba(0,0,0,0.3)",
                  borderRadius: "4px",
                }}
                onMouseDown={createDragHandler("cta")}
                contentEditable={!isCTAEditMode}
                suppressContentEditableWarning={true}
                onFocus={() => !isCTAEditMode && setEditingField({ field: "ctaText" })}
                onBlur={(e) => {
                  if (!isCTAEditMode) {
                    const newText = e.currentTarget.textContent || ""
                    onUpdateProps(component.id, { ctaText: newText })
                    setEditingField(null)
                  }
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => !isCTAEditMode && e.stopPropagation()}
              >
                {props.ctaText}
              </div>
            )}

            {/* Second Subtitle Text Overlay */}
            {props.subtitle2Text && (
              <div
                style={{
                  position: "absolute",
                  top: props.subtitle2TextY || "30%",
                  ...getTextAlignStyle(props.subtitle2TextAlign || "center"),
                  color: props.subtitle2TextColor || "#ffffff",
                  fontSize: `${props.subtitle2TextSize || 16}px`,
                  fontWeight: props.subtitle2TextWeight || "normal",
                  fontFamily: props.subtitle2TextFont || "Georgia, 'Times New Roman', Times, serif",
                  textAlign: props.subtitle2TextAlign || "center",
                  textShadow: "none",
                  zIndex: 12,
                  cursor: isSubtitle2EditMode ? (isDraggingSubtitle2 ? "grabbing" : "grab") : "default",
                  userSelect: isSubtitle2EditMode ? "none" : "auto",
                  pointerEvents: isSubtitle2EditMode ? "auto" : "none",
                }}
                onMouseDown={createDragHandler("subtitle2")}
                contentEditable={!isSubtitle2EditMode}
                suppressContentEditableWarning={true}
                onFocus={() => !isSubtitle2EditMode && setEditingField({ field: "subtitle2Text" })}
                onBlur={(e) => {
                  if (!isSubtitle2EditMode) {
                    const newText = e.currentTarget.textContent || ""
                    onUpdateProps(component.id, { subtitle2Text: newText })
                    setEditingField(null)
                  }
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => !isSubtitle2EditMode && e.stopPropagation()}
              >
                {props.subtitle2Text}
              </div>
            )}
          </div>
        )
      case "two-column-images":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <SafeImage
                src={props.image1Url || "/placeholder.jpg"}
                alt={props.image1Alt || "Image 1"}
                style={{ width: "100%", height: "auto" }}
              />
              {props.showButtons && (
                <button
                  className="w-full mt-2 px-4 py-2"
                  style={{
                    backgroundColor: props.buttonStyle === "filled" ? props.buttonColor || "#4285F4" : "transparent",
                    color:
                      props.buttonStyle === "filled"
                        ? props.buttonTextColor || "#ffffff"
                        : props.buttonTextColor || "#000000",
                    borderWidth:
                      props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0",
                    borderStyle:
                      props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none",
                    borderColor:
                      props.buttonStyle === "outlined" || props.buttonStyle === "underlined"
                        ? props.buttonColor || "#000000"
                        : "transparent",
                    fontFamily: props.fontFamily || defaultFontFamily,
                    fontSize: `${props.fontSize || defaultFontSize}px`,
                    letterSpacing: props.letterSpacing || "1.5px",
                  }}
                >
                  {props.button1Text || "Shop Now"}
                </button>
              )}
            </div>
            <div>
              <SafeImage
                src={props.image2Url || "/placeholder.jpg"}
                alt={props.image2Alt || "Image 2"}
                style={{ width: "100%", height: "auto" }}
              />
              {props.showButtons && (
                <button
                  className="w-full mt-2 px-4 py-2"
                  style={{
                    backgroundColor: props.buttonStyle === "filled" ? props.buttonColor || "#4285F4" : "transparent",
                    color:
                      props.buttonStyle === "filled"
                        ? props.buttonTextColor || "#ffffff"
                        : props.buttonTextColor || "#000000",
                    borderWidth:
                      props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0",
                    borderStyle:
                      props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none",
                    borderColor:
                      props.buttonStyle === "outlined" || props.buttonStyle === "underlined"
                        ? props.buttonColor || "#000000"
                        : "transparent",
                    fontFamily: props.fontFamily || defaultFontFamily,
                    fontSize: `${props.fontSize || defaultFontSize}px`,
                    letterSpacing: props.letterSpacing || "1.5px",
                  }}
                >
                  {props.button2Text || "Learn More"}
                </button>
              )}
            </div>
          </div>
        )
      case "three-column-images":
        return (
          <div
            className="grid grid-cols-3 gap-4"
            style={{
              backgroundColor: props.backgroundColor || "#ffffff",
              padding: `${props.padding || 16}px`,
              borderRadius: `${props.borderRadius || 0}px`,
              borderWidth: props.borderWidth ? `${props.borderWidth}px` : 0,
              borderStyle: props.borderWidth ? "solid" : "none",
              borderColor: props.borderColor || "#cccccc",
              gap: `${props.spacing || 8}px`,
            }}
          >
            <div>
              <SafeImage
                src={props.image1Url || "/placeholder.jpg"}
                alt={props.image1Alt || "Image 1"}
                style={{ width: "100%", height: "auto" }}
              />
              {props.showButtons && (
                <button
                  className="w-full mt-2 px-4 py-2"
                  style={{
                    backgroundColor: props.buttonStyle === "filled" ? props.buttonColor || "#4285F4" : "transparent",
                    color:
                      props.buttonStyle === "filled"
                        ? props.buttonTextColor || "#ffffff"
                        : props.buttonTextColor || "#000000",
                    borderWidth:
                      props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0",
                    borderStyle:
                      props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none",
                    borderColor:
                      props.buttonStyle === "outlined" || props.buttonStyle === "underlined"
                        ? props.buttonColor || "#000000"
                        : "transparent",
                    fontFamily: props.fontFamily || defaultFontFamily,
                    fontSize: `${props.fontSize || defaultFontSize}px`,
                    letterSpacing: props.letterSpacing || "1.5px",
                    textDecoration: props.buttonStyle === "underlined" ? "underline" : "none",
                    textUnderlineOffset: props.buttonStyle === "underlined" ? "5px" : "auto",
                  }}
                >
                  {props.button1Text || "Shop Now"}
                </button>
              )}
            </div>
            <div>
              <SafeImage
                src={props.image2Url || "/placeholder.jpg"}
                alt={props.image2Alt || "Image 2"}
                style={{ width: "100%", height: "auto" }}
              />
              {props.showButtons && (
                <button
                  className="w-full mt-2 px-4 py-2"
                  style={{
                    backgroundColor: props.buttonStyle === "filled" ? props.buttonColor || "#4285F4" : "transparent",
                    color:
                      props.buttonStyle === "filled"
                        ? props.buttonTextColor || "#ffffff"
                        : props.buttonTextColor || "#000000",
                    borderWidth:
                      props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0",
                    borderStyle:
                      props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none",
                    borderColor:
                      props.buttonStyle === "outlined" || props.buttonStyle === "underlined"
                        ? props.buttonColor || "#000000"
                        : "transparent",
                    fontFamily: props.fontFamily || defaultFontFamily,
                    fontSize: `${props.fontSize || defaultFontSize}px`,
                    letterSpacing: props.letterSpacing || "1.5px",
                    textDecoration: props.buttonStyle === "underlined" ? "underline" : "none",
                    textUnderlineOffset: props.buttonStyle === "underlined" ? "5px" : "auto",
                  }}
                >
                  {props.button2Text || "Learn More"}
                </button>
              )}
            </div>
            <div>
              <SafeImage
                src={props.image3Url || "/placeholder.jpg"}
                alt={props.image3Alt || "Image 3"}
                style={{ width: "100%", height: "auto" }}
              />
              {props.showButtons && (
                <button
                  className="w-full mt-2 px-4 py-2"
                  style={{
                    backgroundColor: props.buttonStyle === "filled" ? props.buttonColor || "#4285F4" : "transparent",
                    color:
                      props.buttonStyle === "filled"
                        ? props.buttonTextColor || "#ffffff"
                        : props.buttonTextColor || "#000000",
                    borderWidth:
                      props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0",
                    borderStyle:
                      props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none",
                    borderColor:
                      props.buttonStyle === "outlined" || props.buttonStyle === "underlined"
                        ? props.buttonColor || "#000000"
                        : "transparent",
                    fontFamily: props.fontFamily || defaultFontFamily,
                    fontSize: `${props.fontSize || defaultFontSize}px`,
                    letterSpacing: props.letterSpacing || "1.5px",
                    textDecoration: props.buttonStyle === "underlined" ? "underline" : "none",
                    textUnderlineOffset: props.buttonStyle === "underlined" ? "5px" : "auto",
                  }}
                >
                  {props.button3Text || "View More"}
                </button>
              )}
            </div>
          </div>
        )
      case "hero-banner":
        return (
          <div
            style={{
              position: "relative",
              padding: "32px",
              textAlign: "center",
              backgroundImage: `url(${props.imageUrl || "/placeholder.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: props.textColor || "#ffffff",
              minHeight: "200px",
              fontFamily: props.fontFamily || defaultFontFamily,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: props.overlayColor || "rgba(0,0,0,0.3)",
              }}
            ></div>
            <div style={{ position: "relative", zIndex: 10 }}>
              <h1
                style={{
                  fontWeight: props.fontWeight || "normal",
                  lineHeight: props.lineHeight || 1,
                  letterSpacing: props.letterSpacing || "2px",
                  fontSize: `${props.fontSize || 35}px`,
                  marginBottom: "8px",
                }}
                contentEditable="true"
                suppressContentEditableWarning={true}
                onFocus={() => setEditingField({ field: "title" })}
                onBlur={(e) => {
                  const newText = e.currentTarget.textContent || "Hero Title"
                  onUpdateProps(component.id, { title: newText })
                  setEditingField(null)
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              >
                {props.title || "Hero Title"}
              </h1>
              <p
                style={{
                  fontSize: `${props.subtitleFontSize || 17}px`,
                  lineHeight: props.lineHeight || 1.8,
                  letterSpacing: props.letterSpacing || "2px",
                  textDecoration: props.subtitleUnderlined ? "underline" : "none",
                  textUnderlineOffset: props.subtitleUnderlined ? "5px" : "auto",
                  marginBottom: "16px",
                }}
                contentEditable="true"
                suppressContentEditableWarning={true}
                onFocus={() => setEditingField({ field: "subtitle" })}
                onBlur={(e) => {
                  const newText = e.currentTarget.textContent || "Hero subtitle text"
                  onUpdateProps(component.id, { subtitle: newText })
                  setEditingField(null)
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              >
                {props.subtitle || "Hero subtitle text"}
              </p>
              <button
                style={{
                  backgroundColor: props.buttonStyle === "filled" ? props.buttonColor || "#000000" : "transparent",
                  color:
                    props.buttonStyle === "filled"
                      ? props.buttonTextColor || "#ffffff"
                      : props.buttonTextColor || "#ffffff",
                  letterSpacing: "1.5px",
                  padding: props.buttonStyle === "underlined" ? "15px 24px 5px" : "15px 24px",
                  fontFamily: props.fontFamily || defaultFontFamily,
                  borderWidth:
                    props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0",
                  borderStyle:
                    props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none",
                  borderColor:
                    props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "#ffffff" : "transparent",
                  borderRadius: "4px",
                }}
                contentEditable="true"
                suppressContentEditableWarning={true}
                onFocus={() => setEditingField({ field: "buttonText" })}
                onBlur={(e) => {
                  const newText = e.currentTarget.textContent || "Button"
                  onUpdateProps(component.id, { buttonText: newText })
                  setEditingField(null)
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              >
                {props.buttonText || "Button"}
              </button>
            </div>
          </div>
        )
      case "image-text-section":
        return (
          <div className="flex flex-row">
            <div className="w-1/3">
              <SafeImage
                src={props.imageUrl || "/placeholder.jpg"}
                alt={props.imageAlt || "Image"}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div
              className="w-2/3 p-4"
              style={{
                color: props.textColor || defaultTextColor,
                textAlign: props.textAlign || "left",
                fontFamily: props.fontFamily || defaultFontFamily,
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  lineHeight: props.lineHeight || 1.8,
                  letterSpacing: props.letterSpacing || "2px",
                }}
                contentEditable="true"
                suppressContentEditableWarning={true}
                onFocus={() => setEditingField({ field: "title" })}
                onBlur={(e) => {
                  const newText = e.currentTarget.textContent || "Section Title"
                  onUpdateProps(component.id, { title: newText })
                  setEditingField(null)
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              >
                {props.title || "Section Title"}
              </h3>
              <p
                style={{
                  fontSize: `${props.fontSize || defaultFontSize}px`,
                  fontWeight: props.fontWeight || defaultFontWeight,
                  lineHeight: props.lineHeight || 1.8,
                  letterSpacing: props.letterSpacing || "2px",
                }}
                contentEditable="true"
                suppressContentEditableWarning={true}
                onFocus={() => setEditingField({ field: "text" })}
                onBlur={(e) => {
                  const newText = e.currentTarget.textContent || "Section text content goes here"
                  onUpdateProps(component.id, { text: newText })
                  setEditingField(null)
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              >
                {props.text || "Section text content goes here"}
              </p>
              <button
                style={{
                  backgroundColor: props.buttonStyle === "filled" ? props.buttonColor || "#1a82e2" : "transparent",
                  color:
                    props.buttonStyle === "filled"
                      ? props.buttonTextColor || "#ffffff"
                      : props.buttonTextColor || "#000000",
                  letterSpacing: "1.5px",
                  padding: props.buttonStyle === "underlined" ? "15px 24px 5px" : "8px 16px",
                  fontFamily: props.fontFamily || defaultFontFamily,
                  borderWidth:
                    props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0",
                  borderStyle:
                    props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none",
                  borderColor:
                    props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "#000000" : "transparent",
                  marginTop: "12px",
                  borderRadius: "4px",
                }}
                contentEditable="true"
                suppressContentEditableWarning={true}
                onFocus={() => setEditingField({ field: "buttonText" })}
                onBlur={(e) => {
                  const newText = e.currentTarget.textContent || "Button"
                  onUpdateProps(component.id, { buttonText: newText })
                  setEditingField(null)
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              >
                {props.buttonText || "Button"}
              </button>
            </div>
          </div>
        )
      case "button-grid":
        const numButtons = props.buttonCount || 3
        return (
          <div
            className="space-y-4"
            style={{
              backgroundColor: props.backgroundColor || "#ffffff",
              padding: `${props.padding || 16}px`,
              borderRadius: `${props.borderRadius || 0}px`,
              borderWidth: props.borderWidth ? `${props.borderWidth}px` : 0,
              borderStyle: props.borderWidth ? "solid" : "none",
              borderColor: props.borderColor || "#cccccc",
            }}
          >
            {Array.from({ length: numButtons }).map((_, index) => (
              <button
                key={index}
                className={`px-4 py-3 w-full ${
                  editingButtonIndex === index ? "ring-2 ring-blue-500 ring-offset-2" : ""
                }`}
                style={{
                  backgroundColor: props.buttonStyle === "filled" ? props.buttonColor || "#000000" : "transparent",
                  color:
                    props.buttonStyle === "filled"
                      ? props.buttonTextColor || "#ffffff"
                      : props.buttonTextColor || "#000000",
                  width: "100%",
                  height: "auto",
                  minHeight: "48px",
                  fontSize: `${props.fontSize || defaultFontSize}px`,
                  fontWeight: props.fontWeight || defaultFontWeight,
                  lineHeight: props.lineHeight || defaultLineHeight,
                  letterSpacing: props.letterSpacing || "1.5px",
                  borderWidth:
                    props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0",
                  borderStyle:
                    props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none",
                  borderColor:
                    props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "#000000" : "transparent",
                  paddingBottom: props.buttonStyle === "underlined" ? "5px" : undefined,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <span
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  spellCheck="false"
                  onFocus={() => {
                    setEditingButtonIndex(index)
                  }}
                  onBlur={(e) => {
                    const newText = e.currentTarget.innerText || `Button ${index + 1}`
                    const propName = `button${index + 1}Text`
                    const newProps = { [propName]: newText }
                    if (typeof onUpdateProps === "function") {
                      onUpdateProps(component.id, newProps)
                    }
                    setEditingButtonIndex(null)
                  }}
                  onKeyDown={handleKeyDown}
                  style={{
                    display: "inline-block",
                    width: "100%",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {props[`button${index + 1}Text`] || `Button ${index + 1}`}
                </span>
              </button>
            ))}
          </div>
        )
      case "single-button":
        return (
          <div className="p-4 text-center">
            <button
              className={`px-6 py-3 min-w-[200px] ${
                editingField?.field === "buttonText" ? "ring-2 ring-blue-500 ring-offset-2" : ""
              }`}
              style={{
                backgroundColor: props.buttonStyle === "filled" ? props.buttonColor || "#000000" : "transparent",
                color:
                  props.buttonStyle === "filled"
                    ? props.buttonTextColor || "#ffffff"
                    : props.buttonTextColor || "#000000",
                fontFamily: props.fontFamily || defaultFontFamily,
                fontSize: `${props.fontSize || 17}px`,
                fontWeight: props.fontWeight || "normal",
                lineHeight: props.lineHeight || 1.8,
                letterSpacing: props.letterSpacing || "1.5px",
                borderWidth: props.buttonStyle === "outlined" ? "1px" : "0",
                borderStyle: props.buttonStyle === "outlined" ? "solid" : "none",
                borderColor: props.buttonStyle === "outlined" ? "#000000" : "transparent",
                textDecoration: props.buttonStyle === "underlined" ? "underline" : "none",
                textUnderlineOffset: props.buttonStyle === "underlined" ? "5px" : "auto",
                whiteSpace: "pre-wrap",
              }}
              contentEditable="true"
              suppressContentEditableWarning={true}
              onFocus={() => setEditingField({ field: "buttonText" })}
              onBlur={(e) => {
                const newText = e.currentTarget.textContent || "Click Here To Join"
                onUpdateProps(component.id, { buttonText: newText })
                setEditingField(null)
              }}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
            >
              {props.buttonText || "Click Here To Join"}
            </button>
          </div>
        )
      case "footer":
        return (
          <div className="w-full bg-gray-100 p-8 text-center text-gray-600">
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
            <p className="mb-2">
              © {new Date().getFullYear()} {props.companyName || "Your Company"}. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href={props.privacyUrl || "#"} className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              <span>|</span>
              <a href={props.unsubscribeUrl || "#"} className="text-blue-600 hover:underline">
                Unsubscribe
              </a>
            </div>
          </div>
        )
      default:
        return (
          <div className="p-4 border border-red-300 bg-red-50 rounded">
            <p className="text-red-600">Unknown component type: {component.type}</p>
          </div>
        )
    }
  }

  return (
    <div
      ref={componentRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${component.selected ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
      key={renderKey}
    >
      {renderComponentContent()}

      {/* Cog icon for settings - appears on hover */}
      {isHovered && (
        <button
          onClick={handleCogClick}
          className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 z-30"
          title="Component Settings"
        >
          <Settings size={16} className="text-gray-600" />
        </button>
      )}

      {/* Action buttons - appears on hover */}
      {isHovered && (
        <div className="absolute top-2 right-2 flex bg-white rounded shadow-md z-30">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(component.id)
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(component.id)
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            title="Delete"
          >
            <Trash size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMove(component.id, "up")
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            title="Move Up"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMove(component.id, "down")
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            title="Move Down"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
