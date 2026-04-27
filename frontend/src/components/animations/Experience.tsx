"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { 
  MeshDistortMaterial, 
  Float, 
  Environment, 
  Points, 
  PointMaterial, 
  MeshWobbleMaterial,
  Lines,
  MeshTransmissionMaterial
} from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function GlobalController() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const swarmRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1;
      meshRef.current.rotation.z = t * 0.05;
      // Core pulse
      const s = 1 + Math.sin(t * 2) * 0.05;
      meshRef.current.scale.set(s, s, s);
    }
    if (swarmRef.current) {
      swarmRef.current.rotation.y = t * 0.05;
    }
  });

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // JOURNEY:
    // 01: Hero (Center)
    tl.to(groupRef.current!.position, { x: 0, y: 0, z: 0, duration: 1 });
    
    // 02: Features / Voice Agent (Right Side Focus)
    tl.to(groupRef.current!.position, { x: 3, y: -2, z: -1, duration: 1.5 });
    tl.to(meshRef.current!.rotation, { x: Math.PI / 2, duration: 1.5 }, "<");

    // 03: Advantages / CV Precision (Left Side Focus + Morph)
    tl.to(groupRef.current!.position, { x: -3, y: -5, z: -2, duration: 1.5 });
    tl.to(meshRef.current!.scale, { x: 1.8, y: 1.8, z: 1.8, duration: 1.5 }, "<");

    // 04: Stats (Small background pulse)
    tl.to(groupRef.current!.position, { x: 0, y: -8, z: -4, duration: 1.5 });
    tl.to(meshRef.current!.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 1.5 }, "<");

    // 05: Pricing (Stable)
    tl.to(groupRef.current!.position, { x: 2, y: -11, z: -2, duration: 1.5 });

    // 06: CTA (Expansion / Warp)
    tl.to(groupRef.current!.position, { x: 0, y: -16, z: 3, duration: 2 });
    tl.to(meshRef.current!.scale, { x: 8, y: 8, z: 8, duration: 2 }, "<");

  }, []);

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <MeshDistortMaterial
            color="#ffffff"
            speed={2}
            distort={0.4}
            metalness={1}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>

      {/* Persistent Swarm that adapts to position */}
      <group ref={swarmRef}>
        <Swarm count={150} radius={4} />
      </group>

      {/* Decorative Orbits */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function Swarm({ count, radius }: { count: number; radius: number }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.8 + Math.random() * 0.4);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <PointMaterial size={0.05} color="#fff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export default function Experience() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }} dpr={[1, 2]}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} />
        
        <GlobalController />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
