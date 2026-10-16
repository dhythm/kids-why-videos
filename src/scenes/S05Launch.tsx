import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig, Lights, Rocket3D, Smoke3D } from "../three/Toys";
import { Caption, FONT } from "../components/Caption";
import { Cloud, Stars } from "../components/Characters";
import { ip, pop, shake } from "../lib/anim";

export const S05_DURATION = 750;

const COUNT_START = 90;
const COUNT_STEP = 36;
const IGNITE = COUNT_START + COUNT_STEP * 5; // 270
const LIFTOFF = IGNITE + 45; // 315

/** はっしゃ台の やぐら */
const Tower: React.FC = () => (
  <group position={[-2.2, 0, 0]}>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <mesh key={i} position={[0, i + 0.5, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.9]} />
        <meshToonMaterial color="#ff6b6b" />
      </mesh>
    ))}
    {[
      [-0.42, -0.42],
      [0.42, -0.42],
      [-0.42, 0.42],
      [0.42, 0.42],
    ].map(([x, z], i) => (
      <mesh key={`p${i}`} position={[x, 3.5, z]}>
        <boxGeometry args={[0.1, 7, 0.1]} />
        <meshToonMaterial color="#ff6b6b" />
      </mesh>
    ))}
  </group>
);

export const S05Launch: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // たかさ（どんどん かそく）
  const lift = Math.max(0, f - LIFTOFF);
  const altitude = 0.0008 * lift * lift + 0.000002 * lift * lift * lift;
  const flame = f < IGNITE ? 0 : ip(f, [IGNITE, IGNITE + 20], [0.3, 1.1]);
  const [sx, sy] = shake(f, f > IGNITE && f < LIFTOFF + 90 ? 0.08 : 0);

  // カメラ: はじめは ぐるっと まわりこみ、はっしゃ後は ロケットを おいかける
  const orbit =
    ip(f, [0, IGNITE], [-0.6, 0.35], Easing.inOut(Easing.sin)) +
    ip(f, [LIFTOFF, S05_DURATION], [0, 1.2], Easing.inOut(Easing.sin));
  const camDist = ip(f, [0, 90, IGNITE], [16, 13, 11]);
  const followY = altitude + 4.3;
  const camY = 3 + altitude;
  const camPos: [number, number, number] = [
    Math.sin(orbit) * camDist + sx,
    camY + sy - 2 * ip(f, [LIFTOFF, LIFTOFF + 120], [0, 1]),
    Math.cos(orbit) * camDist,
  ];
  const look: [number, number, number] = [0, f < LIFTOFF ? 3 : followY, 0];

  // そら の いろ: あお → こん → くろ
  const skyT = ip(
    f,
    [LIFTOFF + 120, S05_DURATION - 60],
    [0, 1],
    Easing.in(Easing.quad),
  );
  const skyTop = interpolateColors(
    skyT,
    [0, 0.6, 1],
    ["#58b9ff", "#1b2f7a", "#05061a"],
  );
  const skyBottom = interpolateColors(
    skyT,
    [0, 0.6, 1],
    ["#c9ecff", "#3b4fb0", "#0b1240"],
  );

  // カウントダウン
  const countIdx = Math.floor((f - COUNT_START) / COUNT_STEP);
  const countNum = 5 - countIdx;
  const countLocal = (f - COUNT_START) % COUNT_STEP;
  const countScale =
    pop(countLocal, 0, 12) *
    ip(countLocal, [COUNT_STEP - 8, COUNT_STEP], [1, 0]);

  // 雲（カメラが のぼると した へ ながれる）
  const clouds = [
    { x: 300, y: 300, s: 1.2, h: 0 },
    { x: 1600, y: 200, s: 0.9, h: 200 },
    { x: 500, y: -200, s: 1.4, h: 700 },
    { x: 1450, y: -500, s: 1.1, h: 1100 },
    { x: 900, y: -900, s: 1.6, h: 1500 },
    { x: 250, y: -1300, s: 1.0, h: 1900 },
  ];
  const cloudScroll = altitude * 20;

  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(${skyTop}, ${skyBottom})` }}
    >
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Stars frame={f} opacity={skyT} scrollY={cloudScroll * 0.2} />
        {clouds.map((c, i) => (
          <Cloud
            key={i}
            x={c.x + Math.sin(f * 0.01 + i) * 30}
            y={c.y + cloudScroll}
            s={c.s}
            opacity={0.9 * (1 - skyT)}
          />
        ))}
      </svg>
      <ThreeCanvas
        width={width}
        height={height}
        style={{ position: "absolute" }}
      >
        <CameraRig position={camPos} lookAt={look} fov={50} />
        <Lights />
        {/* じめん */}
        <group position={[0, -altitude * 0, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
            <circleGeometry args={[60, 64]} />
            <meshToonMaterial color="#7bd389" />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[2.6, 3, 0.5, 32]} />
            <meshToonMaterial color="#b9c0cf" />
          </mesh>
          <Tower />
          {/* き */}
          {[
            [8, -6],
            [-9, -4],
            [10, 5],
            [-7, 8],
            [5, -12],
            [-12, -10],
          ].map(([x, z], i) => (
            <group key={i} position={[x, 0, z]}>
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 1.2, 8]} />
                <meshToonMaterial color="#8d5a3b" />
              </mesh>
              <mesh position={[0, 1.6, 0]}>
                <sphereGeometry args={[0.9, 16, 16]} />
                <meshToonMaterial color="#3fae5a" />
              </mesh>
            </group>
          ))}
        </group>
        <Rocket3D
          frame={f}
          flame={flame}
          position={[0, altitude + 0.2, 0]}
          rotation={[0, 0.6, 0]}
        />
        <Smoke3D
          sizeMul={0.7}
          life={220}
          frame={f}
          start={IGNITE + 5}
          count={70}
          origin={[0, 0, 0]}
          spread={5}
          rise={0.3}
        />
      </ThreeCanvas>

      {/* カウントダウンの すうじ */}
      {f >= COUNT_START && f < IGNITE ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            paddingRight: 260,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 380,
              color: "#ffe14d",
              WebkitTextStroke: "22px #2b2b4a",
              paintOrder: "stroke fill",
              scale: String(countScale),
              rotate: `${Math.sin(f * 0.2) * 6}deg`,
            }}
          >
            {countNum}
          </div>
        </AbsoluteFill>
      ) : null}
      <Caption
        text="はっしゃ！"
        start={IGNITE + 10}
        end={LIFTOFF + 110}
        position="top"
        align="left"
        size={150}
        color="#ffe14d"
      />
      <Caption
        text="うちゅうへ！"
        start={S05_DURATION - 230}
        end={S05_DURATION}
        position="top"
        align="right"
        size={120}
      />
    </AbsoluteFill>
  );
};
