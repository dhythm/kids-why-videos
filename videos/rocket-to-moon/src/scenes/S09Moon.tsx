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
import {
  Astronaut3D,
  CameraRig,
  Earth3D,
  Flag3D,
  Lander3D,
  Lights,
  Moon3D,
  Ship3D,
  Smoke3D,
  StarField3D,
} from "../three/Toys";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

/* =====================================================
 * S09a: つきに とうちゃく（つきを ぐるっと → ちゃくりくきが はなれる）
 * ===================================================== */
export const S09A_DURATION = 300;

export const S09MoonArrive: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const R = 4.4;
  const a = -2.2 + f * 0.012;
  const pos = new THREE.Vector3(Math.cos(a) * R, 0.8, Math.sin(a) * R);
  const vel = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    vel.clone().negate(),
  );
  const e = new THREE.Euler().setFromQuaternion(q);
  const SPLIT = 170;
  // ちゃくりくきが はなれて つきへ おりていく
  const sep = ip(f, [SPLIT, S09A_DURATION], [0, 1], Easing.in(Easing.quad));
  const landerPos = pos
    .clone()
    .add(vel.clone().multiplyScalar(-1.0 - sep * 0.5))
    .multiplyScalar(1 - sep * 0.22);
  const camAng = ip(f, [0, S09A_DURATION], [0.1, 0.7]);
  const zoom = ip(f, [0, S09A_DURATION], [14, 10.5]);
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 45%, #1a2470, #05061a)",
      }}
    >
      <ThreeCanvas width={width} height={height}>
        <CameraRig
          position={[Math.sin(camAng) * zoom, 4, Math.cos(camAng) * zoom]}
          lookAt={[0, 1, 0]}
          fov={45}
        />
        <Lights />
        <StarField3D />
        <Moon3D frame={f} radius={3} />
        <Earth3D frame={f} radius={1} position={[-16, 6, -30]} face={false} />
        <Ship3D
          frame={f}
          position={[pos.x, pos.y, pos.z]}
          rotation={[e.x, e.y, e.z]}
          scale={0.3}
          withLander={f < SPLIT}
        />
        {f >= SPLIT ? (
          <Lander3D
            frame={f}
            position={[landerPos.x, landerPos.y, landerPos.z]}
            scale={0.22}
            flame={0.8}
            legs={ip(f, [SPLIT, SPLIT + 40], [0, 1])}
          />
        ) : null}
      </ThreeCanvas>
      <Caption
        text="つきに ついた！"
        start={20}
        end={SPLIT - 10}
        position="top"
        size={110}
        color="#ffe14d"
      />
      <Caption
        text="ちゃくりくき で おりるよ"
        start={SPLIT + 10}
        end={S09A_DURATION}
        position="top"
        size={90}
      />
    </AbsoluteFill>
  );
};

/* =====================================================
 * S09b: ちゃくりく → ぴょんぴょん → はたを たてる
 * ===================================================== */
export const S09B_DURATION = 720;

const TOUCH = 210;
const OUT = 280; // うちゅうひこうし が でてくる
const HOP_START = 390;
const HOP_LEN = 60;
const HOPS = 3;
const FLAG = HOP_START + HOP_LEN * HOPS + 30; // 600

const MoonGround: React.FC = () => {
  const craters = useMemo(
    () =>
      new Array(26).fill(0).map((_, i) => ({
        x: (random(`gx${i}`) - 0.5) * 70,
        z: -random(`gz${i}`) * 60 + 8,
        r: 0.6 + random(`gr${i}`) * 2.2,
      })),
    [],
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[90, 64]} />
        <meshToonMaterial color="#cfc6a8" />
      </mesh>
      {craters.map((c, i) =>
        Math.hypot(c.x, c.z) < 5 ||
        (c.x > 0 && c.x < 12 && Math.abs(c.z) < 4) ? null : (
          <group key={i} position={[c.x, 0.01, c.z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[c.r, 32]} />
              <meshToonMaterial color="#b3a985" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.35]}>
              <torusGeometry args={[c.r, c.r * 0.15, 8, 32]} />
              <meshToonMaterial color="#ddd5b8" />
            </mesh>
          </group>
        ),
      )}
    </group>
  );
};

/** ジャンプ（ひくい じゅうりょく なので ゆっくり たかく） */
function hopState(f: number): { x: number; y: number; squash: number } {
  const baseX = 2.2;
  if (f < HOP_START) {
    return { x: baseX, y: 0, squash: 1 };
  }
  const idx = Math.min(HOPS - 1, Math.floor((f - HOP_START) / HOP_LEN));
  const t = Math.min(1, (f - HOP_START - idx * HOP_LEN) / HOP_LEN);
  const done = f >= HOP_START + HOP_LEN * HOPS;
  const x = baseX + (done ? HOPS : idx + t) * 2.4;
  const y = done ? 0 : 4 * 2.2 * t * (1 - t);
  const squash = done ? 1 : t < 0.08 || t > 0.92 ? 0.8 : 1.08;
  return { x, y, squash };
}

export const S09Landing: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const landerY = ip(f, [0, TOUCH], [11, 0], Easing.out(Easing.cubic));
  const landerFlame = f < TOUCH ? 1 : ip(f, [TOUCH, TOUCH + 12], [1, 0]);
  const astroIn = ip(f, [OUT, OUT + 50], [0, 1], Easing.out(Easing.back(1.6)));
  const hop = hopState(f);
  const flagUp = ip(
    f,
    [FLAG, FLAG + 30],
    [0.01, 1],
    Easing.out(Easing.back(2)),
  );
  const wave = f > FLAG + 30 ? 1 : 0;

  // カメラ: うえから みおろし → よこ → うちゅうひこうしを おいかける
  const follow = ip(f, [HOP_START - 20, FLAG + 40], [0, 1]);
  const camX = ip(f, [0, TOUCH], [-3, -1]) + hop.x * follow * 0.9;
  const camY = ip(f, [0, TOUCH, OUT], [12, 5, 3.2]);
  const camZ = ip(f, [0, TOUCH, OUT], [16, 13, 11]);
  const lookX =
    hop.x * follow * 0.9 + ip(f, [OUT, OUT + 60], [0, 1.2]) * (1 - follow);
  const lookY = ip(f, [0, TOUCH], [landerY + 2, 1.6]);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#020314, #10164a)" }}>
      <ThreeCanvas width={width} height={height}>
        <CameraRig
          position={[camX, camY, camZ]}
          lookAt={[lookX, f < TOUCH ? landerY + 1.5 : lookY, 0]}
          fov={45}
        />
        <Lights />
        <StarField3D />
        {/* そらに うかぶ ちきゅう */}
        <Earth3D frame={f} radius={3.2} position={[-14, 16, -45]} />
        <MoonGround />
        <Lander3D
          frame={f}
          position={[0, landerY, 0]}
          rotation={[0, 0.4, 0]}
          flame={landerFlame}
          legs={ip(f, [20, 90], [0, 1])}
        />
        <Smoke3D
          life={110}
          frame={f}
          start={TOUCH - 30}
          count={40}
          origin={[0, 0, 0]}
          spread={5}
          seed="dust"
          rise={0.15}
          color="#d9d1b4"
          sizeMul={0.4}
        />
        {f >= OUT ? (
          <Astronaut3D
            frame={f}
            position={[hop.x, hop.y, 0.8]}
            rotation={[
              0,
              f > FLAG ? 0.3 : -0.2,
              f >= HOP_START && f < FLAG - 30 ? -0.25 : 0,
            ]}
            scale={astroIn}
            squash={hop.squash}
            wave={wave}
          />
        ) : null}
        {/* あしあと */}
        {new Array(HOPS).fill(0).map((_, i) =>
          f > HOP_START + HOP_LEN * (i + 1) - 2 ? (
            <mesh
              key={i}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[2.2 + (i + 1) * 2.4, 0.02, 0.8]}
              scale={[1, 0.6, 1]}
            >
              <circleGeometry args={[0.35, 20]} />
              <meshBasicMaterial color="#9c9372" />
            </mesh>
          ) : null,
        )}
        {f >= FLAG ? (
          <Flag3D
            frame={f}
            position={[2.2 + HOPS * 2.4 + 1.1, 0, 0.2]}
            up={flagUp}
          />
        ) : null}
      </ThreeCanvas>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Sfx
          text="ふわっ"
          x={1300}
          y={680}
          start={TOUCH - 10}
          end={TOUCH + 60}
          size={100}
        />
        {new Array(HOPS).fill(0).map((_, i) => (
          <Sfx
            key={i}
            text="ぴょーん"
            x={i % 2 === 0 ? 1400 : 520}
            y={300}
            start={HOP_START + i * HOP_LEN}
            end={HOP_START + i * HOP_LEN + 50}
            size={110}
            rotate={i % 2 === 0 ? -8 : 8}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => {
          const s = pop(f, FLAG + 30 + i * 6, 14);
          return (
            <g
              key={i}
              transform={`translate(${1150 + Math.cos(i * 1.3) * 260} ${380 + Math.sin(i * 1.7) * 140 + Math.sin(f * 0.1 + i) * 12}) scale(${s})`}
            >
              <path
                d="M 0 -30 L 9 -9 L 30 0 L 9 9 L 0 30 L -9 9 L -30 0 L -9 -9 Z"
                fill="#ffe14d"
              />
            </g>
          );
        })}
      </svg>
      <Caption
        text="そーっと そーっと…"
        start={20}
        end={TOUCH - 20}
        position="top"
        size={96}
      />
      <Caption
        text="ちゃくりく！"
        start={TOUCH}
        end={OUT + 30}
        position="top"
        size={130}
        color="#ffe14d"
      />
      <Caption
        text="からだが かるーい！"
        start={HOP_START + 20}
        end={FLAG - 10}
        position="bottom"
        size={96}
      />
      <Caption
        text="やったー！"
        start={FLAG + 30}
        end={S09B_DURATION}
        position="top"
        size={130}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
