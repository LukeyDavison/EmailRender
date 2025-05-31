import type { Metadata } from "next"
import PreviewPageClient from "./PreviewPageClient"

export const metadata: Metadata = {
  title: "Email Preview",
  description: "Preview your email template before sending",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PreviewPage() {
  return <PreviewPageClient />
}
