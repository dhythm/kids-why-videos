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
import { ip } from "../lib/anim";

export const S04_DURATION = 540;

const GATHER = 30;
const SPIN = 230;
const GO = 450;

/** トンネルの なかを すすむ きみに、しろみが くっつく */
export const S04White: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const white = ip(f, [GATHER, GO - 20], [0, 1], Easing.inOut(Easing.quad));
  const spin = ip(f, [SPIN, GO], [0, 1]);
  const spinAngle =
    (f - SPIN) * 0.12 * (f > SPIN ? 1 : 0) * (1 - Math.max(0, spin - 0.9) * 5);
  const enterX = ip(f, [0, 30], [-7, 0], Easing.out(Easing.quad));
  const goX = ip(f, [GO, S04_DURATION], [0, 8], Easing.in(Easing.quad));
  const ex = enterX + goX;

  // かべの わっか（すすんでいる かんじ）
  const rings = [];
  for (let i = 0; i < 9; i++) {
    const x = ((((i * 2.2 - f * 0.05) % 19.8) + 19.8) % 19.8) - 9.9;
    rings.push(
      <mesh key={i} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.75, 0.12, 12, 60]} />
        <meshToonMaterial color="#ff8fab" transparent opacity={0.6} />
      </mesh>,
    );
  }

  // かべから とんでくる しろみの つぶ
  const blobs = [];
  if (f > GATHER && f < GO - 10) {
    for (let i = 0; i < 16; i++) {
      const period = 60;
      const t = ((f + i * 11) % period) / period;
      const a = random(`wa${i}`) * Math.PI * 2;
      const sx = (random(`wx${i}`) - 0.5) * 6;
      blobs.push(
        <mesh
          key={i}
          position={[
            ex + sx * (1 - t),
            Math.cos(a) * 2.5 * (1 - t),
            Math.sin(a) * 2.5 * (1 - t),
          ]}
          scale={0.6 + 0.4 * (1 - t)}
        >
          <sphereGeometry args={[0.22, 14, 14]} />
          <meshToonMaterial
            color="#ffffff"
            transparent
            opacity={0.8 * (1 - t * 0.6)}
          />
        </mesh>,
      );
    }
  }

  const k = white;
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 50%, #ffe3ec, #ff9ebb)",
      }}
    >
      <ThreeCanvas width={width} height={height}>
        <CameraRig position={[0, 1.2, 10]} lookAt={[0, 0, 0]} fov={45} />
        <Lights />
        {/* トンネルの かべ */}
        <mesh rotation={[0, 0, Math.PI / 2]} renderOrder={1}>
          <cylinderGeometry args={[2.8, 2.8, 22, 48, 1, true]} />
          <meshToonMaterial
            color="#c2185b"
            transparent
            opacity={0.22}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
        {rings}
        {blobs}
        <group position={[ex, Math.sin(f * 0.07) * 0.08, 0]}>
          {/* しろみ */}
          {k > 0.01 ? (
            <mesh
              scale={[1.0 + k * 1.1, 1.0 + k * 0.55, 1.0 + k * 0.55]}
              renderOrder={3}
            >
              <sphereGeometry args={[1, 40, 40]} />
              <meshToonMaterial
                color="#ffffff"
                transparent
                opacity={0.25 + k * 0.3}
                depthWrite={false}
              />
            </mesh>
          ) : null}
          {/* くるくる まわる きみ */}
          <group rotation={[spinAngle, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.9, 40, 40]} />
              <Toon color="#ffc93c" />
            </mesh>
            <Face3D r={0.9} frame={f} z={0.84} />
            {/* ひも（カラザ） */}
            {spin > 0
              ? [-1, 1].map((d) => (
                  <mesh
                    key={d}
                    position={[d * (0.9 + spin * 0.5), 0, 0]}
                    rotation={[0, 0, Math.PI / 2]}
                    scale={[1, spin, 1]}
                  >
                    <cylinderGeometry args={[0.1, 0.16, 1, 10]} />
                    <Toon color="#fff7e0" />
                  </mesh>
                ))
              : null}
          </group>
        </group>
      </ThreeCanvas>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Sfx
          text="ぺたぺた"
          x={1500}
          y={850}
          start={GATHER + 20}
          end={SPIN - 5}
          size={110}
          color="#ffffff"
        />
        <Sfx
          text="くるくる〜"
          x={1480}
          y={850}
          start={SPIN + 10}
          end={GO}
          size={110}
        />
      </svg>
      <Caption
        text="しろみ が くっつくよ"
        start={GATHER}
        end={SPIN - 5}
        position="top"
        size={92}
      />
      <Caption
        text="くるくる まわって ふえる"
        start={SPIN + 5}
        end={S04_DURATION}
        position="top"
        size={88}
      />
    </AbsoluteFill>
  );
};
