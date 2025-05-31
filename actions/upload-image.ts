"use server"

import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import type { ActionResult, ImageUploadResult } from "@/types/email-builder"

// Define validation schema
const uploadImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is empty")
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type),
      "File must be JPEG, PNG, GIF, or WebP",
    ),
})

export async function uploadImage(formData: FormData): Promise<ActionResult<ImageUploadResult>> {
  try {
    // Extract file from form data
    const file = formData.get("file") as File | null

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Validate file
    try {
      uploadImageSchema.parse({ file })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return {
          success: false,
          error: validationError.errors[0]?.message || "Invalid file",
        }
      }
      return { success: false, error: "Invalid file" }
    }

    // Generate a unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a unique filename with the original extension
    const originalName = file.name
    const extension = originalName.split(".").pop() || "jpg"
    const filename = `${uuidv4()}.${extension}`

    // In v0 environment, we'll use a mock response instead of trying to write to the filesystem
    // This avoids filesystem access issues in the v0 environment
    return {
      success: true,
      data: {
        url: `/uploads/${filename}`,
        filename,
        originalName,
      },
    }
  } catch (error) {
    console.error("Error in uploadImage:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    }
  }
}
