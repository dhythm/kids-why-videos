import React, { useMemo } from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { CameraRig, Toon } from "../three/Base";
import { Caption, Sfx } from "../components/Caption";
import { ip } from "../lib/anim";

export const S06_DURATION = 660;

const TUBE_R = 3.2;
const RING_GAP = 1.2;
const PER_RING = 14;
const CLOSE_START = 195;
const CLOSE_END = 305;
const ABSORB = 300;
const NUTRIENT_COLORS = ["#ff5d8f", "#ffd23f", "#5ccf6b", "#3a86ff", "#ff9f1c"];

/** カメラの すすみぐあい（ひだを みる ときは ゆっくり） */
function camZ(f: number): number {
  const slow = Math.max(0, Math.min(f, CLOSE_END) - CLOSE_START);
  return -0.13 * f + 0.09 * slow;
}

/** ひだ 1本ぶんの むき（かべ → まんなか） */
function useVillusRotations(): [number, number, number][] {
  return useMemo(() => {
    const out: [number, number, number][] = [];
    for (let j = 0; j < PER_RING * 2; j++) {
      const phi = (j * Math.PI) / PER_RING;
      const inward = new THREE.Vector3(-Math.cos(phi), -Math.sin(phi), 0);
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        inward,
      );
      const e = new THREE.Euler().setFromQuaternion(q);
      out.push([e.x, e.y, e.z]);
    }
    return out;
  }, []);
}

export const S06SmallIntestine: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cz = camZ(f);
  const rots = useVillusRotations();
  const close =
    ip(f, [CLOSE_START - 10, CLOSE_START + 30], [0, 1]) *
    ip(f, [CLOSE_END - 20, CLOSE_END + 15], [1, 0]);

  // ひだ
  const villi = [];
  const kStart = Math.max(0, Math.floor(-(cz + 2) / RING_GAP));
  const kEnd = Math.floor(-(cz - 40) / RING_GAP);
  for (let k = kStart; k <= kEnd; k++) {
    const z = -k * RING_GAP;
    const offset = k % 2;
    for (let j = 0; j < PER_RING; j++) {
      const idx = j * 2 + offset;
      const phi = (idx * Math.PI) / PER_RING;
      const sway = 1 + 0.18 * Math.sin(f * 0.15 + k * 0.7 + j);
      villi.push(
        <group
          key={`${k}-${j}`}
          position={[
            Math.cos(phi) * (TUBE_R - 0.05),
            Math.sin(phi) * (TUBE_R - 0.05),
            z,
          ]}
          rotation={rots[idx]}
        >
          <mesh position={[0, 0.45 * sway, 0]} scale={[1, sway, 1]}>
            <cylinderGeometry args={[0.13, 0.18, 0.9, 10]} />
            <Toon color="#ff8fab" />
          </mesh>
          <mesh position={[0, 0.92 * sway, 0]}>
            <sphereGeometry args={[0.19, 14, 14]} />
            <Toon color="#ff5d8f" />
          </mesh>
        </group>,
      );
    }
  }

  // スープの つぶ
  const soup = [];
  for (let i = 0; i < 40; i++) {
    const ahead = 3 + ((i * 1.9 + f * 0.02) % 30);
    const a = random(`sa${i}`) * Math.PI * 2;
    const r = random(`sr${i}`) * 1.8;
    soup.push(
      <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, cz - ahead]}>
        <icosahedronGeometry args={[0.12 + random(`ss${i}`) * 0.12, 1]} />
        <Toon color="#f6d58e" />
      </mesh>,
    );
  }

  // えいよう（ほし）
  const nutrients = [];
  for (let i = 0; i < 70; i++) {
    const z = -6 - i * 1.3;
    const ahead = cz - z; // カメラの まえに あると プラス
    if (ahead < -3 || ahead > 40) {
      continue;
    }
    const a = random(`na${i}`) * Math.PI * 2;
    // ABSORB いこうに カメラの まえ 12〜4 で かべへ すいこまれる
    const bornAbsorbing = f >= ABSORB;
    const p = bornAbsorbing ? ip(ahead, [4, 12], [1, 0]) : 0;
    const r = 1.1 + p * (TUBE_R - 1.4);
    // カメラの すぐ まえでは ちいさく（がめんいっぱいに ならないように）
    const near = ip(ahead, [1, 4], [0, 1]) * (1 - close * 0.8);
    const s = (1 - p) * near * (1 + 0.2 * Math.sin(f * 0.3 + i));
    if (s <= 0.02) {
      continue;
    }
    nutrients.push(
      <mesh
        key={i}
        position={[Math.cos(a) * r, Math.sin(a) * r, z]}
        scale={s}
        rotation={[f * 0.05, f * 0.07 + i, 0]}
      >
        <octahedronGeometry args={[0.22, 0]} />
        <meshBasicMaterial
          color={NUTRIENT_COLORS[i % NUTRIENT_COLORS.length]}
        />
      </mesh>,
    );
  }

  const camPos: [number, number, number] = [
    1.5 * close + Math.sin(f * 0.02) * 0.4,
    Math.cos(f * 0.017) * 0.4,
    cz,
  ];
  const look: [number, number, number] = [2.6 * close, 0, cz - 6 + close * 2];

  return (
    <AbsoluteFill style={{ background: "#7a1238" }}>
      <ThreeCanvas width={width} height={height}>
        <color attach="background" args={["#7a1238"]} />
        <fog attach="fog" args={["#7a1238", 6, 36]} />
        <CameraRig position={camPos} lookAt={look} fov={60} />
        <ambientLight intensity={1.1} />
        <pointLight
          position={[camPos[0], camPos[1] + 0.5, cz - 1]}
          intensity={40}
          distance={30}
          color="#fff0f3"
        />
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -90]}>
          <cylinderGeometry args={[TUBE_R, TUBE_R, 200, 40, 1, true]} />
          <meshToonMaterial color="#ffb3c6" side={THREE.BackSide} />
        </mesh>
        {villi}
        {soup}
        {nutrients}
      </ThreeCanvas>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Sfx
          text="すいすい〜"
          x={1500}
          y={880}
          start={40}
          end={CLOSE_START - 10}
          size={100}
        />
        <Sfx
          text="ちゅるん！"
          x={420}
          y={300}
          start={ABSORB + 40}
          end={ABSORB + 110}
          size={110}
          color="#ffd23f"
        />
        <Sfx
          text="ちゅるん！"
          x={1500}
          y={760}
          start={ABSORB + 120}
          end={ABSORB + 190}
          size={110}
          color="#5ccf6b"
          rotate={8}
        />
      </svg>
      <Caption
        text="しょうちょう"
        start={20}
        end={CLOSE_START - 10}
        position="top"
        size={100}
      />
      <Caption
        text="ひだ が いっぱい"
        start={CLOSE_START + 5}
        end={ABSORB + 10}
        position="top"
        size={96}
      />
      <Caption
        text="えいようを すいとる！"
        start={ABSORB + 20}
        end={S06_DURATION}
        position="top"
        size={96}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
