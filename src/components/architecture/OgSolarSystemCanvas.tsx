"use client";

import type { ReactNode, RefObject } from "react";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Stars, Text } from "@react-three/drei";

const PURPLE = 0x8351ff;
const PURPLE_SOFT = 0xa78bfa;

interface OrbitRigProps {
  radius: number;
  speed: number;
  phase?: number;
  y?: number;
  children: ReactNode;
}

function OrbitRig({ radius, speed, phase = 0, y = 0, children }: OrbitRigProps) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.set(Math.cos(t) * radius, y, Math.sin(t) * radius);
  });
  return <group ref={ref}>{children}</group>;
}

/** Local orbit around parent origin (moons). */
function LocalOrbit({
  radius,
  speed,
  phase = 0,
  tilt = 0,
  children,
}: {
  radius: number;
  speed: number;
  phase?: number;
  tilt?: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.7 + tilt) * radius * 0.35,
      Math.sin(t) * radius
    );
  });
  return <group ref={ref}>{children}</group>;
}

function BinaryCore() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 2.8) * 0.1;
    ref.current.scale.setScalar(s);
    ref.current.rotation.y = clock.elapsedTime * 0.15;
  });

  return (
    <group ref={ref}>
      <mesh position={[-0.38, 0, 0]}>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshStandardMaterial
          color="#120818"
          metalness={0.35}
          roughness={0.35}
          emissive={PURPLE_SOFT}
          emissiveIntensity={2.2}
        />
      </mesh>
      <mesh position={[0.45, 0.08, 0]}>
        <sphereGeometry args={[0.58, 32, 32]} />
        <meshStandardMaterial
          color="#0a0610"
          metalness={0.4}
          roughness={0.3}
          emissive={PURPLE}
          emissiveIntensity={2.8}
        />
      </mesh>
    </group>
  );
}

function MetallicSphere({
  radius,
  color,
  emissive,
  emissiveIntensity = 0.15,
  roughness = 0.22,
}: {
  radius: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
}) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color={color}
        metalness={0.92}
        roughness={roughness}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissive ? emissiveIntensity : 0}
      />
    </mesh>
  );
}

function DataArc({
  from,
  to,
  arch = 1.15,
  phase = 0,
}: {
  from: RefObject<THREE.Group | null>;
  to: RefObject<THREE.Group | null>;
  arch?: number;
  phase?: number;
}) {
  const line = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(48 * 3), 3));
    const mat = new THREE.LineBasicMaterial({
      color: PURPLE,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Line(geo, mat);
  }, []);

  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);
  const mid = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!from.current || !to.current) return;
    from.current.getWorldPosition(a);
    to.current.getWorldPosition(b);
    mid.copy(a).lerp(b, 0.5);
    mid.y += arch + Math.sin(clock.elapsedTime * 2.2 + phase) * 0.12;
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const pts = curve.getPoints(47);
    const posAttr = line.geometry.attributes.position;
    if (!posAttr) return;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < 48; i++) {
      const p = pts[i];
      if (!p) continue;
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    }
    posAttr.needsUpdate = true;
    (line.material as THREE.LineBasicMaterial).opacity =
      0.38 + Math.sin(clock.elapsedTime * 3 + phase) * 0.22;
  });

  return <primitive object={line} />;
}

function AsteroidBelt({ radius, count = 48 }: { radius: number; count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a2530",
        metalness: 0.88,
        roughness: 0.45,
        emissive: "#1a1028",
        emissiveIntensity: 0.08,
      }),
    []
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const r = radius + (Math.random() - 0.5) * 0.55;
      dummy.position.set(Math.cos(ang) * r, (Math.random() - 0.5) * 0.35, Math.sin(ang) * r);
      dummy.scale.setScalar(0.09 + Math.random() * 0.12);
      dummy.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, dummy, radius]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.03;
  });

  return <instancedMesh ref={ref} args={[geo, mat, count]} />;
}

function CinematicCameraRig() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.1;
    // Tighter orbit = larger apparent scale on screen
    const R = 8.2 + Math.sin(clock.elapsedTime * 0.055) * 1.6;
    camera.position.set(Math.cos(t) * R, 4 + Math.sin(clock.elapsedTime * 0.038) * 1.1, Math.sin(t) * R);
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

function SceneContent() {
  const coreRef = useRef<THREE.Group>(null);
  const walletRef = useRef<THREE.Group>(null);
  const evmRef = useRef<THREE.Group>(null);
  const registryRef = useRef<THREE.Group>(null);
  const anchorRef = useRef<THREE.Group>(null);

  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 26, 58]} />

      <ambientLight intensity={0.12} />
      <pointLight position={[0, 2.2, 0]} intensity={3.2} color="#8351ff" distance={36} decay={2} />
      <pointLight position={[-4, 3, 4]} intensity={0.6} color="#c4b5fd" />
      <directionalLight position={[6, 10, 4]} intensity={0.35} color="#e0e0ff" />

      <Stars radius={90} depth={48} count={4200} factor={4} saturation={0} fade speed={0.3} />

      <CinematicCameraRig />

      {/* ── Core hub (binary star + holographic label) ── */}
      <group>
        <group ref={coreRef}>
          <BinaryCore />
        </group>
        <Text
          position={[0, 1.45, 0]}
          fontSize={0.28}
          color="#d8b4fe"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.04}
          outlineColor="#000000"
          outlineOpacity={1}
          maxWidth={8}
        >
          BUILT ON 0G INFRASTRUCTURE
        </Text>
      </group>

      {/* Testnet EVM satellite (tight around hub) */}
      <OrbitRig radius={1.55} speed={0.42} phase={1.2} y={0.2}>
        <group ref={evmRef}>
          <MetallicSphere radius={0.22} color="#1c1c22" emissive="#5b21b6" emissiveIntensity={0.4} />
          <Text position={[0, 0.38, 0]} fontSize={0.13} color="#a78bfa" anchorX="center" outlineWidth={0.025} outlineColor="#000">
            0G Testnet EVM
          </Text>
        </group>
      </OrbitRig>

      {/* Inner planet: Wallet */}
      <OrbitRig radius={3} speed={0.32} phase={0}>
        <group ref={walletRef}>
          <MetallicSphere radius={0.44} color="#141418" emissive="#8351ff" emissiveIntensity={0.22} />
          <Text position={[0, 0.62, 0]} fontSize={0.14} color="#e9d5ff" anchorX="center" outlineWidth={0.028} outlineColor="#000">
            Wallet · wagmi
          </Text>
        </group>
      </OrbitRig>

      {/* AgentRegistry + moons */}
      <OrbitRig radius={4.85} speed={0.17} phase={2.1} y={0}>
        <group ref={registryRef}>
          <MetallicSphere radius={0.58} color="#1a1522" emissive="#6d28d9" emissiveIntensity={0.28} />
          <Text position={[0, 0.78, 0]} fontSize={0.12} color="#ddd6fe" anchorX="center" outlineWidth={0.022} outlineColor="#000">
            AgentRegistry · ERC-721
          </Text>

          <LocalOrbit radius={0.95} speed={0.95} phase={0} tilt={0.3}>
            <MetallicSphere radius={0.2} color="#252530" emissive="#8351ff" emissiveIntensity={0.5} />
            <Text position={[0, 0.32, 0]} fontSize={0.1} color="#c4b5fd" anchorX="center" outlineWidth={0.018} outlineColor="#000">
              0G Compute
            </Text>
            {/* TEE cluster (Phase 2) */}
            <mesh position={[0.26, 0.1, 0.14]}>
              <sphereGeometry args={[0.08, 14, 14]} />
              <meshStandardMaterial
                color="#1e1b24"
                metalness={0.9}
                roughness={0.25}
                emissive="#4c1d95"
                emissiveIntensity={0.55}
              />
            </mesh>
            <mesh position={[-0.18, -0.1, 0.18]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial
                color="#18161c"
                metalness={0.92}
                roughness={0.28}
                emissive="#6b21a8"
                emissiveIntensity={0.45}
              />
            </mesh>
            <Text position={[0.38, 0.22, 0]} fontSize={0.075} color="#a855f7" anchorX="left" outlineWidth={0.014} outlineColor="#000">
              TEE · Phase 2
            </Text>
          </LocalOrbit>

          <LocalOrbit radius={1.35} speed={0.58} phase={1.4} tilt={-0.4}>
            <MetallicSphere radius={0.28} color="#1f1a28" emissive="#7c3aed" emissiveIntensity={0.32} />
            <Text position={[0, 0.42, 0]} fontSize={0.095} color="#c4b5fd" anchorX="center" outlineWidth={0.018} outlineColor="#000">
              0G Storage
            </Text>
            <LocalOrbit radius={0.42} speed={1.4} phase={0.5}>
              <mesh>
                <sphereGeometry args={[0.09, 14, 14]} />
                <meshStandardMaterial color="#252028" metalness={0.9} roughness={0.2} emissive="#8351ff" emissiveIntensity={0.4} />
              </mesh>
              <Text position={[0, 0.18, 0]} fontSize={0.075} color="#d8b4fe" anchorX="center" outlineWidth={0.012} outlineColor="#000">
                KV
              </Text>
            </LocalOrbit>
            <LocalOrbit radius={0.52} speed={-1.1} phase={2}>
              <mesh>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshStandardMaterial color="#201c26" metalness={0.88} roughness={0.22} emissive="#6d28d9" emissiveIntensity={0.35} />
              </mesh>
              <Text position={[0, 0.16, 0]} fontSize={0.07} color="#c4b5fd" anchorX="center" outlineWidth={0.012} outlineColor="#000">
                Log
              </Text>
            </LocalOrbit>
          </LocalOrbit>
        </group>
      </OrbitRig>

      {/* MemoryAnchor gas giant + ring */}
      <OrbitRig radius={8.2} speed={0.09} phase={0.8} y={0}>
        <group ref={anchorRef}>
          <MetallicSphere radius={1.05} color="#1a1220" emissive="#5b21b6" emissiveIntensity={0.2} roughness={0.18} />
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.55, 0.1, 12, 64]} />
            <meshStandardMaterial
              color="#2a1835"
              metalness={0.95}
              roughness={0.32}
              emissive="#8351ff"
              emissiveIntensity={0.14}
            />
          </mesh>
          <Text position={[0, 1.35, 0]} fontSize={0.125} color="#ede9fe" anchorX="center" outlineWidth={0.024} outlineColor="#000">
            MemoryAnchor
          </Text>
        </group>
      </OrbitRig>

      <AsteroidBelt radius={8.05} count={56} />

      {/* Gravitational data arcs */}
      <DataArc from={coreRef} to={walletRef} arch={1.35} phase={0} />
      <DataArc from={walletRef} to={registryRef} arch={1.75} phase={0.7} />
      <DataArc from={registryRef} to={anchorRef} arch={2.1} phase={1.4} />
      <DataArc from={coreRef} to={evmRef} arch={0.75} phase={2.2} />
    </>
  );
}

export default function OgSolarSystemCanvas() {
  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{ position: [7.5, 4.2, 7.5], fov: 38, near: 0.1, far: 100 }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
