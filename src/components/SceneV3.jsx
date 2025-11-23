import { useState } from 'react'
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sparkles, Text, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import * as THREE from 'three'
import SilkCocoon from './SilkCocoon'
import Effects from './Effects'
import { members } from '../data/members'
import { useSpring, animated, config } from '@react-spring/three'

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
                    roughness={0.2}
                    metalness={0.5}
                    transmission={0.5}
                    thickness={0.5}
                />
            </mesh>
        </animated.group>
    )
}

export default function SceneV3() {
    const [view, setView] = useState('orbit')
    const [hiddenMode, setHiddenMode] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)

    const bind = useDrag(({ movement: [mx], velocity: [vx], cancel }) => {
        if (mx > 200 && vx > 0.5) {
            setHiddenMode(true)
            cancel()
        }
        if (mx < -200 && vx > 0.5) {
            setHiddenMode(false)
            cancel()
        }
    }, { filterTaps: true, rubberband: true })

    useFrame((state) => {
        if (hiddenMode) {
            state.camera.position.lerp(new THREE.Vector3(0, 10, 0), 0.05)
            state.camera.lookAt(0, 0, 0)
        }
    })

    const elements = members.map((member, i) => {
        const angle = (i / members.length) * Math.PI * 2
        const radius = 4.5
        return {
            ...member,
            position: [Math.cos(angle) * radius, (Math.random() - 0.5) * 3, Math.sin(angle) * radius],
            type: ['torus', 'sphere', 'octahedron'][i % 3]
        }
    })

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 9]} />
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={view === 'orbit' && !hiddenMode}
                autoRotateSpeed={0.3}
                maxDistance={15}
                minDistance={4}
                enabled={!hiddenMode}
            />

            <mesh position={[0, 0, 5]} visible={false} {...bind()}>
                <planeGeometry args={[100, 100]} />
            </mesh>

            <color attach="background" args={[hiddenMode ? '#000000' : '#0a0a0a']} />

            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
            <pointLight position={[-10, -5, -10]} intensity={1} color="#b084cc" />

            <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />
            <Sparkles count={500} scale={15} size={1} speed={0.2} opacity={0.3} color="#ffffff" />

            {hiddenMode && (
                <group>
                    <Text position={[0, 0, -2]} fontSize={1} color="#64ffda" anchorX="center" anchorY="middle">
                        INNER SANCTUM
                    </Text>
                    <Sparkles count={1000} scale={20} size={5} speed={2} color="#64ffda" />
                </group>
            )}

            <SilkCocoon onClick={() => setView(v => v === 'orbit' ? 'focus' : 'orbit')} />

            {elements.map((el) => (
                <group key={el.id}>
                    <OrganicElement
                        position={el.position}
                        color={el.color}
                        type={el.type}
                        onClick={() => setSelectedMember(el)}
                    />
                    <Html position={[el.position[0], el.position[1] - 0.8, el.position[2]]} center distanceFactor={12}>
                        <div style={{ color: el.color, fontFamily: 'var(--font-main)', fontSize: '0.8rem', opacity: 0.6, pointerEvents: 'none' }}>
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
                        background: 'rgba(0,0,0,0.8)',
                        border: `1px solid ${selectedMember.color}`
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

            <Environment preset="studio" />
            <Effects />
        </>
    )
}
