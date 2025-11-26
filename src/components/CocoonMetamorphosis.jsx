/**
 * 🦋 COCOON METAMORPHOSIS LOADING EXPERIENCE
 * 
 * A poetic loading sequence: 2D caterpillar → silk spinning → 3D cocoon emergence
 * 
 * Dependencies (install these):
 * npm install three @react-three/fiber @react-three/drei framer-motion
 * 
 * Usage:
 * import CocoonMetamorphosis from './CocoonMetamorphosis'
 * <CocoonMetamorphosis onComplete={() => console.log('Ready!')} />
 */

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Environment, Float } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════
// 🎨 DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════

const COLORS = {
  // Caterpillar palette (limited, screenprint aesthetic)
  caterpillarBody: '#2D1B4E',      // Deep purple
  caterpillarAccent: '#64FFDA',    // Teal
  caterpillarHighlight: '#B084CC', // Lavender
  caterpillarDark: '#1A0F2E',      // Near black purple
  
  // Cocoon gradient stops
  cocoonGradient: ['#B084CC', '#FFFFFF', '#64FFDA', '#B084CC'],
  
  // Background
  bgDark: '#0A0612',
  bgGlow: '#1A0F2E',
}

// ═══════════════════════════════════════════════════════════════════
// 🐛 CATERPILLAR SVG COMPONENT
// ═══════════════════════════════════════════════════════════════════

const Caterpillar = ({ phase }) => {
  // Phase: 'crawling' | 'curling' | 'cocooning'
  
  const segmentCount = 7
  const segments = Array.from({ length: segmentCount }, (_, i) => i)
  
  return (
    <svg 
      viewBox="0 0 400 200" 
      style={{ 
        width: '100%', 
        maxWidth: '400px',
        overflow: 'visible'
      }}
    >
      <defs>
        {/* Gradient for body segments */}
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={COLORS.caterpillarHighlight} />
          <stop offset="50%" stopColor={COLORS.caterpillarBody} />
          <stop offset="100%" stopColor={COLORS.caterpillarDark} />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Silk thread gradient */}
        <linearGradient id="silkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.caterpillarAccent} stopOpacity="0"/>
          <stop offset="50%" stopColor={COLORS.caterpillarAccent} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={COLORS.caterpillarAccent} stopOpacity="0"/>
        </linearGradient>
      </defs>
      
      <g filter="url(#glow)">
        {/* Body segments with inchworm animation */}
        {segments.map((i) => {
          const baseX = 80 + i * 35
          const baseY = 100
          
          // Calculate curling positions
          const curlingProgress = phase === 'curling' || phase === 'cocooning' ? 1 : 0
          const angle = (i / segmentCount) * Math.PI * curlingProgress
          const radius = 50
          const curledX = 200 + Math.cos(angle + Math.PI) * radius * curlingProgress
          const curledY = 100 + Math.sin(angle + Math.PI) * radius * curlingProgress
          
          const x = baseX + (curledX - baseX) * curlingProgress
          const y = baseY + (curledY - baseY) * curlingProgress
          const scale = phase === 'cocooning' ? 0.5 : 1
          
          return (
            <motion.ellipse
              key={i}
              fill="url(#bodyGradient)"
              stroke={COLORS.caterpillarAccent}
              strokeWidth="1"
              initial={{ 
                cx: baseX, 
                cy: baseY,
                rx: 18,
                ry: 22,
                opacity: 1
              }}
              animate={{ 
                cx: x,
                cy: y,
                rx: 18 * scale,
                ry: 22 * scale,
                opacity: phase === 'cocooning' ? 0 : 1
              }}
              transition={{
                duration: phase === 'crawling' ? 0.3 : 1.2,
                delay: phase === 'crawling' 
                  ? i * 0.08 
                  : (segmentCount - i) * 0.1,
                repeat: phase === 'crawling' ? Infinity : 0,
                repeatType: 'reverse',
                ease: phase === 'crawling' ? 'easeInOut' : 'anticipate'
              }}
              style={{
                // Inchworm vertical motion only during crawling
                ...(phase === 'crawling' && {
                  animation: `inchworm ${0.8}s ease-in-out ${i * 0.1}s infinite`
                })
              }}
            />
          )
        })}
        
        {/* Head */}
        <motion.g
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ 
            x: phase === 'curling' ? -60 : phase === 'cocooning' ? -60 : 0,
            y: phase === 'curling' ? 20 : phase === 'cocooning' ? 20 : 0,
            opacity: phase === 'cocooning' ? 0 : 1,
            scale: phase === 'cocooning' ? 0.3 : 1
          }}
          transition={{ duration: 1.2, ease: 'anticipate' }}
        >
          {/* Head shape */}
          <ellipse 
            cx="310" 
            cy="95" 
            rx="22" 
            ry="25"
            fill={COLORS.caterpillarBody}
            stroke={COLORS.caterpillarAccent}
            strokeWidth="1.5"
          />
          
          {/* Eyes */}
          <circle cx="318" cy="88" r="6" fill={COLORS.caterpillarDark} />
          <circle cx="318" cy="88" r="3" fill={COLORS.caterpillarAccent} />
          <circle cx="302" cy="88" r="6" fill={COLORS.caterpillarDark} />
          <circle cx="302" cy="88" r="3" fill={COLORS.caterpillarAccent} />
          
          {/* Antennae */}
          <motion.path
            d="M 305 70 Q 295 50 285 45"
            stroke={COLORS.caterpillarAccent}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ 
              d: phase === 'crawling' 
                ? ['M 305 70 Q 295 50 285 45', 'M 305 70 Q 290 55 280 50', 'M 305 70 Q 295 50 285 45']
                : 'M 305 70 Q 295 50 285 45'
            }}
            transition={{ duration: 1.5, repeat: phase === 'crawling' ? Infinity : 0 }}
          />
          <motion.path
            d="M 315 70 Q 325 50 335 45"
            stroke={COLORS.caterpillarAccent}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ 
              d: phase === 'crawling'
                ? ['M 315 70 Q 325 50 335 45', 'M 315 70 Q 330 55 340 50', 'M 315 70 Q 325 50 335 45']
                : 'M 315 70 Q 325 50 335 45'
            }}
            transition={{ duration: 1.5, repeat: phase === 'crawling' ? Infinity : 0, delay: 0.2 }}
          />
          
          {/* Antenna tips */}
          <circle cx="285" cy="45" r="4" fill={COLORS.caterpillarHighlight} />
          <circle cx="335" cy="45" r="4" fill={COLORS.caterpillarHighlight} />
        </motion.g>
        
        {/* Tiny legs */}
        {segments.slice(0, -1).map((i) => (
          <motion.g 
            key={`legs-${i}`}
            initial={{ opacity: 0.7 }}
            animate={{ 
              opacity: phase === 'cocooning' ? 0 : 0.7 
            }}
          >
            <motion.line
              x1={95 + i * 35}
              y1={118}
              x2={90 + i * 35}
              y2={135}
              stroke={COLORS.caterpillarDark}
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                y2: phase === 'crawling' ? [135, 130, 135] : 135
              }}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                repeat: phase === 'crawling' ? Infinity : 0
              }}
            />
            <motion.line
              x1={95 + i * 35}
              y1={118}
              x2={100 + i * 35}
              y2={135}
              stroke={COLORS.caterpillarDark}
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                y2: phase === 'crawling' ? [135, 130, 135] : 135
              }}
              transition={{
                duration: 0.4,
                delay: i * 0.08 + 0.2,
                repeat: phase === 'crawling' ? Infinity : 0
              }}
            />
          </motion.g>
        ))}
      </g>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🌀 SILK SPINNING EFFECT
// ═══════════════════════════════════════════════════════════════════

const SilkSpinner = ({ active }) => {
  const threads = Array.from({ length: 12 }, (_, i) => i)
  
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <svg viewBox="0 0 200 200" style={{ width: '300px', height: '300px' }}>
            <defs>
              <radialGradient id="silkRadial">
                <stop offset="0%" stopColor={COLORS.caterpillarAccent} stopOpacity="0.8"/>
                <stop offset="100%" stopColor={COLORS.caterpillarHighlight} stopOpacity="0"/>
              </radialGradient>
            </defs>
            
            {threads.map((i) => {
              const angle = (i / threads.length) * Math.PI * 2
              const startX = 100 + Math.cos(angle) * 20
              const startY = 100 + Math.sin(angle) * 25
              const endX = 100 + Math.cos(angle) * 80
              const endY = 100 + Math.sin(angle) * 100
              
              return (
                <motion.path
                  key={i}
                  d={`M ${startX} ${startY} Q ${100 + Math.cos(angle + 0.5) * 50} ${100 + Math.sin(angle + 0.5) * 60} ${endX} ${endY}`}
                  stroke={COLORS.caterpillarAccent}
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: [0, 1, 1],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )
            })}
            
            {/* Central silk mass building up */}
            <motion.ellipse
              cx="100"
              cy="100"
              fill="url(#silkRadial)"
              initial={{ rx: 0, ry: 0 }}
              animate={{ rx: 40, ry: 55 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🥚 3D COCOON COMPONENT
// ═══════════════════════════════════════════════════════════════════

const Cocoon3D = ({ visible }) => {
  const meshRef = useRef()
  const materialRef = useRef()
  
  // Create gradient texture
  const gradientTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 256)
    gradient.addColorStop(0, COLORS.cocoonGradient[0])
    gradient.addColorStop(0.4, COLORS.cocoonGradient[1])
    gradient.addColorStop(0.8, COLORS.cocoonGradient[2])
    gradient.addColorStop(1, COLORS.cocoonGradient[3])
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])
  
  useFrame((state) => {
    if (!meshRef.current || !visible) return
    
    const t = state.clock.elapsedTime
    
    // Gentle wobble rotation
    meshRef.current.rotation.x = Math.sin(t / 4) * 0.15
    meshRef.current.rotation.y = t * 0.08
    
    // Breathing scale
    const breathe = 1 + Math.sin(t * 1.2) * 0.025
    meshRef.current.scale.set(
      1 * breathe,
      1.7 * breathe, // Elongated cocoon shape
      1 * breathe
    )
  })
  
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.3}
      floatingRange={[-0.1, 0.1]}
    >
      <mesh ref={meshRef} visible={visible}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshDistortMaterial
          ref={materialRef}
          map={gradientTexture}
          distort={0.35}
          speed={1.8}
          metalness={0.15}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1}
          transparent
          opacity={visible ? 1 : 0}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh visible={visible} scale={[0.85, 1.5, 0.85]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={COLORS.caterpillarAccent}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  )
}

// ═══════════════════════════════════════════════════════════════════
// ✨ PARTICLE EMERGENCE EFFECT
// ═══════════════════════════════════════════════════════════════════

const EmergenceParticles = ({ active }) => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    angle: (i / 30) * Math.PI * 2,
    delay: Math.random() * 0.5,
    size: 2 + Math.random() * 4,
    distance: 50 + Math.random() * 100
  }))
  
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0
              }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance * 0.6,
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: p.delay,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: p.id % 2 === 0 
                  ? COLORS.caterpillarAccent 
                  : COLORS.caterpillarHighlight,
                boxShadow: `0 0 ${p.size * 2}px ${p.id % 2 === 0 
                  ? COLORS.caterpillarAccent 
                  : COLORS.caterpillarHighlight}`
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🎬 MAIN ORCHESTRATOR COMPONENT
// ═══════════════════════════════════════════════════════════════════

const CocoonMetamorphosis = ({ 
  onComplete,
  // Timing controls (in ms)
  crawlDuration = 3000,
  curlDuration = 1500,
  spinDuration = 2500,
  emergeDuration = 2000
}) => {
  const [phase, setPhase] = useState('crawling')
  // Phases: 'crawling' → 'curling' → 'spinning' → 'emerging' → 'complete'
  
  useEffect(() => {
    const timers = []
    
    // Phase 1: Crawling
    timers.push(setTimeout(() => {
      setPhase('curling')
    }, crawlDuration))
    
    // Phase 2: Curling into ball
    timers.push(setTimeout(() => {
      setPhase('spinning')
    }, crawlDuration + curlDuration))
    
    // Phase 3: Silk spinning / cocooning
    timers.push(setTimeout(() => {
      setPhase('emerging')
    }, crawlDuration + curlDuration + spinDuration))
    
    // Phase 4: 3D Cocoon emergence
    timers.push(setTimeout(() => {
      setPhase('complete')
      onComplete?.()
    }, crawlDuration + curlDuration + spinDuration + emergeDuration))
    
    return () => timers.forEach(clearTimeout)
  }, [crawlDuration, curlDuration, spinDuration, emergeDuration, onComplete])
  
  const showCaterpillar = phase === 'crawling' || phase === 'curling' || phase === 'spinning'
  const showSilk = phase === 'spinning'
  const show3DCocoon = phase === 'emerging' || phase === 'complete'
  const showParticles = phase === 'emerging'
  
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: `radial-gradient(ellipse at center, ${COLORS.bgGlow} 0%, ${COLORS.bgDark} 70%)`,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Ambient background particles */}
      <BackgroundParticles />
      
      {/* 2D Caterpillar Layer */}
      <AnimatePresence>
        {showCaterpillar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '500px'
            }}
          >
            <Caterpillar phase={phase === 'spinning' ? 'cocooning' : phase} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Silk Spinning Effect */}
      <SilkSpinner active={showSilk} />
      
      {/* Emergence Particles */}
      <EmergenceParticles active={showParticles} />
      
      {/* 3D Cocoon Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: show3DCocoon ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute',
          inset: 0
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
            <directionalLight position={[-5, -5, -5]} intensity={0.5} color={COLORS.caterpillarHighlight} />
            <pointLight position={[0, 2, 2]} intensity={0.8} color={COLORS.caterpillarAccent} />
            
            {/* Environment for reflections */}
            <Environment preset="night" />
            
            {/* The Cocoon */}
            <Cocoon3D visible={show3DCocoon} />
          </Suspense>
        </Canvas>
      </motion.div>
      
      {/* Loading text */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 20
        }}
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.1rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: COLORS.caterpillarAccent,
            textShadow: `0 0 20px ${COLORS.caterpillarAccent}40`
          }}
        >
          {phase === 'crawling' && 'Gathering...'}
          {phase === 'curling' && 'Transforming...'}
          {phase === 'spinning' && 'Weaving...'}
          {phase === 'emerging' && 'Emerging...'}
          {phase === 'complete' && 'Ready'}
        </motion.p>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🌌 AMBIENT BACKGROUND PARTICLES
// ═══════════════════════════════════════════════════════════════════

const BackgroundParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 5
  }))
  
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.id % 3 === 0 
              ? COLORS.caterpillarAccent 
              : p.id % 3 === 1 
                ? COLORS.caterpillarHighlight 
                : '#ffffff',
            opacity: 0.3
          }}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 📦 EXPORTS
// ═══════════════════════════════════════════════════════════════════

export default CocoonMetamorphosis

// Named exports for individual components if needed
export { 
  Caterpillar, 
  Cocoon3D, 
  SilkSpinner, 
  EmergenceParticles,
  BackgroundParticles,
  COLORS 
}
