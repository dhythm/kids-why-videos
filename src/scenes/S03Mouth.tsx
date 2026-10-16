import React from "react";
import {
  AbsoluteFill,
  Easing,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig, Lights, Toon } from "../three/Base";
import { Caption, Sfx } from "../components/Caption";
import { ip } from "../lib/anim";

export const S03_DURATION = 470;

const CHOMP0 = 40;
const CHOMP_EVERY = 30;
const CHOMPS = 8;
const SALIVA = 185;
const GATHER = 370;
const SWALLOW = 400;
const PIECES = [1, 2, 4, 7, 11, 15, 19, 24, 28];
const R = 2.3;

function jawOpen(f: number): number {
  const last = CHOMP0 + CHOMP_EVERY * (CHOMPS - 1);
  if (f < CHOMP0 - 15) {
    return 1;
  }
  if (f < CHOMP0) {
    return ip(f, [CHOMP0 - 15, CHOMP0], [1, 0]);
  }
  if (f <= last) {
    return 0.5 - 0.5 * Math.cos((2 * Math.PI * (f - CHOMP0)) / CHOMP_EVERY);
  }
  return ip(f, [last, last + 20], [0, 0.85], Easing.out(Easing.quad));
}

const TeethRow: React.FC<{ y: number; upper: boolean }> = ({ y, upper }) => {
  const arc = 2.6;
  return (
    <group position={[0, y, 0]}>
      <group rotation={[0, arc / 2 - Math.PI / 2, 0]}>
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, upper ? 0.35 : -0.35, 0]}
        >
          <torusGeometry args={[R, 0.32, 14, 40, arc]} />
          <Toon color="#ff8fab" />
        </mesh>
      </group>
      {new Array(10).fill(0).map((_, i) => {
        const a = -1.2 + (2.4 * i) / 9;
        return (
          <mesh
            key={i}
            position={[-R * Math.sin(a), 0, R * Math.cos(a)]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.52, 0.62, 0.38]} />
            <Toon color="#ffffff" />
          </mesh>
        );
      })}
    </group>
  );
};

export const S03Mouth: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const open = jawOpen(f);
  const upperY = 0.55 + open * 0.55;
  const lowerY = -0.55 - open * 0.45;
  const chompsDone = Math.max(
    0,
    Math.min(CHOMPS, Math.floor((f - CHOMP0) / CHOMP_EVERY) + 1),
  );
  const count = PIECES[chompsDone];
  const sinceChomp = f - (CHOMP0 + (chompsDone - 1) * CHOMP_EVERY);
  const bounce = chompsDone > 0 ? Math.exp(-sinceChomp / 7) * 0.5 : 0;
  const soft = ip(f, [SALIVA, SALIVA + 150], [0, 1]);
  const gather = ip(f, [GATHER, SWALLOW], [0, 1], Easing.inOut(Easing.quad));
  const swallow = ip(
    f,
    [SWALLOW, SWALLOW + 40],
    [0, 1],
    Easing.in(Easing.quad),
  );

  const pieces = [];
  if (count === 1) {
    pieces.push(
      <group
        key="oni"
        position={[0, -0.25 + bounce * 0.3, 0.6]}
        rotation={[0, 0.3, 0]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 0.55, 3]} />
          <Toon color="#ffffff" />
        </mesh>
        <mesh position={[0, -0.32, 0.29]}>
          <boxGeometry args={[0.8, 0.35, 0.05]} />
          <Toon color="#2d4a3e" />
        </mesh>
      </group>,
    );
  } else {
    const r = 0.55 / Math.pow(count, 0.42);
    for (let i = 0; i < count; i++) {
      const bx = (random(`px${i}`) - 0.5) * 2.4;
      const bz = random(`pz${i}`) * 1.4 - 0.2;
      const jump = bounce * (0.6 + random(`pj${i}`));
      const x = bx * (1 - gather);
      const z = bz * (1 - gather) + 0.4 * gather;
      const y = -0.42 + jump + Math.sin(f * 0.2 + i) * 0.02;
      const s = 1 + soft * 0.2 * Math.sin(f * 0.3 + i);
      pieces.push(
        <mesh key={i} position={[x, y, z]} scale={[s, 2 - s, s]}>
          <icosahedronGeometry args={[r * (1 - gather * 0.6), 1]} />
          <Toon color={soft > 0.5 ? "#fff3c4" : "#ffffff"} />
        </mesh>,
      );
    }
  }

  const drops = [];
  if (f >= SALIVA && f < GATHER) {
    for (let i = 0; i < 10; i++) {
      const period = 40;
      const t = ((f - SALIVA + i * 9) % period) / period;
      drops.push(
        <mesh
          key={i}
          position={[
            (random(`dx${i}`) - 0.5) * 2.6,
            1.0 - t * 1.6,
            random(`dz${i}`) * 1.2,
          ]}
          scale={[1, 1.3, 1]}
        >
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshToonMaterial color="#9fe0ff" transparent opacity={0.85} />
        </mesh>,
      );
    }
  }

  const camZ =
    ip(f, [0, 60], [8.5, 6.6], Easing.out(Easing.cubic)) - swallow * 1.5;

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 50%, #7a1238, #3a0618)",
      }}
    >
      <ThreeCanvas width={width} height={height}>
        <CameraRig
          position={[Math.sin(f * 0.01) * 0.5, 1.3, camZ]}
          lookAt={[0, -0.1, 0]}
          fov={45}
        />
        <Lights />
        <pointLight
          position={[0, 1, 3]}
          intensity={15}
          distance={10}
          color="#ffe0e8"
        />
        {/* したと した */}
        <mesh position={[0, lowerY - 0.2, -0.2]} scale={[1.7, 0.32, 1.4]}>
          <sphereGeometry args={[1, 32, 32]} />
          <Toon color="#ff7096" />
        </mesh>
        <TeethRow y={upperY} upper />
        <TeethRow y={lowerY} upper={false} />
        {/* くちびる */}
        <mesh position={[0, 0, 2.9]} scale={[1.25, 0.95 + open * 0.15, 1]}>
          <torusGeometry args={[2.9, 0.5, 16, 48]} />
          <Toon color="#ff5d73" />
        </mesh>
        {swallow < 1 ? (
          <group
            position={[0, swallow * 0.4, -swallow * 4]}
            scale={1 - swallow * 0.6}
          >
            {f < SWALLOW ? pieces : null}
            {f >= SWALLOW - 5 ? (
              <mesh position={[0, -0.3, 0.4]}>
                <sphereGeometry args={[0.5, 24, 24]} />
                <Toon color="#fff3c4" />
              </mesh>
            ) : null}
          </group>
        ) : null}
        {drops}
      </ThreeCanvas>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Sfx
          text="かみかみ"
          x={1500}
          y={300}
          start={CHOMP0}
          end={CHOMP0 + CHOMP_EVERY * CHOMPS}
          size={110}
        />
        <Sfx
          text="ごっくん！"
          x={1450}
          y={760}
          start={SWALLOW}
          end={S03_DURATION}
          size={130}
          color="#ffffff"
        />
      </svg>
      <Caption
        text="はで かみかみ"
        start={20}
        end={SALIVA - 10}
        position="top"
        size={96}
      />
      <Caption
        text="つばで やわらか"
        start={SALIVA + 5}
        end={GATHER}
        position="top"
        size={96}
      />
    </AbsoluteFill>
  );
};
