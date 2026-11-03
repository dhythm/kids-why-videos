import React from "react";
import { Face } from "./Characters";
import { FONT } from "./Caption";

export const INK = "#2b2b4a";
export const SEA = "#5bb6ea";
export const SEA_DEEP = "#3d8fd1";
export const LAND = "#a8dc8a";
export const SAND = "#f6d99b";

/* ---------- うずしお ---------- */

function spiralPath(r: number, turns: number, phase: number): string {
  const pts: string[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = phase + t * turns * Math.PI * 2;
    const rr = r * (0.12 + 0.88 * t);
    pts.push(
      `${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`,
    );
  }
  return `M ${pts.join(" L ")}`;
}

/**
 * うずしお（上から みた うず）。squash で ななめから みた かんじに つぶす。
 * dir: 1 = とけいまわり、-1 = はんたい
 */
export const Whirl: React.FC<{
  x: number;
  y: number;
  r: number;
  frame: number;
  speed?: number;
  dir?: 1 | -1;
  squash?: number;
  face?: boolean;
  mood?: "smile" | "wow" | "sleep";
  arms?: number;
}> = ({
  x,
  y,
  r,
  frame,
  speed = 4,
  dir = 1,
  squash = 1,
  face = false,
  mood = "smile",
  arms = 4,
}) => {
  if (r <= 0) {
    return null;
  }
  const rot = frame * speed * dir;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`scale(1 ${squash})`}>
        <circle
          r={r}
          fill={SEA_DEEP}
          stroke={INK}
          strokeWidth={6 / Math.max(squash, 0.4)}
        />
        <circle r={r * 0.42} fill="#2c6fb3" />
        <g transform={`rotate(${rot}) scale(${dir} 1)`}>
          {new Array(arms).fill(0).map((_, k) => (
            <path
              key={k}
              d={spiralPath(r * 0.92, 1, (k * Math.PI * 2) / arms)}
              fill="none"
              stroke="#ffffff"
              strokeWidth={Math.max(5, r * 0.07)}
              strokeLinecap="round"
              opacity={0.9}
            />
          ))}
        </g>
      </g>
      {face ? (
        <g>
          <circle r={r * 0.36} fill="#bfe6ff" stroke={INK} strokeWidth={5} />
          <Face r={r * 0.36} frame={frame} mood={mood} />
        </g>
      ) : null}
    </g>
  );
};

/* ---------- なみ ---------- */
export const WaveLine: React.FC<{
  y: number;
  frame: number;
  color?: string;
  opacity?: number;
  speed?: number;
}> = ({ y, frame, color = "#ffffff", opacity = 0.6, speed = 1.5 }) => {
  const shift = (frame * speed) % 120;
  let d = `M ${-120 - shift} ${y}`;
  for (let i = 0; i < 20; i++) {
    d += " q 30 -18 60 0 q 30 18 60 0";
  }
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={6}
      strokeLinecap="round"
      opacity={opacity}
    />
  );
};

/* ---------- おつきさま ---------- */
export const Moon: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  mood?: "smile" | "wow" | "sleep";
}> = ({ x, y, s = 1, frame, mood = "smile" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={150} fill="#fff7b0" opacity={0.35} />
    <circle r={110} fill="#ffe98a" stroke={INK} strokeWidth={6} />
    <circle cx={-55} cy={-45} r={16} fill="#f5d55c" />
    <circle cx={60} cy={50} r={12} fill="#f5d55c" />
    <circle cx={45} cy={-65} r={9} fill="#f5d55c" />
    <Face r={110} frame={frame} mood={mood} blinkOffset={30} />
  </g>
);

/* ---------- やじるし ---------- */
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

/* ---------- ラベル ---------- */
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

/** だめ！ の ばつ（p: 0→1 で かかれる） */
export const BigX: React.FC<{
  x: number;
  y: number;
  s?: number;
  p: number;
}> = ({ x, y, s = 1, p }) => (
  <g
    transform={`translate(${x} ${y}) scale(${s})`}
    stroke="#e63946"
    strokeWidth={34}
    strokeLinecap="round"
    fill="none"
  >
    <path
      d="M -120 -120 L 120 120"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.min(1, p * 2)}
    />
    <path
      d="M 120 -120 L -120 120"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.max(0, Math.min(1, p * 2 - 1))}
    />
  </g>
);

/* ---------- のりもの ---------- */
export const Bus: React.FC<{
  x: number;
  y: number;
  w: number;
  frame: number;
}> = ({ x, y, w, frame }) => {
  const h = w * 0.36;
  const bob = Math.sin(frame * 0.3 + x) * 3;
  return (
    <g transform={`translate(${x} ${y + bob})`}>
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={h * 0.25}
        fill="#ffd166"
        stroke={INK}
        strokeWidth={6}
      />
      {new Array(4).fill(0).map((_, i) => (
        <rect
          key={i}
          x={w * 0.08 + i * w * 0.2}
          y={h * 0.16}
          width={w * 0.15}
          height={h * 0.36}
          rx={8}
          fill="#cdeeff"
          stroke={INK}
          strokeWidth={4}
        />
      ))}
      <rect x={0} y={h * 0.66} width={w} height={h * 0.1} fill="#ff7b54" />
      <circle cx={w * 0.22} cy={h} r={h * 0.17} fill={INK} />
      <circle cx={w * 0.78} cy={h} r={h * 0.17} fill={INK} />
      <circle cx={w * 0.22} cy={h} r={h * 0.07} fill="#ddd" />
      <circle cx={w * 0.78} cy={h} r={h * 0.07} fill="#ddd" />
    </g>
  );
};

export const Bike: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
}> = ({ x, y, s = 1, frame }) => {
  const spin = frame * 18;
  const wheel = (cx: number) => (
    <g transform={`translate(${cx} 0) rotate(${spin})`}>
      <circle r={48} fill="none" stroke={INK} strokeWidth={9} />
      <path d="M -48 0 L 48 0 M 0 -48 L 0 48" stroke={INK} strokeWidth={4} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {wheel(-70)}
      {wheel(70)}
      <path
        d="M -70 0 L -20 -70 L 45 -70 L 70 0 M -20 -70 L 0 0 L 45 -70 M 45 -70 L 40 -100 L 65 -100 M -20 -70 L -30 -90"
        stroke="#ff4d6d"
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x={-52} y={-100} width={44} height={14} rx={7} fill={INK} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${-150 - i * 10} ${-60 + i * 30} l -70 0`}
          stroke="#ffffff"
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.5 + 0.5 * Math.sin(frame * 0.5 + i)}
        />
      ))}
    </g>
  );
};

export const Boat: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
}> = ({ x, y, s = 1, frame }) => {
  const rock = Math.sin(frame * 0.12) * 3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rock}) scale(${s})`}>
      <rect
        x={-90}
        y={-150}
        width={170}
        height={70}
        rx={16}
        fill="#ffffff"
        stroke={INK}
        strokeWidth={6}
      />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={-55 + i * 50}
          cy={-115}
          r={14}
          fill="#cdeeff"
          stroke={INK}
          strokeWidth={4}
        />
      ))}
      <rect
        x={20}
        y={-205}
        width={36}
        height={60}
        rx={8}
        fill="#ff7b54"
        stroke={INK}
        strokeWidth={6}
      />
      <path
        d="M -170 -80 L 170 -80 L 120 10 L -130 10 Z"
        fill="#ff4d6d"
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <g transform="translate(-20 -38)">
        <Face r={60} frame={frame} />
      </g>
    </g>
  );
};

/* ---------- はし（おおなるときょう） ---------- */
export const Bridge: React.FC<{ y: number }> = ({ y }) => (
  <g>
    {[360, 1560].map((x) => (
      <g key={x}>
        <rect
          x={x - 28}
          y={y - 330}
          width={56}
          height={520}
          rx={10}
          fill="#e9f1f7"
          stroke={INK}
          strokeWidth={6}
        />
        <rect
          x={x - 40}
          y={y - 250}
          width={80}
          height={20}
          fill="#c9d6e2"
          stroke={INK}
          strokeWidth={5}
        />
      </g>
    ))}
    <path
      d={`M -40 ${y - 120} Q 160 ${y - 40} 360 ${y - 320} Q 960 ${y + 10} 1560 ${y - 320} Q 1760 ${y - 40} 1960 ${y - 120}`}
      fill="none"
      stroke={INK}
      strokeWidth={8}
    />
    {new Array(23).fill(0).map((_, i) => {
      const x = 410 + i * 50;
      const t = (x - 360) / 1200;
      const cy = y - 320 + 330 * (1 - Math.pow(2 * t - 1, 2));
      return (
        <line
          key={i}
          x1={x}
          y1={cy}
          x2={x}
          y2={y}
          stroke={INK}
          strokeWidth={3}
          opacity={0.6}
        />
      );
    })}
    <rect
      x={-20}
      y={y}
      width={1960}
      height={56}
      fill="#f4f7fa"
      stroke={INK}
      strokeWidth={6}
    />
    <rect
      x={-20}
      y={y + 56}
      width={1960}
      height={22}
      fill="#c9d6e2"
      stroke={INK}
      strokeWidth={5}
    />
  </g>
);

/* ---------- て と えんぴつ ---------- */
export const Hand: React.FC<{ x: number; y: number; flip?: boolean }> = ({
  x,
  y,
  flip = false,
}) => (
  <g transform={`translate(${x} ${y}) scale(1 ${flip ? -1 : 1})`}>
    <rect
      x={-330}
      y={-60}
      width={210}
      height={120}
      rx={40}
      fill="#ffd166"
      stroke={INK}
      strokeWidth={7}
    />
    <path
      d="M -150 -70 L 250 -70 Q 330 -70 330 0 Q 330 70 250 70 L -150 70 Z"
      fill="#ffd9b8"
      stroke={INK}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    {[-30, 10, 50].map((dy, i) => (
      <path
        key={i}
        d={`M 180 ${dy - 10} q 60 0 90 0`}
        stroke="#e8b48f"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.8}
      />
    ))}
  </g>
);

export const PencilEnd: React.FC<{
  x: number;
  y: number;
  r: number;
  rot: number;
}> = ({ x, y, r, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <polygon
      points={new Array(6)
        .fill(0)
        .map(
          (_, k) =>
            `${Math.cos((k * Math.PI) / 3) * r} ${Math.sin((k * Math.PI) / 3) * r}`,
        )
        .join(" ")}
      fill="#ffd23f"
      stroke={INK}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <circle r={r * 0.55} fill="#f6d99b" stroke={INK} strokeWidth={5} />
    <circle r={r * 0.2} fill={INK} />
    <circle cx={r * 0.72} cy={0} r={r * 0.1} fill="#e63946" />
  </g>
);

/* ---------- きせつ ---------- */
export const Sakura: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {new Array(5).fill(0).map((_, k) => (
      <ellipse
        key={k}
        cx={0}
        cy={-38}
        rx={26}
        ry={36}
        fill="#ffc2d4"
        stroke={INK}
        strokeWidth={5}
        transform={`rotate(${k * 72})`}
      />
    ))}
    <circle r={14} fill="#ff8fa3" stroke={INK} strokeWidth={4} />
  </g>
);

export const Momiji: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => {
  const pts: string[] = [];
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const r = k % 2 === 0 ? 80 : 32;
    pts.push(`${Math.cos(a) * r} ${Math.sin(a) * r}`);
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path
        d="M 0 20 L 0 100"
        stroke="#b5532c"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <polygon
        points={pts.join(" ")}
        fill="#ff8a3d"
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </g>
  );
};

/** うきわ */
export const Ukiwa: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle r={80} fill="#ffffff" stroke={INK} strokeWidth={6} />
    {[0, 1, 2, 3].map((k) => (
      <path
        key={k}
        d="M 0 -80 A 80 80 0 0 1 56.6 -56.6 L 28.3 -28.3 A 40 40 0 0 0 0 -40 Z"
        fill="#ff4d6d"
        transform={`rotate(${k * 90})`}
      />
    ))}
    <circle r={40} fill={SEA} stroke={INK} strokeWidth={6} />
    <circle r={80} fill="none" stroke={INK} strokeWidth={6} />
  </g>
);
