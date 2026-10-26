import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { CameraRig, Face3D, Lights, Toon } from "../three/Base";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S05_DURATION = 580;

const ENTER = 15;
const GERM_IN = 215;
const ZAP = 275;
const SOUP = 360;
const INLET: [number, number, number] = [-2.3, 2.0, 0];

/** ぐにゅぐにゅ うごく いぶくろの かたち */
function useStomachGeometry(f: number): THREE.BufferGeometry {
  return useMemo(() => {
    const g = new THREE.SphereGeometry(2.4, 72, 54);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = v.clone().normalize();
      const ang = Math.atan2(n.y, n.x);
      const wob =
        1 +
        0.07 * Math.sin(3 * ang - f * 0.16) +
        0.04 * Math.sin(2 * n.z * 3 + f * 0.21);
      v.multiplyScalar(wob);
      v.x *= 1.35;
      v.y = v.y * 1.0 - 0.08 * v.x * v.x + 0.15 * v.x;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }, [f]);
}

const Germ3D: React.FC<{
  position: [number, number, number];
  scale: number;
  spin: number;
}> = ({ position, scale, spin }) => (
  <group position={position} scale={scale} rotation={[spin, spin * 1.3, 0]}>
    <mesh>
      <icosahedronGeometry args={[0.38, 0]} />
      <meshToonMaterial color="#9d4edd" />
    </mesh>
    {[-1, 1].map((d) => (
      <mesh key={d} position={[d * 0.12, 0.06, 0.33]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshBasicMaterial color="#2b2b4a" />
      </mesh>
    ))}
  </group>
);

export const S05Stomach: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const geo = useStomachGeometry(f);
  const soup = ip(f, [SOUP, SOUP + 170], [0, 1], Easing.inOut(Easing.quad));

  // はいってくる たべもの
  const enterT = ip(f, [ENTER, ENTER + 45], [0, 1], Easing.out(Easing.quad));
  const foods = [];
  for (let i = 0; i < 9; i++) {
    const th = i * 0.7 + f * 0.05;
    const orbit: [number, number, number] = [
      1.5 * Math.cos(th),
      0.5 * Math.sin(th * 1.3) - 0.3,
      0.9 * Math.sin(th),
    ];
    const p: [number, number, number] = [
      INLET[0] + (orbit[0] - INLET[0]) * enterT,
      INLET[1] + (orbit[1] - INLET[1]) * enterT,
      orbit[2] * enterT,
    ];
    const s = (1 - soup) * (0.8 + 0.2 * Math.sin(f * 0.2 + i));
    if (s > 0.02) {
      foods.push(
        <mesh key={i} position={p} scale={s}>
          <icosahedronGeometry args={[0.32, 1]} />
          <Toon
            color={
              i % 3 === 0 ? "#fff3c4" : i % 3 === 1 ? "#ffe0a3" : "#ffffff"
            }
          />
        </mesh>,
      );
    }
  }

  // すっぱい いえきの あわ
  const bubbles = [];
  for (let i = 0; i < 18; i++) {
    const period = 70 + random(`bp${i}`) * 40;
    const t = ((f + random(`bo${i}`) * period) % period) / period;
    bubbles.push(
      <mesh
        key={i}
        position={[
          (random(`bx${i}`) - 0.5) * 4.6,
          -1.6 + t * 2.8,
          (random(`bz${i}`) - 0.5) * 2,
        ]}
        scale={0.6 + t * 0.6}
      >
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshToonMaterial color="#d4f05a" transparent opacity={0.9 * (1 - t)} />
      </mesh>,
    );
  }

  // ばいきん
  const germs = [];
  for (let i = 0; i < 3; i++) {
    const inT = ip(
      f,
      [GERM_IN + i * 10, GERM_IN + 40 + i * 10],
      [0, 1],
      Easing.out(Easing.quad),
    );
    const target: [number, number, number] = [-1 + i * 1.0, 0.6 - i * 0.3, 0.7];
    const zapT = ip(f, [ZAP + i * 8, ZAP + 25 + i * 8], [0, 1]);
    if (f < GERM_IN + i * 10 || zapT >= 1) {
      continue;
    }
    germs.push(
      <Germ3D
        key={i}
        position={[
          INLET[0] + (target[0] - INLET[0]) * inT,
          INLET[1] + (target[1] - INLET[1]) * inT + zapT,
          target[2],
        ]}
        scale={(1 - zapT) * (1 + Math.sin(f * 0.3) * 0.05)}
        spin={zapT * 8 + Math.sin(f * 0.1 + i) * 0.3}
      />,
    );
    if (zapT > 0) {
      germs.push(
        <mesh key={`z${i}`} position={target} scale={0.3 + zapT * 1.4}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial
            color="#fff59d"
            transparent
            opacity={(1 - zapT) * 0.8}
          />
        </mesh>,
      );
    }
  }

  const camA = Math.sin(f * 0.008) * 0.35;
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 50%, #ffe0e9, #ffb3c6)",
      }}
    >
      <ThreeCanvas width={width} height={height}>
        <CameraRig
          position={[Math.sin(camA) * 10, 0.6, Math.cos(camA) * 10]}
          lookAt={[0, 0, 0]}
          fov={45}
        />
        <Lights />
        {/* しょくどう と しょうちょうへの でぐち */}
        <mesh position={[-2.9, 3.0, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.45, 0.45, 2.2, 24]} />
          <Toon color="#ff8fab" />
        </mesh>
        <mesh position={[3.4, -1.0, 0]} rotation={[0, 0, 1.2]}>
          <cylinderGeometry args={[0.4, 0.4, 1.8, 24]} />
          <Toon color="#ffb627" />
        </mesh>
        {foods}
        {soup > 0 ? (
          <mesh
            position={[0.1, -0.5 + soup * 0.2, 0]}
            scale={[
              1.9 * soup,
              1.1 * soup * (1 + Math.sin(f * 0.2) * 0.05),
              1.3 * soup,
            ]}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <Toon color="#f6d58e" />
          </mesh>
        ) : null}
        {bubbles}
        {germs}
        <mesh geometry={geo} renderOrder={2}>
          <meshToonMaterial
            color="#ff6f91"
            transparent
            opacity={0.42}
            depthWrite={false}
          />
        </mesh>
        <mesh geometry={geo} renderOrder={1}>
          <meshToonMaterial
            color="#c2185b"
            transparent
            opacity={0.25}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
        <group position={[0, 0.9, 0]} scale={pop(f, 0, 20)}>
          <Face3D r={1.6} frame={f} z={2.5} />
        </group>
      </ThreeCanvas>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Sfx
          text="ぐにゅぐにゅ"
          x={1480}
          y={880}
          start={40}
          end={GERM_IN - 10}
          size={100}
        />
        <Sfx
          text="やっつけた！"
          x={1450}
          y={250}
          start={ZAP + 10}
          end={SOUP - 5}
          size={110}
          color="#d4f05a"
        />
        <Sfx
          text="どろどろ〜"
          x={1450}
          y={880}
          start={SOUP + 60}
          end={S05_DURATION}
          size={110}
          color="#f6d58e"
        />
      </svg>
      <Caption
        text="いぶくろ で まぜまぜ"
        start={20}
        end={GERM_IN - 10}
        position="top"
        size={92}
      />
      <Caption
        text="すっぱい いえき"
        start={GERM_IN}
        end={SOUP - 10}
        position="top"
        size={92}
      />
      <Caption
        text="スープみたいに なる"
        start={SOUP}
        end={S05_DURATION}
        position="top"
        size={92}
      />
    </AbsoluteFill>
  );
};
