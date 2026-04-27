"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, MeshTransmissionMaterial, Environment } from "@react-three/drei";

function AlignmentRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x = t * (0.2 + i * 0.1);
        child.rotation.z = t * (0.1 + i * 0.05);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(4)].map((_, i) => (
        <mesh key={i}>
          <torusGeometry args={[2 + i * 0.5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.3 - i * 0.05} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshTransmissionMaterial
          samples={4}
          thickness={0.5}
          chromaticAberration={0.02}
          color="#ffffff"
          roughness={0.1}
          transmission={1}
        />
      </mesh>
    </group>
  );
}

export default function SymmetricalMatching() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <AlignmentRings />
        </Float>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
