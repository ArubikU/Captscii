"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
export function generateString(length, rules) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    if (rules.startsWith) {
        result += rules.startsWith[Math.floor(Math.random() * rules.startsWith.length)];
    }
    for (let i = result.length; i < length - (rules.endsWith ? 1 : 0); i++) {
        let randomChar = chars[Math.floor(Math.random() * chars.length)];
        if (rules.noRepeatingChars && result.includes(randomChar)) {
            i--;
            continue;
        }
        result += randomChar;
    }
    if (rules.endsWith) {
        result += rules.endsWith[Math.floor(Math.random() * rules.endsWith.length)];
    }
    if (rules.thirdCharList && result.length >= 3) {
        result = result.substring(0, 2) + rules.thirdCharList[Math.floor(Math.random() * rules.thirdCharList.length)] + result.substring(3);
    }
    if (rules.containsChar && !result.includes(rules.containsChar)) {
        result = result.substring(0, result.length - 1) + rules.containsChar;
    }
    return result;
}
export function generateCode(str) {
    return str.split('').map(char => char.charCodeAt(0).toString(16)).join('');
}
export function verifyCode(code, originalStr, rules) {
    let decodedStr = "";
    for (let i = 0; i < code.length; i += 2) {
        decodedStr += String.fromCharCode(parseInt(code.substring(i, i + 2), 16));
    }
    if (rules.sumMultiple) {
        const sumAscii = decodedStr.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        if (sumAscii % rules.sumMultiple !== 0)
            return false;
    }
    if (rules.thirdCharList && decodedStr.length >= 3 && !rules.thirdCharList.includes(decodedStr[2]))
        return false;
    if (rules.lengthEven && code.length % 2 !== 0)
        return false;
    if (rules.startsWith && !rules.startsWith.includes(decodedStr[0]))
        return false;
    if (rules.endsWith && !rules.endsWith.includes(decodedStr[decodedStr.length - 1]))
        return false;
    if (rules.containsChar && !decodedStr.includes(rules.containsChar))
        return false;
    if (rules.noRepeatingChars && new Set(decodedStr).size !== decodedStr.length)
        return false;
    if (rules.maxVowels) {
        const vowelCount = decodedStr.split('').filter(c => "AEIOU".includes(c)).length;
        if (vowelCount > rules.maxVowels)
            return false;
    }
    return decodedStr === originalStr;
}
export function generateAndVerify(length, rules) {
    let str, code, isValid;
    let attempts = 0, maxAttempts = 1000; // Evitar bucle infinito
    const startTime = performance.now();
    do {
        if (attempts++ > maxAttempts)
            throw new Error("No se pudo generar una cadena válida dentro del límite de intentos");
        str = generateString(length, rules);
        code = generateCode(str);
        isValid = verifyCode(code, str, rules);
    } while (!isValid);
    const endTime = performance.now();
    console.log(`Tiempo de ejecución: ${(endTime - startTime).toFixed(4)} ms`);
    return { str, code, isValid, executionTime: (endTime - startTime).toFixed(4) };
}
const asciiLetters = {
    A: ["  A  ", " A A ", "AAAAA", "A   A", "A   A"],
    B: ["BBBB ", "B   B", "BBBB ", "B   B", "BBBB "],
    C: [" CCCC", "C    ", "C    ", "C    ", " CCCC"],
    D: ["DDDD ", "D   D", "D   D", "D   D", "DDDD "],
    E: ["EEEEE", "E    ", "EEE  ", "E    ", "EEEEE"],
    F: ["FFFFF", "F    ", "FFF  ", "F    ", "F    "],
    G: [" GGGG", "G    ", "G  GG", "G   G", " GGGG"],
    H: ["H   H", "H   H", "HHHHH", "H   H", "H   H"],
    I: ["IIIII", "  I  ", "  I  ", "  I  ", "IIIII"],
    J: ["JJJJJ", "  J  ", "  J  ", "J J  ", " JJ  "],
    K: ["K   K", "K  K ", "KKK  ", "K  K ", "K   K"],
    L: ["L    ", "L    ", "L    ", "L    ", "LLLLL"],
    M: ["M   M", "MM MM", "M M M", "M   M", "M   M"],
    N: ["N   N", "NN  N", "N N N", "N  NN", "N   N"],
    O: [" OOO ", "O   O", "O   O", "O   O", " OOO "],
    P: ["PPPP ", "P   P", "PPPP ", "P    ", "P    "],
    Q: [" QQQ ", "Q   Q", "Q   Q", "Q  Q ", " QQ Q"],
    R: ["RRRR ", "R   R", "RRRR ", "R  R ", "R   R"],
    S: [" SSSS", "S    ", " SSS ", "    S", "SSSS "],
    T: ["TTTTT", "  T  ", "  T  ", "  T  ", "  T  "],
    U: ["U   U", "U   U", "U   U", "U   U", " UUU "],
    V: ["V   V", "V   V", "V   V", " V V ", "  V  "],
    W: ["W   W", "W   W", "W W W", "WW WW", "W   W"],
    X: ["X   X", " X X ", "  X  ", " X X ", "X   X"],
    Y: ["Y   Y", " Y Y ", "  Y  ", "  Y  ", "  Y  "],
    Z: ["ZZZZZ", "   Z ", "  Z  ", " Z   ", "ZZZZZ"],
};
const emojiLetters = {
    A: "🅰️",
    B: "🅱️",
    C: "©️",
    D: "🇩",
    E: "📧",
    F: "🎏",
    G: "🇬",
    H: "♓",
    I: "ℹ️",
    J: "🗾",
    K: "🇰",
    L: "🇱",
    M: "Ⓜ️",
    N: "🇳",
    O: "🅾️",
    P: "🅿️",
    Q: "🇶",
    R: "®️",
    S: "💲",
    T: "✝️",
    U: "⛎",
    V: "♈",
    W: "〰️",
    X: "❌",
    Y: "💹",
    Z: "💤",
};
const diffuseChar = (char) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const index = alphabet.indexOf(char);
    const range = [-2, -1, 0, 1, 2];
    const newIndex = (index + range[Math.floor(Math.random() * range.length)] + 26) % 26;
    return alphabet[newIndex];
};
const colorize = () => {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
};
const renderWord = (word, diffuse, colorized, useEmoji) => {
    const lines = ["", "", "", "", ""];
    if (word == "")
        return (React.createElement(React.Fragment, null, " "));
    for (const letter of word.toUpperCase()) {
        if (useEmoji) {
            lines[2] += emojiLetters[letter] || letter;
        }
        else {
            const asciiLetter = asciiLetters[letter] || asciiLetters["A"]; // Fallback to 'A'
            for (let i = 0; i < 5; i++) {
                const chars = asciiLetter[i]
                    .split("")
                    .map((char, index) => {
                    if (char === " ")
                        return "‏‏‎ ‎";
                    const displayChar = diffuse ? diffuseChar(char) : char;
                    return colorized ? `<span style='color:${colorize()}'>${displayChar}</span>` : displayChar;
                })
                    .join("");
                lines[i] += chars + "‏‏‎ ‎";
            }
        }
    }
    return (React.createElement(React.Fragment, null, lines.map((line, index) => (React.createElement("div", { key: index, dangerouslySetInnerHTML: { __html: line.trimEnd() } })))));
};
export function Captscii({ onComplete, onFail, onGenerate, diffuse = false, colorize = false, bgClassName = "bg-gray-100", maxChars = 6, useEmoji = false, darkMode = false, animate = true, language = "en", audioEnabled = false, rules = {
    sumMultiple: 5,
    thirdCharList: "AEIOU",
    lengthEven: true,
    startsWith: "ABC",
    endsWith: "XYZ",
    containsChar: "M",
    noRepeatingChars: true,
    maxVowels: 2
}, }) {
    const [captchaWord, setCaptchaWord] = useState("");
    const [userInput, setUserInput] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [shake, setShake] = useState(false);
    const generateNewCaptcha = useCallback(() => {
        const words = generateAndVerify(maxChars, rules);
        const newWord = words.str;
        localStorage.setItem("captscii_" + newWord, words.code);
        setCaptchaWord(newWord);
        setUserInput("");
        setAttempts(0);
        if (onGenerate)
            onGenerate(words);
    }, [rules]);
    useEffect(() => {
        generateNewCaptcha();
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (verifyCode(localStorage.getItem("captscii_" + userInput) || "", userInput, rules)) {
            if (onComplete)
                onComplete(captchaWord);
            generateNewCaptcha();
        }
        else {
            setAttempts(attempts + 1);
            setShake(true); // Trigger shake effect
            setTimeout(() => setShake(false), 500); // Reset shake after animation
            if (onFail)
                onFail();
            if (attempts >= 2) {
                generateNewCaptcha();
            }
            else {
                setUserInput("");
            }
        }
    };
    const playAudio = () => {
        if (audioEnabled) {
            const utterance = new SpeechSynthesisUtterance(captchaWord.split("").join(" "));
            window.speechSynthesis.speak(utterance);
        }
    };
    const containerClass = `max-w-md mx-auto p-6 rounded-lg shadow-md ${bgClassName} ${darkMode ? "text-gray-100" : "text-gray-900"}`;
    const captchaClass = `font-mono text-xs mb-4 p-2 rounded overflow-x-auto ${darkMode ? "bg-gray-800" : "bg-gray-200"}`;
    const buttonClass = `px-4 py-2 rounded-md transition-colors duration-200 ${darkMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-700"}`;
    const [renderedWord, setRenderedWord] = useState(renderWord(captchaWord, diffuse, colorize, useEmoji));
    useEffect(() => {
        setRenderedWord(renderWord(captchaWord, diffuse, colorize, useEmoji));
    }, [captchaWord, diffuse, colorize, useEmoji]);
    return (React.createElement("div", { className: containerClass },
        React.createElement("h2", { className: "text-2xl font-bold mb-4" }, "Captscii"),
        React.createElement(motion.div, { className: captchaClass, animate: animate ? { scale: [0.9, 1.1, 1] } : {}, transition: { duration: 0.5 } }, renderedWord),
        React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
            React.createElement(motion.div, { animate: shake ? { x: [-10, 10, -10, 10, 0] } : {}, transition: { duration: 0.4 }, className: shake ? "border-2 border-red-500 bg-red-300" : "" },
                React.createElement(Input, { type: "text", value: userInput, onChange: (e) => setUserInput(e.target.value), placeholder: language === "en" ? "Enter the CAPTCHA text" : "Ingrese el texto del CAPTCHA", className: shake ? "bg-red-500 w-full" : "w-full", maxLength: maxChars })),
            React.createElement("div", { className: "flex space-x-2" },
                React.createElement(Button, { type: "submit", className: buttonClass }, language === "en" ? "Verify" : "Verificar"),
                React.createElement(Button, { type: "button", onClick: generateNewCaptcha, className: `${buttonClass} border-none` }, language === "en" ? "New CAPTCHA" : "Nuevo CAPTCHA"),
                audioEnabled && (React.createElement(Button, { type: "button", onClick: playAudio, className: `${buttonClass} border-none` }, language === "en" ? "Play Audio" : "Reproducir Audio"))))));
}
