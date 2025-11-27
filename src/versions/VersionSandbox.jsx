import { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import App1Silk from '../../testapps/App1_Silk';
import App2Cocoon from '../../testapps/App2_Cocoon';

export default function VersionSandbox() {
    const [activeExperiment, setActiveExperiment] = useState('cocoon'); // 'silk' or 'cocoon'

    return (
        <>
            {/* Experiment Container */}
            <div className="canvas-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <AnimatePresence mode="wait">
                    {activeExperiment === 'silk' ? (
                        <motion.div
                            key="silk"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <App1Silk />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="cocoon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <App2Cocoon />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* UI Layer */}
            <div className="ui-layer" style={{ pointerEvents: 'none' }}>
                {/* Title */}
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
                        mixBlendMode: 'difference',
                        zIndex: 100,
                        margin: 0
                    }}
                >
                    Sandbox <span style={{ fontSize: '1rem', opacity: 0.5 }}>Experiments</span>
                </motion.h1>

                {/* Switcher */}
                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '1rem',
                    pointerEvents: 'auto',
                    zIndex: 100
                }}>
                    <button
                        onClick={() => setActiveExperiment('cocoon')}
                        style={{
                            background: activeExperiment === 'cocoon' ? 'rgba(255,255,255,0.2)' : 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            backdropFilter: 'blur(5px)',
                            fontFamily: 'var(--font-main)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Cocoon
                    </button>
                    <button
                        onClick={() => setActiveExperiment('silk')}
                        style={{
                            background: activeExperiment === 'silk' ? 'rgba(255,255,255,0.2)' : 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            backdropFilter: 'blur(5px)',
                            fontFamily: 'var(--font-main)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Silk Garden
                    </button>
                </div>

                {/* Back to Home */}
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
            </div>
        </>
    );
}
