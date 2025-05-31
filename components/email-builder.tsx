"use client"

import type React from "react"
import { useCallback, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Component } from "./component"
import { UnifiedEditor } from "./unified-editor"
import { HtmlEmailBlockSelector } from "./html-email-block-selector"
import { generateEmailHtml } from "../utils/html-generator"
import { HtmlExportModal } from "./html-export-modal"
import { useEmailBuilder } from "@/providers/email-builder-provider"
import { useState } from "react"
import type { ComponentType } from "@/types/email-builder"

const EmailBuilder: React.FC = () => {
  const { state, dispatch } = useEmailBuilder()
  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showHtmlExport, setShowHtmlExport] = useState(false)
  const [exportedHtml, setExportedHtml] = useState("")

  // Get the currently selected component
  const selectedComponent =
    state.headerComponent && state.headerComponent.id === state.selectedComponentId
      ? state.headerComponent
      : state.footerComponent && state.footerComponent.id === state.selectedComponentId
        ? state.footerComponent
        : state.components.find((c) => c.id === state.selectedComponentId) || null

  const addComponent = useCallback(
    (componentType: string) => {
      console.log("Adding component:", componentType)
      console.log("Current state:", {
        components: state.components.length,
        insertIndex: state.insertIndex,
        headerComponent: state.headerComponent ? state.headerComponent.id : null,
        footerComponent: state.footerComponent ? state.footerComponent.id : null,
      })

      // Dispatch the action to add the component
      dispatch({
        type: "ADD_COMPONENT",
        payload: {
          componentType: componentType as ComponentType,
          insertIndex: state.insertIndex,
        },
      })

      // Log after dispatch
      setTimeout(() => {
        console.log("After dispatch - components:", state.components.length)
      }, 0)
    },
    [dispatch, state],
  )

  const handleComponentClick = useCallback(
    (component: any, e: React.MouseEvent | null) => {
      // Always stop propagation to prevent bubbling
      if (e) {
        e.stopPropagation()
      }

      console.log(`Clicked component: ${component.id} (${component.type})`)

      dispatch({
        type: "SELECT_COMPONENT",
        payload: {
          id: component.id,
          position: { x: 0, y: 0 },
        },
      })
    },
    [dispatch],
  )

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Only respond if clicking directly on the canvas, not on a child
      if (e.target === e.currentTarget) {
        dispatch({ type: "DESELECT_COMPONENT" })
      }
    },
    [dispatch],
  )

  const deleteComponent = useCallback(
    (componentId: string) => {
      dispatch({ type: "DELETE_COMPONENT", payload: componentId })
    },
    [dispatch],
  )

  const duplicateComponent = useCallback(
    (componentId: string) => {
      dispatch({ type: "DUPLICATE_COMPONENT", payload: componentId })
    },
    [dispatch],
  )

  const moveComponent = useCallback(
    (componentId: string, direction: "up" | "down") => {
      dispatch({
        type: "MOVE_COMPONENT",
        payload: { id: componentId, direction },
      })
    },
    [dispatch],
  )

  const updateComponentProps = useCallback(
    (componentId: string, newProps: any) => {
      dispatch({
        type: "UPDATE_COMPONENT",
        payload: { id: componentId, props: newProps },
      })
    },
    [dispatch],
  )

  const handlePreview = () => {
    const html = generateEmailHtml(state.components, state.headerComponent, state.footerComponent)
    // Store the HTML in localStorage for the preview page to access
    localStorage.setItem("emailPreviewHtml", html)
    window.open(`/preview?timestamp=${Date.now()}`, "_blank")
  }

  const handleExportHtml = () => {
    const html = generateEmailHtml(state.components, state.headerComponent, state.footerComponent)
    setExportedHtml(html)
    setShowHtmlExport(true)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-[calc(100vh-150px)] w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Design Your Email</h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportHtml}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Export HTML
            </button>
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Preview
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex" ref={containerRef}>
          {/* Canvas area with panels */}
          <div className="flex-1 overflow-auto p-8 bg-gray-50 relative" ref={canvasRef} onClick={handleCanvasClick}>
            <div className="relative mx-auto" style={{ maxWidth: "1050px" }}>
              {/* Component panel on the left */}
              <div
                className="absolute left-0 top-0 bg-white border rounded-l shadow-md w-[80px] z-20"
                style={{
                  height: "auto",
                  maxHeight: "calc(100vh - 150px)",
                  overflowY: "auto",
                  scrollbarWidth: "none" /* Firefox */,
                  msOverflowStyle: "none" /* IE and Edge */,
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="p-4">
                  <HtmlEmailBlockSelector isFixed={true} onSelectBlock={addComponent} onClose={() => {}} />
                </div>
              </div>

              {/* Email content container - centered */}
              <div
                className="bg-white mx-auto border rounded shadow-sm"
                style={{
                  width: "650px",
                  minHeight: "800px",
                  margin: "0 auto",
                  marginLeft: "90px" /* Space for left panel */,
                  marginRight: selectedComponent ? "310px" : "0" /* Space for right panel when visible */,
                }}
              >
                {state.components.length === 0 && !state.headerComponent && !state.footerComponent ? (
                  <div className="flex flex-col items-center justify-center h-[500px] border border-dashed border-gray-300 rounded-lg text-gray-500 m-4">
                    <p className="text-center text-6xl font-serif text-gray-500">LKB</p>
                  </div>
                ) : (
                  <div>
                    {/* Header always at the top */}
                    {state.headerComponent && (
                      <div className="py-4">
                        <Component
                          key={state.headerComponent.id}
                          component={state.headerComponent}
                          onClick={handleComponentClick}
                          onDelete={deleteComponent}
                          onDuplicate={duplicateComponent}
                          onMove={moveComponent}
                          onUpdateProps={updateComponentProps}
                        />
                      </div>
                    )}

                    {/* Regular components */}
                    <div className="p-4">
                      {state.components.map((component, index) => (
                        <div key={component.id} className="py-2">
                          <Component
                            component={component}
                            onClick={handleComponentClick}
                            onDelete={deleteComponent}
                            onDuplicate={duplicateComponent}
                            onMove={moveComponent}
                            onUpdateProps={updateComponentProps}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Footer always at the bottom */}
                    {state.footerComponent && (
                      <div className="mt-8 border-t border-gray-200 py-4">
                        <Component
                          key={state.footerComponent.id}
                          component={state.footerComponent}
                          onClick={handleComponentClick}
                          onDelete={deleteComponent}
                          onDuplicate={duplicateComponent}
                          onMove={moveComponent}
                          onUpdateProps={updateComponentProps}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Settings panel on the right */}
              {selectedComponent && (
                <div
                  className="absolute right-0 top-0 bg-white border rounded-r shadow-md w-[300px] z-20"
                  style={{
                    height: "auto",
                    maxHeight: "calc(100vh - 150px)",
                    overflowY: "auto",
                    scrollbarWidth: "none" /* Firefox */,
                    msOverflowStyle: "none" /* IE and Edge */,
                  }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <div className="p-4">
                    <UnifiedEditor
                      position={{ x: 0, y: 0 }}
                      component={selectedComponent}
                      onDelete={deleteComponent}
                      onDuplicate={duplicateComponent}
                      onMove={moveComponent}
                      onUpdateProps={updateComponentProps}
                      onClose={() => dispatch({ type: "DESELECT_COMPONENT" })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <HtmlExportModal isOpen={showHtmlExport} onClose={() => setShowHtmlExport(false)} htmlContent={exportedHtml} />
    </DndProvider>
  )
}

export default EmailBuilder
