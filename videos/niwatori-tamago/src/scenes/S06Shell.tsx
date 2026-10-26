import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolateColors,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { CameraRig, Face3D, Lights, Toon } from "../three/Base";
import { Stars } from "../components/Characters";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S06_DURATION = 620;

const SPRINKLE = 30;
const NIGHT = 170;
const MORNING = 430;
const HARD = 500;

/** たまごの かたち（したが ふっくら、うえが すこし とがる） */
function useEggGeometry(): THREE.LatheGeometry {
  return useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 48; i++) {
      const t = (i / 48) * Math.PI;
      const r = Math.sin(t) * 0.95 * (1 + 0.13 * Math.cos(t));
      pts.push(new THREE.Vector2(Math.max(0.0001, r), -Math.cos(t) * 1.25));
    }
    return new THREE.LatheGeometry(pts, 64);
  }, []);
}

export const S06Shell: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const egg = useEggGeometry();
  const shell = ip(f, [SPRINKLE, HARD - 20], [0, 1], Easing.inOut(Easing.quad));
  const night =
    ip(f, [NIGHT - 30, NIGHT + 30], [0, 1]) *
    ip(f, [MORNING - 30, MORNING + 30], [1, 0]);
  const bg = interpolateColors(night, [0, 1], ["#ffe7c7", "#2a2f6b"]);
  const bg2 = interpolateColors(night, [0, 1], ["#ffc9a8", "#151a45"]);
  const knock =
    f > HARD && f < HARD + 40
      ? Math.sin(((f - HARD) / 40) * Math.PI * 4) * 0.04
      : 0;
  const s = pop(f, 0, 20);

  // からの もと（しろい つぶ）
  const grains = [];
  if (f > SPRINKLE && f < HARD - 10) {
    for (let i = 0; i < 26; i++) {
      const period = 55;
      const t = ((f + i * 7) % period) / period;
      const a = random(`ga${i}`) * Math.PI * 2;
      const b = (random(`gb${i}`) - 0.5) * 2.4;
      const R = 3.6 * (1 - t) + 1.05 * t;
      grains.push(
        <mesh
          key={i}
          position={[
            Math.cos(a) * R,
            b * (1 - t) + b * 0.4 * t,
            Math.sin(a) * R,
          ]}
          scale={1 - t * 0.5}
        >
          <octahedronGeometry args={[0.07, 0]} />
          <meshBasicMaterial color={i % 4 === 0 ? "#fff59d" : "#ffffff"} />
        </mesh>,
      );
    }
  }

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${bg}, ${bg2})`,
      }}
    >
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Stars frame={f} count={90} opacity={night} seed="sh" />
        <g transform="translate(1650 200)" opacity={night}>
          <path
            d="M 40 -90 A 95 95 0 1 0 60 80 A 75 75 0 1 1 40 -90 Z"
            fill="#fff59d"
          />
        </g>
        <g
          transform="translate(1650 200)"
          opacity={ip(f, [MORNING, MORNING + 40], [0, 1])}
        >
          {new Array(10).fill(0).map((_, i) => (
            <rect
              key={i}
              x={-7}
              y={-150}
              width={14}
              height={40}
              rx={7}
              fill="#ffd23f"
              transform={`rotate(${i * 36 + f * 0.4})`}
            />
          ))}
          <circle r={95} fill="#ffd23f" />
        </g>
      </svg>
      <ThreeCanvas width={width} height={height}>
        <CameraRig position={[0, 0.6, 7]} lookAt={[0, -0.1, 0]} fov={45} />
        <Lights intensity={1 - night * 0.35} />
        <group scale={s * (1 + knock)} rotation={[0, f * 0.012, 0.12]}>
          {/* なかみ */}
          <mesh position={[0, -0.15, 0]}>
            <sphereGeometry args={[0.55, 32, 32]} />
            <Toon color="#ffc93c" />
          </mesh>
          <group position={[0, -0.15, 0]} rotation={[0, -f * 0.012, 0]}>
            <Face3D r={0.55} frame={f} z={0.52} />
          </group>
          <mesh geometry={egg} scale={0.93} renderOrder={2}>
            <meshToonMaterial
              color="#ffffff"
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </mesh>
          {/* から */}
          <mesh geometry={egg} renderOrder={3}>
            <meshToonMaterial
              color={interpolateColors(shell, [0, 1], ["#e6dcff", "#fff1dc"])}
              emissive="#fff1dc"
              emissiveIntensity={shell * 0.75}
              transparent
              opacity={0.18 + shell * 0.82}
              depthWrite={shell > 0.95}
            />
          </mesh>
        </group>
        {grains}
      </ThreeCanvas>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Sfx
          text="ぱらぱら"
          x={430}
          y={820}
          start={SPRINKLE + 15}
          end={NIGHT}
          size={110}
          color="#ffffff"
        />
        <Sfx
          text="すやすや…"
          x={430}
          y={820}
          start={NIGHT + 40}
          end={MORNING}
          size={100}
          color="#bfe3ff"
        />
        <Sfx
          text="こんこん！"
          x={1450}
          y={820}
          start={HARD}
          end={S06_DURATION}
          size={110}
        />
      </svg>
      <Caption
        text="かたい から を つくるよ"
        start={15}
        end={NIGHT - 5}
        position="top"
        size={92}
      />
      <Caption
        text="よる の あいだ ずーっと"
        start={NIGHT + 5}
        end={HARD - 5}
        position="top"
        size={92}
      />
      <Caption
        text="かちかち！ できた！"
        start={HARD + 5}
        end={S06_DURATION}
        position="top"
        size={96}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
