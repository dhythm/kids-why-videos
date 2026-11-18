import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Bandage, Knee, Tap } from "../components/Bansoko";
import { Sparkle } from "../components/Kid";
import { Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S06_DURATION = DURATIONS[5];

const WHEN = 20; // ちが でた・じゅくじゅく
const WASH = 190; // あらって ぺたっ
const CHANGE = 330; // とりかえる

const K = { x: 1040, y: 680 };

export const S06When: React.FC = () => {
  const f = useCurrentFrame();
  const toWash = ip(f, [WASH - 12, WASH + 8], [0, 1]);
  const toChange = ip(f, [CHANGE - 12, CHANGE + 8], [0, 1]);
  const flow = ip(f, [WASH + 10, WASH + 22], [0, 1]) * ip(f, [WASH + 70, WASH + 82], [1, 0]);
  const stick = ip(f, [WASH + 88, WASH + 106], [0, 1]);
  const dirty = ip(f, [CHANGE + 10, CHANGE + 45], [0, 1]);
  const off = ip(f, [CHANGE + 60, CHANGE + 85], [0, 1]);
  const on = ip(f, [CHANGE + 85, CHANGE + 105], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toWash}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <Knee x={620} y={640} s={0.72 * pop(f, WHEN)} heal={0} blood={1} />
          <Knee x={1500} y={640} s={0.72 * pop(f, WHEN + 80)} heal={0.3} wet={0.6 + 0.4 * Math.sin(f * 0.2)} />
          <Pill text="ちが でた" x={620} y={960} s={pop(f, WHEN + 20)} size={56} color="#ffe0e0" frame={f} />
          <Pill text="じゅくじゅく" x={1500} y={960} s={pop(f, WHEN + 100)} size={56} color="#ffe6cf" frame={f} />
        </g>
        <g opacity={toWash * (1 - toChange)}>
          <DotsBg color="#e6f7ff" dot="#d2efff" />
          <Knee x={K.x} y={K.y} s={0.85} heal={0.05} />
          <path
            d={`M 652 432 Q 690 600 ${K.x} ${K.y - 10}`}
            stroke="#7fd0ff"
            strokeWidth={44}
            strokeLinecap="round"
            fill="none"
            opacity={flow * 0.9}
          />
          <path
            d={`M 652 432 Q 690 600 ${K.x} ${K.y - 10}`}
            stroke="#d9f3ff"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray="30 40"
            strokeDashoffset={-f * 14}
            fill="none"
            opacity={flow}
          />
          <Tap x={500} y={370} s={1.05} />
          <Bandage
            x={K.x + (1 - stick) * 520}
            y={K.y - (1 - stick) * 380}
            s={f >= WASH + 88 ? 0.85 : 0}
            rot={-16 + (1 - stick) * 60}
          />
          <Sfx text="じゃー" x={1560} y={420} start={WASH + 15} end={WASH + 80} size={110} color="#ffffff" />
          <Sfx text="ぺたっ" x={1560} y={420} start={WASH + 106} end={CHANGE - 10} size={110} />
        </g>
        <g opacity={toChange}>
          <DotsBg color="#f1ffe6" dot="#dff5cc" />
          <Knee x={K.x} y={K.y} s={0.85} heal={0.3} />
          <Bandage
            x={K.x - off * 620}
            y={K.y + off * 180}
            s={0.85}
            rot={-16 - off * 80}
            dirty={dirty}
            opacity={1 - ip(f, [CHANGE + 80, CHANGE + 95], [0, 1])}
          />
          <Bandage
            x={K.x + (1 - on) * 520}
            y={K.y - (1 - on) * 380}
            s={f >= CHANGE + 85 ? 0.85 : 0}
            rot={-16 + (1 - on) * 60}
          />
          {f > CHANGE + 105
            ? [0, 1, 2].map((i) => (
                <Sparkle key={i} x={K.x - 150 + i * 150} y={K.y - 150 + (i % 2) * 50} s={pop(f, CHANGE + 105 + i * 5, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))} color="#ffffff" />
              ))
            : null}
          <Sfx text="ぴかっ" x={1560} y={420} start={CHANGE + 105} end={S06_DURATION} size={110} />
        </g>
      </svg>
      <Caption text="はる とき" start={WHEN + 5} end={WASH - 15} position="top" size={110} />
      <Caption text="あらって ぺたっ" start={WASH + 15} end={CHANGE - 15} position="top" size={100} color="#ffe14d" />
      <Caption text="とりかえる" start={CHANGE + 20} end={S06_DURATION} position="top" size={110} />
    </AbsoluteFill>
  );
};
