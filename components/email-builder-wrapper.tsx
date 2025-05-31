"use client"

import { EmailBuilderProvider } from "@/providers/email-builder-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import DynamicEmailBuilder from "./dynamic-email-builder"

export function EmailBuilderWrapper() {
  return (
    <ErrorBoundary>
      <EmailBuilderProvider>
        <DynamicEmailBuilder />
      </EmailBuilderProvider>
    </ErrorBoundary>
  )
}
