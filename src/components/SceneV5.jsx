import { useState, useRef, useMemo } from 'react';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';
import OrbitalObject from './OrbitalObject';
import { moons } from '../data/orbitalData';

// Central Cocoon component
function CentralCocoon({ onClick, isRoot }) {
    const outerShell = useRef();
    const innerGlow = useRef();

    const { scale, glowIntensity } = useSpring({
        scale: isRoot ? 1.5 : 0.8,
        glowIntensity: isRoot ? 1 : 0.3,
        config: config.slow
    });

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const breathe = Math.sin(t * 1.5) * 0.03;

        if (outerShell.current) {
            outerShell.current.rotation.y = t * 0.2;
            outerShell.current.scale.setScalar(1 + breathe);
        }

        if (innerGlow.current) {
            innerGlow.current.rotation.y = -t * 0.3;
        }
    });

    return (
        <animated.group scale={scale}>
            <group ref={outerShell} onClick={onClick}>
                <mesh>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshPhysicalMaterial
                        color="#b084cc"
                        roughness={0.2}
                        metalness={0.3}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        emissive="#b084cc"
                        emissiveIntensity={0.2}
                    />
                </mesh>

                {/* Inner octahedron */}
                <group ref={innerGlow}>
                    <mesh>
                        <octahedronGeometry args={[0.7, 0]} />
                        <meshBasicMaterial
                            color="#64ffda"
                            transparent
                            opacity={0.3}
                            toneMapped={false}
                        />
                    </mesh>
                </group>
            </group>

            {/* Sparkles around cocoon */}
            <animated.group scale={glowIntensity}>
                <Sparkles
                    count={isRoot ? 150 : 50}
                    scale={3}
                    size={2}
                    speed={0.5}
                    color="#b084cc"
                    opacity={0.6}
                />
            </animated.group>
        </animated.group>
    );
}

// Central object for non-root levels
function CentralObject({ data, onClick }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
        }
    });

    const getGeometry = () => {
        const size = 1.2;
        switch (data.type) {
            case 'sphere':
                return <sphereGeometry args={[size, 32, 32]} />;
            case 'torus':
                return <torusGeometry args={[size * 0.8, size * 0.3, 32, 64]} />;
            case 'octahedron':
                return <octahedronGeometry args={[size]} />;
            case 'torusKnot':
                return <torusKnotGeometry args={[size * 0.6, size * 0.25, 128, 16]} />;
            case 'dodecahedron':
                return <dodecahedronGeometry args={[size]} />;
            default:
                return <sphereGeometry args={[size, 32, 32]} />;
        }
    };

    return (
        <group onClick={onClick}>
            <mesh ref={meshRef}>
                {getGeometry()}
                <meshPhysicalMaterial
                    color={data.color}
                    roughness={0.2}
                    metalness={0.7}
                    clearcoat={1}
                    emissive={data.color}
                    emissiveIntensity={0.3}
                />
            </mesh>
            <Sparkles count={80} scale={3} size={2} speed={0.4} color={data.color} opacity={0.5} />
        </group>
    );
}

export default function SceneV5({ onNavigationChange }) {
    const [navigationPath, setNavigationPath] = useState([]);

    // Determine current level and what to display
    const currentLevel = navigationPath.length;
    const isRoot = currentLevel === 0;
    const currentFocus = navigationPath[navigationPath.length - 1];

    // Get orbiting objects based on current level
    const orbitingObjects = useMemo(() => {
        if (isRoot) {
            // Level 0: Show moons
            return moons;
        } else if (currentLevel === 1) {
            // Level 1: Show children of selected moon
            return currentFocus.children || [];
        } else if (currentLevel === 2) {
            // Level 2: Show artworks of selected member/project
            return currentFocus.artworks || [];
        }
        return [];
    }, [currentLevel, currentFocus, isRoot]);

    // Handle object click (zoom in)
    const handleObjectClick = (data) => {
        setNavigationPath(prev => [...prev, data]);
        if (onNavigationChange) {
            onNavigationChange([...navigationPath, data]);
        }
    };

    // Handle navigation (zoom out or jump to specific level)
    const handleNavigate = (targetIndex) => {
        if (targetIndex === -1) {
            // Go to root
            setNavigationPath([]);
            if (onNavigationChange) onNavigationChange([]);
        } else {
            // Go to specific level
            setNavigationPath(prev => prev.slice(0, targetIndex + 1));
            if (onNavigationChange) {
                onNavigationChange(navigationPath.slice(0, targetIndex + 1));
            }
        }
    };

    // Back button handler
    const handleBack = () => {
        setNavigationPath(prev => prev.slice(0, -1));
        if (onNavigationChange) {
            onNavigationChange(navigationPath.slice(0, -1));
        }
    };

    // Orbit parameters based on level
    const orbitRadius = currentLevel === 0 ? 5 : currentLevel === 1 ? 4 : 3;
    const orbitSpeed = 0.1;

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 12]} />

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={isRoot}
                autoRotateSpeed={0.3}
                maxDistance={20}
                minDistance={5}
            />
            <color attach="background" args={['#000000']} />

            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#b084cc" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#64ffda" />
            <pointLight position={[0, 10, 0]} intensity={0.5} color="white" />

            {/* Background */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles
                count={200}
                scale={15}
                size={1.5}
                speed={0.3}
                opacity={0.3}
                color="#ffffff"
            />

            {/* Central object */}
            {isRoot ? (
                <CentralCocoon
                    onClick={(e) => {
                        e.stopPropagation();
                        // Clicking cocoon at root doesn't do anything in V5
                    }}
                    isRoot={isRoot}
                />
            ) : (
                <CentralObject
                    data={currentFocus}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleBack();
                    }}
                />
            )}

            {/* Orbiting objects */}
            {orbitingObjects.map((obj, index) => {
                const angleOffset = (index / orbitingObjects.length) * Math.PI * 2;
                const verticalOffset = (Math.sin(angleOffset * 2) * 0.5);

                return (
                    <OrbitalObject
                        key={obj.id}
                        data={obj}
                        orbitRadius={orbitRadius}
                        orbitSpeed={orbitSpeed}
                        angleOffset={angleOffset}
                        verticalOffset={verticalOffset}
                        onClick={handleObjectClick}
                        showLabel={true}
                        dotMode={false}
                    />
                );
            })}

            <Environment preset="night" />
        </>
    );
}
