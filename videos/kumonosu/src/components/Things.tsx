import React from "react";
import { Face, Cloud } from "./Characters";
import { FONT } from "./Caption";
import { SILK } from "./Web";

export const INK = "#2b2b4a";
export const SKY = "#c9ecff";
export const GRASS = "#9bd77f";
export const BARK = "#9a6b45";
export const LEAF = "#6cc26a";

/** にわ の えだの さき（ここに さいしょの いとを かける） */
export const BRANCH_L = { x: 430, y: 200 };
export const BRANCH_R = { x: 1490, y: 200 };
/** くものすの まんなか（にわの なか） */
export const WEB_C = { x: 960, y: 590 };

/* ---------- くも（あたまが うえ・おしりの さき = 0, 140） ---------- */
export const Spider: React.FC<{
  x: number;
  y: number;
  s?: number;
  rotate?: number;
  frame: number;
  walk?: number; // 0..1 あしを うごかす
  mood?: "smile" | "wow" | "sleep";
  tummy?: number; // 0..1 おなか いっぱい
}> = ({ x, y, s = 1, rotate = 0, frame, walk = 0, mood = "smile", tummy = 0 }) => {
  const legs: React.ReactNode[] = [];
  for (const side of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const wig = Math.sin(frame * 0.5 + k * 1.6 + (side > 0 ? Math.PI : 0)) * 0.28 * walk;
      const base = ((-55 + k * 35) * Math.PI) / 180 + wig;
      const sx = side * 26;
      const sy = -40 + k * 12;
      const kx = sx + side * Math.cos(base) * 78;
      const ky = sy + Math.sin(base) * 78 - 26;
      const b2 = base + 0.9;
      const fx = kx + side * Math.cos(b2) * 82;
      const fy = ky + Math.sin(b2) * 82;
      legs.push(
        <path
          key={`${side}${k}`}
          d={`M ${sx} ${sy} L ${kx} ${ky} L ${fx} ${fy}`}
          stroke={INK}
          strokeWidth={11}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />,
      );
    }
  }
  const ab = 1 + tummy * 0.18;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      {legs}
      {/* おなか */}
      <g transform={`translate(0 70) scale(${ab})`}>
        <ellipse rx={62} ry={74} fill="#ffcf3f" stroke={INK} strokeWidth={6} />
        <path d="M -55 -20 Q 0 -4 55 -20" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d="M -58 12 Q 0 28 58 12" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d="M -44 44 Q 0 58 44 44" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={72} r={8} fill="#ff9f5a" stroke={INK} strokeWidth={4} />
      </g>
      {/* あたま */}
      <circle cx={0} cy={-38} r={46} fill="#ffb347" stroke={INK} strokeWidth={6} />
      <g transform="translate(0 -38)">
        <Face r={46} frame={frame} mood={mood} />
      </g>
    </g>
  );
};

/* ---------- むし（こばえ） ---------- */
export const Bug: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  flap?: number; // 0..1 はねの ぱたぱた
  rotate?: number;
  wiggle?: number;
}> = ({ x, y, s = 1, frame, flap = 1, rotate = 0, wiggle = 0 }) => {
  const w = 0.35 + 0.65 * Math.abs(Math.sin(frame * 1.3)) * flap + (1 - flap) * 0.65;
  const wr = Math.sin(frame * 1.9) * 12 * wiggle;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate + wr}) scale(${s})`}>
      <g transform={`scale(1 ${w})`}>
        <ellipse cx={-26} cy={-34} rx={22} ry={36} fill="#e8f7ff" stroke={INK} strokeWidth={4} opacity={0.9} transform="rotate(-25 -26 -34)" />
        <ellipse cx={26} cy={-34} rx={22} ry={36} fill="#e8f7ff" stroke={INK} strokeWidth={4} opacity={0.9} transform="rotate(25 26 -34)" />
      </g>
      <ellipse cx={0} cy={10} rx={26} ry={34} fill="#7ccf9b" stroke={INK} strokeWidth={5} />
      <circle cx={0} cy={-30} r={24} fill="#a7e3b9" stroke={INK} strokeWidth={5} />
      <g transform="translate(0 -30)">
        <Face r={24} frame={frame} mood={wiggle > 0.2 ? "wow" : "smile"} blinkOffset={30} />
      </g>
    </g>
  );
};

/* ---------- にわ（そら・木・えだ・くさ） ---------- */
const Tree: React.FC<{ side: 1 | -1; tip: { x: number; y: number } }> = ({ side, tip }) => {
  const tx = side < 0 ? 60 : 1860;
  return (
    <g>
      <rect x={tx - 100} y={-20} width={200} height={1120} fill={BARK} stroke={INK} strokeWidth={7} />
      <path
        d={`M ${tx} 300 Q ${(tx + tip.x) / 2} ${tip.y + 40} ${tip.x} ${tip.y} L ${tip.x - side * 10} ${tip.y + 26} Q ${(tx + tip.x) / 2} ${tip.y + 80} ${tx} 360 Z`}
        fill={BARK}
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx={tip.x - side * (30 + i * 90)}
          cy={tip.y - 20 - (i % 2) * 18}
          rx={40}
          ry={22}
          fill={LEAF}
          stroke={INK}
          strokeWidth={5}
          transform={`rotate(${side * -20} ${tip.x - side * (30 + i * 90)} ${tip.y - 20})`}
        />
      ))}
      <circle cx={tx} cy={-40} r={190} fill={LEAF} stroke={INK} strokeWidth={7} />
    </g>
  );
};

export const Garden: React.FC<{ frame: number; sky?: string; sun?: number }> = ({
  frame,
  sky = SKY,
  sun = 1,
}) => (
  <g>
    <rect width={1920} height={1080} fill={sky} />
    {sun > 0 ? (
      <g transform={`translate(1560 140) scale(${sun})`}>
        {new Array(10).fill(0).map((_, i) => (
          <rect key={i} x={-6} y={-112} width={12} height={34} rx={6} fill="#ffd34d" transform={`rotate(${i * 36 + frame * 0.4})`} />
        ))}
        <circle r={66} fill="#ffe14d" stroke={INK} strokeWidth={6} />
      </g>
    ) : null}
    <Cloud x={700 - frame * 0.25} y={110} s={0.6} opacity={0.85} />
    <Cloud x={1250 - frame * 0.15} y={70} s={0.45} opacity={0.7} />
    <rect y={980} width={1920} height={120} fill={GRASS} />
    {new Array(30).fill(0).map((_, i) => (
      <path
        key={i}
        d={`M ${i * 66 + 10} 990 q ${8 + Math.sin(frame * 0.05 + i) * 6} -40 ${18} -60`}
        stroke="#5aa64a"
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
      />
    ))}
    <Tree side={-1} tip={BRANCH_L} />
    <Tree side={1} tip={BRANCH_R} />
  </g>
);

/** くものすを えだや 木に つなぐ いと（にわの いちに あわせてある） */
export const Moorings: React.FC<{ p?: number }> = ({ p = 1 }) => {
  if (p <= 0) {
    return null;
  }
  const lines = [
    [BRANCH_L.x, BRANCH_L.y, BRANCH_R.x, BRANCH_R.y],
    [510, 550, 160, 600],
    [1410, 550, 1760, 600],
    [660, 920, 560, 985],
    [1260, 920, 1360, 985],
  ];
  return (
    <g stroke={SILK} strokeWidth={5} strokeLinecap="round" opacity={p}>
      {lines.map(([a, b, c, d], i) => (
        <line key={i} x1={a} y1={b} x2={c} y2={d} />
      ))}
    </g>
  );
};

/* ---------- じてんしゃの タイヤ ---------- */
export const Wheel: React.FC<{ x: number; y: number; r: number; frame: number }> = ({ x, y, r, frame }) => {
  if (r <= 0) {
    return null;
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${frame * 2})`}>
      <circle r={r} fill="#ffffff" stroke={INK} strokeWidth={r * 0.16} />
      {new Array(12).fill(0).map((_, i) => (
        <line key={i} x1={0} y1={0} x2={Math.cos((i * Math.PI) / 6) * r} y2={Math.sin((i * Math.PI) / 6) * r} stroke="#8a8aa6" strokeWidth={r * 0.035} />
      ))}
      <circle r={r * 0.12} fill={INK} />
    </g>
  );
};

/* ---------- とけい ---------- */
export const Clock: React.FC<{ x: number; y: number; s: number; frame: number }> = ({ x, y, s, frame }) => {
  if (s <= 0) {
    return null;
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={90} fill="#ffffff" stroke={INK} strokeWidth={9} />
      {new Array(12).fill(0).map((_, i) => (
        <circle key={i} cx={Math.cos((i * Math.PI) / 6) * 70} cy={Math.sin((i * Math.PI) / 6) * 70} r={5} fill={INK} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-48} stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${frame * 0.6})`} />
      <line x1={0} y1={0} x2={0} y2={-66} stroke="#ff7b54" strokeWidth={7} strokeLinecap="round" transform={`rotate(${frame * 7})`} />
      <circle r={9} fill={INK} />
    </g>
  );
};

/* ---------- ハート ---------- */
export const Heart: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z"
    fill="#ff6b8b"
    stroke={INK}
    strokeWidth={5}
  />
);

/** ぶるぶる の なみ（cx,cy から ひろがる わ） */
export const Ripple: React.FC<{ x: number; y: number; frame: number; start: number; color?: string }> = ({
  x,
  y,
  frame,
  start,
  color = "#ff7b54",
}) => {
  if (frame < start) {
    return null;
  }
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const t = ((frame - start + i * 12) % 36) / 36;
        return (
          <circle key={i} cx={x} cy={y} r={20 + t * 90} fill="none" stroke={color} strokeWidth={8 * (1 - t)} opacity={1 - t} />
        );
      })}
    </g>
  );
};

/* ---------- やじるし・ラベル ---------- */
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

