import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshDistortMaterial, GradientTexture } from '@react-three/drei'

export default function Cocoon(props) {
    const mesh = useRef()

    // Custom shader material for a more organic look
    // We'll start with MeshDistortMaterial from drei for a quick win on "organic" movement
    // and overlay it with some custom logic if needed later.

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (mesh.current) {
            // Subtle rotation
            mesh.current.rotation.x = Math.sin(t / 4) * 0.2
            mesh.current.rotation.y = Math.sin(t / 2) * 0.2

            // Breathing scale
            const scale = 1 + Math.sin(t * 1.5) * 0.05
            mesh.current.scale.set(scale, scale, scale)
        }
    })

    return (
        <mesh ref={mesh} {...props}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial
                color="#b084cc"
                envMapIntensity={0.4}
                clearcoat={1}
                clearcoatRoughness={0}
                metalness={0.1}
                roughness={0.2}
                distort={0.4} // Strength of distortion
                speed={2} // Speed of distortion
            >
                <GradientTexture
                    stops={[0, 0.5, 1]} // As many stops as you want
                    colors={['#b084cc', '#64ffda', '#050505']} // Colors need to match the number of stops
                    size={1024} // Size is optional, default = 1024
                />
            </MeshDistortMaterial>
        </mesh>
    )
}
