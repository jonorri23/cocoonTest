import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, GradientTexture, OrbitControls, Float, Html } from '@react-three/drei';

function CocoonVariation({ position, label, materialProps, gradientColors, animationVariant }) {
    const mesh = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            // Animation variants for subtle differences
            switch (animationVariant) {
                case 'slow':
                    mesh.current.rotation.x = Math.sin(t / 6) * 0.15;
                    mesh.current.rotation.y = t * 0.05;
                    break;
                case 'fast':
                    mesh.current.rotation.x = Math.sin(t / 3) * 0.25;
                    mesh.current.rotation.y = t * 0.15;
                    break;
                case 'wobble':
                    mesh.current.rotation.x = Math.sin(t / 4) * 0.3;
                    mesh.current.rotation.y = Math.cos(t / 3) * 0.2;
                    break;
                default:
                    // Standard V7 animation
                    mesh.current.rotation.x = Math.sin(t / 4) * 0.2;
                    mesh.current.rotation.y = t * 0.1;
            }

            // Breathing scale
            const breathe = 1 + Math.sin(t * 1.5) * 0.02;
            mesh.current.scale.set(1 * breathe, 1.8 * breathe, 1 * breathe);
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
            <group position={position}>
                <mesh ref={mesh}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <MeshDistortMaterial
                        {...materialProps}
                    >
                        <GradientTexture
                            stops={[0, 0.4, 0.8, 1]}
                            colors={gradientColors}
                            size={1024}
                        />
                    </MeshDistortMaterial>
                </mesh>

                <Html position={[0, -2.2, 0]} center distanceFactor={8}>
                    <div style={{
                        color: 'white',
                        fontSize: '13px',
                        fontFamily: 'var(--font-main)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        opacity: 0.8,
                        textShadow: '0 0 8px rgba(0,0,0,0.8)'
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
            label: "Original",
            position: [-6, 2.5, 0],
            materialProps: {
                color: "#ffffff",
                envMapIntensity: 0.8,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                metalness: 0.2,
                roughness: 0.1,
                distort: 0.4,
                speed: 2
            },
            gradientColors: ['#b084cc', '#ffffff', '#64ffda', '#b084cc'],
            animationVariant: 'standard'
        },
        {
            label: "Golden Silk",
            position: [-2, 2.5, 0],
            materialProps: {
                color: "#ffd700",
                envMapIntensity: 0.9,
                clearcoat: 1,
                clearcoatRoughness: 0.05,
                metalness: 0.4,
                roughness: 0.05,
                distort: 0.4,
                speed: 2
            },
            gradientColors: ['#ff8c00', '#ffd700', '#fff8dc', '#ffd700'],
            animationVariant: 'slow'
        },
        {
            label: "Amber Glow",
            position: [2, 2.5, 0],
            materialProps: {
                color: "#ffbf00",
                envMapIntensity: 0.85,
                clearcoat: 1,
                clearcoatRoughness: 0.08,
                metalness: 0.3,
                roughness: 0.08,
                distort: 0.35,
                speed: 1.8
            },
            gradientColors: ['#ff6b35', '#ffbf00', '#fffacd', '#ffbf00'],
            animationVariant: 'standard'
        },
        {
            label: "Pearl White",
            position: [6, 2.5, 0],
            materialProps: {
                color: "#ffffff",
                envMapIntensity: 1.0,
                clearcoat: 1,
                clearcoatRoughness: 0.02,
                metalness: 0.15,
                roughness: 0.05,
                distort: 0.38,
                speed: 2.2
            },
            gradientColors: ['#e8d5f2', '#ffffff', '#f0f8ff', '#ffffff'],
            animationVariant: 'fast'
        },
        {
            label: "Rose Gold",
            position: [-6, -2.5, 0],
            materialProps: {
                color: "#b76e79",
                envMapIntensity: 0.9,
                clearcoat: 1,
                clearcoatRoughness: 0.06,
                metalness: 0.35,
                roughness: 0.06,
                distort: 0.42,
                speed: 1.9
            },
            gradientColors: ['#b76e79', '#ffd1dc', '#fff0f5', '#b76e79'],
            animationVariant: 'wobble'
        },
        {
            label: "Champagne",
            position: [-2, -2.5, 0],
            materialProps: {
                color: "#f7e7ce",
                envMapIntensity: 0.85,
                clearcoat: 1,
                clearcoatRoughness: 0.07,
                metalness: 0.25,
                roughness: 0.08,
                distort: 0.4,
                speed: 2.1
            },
            gradientColors: ['#d4af37', '#f7e7ce', '#fffaf0', '#f7e7ce'],
            animationVariant: 'slow'
        },
        {
            label: "Moonstone",
            position: [2, -2.5, 0],
            materialProps: {
                color: "#e8f4f8",
                envMapIntensity: 0.95,
                clearcoat: 1,
                clearcoatRoughness: 0.04,
                metalness: 0.18,
                roughness: 0.06,
                distort: 0.37,
                speed: 2.3
            },
            gradientColors: ['#9db4c0', '#e8f4f8', '#f0ffff', '#e8f4f8'],
            animationVariant: 'fast'
        },
        {
            label: "Honey Amber",
            position: [6, -2.5, 0],
            materialProps: {
                color: "#ffcc80",
                envMapIntensity: 0.88,
                clearcoat: 1,
                clearcoatRoughness: 0.09,
                metalness: 0.28,
                roughness: 0.09,
                distort: 0.43,
                speed: 1.7
            },
            gradientColors: ['#d97706', '#ffcc80', '#fff5e1', '#ffcc80'],
            animationVariant: 'wobble'
        }
    ];

    return (
        <>
            <OrbitControls enableZoom={true} enablePan={true} />

            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, 5, -5]} intensity={1.2} color="#ffd700" />
            <pointLight position={[0, -5, 5]} intensity={1} color="#b084cc" />

            <color attach="background" args={['#0a0a0a']} />

            {variations.map((v, i) => (
                <CocoonVariation key={i} {...v} />
            ))}
        </>
    );
}
