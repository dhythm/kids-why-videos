import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { Face } from "../components/Characters";

export const S04_DURATION = 300;

const CX = 960;
const HALF = 130;
const BALL_Y = 600;
const SQUEEZE_Y = 400;
const PULSES = [30, 75, 120, 165, 210, 255];

/** ぎゅっ（しまる つよさ 0..1） */
function squeezeAmount(f: number): number {
  return PULSES.reduce(
    (a, p) => Math.max(a, Math.exp(-(((f - p) / 9) ** 2))),
    0,
  );
}

/** かべが うえへ ながれる りょう（= たべものが したへ すすむ） */
function scroll(f: number): number {
  const surge = PULSES.reduce((a, p) => {
    const t = Math.max(0, Math.min(1, (f - p) / 18));
    return a + t * t * (3 - 2 * t) * 140;
  }, 0);
  return f * 2 + surge;
}

export const S04Esophagus: React.FC = () => {
  const f = useCurrentFrame();
  const sq = squeezeAmount(f);
  const sc = scroll(f);

  const left: string[] = [];
  const right: string[] = [];
  for (let y = -40; y <= 1120; y += 16) {
    const g = Math.exp(-(((y - SQUEEZE_Y) / 70) ** 2));
    const bulge = Math.exp(-(((y - BALL_Y) / 110) ** 2));
    const w =
      HALF * (1 - 0.6 * sq * g) + 30 * bulge + Math.sin((y + sc) * 0.03) * 5;
    left.push(`${CX - w} ${y}`);
    right.push(`${CX + w} ${y}`);
  }
  const wall = `M ${left.join(" L ")} L ${right.reverse().join(" L ")} Z`;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(90deg, #ffd6e0, #ffb3c6 50%, #ffd6e0)",
      }}
    >
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect x={CX - 340} y={-40} width={680} height={1160} fill="#ff8fab" />
        {/* にくの すじ（うえへ ながれる） */}
        {new Array(14).fill(0).map((_, i) => {
          const y = ((((i * 100 - sc) % 1400) + 1400) % 1400) - 160;
          return (
            <path
              key={i}
              d={`M ${CX - 330} ${y} Q ${CX - 250} ${y + 30} ${CX - 170} ${y}`}
              stroke="#ff6f91"
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
        {new Array(14).fill(0).map((_, i) => {
          const y = ((((i * 100 + 50 - sc) % 1400) + 1400) % 1400) - 160;
          return (
            <path
              key={i}
              d={`M ${CX + 170} ${y} Q ${CX + 250} ${y + 30} ${CX + 330} ${y}`}
              stroke="#ff6f91"
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
        <path
          d={wall}
          fill="#7a1238"
          stroke="#2b2b4a"
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/* ぎゅっ の やじるし */}
        {[-1, 1].map((d) => (
          <g
            key={d}
            transform={`translate(${CX + d * (300 - sq * 60)} ${SQUEEZE_Y}) scale(${-d} 1)`}
            opacity={0.4 + sq * 0.6}
          >
            <path
              d="M 60 0 L 0 -34 L 0 -14 L -60 -14 L -60 14 L 0 14 L 0 34 Z"
              fill="#ffe14d"
              stroke="#2b2b4a"
              strokeWidth={4}
            />
          </g>
        ))}
        {/* したへ の やじるし */}
        <g
          transform={`translate(${CX} ${BALL_Y + 170 + sq * 30})`}
          opacity={0.5 + sq * 0.5}
        >
          <path
            d="M 0 60 L -40 0 L -16 0 L -16 -40 L 16 -40 L 16 0 L 40 0 Z"
            fill="#7fd0ff"
            stroke="#2b2b4a"
            strokeWidth={4}
          />
        </g>
        {/* たべもの */}
        <g
          transform={`translate(${CX} ${BALL_Y + sq * 20}) scale(${1 + sq * 0.08} ${1 - sq * 0.08})`}
        >
          <circle r={88} fill="#fff3c4" stroke="#2b2b4a" strokeWidth={5} />
          <Face r={78} frame={f} mood={sq > 0.4 ? "wow" : "smile"} />
        </g>
        {PULSES.map((p, i) => (
          <Sfx
            key={p}
            text="ぎゅっ"
            x={i % 2 ? 560 : 1360}
            y={SQUEEZE_Y - 40}
            start={p - 4}
            end={p + 32}
            size={110}
            rotate={i % 2 ? 8 : -8}
          />
        ))}
      </svg>
      <Caption
        text="しょくどう"
        start={10}
        end={S04_DURATION}
        position="bottom"
        align="left"
        size={96}
      />
    </AbsoluteFill>
  );
};
