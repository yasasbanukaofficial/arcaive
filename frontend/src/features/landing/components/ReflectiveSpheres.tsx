"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Float, MeshDistortMaterial } from "@react-three/drei";

function Sphere({ position, delay }: { position: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.getElapsedTime() + delay) * 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position} ref={ref}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial color="#fff" speed={2} distort={0.2} radius={1} transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

export default function ReflectiveSpheres() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }} gl={{ alpha: true }}>
        <Sphere position={[-3, 2, -2]} delay={0} />
        <Sphere position={[3, -2, -2]} delay={1} />
        <Sphere position={[0, 3, -4]} delay={2} />
      </Canvas>
    </div>
  );
}
