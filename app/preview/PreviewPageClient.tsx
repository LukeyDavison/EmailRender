"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function PreviewPageClient() {
  const [loading, setLoading] = useState(true)
  const [emailHtml, setEmailHtml] = useState<string>("")
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the email HTML from localStorage
    const storedHtml = localStorage.getItem("emailPreviewHtml")

    if (storedHtml) {
      setEmailHtml(storedHtml)
    } else {
      // Fallback to default content if no stored HTML
      setEmailHtml(`
        <div style="max-width: 650px; margin: 0 auto; padding: 20px; font-family: Georgia, serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 35px; font-weight: normal; letter-spacing: 2px;">LKB</h2>
          </div>
          <div style="text-align: center; padding: 20px;">
            <p style="font-size: 17px; line-height: 1.8; letter-spacing: 2px;">
              No email content found. Please go back to the builder and try again.
            </p>
          </div>
        </div>
      `)
    }

    setLoading(false)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleClose = () => {
    window.close()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Email Preview</h1>
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Print
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div
              className="email-preview-content"
              dangerouslySetInnerHTML={{ __html: emailHtml }}
              style={{
                maxWidth: "100%",
                overflow: "hidden",
              }}
            />
          )}
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>This is a preview only. The actual email may appear differently in various email clients.</p>
        </div>
      </div>
    </div>
  )
}
