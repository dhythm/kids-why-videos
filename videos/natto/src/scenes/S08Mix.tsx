import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Pill } from "../components/Things";
import {
  Bubble,
  Chain,
  Chopsticks,
  Lens,
  NattoBowl,
  StickyThread,
} from "../components/Natto";
import { beadChain } from "../lib/strings";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S08_DURATION = DURATIONS[7];

const STIR = 20; // まぜると？
const INSIDE = 140; // くさりが のびて くうきが はいる
const LOTS = 350; // いとも いっぱい

const BOWL = { x: 620, y: 720 };

export const S08Mix: React.FC = () => {
  const f = useCurrentFrame();
  const stirring = f > STIR && f < LOTS;
  const ang = stirring ? (f - STIR) * 0.32 : (LOTS - STIR) * 0.32;
  const lift = ip(f, [LOTS, LOTS + 50], [0, 1]);
  const foam = ip(f, [STIR, LOTS], [0, 1]);
  const tipX = BOWL.x + Math.cos(ang) * 100 * (1 - lift) + lift * 120;
  const tipY = BOWL.y - 10 + Math.sin(ang) * 24 * (1 - lift) - lift * 340;
  const lensR =
    ip(f, [INSIDE, INSIDE + 40], [0, 340]) * (1 - ip(f, [LOTS - 10, LOTS + 10], [0, 1]));
  const stretch = ip(f, [INSIDE + 30, INSIDE + 140], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#fff6e0" dot="#ffe8bd" />
        <NattoBowl x={BOWL.x} y={BOWL.y} s={1.1 * pop(f, 0, 14)} stir={ang * 0.5} foam={foam} />
        {new Array(Math.round(2 + lift * 8)).fill(0).map((_, i) => (
          <StickyThread
            key={i}
            a={{ x: BOWL.x - 160 + i * 34, y: BOWL.y - 30 }}
            b={{ x: tipX + (i - 4) * 4, y: tipY }}
            length={480 + (i % 3) * 40}
            opacity={ip(f, [LOTS + 5, LOTS + 20], [0, 1])}
            base={6}
          />
        ))}
        <Chopsticks x={tipX} y={tipY} s={pop(f, STIR - 10)} rot={18 - lift * 10} />
        <Lens x={1380} y={500} r={lensR} id="lens8" bg="#fff8ec">
          {[0, 1].map((k) => (
            <Chain
              key={k}
              points={beadChain(8, { x: 1380 - (7 * (55 + stretch * 30)) / 2, y: 430 + k * 140 }, 55 + stretch * 30, 40 * (1 - stretch) + 8, k * 2 + f * 0.06)}
              r={22}
              frame={f}
              faces={false}
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Bubble key={i} x={1180 + i * 80} y={500 + Math.sin(i * 2.1) * 120 - ((f * 1.5 + i * 30) % 60)} r={34 * ip(f, [INSIDE + 60 + i * 10, INSIDE + 80 + i * 10], [0, 1])} />
          ))}
        </Lens>
        <g opacity={1 - ip(f, [LOTS - 10, LOTS + 5], [0, 1])}>
          <Pill text="くうき" x={1380} y={900} s={pop(f, INSIDE + 90)} size={60} color="#ffffff" frame={f} />
        </g>
        <Sfx text="まぜまぜ" x={260} y={440} start={STIR + 10} end={LOTS} size={90} color="#ffffff" />
        <Sfx text="ふわふわ" x={1440} y={380} start={LOTS + 30} end={S08_DURATION} size={100} />
        <Sfx text="いっぱい！" x={1300} y={660} start={LOTS + 50} end={S08_DURATION} size={110} color="#ffffff" />
      </svg>
      <Caption text="まぜると？" start={STIR + 5} end={INSIDE + 10} position="top" size={100} />
      <Caption text="ふわふわ ネバネバ" start={INSIDE + 20} end={S08_DURATION} position="top" size={100} color="#ffe14d" />
    </AbsoluteFill>
  );
};
