import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, GradientTexture, OrbitControls, Environment, Float, Line, MeshWobbleMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

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

// Mycelium node orbiter
function MyceliumNode({ color, orbitSpeed }) {
    const mesh = useRef();
    const angle = useRef(Math.random() * Math.PI * 2);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        angle.current += orbitSpeed;

        const radius = 3;
        const x = Math.cos(angle.current) * radius;
        const z = Math.sin(angle.current) * radius;
        const y = Math.sin(t * 0.5 + angle.current) * 0.3;

        if (mesh.current) {
            mesh.current.position.set(x, y, z);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
            <mesh ref={mesh}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <MeshDistortMaterial
                    color={color}
                    envMapIntensity={1.5}
                    clearcoat={0.8}
                    metalness={0.3}
                    roughness={0.2}
                    distort={0.3}
                    speed={3}
                    emissive={color}
                    emissiveIntensity={0.3}
                />
            </mesh>
        </Float>
    );
}

// Silk pod orbiter
function SilkPod({ orbitSpeed }) {
    const mesh = useRef();
    const angle = useRef(Math.random() * Math.PI * 2);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        angle.current += orbitSpeed;

        const radius = 3.5;
        const x = Math.cos(angle.current + Math.PI * 0.66) * radius;
        const z = Math.sin(angle.current + Math.PI * 0.66) * radius;
        const y = Math.sin(t * 0.7 + angle.current) * 0.5;

        if (mesh.current) {
            mesh.current.position.set(x, y, z);
            mesh.current.rotation.x = Math.sin(t * 0.5) * 0.2;
            mesh.current.rotation.y = t * 0.3;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <mesh ref={mesh} scale={[0.4, 0.6, 0.4]}>
                <sphereGeometry args={[1, 32, 32]} />
                <MeshWobbleMaterial
                    color="#64ffda"
                    envMapIntensity={1}
                    clearcoat={1}
                    metalness={0.1}
                    roughness={0.05}
                    factor={0.3}
                    speed={2}
                >
                    <GradientTexture
                        stops={[0, 0.5, 1]}
                        colors={['#64ffda', '#ffffff', '#b084cc']}
                        size={512}
                    />
                </MeshWobbleMaterial>
            </mesh>
        </Float>
    );
}

// Crystal formation orbiter
function CrystalNode({ orbitSpeed }) {
    const mesh = useRef();
    const angle = useRef(Math.random() * Math.PI * 2);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        angle.current += orbitSpeed;

        const radius = 2.8;
        const x = Math.cos(angle.current + Math.PI * 1.33) * radius;
        const z = Math.sin(angle.current + Math.PI * 1.33) * radius;
        const y = Math.sin(t * 0.6 + angle.current) * 0.4;

        if (mesh.current) {
            mesh.current.position.set(x, y, z);
            mesh.current.rotation.x = t * 0.2;
            mesh.current.rotation.y = t * 0.3;
        }
    });

    return (
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.25}>
            <mesh ref={mesh} scale={0.3}>
                <octahedronGeometry args={[1, 0]} />
                <meshPhysicalMaterial
                    color="#b084cc"
                    envMapIntensity={2}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    metalness={0.8}
                    roughness={0.1}
                    transmission={0.5}
                    thickness={0.5}
                />
            </mesh>
        </Float>
    );
}

// Silk threads connecting objects
function SilkThreads() {
    const threads = useRef([]);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const orbitSpeed = 0.01;

        // Calculate positions for the 3 orbiters
        const positions = [
            {
                x: Math.cos(t * orbitSpeed) * 3,
                y: Math.sin(t * 0.5) * 0.3,
                z: Math.sin(t * orbitSpeed) * 3
            },
            {
                x: Math.cos(t * orbitSpeed + Math.PI * 0.66) * 3.5,
                y: Math.sin(t * 0.7 + Math.PI * 0.66) * 0.5,
                z: Math.sin(t * orbitSpeed + Math.PI * 0.66) * 3.5
            },
            {
                x: Math.cos(t * orbitSpeed + Math.PI * 1.33) * 2.8,
                y: Math.sin(t * 0.6 + Math.PI * 1.33) * 0.4,
                z: Math.sin(t * orbitSpeed + Math.PI * 1.33) * 2.8
            }
        ];

        threads.current = positions;
    });

    return (
        <>
            {/* Threads from cocoon to each orbiter */}
            {threads.current.map((pos, i) => (
                <Line
                    key={`cocoon-${i}`}
                    points={[[0, 0, 0], [pos.x, pos.y, pos.z]]}
                    color="#ffffff"
                    lineWidth={0.5}
                    opacity={0.15}
                    transparent
                    dashed
                    dashScale={50}
                    gapSize={0.5}
                />
            ))}

            {/* Threads between orbiters */}
            {threads.current.length === 3 && (
                <>
                    <Line
                        points={[
                            [threads.current[0].x, threads.current[0].y, threads.current[0].z],
                            [threads.current[1].x, threads.current[1].y, threads.current[1].z]
                        ]}
                        color="#64ffda"
                        lineWidth={0.3}
                        opacity={0.1}
                        transparent
                    />
                    <Line
                        points={[
                            [threads.current[1].x, threads.current[1].y, threads.current[1].z],
                            [threads.current[2].x, threads.current[2].y, threads.current[2].z]
                        ]}
                        color="#b084cc"
                        lineWidth={0.3}
                        opacity={0.1}
                        transparent
                    />
                    <Line
                        points={[
                            [threads.current[2].x, threads.current[2].y, threads.current[2].z],
                            [threads.current[0].x, threads.current[0].y, threads.current[0].z]
                        ]}
                        color="#ffffff"
                        lineWidth={0.3}
                        opacity={0.1}
                        transparent
                    />
                </>
            )}
        </>
    );
}

// Ambient silk web environment
function SilkWeb({ density = 1 }) {
    const strands = useMemo(() => {
        const count = Math.floor(50 * density);
        return Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const radius = 5 + Math.random() * 10;
            const height = (Math.random() - 0.5) * 15;
            const spiralTightness = 0.5 + Math.random() * 1.5;

            // Create spiral strand
            const points = [];
            const segments = 20;
            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                const spiralAngle = angle + t * Math.PI * 2 * spiralTightness;
                const spiralRadius = radius * (1 - t * 0.3);

                points.push(new THREE.Vector3(
                    Math.cos(spiralAngle) * spiralRadius,
                    height + (t - 0.5) * (Math.random() * 5),
                    Math.sin(spiralAngle) * spiralRadius
                ));
            }

            return {
                id: i,
                points,
                color: ['#ffffff', '#b084cc', '#64ffda'][i % 3],
                opacity: 0.05 + Math.random() * 0.1,
                lineWidth: 0.1 + Math.random() * 0.3
            };
        });
    }, [density]);

    const radialStrands = useMemo(() => {
        const count = Math.floor(30 * density);
        return Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const startRadius = 1.5;
            const endRadius = 12 + Math.random() * 5;

            const points = [
                new THREE.Vector3(
                    Math.cos(angle) * startRadius,
                    (Math.random() - 0.5) * 2,
                    Math.sin(angle) * startRadius
                ),
                new THREE.Vector3(
                    Math.cos(angle) * endRadius,
                    (Math.random() - 0.5) * 10,
                    Math.sin(angle) * endRadius
                )
            ];

            return {
                id: `radial-${i}`,
                points,
                color: '#ffffff',
                opacity: 0.03 + Math.random() * 0.07,
                lineWidth: 0.1
            };
        });
    }, [density]);

    return (
        <>
            {/* Spiral web strands */}
            {strands.map(strand => (
                <Line
                    key={strand.id}
                    points={strand.points}
                    color={strand.color}
                    lineWidth={strand.lineWidth}
                    opacity={strand.opacity}
                    transparent
                />
            ))}

            {/* Radial strands from cocoon */}
            {radialStrands.map(strand => (
                <Line
                    key={strand.id}
                    points={strand.points}
                    color={strand.color}
                    lineWidth={strand.lineWidth}
                    opacity={strand.opacity}
                    transparent
                    dashed
                    dashScale={30}
                    gapSize={0.3}
                />
            ))}
        </>
    );
}

// Floating silk particles
function SilkParticles({ density = 1 }) {
    if (density === 0) return null;

    const count = Math.floor(200 * density);
    const scale = 8 + (density * 4);

    return (
        <>
            <Sparkles
                count={count}
                scale={scale}
                size={1.5}
                speed={0.1}
                opacity={0.2}
                color="#ffffff"
            />
            <Sparkles
                count={Math.floor(count * 0.5)}
                scale={scale * 0.8}
                size={2}
                speed={0.15}
                opacity={0.15}
                color="#64ffda"
            />
            <Sparkles
                count={Math.floor(count * 0.5)}
                scale={scale * 0.9}
                size={1.8}
                speed={0.12}
                opacity={0.15}
                color="#b084cc"
            />
        </>
    );
}

export default function SceneShowcase({ params, silkDensity = 1 }) {
    return (
        <>
            <OrbitControls enableZoom={true} enablePan={false} />

            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, 5, -5]} intensity={1.2} color="#b084cc" />
            <pointLight position={[0, -5, 5]} intensity={1} color="#64ffda" />

            <color attach="background" args={['#0a0a0a']} />

            <InteractiveCocoon params={params} />

            {/* Orbiting objects */}
            <MyceliumNode color="#b084cc" orbitSpeed={0.01} />
            <SilkPod orbitSpeed={0.01} />
            <CrystalNode orbitSpeed={0.01} />

            {/* Silk thread connections */}
            <SilkThreads />

            {/* Ambient silk web environment */}
            <SilkWeb density={silkDensity} />
            <SilkParticles density={silkDensity} />

            <Environment preset={params.environment} />
        </>
    );
}
