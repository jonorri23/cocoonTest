import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sparkles, Text, Html, useGLTF, Float } from '@react-three/drei'
import { useSpring, animated, config } from '@react-spring/three'
import { useDrag } from '@use-gesture/react'
import * as THREE from 'three'
import Cocoon from './Cocoon'
import Effects from './Effects'
import { members } from '../data/members'

function OrganicElement({ position, color, type, onClick, modelPath }) {
    const mesh = useRef()
    const [hovered, setHover] = useState(false)

    // Load GLB model if path is provided
    let gltf = null
    try {
        if (modelPath) {
            gltf = useGLTF(modelPath)
        }
    } catch (error) {
        console.warn(`Failed to load model: ${modelPath}`, error)
    }

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (mesh.current) {
            mesh.current.rotation.x = Math.sin(t * 0.5) * 0.5
            mesh.current.rotation.y += 0.01
        }
    })

    const { scale } = useSpring({
        scale: hovered ? 1.2 : 1,
        config: config.wobbly
    })

    return (
        <animated.group position={position} scale={scale}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <group
                    ref={mesh}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                    onClick={onClick}
                >
                    {gltf && gltf.scene ? (
                        // Use GLB model if available
                        // Normalize scale: stylized_head needs smaller scale, man_head needs larger
                        <primitive
                            object={gltf.scene.clone()}
                            scale={modelPath.includes('stylized') ? 0.15 : 0.5}
                        />
                    ) : (
                        // Fallback to geometric shapes
                        <mesh>
                            {type === 'torus' && <torusKnotGeometry args={[0.3, 0.1, 64, 8]} />}
                            {type === 'sphere' && <sphereGeometry args={[0.4, 32, 32]} />}
                            {type === 'octahedron' && <octahedronGeometry args={[0.5]} />}
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0.1}
                                metalness={0.8}
                                clearcoat={1}
                                transparent
                                opacity={0.8}
                            />
                        </mesh>
                    )}
                </group>
            </Float>
        </animated.group>
    )
}

function InteractiveCocoon({ onCocoonClick }) {
    const [active, setActive] = useState(false)
    const { scale } = useSpring({
        scale: active ? 1.8 : 1.5,
        config: config.gentle
    })

    return (
        <animated.group scale={scale}>
            <Cocoon
                onClick={(e) => {
                    e.stopPropagation()
                    setActive(!active)
                    onCocoonClick()
                }}
            />
        </animated.group>
    )
}

export default function SceneV2() {
    const [view, setView] = useState('orbit') // 'orbit' or 'focus'
    const [hiddenMode, setHiddenMode] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)

    // Gesture logic
    const bind = useDrag(({ movement: [mx], velocity: [vx], direction: [dx], cancel, active }) => {
        // Swipe right to reveal hidden mode
        if (mx > 200 && vx > 0.5) {
            setHiddenMode(true)
            cancel()
        }
        // Swipe left to hide
        if (mx < -200 && vx > 0.5) {
            setHiddenMode(false)
            cancel()
        }
    }, {
        filterTaps: true,
        rubberband: true
    })

    // Camera animation for hidden mode
    useFrame((state) => {
        if (hiddenMode) {
            state.camera.position.lerp(new THREE.Vector3(0, 10, 0), 0.05)
            state.camera.lookAt(0, 0, 0)
        } else if (view === 'orbit') {
            // Let OrbitControls handle it, but we might need to reset if coming back
        }
    })

    // Generate random positions for organic elements around the center
    const elements = members.map((member, i) => {
        const angle = (i / members.length) * Math.PI * 2
        const radius = 4

        // Assign GLB models to ALL members, alternating between the two optimized models
        const modelPath = i % 2 === 0
            ? '/models/stylized_head_optimized.glb'
            : '/models/man_head_optimized.glb'

        return {
            ...member,
            position: [
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 4,
                Math.sin(angle) * radius
            ],
            type: ['torus', 'sphere', 'octahedron'][i % 3],
            modelPath
        }
    })

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={view === 'orbit' && !hiddenMode}
                autoRotateSpeed={0.5}
                maxDistance={15}
                minDistance={3}
                enabled={!hiddenMode} // Disable orbit in hidden mode
            />

            {/* Gesture Bind Area - Invisible plane to catch swipes */}
            <mesh position={[0, 0, 5]} visible={false} {...bind()}>
                <planeGeometry args={[100, 100]} />
            </mesh>

            <color attach="background" args={[hiddenMode ? '#1a0b2e' : '#050505']} />

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#b084cc" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64ffda" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={300} scale={12} size={2} speed={0.4} opacity={0.5} color="#b084cc" />

            {/* Hidden Mode Content */}
            {hiddenMode && (
                <group>
                    <Text
                        position={[0, 0, -2]}
                        fontSize={1}
                        color="#64ffda"
                        anchorX="center"
                        anchorY="middle"
                        font="/fonts/Inter-Bold.woff" // Fallback to default if missing
                    >
                        SECRET REALM
                    </Text>
                    <Sparkles count={1000} scale={20} size={5} speed={2} color="#64ffda" />
                </group>
            )}

            <InteractiveCocoon onCocoonClick={() => setView(v => v === 'orbit' ? 'focus' : 'orbit')} />

            {elements.map((el, i) => (
                <group key={el.id}>
                    <OrganicElement
                        position={el.position}
                        color={el.color}
                        type={el.type}
                        modelPath={el.modelPath}
                        onClick={() => setSelectedMember(el)}
                    />
                    {/* Floating Label */}
                    <Html position={[el.position[0], el.position[1] - 0.8, el.position[2]]} center distanceFactor={10}>
                        <div style={{
                            color: el.color,
                            fontFamily: 'var(--font-main)',
                            fontSize: '0.8rem',
                            opacity: 0.8,
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap'
                        }}>
                            {el.name}
                        </div>
                    </Html>
                </group>
            ))}

            {selectedMember && (
                <Html position={[0, 0, 0]} center zIndexRange={[100, 0]}>
                    <div className="glass" style={{
                        padding: '2rem',
                        borderRadius: '16px',
                        width: '300px',
                        color: 'white',
                        textAlign: 'center',
                        transform: 'translate3d(0,0,0)' // Force GPU
                    }}>
                        <h2 style={{ color: selectedMember.color, fontFamily: 'var(--font-serif)' }}>{selectedMember.name}</h2>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.7 }}>{selectedMember.role}</h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{selectedMember.description}</p>
                        <button
                            onClick={() => setSelectedMember(null)}
                            style={{
                                marginTop: '1rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                color: 'white',
                                borderRadius: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </Html>
            )}

            <Environment preset="city" />
            <Effects />
        </>
    )
}
