"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, Download } from "lucide-react"

interface HtmlExportModalProps {
  isOpen: boolean
  onClose: () => void
  htmlContent: string
}

export function HtmlExportModal({ isOpen, onClose, htmlContent }: HtmlExportModalProps) {
  const [copied, setCopied] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleCopy = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select()
      document.execCommand("copy")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "email-template.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Export HTML</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="code" className="flex-1 flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="code">HTML Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="flex-1 overflow-hidden flex flex-col">
            <div className="relative flex-1 overflow-auto">
              <textarea
                ref={textAreaRef}
                className="w-full h-full min-h-[400px] p-4 font-mono text-sm bg-gray-50 border rounded resize-none"
                value={htmlContent}
                readOnly
              />
            </div>
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-auto border rounded">
            <div className="h-full min-h-[400px] bg-white p-4">
              <iframe
                srcDoc={htmlContent}
                title="Email Preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Copy this HTML code and paste it into your email marketing platform.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy HTML"}
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download HTML
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
