import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Link } from 'wouter'
import SceneV3 from '../components/SceneV3'

export default function Version3() {
    return (
        <>
            <div className="canvas-container">
                <Canvas dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <SceneV3 />
                    </Suspense>
                </Canvas>
            </div>

            <div className="ui-layer">
                <h1 style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '2rem',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    pointerEvents: 'auto',
                    color: 'var(--color-text)',
                    mixBlendMode: 'difference',
                    zIndex: 100
                }}>
                    Cocoon <span style={{ fontSize: '1rem', opacity: 0.5 }}>V3</span>
                </h1>

                <Link href="/" style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    color: 'white',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-main)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    backdropFilter: 'blur(5px)',
                    pointerEvents: 'auto',
                    zIndex: 100
                }}>
                    Back to Home
                </Link>

                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.9rem',
                    pointerEvents: 'none'
                }}>
                    Drag to rotate • Click elements to explore • Swipe Right for Sanctum
                </div>
            </div>
        </>
    )
}
