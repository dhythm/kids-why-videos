import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sparkle } from "../components/Kid";
import { Caption } from "../components/Caption";
import {
  Bean,
  BeanPod,
  Corn,
  INK,
  Pill,
  RiceGrain,
} from "../components/Things";
import { pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S08_DURATION = DURATIONS[7];

const SELF = 20; // たね そのものを たべる
const RICE = 120; // おこめ
const BEAN = 150; // おまめ
const CORN = 180; // とうもろこしの つぶつぶも
const ALL = 225; // ぜんぶ たね

const ITEMS = [
  { x: 420, t: RICE, name: "おこめ" },
  { x: 960, t: BEAN, name: "おまめ" },
  { x: 1500, t: CORN, name: "とうもろこし" },
];

const RICE_PTS: [number, number, number][] = [
  [-60, -20, 20],
  [-20, -40, -10],
  [20, -36, 30],
  [58, -16, -25],
  [-36, 6, -40],
  [4, -6, 10],
  [40, 8, 45],
];

export const S08Eat: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fff6dc" />
        {new Array(24).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={(i % 6) * 360 + (Math.floor(i / 6) % 2) * 180}
            cy={Math.floor(i / 6) * 300 + 90}
            r={18}
            fill="#ffe7a8"
          />
        ))}

        {/* おこめ */}
        <g transform={`translate(420 620) scale(${pop(f, RICE)})`}>
          <ellipse cx={0} cy={-30} rx={170} ry={80} fill="#ffffff" stroke={INK} strokeWidth={6} />
          <path d="M -190 -20 Q -170 140 0 150 Q 170 140 190 -20 Z" fill="#e85d5d" stroke={INK} strokeWidth={6} />
          <path d="M -150 60 Q 0 90 150 60" stroke="#ffffff" strokeWidth={8} fill="none" opacity={0.6} />
          {RICE_PTS.map(([x, y, r], i) => (
            <RiceGrain key={i} x={x} y={y - 30} rot={r} s={0.8} />
          ))}
        </g>
        {f > RICE ? (
          <g>
            <RiceGrain x={420} y={360} s={2.2 * pop(f, RICE + 10)} rot={10} />
          </g>
        ) : null}

        {/* おまめ */}
        <BeanPod x={960} y={660} s={1.2 * pop(f, BEAN)} rot={-8} />
        <Bean x={900} y={380} s={1.4 * pop(f, BEAN + 10)} />
        <Bean x={1020} y={390} s={1.2 * pop(f, BEAN + 14)} />

        {/* とうもろこし */}
        <Corn x={1500} y={560} s={1.1 * pop(f, CORN)} rot={14} />

        {ITEMS.map((it) => (
          <Pill key={it.name} text={it.name} x={it.x} y={880} s={pop(f, it.t + 8)} size={56} color="#ffffff" frame={f} />
        ))}
        {ITEMS.map((it, i) => (
          <Pill
            key={`t${it.name}`}
            text="たね"
            x={it.x + 150}
            y={345}
            s={pop(f, ALL + i * 6)}
            size={50}
            color="#ffe14d"
            frame={f}
          />
        ))}
        {f >= ALL
          ? ITEMS.map((it, i) => (
              <Sparkle
                key={i}
                x={it.x - 150}
                y={330}
                s={pop(f, ALL + 10 + i * 6, 12) * (0.8 + 0.2 * Math.sin(f * 0.3 + i))}
              />
            ))
          : null}
      </svg>
      <Caption text="たねを たべる！" start={SELF + 5} end={RICE - 5} position="top" size={100} color="#ffe14d" />
      <Caption text="ぜんぶ たね！" start={ALL + 10} end={S08_DURATION} position="top" size={100} color="#ffe14d" />
    </AbsoluteFill>
  );
};
