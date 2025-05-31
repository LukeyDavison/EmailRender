"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EmailComponent {
  id: string
  type: string
  props: any
  children?: EmailComponent[]
  selected?: boolean
}

interface UnifiedEditorProps {
  position: { x: number; y: number }
  component: EmailComponent
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onMove: (id: string, direction: "up" | "down") => void
  onUpdateProps: (id: string, props: any) => void
  onClose: () => void
}

export function UnifiedEditor({
  position,
  component,
  onDelete,
  onDuplicate,
  onMove,
  onUpdateProps,
  onClose,
}: UnifiedEditorProps) {
  const [editorStyle, setEditorStyle] = useState({})
  const editorRef = useRef<HTMLDivElement>(null)

  // Debug component props
  useEffect(() => {
    console.log("UnifiedEditor received component:", component.id, component.type, component.props)
  }, [component])

  // Optimized prop change handler with debouncing for sliders
  const handlePropChange = useCallback(
    (key: string, value: any) => {
      console.log("Changing prop:", key, "to", value, "for component", component.id)
      onUpdateProps(component.id, { [key]: value })
    },
    [component.id, onUpdateProps],
  )

  // Optimized image upload handler
  const handleImageUploaded = useCallback(
    (key: string, imageUrl: string) => {
      if (component.props[key] !== imageUrl) {
        console.log(`Image updated for ${key} in component ${component.id}`)
        handlePropChange(key, imageUrl)
      }
    },
    [component.props, component.id, handlePropChange],
  )

  // Optimized position change handler for text overlays
  const handleTextPositionChange = useCallback(
    (textType: "overlay" | "cta" | "subtitle2", axis: "X" | "Y", value: number) => {
      const key =
        textType === "overlay" ? `overlayText${axis}` : textType === "cta" ? `ctaText${axis}` : `subtitle2Text${axis}`
      const newValue = `${Math.round(value)}%`

      // Only update if value actually changed
      if (component.props[key] !== newValue) {
        handlePropChange(key, newValue)
      }
    },
    [component.props, handlePropChange],
  )

  const getComponentSpecificControls = () => {
    if (!component.props) {
      return <p className="text-red-500">Error: Component has no properties to edit</p>
    }

    console.log(`Editing component: ${component.id} of type: ${component.type}`)

    const props = component.props

    switch (component.type) {
      case "brand-header":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo Image</Label>
              <ImageUpload
                onImageUploaded={(imageUrl) => handleImageUploaded("logoUrl", imageUrl)}
                currentImageUrl={props.logoUrl || "https://link.email.lkbennett.com/custloads/816689973/vce/logo1.png"}
                componentId={component.id}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoWidth">Logo Width (px)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="logoWidth"
                  min={100}
                  max={400}
                  step={1}
                  value={[props.logoWidth || 218]}
                  onValueChange={(value) => handlePropChange("logoWidth", value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center">{props.logoWidth || 218}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoAlt">Logo Alt Text</Label>
              <Input
                id="logoAlt"
                type="text"
                value={props.logoAlt || "LK Bennett London"}
                onChange={(e) => handlePropChange("logoAlt", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={props.backgroundColor || "#ffffff"}
                  onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.backgroundColor || "#ffffff"}
                  onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="borderColor">Border Color</Label>
              <div className="flex gap-2">
                <Input
                  id="borderColor"
                  type="color"
                  value={props.borderColor || "#000000"}
                  onChange={(e) => handlePropChange("borderColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.borderColor || "#000000"}
                  onChange={(e) => handlePropChange("borderColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="borderHeight">Border Height (px)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="borderHeight"
                  min={1}
                  max={10}
                  step={1}
                  value={[props.borderHeight || 3]}
                  onValueChange={(value) => handlePropChange("borderHeight", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.borderHeight || 3}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spacingTop">Top Spacing (px)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="spacingTop"
                  min={0}
                  max={60}
                  step={5}
                  value={[props.spacingTop || 30]}
                  onValueChange={(value) => handlePropChange("spacingTop", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.spacingTop || 30}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spacingBottom">Bottom Spacing (px)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="spacingBottom"
                  min={0}
                  max={60}
                  step={5}
                  value={[props.spacingBottom || 30]}
                  onValueChange={(value) => handlePropChange("spacingBottom", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.spacingBottom || 30}px</span>
              </div>
            </div>
          </div>
        )

      case "full-width-image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image</Label>
              <ImageUpload
                onImageUploaded={(imageUrl) => handleImageUploaded("imageUrl", imageUrl)}
                currentImageUrl={props.imageUrl || "/placeholder.jpg"}
                componentId={component.id}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageAlt">Alt Text</Label>
              <Input
                id="imageAlt"
                type="text"
                value={props.imageAlt || ""}
                onChange={(e) => handlePropChange("imageAlt", e.target.value)}
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundScale">Background Scale (%)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="backgroundScale"
                  min={50}
                  max={400}
                  step={5}
                  value={[props.backgroundScale || 100]}
                  onValueChange={(value) => handlePropChange("backgroundScale", value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center">{props.backgroundScale || 100}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundPositionX">Image Horizontal Position (%)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="backgroundPositionX"
                  min={0}
                  max={100}
                  step={1}
                  value={[props.backgroundPositionX ? Number.parseFloat(props.backgroundPositionX) : 50]}
                  onValueChange={(value) => handlePropChange("backgroundPositionX", `${value[0]}%`)}
                  className="flex-1"
                />
                <span className="w-12 text-center">
                  {props.backgroundPositionX ? Math.round(Number.parseFloat(props.backgroundPositionX)) : 50}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundPositionY">Image Vertical Position (%)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="backgroundPositionY"
                  min={0}
                  max={100}
                  step={1}
                  value={[props.backgroundPositionY ? Number.parseFloat(props.backgroundPositionY) : 50]}
                  onValueChange={(value) => handlePropChange("backgroundPositionY", `${value[0]}%`)}
                  className="flex-1"
                />
                <span className="w-12 text-center">
                  {props.backgroundPositionY ? Math.round(Number.parseFloat(props.backgroundPositionY)) : 50}%
                </span>
              </div>
            </div>

            {/* Main Text Overlay Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium">Main Text Overlay</h4>
                <div className="flex items-center gap-2">
                  <Switch
                    id="overlayEditMode"
                    checked={props.overlayEditMode || false}
                    onCheckedChange={(checked) => handlePropChange("overlayEditMode", checked)}
                  />
                  <Label htmlFor="overlayEditMode" className="text-sm font-medium">
                    Drag Mode
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overlayText">Main Text</Label>
                <Input
                  id="overlayText"
                  type="text"
                  value={props.overlayText || ""}
                  onChange={(e) => handlePropChange("overlayText", e.target.value)}
                  placeholder="Enter main overlay text"
                />
              </div>

              {props.overlayText && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="overlayTextAlign">Text Alignment</Label>
                    <Select
                      value={props.overlayTextAlign || "center"}
                      onValueChange={(value) => handlePropChange("overlayTextAlign", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overlayTextX">Horizontal Position (%)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="overlayTextX"
                        min={0}
                        max={100}
                        step={1}
                        value={[props.overlayTextX ? Number.parseFloat(props.overlayTextX) : 50]}
                        onValueChange={(value) => handleTextPositionChange("overlay", "X", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">
                        {props.overlayTextX ? Math.round(Number.parseFloat(props.overlayTextX)) : 50}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overlayTextY">Vertical Position (%)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="overlayTextY"
                        min={0}
                        max={100}
                        step={1}
                        value={[props.overlayTextY ? Number.parseFloat(props.overlayTextY) : 50]}
                        onValueChange={(value) => handleTextPositionChange("overlay", "Y", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">
                        {props.overlayTextY ? Math.round(Number.parseFloat(props.overlayTextY)) : 50}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overlayTextColor">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="overlayTextColor"
                        type="color"
                        value={props.overlayTextColor || "#ffffff"}
                        onChange={(e) => handlePropChange("overlayTextColor", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={props.overlayTextColor || "#ffffff"}
                        onChange={(e) => handlePropChange("overlayTextColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overlayTextSize">Text Size (px)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="overlayTextSize"
                        min={12}
                        max={72}
                        step={2}
                        value={[props.overlayTextSize || 24]}
                        onValueChange={(value) => handlePropChange("overlayTextSize", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">{props.overlayTextSize || 24}px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overlayTextWeight">Text Weight</Label>
                    <Select
                      value={props.overlayTextWeight || "bold"}
                      onValueChange={(value) => handlePropChange("overlayTextWeight", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overlayTextFont">Text Font</Label>
                    <Select
                      value={props.overlayTextFont || "Georgia, 'Times New Roman', Times, serif"}
                      onValueChange={(value) => handlePropChange("overlayTextFont", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Georgia, 'Times New Roman', Times, serif">Georgia</SelectItem>
                        <SelectItem value="Arial, Helvetica, sans-serif">Arial</SelectItem>
                        <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            {/* CTA Text Overlay Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium">CTA Text Overlay</h4>
                <div className="flex items-center gap-2">
                  <Switch
                    id="ctaEditMode"
                    checked={props.ctaEditMode || false}
                    onCheckedChange={(checked) => handlePropChange("ctaEditMode", checked)}
                  />
                  <Label htmlFor="ctaEditMode" className="text-sm font-medium">
                    Drag Mode
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Text</Label>
                <Input
                  id="ctaText"
                  type="text"
                  value={props.ctaText || ""}
                  onChange={(e) => handlePropChange("ctaText", e.target.value)}
                  placeholder="Enter CTA text (e.g., Shop Now)"
                />
              </div>

              {props.ctaText && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ctaTextAlign">Text Alignment</Label>
                    <Select
                      value={props.ctaTextAlign || "center"}
                      onValueChange={(value) => handlePropChange("ctaTextAlign", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaTextX">Horizontal Position (%)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="ctaTextX"
                        min={0}
                        max={100}
                        step={1}
                        value={[props.ctaTextX ? Number.parseFloat(props.ctaTextX) : 50]}
                        onValueChange={(value) => handleTextPositionChange("cta", "X", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">
                        {props.ctaTextX ? Math.round(Number.parseFloat(props.ctaTextX)) : 50}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaTextY">Vertical Position (%)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="ctaTextY"
                        min={0}
                        max={100}
                        step={1}
                        value={[props.ctaTextY ? Number.parseFloat(props.ctaTextY) : 70]}
                        onValueChange={(value) => handleTextPositionChange("cta", "Y", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">
                        {props.ctaTextY ? Math.round(Number.parseFloat(props.ctaTextY)) : 70}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaTextColor">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="ctaTextColor"
                        type="color"
                        value={props.ctaTextColor || "#ffffff"}
                        onChange={(e) => handlePropChange("ctaTextColor", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={props.ctaTextColor || "#ffffff"}
                        onChange={(e) => handlePropChange("ctaTextColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaBackgroundColor">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="ctaBackgroundColor"
                        type="color"
                        value={props.ctaBackgroundColor || "rgba(0,0,0,0.3)"}
                        onChange={(e) => handlePropChange("ctaBackgroundColor", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={props.ctaBackgroundColor || "rgba(0,0,0,0.3)"}
                        onChange={(e) => handlePropChange("ctaBackgroundColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaTextSize">Text Size (px)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="ctaTextSize"
                        min={12}
                        max={48}
                        step={2}
                        value={[props.ctaTextSize || 18]}
                        onValueChange={(value) => handlePropChange("ctaTextSize", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">{props.ctaTextSize || 18}px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaTextWeight">Text Weight</Label>
                    <Select
                      value={props.ctaTextWeight || "bold"}
                      onValueChange={(value) => handlePropChange("ctaTextWeight", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaTextFont">Text Font</Label>
                    <Select
                      value={props.ctaTextFont || "Georgia, 'Times New Roman', Times, serif"}
                      onValueChange={(value) => handlePropChange("ctaTextFont", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Georgia, 'Times New Roman', Times, serif">Georgia</SelectItem>
                        <SelectItem value="Arial, Helvetica, sans-serif">Arial</SelectItem>
                        <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            {/* Second Subtitle Text Overlay Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium">Second Subtitle Overlay</h4>
                <div className="flex items-center gap-2">
                  <Switch
                    id="subtitle2EditMode"
                    checked={props.subtitle2EditMode || false}
                    onCheckedChange={(checked) => handlePropChange("subtitle2EditMode", checked)}
                  />
                  <Label htmlFor="subtitle2EditMode" className="text-sm font-medium">
                    Drag Mode
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle2Text">Subtitle Text</Label>
                <Input
                  id="subtitle2Text"
                  type="text"
                  value={props.subtitle2Text || ""}
                  onChange={(e) => handlePropChange("subtitle2Text", e.target.value)}
                  placeholder="Enter second subtitle text"
                />
              </div>

              {props.subtitle2Text && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle2TextAlign">Text Alignment</Label>
                    <Select
                      value={props.subtitle2TextAlign || "center"}
                      onValueChange={(value) => handlePropChange("subtitle2TextAlign", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle2TextX">Horizontal Position (%)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="subtitle2TextX"
                        min={0}
                        max={100}
                        step={1}
                        value={[props.subtitle2TextX ? Number.parseFloat(props.subtitle2TextX) : 50]}
                        onValueChange={(value) => handleTextPositionChange("subtitle2", "X", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">
                        {props.subtitle2TextX ? Math.round(Number.parseFloat(props.subtitle2TextX)) : 50}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle2TextY">Vertical Position (%)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="subtitle2TextY"
                        min={0}
                        max={100}
                        step={1}
                        value={[props.subtitle2TextY ? Number.parseFloat(props.subtitle2TextY) : 30]}
                        onValueChange={(value) => handleTextPositionChange("subtitle2", "Y", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">
                        {props.subtitle2TextY ? Math.round(Number.parseFloat(props.subtitle2TextY)) : 30}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle2TextColor">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="subtitle2TextColor"
                        type="color"
                        value={props.subtitle2TextColor || "#ffffff"}
                        onChange={(e) => handlePropChange("subtitle2TextColor", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={props.subtitle2TextColor || "#ffffff"}
                        onChange={(e) => handlePropChange("subtitle2TextColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle2TextSize">Text Size (px)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="subtitle2TextSize"
                        min={12}
                        max={48}
                        step={2}
                        value={[props.subtitle2TextSize || 16]}
                        onValueChange={(value) => handlePropChange("subtitle2TextSize", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">{props.subtitle2TextSize || 16}px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle2TextWeight">Text Weight</Label>
                    <Select
                      value={props.subtitle2TextWeight || "normal"}
                      onValueChange={(value) => handlePropChange("subtitle2TextWeight", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle2TextFont">Text Font</Label>
                    <Select
                      value={props.subtitle2TextFont || "Georgia, 'Times New Roman', Times, serif"}
                      onValueChange={(value) => handlePropChange("subtitle2TextFont", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Georgia, 'Times New Roman', Times, serif">Georgia</SelectItem>
                        <SelectItem value="Arial, Helvetica, sans-serif">Arial</SelectItem>
                        <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            {/* Gradient Overlay Settings */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-4">Gradient Overlay Settings</h4>

              <div className="space-y-2">
                <Label htmlFor="overlayStartOpacity">Start Color Opacity (%)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="overlayStartOpacity"
                    min={0}
                    max={100}
                    step={5}
                    value={[props.overlayStartOpacity || 0]}
                    onValueChange={(value) => handlePropChange("overlayStartOpacity", value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{props.overlayStartOpacity || 0}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overlayEndOpacity">End Color Opacity (%)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="overlayEndOpacity"
                    min={0}
                    max={100}
                    step={5}
                    value={[props.overlayEndOpacity || 0]}
                    onValueChange={(value) => handlePropChange("overlayEndOpacity", value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{props.overlayEndOpacity || 0}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overlayStartColor">Overlay Start Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="overlayStartColor"
                    type="color"
                    value={props.overlayStartColor || "#000000"}
                    onChange={(e) => handlePropChange("overlayStartColor", e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.overlayStartColor || "#000000"}
                    onChange={(e) => handlePropChange("overlayStartColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overlayEndColor">Overlay End Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="overlayEndColor"
                    type="color"
                    value={props.overlayEndColor || "#000000"}
                    onChange={(e) => handlePropChange("overlayEndColor", e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.overlayEndColor || "#000000"}
                    onChange={(e) => handlePropChange("overlayEndColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="borderRadius">Border Radius</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="borderRadius"
                  min={0}
                  max={24}
                  step={1}
                  value={[props.borderRadius || 0]}
                  onValueChange={(value) => handlePropChange("borderRadius", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.borderRadius || 0}px</span>
              </div>
            </div>
          </div>
        )

      case "single-button":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                type="text"
                value={props.buttonText || "Click Here To Join"}
                onChange={(e) => handlePropChange("buttonText", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonStyle">Button Style</Label>
              <Select
                id="buttonStyle"
                value={props.buttonStyle || "outlined"}
                onValueChange={(value) => handlePropChange("buttonStyle", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select button style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outlined">Style 1 - Outlined</SelectItem>
                  <SelectItem value="underlined">Style 2 - Text with Underline</SelectItem>
                  <SelectItem value="filled">Style 3 - Filled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonColor">Button Color</Label>
              <div className="flex gap-2">
                <Input
                  id="buttonColor"
                  type="color"
                  value={props.buttonColor || "#000000"}
                  onChange={(e) => handlePropChange("buttonColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.buttonColor || "#000000"}
                  onChange={(e) => handlePropChange("buttonColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonTextColor">Button Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="buttonTextColor"
                  type="color"
                  value={props.buttonTextColor || "#000000"}
                  onChange={(e) => handlePropChange("buttonTextColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.buttonTextColor || "#000000"}
                  onChange={(e) => handlePropChange("buttonTextColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="fontSize"
                  min={12}
                  max={24}
                  step={1}
                  value={[props.fontSize || 17]}
                  onValueChange={(value) => handlePropChange("fontSize", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.fontSize || 17}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonUrl">Button URL</Label>
              <Input
                id="buttonUrl"
                type="text"
                value={props.buttonUrl || "#"}
                onChange={(e) => handlePropChange("buttonUrl", e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font</Label>
              <Select
                id="fontFamily"
                value={props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}
                onChange={(value) => handlePropChange("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Georgia, 'Times New Roman', Times, serif">Georgia</SelectItem>
                  <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                  <SelectItem value="Arial, Helvetica, sans-serif">Arial</SelectItem>
                  <SelectItem value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</SelectItem>
                  <SelectItem value="Verdana, Geneva, sans-serif">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="letterSpacing">Letter Spacing</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="letterSpacing"
                  min={0}
                  max={5}
                  step={0.5}
                  value={[props.letterSpacing ? Number.parseFloat(props.letterSpacing) : 1.5]}
                  onValueChange={(value) => handlePropChange("letterSpacing", `${value[0]}px`)}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.letterSpacing || "1.5px"}</span>
              </div>
            </div>
          </div>
        )

      case "text-section":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Text Content</Label>
              <p className="text-sm text-gray-500">Click directly on the text in the email to edit it.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font</Label>
              <Select
                id="fontFamily"
                value={props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}
                onChange={(value) => handlePropChange("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Georgia, 'Times New Roman', Times, serif">Georgia</SelectItem>
                  <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                  <SelectItem value="Arial, Helvetica, sans-serif">Arial</SelectItem>
                  <SelectItem value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</SelectItem>
                  <SelectItem value="Verdana, Geneva, sans-serif">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontWeight">Font Weight</Label>
              <Select
                id="fontWeight"
                value={props.fontWeight || "normal"}
                onChange={(value) => handlePropChange("fontWeight", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Regular (400)</SelectItem>
                  <SelectItem value="bold">Bold (700)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Text Formatting</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={props.italic ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePropChange("italic", !props.italic)}
                  className="h-8 w-8"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={props.underline ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePropChange("underline", !props.underline)}
                  className="h-8 w-8"
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={props.textAlign === "left" ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePropChange("textAlign", "left")}
                  className="h-8 w-8"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={props.textAlign === "center" || !props.textAlign ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePropChange("textAlign", "center")}
                  className="h-8 w-8"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={props.textAlign === "right" ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePropChange("textAlign", "right")}
                  className="h-8 w-8"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="fontSize"
                  min={10}
                  max={36}
                  step={1}
                  value={[props.fontSize || 17]}
                  onValueChange={(value) => handlePropChange("fontSize", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.fontSize || 17}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lineHeight">Line Height</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="lineHeight"
                  min={1}
                  max={3}
                  step={0.1}
                  value={[props.lineHeight || 1.8]}
                  onValueChange={(value) => handlePropChange("lineHeight", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.lineHeight || 1.8}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="letterSpacing">Letter Spacing</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="letterSpacing"
                  min={0}
                  max={5}
                  step={0.5}
                  value={[props.letterSpacing ? Number.parseFloat(props.letterSpacing) : 2]}
                  onValueChange={(value) => handlePropChange("letterSpacing", `${value[0]}px`)}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.letterSpacing || "2px"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={props.textColor || "#000000"}
                  onChange={(e) => handlePropChange("textColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.textColor || "#000000"}
                  onChange={(e) => handlePropChange("textColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={props.backgroundColor || "#ffffff"}
                  onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.backgroundColor || "#ffffff"}
                  onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )

      case "header-banner":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Header Title</Label>
              <p className="text-sm text-gray-500">Click directly on the header title in the email to edit it.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={props.textColor || "#000000"}
                  onChange={(e) => handlePropChange("textColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.textColor || "#000000"}
                  onChange={(e) => handlePropChange("textColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={props.backgroundColor || "#f8f9fa"}
                  onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.backgroundColor || "#f8f9fa"}
                  onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="fontSize"
                  min={16}
                  max={48}
                  step={1}
                  value={[props.fontSize || 35]}
                  onValueChange={(value) => handlePropChange("fontSize", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.fontSize || 35}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontWeight">Font Weight</Label>
              <Select
                id="fontWeight"
                value={props.fontWeight || "normal"}
                onChange={(value) => handlePropChange("fontWeight", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Regular (400)</SelectItem>
                  <SelectItem value="bold">Bold (700)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lineHeight">Line Height</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="lineHeight"
                  min={1}
                  max={3}
                  step={0.1}
                  value={[props.lineHeight || 1]}
                  onValueChange={(value) => handlePropChange("lineHeight", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.lineHeight || 1}</span>
              </div>
            </div>
          </div>
        )

      case "two-column-images":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image1Url">First Image</Label>
              <ImageUpload
                onImageUploaded={(imageUrl) => handleImageUploaded("image1Url", imageUrl)}
                currentImageUrl={props.image1Url || "/placeholder.jpg"}
                componentId={`${component.id}-img1`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image1Alt">First Image Alt Text</Label>
              <Input
                id="image1Alt"
                type="text"
                value={props.image1Alt || ""}
                onChange={(e) => handlePropChange("image1Alt", e.target.value)}
                placeholder="Describe the first image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image2Url">Second Image</Label>
              <ImageUpload
                onImageUploaded={(imageUrl) => handleImageUploaded("image2Url", imageUrl)}
                currentImageUrl={props.image2Url || "/placeholder.jpg"}
                componentId={`${component.id}-img2`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image2Alt">Second Image Alt Text</Label>
              <Input
                id="image2Alt"
                type="text"
                value={props.image2Alt || ""}
                onChange={(e) => handlePropChange("image2Alt", e.target.value)}
                placeholder="Describe the second image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spacing">Spacing Between Images</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="spacing"
                  min={0}
                  max={24}
                  step={1}
                  value={[props.spacing || 8]}
                  onValueChange={(value) => handlePropChange("spacing", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.spacing || 8}px</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium">Button Options</h4>
                <div className="flex items-center gap-2">
                  <Switch
                    id="showButtons"
                    checked={props.showButtons || false}
                    onCheckedChange={(checked) => handlePropChange("showButtons", checked)}
                  />
                  <Label htmlFor="showButtons" className="text-sm">
                    Show Buttons
                  </Label>
                </div>
              </div>

              {props.showButtons && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="buttonStyle">Button Style</Label>
                    <Select
                      id="buttonStyle"
                      value={props.buttonStyle || "outlined"}
                      onChange={(value) => handlePropChange("buttonStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select button style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outlined">Style 1 - Outlined</SelectItem>
                        <SelectItem value="underlined">Style 2 - Text with Underline</SelectItem>
                        <SelectItem value="filled">Style 3 - Filled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="button1Text">First Button Text</Label>
                    <Input
                      id="button1Text"
                      type="text"
                      value={props.button1Text || "Shop Now"}
                      onChange={(e) => handlePropChange("button1Text", e.target.value)}
                      placeholder="First button text"
                    />
                  </div>

                  <div className="space-y-2 mt-2">
                    <Label htmlFor="button2Text">Second Button Text</Label>
                    <Input
                      id="button2Text"
                      type="text"
                      value={props.button2Text || "Learn More"}
                      onChange={(e) => handlePropChange("button2Text", e.target.value)}
                      placeholder="Second button text"
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="buttonColor">Button Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="buttonColor"
                        type="color"
                        value={props.buttonColor || "#4285F4"}
                        onChange={(e) => handlePropChange("buttonColor", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={props.buttonColor || "#4285F4"}
                        onChange={(e) => handlePropChange("buttonColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    <Label htmlFor="buttonTextColor">Button Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="buttonTextColor"
                        type="color"
                        value={props.buttonTextColor || "#ffffff"}
                        onChange={(e) => handlePropChange("buttonTextColor", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={props.buttonTextColor || "#ffffff"}
                        onChange={(e) => handlePropChange("buttonTextColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Button Font</Label>
                    <Select
                      id="fontFamily"
                      value={props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}
                      onChange={(value) => handlePropChange("fontFamily", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Georgia, 'Times New Roman', Times, serif">Georgia</SelectItem>
                        <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                        <SelectItem value="Arial, Helvetica, sans-serif">Arial</SelectItem>
                        <SelectItem value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</SelectItem>
                        <SelectItem value="Verdana, Geneva, sans-serif">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Button Font Size</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="fontSize"
                        min={10}
                        max={24}
                        step={1}
                        value={[props.fontSize || 17]}
                        onValueChange={(value) => handlePropChange("fontSize", value[0])}
                        className="flex-1"
                      />
                      <span className="w-10 text-center">{props.fontSize || 17}px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="letterSpacing">Button Letter Spacing</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="letterSpacing"
                        min={0}
                        max={5}
                        step={0.5}
                        value={[props.letterSpacing ? Number.parseFloat(props.letterSpacing) : 1.5]}
                        onValueChange={(value) => handlePropChange("letterSpacing", `${value[0]}px`)}
                        className="flex-1"
                      />
                      <span className="w-10 text-center">{props.letterSpacing || "1.5px"}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )

      case "button-grid":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buttonCount">Number of Buttons</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="buttonCount"
                  min={1}
                  max={5}
                  step={1}
                  value={[props.buttonCount || 3]}
                  onValueChange={(value) => handlePropChange("buttonCount", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.buttonCount || 3}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonStyle">Button Style</Label>
              <Select
                id="buttonStyle"
                value={props.buttonStyle || "outlined"}
                onChange={(value) => handlePropChange("buttonStyle", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select button style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outlined">Style 1 - Outlined</SelectItem>
                  <SelectItem value="underlined">Style 2 - Text with Underline</SelectItem>
                  <SelectItem value="filled">Style 3 - Filled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonColor">Button Color</Label>
              <div className="flex gap-2">
                <Input
                  id="buttonColor"
                  type="color"
                  value={props.buttonColor || "#000000"}
                  onChange={(e) => handlePropChange("buttonColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.buttonColor || "#000000"}
                  onChange={(e) => handlePropChange("buttonColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonTextColor">Button Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="buttonTextColor"
                  type="color"
                  value={props.buttonTextColor || "#000000"}
                  onChange={(e) => handlePropChange("buttonTextColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.buttonTextColor || "#000000"}
                  onChange={(e) => handlePropChange("buttonTextColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="fontSize"
                  min={12}
                  max={24}
                  step={1}
                  value={[props.fontSize || 17]}
                  onValueChange={(value) => handlePropChange("fontSize", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.fontSize || 17}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontWeight">Font Weight</Label>
              <Select
                id="fontWeight"
                value={props.fontWeight || "normal"}
                onChange={(value) => handlePropChange("fontWeight", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Regular (400)</SelectItem>
                  <SelectItem value="bold">Bold (700)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font</Label>
              <Select
                id="fontFamily"
                value={props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}
                onChange={(value) => handlePropChange("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Georgia, 'Times New Roman', Times, serif">Georgia</SelectItem>
                  <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                  <SelectItem value="Arial, Helvetica, sans-serif">Arial</SelectItem>
                  <SelectItem value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</SelectItem>
                  <SelectItem value="Verdana, Geneva, sans-serif">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="letterSpacing">Letter Spacing</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="letterSpacing"
                  min={0}
                  max={5}
                  step={0.5}
                  value={[props.letterSpacing ? Number.parseFloat(props.letterSpacing) : 1.5]}
                  onValueChange={(value) => handlePropChange("letterSpacing", `${value[0]}px`)}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.letterSpacing || "1.5px"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spacing">Spacing Between Buttons</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="spacing"
                  min={0}
                  max={24}
                  step={1}
                  value={[props.spacing || 8]}
                  onValueChange={(value) => handlePropChange("spacing", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.spacing || 8}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={props.backgroundColor || "#ffffff"}
                  onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.backgroundColor || "#ffffff"}
                  onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-3">Button Text</h4>
              {Array.from({ length: props.buttonCount || 3 }).map((_, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <Label htmlFor={`button${index + 1}Text`}>{`Button ${index + 1} Text`}</Label>
                  <Input
                    id={`button${index + 1}Text`}
                    type="text"
                    value={props[`button${index + 1}Text`] || `Button ${index + 1}`}
                    onChange={(e) => handlePropChange(`button${index + 1}Text`, e.target.value)}
                    placeholder={`Button ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )

      case "three-column-images":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image1Url">First Image</Label>
              <ImageUpload
                onImageUploaded={(imageUrl) => handleImageUploaded("image1Url", imageUrl)}
                currentImageUrl={props.image1Url || "/placeholder.jpg"}
                componentId={`${component.id}-img1`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image1Alt">First Image Alt Text</Label>
              <Input
                id="image1Alt"
                type="text"
                value={props.image1Alt || ""}
                onChange={(e) => handlePropChange("image1Alt", e.target.value)}
                placeholder="Describe the first image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image2Url">Second Image</Label>
              <ImageUpload
                onImageUploaded={(imageUrl) => handleImageUploaded("image2Url", imageUrl)}
                currentImageUrl={props.image2Url || "/placeholder.jpg"}
                componentId={`${component.id}-img2`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image2Alt">Second Image Alt Text</Label>
              <Input
                id="image2Alt"
                type="text"
                value={props.image2Alt || ""}
                onChange={(e) => handlePropChange("image2Alt", e.target.value)}
                placeholder="Describe the second image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image3Url">Third Image</Label>
              <ImageUpload
                onImageUploaded={(imageUrl) => handleImageUploaded("image3Url", imageUrl)}
                currentImageUrl={props.image3Url || "/placeholder.jpg"}
                componentId={`${component.id}-img3`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image3Alt">Third Image Alt Text</Label>
              <Input
                id="image3Alt"
                type="text"
                value={props.image3Alt || ""}
                onChange={(e) => handlePropChange("image3Alt", e.target.value)}
                placeholder="Describe the third image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spacing">Spacing Between Images</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="spacing"
                  min={0}
                  max={24}
                  step={1}
                  value={[props.spacing || 8]}
                  onValueChange={(value) => handlePropChange("spacing", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.spacing || 8}px</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium">Button Options</h4>
                <div className="flex items-center gap-2">
                  <Switch
                    id="showButtons"
                    checked={props.showButtons || false}
                    onCheckedChange={(checked) => handlePropChange("showButtons", checked)}
                  />
                  <Label htmlFor="showButtons" className="text-sm">
                    Show Buttons
                  </Label>
                </div>
              </div>

              {props.showButtons && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="buttonStyle">Button Style</Label>
                    <Select
                      id="buttonStyle"
                      value={props.buttonStyle || "outlined"}
                      onValueChange={(value) => handlePropChange("buttonStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select button style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outlined">Style 1 - Outlined</SelectItem>
                        <SelectItem value="underlined">Style 2 - Text with Underline</SelectItem>
                        <SelectItem value="filled">Style 3 - Filled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="button1Text">First Button Text</Label>
                    <Input
                      id="button1Text"
                      type="text"
                      value={props.button1Text || "Shop Now"}
                      onChange={(e) => handlePropChange("button1Text", e.target.value)}
                      placeholder="First button text"
                    />
                  </div>

                  <div className="space-y-2 mt-2">
                    <Label htmlFor="button2Text">Second Button Text</Label>
                    <Input
                      id="button2Text"
                      type="text"
                      value={props.button2Text || "Learn More"}
                      onChange={(e) => handlePropChange("button2Text", e.target.value)}
                      placeholder="Second button text"
                    />
                  </div>

                  <div className="space-y-2 mt-2">
                    <Label htmlFor="button3Text">Third Button Text</Label>
                    <Input
                      id="button3Text"
                      type="text"
                      value={props.button3Text || "View More"}
                      onChange={(e) => handlePropChange("button3Text", e.target.value)}
                      placeholder="Third button text"
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="buttonColor">Button Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="buttonColor"
                        type="color"
                        value={props.buttonColor || "#4285F4"}
                        onChange={(e) => handlePropChange("buttonColor", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={props.buttonColor || "#4285F4"}
                        onChange={(e) => handlePropChange("buttonColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    <Label htmlFor="buttonTextColor">Button Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="buttonTextColor"
                        type="color"
                        value={props.buttonTextColor || "#ffffff"}
                        onChange={(e) => handlePropChange("buttonTextColor", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={props.buttonTextColor || "#ffffff"}
                        onChange={(e) => handlePropChange("buttonTextColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Button Font</Label>
                    <Select
                      id="fontFamily"
                      value={props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}
                      onValueChange={(value) => handlePropChange("fontFamily", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Georgia, 'Times New Roman', Times, serif">Georgia</SelectItem>
                        <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                        <SelectItem value="Arial, Helvetica, sans-serif">Arial</SelectItem>
                        <SelectItem value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</SelectItem>
                        <SelectItem value="Verdana, Geneva, sans-serif">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Button Font Size</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="fontSize"
                        min={10}
                        max={24}
                        step={1}
                        value={[props.fontSize || 17]}
                        onValueChange={(value) => handlePropChange("fontSize", value[0])}
                        className="flex-1"
                      />
                      <span className="w-10 text-center">{props.fontSize || 17}px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="letterSpacing">Button Letter Spacing</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="letterSpacing"
                        min={0}
                        max={5}
                        step={0.5}
                        value={[props.letterSpacing ? Number.parseFloat(props.letterSpacing) : 1.5]}
                        onValueChange={(value) => handlePropChange("letterSpacing", `${value[0]}px`)}
                        className="flex-1"
                      />
                      <span className="w-10 text-center">{props.letterSpacing || "1.5px"}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )

      case "image-text-section":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image</Label>
              <ImageUpload
                onImageUploaded={(imageUrl) => handleImageUploaded("imageUrl", imageUrl)}
                currentImageUrl={props.imageUrl || "/placeholder.jpg"}
                componentId={component.id}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageAlt">Image Alt Text</Label>
              <Input
                id="imageAlt"
                type="text"
                value={props.imageAlt || ""}
                onChange={(e) => handlePropChange("imageAlt", e.target.value)}
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Text Content</Label>
              <p className="text-sm text-gray-500">Click directly on the text in the email to edit it.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font</Label>
              <Select
                id="fontFamily"
                value={props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}
                onValueChange={(value) => handlePropChange("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Georgia, 'Times New Roman', Times, serif">Georgia</SelectItem>
                  <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                  <SelectItem value="Arial, Helvetica, sans-serif">Arial</SelectItem>
                  <SelectItem value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</SelectItem>
                  <SelectItem value="Verdana, Geneva, sans-serif">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontWeight">Font Weight</Label>
              <Select
                id="fontWeight"
                value={props.fontWeight || "normal"}
                onValueChange={(value) => handlePropChange("fontWeight", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Regular (400)</SelectItem>
                  <SelectItem value="bold">Bold (700)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Text Formatting</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={props.italic ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePropChange("italic", !props.italic)}
                  className="h-8 w-8"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={props.underline ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePropChange("underline", !props.underline)}
                  className="h-8 w-8"
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={props.textAlign === "left" ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePropChange("textAlign", "left")}
                  className="h-8 w-8"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={props.textAlign === "center" || !props.textAlign ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePropChange("textAlign", "center")}
                  className="h-8 w-8"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={props.textAlign === "right" ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePropChange("textAlign", "right")}
                  className="h-8 w-8"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="fontSize"
                  min={10}
                  max={36}
                  step={1}
                  value={[props.fontSize || 17]}
                  onValueChange={(value) => handlePropChange("fontSize", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.fontSize || 17}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lineHeight">Line Height</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="lineHeight"
                  min={1}
                  max={3}
                  step={0.1}
                  value={[props.lineHeight || 1.8]}
                  onValueChange={(value) => handlePropChange("lineHeight", value[0])}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.lineHeight || 1.8}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="letterSpacing">Letter Spacing</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="letterSpacing"
                  min={0}
                  max={5}
                  step={0.5}
                  value={[props.letterSpacing ? Number.parseFloat(props.letterSpacing) : 2]}
                  onValueChange={(value) => handlePropChange("letterSpacing", `${value[0]}px`)}
                  className="flex-1"
                />
                <span className="w-10 text-center">{props.letterSpacing || "2px"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={props.textColor || "#000000"}
                  onChange={(e) => handlePropChange("textColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.textColor || "#000000"}
                  onChange={(e) => handlePropChange("textColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={props.backgroundColor || "#ffffff"}
                  onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={props.backgroundColor || "#ffffff"}
                  onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-500">Component controls not yet implemented for {component.type}</p>
          </div>
        )
    }
  }
  ;<div className="mt-6 pt-4 border-t border-gray-200">
    <h4 className="text-sm font-medium mb-2">Current Component Styling (Debug)</h4>
    <textarea
      className="w-full h-32 p-2 text-xs font-mono bg-gray-50 border rounded resize-none"
      readOnly
      value={JSON.stringify(component.props, null, 2)}
    />
    <div className="mt-2 text-xs text-gray-500">
      Component ID: {component.id} | Type: {component.type}
    </div>
  </div>

  // Reset any cached state when component changes
  useEffect(() => {
    console.log("Component changed in UnifiedEditor:", component.id, component.type)
  }, [component.id, component.type])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
        <h3 className="font-medium capitalize">{component.type.replace(/-/g, " ")} Settings</h3>
      </div>

      {getComponentSpecificControls()}

      {/* Temporary Styling Debug Section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium mb-2">Current Component Styling (Debug)</h4>
        <textarea
          className="w-full h-32 p-2 text-xs font-mono bg-gray-50 border rounded resize-none"
          readOnly
          value={JSON.stringify(component.props, null, 2)}
        />
        <div className="mt-2 text-xs text-gray-500">
          Component ID: {component.id} | Type: {component.type}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t sticky bottom-0 bg-white z-10 pt-2">
        {/* Component settings footer area if needed in the future */}
      </div>
    </div>
  )
}
