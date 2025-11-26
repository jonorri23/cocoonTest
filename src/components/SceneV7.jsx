import { useState, useMemo, useRef } from 'react';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sparkles, useGLTF, Float, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';
import CinematicCocoon from './CinematicCocoon';
import OrbitalObject from './OrbitalObject';
import Effects from './Effects';
import { moons } from '../data/orbitalData';

// Preload GLBs
useGLTF.preload('/models/Big T.glb');
useGLTF.preload('/models/Cool Pizza.glb');
useGLTF.preload('/models/Man-2.glb');
useGLTF.preload('/models/Man.glb');
useGLTF.preload('/models/Mowchok.glb');

const MODEL_PATHS = [
    '/models/Big T.glb',
    '/models/Cool Pizza.glb',
    '/models/Man-2.glb',
    '/models/Man.glb',
    '/models/Mowchok.glb'
];

function MemberGLB({ data, index, onClick, orbitRadius, orbitSpeed, angleOffset, verticalOffset }) {
    const group = useRef();
    const [hovered, setHover] = useState(false);
    const modelPath = MODEL_PATHS[index % MODEL_PATHS.length];
    const gltf = useGLTF(modelPath);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            // Orbital movement
            const angle = t * orbitSpeed + angleOffset;
            const x = Math.cos(angle) * orbitRadius;
            const z = Math.sin(angle) * orbitRadius;
            const y = verticalOffset + Math.sin(t * 0.5 + angleOffset) * 0.5;

            group.current.position.set(x, y, z);

            // Rotate model to face center (roughly) or just spin slowly
            group.current.rotation.y += 0.01;
        }
    });

    const { scale } = useSpring({
        scale: hovered ? 0.8 : 0.5,
        config: config.wobbly
    });

    return (
        <animated.group ref={group} scale={scale}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <group
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(data);
                    }}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <primitive object={gltf.scene.clone()} />

                    {/* Label */}
                    <Html position={[0, -2, 0]} center distanceFactor={10}>
                        <div style={{
                            color: data.color,
                            fontFamily: 'var(--font-main)',
                            fontSize: '1rem',
                            opacity: hovered ? 1 : 0.7,
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap',
                            textShadow: '0 0 5px rgba(0,0,0,0.5)',
                            transition: 'all 0.3s ease'
                        }}>
                            {data.name}
                        </div>
                    </Html>
                </group>
            </Float>
        </animated.group>
    );
}

export default function SceneV7({ onNavigationChange }) {
    const [navigationPath, setNavigationPath] = useState([]);

    const currentLevel = navigationPath.length;
    const isRoot = currentLevel === 0;
    const currentFocus = navigationPath[navigationPath.length - 1];

    // Animate Cocoon Position: Center at root, Background when zoomed
    const { cocoonPosition, cocoonScale } = useSpring({
        cocoonPosition: isRoot ? [0, 0, 0] : [15, 8, -20],
        cocoonScale: isRoot ? 1 : 4, // Make it huge in the background
        config: { mass: 1, tension: 120, friction: 14 } // Slower, cinematic transition
    });

    // Get orbiting objects
    const orbitingObjects = useMemo(() => {
        if (isRoot) {
            return moons;
        } else if (currentLevel === 1) {
            return currentFocus.children || [];
        } else if (currentLevel === 2) {
            return currentFocus.artworks || [];
        }
        return [];
    }, [currentLevel, currentFocus, isRoot]);

    const handleObjectClick = (data) => {
        setNavigationPath(prev => [...prev, data]);
        if (onNavigationChange) onNavigationChange([...navigationPath, data]);
    };

    const handleBack = () => {
        setNavigationPath(prev => prev.slice(0, -1));
        if (onNavigationChange) onNavigationChange(navigationPath.slice(0, -1));
    };

    // Orbit parameters
    const orbitRadius = currentLevel === 0 ? 6 : currentLevel === 1 ? 5 : 4;
    const orbitSpeed = 0.15;

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 14]} />
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={isRoot}
                autoRotateSpeed={0.5}
                maxDistance={25}
                minDistance={5}
            />

            <color attach="background" args={['#050505']} />

            {/* Cinematic Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#b084cc" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#64ffda" />
            <pointLight position={[0, 10, 0]} intensity={0.5} color="white" />

            {/* Background Elements */}
            <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />
            <Sparkles count={300} scale={15} size={2} speed={0.2} opacity={0.4} color="#ffffff" />

            {/* The Cinematic Cocoon (Always visible, moves to background) */}
            <animated.group position={cocoonPosition} scale={cocoonScale}>
                <CinematicCocoon
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isRoot) handleBack();
                    }}
                />
            </animated.group>

            {/* Orbiting Objects */}
            {orbitingObjects.map((obj, index) => {
                const angleOffset = (index / orbitingObjects.length) * Math.PI * 2;
                const verticalOffset = (Math.sin(angleOffset * 3) * 1);

                // Special case: Members Moon children (Level 1) use GLB models
                if (currentLevel === 1 && currentFocus.id === 'members') {
                    return (
                        <MemberGLB
                            key={obj.id}
                            data={obj}
                            index={index}
                            orbitRadius={orbitRadius}
                            orbitSpeed={orbitSpeed}
                            angleOffset={angleOffset}
                            verticalOffset={verticalOffset}
                            onClick={handleObjectClick}
                        />
                    );
                }

                // Default Orbital Object
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

            <Environment preset="city" />
            <Effects />
        </>
    );
}
