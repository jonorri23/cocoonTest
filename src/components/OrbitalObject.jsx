import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';

export default function OrbitalObject({
    data,
    orbitRadius,
    orbitSpeed,
    angleOffset,
    onClick,
    showLabel = true,
    dotMode = false,
    verticalOffset = 0
}) {
    const [hovered, setHover] = useState(false);
    const groupRef = useRef();

    // Spring animation for hover
    const { scale } = useSpring({
        scale: hovered ? 1.3 : 1,
        config: config.wobbly
    });

    // Orbital rotation
    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.getElapsedTime();
            const angle = angleOffset + t * orbitSpeed;
            groupRef.current.position.x = Math.cos(angle) * orbitRadius;
            groupRef.current.position.z = Math.sin(angle) * orbitRadius;
            groupRef.current.position.y = verticalOffset;
        }
    });

    // Render as simple dot when far away or in dot mode
    if (dotMode) {
        return (
            <group ref={groupRef}>
                <mesh onClick={onClick}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial color={data.color} toneMapped={false} />
                </mesh>
            </group>
        );
    }

    // Get geometry based on type
    const getGeometry = () => {
        const size = data.size || 0.5;
        switch (data.type) {
            case 'sphere':
                return <sphereGeometry args={[size, 32, 32]} />;
            case 'torus':
                return <torusGeometry args={[size * 0.8, size * 0.3, 16, 32]} />;
            case 'octahedron':
                return <octahedronGeometry args={[size]} />;
            case 'torusKnot':
                return <torusKnotGeometry args={[size * 0.5, size * 0.2, 64, 8]} />;
            case 'dodecahedron':
                return <dodecahedronGeometry args={[size]} />;
            case 'tetrahedron':
                return <tetrahedronGeometry args={[size]} />;
            default:
                return <sphereGeometry args={[size, 32, 32]} />;
        }
    };

    return (
        <animated.group ref={groupRef} scale={scale}>
            <mesh
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHover(true);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHover(false);
                    document.body.style.cursor = 'auto';
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(data);
                }}
            >
                {getGeometry()}
                <meshPhysicalMaterial
                    color={data.color}
                    roughness={0.2}
                    metalness={0.8}
                    clearcoat={1}
                    transparent
                    opacity={hovered ? 1 : 0.9}
                    emissive={data.color}
                    emissiveIntensity={hovered ? 0.3 : 0.1}
                />
            </mesh>

            {/* Subtle glow ring when hovered */}
            {hovered && (
                <mesh rotation-x={Math.PI / 2}>
                    <ringGeometry args={[(data.size || 0.5) * 1.2, (data.size || 0.5) * 1.4, 32]} />
                    <meshBasicMaterial
                        color={data.color}
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Label */}
            {showLabel && (
                <Html
                    position={[0, -(data.size || 0.5) - 0.5, 0]}
                    center
                    distanceFactor={8}
                    style={{ pointerEvents: 'none' }}
                >
                    <div
                        style={{
                            color: hovered ? 'white' : data.color,
                            fontFamily: 'var(--font-main)',
                            fontSize: hovered ? '1rem' : '0.8rem',
                            opacity: hovered ? 1 : 0.7,
                            whiteSpace: 'nowrap',
                            textShadow: '0 0 10px rgba(0,0,0,0.8)',
                            transition: 'all 0.3s ease',
                            fontWeight: hovered ? '600' : '400'
                        }}
                    >
                        {data.name}
                    </div>
                </Html>
            )}
        </animated.group>
    );
}
