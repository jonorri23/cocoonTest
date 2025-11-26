# 🦋 Cocoon Metamorphosis Loading Experience

A stunning, poetic loading sequence featuring a 2D animated caterpillar that transforms into a silk-spinning cocoon, ultimately revealing a beautiful 3D breathing cocoon.

## Files Included

| File | Description |
|------|-------------|
| `CocoonMetamorphosis.jsx` | Full React component (requires build setup) |
| `cocoon-metamorphosis-demo.html` | Standalone HTML demo (open directly in browser) |
| `package.json` | Dependencies for React version |

## Quick Start

### Option 1: Standalone HTML (Instant Preview)
Just open `cocoon-metamorphosis-demo.html` in your browser. No setup needed!

### Option 2: React Integration

```bash
# Install dependencies
npm install

# If using Vite, create main entry point:
```

Create `src/main.jsx`:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import CocoonMetamorphosis from './CocoonMetamorphosis'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CocoonMetamorphosis onComplete={() => console.log('Loading complete!')} />
  </React.StrictMode>
)
```

Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cocoon</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Create `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Then run:
```bash
npm run dev
```

## Props

```jsx
<CocoonMetamorphosis
  onComplete={() => {}}    // Callback when animation finishes
  crawlDuration={3000}     // Caterpillar crawling phase (ms)
  curlDuration={1500}      // Curling into ball phase (ms)
  spinDuration={2500}      // Silk spinning phase (ms)
  emergeDuration={2000}    // 3D cocoon emergence phase (ms)
/>
```

## Customization Guide

### Colors (in `COLORS` object)
```js
const COLORS = {
  caterpillarBody: '#2D1B4E',      // Deep purple body
  caterpillarAccent: '#64FFDA',    // Teal accents
  caterpillarHighlight: '#B084CC', // Lavender highlights
  cocoonGradient: ['#B084CC', '#FFFFFF', '#64FFDA', '#B084CC'],
  bgDark: '#0A0612',
  bgGlow: '#1A0F2E',
}
```

### 3D Cocoon Parameters
Located in `Cocoon3D` component:

```jsx
<MeshDistortMaterial
  distort={0.35}          // Organic blobby-ness (0.2-0.6)
  speed={1.8}             // Distortion animation speed
  metalness={0.15}        // Metallic sheen (0-1)
  roughness={0.08}        // Surface smoothness (0 = mirror)
  clearcoat={1}           // Glass-like top layer (0-1)
  envMapIntensity={1}     // Environment reflection strength
/>
```

### Animation Timing
```js
// In useFrame for breathing effect:
const breathe = 1 + Math.sin(t * 1.2) * 0.025  // 0.025 = intensity
// t * 1.2 = frequency (lower = slower breathing)

// Rotation speeds:
rotation.x = Math.sin(t / 4) * 0.15  // Wobble
rotation.y = t * 0.08                 // Spin speed
```

## Architecture

```
Phase Flow:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Crawling   │ →  │   Curling   │ →  │  Spinning   │ →  │  Emerging   │
│  (2D SVG)   │    │  (SVG morph)│    │ (silk webs) │    │  (3D mesh)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     3000ms            1500ms            2500ms            2000ms
```

## Component Exports

```jsx
import CocoonMetamorphosis, {
  Caterpillar,        // Just the 2D caterpillar
  Cocoon3D,           // Just the 3D cocoon
  SilkSpinner,        // Just the silk effect
  EmergenceParticles, // Just the particle burst
  BackgroundParticles,// Ambient floating particles
  COLORS              // Color palette
} from './CocoonMetamorphosis'
```

## Tips for Your AI Agent

1. **File placement**: Put `CocoonMetamorphosis.jsx` in your `src/components/` folder
2. **Font**: Add Cormorant Garamond to your HTML head for best typography
3. **Background**: Component has its own background; wrap in a container if needed
4. **Z-index**: The component uses z-index 1-30 internally
5. **Cleanup**: Canvas and animation are properly cleaned up on unmount

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires WebGL for the 3D cocoon. Falls back to CSS animation if WebGL unavailable.

---

Made with 🦋 by Claude
