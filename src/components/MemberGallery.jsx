import { ScrollControls, Scroll, useScroll, Text, Image } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { members } from '../data/members'

function MemberItem({ member, index, total }) {
    const group = useRef()
    const scroll = useScroll()
    const { width, height } = useThree((state) => state.viewport)

    useFrame(() => {
        // Calculate position based on scroll
        // We want them to appear one by one as we scroll down
        // The scroll.offset is 0 to 1

        // Simple vertical layout for now, can be made more complex/curved later
        const yOffset = index * height - scroll.offset * height * (total - 1)

        // Parallax effect
        // group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -index * 4 + scroll.offset * 20, 4, 0.1)
    })

    return (
        <group position={[index % 2 === 0 ? -1.5 : 1.5, -index * 4, 0]}>
            {/* 3D Card Background */}
            <mesh>
                <planeGeometry args={[3, 4]} />
                <meshPhysicalMaterial
                    color={member.color}
                    transparent
                    opacity={0.1}
                    roughness={0}
                    metalness={0.8}
                    clearcoat={1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Text in 3D space (optional, can use HTML Scroll for main text) */}
            {/* <Text
        position={[0, 1.5, 0.1]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff" // Need to handle fonts, skipping for now or using default
      >
        {member.name}
      </Text> */}
        </group>
    )
}

export default function MemberGallery() {
    const { width, height } = useThree((state) => state.viewport)

    return (
        <ScrollControls pages={members.length / 2 + 1} damping={0.3}>
            {/* 3D Content Layer */}
            <Scroll>
                {members.map((member, i) => (
                    <MemberItem key={member.id} member={member} index={i} total={members.length} />
                ))}
            </Scroll>

            {/* HTML Content Layer */}
            <Scroll html style={{ width: '100%' }}>
                {members.map((member, i) => (
                    <div
                        key={member.id}
                        style={{
                            position: 'absolute',
                            top: `${(i + 1) * 100}vh`, // Spaced out by viewports
                            left: i % 2 === 0 ? '10vw' : 'auto',
                            right: i % 2 !== 0 ? '10vw' : 'auto',
                            width: '40vw',
                            color: '#e0e0e0',
                            fontFamily: 'var(--font-main)',
                            textAlign: i % 2 === 0 ? 'left' : 'right'
                        }}
                    >
                        <h2 style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '3rem',
                            marginBottom: '0.5rem',
                            color: member.color
                        }}>
                            {member.name}
                        </h2>
                        <h3 style={{
                            fontSize: '1.2rem',
                            marginBottom: '1rem',
                            opacity: 0.8,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            {member.role}
                        </h3>
                        <p style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            background: 'rgba(0,0,0,0.5)',
                            padding: '1rem',
                            backdropFilter: 'blur(5px)',
                            borderRadius: '8px'
                        }}>
                            {member.description}
                        </p>
                    </div>
                ))}

                {/* Footer or end spacer */}
                <div style={{ position: 'absolute', top: `${(members.length + 1) * 100}vh`, height: '50vh' }} />
            </Scroll>
        </ScrollControls>
    )
}
