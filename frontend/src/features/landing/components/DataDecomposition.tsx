"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, MeshTransmissionMaterial, Environment } from "@react-three/drei";

function DeconstructingPlates() {
  const groupRef = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.2;
    }
    if (scanRef.current) {
      scanRef.current.position.y = Math.sin(t * 2) * 1.5;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, i * 0.4 - 0.8, 0]}>
          <boxGeometry args={[2, 0.05, 2.5]} />
          <MeshTransmissionMaterial
            samples={4}
            thickness={0.1}
            chromaticAberration={0.02}
            color="#ffffff"
            roughness={0.1}
            transmission={1}
          />
        </mesh>
      ))}

      {/* Scanning Beam */}
      <mesh ref={scanRef}>
        <boxGeometry args={[2.2, 0.02, 2.7]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.5} />
        <pointLight intensity={2} distance={2} color="#fff" />
      </mesh>
    </group>
  );
}

export default function DataDecomposition() {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} intensity={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <DeconstructingPlates />
        </Float>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
