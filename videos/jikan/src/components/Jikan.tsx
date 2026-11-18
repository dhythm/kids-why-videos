import React from "react";
import { Face, Mood } from "./Characters";
import { INK } from "./Things";
import { choreFill } from "../lib/blocks";

export const PLAY = "#ffd84d"; // あそぶ じかん
export const CHORE = "#6cb6ff"; // したく
export const CRY = "#b7a6dd"; // やだやだ で つかった じかん

/* ---------- じかんの ブロック ---------- */

/** i ばんめの ブロックの まんなかの x */
export const blockX = (i: number, x: number, size = 150, gap = 14): number =>
  x + i * (size + gap) + size / 2;

/**
 * じかんの ブロックの れつ。x = ひだりはし、y = まんなかの たかさ。
 * used = したくが つかった ブロック、cry = その あと やだやだ で つかった ブロック。
 */
export const TimeBar: React.FC<{
  x: number;
  y: number;
  total?: number;
  size?: number;
  gap?: number;
  used: number;
  cry?: number;
  frame: number;
  appear?: (i: number) => number;
  glow?: number; // あそぶ ブロックが はずむ（0..1）
}> = ({
  x,
  y,
  total = 6,
  size = 150,
  gap = 14,
  used,
  cry = 0,
  frame,
  appear,
  glow = 0,
}) => {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const chore = choreFill(total, used);
  const all = choreFill(total, used + cry);
  const h = size / 2;
  return (
    <g>
      <defs>
        <clipPath id={`blk${id}`}>
          <rect x={-h} y={-h} width={size} height={size} rx={size * 0.18} />
        </clipPath>
      </defs>
      {chore.map((c, i) => {
        const s = appear ? appear(i) : 1;
        if (s <= 0) {
          return null;
        }
        const play = 1 - all[i];
        const bounce =
          play > 0.5 ? -Math.abs(Math.sin(frame * 0.18 + i * 0.9)) * 26 * glow : 0;
        return (
          <g
            key={i}
            transform={`translate(${blockX(i, x, size, gap)} ${y + bounce}) scale(${s})`}
          >
            <g clipPath={`url(#blk${id})`}>
              <rect x={-h} y={-h} width={size} height={size} fill={PLAY} />
              <rect x={-h} y={-h} width={size * c} height={size} fill={CHORE} />
              <rect
                x={-h + size * c}
                y={-h}
                width={size * (all[i] - c)}
                height={size}
                fill={CRY}
              />
              <rect
                x={-h}
                y={-h}
                width={size}
                height={size * 0.22}
                fill="#fff"
                opacity={0.28}
              />
            </g>
            <rect
              x={-h}
              y={-h}
              width={size}
              height={size}
              rx={size * 0.18}
              fill="none"
              stroke={INK}
              strokeWidth={Math.max(4, size * 0.05)}
            />
            {play > 0.5 ? (
              <path
                transform={`scale(${size / 110})`}
                d="M 0 -30 L 9 -9 L 30 0 L 9 9 L 0 30 L -9 9 L -30 0 L -9 -9 Z"
                fill="#fff"
                opacity={(play - 0.5) * 1.8}
              />
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/* ---------- とけいさん ---------- */
export const ClockChar: React.FC<{
  x: number;
  y: number;
  s: number;
  frame: number;
  angle?: number; // ながい はりの かくど
  walk?: number; // 0..1 あるく
  mood?: Mood;
}> = ({ x, y, s, frame, angle, walk = 0, mood = "smile" }) => {
  if (s <= 0) {
    return null;
  }
  const a = angle ?? frame * 3;
  const leg = Math.sin(frame * 0.45) * 26 * walk;
  const hop = Math.abs(Math.sin(frame * 0.45)) * 10 * walk;
  return (
    <g transform={`translate(${x} ${y - hop}) scale(${s})`}>
      {[-1, 1].map((d) => (
        <g key={d} transform={`rotate(${leg * d} ${d * 40} 95)`}>
          <rect x={d * 40 - 11} y={90} width={22} height={62} rx={11} fill={INK} />
          <ellipse cx={d * 40 + 8} cy={154} rx={28} ry={14} fill={INK} />
        </g>
      ))}
      {[-1, 1].map((d) => (
        <circle
          key={d}
          cx={d * 78}
          cy={-96}
          r={30}
          fill="#ff8f6b"
          stroke={INK}
          strokeWidth={7}
        />
      ))}
      <circle r={120} fill="#ff8f6b" stroke={INK} strokeWidth={8} />
      <circle r={96} fill="#fffdf5" stroke={INK} strokeWidth={6} />
      {new Array(12).fill(0).map((_, i) => (
        <rect
          key={i}
          x={-3}
          y={-90}
          width={6}
          height={i % 3 === 0 ? 18 : 9}
          rx={3}
          fill={INK}
          transform={`rotate(${i * 30})`}
        />
      ))}
      <g transform="translate(0 26)">
        <Face r={74} frame={frame} mood={mood} />
      </g>
      <rect
        x={-6}
        y={-48}
        width={12}
        height={54}
        rx={6}
        fill={INK}
        transform={`rotate(${a / 12})`}
      />
      <rect
        x={-4.5}
        y={-78}
        width={9}
        height={84}
        rx={4.5}
        fill="#e5484d"
        transform={`rotate(${a})`}
      />
      <circle r={9} fill={INK} />
    </g>
  );
};

/* ---------- したくの どうぐ・おもちゃ ---------- */
type P = { x: number; y: number; s: number; rot?: number };
const T = ({ x, y, s, rot = 0 }: P): string =>
  `translate(${x} ${y}) rotate(${rot}) scale(${s})`;
const line = { stroke: INK, strokeWidth: 6, strokeLinejoin: "round" } as const;

/** ごはん（eaten 0..1 で へっていく） */
export const RiceBowl: React.FC<P & { eaten?: number }> = ({ eaten = 0, ...p }) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      <path
        d={`M -62 0 Q -50 ${-66 * (1 - eaten * 0.85)} 0 ${-70 * (1 - eaten * 0.85)} Q 50 ${-66 * (1 - eaten * 0.85)} 62 0 Z`}
        fill="#fff"
        {...line}
      />
      <path d="M -74 -2 L 74 -2 Q 66 70 0 72 Q -66 70 -74 -2 Z" fill="#ff8f6b" {...line} />
      <rect x={-30} y={68} width={60} height={14} rx={5} fill="#e5734f" {...line} />
    </g>
  );

export const Shirt: React.FC<P & { color?: string }> = ({ color = "#7ed6a5", ...p }) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      <path
        d="M -40 -62 L -84 -32 L -62 2 L -42 -12 L -42 64 L 42 64 L 42 -12 L 62 2 L 84 -32 L 40 -62 Q 0 -34 -40 -62 Z"
        fill={color}
        {...line}
      />
    </g>
  );

/** シャワー（frame を わたすと おゆが ながれる） */
export const Shower: React.FC<P & { frame?: number }> = ({ frame = 0, ...p }) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      <path d="M 66 74 L 66 -52 Q 66 -84 34 -84 L -10 -84 L -10 -70" fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 66 74 L 66 -52 Q 66 -84 34 -84 L -10 -84 L -10 -70" fill="none" stroke="#dfe6f0" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -62 -34 Q -60 -76 -10 -76 Q 40 -76 42 -34 Z" fill="#9be1ff" {...line} />
      {[-44, -22, 0, 24].map((dx, i) => (
        <line
          key={`w${dx}`}
          x1={dx}
          y1={-20}
          x2={dx - 4}
          y2={72}
          stroke="#fff"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray="16 16"
          strokeDashoffset={-frame * 4 + i * 11}
        />
      ))}
      {[-44, -22, 0, 24].map((dx, i) => (
        <line
          key={dx}
          x1={dx}
          y1={-20}
          x2={dx - 4}
          y2={72}
          stroke="#4db8ff"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray="16 16"
          strokeDashoffset={-frame * 4 + i * 11}
        />
      ))}
    </g>
  );

export const Toothbrush: React.FC<P> = (p) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      <rect x={-78} y={-9} width={156} height={20} rx={10} fill="#ff7eb6" {...line} />
      <rect x={36} y={-38} width={40} height={30} rx={7} fill="#fff" {...line} />
      {[46, 56, 66].map((bx) => (
        <line key={bx} x1={bx} y1={-34} x2={bx} y2={-12} stroke="#cfd8e6" strokeWidth={3} />
      ))}
    </g>
  );

export const Book: React.FC<P> = (p) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      <path d="M -78 -44 L 0 -30 L 78 -44 L 78 46 L 0 60 L -78 46 Z" fill="#ff9f6b" {...line} />
      <path d="M -66 -40 L 0 -28 L 0 50 L -66 38 Z" fill="#fffdf5" {...line} strokeWidth={4} />
      <path d="M 66 -40 L 0 -28 L 0 50 L 66 38 Z" fill="#fffdf5" {...line} strokeWidth={4} />
      <circle cx={34} cy={2} r={15} fill="#ffd84d" />
      <path d="M -50 -12 L -16 -6 M -50 8 L -16 14" stroke="#b9c2d6" strokeWidth={5} strokeLinecap="round" />
    </g>
  );

/** つみき */
export const ToyTower: React.FC<P & { frame?: number; face?: boolean }> = ({
  frame = 0,
  face = false,
  ...p
}) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      <rect x={-92} y={0} width={86} height={80} rx={12} fill="#ff6b6b" {...line} />
      <rect x={6} y={0} width={86} height={80} rx={12} fill="#5ec8a8" {...line} />
      <rect x={-46} y={-86} width={92} height={80} rx={12} fill="#6cb6ff" {...line} />
      <path d="M -44 -92 L 0 -168 L 44 -92 Z" fill="#ffd84d" {...line} />
      {face ? (
        <g transform="translate(0 -46)">
          <Face r={46} frame={frame} />
        </g>
      ) : null}
    </g>
  );

export const Car: React.FC<P> = (p) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      <path d="M -46 -20 Q -36 -64 0 -64 L 28 -64 Q 54 -62 62 -20 Z" fill="#ffb3c7" {...line} />
      <rect x={-92} y={-22} width={184} height={50} rx={22} fill="#ff6b8b" {...line} />
      <circle cx={-48} cy={30} r={24} fill={INK} />
      <circle cx={-48} cy={30} r={9} fill="#fff" />
      <circle cx={48} cy={30} r={24} fill={INK} />
      <circle cx={48} cy={30} r={9} fill="#fff" />
    </g>
  );

/* ---------- ゴール（おでかけ / ねる） ---------- */
export const Door: React.FC<P & { open?: number }> = ({ open = 0, ...p }) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      <rect x={-78} y={-150} width={156} height={300} rx={14} fill="#bfe8ff" {...line} strokeWidth={8} />
      <g transform={`translate(-70 0) scale(${1 - open * 0.75} 1) translate(70 0)`}>
        <rect x={-70} y={-142} width={140} height={292} rx={8} fill="#c98a5a" {...line} />
        <rect x={-46} y={-116} width={92} height={96} rx={8} fill="#b5774a" />
        <rect x={-46} y={8} width={92} height={110} rx={8} fill="#b5774a" />
        <circle cx={46} cy={-4} r={12} fill="#ffd84d" stroke={INK} strokeWidth={5} />
      </g>
    </g>
  );

export const Futon: React.FC<P> = (p) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      <rect x={-130} y={-30} width={260} height={90} rx={30} fill="#fffdf5" {...line} />
      <rect x={-118} y={-52} width={84} height={50} rx={22} fill="#ffd9e2" {...line} />
      <path d="M -40 -34 L 130 -34 Q 134 60 100 60 L -40 60 Z" fill="#8fb8ff" {...line} />
      <path
        d="M 62 -112 A 40 40 0 1 0 96 -40 A 31 31 0 1 1 62 -112 Z"
        fill="#ffe680"
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </g>
  );

export const Sun: React.FC<P> = (p) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      {new Array(8).fill(0).map((_, i) => (
        <rect
          key={i}
          x={-8}
          y={-92}
          width={16}
          height={30}
          rx={8}
          fill="#ffb703"
          stroke={INK}
          strokeWidth={4}
          transform={`rotate(${i * 45})`}
        />
      ))}
      <circle r={52} fill="#ffd60a" stroke={INK} strokeWidth={6} />
    </g>
  );

export const Moon: React.FC<P> = (p) =>
  p.s <= 0 ? null : (
    <g transform={T(p)}>
      <path
        d="M 10 -70 A 72 72 0 1 0 72 36 A 56 56 0 1 1 10 -70 Z"
        fill="#ffe680"
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    </g>
  );

/** できた！ の まる */
export const Check: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={36} fill="#3ecf8e" stroke={INK} strokeWidth={6} />
      <path
        d="M -17 0 L -4 14 L 19 -13"
        stroke="#fff"
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
