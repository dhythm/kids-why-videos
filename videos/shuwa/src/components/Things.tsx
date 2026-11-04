import React from "react";
import { FONT } from "./Caption";
import { INK, SKIN } from "./Person";

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
    <g transform={`translate(${x} ${y + Math.sin(frame * 0.1 + x) * 5}) scale(${s})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} stroke={INK} strokeWidth={7} />
      <text textAnchor="middle" dominantBaseline="central" style={{ fontFamily: FONT, fontWeight: 800, fontSize: size }} fill={INK}>
        {text}
      </text>
    </g>
  );
};

/** だめ！ の ばつ（p: 0→1 で かかれる） */
export const BigX: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 1, p }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#e63946" strokeWidth={34} strokeLinecap="round" fill="none">
    <path d="M -120 -120 L 120 120" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 2)} />
    <path d="M 120 -120 L -120 120" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, p * 2 - 1))} />
  </g>
);

/** まる（p: 0→1 で かかれる） */
export const BigO: React.FC<{ x: number; y: number; s?: number; p: number; color?: string }> = ({ x, y, s = 1, p, color = "#ff5d8f" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={110} stroke={color} strokeWidth={32} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform="rotate(-90)" strokeLinecap="round" />
  </g>
);

export const Heart: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = "#ff5d8f" }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M 0 30 C -50 -5 -40 -45 -12 -42 C 0 -40 0 -30 0 -24 C 0 -30 0 -40 12 -42 C 40 -45 50 -5 0 30 Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );

/* ---------- おと の なみ（x,y から dir の むきへ ひろがる） ---------- */
export const SoundWaves: React.FC<{
  x: number;
  y: number;
  frame: number;
  dir?: number; // ど（0 = みぎ）
  reach?: number; // 0..1 どこまで とどくか
  color?: string;
  scale?: number;
}> = ({ x, y, frame, dir = 0, reach = 1, color = "#ff7b54", scale = 1 }) => {
  const arcs = [];
  for (let i = 0; i < 4; i++) {
    const k = ((frame * 0.025 + i / 4) % 1) * reach;
    const r = 30 + k * 260;
    const o = (1 - k / Math.max(0.01, reach)) * Math.min(1, k * 8);
    arcs.push(
      <path
        key={i}
        d={`M ${Math.cos(-0.6) * r} ${Math.sin(-0.6) * r} A ${r} ${r} 0 0 1 ${Math.cos(0.6) * r} ${Math.sin(0.6) * r}`}
        stroke={color}
        strokeWidth={14}
        strokeLinecap="round"
        fill="none"
        opacity={Math.max(0, o)}
      />,
    );
  }
  return <g transform={`translate(${x} ${y}) rotate(${dir}) scale(${scale})`}>{arcs}</g>;
};

/* ---------- 耳（よこから みた おおきな みみ） ---------- */
export const Ear: React.FC<{ x: number; y: number; s?: number; skin?: string }> = ({ x, y, s = 1, skin = SKIN }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 60 -150 Q -90 -170 -100 -20 Q -105 70 -40 110 Q 0 140 10 180 Q 20 220 70 210 Q 120 195 90 130 Q 70 90 90 40 Q 150 -40 120 -110 Q 100 -145 60 -150 Z" fill={skin} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <path d="M 50 -100 Q -40 -110 -45 -20 Q -48 30 -5 60" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
    <circle cx={30} cy={20} r={20} fill="#e8a888" />
  </g>
);

/* ---------- 目（ことばを めで みる） ---------- */
export const Eye: React.FC<{ x: number; y: number; s?: number; frame: number }> = ({ x, y, s = 1, frame }) => {
  const blink = frame % 100 > 94 ? 0.15 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`scale(1 ${blink})`}>
        <path d="M -120 0 Q 0 -100 120 0 Q 0 100 -120 0 Z" fill="#fff" stroke={INK} strokeWidth={9} />
        <circle r={42} fill="#6b4a2e" stroke={INK} strokeWidth={6} />
        <circle r={20} fill={INK} />
        <circle cx={12} cy={-14} r={9} fill="#fff" />
      </g>
      {[-60, -20, 20, 60].map((a) => (
        <path key={a} d={`M ${a * 1.4} ${-62 - Math.abs(a) * -0.3} l ${a * 0.25} -30`} stroke={INK} strokeWidth={8} strokeLinecap="round" />
      ))}
    </g>
  );
};

/* ---------- ことり・すず ---------- */
export const Bird: React.FC<{ x: number; y: number; s?: number; frame: number }> = ({ x, y, s = 1, frame }) => {
  const flap = Math.sin(frame * 0.4) * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={70} ry={55} fill="#ffcf4d" stroke={INK} strokeWidth={7} />
      <path d={`M -20 0 Q -70 ${-20 + flap} -60 ${30 + flap} Q -30 30 -20 0 Z`} fill="#f4a93a" stroke={INK} strokeWidth={6} />
      <circle cx={30} cy={-14} r={8} fill={INK} />
      <path d="M 62 -6 L 96 4 L 62 16 Z" fill="#ff8a3d" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -10 52 l -6 26 M 14 52 l 6 26" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

export const Bell: React.FC<{ x: number; y: number; s?: number; frame: number }> = ({ x, y, s = 1, frame }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(frame * 0.5) * 18} 0 -70)`}>
    <path d="M 0 -70 L 0 -95" stroke={INK} strokeWidth={8} />
    <path d="M -60 40 Q -60 -70 0 -70 Q 60 -70 60 40 Z" fill="#ffd54d" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-72} y={32} width={144} height={20} rx={10} fill="#f4b400" stroke={INK} strokeWidth={6} />
    <circle cx={0} cy={66} r={16} fill="#f4b400" stroke={INK} strokeWidth={6} />
  </g>
);

/* ---------- ふきだし ---------- */
export const Bubble: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  s: number;
  tail?: "left" | "right" | "down";
  children?: React.ReactNode;
  fill?: string;
}> = ({ x, y, w, h, s, tail = "down", children, fill = "#fff" }) => {
  if (s <= 0) {
    return null;
  }
  const t =
    tail === "left"
      ? `M ${-w / 2 + 10} 10 L ${-w / 2 - 50} 50 L ${-w / 2 + 20} 40 Z`
      : tail === "right"
        ? `M ${w / 2 - 10} 10 L ${w / 2 + 50} 50 L ${w / 2 - 20} 40 Z`
        : `M -30 ${h / 2 - 10} L -10 ${h / 2 + 50} L 30 ${h / 2 - 10} Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={t} fill={fill} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(60, h / 2)} fill={fill} stroke={INK} strokeWidth={7} />
      <path d={t} fill={fill} transform="scale(0.9)" />
      {children}
    </g>
  );
};

/** ふきだしの なかの もじ */
export const BubbleText: React.FC<{ text: string; size?: number; y?: number; color?: string }> = ({ text, size = 70, y = 0, color = INK }) => (
  <text y={y} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: FONT, fontWeight: 800, fontSize: size }} fill={color}>
    {text}
  </text>
);

/* ---------- ひらめき ---------- */
export const Bulb: React.FC<{ x: number; y: number; s: number; frame: number }> = ({ x, y, s, frame }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {new Array(8).fill(0).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const l = 95 + Math.sin(frame * 0.3 + i) * 8;
        return <path key={i} d={`M ${Math.cos(a) * 75} ${Math.sin(a) * 75 - 10} L ${Math.cos(a) * l} ${Math.sin(a) * l - 10}`} stroke="#ffb703" strokeWidth={12} strokeLinecap="round" />;
      })}
      <circle cx={0} cy={-10} r={55} fill="#ffe14d" stroke={INK} strokeWidth={7} />
      <rect x={-26} y={40} width={52} height={34} rx={8} fill="#b0b8c8" stroke={INK} strokeWidth={6} />
    </g>
  );

/* ---------- テレビ ---------- */
export const TV: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -60 -190 L 0 -150 L 60 -190" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
    <rect x={-250} y={-150} width={500} height={330} rx={30} fill="#5a5f7a" stroke={INK} strokeWidth={8} />
    <rect x={-225} y={-128} width={450} height={286} rx={16} fill="#cfe9ff" />
    <clipPath id="tvclip">
      <rect x={-225} y={-128} width={450} height={286} rx={16} />
    </clipPath>
    <g clipPath="url(#tvclip)">{children}</g>
    <rect x={-120} y={180} width={240} height={20} rx={8} fill="#5a5f7a" stroke={INK} strokeWidth={6} />
  </g>
);

/* ---------- がっこうの こくばん ---------- */
export const Blackboard: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 - 16} y={-h / 2 - 16} width={w + 32} height={h + 32} rx={14} fill="#b07a4a" stroke={INK} strokeWidth={7} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill="#2f6b4f" />
    {children}
  </g>
);

/* ---------- メモちょう ---------- */
export const Notepad: React.FC<{ x: number; y: number; s: number; text: string; rotate?: number }> = ({ x, y, s, text, rotate = -6 }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <rect x={-150} y={-110} width={300} height={220} rx={14} fill="#fffdf2" stroke={INK} strokeWidth={7} />
      <rect x={-150} y={-110} width={300} height={34} rx={14} fill="#ff8a65" stroke={INK} strokeWidth={7} />
      {[-20, 30, 80].map((ly) => (
        <path key={ly} d={`M -120 ${ly + 12} L 120 ${ly + 12}`} stroke="#b8d4f0" strokeWidth={4} />
      ))}
      <text x={0} y={20} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 58 }} fill={INK}>
        {text}
      </text>
    </g>
  );

/* ---------- でんしゃ（うるさい） ---------- */
export const Train: React.FC<{ x: number; y: number; s?: number; frame: number }> = ({ x, y, s = 1, frame }) => {
  const bounce = Math.abs(Math.sin(frame * 0.6)) * -4;
  return (
    <g transform={`translate(${x} ${y + bounce}) scale(${s})`}>
      {[0, 1].map((c) => (
        <g key={c} transform={`translate(${c * 330} 0)`}>
          <rect x={0} y={-150} width={310} height={150} rx={30} fill={c === 0 ? "#4fb3bf" : "#7ccbd4"} stroke={INK} strokeWidth={7} />
          {[0, 1, 2].map((w) => (
            <rect key={w} x={28 + w * 92} y={-125} width={70} height={56} rx={10} fill="#e6f7ff" stroke={INK} strokeWidth={5} />
          ))}
          <rect x={0} y={-40} width={310} height={14} fill="#ffd166" />
          <circle cx={70} cy={8} r={24} fill="#555" stroke={INK} strokeWidth={6} />
          <circle cx={240} cy={8} r={24} fill="#555" stroke={INK} strokeWidth={6} />
        </g>
      ))}
    </g>
  );
};

/* ---------- まど（ガラス） ---------- */
export const WindowFrame: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#d9f2ff" opacity={0.45} stroke="#8a6b4a" strokeWidth={22} />
    <path d={`M ${-w / 2 + 40} ${-h / 2 + 60} l 60 -40 M ${-w / 2 + 40} ${-h / 2 + 130} l 120 -80`} stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.8} />
  </g>
);

/* ---------- ちゃぶだい ---------- */
export const Table: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 420 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={0} width={w} height={34} rx={12} fill="#c8925a" stroke={INK} strokeWidth={7} />
    <rect x={-w / 2 + 30} y={30} width={26} height={90} fill="#a8743f" stroke={INK} strokeWidth={6} />
    <rect x={w / 2 - 56} y={30} width={26} height={90} fill="#a8743f" stroke={INK} strokeWidth={6} />
  </g>
);

/* ---------- ほいくえんの へや ---------- */
export const Room: React.FC<{ frame: number; wall?: string; floor?: string }> = ({ frame, wall = "#fff1d6", floor = "#e8c79a" }) => {
  const flags = ["#ff8fa3", "#ffd166", "#7bd389", "#7ec8e3", "#b69cff"];
  return (
    <g>
      <rect width={1920} height={1080} fill={wall} />
      <rect y={830} width={1920} height={250} fill={floor} />
      <rect y={822} width={1920} height={14} fill="#c9a374" />
      {/* まど */}
      <rect x={120} y={200} width={380} height={300} rx={16} fill="#bfe9ff" stroke="#8a6b4a" strokeWidth={14} />
      <path d="M 310 200 L 310 500 M 120 350 L 500 350" stroke="#8a6b4a" strokeWidth={10} />
      <circle cx={420 + Math.sin(frame * 0.02) * 6} cy={270} r={34} fill="#ffe14d" />
      {/* ガーランド */}
      <path d="M 0 90 Q 960 190 1920 90" stroke="#8a6b4a" strokeWidth={5} fill="none" />
      {new Array(16).fill(0).map((_, i) => {
        const t = (i + 0.5) / 16;
        const fx = t * 1920;
        const fy = 90 + 4 * 100 * t * (1 - t);
        return <path key={i} d={`M ${fx - 34} ${fy} L ${fx + 34} ${fy} L ${fx} ${fy + 70} Z`} fill={flags[i % flags.length]} stroke={INK} strokeWidth={4} strokeLinejoin="round" />;
      })}
    </g>
  );
};

/** て の アイコン（ひらいた て） */
export const HandIcon: React.FC<{ x: number; y: number; s?: number; rotate?: number; skin?: string }> = ({ x, y, s = 1, rotate = 0, skin = SKIN }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`} fill={skin} stroke={INK} strokeWidth={6} strokeLinejoin="round">
    {[-36, -12, 12, 36].map((fx, i) => (
      <rect key={fx} x={fx - 11} y={-95 + Math.abs(i - 1.5) * 12} width={22} height={90} rx={11} />
    ))}
    <rect x={-60} y={-20} width={44} height={22} rx={11} transform="rotate(-40 -40 -10)" />
    <rect x={-50} y={-30} width={100} height={90} rx={36} />
  </g>
);
