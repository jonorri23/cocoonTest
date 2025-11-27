import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars, Text3D, Center } from '@react-three/drei'
import { TextureLoader } from 'three'

function Painting({ position, rotation, imageUrl, scale = [2, 3, 0.1] }) {
    const meshRef = useRef()
    const texture = useLoader(TextureLoader, imageUrl)

    return (
        <group position={position} rotation={rotation}>
            {/* Ornate outer frame */}
            <mesh position={[0, 0, -0.15]}>
                <boxGeometry args={[scale[0] + 0.4, scale[1] + 0.4, 0.15]} />
                <meshStandardMaterial
                    color="#8b6914"
                    metalness={0.7}
                    roughness={0.3}
                    emissive="#3d2f0f"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Inner frame detail */}
            <mesh position={[0, 0, -0.08]}>
                <boxGeometry args={[scale[0] + 0.25, scale[1] + 0.25, 0.08]} />
                <meshStandardMaterial
                    color="#2a2010"
                    metalness={0.5}
                    roughness={0.4}
                />
            </mesh>

            {/* Canvas backing - prevents see-through */}
            <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[scale[0] + 0.1, scale[1] + 0.1]} />
                <meshStandardMaterial color="#f5f5dc" side={THREE.DoubleSide} />
            </mesh>

            {/* Painting itself - with depth */}
            <mesh ref={meshRef} receiveShadow position={[0, 0, 0.05]}>
                <boxGeometry args={[scale[0], scale[1], 0.05]} />
                <meshStandardMaterial
                    map={texture}
                    toneMapped={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Subtle glow behind painting */}
            <pointLight position={[0, 0, -0.3]} intensity={0.4} distance={3} color="#fff8e7" />
        </group>
    )
}

function Torch({ position }) {
    const lightRef = useRef()
    const flameRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        // Flickering fire effect
        if (lightRef.current) {
            lightRef.current.intensity = 1.5 + Math.sin(time * 8) * 0.3 + Math.sin(time * 3) * 0.2
        }
        if (flameRef.current) {
            flameRef.current.scale.y = 1 + Math.sin(time * 8) * 0.15
        }
    })

    return (
        <group position={position}>
            {/* Torch holder */}
            <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[0.05, 0.08, 1, 8]} />
                <meshStandardMaterial color="#3a2f1f" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Flame */}
            <mesh ref={flameRef} position={[0, 0.2, 0]}>
                <coneGeometry args={[0.15, 0.5, 6]} />
                <meshBasicMaterial color="#ff6b1a" transparent opacity={0.8} />
            </mesh>

            {/* Inner flame glow */}
            <mesh position={[0, 0.2, 0]} scale={0.6}>
                <coneGeometry args={[0.15, 0.5, 6]} />
                <meshBasicMaterial color="#ffed4e" transparent opacity={0.9} />
            </mesh>

            {/* Fire light */}
            <pointLight
                ref={lightRef}
                position={[0, 0.3, 0]}
                intensity={1.5}
                distance={8}
                color="#ff8c3a"
                castShadow
            />
        </group>
    )
}

function Gallery() {
    const { camera, gl } = useThree()
    const spotlightRef = useRef()
    const targetRef = useRef(new THREE.Vector3())
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame(() => {
        if (spotlightRef.current && camera) {
            // Smoother spotlight movement to avoid glitching
            const vector = new THREE.Vector3(mousePos.x, mousePos.y, 0.5)
            vector.unproject(camera)
            const dir = vector.sub(camera.position).normalize()
            const distance = 8 // Fixed distance to avoid zoom glitches
            const targetPos = camera.position.clone().add(dir.multiplyScalar(distance))

            // Smooth lerp to avoid jitter
            targetRef.current.lerp(targetPos, 0.15)
            spotlightRef.current.target.position.copy(targetRef.current)
            spotlightRef.current.target.updateMatrixWorld()
        }
    })

    return (
        <>
            {/* Brighter ambient lighting */}
            <ambientLight intensity={0.15} />

            {/* Flashlight effect that follows mouse */}
            <spotLight
                ref={spotlightRef}
                position={[0, 0, 5]}
                angle={0.5}
                penumbra={0.6}
                intensity={2.5}
                distance={20}
                castShadow
                color="#fff8e7"
            />

            {/* Fire torches around the gallery */}
            <Torch position={[-6, 2, -4]} />
            <Torch position={[6, 2, -4]} />
            <Torch position={[-6, 2, 2]} />
            <Torch position={[6, 2, 2]} />

            {/* Wall torches */}
            <Torch position={[-7.5, 1, -1]} />
            <Torch position={[7.5, 1, -1]} />

            {/* Additional subtle fill light */}
            <pointLight position={[0, 6, 0]} intensity={0.3} color="#4a5568" />

            {/* Stars in background */}
            <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />

            {/* Gallery walls (dark) */}
            <mesh position={[0, 0, -5]} receiveShadow>
                <planeGeometry args={[30, 15]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
            </mesh>

            {/* Left wall */}
            <mesh position={[-8, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[10, 15]} />
                <meshStandardMaterial color="#0f0f0f" roughness={0.9} />
            </mesh>

            {/* Right wall */}
            <mesh position={[8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[10, 15]} />
                <meshStandardMaterial color="#0f0f0f" roughness={0.9} />
            </mesh>

            {/* Floor */}
            <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[30, 20]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Title removed - mysterious gallery needs no labels */}

            {/* Paintings on back wall - moved further out */}
            <Painting
                position={[-3, 1, -4.5]}
                rotation={[0, 0, 0]}
                imageUrl="/1000170354.jpg"
                scale={[2.5, 3.5, 0.1]}
            />

            <Painting
                position={[3, 1, -4.5]}
                rotation={[0, 0, 0]}
                imageUrl="/1000170355.jpg"
                scale={[2.5, 3.5, 0.1]}
            />

            {/* Paintings on side walls */}
            <Painting
                position={[-7.5, 0, -2]}
                rotation={[0, Math.PI / 2, 0]}
                imageUrl="/1000170354.jpg"
                scale={[2, 2.5, 0.1]}
            />

            <Painting
                position={[7.5, 0, -2]}
                rotation={[0, -Math.PI / 2, 0]}
                imageUrl="/1000170355.jpg"
                scale={[2, 2.5, 0.1]}
            />
        </>
    )
}

export default function App() {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 0, 8], fov: 60 }}
            gl={{ antialias: true }}
        >
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 5, 20]} />

            <Gallery />

            <OrbitControls
                enableZoom={true}
                enablePan={true}
                maxDistance={12}
                minDistance={2}
                maxPolarAngle={Math.PI / 2}
                target={[0, 0, -2]}
            />
        </Canvas>
    )
}
