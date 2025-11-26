import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, GradientTexture, OrbitControls, Float, Html } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';

function ShowcaseCocoon({ position, label, materialProps, gradientColors }) {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.x = Math.sin(t / 4) * 0.2;
            mesh.current.rotation.y = t * 0.2;
            // Subtle breathing
            const breathe = 1 + Math.sin(t * 1.5) * 0.02;
            mesh.current.scale.set(breathe, breathe, breathe);
        }
    });

    const { scale } = useSpring({
        scale: hovered ? 1.3 : 1,
        config: config.wobbly
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position}>
                <animated.mesh
                    ref={mesh}
                    scale={scale}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <sphereGeometry args={[1, 64, 64]} />
                    <MeshDistortMaterial
                        {...materialProps}
                    >
                        {gradientColors && (
                            <GradientTexture
                                stops={[0, 0.5, 1]}
                                colors={gradientColors}
                                size={1024}
                            />
                        )}
                    </MeshDistortMaterial>
                </animated.mesh>

                {/* HTML Label */}
                <Html position={[0, -1.5, 0]} center distanceFactor={8}>
                    <div style={{
                        color: 'white',
                        fontSize: '14px',
                        fontFamily: 'var(--font-main)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        opacity: hovered ? 1 : 0.7,
                        transition: 'opacity 0.3s'
                    }}>
                        {label}
                    </div>
                </Html>
            </group>
        </Float>
    );
}

export default function SceneShowcase() {
    const variations = [
        {
            label: "Liquid Gold",
            position: [-6, 2.5, 0],
            materialProps: { color: "#FFD700", metalness: 1, roughness: 0.1, clearcoat: 1, distort: 0.4, speed: 2 }
        },
        {
            label: "Deep Ocean",
            position: [-2, 2.5, 0],
            materialProps: { color: "#0077be", metalness: 0.5, roughness: 0.2, clearcoat: 1, distort: 0.6, speed: 1.5 },
            gradientColors: ['#000044', '#0077be', '#00ffff']
        },
        {
            label: "Neon Cyber",
            position: [2, 2.5, 0],
            materialProps: { color: "#ff00ff", metalness: 0.8, roughness: 0.1, distort: 0.5, speed: 3 },
            gradientColors: ['#ff00ff', '#00ffff', '#ffff00']
        },
        {
            label: "Pearlescent",
            position: [6, 2.5, 0],
            materialProps: { color: "#ffffff", metalness: 0.2, roughness: 0.1, clearcoat: 1, distort: 0.3, speed: 1 },
            gradientColors: ['#b084cc', '#ffffff', '#64ffda']
        },
        {
            label: "Magma",
            position: [-6, -2.5, 0],
            materialProps: { color: "#ff4500", metalness: 0.1, roughness: 0.4, distort: 0.8, speed: 1.5 },
            gradientColors: ['#8b0000', '#ff4500', '#ffff00']
        },
        {
            label: "Vantablack",
            position: [-2, -2.5, 0],
            materialProps: { color: "#050505", metalness: 0.5, roughness: 0.8, distort: 0.3, speed: 0.5 }
        },
        {
            label: "Holographic",
            position: [2, -2.5, 0],
            materialProps: { color: "#ffffff", metalness: 0.9, roughness: 0.1, distort: 0.4, speed: 2 },
            gradientColors: ['#ff0000', '#00ff00', '#0000ff']
        },
        {
            label: "Toxic Slime",
            position: [6, -2.5, 0],
            materialProps: { color: "#39ff14", metalness: 0.3, roughness: 0.2, distort: 0.7, speed: 2.5 },
            gradientColors: ['#39ff14', '#00ff00', '#ccff00']
        }
    ];

    return (
        <>
            <OrbitControls enableZoom={true} enablePan={true} />

            {/* Stronger lighting */}
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#0088ff" />
            <pointLight position={[0, 10, -10]} intensity={1} color="#ff00ff" />

            <color attach="background" args={['#0a0a0a']} />

            {variations.map((v, i) => (
                <ShowcaseCocoon key={i} {...v} />
            ))}
        </>
    );
}
