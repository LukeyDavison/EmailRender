"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode, useMemo, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import type { EmailComponent, ComponentProps, ComponentType } from "@/types/email-builder"

// State interface
interface EmailBuilderState {
  components: EmailComponent[]
  headerComponent: EmailComponent | null
  footerComponent: EmailComponent | null
  selectedComponentId: string | null
  showEditor: boolean
  editorPosition: { x: number; y: number }
  insertIndex: number | null
  columnInsertInfo: {
    columnIndex: number | null
    componentId: string | null
  } | null
}

// Initial state
const initialState: EmailBuilderState = {
  components: [],
  headerComponent: null,
  footerComponent: null,
  selectedComponentId: null,
  showEditor: false,
  editorPosition: { x: 0, y: 0 },
  insertIndex: null,
  columnInsertInfo: null,
}

// Action types
type EmailBuilderAction =
  | { type: "SET_COMPONENTS"; payload: EmailComponent[] }
  | { type: "ADD_COMPONENT"; payload: { componentType: ComponentType; insertIndex?: number | null } }
  | { type: "UPDATE_COMPONENT"; payload: { id: string; props: Partial<ComponentProps> } }
  | { type: "DELETE_COMPONENT"; payload: string }
  | { type: "DUPLICATE_COMPONENT"; payload: string }
  | { type: "MOVE_COMPONENT"; payload: { id: string; direction: "up" | "down" } }
  | { type: "SELECT_COMPONENT"; payload: { id: string; position?: { x: number; y: number } } }
  | { type: "DESELECT_COMPONENT" }
  | { type: "SET_HEADER_COMPONENT"; payload: EmailComponent }
  | { type: "SET_FOOTER_COMPONENT"; payload: EmailComponent }
  | { type: "SET_INSERT_INDEX"; payload: number | null }
  | { type: "SET_COLUMN_INSERT_INFO"; payload: { columnIndex: number | null; componentId: string | null } | null }
  | { type: "INITIALIZE_DEFAULT_COMPONENTS" }

// Helper functions
const findComponent = (components: EmailComponent[], id: string): EmailComponent | null => {
  for (const component of components) {
    if (component.id === id) return component
    if (component.children) {
      const found = findComponent(component.children, id)
      if (found) return found
    }
  }
  return null
}

const findComponentIndex = (components: EmailComponent[], id: string): number => {
  return components.findIndex((c) => c.id === id)
}

// Helper function to get default props for a component type
function getDefaultPropsForType(type: ComponentType): ComponentProps {
  switch (type) {
    case "brand-header":
      return {
        logoUrl: "https://link.email.lkbennett.com/custloads/816689973/vce/logo1.png",
        logoWidth: 218,
        logoAlt: "LK Bennett London",
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        borderHeight: 3,
        spacingTop: 30,
        spacingBottom: 30,
      } as any
    case "header-banner":
      return {
        title: "Header Title",
        backgroundColor: "#f8f9fa",
        textColor: "#000000",
        fontSize: 35,
        fontWeight: "normal",
        lineHeight: 1,
        letterSpacing: "2px",
      } as any
    case "text-section":
      return {
        text: "Sample text content",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        fontSize: 17,
        fontWeight: "normal",
        textAlign: "center",
        lineHeight: 1.8,
        letterSpacing: "2px",
      } as any
    case "full-width-image":
      return {
        imageUrl: "/placeholder.jpg",
        imageAlt: "Full width image",
        backgroundColor: "#ffffff",
      } as any
    case "two-column-images":
      return {
        image1Url: "/placeholder.jpg",
        image1Alt: "Image 1",
        image2Url: "/placeholder.jpg",
        image2Alt: "Image 2",
        spacing: 8,
        backgroundColor: "#ffffff",
      } as any
    case "three-column-images":
      return {
        image1Url: "/placeholder.jpg",
        image1Alt: "Image 1",
        image2Url: "/placeholder.jpg",
        image2Alt: "Image 2",
        image3Url: "/placeholder.jpg",
        image3Alt: "Image 3",
        spacing: 8,
        backgroundColor: "#ffffff",
      } as any
    case "hero-banner":
      return {
        imageUrl: "/placeholder.jpg",
        title: "Hero Title",
        subtitle: "Hero subtitle text",
        overlayColor: "rgba(0,0,0,0.3)",
        fontSize: 35,
        subtitleFontSize: 17,
        fontWeight: "normal",
        lineHeight: 1,
        letterSpacing: "2px",
        buttonText: "Button",
        buttonStyle: "outlined",
        buttonColor: "#000000",
        buttonTextColor: "#ffffff",
        backgroundColor: "#ffffff",
        textColor: "#ffffff",
      } as any
    case "image-text-section":
      return {
        imageUrl: "/placeholder.jpg",
        imageAlt: "Image",
        title: "Section Title",
        text: "Section text content goes here",
        fontSize: 17,
        fontWeight: "normal",
        lineHeight: 1.8,
        letterSpacing: "2px",
        textAlign: "left",
        buttonText: "Button",
        buttonStyle: "outlined",
        buttonColor: "#1a82e2",
        buttonTextColor: "#ffffff",
        backgroundColor: "#ffffff",
        textColor: "#000000",
      } as any
    case "button-grid":
      return {
        buttonCount: 3,
        spacing: 8,
        backgroundColor: "#ffffff",
        buttonStyle: "outlined",
        buttonColor: "#000000",
        buttonTextColor: "#000000",
        fontSize: 17,
        fontWeight: "normal",
        lineHeight: 1.8,
        letterSpacing: "1.5px",
        button1Text: "Button 1",
        button2Text: "Button 2",
        button3Text: "Button 3",
      } as any
    case "single-button":
      return {
        buttonText: "Click Here To Join",
        buttonUrl: "#",
        buttonStyle: "outlined",
        buttonColor: "#000000",
        buttonTextColor: "#000000",
        fontSize: 17,
        fontWeight: "normal",
        lineHeight: 1.8,
        letterSpacing: "1.5px",
        backgroundColor: "#ffffff",
      } as any
    case "footer":
      return {
        companyName: "Your Company",
        backgroundColor: "#f8f9fa",
        textColor: "#666666",
        linkColor: "#1a82e2",
        privacyUrl: "#",
        unsubscribeUrl: "#",
      } as any
    default:
      return {} as any
  }
}

// Reducer function
function emailBuilderReducer(state: EmailBuilderState, action: EmailBuilderAction): EmailBuilderState {
  switch (action.type) {
    case "INITIALIZE_DEFAULT_COMPONENTS": {
      // Initialize header and footer if they don't exist
      const newHeader: EmailComponent = {
        id: uuidv4(),
        type: "brand-header",
        props: getDefaultPropsForType("brand-header"),
      }

      const newFooter: EmailComponent = {
        id: uuidv4(),
        type: "footer",
        props: getDefaultPropsForType("footer"),
      }

      return {
        ...state,
        headerComponent: newHeader,
        footerComponent: newFooter,
      }
    }

    case "SET_COMPONENTS":
      return {
        ...state,
        components: action.payload,
      }

    case "ADD_COMPONENT": {
      const { componentType, insertIndex } = action.payload

      console.log("Reducer: Adding component", componentType)
      console.log("Current state:", {
        components: state.components.length,
        insertIndex: state.insertIndex,
        headerComponent: state.headerComponent ? state.headerComponent.id : null,
        footerComponent: state.footerComponent ? state.footerComponent.id : null,
      })

      // Don't add another header if one already exists
      if (componentType === "brand-header" && state.headerComponent) {
        console.log("Header already exists, skipping")
        return state
      }

      // Don't add another footer if one already exists
      if (componentType === "footer" && state.footerComponent) {
        console.log("Footer already exists, skipping")
        return state
      }

      const newComponent: EmailComponent = {
        id: uuidv4(),
        type: componentType,
        props: getDefaultPropsForType(componentType),
      }

      console.log("Created new component:", newComponent)

      // If this is a header, set it as the header component
      if (componentType === "brand-header") {
        console.log("Setting as header component")
        return {
          ...state,
          headerComponent: newComponent,
        }
      }

      // If this is a footer, set it as the footer component
      if (componentType === "footer") {
        console.log("Setting as footer component")
        return {
          ...state,
          footerComponent: newComponent,
        }
      }

      // Otherwise add to regular components
      const newComponents = [...state.components]

      if (insertIndex !== undefined && insertIndex !== null) {
        console.log("Inserting at index:", insertIndex)
        newComponents.splice(insertIndex, 0, newComponent)
      } else if (state.columnInsertInfo) {
        console.log("Column insert info:", state.columnInsertInfo)
        // Handle column insertion logic
        // This would need to be implemented based on your specific requirements
        // For now, just add to the end
        newComponents.push(newComponent)
      } else {
        console.log("Adding to end of components")
        newComponents.push(newComponent)
      }

      console.log("Updated components:", newComponents.length)

      return {
        ...state,
        components: newComponents,
        insertIndex: null,
        columnInsertInfo: null,
      }
    }

    case "UPDATE_COMPONENT": {
      const { id, props } = action.payload

      // Check if it's the header
      if (state.headerComponent && state.headerComponent.id === id) {
        return {
          ...state,
          headerComponent: {
            ...state.headerComponent,
            props: { ...state.headerComponent.props, ...props },
          },
        }
      }

      // Check if it's the footer
      if (state.footerComponent && state.footerComponent.id === id) {
        return {
          ...state,
          footerComponent: {
            ...state.footerComponent,
            props: { ...state.footerComponent.props, ...props },
          },
        }
      }

      // Otherwise update in regular components
      const updatedComponents = state.components.map((component) => {
        if (component.id === id) {
          return {
            ...component,
            props: { ...component.props, ...props },
          }
        }

        // Check if the component has children
        if (component.children) {
          return {
            ...component,
            children: updateComponentChildren(component.children, id, props),
          }
        }

        return component
      })

      return {
        ...state,
        components: updatedComponents,
      }
    }

    case "DELETE_COMPONENT": {
      const id = action.payload

      // Don't delete header or footer
      if (
        (state.headerComponent && state.headerComponent.id === id) ||
        (state.footerComponent && state.footerComponent.id === id)
      ) {
        return state
      }

      const filteredComponents = state.components.filter((c) => c.id !== id)

      return {
        ...state,
        components: filteredComponents,
        selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
        showEditor: state.selectedComponentId === id ? false : state.showEditor,
      }
    }

    case "DUPLICATE_COMPONENT": {
      const id = action.payload

      // Don't duplicate header or footer
      if (
        (state.headerComponent && state.headerComponent.id === id) ||
        (state.footerComponent && state.footerComponent.id === id)
      ) {
        return state
      }

      const componentToDuplicate = findComponent(state.components, id)

      if (!componentToDuplicate) {
        return state
      }

      const duplicatedComponent: EmailComponent = {
        ...componentToDuplicate,
        id: uuidv4(),
        selected: false,
      }

      const index = findComponentIndex(state.components, id)

      if (index === -1) {
        return state
      }

      const newComponents = [...state.components]
      newComponents.splice(index + 1, 0, duplicatedComponent)

      return {
        ...state,
        components: newComponents,
      }
    }

    case "MOVE_COMPONENT": {
      const { id, direction } = action.payload

      // Don't move header or footer
      if (
        (state.headerComponent && state.headerComponent.id === id) ||
        (state.footerComponent && state.footerComponent.id === id)
      ) {
        return state
      }

      const index = findComponentIndex(state.components, id)

      if (index === -1) {
        return state
      }

      const newComponents = [...state.components]

      if (direction === "up" && index > 0) {
        // Swap with previous component
        ;[newComponents[index - 1], newComponents[index]] = [newComponents[index], newComponents[index - 1]]
      } else if (direction === "down" && index < newComponents.length - 1) {
        // Swap with next component
        ;[newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]]
      }

      return {
        ...state,
        components: newComponents,
      }
    }

    case "SELECT_COMPONENT": {
      const { id, position } = action.payload

      // Deselect all components
      const updatedComponents = state.components.map((c) => ({
        ...c,
        selected: c.id === id,
        children: c.children
          ? c.children.map((child) => ({
              ...child,
              selected: false,
            }))
          : undefined,
      }))

      // Update header selection
      const updatedHeader = state.headerComponent
        ? {
            ...state.headerComponent,
            selected: state.headerComponent.id === id,
          }
        : null

      // Update footer selection
      const updatedFooter = state.footerComponent
        ? {
            ...state.footerComponent,
            selected: state.footerComponent.id === id,
          }
        : null

      return {
        ...state,
        components: updatedComponents,
        headerComponent: updatedHeader,
        footerComponent: updatedFooter,
        selectedComponentId: id,
        showEditor: true,
        editorPosition: position || state.editorPosition,
      }
    }

    case "DESELECT_COMPONENT": {
      // Deselect all components
      const updatedComponents = state.components.map((c) => ({
        ...c,
        selected: false,
        children: c.children
          ? c.children.map((child) => ({
              ...child,
              selected: false,
            }))
          : undefined,
      }))

      // Deselect header
      const updatedHeader = state.headerComponent
        ? {
            ...state.headerComponent,
            selected: false,
          }
        : null

      // Deselect footer
      const updatedFooter = state.footerComponent
        ? {
            ...state.footerComponent,
            selected: false,
          }
        : null

      return {
        ...state,
        components: updatedComponents,
        headerComponent: updatedHeader,
        footerComponent: updatedFooter,
        selectedComponentId: null,
        showEditor: false,
      }
    }

    case "SET_HEADER_COMPONENT":
      return {
        ...state,
        headerComponent: action.payload,
      }

    case "SET_FOOTER_COMPONENT":
      return {
        ...state,
        footerComponent: action.payload,
      }

    case "SET_INSERT_INDEX":
      return {
        ...state,
        insertIndex: action.payload,
      }

    case "SET_COLUMN_INSERT_INFO":
      return {
        ...state,
        columnInsertInfo: action.payload,
      }

    default:
      return state
  }
}

// Helper function to update component children
function updateComponentChildren(
  children: EmailComponent[],
  id: string,
  props: Partial<ComponentProps>,
): EmailComponent[] {
  return children.map((child) => {
    if (child.id === id) {
      return {
        ...child,
        props: { ...child.props, ...props },
      }
    }

    if (child.children) {
      return {
        ...child,
        children: updateComponentChildren(child.children, id, props),
      }
    }

    return child
  })
}

// Create context
interface EmailBuilderContextType {
  state: EmailBuilderState
  dispatch: React.Dispatch<EmailBuilderAction>
}

const EmailBuilderContext = createContext<EmailBuilderContextType | undefined>(undefined)

// Provider component
export function EmailBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(emailBuilderReducer, initialState)

  // Initialize default components on mount
  useEffect(() => {
    dispatch({ type: "INITIALIZE_DEFAULT_COMPONENTS" })
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ state, dispatch }), [state])

  return <EmailBuilderContext.Provider value={contextValue}>{children}</EmailBuilderContext.Provider>
}

// Custom hook to use the context
export function useEmailBuilder() {
  const context = useContext(EmailBuilderContext)

  if (context === undefined) {
    throw new Error("useEmailBuilder must be used within an EmailBuilderProvider")
  }

  return context
}
