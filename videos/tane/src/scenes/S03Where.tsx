import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import {
  Arrow,
  Flower,
  Leaf,
  Pill,
  STEM,
  Tomato,
} from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S03_DURATION = DURATIONS[2];

const ASK = 20; // たねは どこに できるのかな？
const BLOOM = 120; // はなが さくと…
const FRUIT = 175; // み が ふくらんで…
const SEED = 250; // みの なかに たねが できる
const CUT = 262;

const VINE_Y = 300;

export const S03Where: React.FC = () => {
  const f = useCurrentFrame();
  const bloom = ip(f, [BLOOM, BLOOM + 30], [0.05, 1]);
  const fruit = ip(f, [FRUIT, FRUIT + 45], [0, 1]);
  const red = ip(f, [FRUIT + 25, FRUIT + 50], [0, 1]);
  const cut = pop(f, CUT, 16);
  // みどり → あか
  const g = Math.round(0x8f + (0x4d - 0x8f) * red);
  const r = Math.round(0x6c + (0xff - 0x6c) * red);
  const fruitColor = `rgb(${r}, ${g}, ${Math.round(0x3a + (0x4d - 0x3a) * red)})`;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#eafbe3" />
        {new Array(12).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={(i % 6) * 360 + 80}
            cy={Math.floor(i / 6) * 520 + 200}
            r={26}
            fill="#d4f2c6"
          />
        ))}
        {/* つる */}
        <path
          d={`M -20 ${VINE_Y} Q 480 ${VINE_Y - 60} 960 ${VINE_Y} T 1940 ${VINE_Y}`}
          stroke={STEM}
          strokeWidth={18}
          fill="none"
          strokeLinecap="round"
        />
        <Leaf x={300} y={VINE_Y - 22} rot={-30} />
        <Leaf x={1200} y={VINE_Y + 8} rot={160} />
        <Leaf x={1700} y={VINE_Y - 4} rot={-20} />

        {/* はな */}
        <path
          d={`M 480 ${VINE_Y - 30} L 480 470`}
          stroke={STEM}
          strokeWidth={10}
        />
        <Flower x={480} y={540} s={1.6 * pop(f, ASK + 10)} bloom={bloom} />
        <Pill
          text="はな"
          x={480}
          y={760}
          s={pop(f, BLOOM + 10)}
          size={70}
          color="#ffe14d"
          frame={f}
        />
        <Sfx
          text="？"
          x={480}
          y={420}
          start={ASK + 20}
          end={BLOOM - 5}
          size={120}
          color="#ff8fa3"
        />

        <Arrow x1={650} y1={560} x2={650 + 160 * pop(f, FRUIT - 10)} y2={560} />

        {/* み */}
        <path
          d={`M 1000 ${VINE_Y} L 1000 ${450 - 20 * fruit}`}
          stroke={STEM}
          strokeWidth={10}
        />
        {fruit > 0 ? (
          <Tomato x={1000} y={540} s={0.3 + fruit * 1.1} color={fruitColor} />
        ) : null}
        <Pill
          text="み"
          x={1000}
          y={760}
          s={pop(f, FRUIT + 30)}
          size={70}
          color="#ff9a8a"
          frame={f}
        />

        <Arrow
          x1={1170}
          y1={560}
          x2={1170 + 160 * pop(f, SEED - 4)}
          y2={560}
        />

        {/* きってみると たね */}
        {cut > 0 ? (
          <g>
            <ellipse cx={1540} cy={660} rx={190} ry={40} fill="#ffffff" stroke="#9ec6e8" strokeWidth={6} />
            <Tomato x={1540} y={560} s={1.4 * cut} cut />
          </g>
        ) : null}
        <Pill
          text="たね"
          x={1540}
          y={780}
          s={pop(f, SEED + 30)}
          size={70}
          color="#fff3cf"
          frame={f}
        />
        {f >= CUT + 14
          ? [0, 1, 2].map((i) => (
              <Sparkle
                key={i}
                x={1540 + Math.cos(i * 2.1) * 150}
                y={540 + Math.sin(i * 2.1) * 110}
                s={pop(f, CUT + 14 + i * 5, 12) * (0.8 + 0.2 * Math.sin(f * 0.3 + i))}
              />
            ))
          : null}
      </svg>
      <Caption
        text="たねは どこ？"
        start={ASK + 5}
        end={BLOOM - 5}
        position="top"
        size={100}
      />
      <Caption
        text="みの なかに たね！"
        start={SEED + 10}
        end={S03_DURATION}
        position="top"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
