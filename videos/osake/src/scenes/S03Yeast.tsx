import React from "react";
import {
  AbsoluteFill,
  Easing,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig, Face3D, Lights, Toon } from "../three/Base";
import { Barrel } from "../components/Things";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S03_DURATION = 700;

const ZOOM = 95; // むしめがねで のぞきこむ
const HELLO = 150;
const EAT = 320;
const BITE = 400;
const OUT = 480;

type V3 = [number, number, number];

const YEASTS: { p: V3; r: number }[] = [
  { p: [-3.4, 0.6, 0], r: 0.75 },
  { p: [0, -0.4, 0.6], r: 0.9 },
  { p: [3.3, 0.5, -0.2], r: 0.7 },
  { p: [-1.6, -2.0, 0.3], r: 0.6 },
  { p: [1.9, -2.0, 0.4], r: 0.62 },
];

/** ひとつの こうぼさん（3D） */
const Yeast3D: React.FC<{
  p: V3;
  r: number;
  frame: number;
  i: number;
  chew: number;
  hello: number;
}> = ({ p, r, frame, i, chew, hello }) => {
  const sq = 1 + Math.sin(frame * 0.6 + i) * 0.1 * chew;
  const jump =
    hello * Math.abs(Math.sin((frame - HELLO) * 0.15 + i * 0.4)) * 0.5;
  return (
    <group
      position={[
        p[0],
        p[1] + Math.sin(frame * 0.07 + i * 1.3) * 0.12 + jump,
        p[2],
      ]}
      rotation={[
        0,
        Math.sin(frame * 0.03 + i) * 0.3,
        Math.sin(frame * 0.05 + i) * 0.1,
      ]}
      scale={[sq, 1 / sq, 1]}
    >
      <mesh scale={[1.1, 1, 1]}>
        <sphereGeometry args={[r, 40, 40]} />
        <Toon color="#ffe7a3" emissive="#ffc94d" emissiveIntensity={0.45} />
      </mesh>
      {/* ぽこっと でた め（しゅっが） */}
      <mesh position={[r * 0.8, r * 0.75, -r * 0.1]}>
        <sphereGeometry args={[r * 0.38, 24, 24]} />
        <Toon color="#ffe7a3" emissive="#ffc94d" emissiveIntensity={0.45} />
      </mesh>
      <Face3D r={r} frame={frame + i * 17} z={r * 0.93} />
    </group>
  );
};

export const S03Yeast: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const hello = f >= HELLO && f < HELLO + 60 ? 1 : 0;
  const chew = ip(f, [BITE, BITE + 10, OUT - 10, OUT], [0, 1, 1, 0]);

  // むしめがね（2D の うえに あなを あけて 3D を みせる）
  const lensX = ip(f, [10, ZOOM - 20], [1250, 960], Easing.inOut(Easing.quad));
  const lensY = ip(f, [10, ZOOM - 20], [380, 520], Easing.inOut(Easing.quad));
  const lensR = ip(f, [ZOOM, ZOOM + 45], [150, 1300], Easing.in(Easing.cubic));
  const show2D = f < ZOOM + 46;

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 45%, #f3fff4, #b9ecd0)",
      }}
    >
      <ThreeCanvas width={width} height={height}>
        <CameraRig
          position={[Math.sin(f * 0.004) * 1.2, 0.4, 9]}
          lookAt={[0, -0.4, 0]}
          fov={45}
        />
        <Lights />
        {/* ただよう つぶ */}
        {new Array(24).fill(0).map((_, i) => (
          <mesh
            key={`d${i}`}
            position={[
              (random(`dx${i}`) - 0.5) * 14,
              ((random(`dy${i}`) * 8 + f * 0.004) % 8) - 4,
              -2 - random(`dz${i}`) * 3,
            ]}
          >
            <sphereGeometry args={[0.05 + random(`dr${i}`) * 0.06, 8, 8]} />
            <meshBasicMaterial color="#9fdcb8" />
          </mesh>
        ))}
        {YEASTS.map((y, i) => (
          <Yeast3D
            key={i}
            p={y.p}
            r={y.r}
            frame={f}
            i={i}
            chew={chew}
            hello={hello}
          />
        ))}
        {/* あまい つぶ → こうぼさんへ */}
        {f >= EAT && f < BITE + 20
          ? new Array(10).fill(0).map((_, i) => {
              const y = YEASTS[i % YEASTS.length];
              const sx = (random(`sx${i}`) - 0.5) * 12;
              const t = ip(
                f,
                [EAT + i * 5, BITE + (i % 3) * 4],
                [0, 1],
                Easing.inOut(Easing.quad),
              );
              const gone = ip(
                f,
                [BITE + (i % 3) * 4, BITE + 12 + (i % 3) * 4],
                [1, 0],
              );
              return (
                <mesh
                  key={`s${i}`}
                  position={[
                    sx + (y.p[0] + 0.2 - sx) * t,
                    4.5 + (y.p[1] - 4.5) * t,
                    y.p[2] + 0.6 * t,
                  ]}
                  rotation={[f * 0.05 + i, f * 0.04, 0]}
                  scale={gone * pop(f, EAT + i * 5, 12)}
                >
                  <boxGeometry args={[0.32, 0.32, 0.32]} />
                  <Toon
                    color="#ffb3d1"
                    emissive="#ff8fab"
                    emissiveIntensity={0.2}
                  />
                </mesh>
              );
            })
          : null}
        {/* あわ（しゅわしゅわ） */}
        {f >= OUT
          ? new Array(20).fill(0).map((_, i) => {
              const y = YEASTS[i % YEASTS.length];
              const period = 70;
              const t = ((f - OUT + i * 13) % period) / period;
              const born = f - OUT > (i * 13) % period ? 1 : 0;
              return (
                <mesh
                  key={`b${i}`}
                  position={[
                    y.p[0] + Math.sin(t * 9 + i) * 0.25,
                    y.p[1] + y.r + t * 4.5,
                    y.p[2] + 0.2,
                  ]}
                  scale={born * (0.6 + t * 0.8)}
                >
                  <sphereGeometry args={[0.16, 16, 16]} />
                  <meshToonMaterial
                    color="#e3f6ff"
                    transparent
                    opacity={0.75 * (1 - t * 0.7)}
                  />
                </mesh>
              );
            })
          : null}
        {/* アルコールの つぶ（むらさき） */}
        {f >= OUT + 50
          ? new Array(10).fill(0).map((_, i) => {
              const y = YEASTS[i % YEASTS.length];
              const t = ip(
                f,
                [OUT + 50 + i * 8, OUT + 150 + i * 8],
                [0, 1],
                Easing.out(Easing.quad),
              );
              const dir = i % 2 === 0 ? -1 : 1;
              return (
                <mesh
                  key={`a${i}`}
                  position={[
                    y.p[0] + dir * (y.r + 0.3) * t * 1.6,
                    y.p[1] - 0.2 - t * 0.5,
                    y.p[2] + 0.5,
                  ]}
                  scale={pop(f, OUT + 50 + i * 8, 14)}
                >
                  <sphereGeometry args={[0.17, 16, 16]} />
                  <Toon
                    color="#b388ff"
                    emissive="#7c4dff"
                    emissiveIntensity={0.3}
                  />
                </mesh>
              );
            })
          : null}
      </ThreeCanvas>

      {show2D ? (
        <svg
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", width: "100%", height: "100%" }}
        >
          <defs>
            <mask id="lens-hole">
              <rect width={1920} height={1080} fill="#fff" />
              <circle cx={lensX} cy={lensY} r={lensR} fill="#000" />
            </mask>
          </defs>
          <g mask="url(#lens-hole)">
            <rect width={1920} height={1080} fill="#fff4dc" />
            <rect y={900} width={1920} height={180} fill="#c9844f" />
            <g transform="translate(960 920)">
              <Barrel s={1.1} frame={f} bubbling={1} />
            </g>
          </g>
          {/* むしめがねの わく と え */}
          <g opacity={ip(f, [ZOOM + 10, ZOOM + 30], [1, 0])}>
            <line
              x1={lensX + lensR * 0.7}
              y1={lensY + lensR * 0.7}
              x2={lensX + lensR * 0.7 + 180}
              y2={lensY + lensR * 0.7 + 180}
              stroke="#7a4a2a"
              strokeWidth={42}
              strokeLinecap="round"
            />
            <circle
              cx={lensX}
              cy={lensY}
              r={lensR}
              fill="none"
              stroke="#2b2b4a"
              strokeWidth={28}
            />
            <circle
              cx={lensX}
              cy={lensY}
              r={lensR}
              fill="none"
              stroke="#ffd166"
              strokeWidth={16}
            />
          </g>
        </svg>
      ) : null}

      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Sfx
          text="やっほー！"
          x={1500}
          y={330}
          start={HELLO + 10}
          end={HELLO + 80}
          size={100}
          color="#ffffff"
        />
        <Sfx
          text="ぱくぱく"
          x={500}
          y={880}
          start={BITE}
          end={OUT}
          size={110}
          color="#ff8fab"
        />
        <Sfx
          text="しゅわしゅわ"
          x={1450}
          y={880}
          start={OUT + 10}
          end={S03_DURATION}
          size={100}
          color="#9fe7ff"
          rotate={6}
        />
      </svg>

      <Caption
        text="ひみつの なかま？"
        start={15}
        end={HELLO - 5}
        position="top"
        size={100}
      />
      <Caption
        text="こうぼ さん"
        start={HELLO + 5}
        end={EAT - 5}
        position="top"
        size={110}
        color="#ffe14d"
      />
      <Caption
        text="あまい ところを ぱくぱく"
        start={EAT + 5}
        end={OUT - 5}
        position="top"
        size={92}
      />
      <Caption
        text="あわ と アルコール が でる"
        start={OUT + 5}
        end={S03_DURATION}
        position="top"
        size={92}
      />
    </AbsoluteFill>
  );
};
