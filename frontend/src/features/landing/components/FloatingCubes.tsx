"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Float } from "@react-three/drei";

function Cube({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh position={position} ref={mesh}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#000" wireframe />
      </mesh>
    </Float>
  );
}

export default function FloatingCubes() {
  return (
    <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <Cube position={[-2, 1, 0]} />
        <Cube position={[2, -1, 0]} />
        <Cube position={[0, 0, -2]} />
      </Canvas>
    </div>
  );
}
