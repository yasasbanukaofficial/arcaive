"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Float, MeshWobbleMaterial } from "@react-three/drei";

function WobbleSphere() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.z += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} scale={2}>
        <octahedronGeometry args={[1, 0]} />
        <MeshWobbleMaterial color="#000" factor={0.6} speed={2} metalness={0.8} roughness={0.2} wireframe />
      </mesh>
    </Float>
  );
}

export default function PulseSphere() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <WobbleSphere />
      </Canvas>
    </div>
  );
}
