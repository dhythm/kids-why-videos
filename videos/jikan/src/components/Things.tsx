import React from "react";
import { FONT } from "./Caption";

export const INK = "#2b2b4a";

/* ---------- ラベル・やじるし ---------- */

export const Pill: React.FC<{
  text: string;
  x: number;
  y: number;
  s: number;
  size?: number;
  color?: string;
  frame: number;
}> = ({ text, x, y, s, size = 60, color = "#ffffff", frame }) => {
  if (s <= 0) {
    return null;
  }
  const w = Array.from(text).length * size * 1.02 + size * 0.9;
  const h = size * 1.5;
  return (
    <g
      transform={`translate(${x} ${y + Math.sin(frame * 0.1 + x) * 5}) scale(${s})`}
    >
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={h / 2}
        fill={color}
        stroke={INK}
        strokeWidth={7}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontFamily: FONT, fontWeight: 800, fontSize: size }}
        fill={INK}
      >
        {text}
      </text>
    </g>
  );
};

export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
}> = ({ x1, y1, x2, y2, color = "#ff7b54", width = 18 }) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 6) {
    return null;
  }
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = Math.min(width * 2, len * 0.5);
  const hx = (da: number) => x2 - Math.cos(a + da) * head;
  const hy = (da: number) => y2 - Math.sin(a + da) * head;
  return (
    <path
      d={`M ${x1} ${y1} L ${x2} ${y2} M ${hx(0.6)} ${hy(0.6)} L ${x2} ${y2} L ${hx(-0.6)} ${hy(-0.6)}`}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
};

/** だめ・ちがうよ の ばつ */
export const Cross: React.FC<{ x: number; y: number; s: number }> = ({
  x,
  y,
  s,
}) =>
  s <= 0 ? null : (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke="#e5484d"
      strokeWidth={30}
      strokeLinecap="round"
    >
      <line x1={-70} y1={-70} x2={70} y2={70} />
      <line x1={70} y1={-70} x2={-70} y2={70} />
    </g>
  );

export const Heart: React.FC<{ x: number; y: number; s: number }> = ({
  x,
  y,
  s,
}) =>
  s <= 0 ? null : (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M 0 34 C -70 -10 -44 -66 0 -30 C 44 -66 70 -10 0 34 Z"
      fill="#ff6b8b"
      stroke={INK}
      strokeWidth={5}
      strokeLinejoin="round"
    />
  );

/** しずく（ち・みず・なみだ） */
export const Drop: React.FC<{
  x: number;
  y: number;
  s: number;
  color?: string;
}> = ({ x, y, s, color = "#e5484d" }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M 0 -34 Q 26 0 26 14 A 26 26 0 1 1 -26 14 Q -26 0 0 -34 Z"
        fill={color}
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <ellipse cx={-9} cy={10} rx={6} ry={9} fill="#fff" opacity={0.6} />
    </g>
  );
