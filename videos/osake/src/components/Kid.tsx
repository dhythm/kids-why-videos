import React from "react";
import { Face } from "./Characters";

type Mood = "smile" | "wow" | "sleep";

/* ---------- こども（まんなか = おなか） ---------- */
export const Kid: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  mood?: Mood;
  run?: number; // 0..1 はしる うごき
  armUp?: number; // 0..1 りょうてを あげる
  tummyGlow?: number;
  rotate?: number;
}> = ({
  x,
  y,
  s = 1,
  frame,
  mood = "smile",
  run = 0,
  armUp = 0,
  tummyGlow = 0,
  rotate = 0,
}) => {
  const swing = Math.sin(frame * 0.5) * 35 * run;
  const bob = Math.abs(Math.sin(frame * 0.5)) * -12 * run;
  // ひだりうでは +、みぎうでは − に まわすと そとがわへ ひらく
  const arm = 22 + armUp * 125;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${rotate}) scale(${s})`}>
      {/* あし */}
      <g transform={`rotate(${swing} -28 80)`}>
        <rect x={-46} y={70} width={34} height={90} rx={16} fill="#3a86ff" />
        <ellipse cx={-30} cy={162} rx={26} ry={13} fill="#2b2b4a" />
      </g>
      <g transform={`rotate(${-swing} 28 80)`}>
        <rect x={12} y={70} width={34} height={90} rx={16} fill="#3a86ff" />
        <ellipse cx={30} cy={162} rx={26} ry={13} fill="#2b2b4a" />
      </g>
      {/* うで */}
      <g transform={`rotate(${arm - swing * 0.6} -62 -40)`}>
        <rect
          x={-80}
          y={-50}
          width={34}
          height={104}
          rx={17}
          fill="#ffd166"
          stroke="#2b2b4a"
          strokeWidth={5}
        />
        <circle
          cx={-63}
          cy={62}
          r={20}
          fill="#ffd9b8"
          stroke="#2b2b4a"
          strokeWidth={5}
        />
      </g>
      <g transform={`rotate(${-arm + swing * 0.6} 62 -40)`}>
        <rect
          x={46}
          y={-50}
          width={34}
          height={104}
          rx={17}
          fill="#ffd166"
          stroke="#2b2b4a"
          strokeWidth={5}
        />
        <circle
          cx={63}
          cy={62}
          r={20}
          fill="#ffd9b8"
          stroke="#2b2b4a"
          strokeWidth={5}
        />
      </g>
      {/* からだ */}
      <rect
        x={-75}
        y={-70}
        width={150}
        height={160}
        rx={60}
        fill="#ffd166"
        stroke="#2b2b4a"
        strokeWidth={5}
      />
      {tummyGlow > 0 ? (
        <circle
          cx={0}
          cy={15}
          r={50}
          fill="#fff59d"
          opacity={tummyGlow * 0.9}
        />
      ) : null}
      {/* あたま */}
      <circle
        cx={0}
        cy={-160}
        r={95}
        fill="#ffd9b8"
        stroke="#2b2b4a"
        strokeWidth={5}
      />
      <path
        d="M -95 -170 Q -90 -270 0 -262 Q 90 -270 95 -170 Q 60 -215 0 -205 Q -60 -215 -95 -170 Z"
        fill="#5b3a29"
      />
      <g transform="translate(0 -150)">
        <Face r={95} frame={frame} mood={mood} />
      </g>
    </g>
  );
};

/* ---------- キラキラ ---------- */
export const Sparkle: React.FC<{
  x: number;
  y: number;
  s: number;
  color?: string;
}> = ({ x, y, s, color = "#ffe14d" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M 0 -30 L 9 -9 L 30 0 L 9 9 L 0 30 L -9 9 L -30 0 L -9 -9 Z"
      fill={color}
    />
  </g>
);
