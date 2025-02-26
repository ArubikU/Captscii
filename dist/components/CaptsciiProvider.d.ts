import React, { type ReactNode } from "react";
interface CaptsciiContextType {
    isVerified: boolean;
    setIsVerified: (value: boolean) => void;
}
export declare function CaptsciiProvider({ children }: {
    children: ReactNode;
}): React.JSX.Element;
export declare function useCaptscii(): CaptsciiContextType;
export {};
