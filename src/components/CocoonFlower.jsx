import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader material for cocoon-to-flower morph
const CocoonFlowerMaterial = shaderMaterial(
    {
        uTime: 0,
        uMorphProgress: 0,
        uGradientMap: null,
        uPetalCount: 6,
        uPetalSpread: 2.2,
        uPetalThickness: 0.35,
        uPetalCurl: 0.5,
        uDistort: 0.4,
        uCenterSize: 0.35,
    },

  // Vertex Shader
  /*glsl*/`
    uniform float uTime;
    uniform float uMorphProgress;
    uniform float uPetalCount;
    uniform float uPetalSpread;
    uniform float uPetalThickness;
    uniform float uPetalCurl;
    uniform float uDistort;
    uniform float uCenterSize;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vPetalMask;
    varying float vCenterMask;
    
    #define PI 3.14159265359
    
    // Simplex 3D Noise
    vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      float theta = atan(pos.x, pos.z);
      float r = length(pos);
      float normalizedY = pos.y / r;
      
      // COCOON STATE (V7 parameters)
      vec3 cocoonPos = pos;
      cocoonPos.y *= 1.8; // V7 stretch
      
      float distortNoise = snoise(pos * 2.0 + uTime * 2.0);
      float distortAmount = uDistort * (1.0 - uMorphProgress * 0.5);
      cocoonPos += normal * distortNoise * distortAmount;
      
      float breathe = 1.0 + sin(uTime * 1.5) * 0.02 * (1.0 - uMorphProgress);
      cocoonPos *= breathe;
      
      // FLOWER STATE
      vec3 flowerPos = pos;
      
      // Petal zones
      float petalAngle = mod(theta + PI, (2.0 * PI) / uPetalCount) - PI / uPetalCount;
      float petalMask = 1.0 - smoothstep(0.0, 0.6, abs(petalAngle) / (PI / uPetalCount));
      
      // Height zones
      float isUpperHalf = smoothstep(-0.1, 0.4, normalizedY);
      float isCenter = smoothstep(1.0 - uCenterSize, 1.0, normalizedY);
      float isBottom = smoothstep(0.0, -0.3, normalizedY);
      float isPetal = isUpperHalf * (1.0 - isCenter) * petalMask;
      float isBetweenPetals = isUpperHalf * (1.0 - isCenter) * (1.0 - petalMask);
      
      // Flatten into disc
      float flattenAmount = 0.08;
      flowerPos.y *= mix(1.0, flattenAmount, isUpperHalf);
      
      // Bottom tucks under
      float bottomCurl = isBottom * 0.9;
      flowerPos.y = mix(flowerPos.y, -0.1, bottomCurl);
      float bottomFlatten = isBottom * 0.3;
      flowerPos.x *= (1.0 - bottomFlatten * 0.5);
      flowerPos.z *= (1.0 - bottomFlatten * 0.5);
      
      // Petal spread
      float spreadAmount = mix(1.0, uPetalSpread, isPetal);
      flowerPos.x *= spreadAmount;
      flowerPos.z *= spreadAmount;
      
      // Gap between petals
      float gapInward = mix(1.0, 0.7, isBetweenPetals * (1.0 - isCenter));
      flowerPos.x *= gapInward;
      flowerPos.z *= gapInward;
      
      // Petal thickness
      float distFromCenter = length(vec2(pos.x, pos.z));
      float petalLift = isPetal * uPetalThickness * distFromCenter;
      flowerPos.y += petalLift;
      
      // Petal curl
      float tipCurl = isPetal * uPetalCurl * pow(distFromCenter, 2.0);
      flowerPos.y += tipCurl;
      
      // Center dome
      float centerRaise = isCenter * 0.4;
      flowerPos.y += centerRaise;
      float centerBulge = isCenter * 0.15;
      float centerDist = length(vec2(pos.x, pos.z));
      flowerPos.y += (1.0 - centerDist * 2.0) * centerBulge;
      
      // Animation
      float wave = sin(theta * uPetalCount * 2.0 + uTime * 0.8) * 0.03 * isPetal;
      flowerPos.y += wave;
      flowerPos.x += sin(uTime * 0.4) * 0.03;
      flowerPos.z += cos(uTime * 0.5) * 0.03;
      
      // BLEND
      float progress = smoothstep(0.0, 1.0, uMorphProgress);
      vec3 finalPos = mix(cocoonPos, flowerPos, progress);
      
      vPetalMask = isPetal * progress;
      vCenterMask = isCenter * progress;
      vNormal = normalize(normalMatrix * normal);
      vPosition = finalPos;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
    }
  `,

  // Fragment Shader
  /*glsl*/`
    uniform float uTime;
    uniform float uMorphProgress;
    uniform sampler2D uGradientMap;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vPetalMask;
    varying float vCenterMask;
    
    void main() {
      vec3 gradientColor = texture2D(uGradientMap, vUv).rgb;
      
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      float light = 0.35 + diffuse * 0.65;
      
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
      
      vec3 baseColor = gradientColor;
      
      // Petal tint
      vec3 petalTint = vec3(1.0, 0.85, 0.9);
      baseColor = mix(baseColor, baseColor * petalTint, vPetalMask * 0.3);
      
      // Center tint
      vec3 centerTint = vec3(1.0, 0.95, 0.7);
      baseColor = mix(baseColor, baseColor * centerTint, vCenterMask * 0.5);
      
      float clearcoat = pow(max(dot(reflect(-lightDir, vNormal), viewDir), 0.0), 32.0);
      float shimmer = sin(vUv.x * 30.0 + vUv.y * 20.0 + uTime) * 0.05;
      
      vec3 finalColor = baseColor * light;
      finalColor += fresnel * 0.25 * vec3(0.7, 0.9, 1.0);
      finalColor += clearcoat * 0.4;
      finalColor += shimmer * (1.0 - uMorphProgress * 0.5);
      
      float alpha = 0.92 + fresnel * 0.08;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ CocoonFlowerMaterial });

// Gradient texture matching V7
function useGradientTexture() {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#b084cc');
        gradient.addColorStop(0.4, '#ffffff');
        gradient.addColorStop(0.8, '#64ffda');
        gradient.addColorStop(1, '#b084cc');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }, []);
}

export default function CocoonFlower({
    morphProgress = 0,
    onClick,
    ...props
}) {
    const meshRef = useRef();
    const materialRef = useRef();
    const gradientTexture = useGradientTexture();

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (materialRef.current) {
            materialRef.current.uTime = t;
            materialRef.current.uGradientMap = gradientTexture;
            materialRef.current.uMorphProgress = morphProgress;

            // V7 parameters
            materialRef.current.uPetalCount = 6;
            materialRef.current.uPetalSpread = 2.2;
            materialRef.current.uPetalThickness = 0.35;
            materialRef.current.uPetalCurl = 0.5;
            materialRef.current.uDistort = 0.4;
            materialRef.current.uCenterSize = 0.35;
        }

        // V7 rotation when in cocoon state
        if (meshRef.current && morphProgress < 0.1) {
            meshRef.current.rotation.x = Math.sin(t / 4) * 0.2;
            meshRef.current.rotation.y = t * 0.1;
        }
    });

    return (
        <mesh ref={meshRef} onClick={onClick} {...props}>
            <sphereGeometry args={[1, 64, 64]} />
            <cocoonFlowerMaterial
                ref={materialRef}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
