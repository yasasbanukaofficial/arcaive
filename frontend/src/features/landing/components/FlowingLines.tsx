"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Lines() {
  const count = 20;
  const lines = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const points = [];
      for (let i = 0; i < 50; i++) {
        points.push(new THREE.Vector3(i * 0.2 - 5, Math.sin(i * 0.2) * 2, 0));
      }
      return new THREE.CatmullRomCurve3(points);
    });
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x = Math.sin(state.clock.getElapsedTime() + i) * 0.2;
        child.position.y = Math.cos(state.clock.getElapsedTime() + i) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 50, 0.01, 8, false]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export default function FlowingLines() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true }}>
        <Lines />
      </Canvas>
    </div>
  );
}
