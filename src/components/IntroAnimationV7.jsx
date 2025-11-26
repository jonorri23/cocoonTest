import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function IntroAnimationV7({ onComplete, onSkip }) {
    const [phase, setPhase] = useState('dot'); // dot, line, text, fade

    useEffect(() => {
        const sequence = async () => {
            // Phase 1: Dot appears (handled by initial render)
            await new Promise(r => setTimeout(r, 1000));
            setPhase('line');

            // Phase 2: Line expands
            await new Promise(r => setTimeout(r, 1000));
            setPhase('text');

            // Phase 3: Text crawls
            await new Promise(r => setTimeout(r, 2500));
            setPhase('fade');

            // Phase 4: Fade out
            await new Promise(r => setTimeout(r, 1000));
            onComplete();
        };

        sequence();
    }, [onComplete]);

    return (
        <motion.div
            className="intro-container"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onClick={onSkip}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#000',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }}
        >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* The Line/Dot Container */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    height: '100vh',
                    width: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* The White Line */}
                    <motion.div
                        initial={{ height: '4px', width: '4px', borderRadius: '50%' }}
                        animate={{
                            height: phase === 'dot' ? '4px' : '100vh',
                            width: phase === 'dot' ? '4px' : '1px',
                            borderRadius: phase === 'dot' ? '50%' : '0%'
                        }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        style={{
                            background: 'white',
                            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                        }}
                    />

                    {/* The Crawling Text */}
                    <AnimatePresence>
                        {phase === 'text' && (
                            <motion.div
                                initial={{ y: '50vh', opacity: 0 }}
                                animate={{ y: '-50vh', opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2.5, ease: "easeInOut" }}
                                style={{
                                    position: 'absolute',
                                    color: 'white',
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '2rem',
                                    letterSpacing: '0.5rem',
                                    whiteSpace: 'nowrap',
                                    transform: 'rotate(-90deg)', // Vertical text
                                    textShadow: '0 0 10px rgba(255,255,255,0.5)'
                                }}
                            >
                                COCOON
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
