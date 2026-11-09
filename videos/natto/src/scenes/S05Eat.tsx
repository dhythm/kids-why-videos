import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { ZoomBg } from "../components/Backgrounds";
import { Pill } from "../components/Things";
import { NattoKin, StickyThread } from "../components/Natto";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S05_DURATION = DURATIONS[4];

const EAT = 20; // もぐもぐ たべて ふえる
const NEBA = 200; // ネバネバを つくりだす
const SO = 370; // なっとうきんが つくった

// まめの ひょうめんに ならぶ きん（ふえる じゅんばん）
const SPOTS = [
  { x: 960, y: 610 },
  { x: 760, y: 650 },
  { x: 1160, y: 650 },
  { x: 580, y: 720 },
  { x: 1340, y: 720 },
  { x: 860, y: 520 },
  { x: 1060, y: 520 },
  { x: 430, y: 820 },
  { x: 1490, y: 820 },
];

export const S05Eat: React.FC = () => {
  const f = useCurrentFrame();
  const chomp = f > EAT + 10 && f < NEBA ? Math.abs(Math.sin(f * 0.4)) : 0;
  const neba = ip(f, [NEBA + 20, NEBA + 110], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <ZoomBg frame={f} />
        {/* おおきな まめの ひょうめん */}
        <ellipse cx={960} cy={1250} rx={1200} ry={620} fill="#f3d58b" stroke="#2b2b4a" strokeWidth={10} />
        <ellipse cx={700} cy={760} rx={160} ry={30} fill="#ffffff" opacity={0.4} />
        {/* たべた あと（まめが へこむ） */}
        {SPOTS.slice(0, 5).map((p, i) => (
          <ellipse key={`b${i}`} cx={p.x} cy={p.y + 50} rx={60 * ip(f, [EAT + 20, NEBA], [0, 1])} ry={14} fill="#d9b86a" />
        ))}
        {/* ネバネバの いと */}
        {SPOTS.slice(0, 8).map((p, i) => {
          const q = SPOTS[(i + 3) % SPOTS.length];
          return (
            <StickyThread
              key={`t${i}`}
              a={{ x: p.x, y: p.y - 10 }}
              b={{ x: q.x, y: q.y - 10 }}
              length={Math.hypot(q.x - p.x, q.y - p.y) * 1.25}
              opacity={ip(f, [NEBA + 30 + i * 8, NEBA + 50 + i * 8], [0, 0.9])}
              base={10}
            />
          );
        })}
        <ellipse cx={960} cy={1250} rx={1210} ry={630} fill="#fffbe8" opacity={neba * 0.35} />
        {SPOTS.map((p, i) => {
          const born = i === 0 ? EAT : EAT + 30 + i * 14;
          const from = SPOTS[Math.max(0, Math.floor((i - 1) / 2))];
          const t = ip(f, [born, born + 20], [0, 1]);
          return (
            <NattoKin
              key={i}
              x={from.x + (p.x - from.x) * t}
              y={from.y + (p.y - from.y) * t - chomp * 12}
              s={0.55 * pop(f, born, 16)}
              frame={f + i * 13}
              rot={Math.sin(f * 0.05 + i) * 8}
              mood={chomp > 0.75 ? "wow" : "smile"}
            />
          );
        })}
        <Sfx text="もぐもぐ" x={1550} y={330} start={EAT + 10} end={EAT + 110} size={90} />
        <Sfx text="ふえた！" x={380} y={330} start={EAT + 110} end={NEBA} size={90} color="#c9f7e4" />
        <Sfx text="ネバ〜" x={1520} y={380} start={NEBA + 40} end={SO} size={96} color="#ffffff" />
        <Pill text="なっとうきんが つくった" x={960} y={300} s={pop(f, SO + 10)} size={64} color="#fff3a8" frame={f} />
      </svg>
      <Caption text="たべて ふえる" start={EAT + 5} end={NEBA - 5} position="top" size={100} />
      <Caption text="ネバネバを つくる" start={NEBA + 10} end={SO - 5} position="top" size={100} color="#ffe14d" />
    </AbsoluteFill>
  );
};
