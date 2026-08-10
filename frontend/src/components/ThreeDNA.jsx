"use client";

/**
 * ============================================================
 * ThreeDNA — 3D DNA Double Helix (React Three Fiber)
 * ============================================================
 * Renders a glowing, slowly rotating DNA double helix in a
 * Three.js canvas. The helix subtly reacts to mouse movements
 * for an interactive, cinematic background effect.
 *
 * Architecture:
 * • Two intertwined sine-wave helices (cyan + purple)
 * • Bridge "rungs" connecting the strands
 * • Emissive materials with bloom-like glow
 * • Mouse-reactive rotation via useFrame + pointer tracking
 */

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/* ── DNA Helix Geometry ──────────────────────────────────────── */
function DNAHelix() {
  const groupRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Track mouse position for reactive rotation
  const { viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    // Base rotation — slow continuous spin
    groupRef.current.rotation.y += 0.003;

    // Mouse-reactive tilt (subtle)
    const targetX = (state.pointer.y * Math.PI) / 12;
    const targetZ = (state.pointer.x * Math.PI) / 12;

    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.z +=
      (targetZ - groupRef.current.rotation.z) * 0.02;
  });

  // ── Generate helix points ────────────────────────────────
  const { strand1, strand2, rungs } = useMemo(() => {
    const s1 = [];
    const s2 = [];
    const r = [];

    const turns = 3;
    const pointsPerTurn = 20;
    const totalPoints = turns * pointsPerTurn;
    const height = 8;
    const radius = 1.2;

    for (let i = 0; i < totalPoints; i++) {
      const t = i / totalPoints;
      const angle = t * turns * Math.PI * 2;
      const y = (t - 0.5) * height;

      // Strand 1 position
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      s1.push([x1, y, z1]);

      // Strand 2 position (180° offset)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      s2.push([x2, y, z2]);

      // Bridge rung every 4th point
      if (i % 4 === 0) {
        r.push({
          start: [x1, y, z1],
          end: [x2, y, z2],
          mid: [(x1 + x2) / 2, y, (z1 + z2) / 2],
        });
      }
    }

    return { strand1: s1, strand2: s2, rungs: r };
  }, []);

  return (
    <group ref={groupRef}>
      {/* ── Strand 1 (Cyan) ────────────────────────────────── */}
      {strand1.map((pos, i) => (
        <mesh key={`s1-${i}`} position={pos}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* ── Strand 2 (Purple) ──────────────────────────────── */}
      {strand2.map((pos, i) => (
        <mesh key={`s2-${i}`} position={pos}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* ── Bridge Rungs ───────────────────────────────────── */}
      {rungs.map((rung, i) => {
        // Calculate rung orientation
        const start = new THREE.Vector3(...rung.start);
        const end = new THREE.Vector3(...rung.end);
        const mid = new THREE.Vector3(...rung.mid);
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();

        // Rotation to align cylinder with rung direction
        const orientation = new THREE.Matrix4();
        orientation.lookAt(start, end, new THREE.Vector3(0, 1, 0));
        const quaternion = new THREE.Quaternion().setFromRotationMatrix(
          orientation
        );

        return (
          <group key={`rung-${i}`}>
            {/* Rung cylinder */}
            <mesh position={[mid.x, mid.y, mid.z]} quaternion={quaternion}>
              <cylinderGeometry args={[0.02, 0.02, length, 6]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.3}
                transparent
                opacity={0.25}
              />
            </mesh>
            {/* Center glow sphere */}
            <mesh position={[mid.x, mid.y, mid.z]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#00f0ff"
                emissiveIntensity={0.5}
                transparent
                opacity={0.4}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ── Main Canvas Component ───────────────────────────────────── */
export default function ThreeDNA({ className = "" }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        {/* ── Lighting ──────────────────────────────────────── */}
        {/* Ambient provides base illumination */}
        <ambientLight intensity={0.15} />

        {/* Cyan directional light from top-right */}
        <directionalLight
          position={[5, 5, 5]}
          color="#00f0ff"
          intensity={0.6}
        />

        {/* Purple directional light from bottom-left */}
        <directionalLight
          position={[-5, -3, -5]}
          color="#a855f7"
          intensity={0.4}
        />

        {/* Point light for dramatic center glow */}
        <pointLight position={[0, 0, 3]} color="#00f0ff" intensity={0.5} />

        {/* ── DNA Helix ─────────────────────────────────────── */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <DNAHelix />
        </Float>
      </Canvas>
    </div>
  );
}
