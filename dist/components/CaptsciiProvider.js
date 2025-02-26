"use client";
import React, { createContext, useContext, useState } from "react";
const CaptsciiContext = createContext(undefined);
export function CaptsciiProvider({ children }) {
    const [isVerified, setIsVerified] = useState(false);
    return React.createElement(CaptsciiContext.Provider, { value: { isVerified, setIsVerified } }, children);
}
export function useCaptscii() {
    const context = useContext(CaptsciiContext);
    if (context === undefined) {
        throw new Error("useCaptscii must be used within a CaptsciiProvider");
    }
    return context;
}
