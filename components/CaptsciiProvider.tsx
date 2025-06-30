"use client"

import React, { type ReactNode } from "react"

/**
 * @deprecated Providers are deprecated and should not be used.
 * For practicality, this provider simply renders its children.
 */
export function CaptsciiProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/**
 * @deprecated Providers are deprecated and should not be used.
 * This hook now throws an error when invoked.
 */
export function useCaptscii() {
  throw new Error("CaptsciiProvider is deprecated and should not be used.")
}
