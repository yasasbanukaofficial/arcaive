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

// ── Physical AI Agent Core Object ──
function PhysicalCore() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // Scroll-driven animation targeting the group
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    if (groupRef.current) {
      // Scene 1: Center -> Fast right offset + scale down (Features)
      tl.to(groupRef.current.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 1 }, 0);
      tl.to(groupRef.current.position, { x: 5, y: -1, z: 0, duration: 1 }, 0);
      tl.to(groupRef.current.rotation, { x: Math.PI / 6, y: Math.PI / 4, duration: 1 }, 0);

      // Scene 2: Right -> Far left offset + scale (How it Works)
      tl.to(groupRef.current.position, { x: -5, y: 1, z: -2, duration: 1 }, 1);
      tl.to(groupRef.current.rotation, { x: -Math.PI / 8, y: -Math.PI / 2.5, duration: 1 }, 1);

      // Scene 3: Left -> Center low (Benefits)
      tl.to(groupRef.current.position, { x: 0, y: -3, z: 2, duration: 1 }, 2);
      tl.to(groupRef.current.rotation, { x: Math.PI / 2.5, y: 0, duration: 1 }, 2);
      tl.to(groupRef.current.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 1 }, 2);
      
      // Scene 4: Center low -> Right mid (Pricing)
      tl.to(groupRef.current.position, { x: 4, y: 0, z: -1, duration: 1 }, 3);
      tl.to(groupRef.current.rotation, { x: Math.PI / 5, y: -Math.PI / 6, duration: 1 }, 3);
      tl.to(groupRef.current.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 1 }, 3);

      // Scene 5: Right mid -> Center dramatic (CTA)
      tl.to(groupRef.current.position, { x: 0, y: 0, z: 4, duration: 1 }, 4);
      tl.to(groupRef.current.rotation, { x: 0, y: Math.PI * 2, duration: 1 }, 4);
      tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 1 }, 4);
    }

    return () => { tl.kill(); };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      ringRef.current.rotation.y = -t * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* The Main Platen */}
        <mesh ref={coreRef} castShadow receiveShadow>
          <cylinderGeometry args={[2.8, 2.8, 0.4, 64]} />
          <meshPhysicalMaterial 
            color="#222222" // Dark obsidian/graphite
            roughness={0.6}
            metalness={0.4}
            clearcoat={0.3}
            clearcoatRoughness={0.5}
            bumpScale={0.05}
          />
        </mesh>

        {/* Inner carved out area */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <cylinderGeometry args={[2.3, 2.3, 0.25, 64]} />
          <meshPhysicalMaterial 
            color="#141414" // Deep dark core
            roughness={0.9}
            metalness={0.8}
            emissive="#1a1c1a"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Orbiting data rings */}
        <mesh ref={ringRef} position={[0, 0, 0]}>
          <torusGeometry args={[3.2, 0.015, 16, 100]} />
          <meshBasicMaterial color="#d1c4a5" transparent opacity={0.6} />
        </mesh>
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
        <fog attach="fog" args={["#1a1c1a", 15, 30]} />
        
        {/* Cinematic Studio Lighting - Adjusted for dark material */}
        <ambientLight intensity={1.5} />
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.4} 
          penumbra={1} 
          intensity={200} 
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
        <pointLight position={[0, -5, 5]} intensity={30} color="#c9a781" />

        <PhysicalCore />

        <ContactShadows position={[0, -3.5, 0]} opacity={0.9} scale={20} blur={2.5} far={10} color="#000000" />
        
        <Environment preset="studio" />
      </Canvas>
      <div className="noise-overlay" />
    </div>
  );
}
