import React from "react";
import { useCurrentFrame } from "remotion";
import { FONT } from "./Caption";
import { pop } from "../lib/anim";

/** せんで さして なまえを おしえる ラベル（SVG内） */
export const Tag: React.FC<{
  text: string;
  x: number;
  y: number;
  toX: number;
  toY: number;
  start: number;
  end?: number;
  color?: string;
  size?: number;
}> = ({
  text,
  x,
  y,
  toX,
  toY,
  start,
  end = 99999,
  color = "#ffffff",
  size = 64,
}) => {
  const f = useCurrentFrame();
  if (f < start || f > end) {
    return null;
  }
  const s = pop(f, start, 16);
  const w = Array.from(text).length * size * 1.02 + size * 0.9;
  const h = size * 1.5;
  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={x + (toX - x) * s}
        y2={y + (toY - y) * s}
        stroke="#2b2b4a"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <circle cx={toX} cy={toY} r={14 * s} fill="#2b2b4a" />
      <circle cx={toX} cy={toY} r={8 * s} fill={color} />
      <g transform={`translate(${x} ${y + Math.sin(f * 0.1) * 5}) scale(${s})`}>
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={h / 2}
          fill={color}
          stroke="#2b2b4a"
          strokeWidth={7}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: FONT, fontWeight: 800, fontSize: size }}
          fill="#2b2b4a"
        >
          {text}
        </text>
      </g>
    </g>
  );
};
