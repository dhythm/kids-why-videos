import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const FONT = "'Hiragino Maru Gothic ProN', 'Hiragino Sans', sans-serif";
export const BLUE = "#1e88e5";
export const RED = "#e8590c";

export function usePop(start: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 140 } });
}

// SVG の中に置く、角丸のラベル
export function Chip({
  x,
  y,
  text,
  color = BLUE,
  start = 0,
  size = 44,
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  start?: number;
  size?: number;
}) {
  const p = usePop(start);
  const w = [...text].reduce((a, c) => a + (/[ -~]/.test(c) ? 0.55 : 1), 0) * size + size * 1.2;
  const h = size * 1.7;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p * 2)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontSize={size} fontWeight={700} fill="#fff" fontFamily={FONT}>
        {text}
      </text>
    </g>
  );
}

export function Label({
  x,
  y,
  text,
  color = "#37474f",
  size = 40,
  start = 0,
  anchor = "middle",
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  start?: number;
  anchor?: "start" | "middle" | "end";
}) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <text x={x} y={y + (1 - o) * 20} opacity={o} textAnchor={anchor} fontSize={size} fontWeight={700} fill={color} fontFamily={FONT} stroke="#fff" strokeWidth={size * 0.22} paintOrder="stroke">
      {text}
    </text>
  );
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 22,
  progress = 1,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
  progress?: number;
}) {
  if (progress <= 0) return null;
  const ex = x1 + (x2 - x1) * progress;
  const ey = y1 + (y2 - y1) * progress;
  const ang = Math.atan2(ey - y1, ex - x1);
  const hl = width * 2;
  const bx = ex - Math.cos(ang) * hl;
  const by = ey - Math.sin(ang) * hl;
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d={`M${ex},${ey} L${bx + nx * width * 1.4},${by + ny * width * 1.4} L${bx - nx * width * 1.4},${by - ny * width * 1.4}Z`} fill={color} />
    </g>
  );
}

// 決まった並びの疑似乱数（レンダリングごとに同じ結果にするため）
export function rand(i: number) {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}
