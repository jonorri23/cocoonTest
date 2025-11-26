import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import IntroAnimationV7 from '../components/IntroAnimationV7';
import SceneV7 from '../components/SceneV7';
import NavigationBreadcrumb from '../components/NavigationBreadcrumb';

export default function Version7() {
    const [showIntro, setShowIntro] = useState(true);
    const [navigationPath, setNavigationPath] = useState([]);

    const handleIntroComplete = () => {
        setShowIntro(false);
    };

    const handleSkip = () => {
        setShowIntro(false);
    };

    const handleNavigate = (targetIndex) => {
        if (targetIndex === -1) {
            setNavigationPath([]);
        } else {
            setNavigationPath(prev => prev.slice(0, targetIndex + 1));
        }
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {showIntro && (
                    <IntroAnimationV7
                        key="intro-v7"
                        onComplete={handleIntroComplete}
                        onSkip={handleSkip}
                    />
                )}
            </AnimatePresence>

            {!showIntro && (
                <>
                    <div className="canvas-container">
                        <Canvas key="v7-canvas" dpr={[1, 2]}>
                            <Suspense fallback={null}>
                                <SceneV7 onNavigationChange={setNavigationPath} />
                            </Suspense>
                        </Canvas>
                    </div>

                    <div className="ui-layer">
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
                                color: 'var(--color-text)',
                                mixBlendMode: 'difference',
                                zIndex: 100
                            }}
                        >
                            Cocoon <span style={{ fontSize: '1rem', opacity: 0.5 }}>V7</span>
                        </motion.h1>

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

                        {/* Breadcrumb Navigation */}
                        <NavigationBreadcrumb
                            navigationPath={navigationPath}
                            onNavigate={handleNavigate}
                        />

                        {/* Instructions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                position: 'absolute',
                                bottom: '2rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '0.85rem',
                                pointerEvents: 'none',
                                textAlign: 'center',
                                maxWidth: '600px',
                                lineHeight: '1.6'
                            }}
                        >
                            {navigationPath.length === 0 && 'Click any moon to explore its universe'}
                            {navigationPath.length === 1 && `Click any ${navigationPath[0].childrenType || 'item'} to dive deeper • Click center to go back`}
                            {navigationPath.length === 2 && 'Exploring the deepest level • Click center to return'}
                        </motion.div>

                        {/* Back button (when not at root) */}
                        <AnimatePresence>
                            {navigationPath.length > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleNavigate(navigationPath.length - 2)}
                                    style={{
                                        position: 'absolute',
                                        bottom: '2rem',
                                        right: '2rem',
                                        background: 'rgba(176, 132, 204, 0.2)',
                                        border: '1px solid rgba(176, 132, 204, 0.5)',
                                        color: 'white',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '25px',
                                        fontFamily: 'var(--font-main)',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(10px)',
                                        pointerEvents: 'auto',
                                        zIndex: 100,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    ← Back
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </>
    );
}
