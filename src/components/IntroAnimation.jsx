import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroAnimation({ onComplete, onSkip }) {
    const [phase, setPhase] = useState('dots'); // dots, merging, line, circle, fade
    const [clickCount, setClickCount] = useState(0);
    const [lastClickTime, setLastClickTime] = useState(0);

    // Triple-click detection
    const handleClick = () => {
        const now = Date.now();
        if (now - lastClickTime < 500) {
            setClickCount(prev => {
                const newCount = prev + 1;
                if (newCount >= 3) {
                    onSkip();
                    return 0;
                }
                return newCount;
            });
        } else {
            setClickCount(1);
        }
        setLastClickTime(now);
    };

    // Animation sequence
    useEffect(() => {
        const timers = [];

        // Phase transitions
        timers.push(setTimeout(() => setPhase('merging'), 1000));
        timers.push(setTimeout(() => setPhase('line'), 2500));
        timers.push(setTimeout(() => setPhase('circle'), 4000));
        timers.push(setTimeout(() => setPhase('fade'), 5500));
        timers.push(setTimeout(() => onComplete(), 6500));

        return () => timers.forEach(timer => clearTimeout(timer));
    }, [onComplete]);

    return (
        <div
            onClick={handleClick}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: '#000000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 9999,
                overflow: 'hidden'
            }}
        >
            <AnimatePresence mode="sync">
                {phase === 'dots' && <DotsPhase key="dots" />}
                {phase === 'merging' && <MergingPhase key="merging" />}
                {phase === 'line' && <LinePhase key="line" />}
                {phase === 'circle' && <CirclePhase key="circle" />}
                {phase === 'fade' && <FadePhase key="fade" />}
            </AnimatePresence>

            {/* Skip hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1 }}
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    fontSize: '0.8rem',
                    color: 'white',
                    fontFamily: 'var(--font-main)',
                    pointerEvents: 'none'
                }}
            >
                Triple-click to skip
            </motion.div>
        </div>
    );
}

// Phase components
function DotsPhase() {
    const dotCount = 8;
    const dots = Array.from({ length: dotCount }, (_, i) => {
        const angle = (i / dotCount) * Math.PI * 2;
        const radius = 100;
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };
    });

    return (
        <svg width="400" height="400" viewBox="-200 -200 400 400">
            {dots.map((dot, i) => (
                <motion.circle
                    key={i}
                    cx={0}
                    cy={0}
                    r={4}
                    fill="white"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ x: dot.x, y: dot.y, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: 'easeOut'
                    }}
                />
            ))}
        </svg>
    );
}

function MergingPhase() {
    const dotCount = 8;

    return (
        <svg width="400" height="400" viewBox="-200 -200 400 400">
            {Array.from({ length: dotCount }).map((_, i) => (
                <motion.circle
                    key={i}
                    cx={0}
                    cy={0}
                    r={4}
                    fill="white"
                    initial={{
                        x: Math.cos((i / dotCount) * Math.PI * 2) * 100,
                        y: Math.sin((i / dotCount) * Math.PI * 2) * 100
                    }}
                    animate={{
                        x: (i - dotCount / 2) * 20,
                        y: 0,
                        opacity: 1
                    }}
                    transition={{
                        duration: 1,
                        ease: 'easeInOut'
                    }}
                />
            ))}
        </svg>
    );
}

function LinePhase() {
    return (
        <svg width="600" height="400" viewBox="-300 -200 600 400">
            <motion.line
                x1={-80}
                y1={0}
                x2={80}
                y2={0}
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
            />
        </svg>
    );
}

function CirclePhase() {
    return (
        <svg width="400" height="400" viewBox="-200 -200 400 400">
            <motion.circle
                cx={0}
                cy={0}
                r={60}
                stroke="white"
                strokeWidth={3}
                fill="none"
                initial={{ pathLength: 0, rotate: 0 }}
                animate={{ pathLength: 1, rotate: 360 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{ originX: '0px', originY: '0px' }}
            />
            {/* Inner glow */}
            <motion.circle
                cx={0}
                cy={0}
                r={55}
                fill="rgba(176, 132, 204, 0.1)"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
        </svg>
    );
}

function FadePhase() {
    return (
        <motion.svg
            width="400"
            height="400"
            viewBox="-200 -200 400 400"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <circle
                cx={0}
                cy={0}
                r={60}
                stroke="white"
                strokeWidth={3}
                fill="rgba(176, 132, 204, 0.1)"
            />
        </motion.svg>
    );
}
