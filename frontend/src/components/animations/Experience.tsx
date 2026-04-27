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

import { MeshTransmissionMaterial } from "@react-three/drei";

// ── Voice AI Physical Aperture Object ──
// Emulating a high-end physical robotic eye / microphone membrane
function VoiceApertureCore() {
  const groupRef = useRef<THREE.Group>(null);
  const lensRef = useRef<THREE.Mesh>(null);
  const irisRef = useRef<THREE.Mesh>(null);
  const bafflesRef = useRef<THREE.Group>(null);

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
      tl.to(groupRef.current.scale, { x: 0.65, y: 0.65, z: 0.65, duration: 1 }, 0);
      tl.to(groupRef.current.position, { x: 5, y: -1, z: 0, duration: 1 }, 0);
      tl.to(groupRef.current.rotation, { x: Math.PI / 4, y: Math.PI / 6, duration: 1 }, 0);

      // Scene 2: Right -> Far left offset + scale (How it Works)
      tl.to(groupRef.current.position, { x: -5, y: 1, z: -2, duration: 1 }, 1);
      tl.to(groupRef.current.rotation, { x: -Math.PI / 6, y: -Math.PI / 4, duration: 1 }, 1);

      // Scene 3: Left -> Center low (Benefits)
      tl.to(groupRef.current.position, { x: 0, y: -3, z: 2, duration: 1 }, 2);
      tl.to(groupRef.current.rotation, { x: Math.PI / 3, y: 0, duration: 1 }, 2);
      tl.to(groupRef.current.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 1 }, 2);
      
      // Scene 4: Center low -> Right mid (Pricing)
      tl.to(groupRef.current.position, { x: 4, y: 0, z: -1, duration: 1 }, 3);
      tl.to(groupRef.current.rotation, { x: Math.PI / 6, y: -Math.PI / 4, duration: 1 }, 3);
      tl.to(groupRef.current.scale, { x: 0.55, y: 0.55, z: 0.55, duration: 1 }, 3);

      // Scene 5: Right mid -> Center dramatic (CTA)
      tl.to(groupRef.current.position, { x: 0, y: 0, z: 4, duration: 1 }, 4);
      tl.to(groupRef.current.rotation, { x: 0, y: Math.PI * 2, duration: 1 }, 4);
      tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 1 }, 4);
    }

    return () => { tl.kill(); };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lensRef.current) {
      lensRef.current.rotation.y = t * 0.05;
      lensRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
    }
    if (irisRef.current) {
      // Voice pulsing effect on the inner iris
      const pulse = 1 + Math.sin(t * 6) * 0.05 + Math.sin(t * 12) * 0.02;
      irisRef.current.scale.set(pulse, pulse, pulse);
      irisRef.current.rotation.z = -t * 0.5;
    }
    if (bafflesRef.current) {
      bafflesRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        
        {/* Outer Acoustic Housing */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[3, 3.2, 1, 64]} />
          <meshPhysicalMaterial 
            color="#111111" // Matte acoustic dark metal
            roughness={0.8}
            metalness={0.6}
            clearcoat={0.1}
          />
        </mesh>

        {/* Acoustic Baffles / Membrane rings */}
        <group ref={bafflesRef} position={[0, 0.4, 0]}>
          {[2.6, 2.2, 1.8].map((radius, i) => (
            <mesh key={i} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.04, 16, 64]} />
              <meshPhysicalMaterial color="#333" roughness={0.9} metalness={0.2} />
            </mesh>
          ))}
        </group>

        {/* The Glass Retinal Lens */}
        <mesh ref={lensRef} position={[0, 0.5, 0]}>
          <sphereGeometry args={[2.5, 64, 64, 0, Math.PI * 2, 0, Math.PI / 3]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#DDEEFF"
            transmission={1}
            roughness={0}
          />
        </mesh>

        {/* Inner Glowing Iris / Voice Synthesizer Core */}
        <mesh ref={irisRef} position={[0, -0.1, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshPhysicalMaterial 
            color="#FFEEDD"
            emissive="#c9a781"
            emissiveIntensity={2}
            roughness={0.2}
            metalness={1}
          />
        </mesh>
        
        {/* Core Light source emitting from the iris */}
        <pointLight position={[0, 0.5, 0]} intensity={20} color="#ffddaa" distance={5} />

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
        <fog attach="fog" args={["#1a1c1a", 15, 40]} />
        
        {/* Cinematic Studio Lighting */}
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
        <pointLight position={[0, -5, 5]} intensity={10} color="#c9a781" />

        <VoiceApertureCore />

        <ContactShadows position={[0, -3.5, 0]} opacity={0.9} scale={20} blur={2.5} far={10} color="#000000" />
        
        <Environment preset="studio" />
      </Canvas>
      <div className="noise-overlay" />
    </div>
  );
}
