import React from "react";
import { ValidationRules, generationResult } from "../lib/CaptsciiUtils";
export type CaptsciiProps = {
    onComplete?: (word: string) => void;
    onFail?: () => void;
    onGenerate?: (word: generationResult) => void;
    diffuse?: boolean;
    colorize?: boolean;
    bgClassName?: string;
    maxChars?: number;
    useEmoji?: boolean;
    darkMode?: boolean;
    animate?: boolean;
    language?: "en" | "es";
    audioEnabled?: boolean;
    rules?: ValidationRules;
};
export declare function Captscii({ onComplete, onFail, onGenerate, diffuse, colorize, bgClassName, maxChars, useEmoji, darkMode, animate, language, audioEnabled, rules, }: CaptsciiProps): React.JSX.Element;
