import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import './index.css'

function App() {
  return (
    <>
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]} // Optimization for high DPI screens
        >
          <color attach="background" args={['#050505']} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="ui-layer">
        {/* HTML Overlay content will go here */}
        <h1 style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          fontFamily: 'var(--font-serif)',
          fontSize: '2rem',
          pointerEvents: 'auto',
          color: 'var(--color-text)',
          mixBlendMode: 'difference'
        }}>
          Cocoon
        </h1>
      </div>
    </>
  )
}

import Scene from './components/Scene'

export default App
