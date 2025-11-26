import { useState, useMemo, useRef } from 'react';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sparkles, useGLTF, Float, Html, Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
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
            const angle = t * orbitSpeed + angleOffset;
            const x = Math.cos(angle) * orbitRadius;
            const z = Math.sin(angle) * orbitRadius;
            const y = verticalOffset + Math.sin(t * 0.5 + angleOffset) * 0.5;

            group.current.position.set(x, y, z);
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

// Orbit Ring Component
function OrbitRing({ radius, color, opacity = 0.15 }) {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        ));
    }

    return (
        <Line
            points={points}
            color={color}
            lineWidth={1}
            opacity={opacity}
            transparent
        />
    );
}

export default function SceneV8({ onNavigationChange }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Central Orbit System: Everything orbits the Cocoon
    const activeObjects = useMemo(() => {
        if (!selectedCategory) {
            return moons; // Root level: show moons
        } else if (selectedCategory.children) {
            return selectedCategory.children; // Selected category's children
        }
        return [];
    }, [selectedCategory]);

    const handleObjectClick = (data) => {
        if (!selectedCategory) {
            // Clicking a moon at root level
            setSelectedCategory(data);
            if (onNavigationChange) onNavigationChange([data]);
        } else if (data.artworks) {
            // Clicking a member/project with artworks
            setSelectedCategory(data);
            if (onNavigationChange) onNavigationChange([selectedCategory, data]);
        }
    };

    const handleBack = () => {
        setSelectedCategory(null);
        if (onNavigationChange) onNavigationChange([]);
    };

    const orbitRadius = selectedCategory ? 8 : 6;
    const orbitSpeed = 0.15;

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 5, 15]} />
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={!selectedCategory}
                autoRotateSpeed={0.3}
                maxDistance={25}
                minDistance={8}
            />

            <color attach="background" args={['#050505']} />

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#b084cc" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#64ffda" />
            <pointLight position={[0, 10, 0]} intensity={0.5} color="white" />

            <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />
            <Sparkles count={300} scale={15} size={2} speed={0.2} opacity={0.4} color="#ffffff" />

            {/* Central Cocoon - Always at origin */}
            <group position={[0, 0, 0]}>
                <CinematicCocoon
                    onClick={(e) => {
                        e.stopPropagation();
                        if (selectedCategory) handleBack();
                    }}
                />
            </group>

            {/* Orbit Ring Visualization */}
            <OrbitRing
                radius={orbitRadius}
                color={selectedCategory ? selectedCategory.color : "#b084cc"}
                opacity={0.2}
            />

            {/* Orbiting Objects around the Cocoon */}
            {activeObjects.map((obj, index) => {
                const angleOffset = (index / activeObjects.length) * Math.PI * 2;
                const verticalOffset = 0;

                // Special case for Members
                if (selectedCategory?.id === 'members') {
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
