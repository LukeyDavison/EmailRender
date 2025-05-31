/**
 * Core type definitions for the Email Builder application
 */

// Define all possible component types as a union
export type ComponentType =
  | "brand-header"
  | "header-banner"
  | "text-section"
  | "full-width-image"
  | "two-column-images"
  | "three-column-images"
  | "hero-banner"
  | "image-text-section"
  | "button-grid"
  | "single-button"
  | "footer"

// Base properties that all components share
export interface BaseComponentProps {
  backgroundColor?: string
  textColor?: string
  padding?: number
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  fontFamily?: string
}

// Brand Header specific props
export interface BrandHeaderProps extends BaseComponentProps {
  logoUrl: string
  logoWidth: number
  logoAlt: string
  borderHeight: number
  spacingTop: number
  spacingBottom: number
}

// Header Banner specific props
export interface HeaderBannerProps extends BaseComponentProps {
  title: string
  fontSize: number
  fontWeight: string
  lineHeight: number
  letterSpacing: string
}

// Text Section specific props
export interface TextSectionProps extends BaseComponentProps {
  text: string
  fontSize: number
  fontWeight: string
  italic?: boolean
  underline?: boolean
  textAlign: "left" | "center" | "right"
  lineHeight: number
  letterSpacing: string
}

// Image props
export interface ImageProps {
  imageUrl: string
  imageAlt: string
  borderRadius?: number
}

// Full Width Image specific props
export interface FullWidthImageProps extends BaseComponentProps, ImageProps {}

// Two Column Images specific props
export interface TwoColumnImagesProps extends BaseComponentProps {
  image1Url: string
  image1Alt: string
  image2Url: string
  image2Alt: string
  spacing: number
  showButtons?: boolean
  buttonStyle?: "outlined" | "underlined" | "filled"
  button1Text?: string
  button2Text?: string
  buttonColor?: string
  buttonTextColor?: string
  fontSize?: number
  letterSpacing?: string
  fontFamily?: string
}

// Three Column Images specific props
export interface ThreeColumnImagesProps extends BaseComponentProps {
  image1Url: string
  image1Alt: string
  image2Url: string
  image2Alt: string
  image3Url: string
  image3Alt: string
  spacing: number
}

// Hero Banner specific props
export interface HeroBannerProps extends BaseComponentProps {
  imageUrl: string
  title: string
  subtitle?: string
  overlayColor?: string
  fontSize: number
  subtitleFontSize?: number
  fontWeight: string
  lineHeight: number
  letterSpacing: string
  buttonText?: string
  buttonStyle?: "outlined" | "underlined" | "filled"
  buttonColor?: string
  buttonTextColor?: string
  subtitleUnderlined?: boolean
}

// Image Text Section specific props
export interface ImageTextSectionProps extends BaseComponentProps {
  imageUrl: string
  imageAlt: string
  title: string
  text: string
  fontSize: number
  fontWeight: string
  lineHeight: number
  letterSpacing: string
  textAlign?: "left" | "center" | "right"
  buttonText?: string
  buttonStyle?: "outlined" | "underlined" | "filled"
  buttonColor?: string
  buttonTextColor?: string
}

// Button Grid specific props
export interface ButtonGridProps extends BaseComponentProps {
  buttonCount: number
  spacing: number
  buttonStyle?: "outlined" | "underlined" | "filled"
  buttonColor?: string
  buttonTextColor?: string
  fontSize?: number
  fontWeight?: string
  lineHeight?: number
  letterSpacing?: string
  [key: string]: any // For dynamic button text properties (button1Text, button2Text, etc.)
}

// Single Button specific props
export interface SingleButtonProps extends BaseComponentProps {
  buttonText: string
  buttonUrl: string
  buttonStyle?: "outlined" | "underlined" | "filled"
  buttonColor?: string
  buttonTextColor?: string
  fontSize: number
  fontWeight?: string
  lineHeight?: number
  letterSpacing: string
}

// Footer specific props
export interface FooterProps extends BaseComponentProps {
  companyName: string
  linkColor: string
  privacyUrl: string
  unsubscribeUrl: string
}

// Union type of all possible component props
export type ComponentProps =
  | BrandHeaderProps
  | HeaderBannerProps
  | TextSectionProps
  | FullWidthImageProps
  | TwoColumnImagesProps
  | ThreeColumnImagesProps
  | HeroBannerProps
  | ImageTextSectionProps
  | ButtonGridProps
  | SingleButtonProps
  | FooterProps

// Main EmailComponent interface
export interface EmailComponent {
  id: string
  type: ComponentType
  props: ComponentProps
  children?: EmailComponent[]
  selected?: boolean
}

// Position interfaces
export interface ToolbarPosition {
  x: number
  y: number
}

export interface ColumnInsertInfo {
  columnIndex: number | null
  componentId: string | null
}

// Action result type for server actions
export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Image upload result
export interface ImageUploadResult {
  url: string
  filename: string
  originalName: string
}
