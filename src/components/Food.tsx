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
  const arm = -20 - armUp * 120;
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
      <g transform={`rotate(${arm - swing * 0.6} -70 -40)`}>
        <rect x={-88} y={-48} width={30} height={100} rx={15} fill="#ffd166" />
        <circle cx={-73} cy={56} r={18} fill="#ffd9b8" />
      </g>
      <g transform={`rotate(${-arm + swing * 0.6} 70 -40)`}>
        <rect x={58} y={-48} width={30} height={100} rx={15} fill="#ffd166" />
        <circle cx={73} cy={56} r={18} fill="#ffd9b8" />
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

/* ---------- おにぎり ---------- */
export const Onigiri: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  bites?: number;
  rotate?: number;
  face?: boolean;
}> = ({ x, y, s = 1, frame, bites = 0, rotate = 0, face = true }) => {
  const id = `oni-${Math.round(x)}-${Math.round(y)}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <defs>
        <mask id={id}>
          <rect x={-200} y={-200} width={400} height={400} fill="#fff" />
          {bites >= 1 ? <circle cx={70} cy={-60} r={42} fill="#000" /> : null}
          {bites >= 2 ? <circle cx={-70} cy={-55} r={40} fill="#000" /> : null}
          {bites >= 3 ? <circle cx={0} cy={-115} r={55} fill="#000" /> : null}
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        <path
          d="M 0 -120 Q 20 -120 35 -95 L 110 40 Q 125 75 90 85 L -90 85 Q -125 75 -110 40 L -35 -95 Q -20 -120 0 -120 Z"
          fill="#ffffff"
          stroke="#2b2b4a"
          strokeWidth={5}
        />
        <rect x={-55} y={25} width={110} height={62} rx={6} fill="#2d4a3e" />
        {face ? (
          <g transform="translate(0 -15)">
            <Face r={60} frame={frame} />
          </g>
        ) : null}
      </g>
    </g>
  );
};

/* ---------- うんち ---------- */
export const Unchi: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  mood?: Mood;
  rotate?: number;
  squash?: number;
  color?: string;
}> = ({
  x,
  y,
  s = 1,
  frame,
  mood = "smile",
  rotate = 0,
  squash = 1,
  color = "#9b6a3c",
}) => (
  <g
    transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s / Math.sqrt(squash)} ${s * squash})`}
  >
    <ellipse
      cx={0}
      cy={50}
      rx={120}
      ry={45}
      fill={color}
      stroke="#2b2b4a"
      strokeWidth={5}
    />
    <ellipse
      cx={0}
      cy={5}
      rx={92}
      ry={40}
      fill={color}
      stroke="#2b2b4a"
      strokeWidth={5}
    />
    <ellipse
      cx={0}
      cy={-35}
      rx={62}
      ry={34}
      fill={color}
      stroke="#2b2b4a"
      strokeWidth={5}
    />
    <path
      d="M -20 -62 Q 10 -110 30 -92 Q 20 -70 10 -60 Z"
      fill={color}
      stroke="#2b2b4a"
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <ellipse
      cx={-40}
      cy={-40}
      rx={14}
      ry={7}
      fill="#ffffff"
      opacity={0.5}
      transform="rotate(-20 -40 -40)"
    />
    <g transform="translate(0 15)">
      <Face r={80} frame={frame} mood={mood} blinkOffset={20} />
    </g>
  </g>
);

/* ---------- バナナうんち ---------- */
export const BananaUnchi: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
}> = ({ x, y, s = 1, frame }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -190 -20 Q -120 90 0 95 Q 130 90 190 -20 Q 200 -45 175 -40 Q 110 30 0 32 Q -110 30 -170 -40 Q -195 -45 -190 -20 Z"
      fill="#a8703f"
      stroke="#2b2b4a"
      strokeWidth={6}
    />
    <path
      d="M -120 25 Q 0 70 120 25"
      stroke="#c48a55"
      strokeWidth={10}
      fill="none"
      strokeLinecap="round"
    />
    <g transform="translate(0 55)">
      <Face r={55} frame={frame} />
    </g>
  </g>
);

/* ---------- ばいきん ---------- */
export const Germ: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  rotate?: number;
}> = ({ x, y, s = 1, frame, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
    {new Array(10).fill(0).map((_, i) => (
      <path
        key={i}
        d="M -10 -50 L 0 -78 L 10 -50 Z"
        fill="#7b2cbf"
        transform={`rotate(${i * 36 + Math.sin(frame * 0.2 + i) * 5})`}
      />
    ))}
    <circle r={55} fill="#9d4edd" stroke="#2b2b4a" strokeWidth={5} />
    <path
      d="M -32 -22 L -12 -12 M 32 -22 L 12 -12"
      stroke="#2b2b4a"
      strokeWidth={6}
      strokeLinecap="round"
    />
    <circle cx={-20} cy={0} r={7} fill="#2b2b4a" />
    <circle cx={20} cy={0} r={7} fill="#2b2b4a" />
    <path
      d="M -18 26 Q 0 14 18 26"
      stroke="#2b2b4a"
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

/* ---------- おなかの なかま（さいきん） ---------- */
export const Buddy: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  color?: string;
  rotate?: number;
  munch?: boolean;
}> = ({ x, y, s = 1, frame, color = "#7bd389", rotate = 0, munch = false }) => {
  const open = munch ? (Math.sin(frame * 0.6) + 1) / 2 : 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <rect
        x={-70}
        y={-40}
        width={140}
        height={80}
        rx={40}
        fill={color}
        stroke="#2b2b4a"
        strokeWidth={5}
      />
      {[-40, -10, 20, 50].map((tx, i) => (
        <path
          key={i}
          d={`M ${tx} 38 q ${Math.sin(frame * 0.3 + i) * 10} 15 ${Math.sin(frame * 0.3 + i + 1) * 6} 28`}
          stroke="#2b2b4a"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <ellipse cx={-22} cy={-8} rx={6} ry={8} fill="#2b2b4a" />
      <ellipse cx={22} cy={-8} rx={6} ry={8} fill="#2b2b4a" />
      <ellipse cx={-38} cy={8} rx={9} ry={5} fill="#ff8fa3" opacity={0.7} />
      <ellipse cx={38} cy={8} rx={9} ry={5} fill="#ff8fa3" opacity={0.7} />
      {munch ? (
        <ellipse cx={0} cy={14} rx={10} ry={3 + open * 9} fill="#2b2b4a" />
      ) : (
        <path
          d="M -10 10 Q 0 20 10 10"
          stroke="#2b2b4a"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

/* ---------- えいよう（ほし） ---------- */
export const NUTRIENT_COLORS = [
  "#ff5d8f",
  "#ffd23f",
  "#5ccf6b",
  "#3a86ff",
  "#ff9f1c",
];

export const Nutrient: React.FC<{
  x: number;
  y: number;
  s?: number;
  color: string;
  rotate?: number;
}> = ({ x, y, s = 1, color, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
    <circle r={30} fill={color} opacity={0.25} />
    <path
      d="M 0 -22 L 6 -7 L 22 -7 L 9 3 L 14 19 L 0 9 L -14 19 L -9 3 L -22 -7 L -6 -7 Z"
      fill={color}
      stroke="#2b2b4a"
      strokeWidth={3}
      strokeLinejoin="round"
    />
  </g>
);

/* ---------- みずの つぶ ---------- */
export const Drop: React.FC<{
  x: number;
  y: number;
  s?: number;
  opacity?: number;
}> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <path
      d="M 0 -30 Q 22 0 20 12 Q 18 30 0 30 Q -18 30 -20 12 Q -22 0 0 -30 Z"
      fill="#7fd0ff"
      stroke="#2b2b4a"
      strokeWidth={3}
    />
    <ellipse cx={-6} cy={8} rx={4} ry={7} fill="#ffffff" opacity={0.8} />
  </g>
);

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

/* ---------- トイレの ドア ---------- */
export const Door: React.FC<{ x: number; y: number; open: number }> = ({
  x,
  y,
  open,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect
      x={-150}
      y={-300}
      width={300}
      height={420}
      rx={14}
      fill="#cfd8e6"
      stroke="#2b2b4a"
      strokeWidth={6}
    />
    <rect x={-130} y={-280} width={260} height={400} fill="#5b4a8a" />
    <g
      transform={`translate(-130 0) scale(${1 - open * 0.85} 1) translate(130 0)`}
    >
      <rect
        x={-130}
        y={-280}
        width={260}
        height={400}
        rx={6}
        fill="#ff9fb2"
        stroke="#2b2b4a"
        strokeWidth={5}
      />
      <circle
        cx={95}
        cy={-60}
        r={14}
        fill="#ffd23f"
        stroke="#2b2b4a"
        strokeWidth={4}
      />
      {/* トイレの マーク */}
      <circle cx={0} cy={-200} r={18} fill="#ffffff" />
      <path d="M -30 -175 L 30 -175 L 22 -115 L -22 -115 Z" fill="#ffffff" />
    </g>
  </g>
);

/* ---------- バス ---------- */
export const Bus: React.FC<{
  x: number;
  y: number;
  w: number;
  frame: number;
}> = ({ x, y, w, frame }) => {
  const h = w * 0.22;
  const wheelR = h * 0.2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={0}
        y={-h}
        width={w}
        height={h * 0.85}
        rx={h * 0.15}
        fill="#ffb627"
        stroke="#2b2b4a"
        strokeWidth={6}
      />
      <rect x={0} y={-h * 0.4} width={w} height={h * 0.12} fill="#ef476f" />
      {new Array(7).fill(0).map((_, i) => (
        <rect
          key={i}
          x={w * 0.06 + i * w * 0.125}
          y={-h * 0.85}
          width={w * 0.09}
          height={h * 0.35}
          rx={8}
          fill="#bde7ff"
          stroke="#2b2b4a"
          strokeWidth={4}
        />
      ))}
      {[0.18, 0.8].map((p, i) => (
        <g
          key={i}
          transform={`translate(${w * p} ${-h * 0.15}) rotate(${frame * 4})`}
        >
          <circle r={wheelR} fill="#2b2b4a" />
          <circle r={wheelR * 0.4} fill="#9aa0b8" />
          <rect
            x={-2}
            y={-wheelR * 0.4}
            width={4}
            height={wheelR * 0.8}
            fill="#2b2b4a"
          />
        </g>
      ))}
    </g>
  );
};
