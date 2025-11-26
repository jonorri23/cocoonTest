import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import SceneShowcase from '../components/SceneShowcase';

export default function VersionShowcase() {
    return (
        <>
            <div className="canvas-container">
                <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 50 }}>
                    <Suspense fallback={null}>
                        <SceneShowcase />
                    </Suspense>
                </Canvas>
            </div>

            <div className="ui-layer">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        top: '2rem',
                        left: '2rem',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '2rem',
                        pointerEvents: 'auto',
                        color: 'white',
                        zIndex: 100
                    }}
                >
                    Cocoon <span style={{ fontSize: '1rem', opacity: 0.5 }}>Maker</span>
                </motion.h1>

                <Link href="/">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
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
                            zIndex: 100,
                            cursor: 'pointer'
                        }}
                    >
                        Back to Home
                    </motion.div>
                </Link>

                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    width: '100%',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.9rem',
                    pointerEvents: 'none'
                }}>
                    Adjust parameters on the left • Drag to rotate • Scroll to zoom
                </div>
            </div>
        </>
    );
}
