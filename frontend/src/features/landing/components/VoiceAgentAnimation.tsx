"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function WaveRing({ radius, color, delay }: { radius: number; color: string; delay: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useGSAP(() => {
    gsap.to(ringRef.current!.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      duration: 1,
      repeat: -1,
      yoyo: true,
      delay: delay,
      ease: "sine.inOut",
    });
    
    gsap.to(ringRef.current!.material, {
      opacity: 0.1,
      duration: 1,
      repeat: -1,
      yoyo: true,
      delay: delay,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.02, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Bars() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 32;
  
  const bars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 1.5;
      const z = Math.sin(angle) * 1.5;
      return { x, z, angle };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const freq = Math.sin(state.clock.getElapsedTime() * 5 + i * 0.5) * 0.5 + 0.5;
        mesh.scale.y = 0.2 + freq * 1.5;
        mesh.position.y = mesh.scale.y / 2 - 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <mesh key={i} position={[bar.x, 0, bar.z]}>
          <boxGeometry args={[0.05, 1, 0.05]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      ))}
    </group>
  );
}

function Core() {
  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <mesh>
        <sphereGeometry args={[0.6, 64, 64]} />
        <MeshDistortMaterial
          color="#000"
          speed={4}
          distort={0.4}
          radius={1}
        />
      </mesh>
    </Float>
  );
}

export default function VoiceAgentAnimation() {
  return (
    <div className="w-full h-full min-h-[250px]">
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Core />
        <Bars />
        <WaveRing radius={1.8} color="#000" delay={0} />
        <WaveRing radius={2.1} color="#000" delay={0.3} />
        <WaveRing radius={2.4} color="#000" delay={0.6} />
      </Canvas>
    </div>
  );
}
