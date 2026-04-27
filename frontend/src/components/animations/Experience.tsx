"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import {
  Environment,
  Text,
  Float,
  SoftShadows,
  ContactShadows,
} from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { MeshDistortMaterial } from "@react-three/drei";

// ── Soothing Voice AI Visualizer ──
// Emulating a smooth, organic vocal frequency orb (Siri/GPT voice style)
function SoothingVoiceVisualizer() {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Create references for multiple sound wave rings
  const ringRefs = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    // Scroll-driven trajectory
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    if (groupRef.current) {
      // Scene 1: Center -> Right offset + scale down (Features)
      tl.to(groupRef.current.scale, { x: 0.65, y: 0.65, z: 0.65, duration: 1 }, 0);
      tl.to(groupRef.current.position, { x: 5, y: -1, z: 0, duration: 1 }, 0);
      
      // Scene 2: Right -> Left offset + scale (How it Works)
      tl.to(groupRef.current.position, { x: -5, y: 1, z: -2, duration: 1 }, 1);
      
      // Scene 3: Left -> Center low (Benefits)
      tl.to(groupRef.current.position, { x: 0, y: -3, z: 2, duration: 1 }, 2);
      tl.to(groupRef.current.scale, { x: 0.9, y: 0.9, z: 0.9, duration: 1 }, 2);
      
      // Scene 4: Center low -> Right mid (Pricing)
      tl.to(groupRef.current.position, { x: 4, y: 0, z: -1, duration: 1 }, 3);
      tl.to(groupRef.current.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 1 }, 3);

      // Scene 5: Right mid -> Center dramatic (CTA)
      tl.to(groupRef.current.position, { x: 0, y: 0, z: 4, duration: 1 }, 4);
      tl.to(groupRef.current.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1 }, 4);
    }

    return () => { tl.kill(); };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Slow cinematic rotation of the whole group
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }

    // Morph the inner liquid voice core
    if (orbRef.current) {
      orbRef.current.rotation.x = t * 0.15;
      orbRef.current.rotation.y = t * 0.2;
    }

    // Emulate expanding frequency voice waves
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        // Individual ring animation offsets
        const offset = i * (Math.PI / 2);
        // Pulse scale to simulate voice frequency
        const scale = 1 + Math.sin(t * 2 + offset) * 0.15 + Math.sin(t * 5 + offset * 2) * 0.05;
        ring.scale.set(scale, scale, scale);
        
        // Gentle tilting
        ring.rotation.x = Math.sin(t * 0.5 + i) * 0.1;
        ring.rotation.y = Math.cos(t * 0.7 + i) * 0.1;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        
        {/* Core Liquid Voice Orb */}
        <mesh ref={orbRef} castShadow receiveShadow>
          <sphereGeometry args={[2, 64, 64]} />
          {/* Smooth physical distorted liquid material */}
          <MeshDistortMaterial 
            color="#2a2e2a" // Deep warm olive
            roughness={0.2} 
            metalness={0.8}
            distort={0.4} // Level of distortion
            speed={2} // Speed of morphing
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Ambient interior core light */}
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#ffecd1" transparent opacity={0.15} />
        </mesh>

        {/* Glowing Frequency Rings */}
        <group ref={ringsRef}>
          {[2.4, 3.0, 3.8].map((radius, i) => (
            <mesh 
              key={i} 
              ref={(el) => {
                if (el) ringRefs.current[i] = el;
              }}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[radius, 0.008, 16, 100]} />
              <meshBasicMaterial 
                color="#f3ebd9" 
                transparent 
                opacity={0.5 - (i * 0.15)} // Fade outer rings
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
        
        {/* Subtle light emitting from the visualizer inner core */}
        <pointLight position={[0, 0, 0]} intensity={15} color="#c9a781" distance={6} />

      </Float>
    </group>
  );
}

export default function Experience() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="bg-grid-mat" />
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 35 }} 
        dpr={[1, 2]} 
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#1a1c1a"]} />
        <fog attach="fog" args={["#1a1c1a", 15, 35]} />
        
        {/* Cinematic Studio Lighting */}
        <ambientLight intensity={1.5} />
        <spotLight 
          position={[5, 15, 10]} 
          angle={0.4} 
          penumbra={1} 
          intensity={150} 
          castShadow 
          shadow-bias={-0.0001}
          color="#FFEEDD"
        />
        <spotLight 
          position={[-10, 5, -5]} 
          angle={0.5} 
          penumbra={1} 
          intensity={100} 
          color="#DDEEFF"
        />
        <pointLight position={[0, -5, 5]} intensity={10} color="#a1947a" />

        <SoothingVoiceVisualizer />

        <ContactShadows position={[0, -4, 0]} opacity={0.8} scale={20} blur={3.5} far={10} color="#000000" />
        
        <Environment preset="studio" />
      </Canvas>
      <div className="noise-overlay" />
    </div>
  );
}
