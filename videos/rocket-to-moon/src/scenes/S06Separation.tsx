import React from "react";
import {
  AbsoluteFill,
  Easing,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import {
  CameraRig,
  Earth3D,
  Lights,
  Rocket3D,
  Stage3D,
  STAGE3D,
} from "../three/Toys";
import { Caption, Sfx } from "../components/Caption";
import { Stars } from "../components/Characters";
import { ip } from "../lib/anim";

export const S06_DURATION = 480;

const DROP1 = 80;
const DROP2 = 250;

/** きりはなされた だん が くるくる おちていく */
const Falling: React.FC<{
  frame: number;
  stage: 1 | 2;
  start: number;
  baseY: number;
}> = ({ frame, stage, start, baseY }) => {
  const t = frame - start;
  if (t < 0) {
    return null;
  }
  const s = STAGE3D[stage];
  const cy = s.y0 + s.h / 2;
  const dy = -(t * 0.018 + t * t * 0.0007);
  const dx = t * (stage === 1 ? 0.012 : -0.012);
  const rot = t * 0.03 * (stage === 1 ? 1 : -1);
  return (
    <group position={[dx, baseY + cy + dy, 0]} rotation={[t * 0.01, 0, rot]}>
      <group position={[0, -cy, 0]}>
        <Stage3D stage={stage} />
      </group>
    </group>
  );
};

/** スピード線（2D） */
const SpeedLines: React.FC<{ frame: number; speed: number }> = ({
  frame,
  speed,
}) => {
  const lines = [];
  for (let i = 0; i < 40; i++) {
    const x = random(`sl${i}`) * 1920;
    const len = 80 + random(`sll${i}`) * 220;
    const y =
      ((random(`sly${i}`) * 1400 + frame * speed * (0.6 + random(`slv${i}`))) %
        1400) -
      200;
    lines.push(
      <line
        key={i}
        x1={x}
        y1={y}
        x2={x}
        y2={y + len}
        stroke="#ffffff"
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.35}
      />,
    );
  }
  return <g>{lines}</g>;
};

export const S06Separation: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const stagesLeft: 1 | 2 | 3 = f < DROP1 ? 3 : f < DROP2 ? 2 : 1;
  const flame =
    f < DROP1
      ? ip(f, [DROP1 - 15, DROP1 - 5], [1, 0])
      : f < DROP2
        ? ip(f, [DROP1 + 25, DROP1 + 40], [0, 1]) *
          ip(f, [DROP2 - 15, DROP2 - 5], [1, 0])
        : ip(f, [DROP2 + 25, DROP2 + 40], [0, 1]);

  // かるくなるほど スピードアップ
  const speed = f < DROP1 ? 18 : f < DROP2 ? 28 : 42;
  const baseY =
    -3 +
    ip(f, [DROP1, DROP1 + 60], [0, 0.6]) +
    ip(f, [DROP2, DROP2 + 60], [0, 0.8]);
  const wob = Math.sin(f * 0.07) * 0.03;

  const orbit = ip(f, [0, S06_DURATION], [0.2, 1.1], Easing.inOut(Easing.sin));
  const camPos: [number, number, number] = [
    Math.sin(orbit) * 15,
    1.5,
    Math.cos(orbit) * 15,
  ];

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#05061a, #142060)" }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Stars frame={f} scrollY={f * speed * 0.3} seed="sep" />
        <SpeedLines frame={f} speed={speed} />
      </svg>
      <ThreeCanvas
        width={width}
        height={height}
        style={{ position: "absolute" }}
      >
        <CameraRig position={camPos} lookAt={[0, 1.6, 0]} fov={50} />
        <Lights />
        <Earth3D
          frame={f}
          radius={30}
          position={[0, -46 - f * 0.01, -6]}
          face={false}
        />
        <group rotation={[0, 0, wob]}>
          <Rocket3D
            frame={f}
            stagesLeft={stagesLeft}
            flame={flame}
            position={[0, baseY, 0]}
            rotation={[0, f * 0.01, 0]}
          />
        </group>
        <Falling frame={f} stage={1} start={DROP1} baseY={-3} />
        <Falling frame={f} stage={2} start={DROP2} baseY={-3 + 0.6} />
      </ThreeCanvas>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Sfx
          text="ぽいっ！"
          x={1350}
          y={760}
          start={DROP1 + 10}
          end={DROP1 + 90}
        />
        <Sfx
          text="ぽいっ！"
          x={560}
          y={760}
          start={DROP2 + 10}
          end={DROP2 + 90}
          rotate={8}
        />
      </svg>
      <Caption
        text="からっぽの タンクは すてるよ"
        start={20}
        end={DROP2 - 20}
        position="top"
        size={84}
      />
      <Caption
        text="かるくなって びゅーん！"
        start={DROP2 + 100}
        end={S06_DURATION}
        position="top"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
