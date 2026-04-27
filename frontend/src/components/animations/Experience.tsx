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

import { ThemeProvider, useTheme } from "@/features/dashboard/components/ThemeContext";

type Theme = "light" | "dark";

// ── Machina Robotic Core ──
// A complex mechanical structure with gimbals, lattices, and neural data points.
function MachinaCore({ theme }: { theme: Theme }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const latticeRef = useRef<THREE.Group>(null);

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
      // Scene 1: Center -> Right (Features)
      tl.to(groupRef.current.position, { x: 5, y: -0.5, z: 0, duration: 1 }, 0);
      tl.to(groupRef.current.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 1 }, 0);
      tl.to(groupRef.current.rotation, { y: Math.PI / 4, duration: 1 }, 0);
      
      // Scene 2: Right -> Left (How it Works)
      tl.to(groupRef.current.position, { x: -5, y: 0.5, z: -1, duration: 1 }, 1);
      tl.to(groupRef.current.rotation, { y: -Math.PI / 4, z: Math.PI / 12, duration: 1 }, 1);
      
      // Scene 3: Left -> Center low (Benefits)
      tl.to(groupRef.current.position, { x: 0, y: -2, z: 1, duration: 1 }, 2);
      tl.to(groupRef.current.scale, { x: 0.9, y: 0.9, z: 0.9, duration: 1 }, 2);
      
      // Scene 4: Center low -> Right (Pricing)
      tl.to(groupRef.current.position, { x: 4, y: 0, z: -1, duration: 1 }, 3);
      tl.to(groupRef.current.rotation, { x: Math.PI / 6, duration: 1 }, 3);

      // Scene 5: Right -> Center dramatic (CTA)
      tl.to(groupRef.current.position, { x: 0, y: 0, z: 3, duration: 1 }, 4);
      tl.to(groupRef.current.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 1 }, 4);
    }

    return () => { tl.kill(); };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Core mechanical rotation
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.5;
      coreRef.current.rotation.x = t * 0.3;
    }

    // Inner gimbal rotation
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = -t * 0.4;
      innerRingRef.current.rotation.z = t * 0.2;
    }

    // Outer gimbal rotation (opposite direction)
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -t * 0.2;
      outerRingRef.current.rotation.x = t * 0.15;
    }

    // Lattice (Neural Network) vibration
    if (latticeRef.current) {
      latticeRef.current.rotation.y = t * 0.1;
      const s = 1 + Math.sin(t * 1.5) * 0.05;
      latticeRef.current.scale.set(s, s, s);
    }
  });

  const accentColor = theme === "dark" ? "#ffffff" : "#000000";
  const metalColor = theme === "dark" ? "#222222" : "#dddddd";

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.7}>
        
        {/* 1. CENTRAL PROCESSING CORE */}
        <mesh ref={coreRef} castShadow>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial 
            color={accentColor} 
            emissive={accentColor}
            emissiveIntensity={theme === "dark" ? 1.5 : 0.5}
            roughness={0.1}
            metalness={1}
          />
        </mesh>

        {/* 2. INNER GIMBAL RING */}
        <group ref={innerRingRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2, 0.05, 16, 100]} />
            <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Data Points on inner ring */}
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 2, Math.sin(i * Math.PI / 2) * 2, 0]}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={2} />
            </mesh>
          ))}
        </group>

        {/* 3. OUTER MECHANICAL CAGE */}
        <group ref={outerRingRef}>
          <mesh>
            <torusGeometry args={[3.2, 0.03, 16, 100]} />
            <meshStandardMaterial color={metalColor} roughness={0.2} metalness={1} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[3.2, 0.03, 16, 100]} />
            <meshStandardMaterial color={metalColor} roughness={0.2} metalness={1} />
          </mesh>
        </group>

        {/* 4. NEURAL LATTICE (Wireframe) */}
        <group ref={latticeRef}>
          <mesh>
            <icosahedronGeometry args={[4.5, 1]} />
            <meshStandardMaterial 
              color={accentColor} 
              wireframe 
              transparent 
              opacity={theme === "dark" ? 0.15 : 0.1} 
            />
          </mesh>
          {/* Floating data particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
              ]}
            >
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>

        {/* Core Glow */}
        <pointLight intensity={30} color={accentColor} distance={10} />
        
      </Float>
    </group>
  );
}

export default function Experience() {
  const { theme } = useTheme();
  
  // Define dynamic backdrop values
  const bgColor = theme === "dark" ? "#000000" : "#f8f8f8";
  const fogColor = theme === "dark" ? "#050505" : "#f0ead6";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none transition-colors duration-700">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 35 }} 
        dpr={[1, 2]} 
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[fogColor, 15, 45]} />
        
        <ambientLight intensity={theme === "dark" ? 1.5 : 2} />
        <spotLight 
          position={[5, 15, 10]} 
          angle={0.4} 
          penumbra={1} 
          intensity={theme === "dark" ? 150 : 200} 
          castShadow 
          shadow-bias={-0.0001}
          color={theme === "dark" ? "#FFEEDD" : "#ffffff"}
        />
        <spotLight 
          position={[-10, 5, -5]} 
          angle={0.5} 
          penumbra={1} 
          intensity={theme === "dark" ? 100 : 120} 
          color={theme === "dark" ? "#DDEEFF" : "#f0ead6"}
        />
        <pointLight position={[0, -5, 5]} intensity={10} color={theme === "dark" ? "#a1947a" : "#000000"} />

        <MachinaCore theme={theme} />

        <ContactShadows 
          position={[0, -4, 0]} 
          opacity={theme === "dark" ? 0.8 : 0.15} 
          scale={20} 
          blur={3.5} 
          far={10} 
          color={theme === "dark" ? "#000000" : "#2a2a2a"} 
        />
        
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
