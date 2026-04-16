/**
 * WasteIQ — 3D Hero Scene
 * Interactive smart trash bin built from Three.js primitives.
 * Cursor-reactive, with orbiting particles and glow effects.
 */
'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/** Procedural smart trash bin */
function SmartBin() {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Cursor-reactive rotation
    const targetY = mouseRef.current.x * 0.4;
    const targetX = mouseRef.current.y * 0.15;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.02;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.02;

    // Lid breathing
    if (lidRef.current) {
      lidRef.current.rotation.x = Math.sin(t * 0.8) * 0.04;
      lidRef.current.position.y = 1.52 + Math.sin(t * 0.8) * 0.015;
    }

    // Pulsing glow
    if (glowRef.current) {
      glowRef.current.intensity = 3 + Math.sin(t * 2) * 1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, -0.2, 0]} scale={1.15}>
        {/* ── Main Body — dark metallic cylinder ── */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.72, 0.65, 1.5, 48, 1]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.75}
            roughness={0.18}
          />
        </mesh>

        {/* ── Top accent ring ── */}
        <mesh position={[0, 1.36, 0]}>
          <torusGeometry args={[0.73, 0.04, 16, 64]} />
          <meshStandardMaterial
            color="#00C16A"
            metalness={0.9}
            roughness={0.1}
            emissive="#00C16A"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* ── Bottom accent ring ── */}
        <mesh position={[0, -0.16, 0]}>
          <torusGeometry args={[0.66, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#00C16A"
            metalness={0.9}
            roughness={0.1}
            emissive="#00C16A"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* ── Mid accent stripe ── */}
        <mesh position={[0, 0.85, 0]}>
          <torusGeometry args={[0.73, 0.015, 8, 64]} />
          <meshStandardMaterial
            color="#39B8FD"
            emissive="#39B8FD"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* ── Lid ── */}
        <mesh ref={lidRef} position={[0, 1.52, 0]} castShadow>
          <cylinderGeometry args={[0.76, 0.74, 0.12, 48]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.75}
            roughness={0.18}
          />
        </mesh>

        {/* ── Lid handle ── */}
        <mesh position={[0, 1.62, 0]}>
          <boxGeometry args={[0.28, 0.05, 0.08]} />
          <meshStandardMaterial
            color="#00C16A"
            metalness={0.85}
            roughness={0.1}
            emissive="#00C16A"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* ── Recycle symbol on front ── */}
        <mesh position={[0, 0.65, 0.73]} rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[0.16, 0.02, 6, 3]} />
          <meshStandardMaterial
            color="#00C16A"
            emissive="#00C16A"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* ── IoT sensor panel (glass-like) ── */}
        <mesh position={[0, 1.08, 0.72]}>
          <boxGeometry args={[0.22, 0.12, 0.015]} />
          <meshPhysicalMaterial
            color="#88ffcc"
            metalness={0}
            roughness={0}
            transparent
            opacity={0.5}
            transmission={0.6}
          />
        </mesh>

        {/* ── Sensor glow light ── */}
        <pointLight
          ref={glowRef}
          position={[0, 1.08, 0.8]}
          color="#00C16A"
          intensity={3}
          distance={2}
          decay={2}
        />

        {/* ── LED dot 1 ── */}
        <mesh position={[-0.05, 1.1, 0.735]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={3}
          />
        </mesh>

        {/* ── LED dot 2 ── */}
        <mesh position={[0.05, 1.1, 0.735]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial
            color="#39B8FD"
            emissive="#39B8FD"
            emissiveIntensity={3}
          />
        </mesh>

        {/* ── LED dot 3 (status) ── */}
        <mesh position={[0, 1.05, 0.735]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial
            color="#FF8842"
            emissive="#FF8842"
            emissiveIntensity={2}
          />
        </mesh>

        {/* ── Ground shadow disc ── */}
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.4, 48]} />
          <meshStandardMaterial
            color="#000000"
            transparent
            opacity={0.06}
          />
        </mesh>

        {/* ── Orbiting particles ── */}
        <OrbitingParticles />
      </group>
    </Float>
  );
}

/** Glowing particles orbiting the bin */
function OrbitingParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 24;

  const particles = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.1 + Math.random() * 0.6;
      const y = (Math.random() - 0.5) * 2.2;
      const size = 0.015 + Math.random() * 0.02;
      const speed = 0.3 + Math.random() * 0.3;
      const color = ['#00C16A', '#39B8FD', '#FF8842'][Math.floor(Math.random() * 3)];
      items.push({ angle, radius, y, size, speed, color });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(p.angle) * p.radius,
            p.y,
            Math.sin(p.angle) * p.radius,
          ]}
        >
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={2}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Main exported scene */
export default function HeroScene() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '450px' }}>
        <div className="w-16 h-16 rounded-full animate-pulse" style={{ background: 'rgba(0,193,106,0.1)' }} />
      </div>
    );
  }

  return (
    <div className="w-full h-full" style={{ minHeight: '450px' }}>
      <Canvas
        camera={{ position: [0, 0.8, 4.5], fov: 32 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        {/* Ambient fill */}
        <ambientLight intensity={0.5} />

        {/* Key light — from upper right */}
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.5}
          castShadow
          color="#ffffff"
        />

        {/* Fill light — from left, cool tone */}
        <directionalLight
          position={[-3, 3, -3]}
          intensity={0.6}
          color="#b8e0ff"
        />

        {/* Rim light — from behind */}
        <directionalLight
          position={[0, 2, -5]}
          intensity={0.4}
          color="#00C16A"
        />

        {/* Point accent from below */}
        <pointLight
          position={[0, -2, 2]}
          intensity={0.3}
          color="#39B8FD"
          distance={6}
        />

        <SmartBin />
      </Canvas>
    </div>
  );
}
