import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, GradientTexture } from '@react-three/drei';

export default function CinematicCocoon(props) {
    const mesh = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            // Subtle rotation
            mesh.current.rotation.x = Math.sin(t / 4) * 0.2;
            mesh.current.rotation.y = t * 0.1;

            // Breathing scale - applied on top of the base scale
            const breathe = 1 + Math.sin(t * 1.5) * 0.02;
            // Base scale is [1, 1.8, 1] for cocoon shape
            mesh.current.scale.set(1 * breathe, 1.8 * breathe, 1 * breathe);
        }
    });

    return (
        <mesh ref={mesh} {...props}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial
                color="#ffffff" // Base color white for pearlescent look
                envMapIntensity={0.8}
                clearcoat={1}
                clearcoatRoughness={0.1}
                metalness={0.2}
                roughness={0.1}
                distort={0.4} // Organic distortion
                speed={2}
            >
                <GradientTexture
                    stops={[0, 0.4, 0.8, 1]}
                    colors={['#b084cc', '#ffffff', '#64ffda', '#b084cc']} // Pearlescent palette
                    size={1024}
                />
            </MeshDistortMaterial>
        </mesh>
    );
}
