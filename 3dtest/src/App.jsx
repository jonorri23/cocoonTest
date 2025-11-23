import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import { Suspense, useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import './App.css'

// Loading component
function Loader() {
  return (
    <Html center>
      <div className="loader">
        <div className="spinner"></div>
        <p>Loading Model...</p>
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

function App() {
  const [selectedModel, setSelectedModel] = useState('apartment')

  const models = {
    apartment: {
      path: '/one3dasset/Apartment.glb',
      name: 'Apartment',
      icon: '🏢'
    },
    home: {
      path: '/one3dasset/Home.glb',
      name: 'Home',
      icon: '🏠'
    }
  }

  return (
    <div className="app-container">
      <div className="info-panel">
        <h1>{models[selectedModel].icon} {models[selectedModel].name} Sphere</h1>
        <p>Drag to explore • Immersive 360° view</p>
      </div>

      <div className="model-selector">
        <div className="selector-label">Select Model</div>
        <div className="selector-buttons">
          {Object.entries(models).map(([key, model]) => (
            <button
              key={key}
              className={`model-button ${selectedModel === key ? 'active' : ''}`}
              onClick={() => setSelectedModel(key)}
            >
              <span className="model-icon">{model.icon}</span>
              <span className="model-name">{model.name}</span>
            </button>
          ))}
        </div>
      </div>

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

export default App
