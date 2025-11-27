import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { OrbitControls, Trail } from '@react-three/drei'

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
            width={0.5}
            length={6}
            color={new THREE.Color('#e0f7fa')}
            decay={1}
            attenuation={(t) => t * t}
        >
            <mesh ref={ref} position={position}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial
                    color={new THREE.Color('#e1bee7').lerp(new THREE.Color('#64ffda'), Math.random())}
                    transparent
                    opacity={0.8}
                />
            </mesh>
        </Trail>
    )
}

function SilkGarden({ count = 300 }) {
    const positions = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            temp.push([
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10
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

export default function App() {
    return (
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 60 }}>
            <color attach="background" args={['#0a0a0a']} />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <SilkGarden />
            <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.3} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
    )
}
