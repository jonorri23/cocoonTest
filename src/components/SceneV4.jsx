import { useState, useRef } from 'react'
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sparkles, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import * as THREE from 'three'
import Cocoon from './Cocoon'
import Effects from './Effects'
import { members } from '../data/members'
import { useSpring, animated, config } from '@react-spring/three'

function OpeningCocoon({ onClick, isOpen }) {
    const outerShell = useRef()
    const innerContent = useRef()

    const { leftRotation, rightRotation, contentScale } = useSpring({
        leftRotation: isOpen ? Math.PI * 0.6 : 0,
        rightRotation: isOpen ? -Math.PI * 0.6 : 0,
        contentScale: isOpen ? 1 : 0,
        config: config.slow
    })

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        // Gentle breathing
        const breathe = Math.sin(t * 1.5) * 0.02
        if (outerShell.current) {
            outerShell.current.scale.set(1.5 + breathe, 1.5 + breathe, 1.5 + breathe)
        }
    })

    return (
        <group onClick={onClick} ref={outerShell}>
            {/* Left Half */}
            <animated.group rotation-y={leftRotation} position-x={isOpen ? -0.5 : 0}>
                <mesh>
                    <sphereGeometry args={[1, 64, 64, 0, Math.PI]} />
                    <meshPhysicalMaterial
                        color="#b084cc"
                        roughness={0.3}
                        metalness={0.2}
                        clearcoat={1}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </animated.group>

            {/* Right Half */}
            <animated.group rotation-y={rightRotation} position-x={isOpen ? 0.5 : 0}>
                <mesh>
                    <sphereGeometry args={[1, 64, 64, Math.PI, Math.PI]} />
                    <meshPhysicalMaterial
                        color="#b084cc"
                        roughness={0.3}
                        metalness={0.2}
                        clearcoat={1}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </animated.group>

            {/* Inner Content - Revealed when open */}
            <animated.group ref={innerContent} scale={contentScale}>
                <mesh>
                    <octahedronGeometry args={[0.8, 0]} />
                    <meshBasicMaterial color="#64ffda" toneMapped={false} />
                </mesh>
                <Sparkles count={100} scale={2} size={3} speed={1} color="#ffffff" />
            </animated.group>
        </group>
    )
}

function OrganicElement({ position, color, type, onClick }) {
    const [hovered, setHover] = useState(false)
    const { scale } = useSpring({
        scale: hovered ? 1.2 : 1,
        config: config.wobbly
    })

    return (
        <animated.group position={position} scale={scale}>
            <mesh
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                onClick={onClick}
            >
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
        </animated.group>
    )
}

export default function SceneV4() {
    const [cocoonOpen, setCocoonOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)

    const bind = useDrag(({ movement: [mx], velocity: [vx], cancel }) => {
        if (mx > 200 && vx > 0.5) {
            setCocoonOpen(true)
            cancel()
        }
        if (mx < -200 && vx > 0.5) {
            setCocoonOpen(false)
            cancel()
        }
    }, { filterTaps: true, rubberband: true })

    const elements = members.map((member, i) => {
        const angle = (i / members.length) * Math.PI * 2
        const radius = 4
        return {
            ...member,
            position: [Math.cos(angle) * radius, (Math.random() - 0.5) * 4, Math.sin(angle) * radius],
            type: ['torus', 'sphere', 'octahedron'][i % 3]
        }
    })

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={!cocoonOpen}
                autoRotateSpeed={0.5}
                maxDistance={15}
                minDistance={3}
            />

            <mesh position={[0, 0, 5]} visible={false} {...bind()}>
                <planeGeometry args={[100, 100]} />
            </mesh>

            <color attach="background" args={['#050505']} />

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#b084cc" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64ffda" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={300} scale={12} size={2} speed={0.4} opacity={0.5} color="#b084cc" />

            <OpeningCocoon
                onClick={(e) => {
                    e.stopPropagation()
                    setCocoonOpen(!cocoonOpen)
                }}
                isOpen={cocoonOpen}
            />

            {elements.map((el) => (
                <group key={el.id}>
                    <OrganicElement
                        position={el.position}
                        color={el.color}
                        type={el.type}
                        onClick={() => setSelectedMember(el)}
                    />
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
                        transform: 'translate3d(0,0,0)'
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
