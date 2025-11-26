import { useState, useMemo, useRef } from 'react';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sparkles, useGLTF, Float, Html } from '@react-three/drei';
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
            // Orbital movement
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

export default function SceneV7({ onNavigationChange }) {
    const [navigationPath, setNavigationPath] = useState([]);
    const cocoonGroup = useRef();
    const { camera } = useThree();

    const currentLevel = navigationPath.length;
    const isRoot = currentLevel === 0;
    const currentFocus = navigationPath[navigationPath.length - 1];

    // Parent Tracking Logic
    useFrame(() => {
        if (!isRoot && cocoonGroup.current) {
            // Calculate "Top Right" position relative to camera
            // We want it fixed on screen, so we take camera position and add a local offset
            // Local offset: Right (+x), Up (+y), Forward (-z)
            const offset = new THREE.Vector3(8, 5, -15);
            offset.applyQuaternion(camera.quaternion);

            // Smoothly interpolate to new position
            const targetPos = camera.position.clone().add(offset);
            cocoonGroup.current.position.lerp(targetPos, 0.1);

            // Make it look at the camera? Or just float there?
            // cocoonGroup.current.lookAt(camera.position); // Optional
        }
    });

    // Spring for Root state (Center) vs Zoomed state (Handled by useFrame, but we use spring for scale/transition)
    const { cocoonScale } = useSpring({
        cocoonScale: isRoot ? 1 : 2, // Smaller in background than before, to fit screen corner
        config: config.gentle
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

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#b084cc" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#64ffda" />
            <pointLight position={[0, 10, 0]} intensity={0.5} color="white" />

            <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />
            <Sparkles count={300} scale={15} size={2} speed={0.2} opacity={0.4} color="#ffffff" />

            {/* The Cinematic Cocoon */}
            {/* If Root: Position 0,0,0. If Zoomed: Handled by useFrame */}
            <animated.group
                ref={cocoonGroup}
                position={isRoot ? [0, 0, 0] : [0, 0, 0]} // Initial pos, updated by frame
                scale={cocoonScale}
            >
                <CinematicCocoon
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isRoot) handleBack();
                    }}
                />
            </animated.group>

            {/* Current Focus Object (Moon Visibility) */}
            {!isRoot && (
                <OrbitalObject
                    data={currentFocus}
                    position={[0, 0, 0]}
                    orbitRadius={0} // Static at center
                    orbitSpeed={0}
                    angleOffset={0}
                    verticalOffset={0}
                    onClick={handleBack} // Clicking center goes back
                    showLabel={false} // Hide label for center object to avoid clutter
                    dotMode={false}
                />
            )}

            {/* Orbiting Objects */}
            {orbitingObjects.map((obj, index) => {
                const angleOffset = (index / orbitingObjects.length) * Math.PI * 2;
                const verticalOffset = (Math.sin(angleOffset * 3) * 1);

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
