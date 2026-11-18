import React from "react";

export type Mood = "smile" | "wow" | "ouch";

/* ---------- かお（共通） ---------- */
export const Face: React.FC<{
  r: number;
  frame: number;
  mood?: Mood;
  blinkOffset?: number;
}> = ({ r, frame, mood = "smile", blinkOffset = 0 }) => {
  // 約3秒ごとにまばたき
  const cycle = (frame + blinkOffset) % 90;
  const blink = cycle > 84 ? 0.15 : 1;
  const eyeX = r * 0.32;
  const eyeY = -r * 0.1;
  const eyeR = r * 0.09;
  const tear = ((frame + blinkOffset) % 40) / 40;
  return (
    <g>
      {mood === "ouch" ? (
        <>
          {/* ぎゅっと つぶった め（＞＜）と なみだ */}
          <path
            d={`M ${-eyeX - eyeR * 1.3} ${eyeY - eyeR * 1.2} L ${-eyeX + eyeR * 1.1} ${eyeY} L ${-eyeX - eyeR * 1.3} ${eyeY + eyeR * 1.2}`}
            stroke="#2b2b4a"
            strokeWidth={r * 0.05}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={`M ${eyeX + eyeR * 1.3} ${eyeY - eyeR * 1.2} L ${eyeX - eyeR * 1.1} ${eyeY} L ${eyeX + eyeR * 1.3} ${eyeY + eyeR * 1.2}`}
            stroke="#2b2b4a"
            strokeWidth={r * 0.05}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[-1, 1].map((d) => (
            <ellipse
              key={d}
              cx={d * (eyeX + eyeR * 1.6)}
              cy={eyeY + r * (0.12 + tear * 0.3)}
              rx={r * 0.045}
              ry={r * 0.07}
              fill="#6ec6ff"
              opacity={1 - tear}
            />
          ))}
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
      ) : mood === "ouch" ? (
        <path
          d={`M ${-r * 0.16} ${r * 0.3} Q 0 ${r * 0.12} ${r * 0.16} ${r * 0.3}`}
          stroke="#2b2b4a"
          strokeWidth={r * 0.05}
          fill="none"
          strokeLinecap="round"
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
