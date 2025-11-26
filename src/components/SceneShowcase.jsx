import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, GradientTexture, OrbitControls, Environment } from '@react-three/drei';

function InteractiveCocoon({ params }) {
    const mesh = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.x = Math.sin(t / 4) * 0.2;
            mesh.current.rotation.y = t * 0.1;

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

function ControlPanel({ params, setParams }) {
    const sliderStyle = {
        width: '100%',
        marginBottom: '8px'
    };

    const labelStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        marginBottom: '4px',
        color: '#aaa'
    };

    const groupStyle = {
        marginBottom: '16px',
        padding: '12px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)'
    };

    return (
        <div style={{
            position: 'absolute',
            top: '80px',
            left: '20px',
            width: '280px',
            color: 'white',
            fontFamily: 'var(--font-main)',
            fontSize: '13px',
            zIndex: 100,
            background: 'rgba(0,0,0,0.7)',
            padding: '16px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            maxHeight: '80vh',
            overflowY: 'auto'
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>Cocoon Parameters</h3>

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Distort</span>
                    <span>{params.distort.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.distort}
                    onChange={(e) => setParams({ ...params, distort: parseFloat(e.target.value) })}
                    style={sliderStyle}
                />
            </div>

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Animation Speed</span>
                    <span>{params.speed.toFixed(1)}</span>
                </div>
                <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={params.speed}
                    onChange={(e) => setParams({ ...params, speed: parseFloat(e.target.value) })}
                    style={sliderStyle}
                />
            </div>

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Metalness</span>
                    <span>{params.metalness.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.metalness}
                    onChange={(e) => setParams({ ...params, metalness: parseFloat(e.target.value) })}
                    style={sliderStyle}
                />
            </div>

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Roughness</span>
                    <span>{params.roughness.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.roughness}
                    onChange={(e) => setParams({ ...params, roughness: parseFloat(e.target.value) })}
                    style={sliderStyle}
                />
            </div>

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Clearcoat</span>
                    <span>{params.clearcoat.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.clearcoat}
                    onChange={(e) => setParams({ ...params, clearcoat: parseFloat(e.target.value) })}
                    style={sliderStyle}
                />
            </div>

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Clearcoat Roughness</span>
                    <span>{params.clearcoatRoughness.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.clearcoatRoughness}
                    onChange={(e) => setParams({ ...params, clearcoatRoughness: parseFloat(e.target.value) })}
                    style={sliderStyle}
                />
            </div>

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Env Map Intensity</span>
                    <span>{params.envMapIntensity.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value={params.envMapIntensity}
                    onChange={(e) => setParams({ ...params, envMapIntensity: parseFloat(e.target.value) })}
                    style={sliderStyle}
                />
            </div>

            <button
                onClick={() => setParams({
                    color: "#ffffff",
                    envMapIntensity: 0.8,
                    clearcoat: 1,
                    clearcoatRoughness: 0.1,
                    metalness: 0.2,
                    roughness: 0.1,
                    distort: 0.4,
                    speed: 2,
                    gradientColors: ['#b084cc', '#ffffff', '#64ffda', '#b084cc']
                })}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(176, 132, 204, 0.3)',
                    border: '1px solid rgba(176, 132, 204, 0.5)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    marginTop: '8px'
                }}
            >
                Reset to V7 Default
            </button>
        </div>
    );
}

export default function SceneShowcase() {
    // V7 Default parameters
    const [params, setParams] = useState({
        color: "#ffffff",
        envMapIntensity: 0.8,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        metalness: 0.2,
        roughness: 0.1,
        distort: 0.4,
        speed: 2,
        gradientColors: ['#b084cc', '#ffffff', '#64ffda', '#b084cc']
    });

    return (
        <>
            <ControlPanel params={params} setParams={setParams} />

            <OrbitControls enableZoom={true} enablePan={false} />

            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, 5, -5]} intensity={1.2} color="#b084cc" />
            <pointLight position={[0, -5, 5]} intensity={1} color="#64ffda" />

            <color attach="background" args={['#0a0a0a']} />

            <InteractiveCocoon params={params} />

            <Environment preset="city" />
        </>
    );
}
