import React from "react";
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

export const S03_DURATION = 520;

const GROW = 170;
const DROP = 330;
const IN = 395;

const CLUSTER: [number, number, number] = [-1.8, 0.6, 0];
const BIG: [number, number, number] = [-1.0, 0.1, 0.9];
const FUNNEL: [number, number, number] = [2.4, -0.9, 0];

/** ちいさな きみ たち（ぶどう みたい） */
const SMALL = new Array(13).fill(0).map((_, i) => {
  const a = i * 2.4;
  const rr = 0.6 + random(`yr${i}`) * 0.9;
  return {
    p: [
      CLUSTER[0] + Math.cos(a) * rr * 0.9,
      CLUSTER[1] + Math.sin(a) * rr * 0.8,
      (random(`yz${i}`) - 0.6) * 1.2,
    ] as [number, number, number],
    r: 0.14 + random(`ys${i}`) * 0.3,
  };
});

export const S03Yolk: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const grow = ip(f, [GROW, DROP - 20], [0, 1], Easing.inOut(Easing.quad));
  const bigR = 0.55 + grow * 0.5;

  // ころん → トンネルへ
  const dropT = ip(f, [DROP, IN], [0, 1], Easing.in(Easing.quad));
  const inT = ip(f, [IN, IN + 40], [0, 1], Easing.in(Easing.quad));
  const mouth: [number, number, number] = [
    FUNNEL[0] - 0.6,
    FUNNEL[1] + 0.9,
    0.2,
  ];
  const bx = BIG[0] + (mouth[0] - BIG[0]) * dropT + 0.6 * inT;
  const by =
    BIG[1] +
    (mouth[1] - BIG[1]) * dropT +
    Math.sin(dropT * Math.PI) * 1.2 -
    1.0 * inT;
  const bz = BIG[2] + (mouth[2] - BIG[2]) * dropT;
  const bScale = 1 - inT * 0.5;
  const roll = dropT * -6;
  const gulp =
    f > IN && f < IN + 40 ? 1 + Math.sin(((f - IN) / 40) * Math.PI) * 0.12 : 1;

  const camA = Math.sin(f * 0.01) * 0.25;
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 50%, #fff4f7, #ffc2d4)",
      }}
    >
      <ThreeCanvas width={width} height={height}>
        <CameraRig
          position={[Math.sin(camA) * 10, 0.8, Math.cos(camA) * 10]}
          lookAt={[0, 0, 0]}
          fov={45}
        />
        <Lights />
        {/* くき */}
        <mesh
          position={[CLUSTER[0], CLUSTER[1] + 1.6, -0.3]}
          rotation={[0, 0, 0.2]}
        >
          <cylinderGeometry args={[0.08, 0.12, 1.8, 12]} />
          <Toon color="#ff8fab" />
        </mesh>
        {SMALL.map((b, i) => (
          <mesh
            key={i}
            position={[b.p[0], b.p[1] + Math.sin(f * 0.08 + i) * 0.04, b.p[2]]}
            scale={pop(f, 5 + i * 3, 18) * (1 + grow * 0.35)}
          >
            <sphereGeometry args={[b.r, 24, 24]} />
            <Toon
              color={i % 3 === 0 ? "#ffc93c" : "#ffd966"}
              emissive="#ffb300"
              emissiveIntensity={0.15}
            />
          </mesh>
        ))}
        {/* えいようの つぶ */}
        {f > GROW - 10 && f < DROP
          ? new Array(14).fill(0).map((_, i) => {
              const period = 50;
              const t = ((f + i * 9) % period) / period;
              const sx = 4 + random(`nx${i}`) * 2;
              const sy = (random(`ny${i}`) - 0.5) * 5;
              return (
                <mesh
                  key={`n${i}`}
                  position={[
                    sx + (CLUSTER[0] - sx) * t,
                    sy + (CLUSTER[1] - sy) * t,
                    1 + (random(`nz${i}`) - 0.5),
                  ]}
                  scale={(1 - t) * 0.9 + 0.1}
                >
                  <sphereGeometry args={[0.08, 10, 10]} />
                  <meshBasicMaterial
                    color={["#ff8fab", "#8bd3ff", "#b8f28b"][i % 3]}
                  />
                </mesh>
              );
            })
          : null}
        {/* おおきな きみ */}
        {inT < 1 ? (
          <group position={[bx, by, bz]} scale={bScale * pop(f, 0, 20)}>
            <mesh rotation={[0, 0, roll]}>
              <sphereGeometry args={[bigR, 40, 40]} />
              <Toon
                color="#ffc93c"
                emissive="#ff9f00"
                emissiveIntensity={0.25}
              />
            </mesh>
            <group rotation={[0, 0, roll * 0.1]}>
              <Face3D r={bigR} frame={f} z={bigR * 0.92} />
            </group>
          </group>
        ) : null}
        {/* トンネルの いりぐち（ろうと） */}
        <group
          position={FUNNEL}
          rotation={[0, 0, 0.75]}
          scale={pop(f, DROP - 60, 20) * gulp}
        >
          <mesh>
            <cylinderGeometry args={[1.2, 0.4, 1.6, 40, 1, true]} />
            <meshToonMaterial color="#ff8fab" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -1.8, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 2.2, 24]} />
            <Toon color="#ff8fab" />
          </mesh>
          <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.1, 12, 48]} />
            <Toon color="#ff5d8f" />
          </mesh>
        </group>
      </ThreeCanvas>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Sfx
          text="ぐんぐん"
          x={560}
          y={860}
          start={GROW + 10}
          end={DROP - 5}
          size={110}
        />
        <Sfx
          text="ころん"
          x={1000}
          y={300}
          start={DROP + 10}
          end={IN}
          size={110}
        />
        <Sfx
          text="ぱくっ！"
          x={1500}
          y={320}
          start={IN + 5}
          end={S03_DURATION}
          size={120}
          color="#ff8fab"
        />
      </svg>
      <Caption
        text="ちいさな きみ が いっぱい"
        start={15}
        end={GROW - 5}
        position="top"
        size={88}
      />
      <Caption
        text="だんだん おおきく なる"
        start={GROW + 5}
        end={DROP - 5}
        position="top"
        size={88}
      />
      <Caption
        text="トンネル へ ころん！"
        start={DROP + 5}
        end={S03_DURATION}
        position="top"
        size={88}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
