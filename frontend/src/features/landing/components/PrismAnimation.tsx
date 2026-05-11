"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { MeshDistortMaterial } from "@react-three/drei";

function Prism() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[2, 0]} />
      <MeshDistortMaterial
        color="#fff"
        speed={1}
        distort={0.2}
        radius={1}
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
}

export default function PrismAnimation() {
  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true }}>
        <Prism />
      </Canvas>
    </div>
  );
}
