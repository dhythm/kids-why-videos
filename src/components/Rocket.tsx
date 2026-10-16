import React from "react";
import { Face } from "./Characters";

/**
 * ロケットのローカル座標（上向き）:
 *   はなさき y=-360 / カプセル -360..-220
 *   3だんめ -220..-120（みどり） / 2だんめ -120..20（あお） / 1だんめ 20..220（オレンジ）
 */
export const STAGE_BOTTOM = { 1: 220, 2: 20, 3: -120 } as const;
const STAGE_TOP = { 1: 20, 2: -120, 3: -220 } as const;
const STAGE_COLOR = { 1: "#ff9f1c", 2: "#3a86ff", 3: "#2ec4b6" } as const;
const HALF_W = 70;

export type StageNo = 1 | 2 | 3;

export const Flame: React.FC<{
  y: number;
  intensity: number;
  frame: number;
  width?: number;
}> = ({ y, intensity, frame, width = 50 }) => {
  if (intensity <= 0.01) {
    return null;
  }
  const flick = 1 + Math.sin(frame * 1.7) * 0.12 + Math.sin(frame * 3.1) * 0.08;
  const len = 260 * intensity * flick;
  const w = width * (0.7 + intensity * 0.3);
  const shape = (l: number, ww: number) =>
    `M ${-ww} ${y} Q ${-ww * 1.1} ${y + l * 0.45} 0 ${y + l} Q ${ww * 1.1} ${y + l * 0.45} ${ww} ${y} Z`;
  return (
    <g>
      <path d={shape(len, w * 1.15)} fill="#ff5d2a" opacity={0.85} />
      <path d={shape(len * 0.72, w * 0.85)} fill="#ffb627" />
      <path d={shape(len * 0.42, w * 0.5)} fill="#fff6c9" />
    </g>
  );
};

export const StageBody: React.FC<{
  stage: StageNo;
  fuel?: number;
  highlight?: number;
}> = ({ stage, fuel, highlight = 0 }) => {
  const top = STAGE_TOP[stage];
  const bottom = STAGE_BOTTOM[stage];
  const h = bottom - top;
  const color = STAGE_COLOR[stage];
  return (
    <g>
      {highlight > 0 ? (
        <rect
          x={-HALF_W - 18}
          y={top - 12}
          width={HALF_W * 2 + 36}
          height={h + 24}
          rx={26}
          fill="#fff59d"
          opacity={highlight * 0.8}
        />
      ) : null}
      {/* ノズル */}
      <path
        d={`M -30 ${bottom - 2} L 30 ${bottom - 2} L 44 ${bottom + 30} L -44 ${bottom + 30} Z`}
        fill="#59607a"
      />
      {/* 1だんめのはね */}
      {stage === 1 ? (
        <>
          <path
            d={`M ${-HALF_W} 120 L ${-HALF_W - 55} 215 L ${-HALF_W - 55} 245 L ${-HALF_W} 215 Z`}
            fill="#ef476f"
          />
          <path
            d={`M ${HALF_W} 120 L ${HALF_W + 55} 215 L ${HALF_W + 55} 245 L ${HALF_W} 215 Z`}
            fill="#ef476f"
          />
        </>
      ) : null}
      <rect
        x={-HALF_W}
        y={top}
        width={HALF_W * 2}
        height={h}
        fill="#fdfdfd"
        stroke="#2b2b4a"
        strokeWidth={5}
      />
      {/* ねんりょう（すけて見える） */}
      {fuel !== undefined ? (
        <>
          <rect
            x={-HALF_W + 14}
            y={top + 14}
            width={HALF_W * 2 - 28}
            height={h - 28}
            rx={10}
            fill="#e9eef7"
          />
          <rect
            x={-HALF_W + 14}
            y={top + 14 + (h - 28) * (1 - fuel)}
            width={HALF_W * 2 - 28}
            height={(h - 28) * fuel}
            rx={10}
            fill={color}
          />
        </>
      ) : (
        <>
          <rect
            x={-HALF_W}
            y={top + h * 0.35}
            width={HALF_W * 2}
            height={h * 0.3}
            fill={color}
          />
          <rect
            x={-HALF_W + 10}
            y={top}
            width={14}
            height={h}
            fill="#ffffff"
            opacity={0.6}
          />
        </>
      )}
      <rect
        x={-HALF_W}
        y={top}
        width={HALF_W * 2}
        height={h}
        fill="none"
        stroke="#2b2b4a"
        strokeWidth={5}
      />
    </g>
  );
};

export const Capsule: React.FC<{
  frame: number;
  highlight?: number;
  crew?: boolean;
}> = ({ frame, highlight = 0, crew = true }) => (
  <g>
    {highlight > 0 ? (
      <path
        d={`M 0 -385 C 50 -360 ${HALF_W + 20} -290 ${HALF_W + 20} -208 L ${-HALF_W - 20} -208 C ${-HALF_W - 20} -290 -50 -360 0 -385 Z`}
        fill="#fff59d"
        opacity={highlight * 0.8}
      />
    ) : null}
    <path
      d={`M 0 -360 C 40 -340 ${HALF_W} -290 ${HALF_W} -220 L ${-HALF_W} -220 C ${-HALF_W} -290 -40 -340 0 -360 Z`}
      fill="#ef476f"
      stroke="#2b2b4a"
      strokeWidth={5}
    />
    <circle
      cx={0}
      cy={-268}
      r={30}
      fill="#bde7ff"
      stroke="#2b2b4a"
      strokeWidth={5}
    />
    {crew ? (
      <g transform="translate(0 -266)">
        <circle r={18} fill="#ffd9b8" />
        <Face r={18} frame={frame} />
      </g>
    ) : null}
    <ellipse cx={-10} cy={-280} rx={8} ry={4} fill="#fff" opacity={0.8} />
  </g>
);

export const Rocket: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  frame: number;
  stagesLeft?: 0 | 1 | 2 | 3;
  flame?: number;
  fuel?: [number, number, number];
  highlight?: { capsule?: number; s1?: number; s2?: number; s3?: number };
}> = ({
  x,
  y,
  scale = 1,
  rotate = 0,
  frame,
  stagesLeft = 3,
  flame = 0,
  fuel,
  highlight = {},
}) => {
  const stages: StageNo[] = ([3, 2, 1] as StageNo[]).filter(
    (s) => s > 3 - stagesLeft,
  );
  const lowest = stages.length > 0 ? stages[stages.length - 1] : null;
  const flameY = lowest ? STAGE_BOTTOM[lowest] + 30 : -205;
  const hl = (s: StageNo) =>
    (s === 1 ? highlight.s1 : s === 2 ? highlight.s2 : highlight.s3) ?? 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <Flame y={flameY} intensity={flame} frame={frame} />
      {stages.map((s) => (
        <StageBody
          key={s}
          stage={s}
          fuel={fuel ? fuel[s - 1] : undefined}
          highlight={hl(s)}
        />
      ))}
      <Capsule frame={frame} highlight={highlight.capsule ?? 0} />
    </g>
  );
};

/* ---------- つきの ちゃくりくき ---------- */
export const Lander: React.FC<{
  x: number;
  y: number;
  scale?: number;
  frame: number;
  flame?: number;
  legs?: number; // 0..1 あしの ひらき
  topOnly?: boolean;
}> = ({ x, y, scale = 1, frame, flame = 0, legs = 1, topOnly = false }) => {
  const spread = 40 + legs * 60;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {topOnly ? null : (
        <>
          <Flame y={60} intensity={flame * 0.45} frame={frame} width={30} />
          {/* あし */}
          {[-1, 1].map((d) => (
            <g key={d}>
              <line
                x1={d * 50}
                y1={10}
                x2={d * spread * 1.3}
                y2={110}
                stroke="#8a8fa8"
                strokeWidth={10}
                strokeLinecap="round"
              />
              <ellipse
                cx={d * spread * 1.3}
                cy={112}
                rx={22}
                ry={7}
                fill="#8a8fa8"
              />
            </g>
          ))}
          {/* した（きんいろ） */}
          <rect
            x={-75}
            y={-40}
            width={150}
            height={80}
            rx={10}
            fill="#f4c542"
            stroke="#2b2b4a"
            strokeWidth={5}
          />
          <path
            d="M -75 -10 L 75 -10 M -75 15 L 75 15"
            stroke="#e0a800"
            strokeWidth={4}
          />
          <path d="M -25 40 L 25 40 L 32 62 L -32 62 Z" fill="#59607a" />
        </>
      )}
      {/* うえ */}
      {topOnly ? (
        <Flame y={-38} intensity={flame * 0.45} frame={frame} width={26} />
      ) : null}
      <path
        d="M -60 -40 L -60 -110 L -30 -140 L 30 -140 L 60 -110 L 60 -40 Z"
        fill="#dfe6f0"
        stroke="#2b2b4a"
        strokeWidth={5}
      />
      <circle
        cx={0}
        cy={-92}
        r={22}
        fill="#bde7ff"
        stroke="#2b2b4a"
        strokeWidth={4}
      />
      <line
        x1={35}
        y1={-140}
        x2={50}
        y2={-175}
        stroke="#2b2b4a"
        strokeWidth={4}
      />
      <circle cx={50} cy={-178} r={8} fill="#ef476f" />
    </g>
  );
};
