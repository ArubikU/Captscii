"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"

interface CaptsciiContextType {
  isVerified: boolean
  setIsVerified: (value: boolean) => void
}

const CaptsciiContext = createContext<CaptsciiContextType | undefined>(undefined)

export function CaptsciiProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState(false)

  return <CaptsciiContext.Provider value={{ isVerified, setIsVerified }}>{children}</CaptsciiContext.Provider>
}

export function useCaptscii() {
  const context = useContext(CaptsciiContext)
  if (context === undefined) {
    throw new Error("useCaptscii must be used within a CaptsciiProvider")
  }
  return context
}

