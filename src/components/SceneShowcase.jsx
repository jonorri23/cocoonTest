import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, GradientTexture, OrbitControls, Html, Text, Float } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';

function ShowcaseCocoon({ position, label, materialProps, gradientColors }) {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.x = Math.sin(t / 4) * 0.2;
            mesh.current.rotation.y = t * 0.2;
        }
    });

    const { scale } = useSpring({
        scale: hovered ? 1.2 : 1,
        config: config.wobbly
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
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
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.3}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/Inter-Regular.woff" // Fallback font usually available or use default
                >
                    {label}
                </Text>
            </Float>
        </group>
    );
}

export default function SceneShowcase() {
    const variations = [
        {
            label: "Liquid Gold",
            position: [-4, 2, 0],
            materialProps: { color: "#FFD700", metalness: 1, roughness: 0.1, clearcoat: 1, distort: 0.4, speed: 2 }
        },
        {
            label: "Deep Ocean",
            position: [0, 2, 0],
            materialProps: { color: "#0077be", metalness: 0.5, roughness: 0.2, clearcoat: 1, distort: 0.6, speed: 1.5 },
            gradientColors: ['#000044', '#0077be', '#00ffff']
        },
        {
            label: "Neon Cyber",
            position: [4, 2, 0],
            materialProps: { color: "#ff00ff", metalness: 0.8, roughness: 0.1, distort: 0.5, speed: 3 },
            gradientColors: ['#ff00ff', '#00ffff', '#ffff00']
        },
        {
            label: "Pearlescent",
            position: [-4, -2, 0],
            materialProps: { color: "#ffffff", metalness: 0.2, roughness: 0.1, clearcoat: 1, distort: 0.3, speed: 1 },
            gradientColors: ['#b084cc', '#ffffff', '#64ffda']
        },
        {
            label: "Magma",
            position: [0, -2, 0],
            materialProps: { color: "#ff4500", metalness: 0.1, roughness: 0.4, distort: 0.8, speed: 1.5 },
            gradientColors: ['#8b0000', '#ff4500', '#ffff00']
        },
        {
            label: "Vantablack",
            position: [4, -2, 0],
            materialProps: { color: "#050505", metalness: 0.5, roughness: 0.8, distort: 0.3, speed: 0.5 }
        },
        {
            label: "Holographic",
            position: [-8, 0, 0], // Extra left
            materialProps: { color: "#ffffff", metalness: 0.9, roughness: 0.1, distort: 0.4, speed: 2 },
            gradientColors: ['#ff0000', '#00ff00', '#0000ff']
        },
        {
            label: "Glassy",
            position: [8, 0, 0], // Extra right
            materialProps: { color: "#aaddff", metalness: 0.1, roughness: 0, transmission: 0.9, thickness: 1, distort: 0.3, speed: 1 }
        }
    ];

    return (
        <>
            <OrbitControls enableZoom={true} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

            <color attach="background" args={['#111']} />

            {variations.map((v, i) => (
                <ShowcaseCocoon key={i} {...v} />
            ))}
        </>
    );
}
