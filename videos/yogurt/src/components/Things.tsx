import React from "react";
import { FONT } from "./Caption";

export const INK = "#2b2b4a";
export const LEAF = "#5cbf5a";
export const LEAF_DARK = "#3d9a42";
export const STEM = "#4caf50";

const SW = 6; // せんの ふとさ

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

export const Leader: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p: number;
}> = ({ x1, y1, x2, y2, p }) =>
  p <= 0 ? null : (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x1 + (x2 - x1) * p}
        y2={y1 + (y2 - y1) * p}
        stroke={INK}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="2 14"
      />
      {p >= 1 ? <circle cx={x2} cy={y2} r={10} fill={INK} /> : null}
    </g>
  );

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

export const Cabbage: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={86} fill="#a7dd7c" stroke={INK} strokeWidth={SW} />
    <path
      d="M -86 0 Q -60 -90 20 -84 Q -40 -50 -46 30 Z"
      fill="#c4ec9a"
      stroke={INK}
      strokeWidth={4}
    />
    <path
      d="M 86 10 Q 70 -80 0 -86 Q 60 -40 50 50 Z"
      fill="#bde68f"
      stroke={INK}
      strokeWidth={4}
    />
    <path
      d="M -20 -60 Q 0 0 -10 70 M 20 -50 Q 34 0 30 60"
      stroke="#78b85a"
      strokeWidth={4}
      fill="none"
    />
  </g>
);

export const Carrot: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-18, 0, 18].map((a) => (
      <path
        key={a}
        d={`M 0 -60 q ${a} -40 ${a * 1.8} -80`}
        stroke="#4caf50"
        strokeWidth={14}
        strokeLinecap="round"
        fill="none"
      />
    ))}
    <path
      d="M -40 -62 Q 0 -74 40 -62 Q 30 40 0 120 Q -30 40 -40 -62 Z"
      fill="#ff8c1a"
      stroke={INK}
      strokeWidth={SW}
      strokeLinejoin="round"
    />
    {[-20, 10, 40].map((yy, i) => (
      <path
        key={i}
        d={`M ${i % 2 ? 6 : -26} ${yy} l 20 0`}
        stroke="#d96c00"
        strokeWidth={5}
        strokeLinecap="round"
      />
    ))}
  </g>
);

export const Bean: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={34} ry={30} fill="#f3d58b" stroke={INK} strokeWidth={4} />
    <path
      d="M -6 -18 q -8 18 0 36"
      stroke="#c9a352"
      strokeWidth={4}
      fill="none"
    />
    <ellipse cx={-14} cy={-12} rx={7} ry={4} fill="#fff" opacity={0.6} />
  </g>
);

export const BeanPod: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M -110 0 Q -110 -44 -60 -40 Q -36 -54 0 -40 Q 36 -54 60 -40 Q 110 -44 110 0 Q 110 40 60 38 Q 36 50 0 38 Q -36 50 -60 38 Q -110 40 -110 0 Z"
      fill="#8fd16b"
      stroke={INK}
      strokeWidth={5}
    />
    {[-64, 0, 64].map((dx) => (
      <circle
        key={dx}
        cx={dx}
        cy={0}
        r={28}
        fill="#b8e68f"
        stroke={INK}
        strokeWidth={3}
      />
    ))}
  </g>
);

export const Leaf: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  color?: string;
}> = ({ x, y, s = 1, rot = 0, color = LEAF }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M 0 0 Q 40 -40 110 -6 Q 50 34 0 0 Z"
      fill={color}
      stroke={INK}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path d="M 6 -2 L 96 -6" stroke={LEAF_DARK} strokeWidth={3} />
  </g>
);

export const Sun: React.FC<{
  x: number;
  y: number;
  frame: number;
  s?: number;
}> = ({ x, y, frame, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${frame * 0.4})`}>
    {new Array(10).fill(0).map((_, i) => (
      <rect
        key={i}
        x={-8}
        y={-110}
        width={16}
        height={36}
        rx={8}
        fill="#ffcf3f"
        transform={`rotate(${i * 36})`}
      />
    ))}
    <circle r={64} fill="#ffdb4d" stroke="#f2b600" strokeWidth={6} />
  </g>
);
