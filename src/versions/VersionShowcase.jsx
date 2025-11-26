import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import SceneShowcase from '../components/SceneShowcase';

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
            overflowY: 'auto',
            pointerEvents: 'auto'
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>Cocoon Parameters</h3>

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Environment</span>
                </div>
                <select
                    value={params.environment}
                    onChange={(e) => setParams({ ...params, environment: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                        fontSize: '13px'
                    }}
                >
                    <option value="city">City</option>
                    <option value="sunset">Sunset</option>
                    <option value="dawn">Dawn</option>
                    <option value="night">Night</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="forest">Forest</option>
                    <option value="apartment">Apartment</option>
                    <option value="studio">Studio</option>
                    <option value="park">Park</option>
                    <option value="lobby">Lobby</option>
                </select>
                <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.6 }}>
                    For custom HDR: place .hdr file in /public/hdri/
                </div>
            </div>

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Base Color</span>
                    <span>{params.color}</span>
                </div>
                <input
                    type="color"
                    value={params.color}
                    onChange={(e) => setParams({ ...params, color: e.target.value })}
                    style={{ width: '100%', height: '40px', cursor: 'pointer', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
                />
            </div>

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

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Silk Web Density</span>
                    <span>{params.silkDensity.toFixed(1)}x</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={params.silkDensity}
                    onChange={(e) => setParams({ ...params, silkDensity: parseFloat(e.target.value) })}
                    style={sliderStyle}
                />
                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                    0 = Off, 1-2 = Light, 5 = Medium, 10 = Ultra Dense
                </div>
            </div>

            <div style={groupStyle}>
                <div style={labelStyle}>
                    <span>Silk Animation</span>
                    <span>{params.silkAnimation.toFixed(1)}x</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={params.silkAnimation}
                    onChange={(e) => setParams({ ...params, silkAnimation: parseFloat(e.target.value) })}
                    style={sliderStyle}
                />
                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                    Controls wave intensity (0 = static, 2 = fluid)
                </div>
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
                    gradientColors: ['#b084cc', '#ffffff', '#64ffda', '#b084cc'],
                    environment: 'city',
                    silkDensity: 1,
                    silkAnimation: 1
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

export default function VersionShowcase() {
    const [params, setParams] = useState({
        color: "#ffffff",
        envMapIntensity: 0.8,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        metalness: 0.2,
        roughness: 0.1,
        distort: 0.4,
        speed: 2,
        gradientColors: ['#b084cc', '#ffffff', '#64ffda', '#b084cc'],
        environment: 'city',
        silkDensity: 1,
        silkAnimation: 1
    });

    return (
        <>
            <div className="canvas-container" style={{ pointerEvents: 'none' }}>
                <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }}>
                    <Suspense fallback={null}>
                        <SceneShowcase params={params} silkDensity={params.silkDensity} silkAnimation={params.silkAnimation} />
                    </Suspense>
                </Canvas>
            </div>

            <div className="ui-layer">
                <ControlPanel params={params} setParams={setParams} />

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        top: '2rem',
                        left: '2rem',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '2rem',
                        pointerEvents: 'auto',
                        color: 'white',
                        zIndex: 100
                    }}
                >
                    Cocoon <span style={{ fontSize: '1rem', opacity: 0.5 }}>Maker</span>
                </motion.h1>

                <Link href="/">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            color: 'white',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-main)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            backdropFilter: 'blur(5px)',
                            pointerEvents: 'auto',
                            zIndex: 100,
                            cursor: 'pointer'
                        }}
                    >
                        Back to Home
                    </motion.div>
                </Link>

                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    width: '100%',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.9rem',
                    pointerEvents: 'none'
                }}>
                    Adjust parameters on the left • Drag to rotate • Scroll to zoom
                </div>
            </div>
        </>
    );
}
