"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Line, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

const NODE_COLORS = ["#00e5ff", "#ff9100", "#a855f7", "#10b981", "#00c8f0"];
const RING_COLORS = ["#00e5ff", "#ff9100", "#a855f7"];

type OrbitalSceneProps = {
  lite: boolean;
  reduced: boolean;
};

function GlassCore({ lite }: { lite: boolean }) {
  const segs = lite ? 32 : 64;

  if (lite) {
    return (
      <mesh>
        <sphereGeometry args={[1.28, segs, segs]} />
        <meshPhysicalMaterial
          color="#c5f4ff"
          metalness={0.08}
          roughness={0.12}
          transmission={0.92}
          thickness={0.85}
          ior={1.45}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={0.25}
          iridescenceIOR={1.3}
          attenuationColor="#7ee7ff"
          attenuationDistance={2.2}
          transparent
          envMapIntensity={1.15}
        />
      </mesh>
    );
  }

  return (
    <mesh>
      <sphereGeometry args={[1.28, segs, segs]} />
      <MeshTransmissionMaterial
        backside
        samples={6}
        resolution={256}
        transmission={1}
        thickness={0.55}
        roughness={0.1}
        chromaticAberration={0.035}
        anisotropy={0.12}
        distortion={0.08}
        distortionScale={0.18}
        temporalDistortion={0.06}
        ior={1.42}
        color="#d7fbff"
        attenuationColor="#8aefff"
        attenuationDistance={1.8}
      />
    </mesh>
  );
}

function FresnelShell() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          color: { value: new THREE.Color("#00e5ff") },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(cameraPosition - world.xyz);
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.6);
            gl_FragColor = vec4(color, fresnel * 0.55);
          }
        `,
      }),
    []
  );

  return (
    <mesh scale={1.015}>
      <sphereGeometry args={[1.28, 48, 48]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function Lattice({ lite }: { lite: boolean }) {
  return (
    <mesh>
      <icosahedronGeometry args={[1.18, lite ? 1 : 2]} />
      <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

function Rings({ lite, reduced }: { lite: boolean; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const segs = lite ? 64 : 128;

  useFrame((_, delta) => {
    if (reduced || !group.current) return;
    group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group}>
      {RING_COLORS.map((color, i) => (
        <mesh
          key={color}
          rotation={[
            0.4 + i * 0.55,
            i * 0.7,
            0.2 + i * 0.35,
          ]}
        >
          <torusGeometry args={[1.55 + i * 0.18, 0.008, 8, segs]} />
          <meshBasicMaterial color={color} transparent opacity={0.45} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Nodes({ lite }: { lite: boolean }) {
  const points = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.22, lite ? 0 : 1);
    const attr = geo.getAttribute("position");
    const seen = new Set<string>();
    const out: THREE.Vector3[] = [];
    for (let i = 0; i < attr.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(attr, i);
      const key = `${v.x.toFixed(3)}:${v.y.toFixed(3)}:${v.z.toFixed(3)}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(v);
      }
    }
    geo.dispose();
    return out;
  }, [lite]);

  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[lite ? 0.028 : 0.032, 12, 12]} />
          <meshBasicMaterial
            color={NODE_COLORS[i % NODE_COLORS.length]}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function RingPulse({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const radius = 1.55;

  useFrame(({ clock }) => {
    if (reduced || !ref.current || !glow.current) return;
    const t = clock.elapsedTime * 0.55;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 2) * 0.12;
    ref.current.position.set(x, y, z);
    glow.current.position.copy(ref.current.position);
  });

  return (
    <group rotation={[0.4, 0.2, 0.2]}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#00e5ff" toneMapped={false} />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.22}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function EnergyArcs({ hovered }: { hovered: boolean }) {
  const a = useMemo(
    () => [
      new THREE.Vector3(-1.9, 1.5, 0.4),
      new THREE.Vector3(-0.3, 0.4, 1.35),
      new THREE.Vector3(1.85, -1.35, -0.2),
    ],
    []
  );
  const b = useMemo(
    () => [
      new THREE.Vector3(1.7, 1.45, -0.5),
      new THREE.Vector3(0.15, -0.2, 1.4),
      new THREE.Vector3(-1.75, -1.2, 0.35),
    ],
    []
  );
  const opacity = hovered ? 0.95 : 0.18;

  return (
    <group>
      <Line points={a} color="#ff9100" lineWidth={1.6} transparent opacity={opacity} />
      <Line points={b} color="#a855f7" lineWidth={1.25} transparent opacity={opacity * 0.85} />
    </group>
  );
}

function SceneRig({
  lite,
  reduced,
  hovered,
}: OrbitalSceneProps & { hovered: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    if (!group.current) return;
    pointer.current.lerp(state.pointer, 0.08);

    if (!reduced) {
      group.current.rotation.y += delta * 0.18;
    }

    const tiltX = reduced ? -0.18 : -0.18 + THREE.MathUtils.clamp(pointer.current.y, -1, 1) * 0.22;
    const tiltZ = reduced ? 0.08 : THREE.MathUtils.clamp(-pointer.current.x, -1, 1) * 0.16;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tiltX, 4, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, tiltZ, 4, delta);
  });

  return (
    <group ref={group}>
      <GlassCore lite={lite} />
      {!lite && <FresnelShell />}
      <Lattice lite={lite} />
      <Rings lite={lite} reduced={reduced} />
      <Nodes lite={lite} />
      {!reduced && <RingPulse reduced={reduced} />}
      <EnergyArcs hovered={hovered} />
    </group>
  );
}

function DemandKick() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate]);
  return null;
}

export default function OrbitalScene({ lite, reduced }: OrbitalSceneProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <DemandKick />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3.5, 4]} intensity={18} color="#7af0ff" distance={12} />
      <pointLight position={[-4, -2, 2]} intensity={10} color="#ffb14a" distance={12} />
      <pointLight position={[0, 4, -3]} intensity={8} color="#c084fc" distance={10} />
      <Environment preset="studio" environmentIntensity={0.85} />
      <mesh
        visible={false}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[2.1, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
      <SceneRig lite={lite} reduced={reduced} hovered={hovered} />
    </>
  );
}
