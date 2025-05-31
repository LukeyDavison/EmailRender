import { EmailBuilderWrapper } from "@/components/email-builder-wrapper"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Email Builder",
  description: "Create beautiful email templates with our drag-and-drop builder",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <EmailBuilderWrapper />
    </main>
  )
}
