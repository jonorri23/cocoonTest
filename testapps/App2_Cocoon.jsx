import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, Text3D, MeshDistortMaterial, Sphere, QuadraticBezierLine, Float, Stars, OrbitControls, Trail } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

export default function App() {
    return (
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
            <color attach="background" args={['#050505']} />
            <Scene />
            <EffectComposer disableNormalPass>
                <Bloom mipmapBlur levels={9} intensity={2} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
            </EffectComposer>
        </Canvas>
    )
}

function SilkParticle({ position, index }) {
    const ref = useRef()
    const { mouse, viewport } = useThree()

    const initialPos = useMemo(() => new THREE.Vector3(...position), [position])
    const velocity = useMemo(() => new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
    ), [])

    useFrame((state) => {
        if (!ref.current) return

        const time = state.clock.elapsedTime
        const mx = (mouse.x * viewport.width) / 2
        const my = (mouse.y * viewport.height) / 2

        // Gentle floating motion
        const floatX = Math.sin(time * 0.5 + index * 0.1) * 0.3
        const floatY = Math.cos(time * 0.3 + index * 0.1) * 0.3

        // Mouse interaction
        const dx = mx - ref.current.position.x
        const dy = my - ref.current.position.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 3 && dist > 0) {
            const force = (3 - dist) / 3
            velocity.x += (dx / dist) * force * 0.01
            velocity.y += (dy / dist) * force * 0.01
        }

        // Apply velocity with damping
        velocity.multiplyScalar(0.98)

        // Update position
        ref.current.position.x = initialPos.x + floatX + velocity.x * 20
        ref.current.position.y = initialPos.y + floatY + velocity.y * 20
        ref.current.position.z = initialPos.z
    })

    return (
        <Trail
            width={0.3}
            length={4}
            color={new THREE.Color('#64ffda')}
            decay={1}
            attenuation={(t) => t * t}
        >
            <mesh ref={ref} position={position}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial
                    color={new THREE.Color('#e1bee7').lerp(new THREE.Color('#64ffda'), Math.random())}
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </Trail>
    )
}

function SilkParticles({ count = 150 }) {
    const positions = useMemo(() => {
        const temp = []
        // Create particles in a sphere around the cocoon
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI
            const radius = 3 + Math.random() * 8

            temp.push([
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            ])
        }
        return temp
    }, [count])

    return (
        <group>
            {positions.map((pos, i) => (
                <SilkParticle key={i} position={pos} index={i} />
            ))}
        </group>
    )
}

function Cocoon(props) {
    const groupRef = useRef()
    const material = useRef()
    const { mouse, viewport } = useThree()

    useFrame(({ clock }) => {
        if (!material.current) return
        material.current.distort = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.15

        // Interactive rotation based on mouse
        if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                mouse.x * 0.5,
                0.05
            )
            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                mouse.y * 0.3,
                0.05
            )
        }
    })

    return (
        <group ref={groupRef} {...props}>
            {/* Core Cocoon - Stretched on Y axis */}
            <Sphere args={[1, 64, 64]} scale={[1, 1.8, 1]}>
                <MeshDistortMaterial
                    ref={material}
                    color="#b084cc"
                    roughness={0.1}
                    metalness={0.9}
                    distort={0.5}
                    speed={3}
                    emissive="#64ffda"
                    emissiveIntensity={0.5}
                />
            </Sphere>
            {/* Outer Silk Shell - also stretched */}
            <Sphere args={[1.2, 32, 32]} scale={[1, 1.8, 1]}>
                <meshStandardMaterial
                    color="#64ffda"
                    wireframe
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                />
            </Sphere>
            {/* Inner Glow */}
            <pointLight intensity={3} distance={6} color="#b084cc" />
        </group>
    )
}

function FloatingBox({ position, rotation }) {
    const ref = useRef()
    const { mouse } = useThree()

    useFrame((state) => {
        if (!ref.current) return
        const time = state.clock.elapsedTime

        // Gentle pulsing based on mouse distance
        const dx = mouse.x * 5 - position[0]
        const dy = mouse.y * 5 - position[1]
        const dist = Math.sqrt(dx * dx + dy * dy)
        const scale = 1 + Math.sin(time + dist) * 0.1
        ref.current.scale.setScalar(scale)
    })

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={ref} position={position} rotation={rotation}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                    color="#404040"
                    roughness={0.1}
                    metalness={0.8}
                    transmission={0.5}
                    thickness={1}
                    emissive="#64ffda"
                    emissiveIntensity={0.1}
                />
            </mesh>
        </Float>
    )
}

function MyceliumStrands({ start, ends }) {
    const groupRef = useRef()
    const { mouse } = useThree()

    const lines = useMemo(() => {
        return ends.map((end, i) => ({
            start: new THREE.Vector3(...start),
            end: new THREE.Vector3(...end),
            mid: new THREE.Vector3(
                (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 2,
                (start[1] + end[1]) / 2 + (Math.random() - 0.5) * 2,
                (start[2] + end[2]) / 2 + (Math.random() - 0.5) * 2
            )
        }))
    }, [start, ends])

    useFrame((state) => {
        if (!groupRef.current) return
        const time = state.clock.elapsedTime

        // Subtle pulsing animation
        groupRef.current.children.forEach((child, i) => {
            if (child.material) {
                child.material.opacity = 0.25 + Math.sin(time * 2 + i * 0.5) * 0.15
            }
        })
    })

    return (
        <group ref={groupRef}>
            {lines.map((line, i) => (
                <QuadraticBezierLine
                    key={i}
                    start={line.start}
                    end={line.end}
                    mid={line.mid}
                    color="#64ffda"
                    lineWidth={3}
                    transparent
                    opacity={0.3}
                />
            ))}
        </group>
    )
}

function Scene() {
    const boxPositions = [
        [3, -2, 0],
        [-3, -1, 0],
        [-2, 3, 0],
        [2, 2.5, -1]
    ]

    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -5]} intensity={0.8} color="#b084cc" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Center top position={[0, 5, 0]}>
                <Text3D size={0.5} height={0.05} font="/fonts/Inter_Bold.json">
                    COCOON
                    <meshStandardMaterial color="white" emissive="#64ffda" emissiveIntensity={0.6} />
                </Text3D>
            </Center>

            <Cocoon position={[0, 0, 0]} />

            {/* Silk particles surrounding the cocoon */}
            <SilkParticles count={150} />

            {boxPositions.map((pos, i) => (
                <FloatingBox key={i} position={pos} rotation={[Math.random(), Math.random(), Math.random()]} />
            ))}

            <MyceliumStrands start={[0, 0, 0]} ends={boxPositions} />

            {/* OrbitControls with ZOOM ENABLED */}
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                rotateSpeed={0.5}
                zoomSpeed={1.2}
                minDistance={5}
                maxDistance={30}
            />
        </>
    )
}
