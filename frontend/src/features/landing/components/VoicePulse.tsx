"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, MeshDistortMaterial } from "@react-three/drei";

function PulseSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(t * 10) * 0.05);
    }
    if (ringsRef.current) {
      ringsRef.current.children.forEach((child, i) => {
        const s = (t * 2 + i * 0.5) % 3;
        child.scale.setScalar(s);
        (child as THREE.Mesh).material.opacity = (3 - s) / 3;
      });
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial color="#fff" speed={5} distort={0.2} radius={1} />
      </mesh>
      <group ref={ringsRef}>
        {[...Array(3)].map((_, i) => (
          <mesh key={i}>
            <ringGeometry args={[1.1, 1.15, 64]} />
            <meshBasicMaterial color="#fff" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function VoicePulse() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          <PulseSphere />
        </Float>
      </Canvas>
    </div>
  );
}
