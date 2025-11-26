import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import CocoonMetamorphosis from '../components/CocoonMetamorphosis';

export default function VersionTestingIntro() {
    const [showIntro, setShowIntro] = useState(true);

    const handleIntroComplete = () => {
        setShowIntro(false);
    };

    return (
        <>
            {showIntro && (
                <CocoonMetamorphosis
                    onComplete={handleIntroComplete}
                    crawlDuration={3000}
                    curlDuration={1500}
                    spinDuration={2500}
                    emergeDuration={2000}
                />
            )}

            {!showIntro && (
                <div style={{
                    width: '100%',
                    height: '100vh',
                    background: 'radial-gradient(ellipse at center, #1A0F2E 0%, #0A0612 70%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'var(--font-main)',
                    padding: '2rem'
                }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '3rem',
                            marginBottom: '1rem',
                            background: 'linear-gradient(45deg, #B084CC, #64FFDA)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textAlign: 'center'
                        }}
                    >
                        Testing Intro
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            fontSize: '1.2rem',
                            opacity: 0.7,
                            marginBottom: '3rem',
                            textAlign: 'center',
                            maxWidth: '600px'
                        }}
                    >
                        The metamorphosis animation is complete. This is where your main content would go.
                    </motion.p>

                    <Link href="/">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '1rem 2rem',
                                border: '1px solid rgba(100, 255, 218, 0.4)',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                background: 'rgba(100, 255, 218, 0.1)'
                            }}
                        >
                            Back to Home
                        </motion.div>
                    </Link>
                </div>
            )}
        </>
    );
}
