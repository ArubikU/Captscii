# Captscii

Captscii is a modern, customizable ASCII CAPTCHA solution that provides accessibility, customization, and multiple rendering options, including ASCII and emoji-based CAPTCHAs.

## Features

- ASCII and Emoji rendering modes
- Customizable rules
- Diffusion and colorization options
- Dark mode support
- Animated transitions
- Audio playback for accessibility
- Multilingual support
- Customizable themes

## Installation

You can install Captscii using npm or bun:

```sh
npm install captscii
```

```sh
bun add captscii
```

## Usage Example

```tsx
import { Captscii, CaptsciiProvider, useCaptscii } from 'captscii';

function MyForm() {
  const { isVerified, setIsVerified } = useCaptscii();

  return (
    <form>
      <Captscii
        diffuse={false}
        colorize={false}
        useEmoji={false}
        audioEnabled={false}
        animate={true}
        darkMode={false}
        onComplete={() => setIsVerified(true)}
        onFail={() => setIsVerified(false)}
      />
      {isVerified ? (
        <button type="submit">Submit Form</button>
      ) : (
        <p>Please complete the CAPTCHA to submit the form</p>
      )}
    </form>
  );
}

function App() {
  return (
    <CaptsciiProvider>
      <MyForm />
    </CaptsciiProvider>
  );
}
```

## Documentation

### `<Captscii />` Component

#### Props

- `onComplete?: (generationResult: string) => void` - Callback when CAPTCHA is completed successfully.
- `onFail?: () => void` - Callback when CAPTCHA verification fails.
- `onGenerate?: (word: string) => void` - Callback when a new CAPTCHA is generated.
- `diffuse?: boolean` - Enable character diffusion.
- `colorize?: boolean` - Enable colorization of characters.
- `bgClassName?: string` - Custom background class.
- `maxChars?: number` - Maximum number of characters in CAPTCHA.
- `useEmoji?: boolean` - Use emoji instead of ASCII characters.
- `darkMode?: boolean` - Enable dark mode.
- `animate?: boolean` - Enable animations.
- `language?: "en" | "es"` - Language for labels.
- `audioEnabled?: boolean` - Enable audio playback.

### `<CaptsciiProvider />`

CaptsciiProvider is a context provider for managing CAPTCHA verification state.

#### Usage

```tsx
import { CaptsciiProvider } from 'captscii';

function App() {
  return (
    <CaptsciiProvider>
      {/* Your components here */}
    </CaptsciiProvider>
  );
}
```

## License

This project is licensed under the MIT License.

## Links

- [GitHub Repository](https://github.com/arubiku/captscii)
- [npm Package](https://www.npmjs.com/package/captscii)

