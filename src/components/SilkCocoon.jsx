import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated, config } from '@react-spring/three'

export default function SilkCocoon({ onClick }) {
    const mesh = useRef()
    const threads = useRef()
    const [active, setActive] = useState(false)

    const { scale, color } = useSpring({
        scale: active ? 1.2 : 1,
        color: active ? '#ffeb3b' : '#ffffff',
        config: config.wobbly
    })

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (mesh.current) {
            // Organic breathing
            const breathe = Math.sin(t * 1.5) * 0.02
            mesh.current.scale.set(1 + breathe, 1 + breathe, 1 + breathe)
            mesh.current.rotation.y = Math.sin(t * 0.2) * 0.1
        }
        if (threads.current) {
            threads.current.rotation.y -= 0.005
            threads.current.rotation.z = Math.sin(t * 0.5) * 0.05
        }
    })

    return (
        <group onClick={(e) => {
            e.stopPropagation()
            setActive(!active)
            onClick && onClick()
        }}>
            {/* Main Cocoon Body */}
            <animated.mesh ref={mesh} scale={scale}>
                {/* Capsule geometry for the cocoon shape */}
                <capsuleGeometry args={[1, 2.5, 32, 64]} />

                {/* Advanced Material for Silk look */}
                <MeshTransmissionMaterial
                    backside
                    samples={16}
                    resolution={512}
                    transmission={0.6}
                    roughness={0.4}
                    thickness={0.5}
                    ior={1.5}
                    chromaticAberration={0.1}
                    anisotropy={0.5}
                    distortion={0.5}
                    distortionScale={0.5}
                    temporalDistortion={0.1}
                    color="#f0f0f0"
                    attenuationColor="#ffffff"
                    attenuationDistance={0.5}
                />
            </animated.mesh>

            {/* Inner Glow / Core */}
            <mesh>
                <capsuleGeometry args={[0.5, 1.5, 32, 32]} />
                <meshBasicMaterial color="#b084cc" toneMapped={false} />
            </mesh>

            {/* Outer Threads / Fuzz */}
            <mesh ref={threads} scale={1.1}>
                <capsuleGeometry args={[1.1, 2.6, 32, 64]} />
                <meshStandardMaterial
                    color="#ffffff"
                    wireframe
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    )
}
