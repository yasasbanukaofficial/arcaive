"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Grid() {
  const lineRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 2;
    }
  });

  return (
    <group rotation={[Math.PI / -6, Math.PI / 4, 0]}>
      <gridHelper args={[10, 20, "#fff", "#222"]} />
      <mesh ref={lineRef}>
        <boxGeometry args={[10, 0.02, 10]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default function ScanningGrid() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true }}>
        <Grid />
      </Canvas>
    </div>
  );
}
