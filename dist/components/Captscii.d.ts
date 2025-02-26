import React from "react";
export type ValidationRules = {
    sumMultiple?: number;
    thirdCharList?: string;
    lengthEven?: boolean;
    startsWith?: string;
    endsWith?: string;
    containsChar?: string;
    noRepeatingChars?: boolean;
    maxVowels?: number;
};
export declare function generateString(length: number, rules: ValidationRules): string;
export declare function generateCode(str: string): string;
export declare function verifyCode(code: string, originalStr: string, rules: ValidationRules): boolean;
export declare function generateAndVerify(length: number, rules: ValidationRules): generationResult;
export type generationResult = {
    str: string;
    code: string;
    isValid: true;
    executionTime: string;
};
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
