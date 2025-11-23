import { Environment, Float, Stars, Sparkles } from '@react-three/drei'
import Cocoon from './Cocoon'
import MemberGallery from './MemberGallery'
import Effects from './Effects'

export default function Scene() {
    return (
        <>
            <color attach="background" args={['#050505']} />

            {/* Atmospheric Lighting */}
            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64ffda" />

            {/* Background Elements */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={200} scale={10} size={2} speed={0.4} opacity={0.5} color="#b084cc" />

            {/* Scrollable Content */}
            <MemberGallery />

            {/* Central Object - Fixed in background or moving?
                Let's keep it independent of scroll for now, or maybe subtle movement
            */}
            <Float
                speed={2}
                rotationIntensity={0.5}
                floatIntensity={0.5}
            >
                <Cocoon position={[0, 0, -2]} scale={1.5} />
            </Float>

            {/* Environment for reflections */}
            <Environment preset="city" />

            {/* Post Processing */}
            <Effects />
        </>
    )
}
