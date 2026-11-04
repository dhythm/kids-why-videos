import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person, Sparkle } from "../components/Person";
import { FRIEND } from "../components/cast";
import { Caption } from "../components/Caption";
import { Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { poseAt, URESHII } from "../lib/signs";

export const S06_DURATION = 400;

const FACE = 20; // 手話では、かおも だいじ
const HAPPY = 110; // うれしい ときは、にっこり わらって
const FRIENDS = 250; // かおも、ことばの なかまなんだね

const X = 960;
const Y = 820;
const S = 1.9;

export const S06Face: React.FC = () => {
  const f = useCurrentFrame();
  const ring = ip(f, [FACE + 10, FACE + 30], [0, 1]) * (1 - ip(f, [HAPPY - 10, HAPPY], [0, 1]));
  const happy = f >= HAPPY + 10;
  const pose = poseAt({ ...URESHII, len: 140 }, f - HAPPY - 10);
  const faceY = Y - 160 * S;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill={happy ? "#fff1c9" : "#eaf2ff"} />
        {new Array(10).fill(0).map((_, i) => (
          <circle key={i} cx={(i * 211 + 90) % 1920} cy={(i * 137 + 140) % 1080} r={40 + (i % 3) * 14} fill={happy ? "#ffe39a" : "#d8e6ff"} />
        ))}
        <Person x={X} y={Y} s={S} frame={f} pose={pose} mood={happy ? "laugh" : "smile"} {...FRIEND} />
        {ring > 0 ? (
          <circle cx={X} cy={faceY} r={220} fill="none" stroke="#ff5d8f" strokeWidth={14} strokeDasharray="30 18" opacity={ring} transform={`rotate(${f * 0.6} ${X} ${faceY})`} />
        ) : null}
        <Pill text="かお" x={X + 380} y={faceY - 60} s={pop(f, FACE + 15, 16) * (1 - ip(f, [HAPPY - 10, HAPPY], [0, 1]))} frame={f} color="#ffe14d" size={80} />
        <Pill text="うれしい！" x={X + 520} y={330} s={pop(f, HAPPY + 30, 18)} frame={f} color="#ffe14d" size={80} />
        {happy
          ? [0, 1, 2, 3, 4, 5].map((i) => (
              <Sparkle key={i} x={X + Math.cos(i * 1.05 + f * 0.02) * 330} y={faceY + Math.sin(i * 1.05 + f * 0.02) * 230} s={pop(f, HAPPY + 10 + i * 4, 12) * (0.7 + 0.3 * Math.sin(f * 0.3 + i))} />
            ))
          : null}
      </svg>
      <Caption text="かおも だいじ" start={FACE + 10} end={HAPPY - 5} position="top" size={110} />
      <Caption text="かおも ことばの なかま" start={FRIENDS + 5} end={S06_DURATION} position="top" size={96} color="#ffe14d" />
    </AbsoluteFill>
  );
};
