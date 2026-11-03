import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { Face } from "../components/Characters";
import { INK, Pill, SAND, SEA, WaveLine } from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S04_DURATION = 380;

const SIDES = 20; // こっちと あっち
const DIFF = 210; // こっちは たかい。あっちは ひくい

export const S04Height: React.FC = () => {
  const f = useCurrentFrame();
  const d = ip(f, [DIFF - 10, DIFF + 60], [0, 1]);
  const yl = 600 - 150 * d;
  const yr = 600 + 110 * d;
  const surface = `M -20 ${yl} L 760 ${yl} C 900 ${yl} 1020 ${yr} 1160 ${yr} L 1940 ${yr}`;
  const bob = (k: number) => Math.sin(f * 0.12 + k) * 8;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#e8f6ff" />
        <path d={`${surface} L 1940 1100 L -20 1100 Z`} fill={SEA} />
        <path d={surface} fill="none" stroke={INK} strokeWidth={7} />
        <g transform={`translate(0 ${yl - 600})`}>
          <WaveLine y={680} frame={f} opacity={0.4} />
        </g>
        {/* うみの そこ と かいきょうの いわ */}
        <path
          d="M -20 960 Q 480 920 820 950 L 880 880 Q 960 840 1040 880 L 1100 950 Q 1440 920 1940 960 L 1940 1100 L -20 1100 Z"
          fill={SAND}
          stroke={INK}
          strokeWidth={7}
        />
        {/* みずの こ（たかさの めじるし） */}
        {[
          { x: 380, y: yl, k: 0 },
          { x: 1540, y: yr, k: 2 },
        ].map((w) => (
          <g
            key={w.k}
            transform={`translate(${w.x} ${w.y - 70 + bob(w.k)}) scale(${pop(f, SIDES + 10 + w.k * 20, 16)})`}
          >
            <path
              d="M 0 -70 C 30 -30 55 -5 55 25 C 55 60 30 80 0 80 C -30 80 -55 60 -55 25 C -55 -5 -30 -30 0 -70 Z"
              fill="#bfe6ff"
              stroke={INK}
              strokeWidth={6}
            />
            <g transform="translate(0 30)">
              <Face
                r={50}
                frame={f}
                mood={w.k === 0 && d > 0.5 ? "wow" : "smile"}
                blinkOffset={w.k * 20}
              />
            </g>
          </g>
        ))}
        <Pill
          text="こっち"
          x={380}
          y={yl + 140}
          s={pop(f, SIDES + 30, 16)}
          frame={f}
        />
        <Pill
          text="あっち"
          x={1540}
          y={yr + 140}
          s={pop(f, SIDES + 75, 16)}
          frame={f}
        />
        <Pill
          text="たかい！"
          x={620}
          y={yl - 90}
          s={pop(f, DIFF + 10, 16)}
          frame={f}
          color="#ffe14d"
        />
        <Pill
          text="ひくい"
          x={1300}
          y={yr - 90}
          s={pop(f, DIFF + 50, 16)}
          frame={f}
          color="#cdeeff"
        />
        {/* たかさの さ */}
        {d > 0.05 ? (
          <g stroke="#ff4d6d" strokeWidth={8} strokeLinecap="round">
            <line x1={760} y1={yl} x2={860} y2={yl} strokeDasharray="14 12" />
            <line x1={1060} y1={yr} x2={1160} y2={yr} strokeDasharray="14 12" />
          </g>
        ) : null}
      </svg>
      <Caption
        text="たかさが ちがう！"
        start={DIFF + 70}
        end={S04_DURATION}
        position="top"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
