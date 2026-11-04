import React from "react";
import { random } from "remotion";

/* ---------- かお（共通） ---------- */
export const Face: React.FC<{
  r: number;
  frame: number;
  mood?: "smile" | "wow" | "sleep";
  blinkOffset?: number;
}> = ({ r, frame, mood = "smile", blinkOffset = 0 }) => {
  // 約3秒ごとにまばたき
  const cycle = (frame + blinkOffset) % 90;
  const blink = cycle > 84 ? 0.15 : 1;
  const eyeX = r * 0.32;
  const eyeY = -r * 0.1;
  const eyeR = r * 0.09;
  return (
    <g>
      {mood === "sleep" ? (
        <>
          <path
            d={`M ${-eyeX - eyeR} ${eyeY} q ${eyeR} ${eyeR} ${eyeR * 2} 0`}
            stroke="#2b2b4a"
            strokeWidth={r * 0.04}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${eyeX - eyeR} ${eyeY} q ${eyeR} ${eyeR} ${eyeR * 2} 0`}
            stroke="#2b2b4a"
            strokeWidth={r * 0.04}
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <ellipse
            cx={-eyeX}
            cy={eyeY}
            rx={eyeR * 0.8}
            ry={eyeR * blink}
            fill="#2b2b4a"
          />
          <ellipse
            cx={eyeX}
            cy={eyeY}
            rx={eyeR * 0.8}
            ry={eyeR * blink}
            fill="#2b2b4a"
          />
          <circle
            cx={-eyeX + eyeR * 0.25}
            cy={eyeY - eyeR * 0.35}
            r={eyeR * 0.25 * blink}
            fill="#fff"
          />
          <circle
            cx={eyeX + eyeR * 0.25}
            cy={eyeY - eyeR * 0.35}
            r={eyeR * 0.25 * blink}
            fill="#fff"
          />
        </>
      )}
      <ellipse
        cx={-r * 0.5}
        cy={r * 0.15}
        rx={r * 0.12}
        ry={r * 0.07}
        fill="#ff8fa3"
        opacity={0.7}
      />
      <ellipse
        cx={r * 0.5}
        cy={r * 0.15}
        rx={r * 0.12}
        ry={r * 0.07}
        fill="#ff8fa3"
        opacity={0.7}
      />
      {mood === "wow" ? (
        <ellipse
          cx={0}
          cy={r * 0.22}
          rx={r * 0.09}
          ry={r * 0.12}
          fill="#2b2b4a"
        />
      ) : (
        <path
          d={`M ${-r * 0.16} ${r * 0.15} Q 0 ${r * 0.32} ${r * 0.16} ${r * 0.15}`}
          stroke="#2b2b4a"
          strokeWidth={r * 0.05}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

/* ---------- ほし ---------- */
export const Stars: React.FC<{
  frame: number;
  count?: number;
  scrollY?: number;
  scrollX?: number;
  opacity?: number;
  seed?: string;
}> = ({
  frame,
  count = 140,
  scrollY = 0,
  scrollX = 0,
  opacity = 1,
  seed = "s",
}) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const bx = random(`${seed}x${i}`) * 1920;
    const by = random(`${seed}y${i}`) * 1080;
    const depth = 0.3 + random(`${seed}d${i}`) * 0.7;
    const x = (((bx + scrollX * depth) % 1920) + 1920) % 1920;
    const y = (((by + scrollY * depth) % 1080) + 1080) % 1080;
    const tw = 0.5 + 0.5 * Math.sin(frame * 0.08 + i * 1.7);
    const big = random(`${seed}b${i}`) > 0.9;
    stars.push(
      big ? (
        <path
          key={i}
          d={`M ${x} ${y - 10} L ${x + 3} ${y - 3} L ${x + 10} ${y} L ${x + 3} ${y + 3} L ${x} ${y + 10} L ${x - 3} ${y + 3} L ${x - 10} ${y} L ${x - 3} ${y - 3} Z`}
          fill="#fff7b0"
          opacity={(0.5 + tw * 0.5) * opacity}
        />
      ) : (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={1.5 + depth * 2}
          fill="#fff"
          opacity={(0.3 + tw * 0.7) * opacity}
        />
      ),
    );
  }
  return <g>{stars}</g>;
};

/* ---------- くも ---------- */
export const Cloud: React.FC<{
  x: number;
  y: number;
  s: number;
  opacity?: number;
}> = ({ x, y, s, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <ellipse cx={0} cy={20} rx={150} ry={40} fill="#fff" />
    <circle cx={-60} cy={0} r={50} fill="#fff" />
    <circle cx={10} cy={-20} r={65} fill="#fff" />
    <circle cx={75} cy={5} r={45} fill="#fff" />
  </g>
);
