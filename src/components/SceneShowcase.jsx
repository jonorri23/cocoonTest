import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, GradientTexture, OrbitControls, Environment } from '@react-three/drei';

function InteractiveCocoon({ params }) {
    const mesh = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            // Simple Y-axis rotation only
            mesh.current.rotation.y = t * 0.3;

            const breathe = 1 + Math.sin(t * 1.5) * 0.02;
            mesh.current.scale.set(1 * breathe, 1.8 * breathe, 1 * breathe);
        }
    });

    return (
        <mesh ref={mesh}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial
                color={params.color}
                envMapIntensity={params.envMapIntensity}
                clearcoat={params.clearcoat}
                clearcoatRoughness={params.clearcoatRoughness}
                metalness={params.metalness}
                roughness={params.roughness}
                distort={params.distort}
                speed={params.speed}
            >
                <GradientTexture
                    stops={[0, 0.4, 0.8, 1]}
                    colors={params.gradientColors}
                    size={1024}
                />
            </MeshDistortMaterial>
        </mesh>
    );
}

export default function SceneShowcase({ params }) {
    return (
        <>
            <OrbitControls enableZoom={true} enablePan={false} />

            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, 5, -5]} intensity={1.2} color="#b084cc" />
            <pointLight position={[0, -5, 5]} intensity={1} color="#64ffda" />

            <color attach="background" args={['#0a0a0a']} />

            <InteractiveCocoon params={params} />

            <Environment preset="city" />
        </>
    );
}
