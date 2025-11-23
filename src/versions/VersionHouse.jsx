import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import { Suspense, useRef, useMemo, useState } from 'react'
import * as THREE from 'three'

// Loading component
function Loader() {
    return (
        <Html center>
            <div style={{
                textAlign: 'center',
                color: 'white',
                fontFamily: 'var(--font-main)'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    margin: '0 auto 1rem',
                    border: '4px solid rgba(255, 255, 255, 0.1)',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', fontWeight: 500 }}>
                    Loading Model...
                </p>
            </div>
        </Html>
    )
}

// Sphere projection renderer
function SphereProjection({ modelPath }) {
    const { gl, scene, camera } = useThree()
    const meshRef = useRef()
    const { scene: modelScene } = useGLTF(modelPath)

    // Create cube camera for environment mapping
    const cubeCamera = useMemo(() => {
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
            format: THREE.RGBAFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
        })
        return new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
    }, [])

    // Virtual scene for the model
    const virtualScene = useMemo(() => {
        const vScene = new THREE.Scene()
        vScene.background = new THREE.Color(0x1a1a2e)

        // Clone the model
        const modelClone = modelScene.clone()
        modelClone.scale.set(3, -3, 3)  // Negative Y to flip vertically
        modelClone.position.set(0, -1, 0)
        vScene.add(modelClone)

        // Add lights to virtual scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        vScene.add(ambientLight)

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
        dirLight1.position.set(5, 10, 5)
        vScene.add(dirLight1)

        const dirLight2 = new THREE.DirectionalLight(0x667eea, 0.4)
        dirLight2.position.set(-5, 5, -5)
        vScene.add(dirLight2)

        const pointLight = new THREE.PointLight(0x764ba2, 1, 50)
        pointLight.position.set(0, 8, 0)
        vScene.add(pointLight)

        return vScene
    }, [modelScene])

    // Update cube camera each frame
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.visible = false
            cubeCamera.update(gl, virtualScene)
            meshRef.current.visible = true
        }
    })

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[8, 64, 64]} />
            <meshBasicMaterial
                envMap={cubeCamera.renderTarget.texture}
                side={THREE.BackSide}
                toneMapped={false}
            />
        </mesh>
    )
}

// Main 3D viewer component
function SphereProjectionViewer({ modelPath }) {
    return (
        <>
            {/* Camera positioned at center of the sphere */}
            <perspectiveCamera
                makeDefault
                position={[0, 0, 0]}
                fov={80}
            />

            {/* Rotation-only controls - no panning, no zooming */}
            <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={true}
                rotateSpeed={-0.5}
                enableDamping={true}
                dampingFactor={0.05}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
            />

            {/* Sphere with projected model */}
            <Suspense fallback={<Loader />}>
                <SphereProjection modelPath={modelPath} />
            </Suspense>
        </>
    )
}

export default function VersionHouse() {
    const [selectedModel, setSelectedModel] = useState('home')

    const models = {
        home: {
            path: '/one3dasset/Home.glb',
            name: 'Home',
            icon: '🏠'
        }
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        canvas {
          display: block;
          width: 100%;
          height: 100%;
          cursor: grab;
        }
        canvas:active {
          cursor: grabbing;
        }
      `}</style>

            {/* Info Panel */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '1.5rem 2rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                animation: 'slideIn 0.6s ease-out'
            }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em'
                }}>
                    {models[selectedModel].icon} {models[selectedModel].name} Sphere
                </h1>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.95rem',
                    fontWeight: 400
                }}>
                    Drag to explore • Immersive 360° view
                </p>
            </div>

            {/* Model Selector */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                animation: 'slideInRight 0.6s ease-out',
                minWidth: '200px'
            }}>
                <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '1rem'
                }}>
                    Select Model
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                }}>
                    {Object.entries(models).map(([key, model]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedModel(key)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1.25rem',
                                background: selectedModel === key
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                border: selectedModel === key
                                    ? '2px solid transparent'
                                    : '2px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: selectedModel === key ? 'white' : 'rgba(255, 255, 255, 0.8)',
                                fontSize: '1rem',
                                fontWeight: 500,
                                fontFamily: 'var(--font-main)',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: selectedModel === key
                                    ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                                    : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedModel !== key) {
                                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)'
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedModel !== key) {
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }
                            }}
                        >
                            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{model.icon}</span>
                            <span style={{ fontWeight: 600 }}>{model.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas */}
            <Canvas
                key={selectedModel} // Force remount on model change
                gl={{
                    antialias: true,
                    alpha: false,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.0
                }}
            >
                <SphereProjectionViewer modelPath={models[selectedModel].path} />
            </Canvas>
        </div>
    )
}
