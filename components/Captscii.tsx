"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

import { motion } from "framer-motion"
import { ValidationRules, generateAndVerify, generationResult, verifyCode } from "../lib/CaptsciiUtils"

export type CaptsciiProps = {
  onComplete?: (word: string) => void
  onFail?: () => void
  onGenerate?: (word: generationResult) => void
  diffuse?: boolean
  colorize?: boolean
  bgClassName?: string
  maxChars?: number
  useEmoji?: boolean
  darkMode?: boolean
  animate?: boolean
  language?: "en" | "es"
  audioEnabled?: boolean
  rules?: ValidationRules
}

const asciiLetters: { [key: string]: string[] } = {
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
}

const emojiLetters: { [key: string]: string } = {
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
}


const diffuseChar = (char: string): string => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const index = alphabet.indexOf(char)
  const range = [-2, -1, 0, 1, 2]
  const newIndex = (index + range[Math.floor(Math.random() * range.length)] + 26) % 26
  return alphabet[newIndex]
}

const colorize = (): string => {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
}

const renderWord = (word: string, diffuse: boolean, colorized: boolean, useEmoji: boolean): React.JSX.Element => {
  const lines: string[] = ["", "", "", "", ""]
  if(word=="") return (<> </>)
  for (const letter of word.toUpperCase()) {
    if (useEmoji) {
      lines[2] += emojiLetters[letter] || letter
    } else {
      const asciiLetter = asciiLetters[letter] || asciiLetters["A"] // Fallback to 'A'
      for (let i = 0; i < 5; i++) {
        const chars = asciiLetter[i]
          .split("")
          .map((char, index) => {
            if (char === " ") return "‏‏‎ ‎"
            const displayChar = diffuse ? diffuseChar(char) : char
            return colorized ? `<span style='color:${colorize()}'>${displayChar}</span>` : displayChar
          })
          .join("")
        lines[i] += chars + "‏‏‎ ‎"
      }
    }
  }

  return (
    <>
      {lines.map((line, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: line.trimEnd() }}></div>
      ))}
    </>
  )
}

export function Captscii({
  onComplete,
  onFail,
  onGenerate,
  diffuse = false,
  colorize = false,
  bgClassName = "bg-gray-100",
  maxChars = 6,
  useEmoji = false,
  darkMode = false,
  animate = true,
  language = "en",
  audioEnabled = false,
  rules = {
  sumMultiple: 5,
  thirdCharList: "AEIOU",
  lengthEven: true,
  startsWith: "ABC",
  endsWith: "XYZ",
  containsChar: "M",
  noRepeatingChars: true,
  maxVowels: 2
},
}: CaptsciiProps) {
  const [captchaWord, setCaptchaWord] = useState("")
  const [userInput, setUserInput] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [shake, setShake] = useState(false);
  const [locked, setLocked] = useState(false);


  const generateNewCaptcha = useCallback(() => {
    const words = generateAndVerify(maxChars, rules)
    const newWord = words.str
    localStorage.setItem("captscii_"+newWord, words.code)
    setCaptchaWord(newWord)
    setUserInput("")
    setAttempts(0)
    setLocked(false)
    if (onGenerate) onGenerate(words)
  }, [rules])

  useEffect(() => {
    generateNewCaptcha()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode(localStorage.getItem("captscii_"+userInput) || "", userInput, rules)) {
      if (onComplete) onComplete(captchaWord);
      setLocked(true);
    } else {
      setAttempts(attempts + 1);
      setShake(true); // Trigger shake effect
      setTimeout(() => setShake(false), 500); // Reset shake after animation
      if (onFail) onFail();
      if (attempts >= 2) {
        generateNewCaptcha();
      } else {
        setUserInput("");
      }
    }
  };

  const playAudio = () => {
    if (audioEnabled) {
      const utterance = new SpeechSynthesisUtterance(captchaWord.split("").join(" "))
      window.speechSynthesis.speak(utterance)
    }
  }

  const containerClass = `max-w-md mx-auto p-6 rounded-lg shadow-md ${bgClassName} ${
    darkMode ? "text-gray-100" : "text-gray-900"
  }`
  const captchaClass = `font-mono text-xs mb-4 p-2 rounded overflow-x-auto ${darkMode ? "bg-gray-800" : "bg-gray-200"}`
  const buttonClass = `px-4 py-2 rounded-md transition-colors duration-200 ${
    darkMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-700"
  }`

  const [renderedWord, setRenderedWord] = useState<React.JSX.Element>(renderWord(captchaWord, diffuse, colorize, useEmoji))
  useEffect(() => {
    setRenderedWord(renderWord(captchaWord, diffuse, colorize, useEmoji))
  }, [captchaWord, diffuse, colorize, useEmoji])

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-bold mb-4">Captscii</h2>
      <motion.div
        className={captchaClass}
        animate={animate ? { scale: [0.9, 1.1, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {renderedWord}
      </motion.div>
      <form onSubmit={handleSubmit} className="space-y-4">

<motion.div
  animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
  transition={{ duration: 0.4 }}
  className={shake ? "border-2 border-red-500 bg-red-300" : ""}
>
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={language === "en" ? "Enter the CAPTCHA text" : "Ingrese el texto del CAPTCHA"}
          className={shake ? "bg-red-500 w-full" : "w-full"}
          maxLength={maxChars}
          disabled={locked}
        />
</motion.div>
        <div className="flex space-x-2">
          <Button type="submit" className={buttonClass}
          disabled={locked}>
            {language === "en" ? "Verify" : "Verificar"}
          </Button>
          <Button type="button" onClick={generateNewCaptcha} className={`${buttonClass} border-none`}>
            {language === "en" ? "New CAPTCHA" : "Nuevo CAPTCHA"}
          </Button>
          {audioEnabled && (
            <Button type="button" onClick={playAudio} className={`${buttonClass} border-none`}
            disabled={locked}>
              {language === "en" ? "Play Audio" : "Reproducir Audio"}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

