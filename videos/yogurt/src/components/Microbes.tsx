import React from "react";
import { random } from "remotion";
import { Face } from "./Characters";
import { FONT } from "./Caption";
import { INK } from "./Things";

type Mood = "smile" | "wow" | "sleep";

/* ================= きん（さいきん）たち ================= */

/**
 * ビフィズスきん。からだが Y の じのように ふたまたに わかれ、さきが すこし ふくらむ。
 * まんなか（わかれめ）が げんてん。
 */
export const Bifido: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  rot?: number;
  mood?: Mood;
  color?: string;
  opacity?: number;
}> = ({
  x,
  y,
  s = 1,
  frame,
  rot = 0,
  mood = "smile",
  color = "#7aa7ff",
  opacity = 1,
}) => {
  if (s <= 0) {
    return null;
  }
  const wave = Math.sin(frame * 0.18 + x * 0.01) * 6;
  const ends: [number, number][] = [
    [-58 - wave * 0.6, -70 + wave],
    [58 + wave * 0.6, -70 - wave],
    [0, 86],
  ];
  const d = ends.map(([ex, ey]) => `M 0 0 L ${ex} ${ey}`).join(" ");
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
      opacity={opacity}
    >
      <path d={d} stroke={INK} strokeWidth={60} strokeLinecap="round" />
      {ends.map(([ex, ey], i) => (
        <circle key={`o${i}`} cx={ex} cy={ey} r={33} fill={INK} />
      ))}
      <path d={d} stroke={color} strokeWidth={48} strokeLinecap="round" />
      {ends.map(([ex, ey], i) => (
        <circle key={`c${i}`} cx={ex} cy={ey} r={27} fill={color} />
      ))}
      <ellipse cx={-50} cy={-78} rx={8} ry={5} fill="#fff" opacity={0.6} />
      <g transform="translate(0 14)">
        <Face r={52} frame={frame} mood={mood} blinkOffset={x} />
      </g>
    </g>
  );
};

/** ブルガリアきん（にゅうさんきん）。ほそながい ぼう の かたち */
export const Bulgaricus: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  rot?: number;
  mood?: Mood;
  opacity?: number;
}> = ({ x, y, s = 1, frame, rot = 0, mood = "smile", opacity = 1 }) => {
  if (s <= 0) {
    return null;
  }
  const bend = Math.sin(frame * 0.2 + y * 0.01) * 4;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot + bend}) scale(${s})`}
      opacity={opacity}
    >
      <rect
        x={-120}
        y={-38}
        width={240}
        height={76}
        rx={38}
        fill="#b7e07a"
        stroke={INK}
        strokeWidth={6}
      />
      <ellipse cx={-80} cy={-18} rx={14} ry={6} fill="#fff" opacity={0.6} />
      <g transform="translate(0 2)">
        <Face r={50} frame={frame} mood={mood} blinkOffset={y} />
      </g>
    </g>
  );
};

/** サーモフィルスきん（にゅうさんきん）。まるが くさりのように つながる */
export const Thermo: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  rot?: number;
  mood?: Mood;
  opacity?: number;
}> = ({ x, y, s = 1, frame, rot = 0, mood = "smile", opacity = 1 }) => {
  if (s <= 0) {
    return null;
  }
  const balls = [-96, -32, 32, 96];
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
      opacity={opacity}
    >
      {balls.map((bx, i) => (
        <circle
          key={i}
          cx={bx}
          cy={Math.sin(frame * 0.2 + i * 1.3) * 8}
          r={38}
          fill="#ffb3c7"
          stroke={INK}
          strokeWidth={6}
        />
      ))}
      <g transform={`translate(-32 ${Math.sin(frame * 0.2 + 1.3) * 8 + 2})`}>
        <Face r={40} frame={frame} mood={mood} blinkOffset={x} />
      </g>
    </g>
  );
};

const NATIVE_COLORS = ["#ffd166", "#9be3c4", "#ffa98a", "#c7a6ff", "#8fd3ff"];

/** おなかに もともと すんでいる いろいろな さいきん（まる・ぼう・くねくね） */
export const Native: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  kind: number;
  rot?: number;
  mood?: Mood;
  opacity?: number;
}> = ({ x, y, s = 1, frame, kind, rot = 0, mood = "smile", opacity = 1 }) => {
  if (s <= 0) {
    return null;
  }
  const color = NATIVE_COLORS[kind % NATIVE_COLORS.length];
  const shape = kind % 3;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
      opacity={opacity}
    >
      {shape === 0 ? (
        <circle r={56} fill={color} stroke={INK} strokeWidth={6} />
      ) : shape === 1 ? (
        <rect
          x={-80}
          y={-46}
          width={160}
          height={92}
          rx={46}
          fill={color}
          stroke={INK}
          strokeWidth={6}
        />
      ) : (
        <path
          d={`M -90 0 Q -45 ${-40 + Math.sin(frame * 0.2) * 12} 0 0 T 90 0`}
          stroke={INK}
          strokeWidth={62}
          strokeLinecap="round"
          fill="none"
        />
      )}
      {shape === 2 ? (
        <path
          d={`M -90 0 Q -45 ${-40 + Math.sin(frame * 0.2) * 12} 0 0 T 90 0`}
          stroke={color}
          strokeWidth={50}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
      <Face r={42} frame={frame} mood={mood} blinkOffset={kind * 13} />
    </g>
  );
};

/** だいちょうの なかで ふわふわ ただよう さいきんの むれ（はいけい） */
export const Crowd: React.FC<{
  frame: number;
  count: number;
  seed: string;
  s?: number;
  opacity?: number;
  area?: [number, number, number, number]; // x, y, w, h
  show?: number; // 0..1 じゅんばんに でてくる
}> = ({
  frame,
  count,
  seed,
  s = 0.5,
  opacity = 1,
  area = [0, 0, 1920, 1080],
  show = 1,
}) => {
  const [ax, ay, aw, ah] = area;
  const items: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const appear = Math.max(0, Math.min(1, show * count - i));
    if (appear <= 0) {
      continue;
    }
    const bx = ax + random(`${seed}x${i}`) * aw;
    const by = ay + random(`${seed}y${i}`) * ah;
    const sp = 0.02 + random(`${seed}s${i}`) * 0.03;
    const xx = bx + Math.sin(frame * sp + i) * 24;
    const yy = by + Math.cos(frame * sp * 1.3 + i * 2) * 18;
    const rot = random(`${seed}r${i}`) * 360 + Math.sin(frame * sp) * 10;
    const sc = s * (0.7 + random(`${seed}k${i}`) * 0.5) * appear;
    const kind = Math.floor(random(`${seed}t${i}`) * 7);
    items.push(
      kind === 6 ? (
        <Bifido key={i} x={xx} y={yy} s={sc} frame={frame} rot={rot} />
      ) : (
        <Native
          key={i}
          x={xx}
          y={yy}
          s={sc}
          frame={frame}
          kind={kind}
          rot={rot}
        />
      ),
    );
  }
  return <g opacity={opacity}>{items}</g>;
};

/* ================= もの ================= */

/** ヨーグルトの カップ（下の まんなか が げんてん） */
export const YogurtCup: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  label?: string;
}> = ({ x, y, s = 1, rot = 0, label = "ヨーグルト" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M -120 -220 L 120 -220 L 96 0 L -96 0 Z"
      fill="#ffffff"
      stroke={INK}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M -114 -160 L 114 -160 L 104 -70 L -104 -70 Z" fill="#6fb6ff" />
    <text
      x={0}
      y={-104}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30 }}
      fill="#ffffff"
    >
      {label}
    </text>
    <ellipse
      cx={0}
      cy={-220}
      rx={124}
      ry={26}
      fill="#fffdf6"
      stroke={INK}
      strokeWidth={7}
    />
    <ellipse cx={-10} cy={-218} rx={84} ry={14} fill="#f3efe4" />
  </g>
);

/** スプーン（さきの まるい ところが げんてん） */
export const Spoon: React.FC<{
  x: number;
  y: number;
  rot?: number;
  s?: number;
  full?: boolean;
}> = ({ x, y, rot = 0, s = 1, full = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect
      x={-9}
      y={20}
      width={18}
      height={150}
      rx={9}
      fill="#d8dde6"
      stroke={INK}
      strokeWidth={5}
    />
    <ellipse rx={32} ry={42} fill="#d8dde6" stroke={INK} strokeWidth={5} />
    {full ? <ellipse cy={-6} rx={24} ry={26} fill="#ffffff" /> : null}
  </g>
);

/** ぎゅうにゅうパック（下の まんなか） */
export const MilkCarton: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M -90 0 L -90 -260 L 0 -330 L 90 -260 L 90 0 Z"
      fill="#ffffff"
      stroke={INK}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <rect
      x={-30}
      y={-370}
      width={60}
      height={46}
      fill="#ffffff"
      stroke={INK}
      strokeWidth={6}
    />
    <path d="M -90 -260 L 90 -260" stroke={INK} strokeWidth={5} />
    <rect x={-90} y={-200} width={180} height={110} fill="#5aa0f0" />
    <text
      x={0}
      y={-145}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44 }}
      fill="#ffffff"
    >
      ミルク
    </text>
    <path
      d="M -90 0 L -90 -260 L 0 -330 L 90 -260 L 90 0 Z"
      fill="none"
      stroke={INK}
      strokeWidth={7}
      strokeLinejoin="round"
    />
  </g>
);

/** ガラスの びん（なかみ が かわる）。thick: 0 = さらさら、1 = とろーり */
export const Jar: React.FC<{
  x: number;
  y: number;
  s?: number;
  fill: number; // 0..1 どこまで はいっているか
  thick: number;
  frame: number;
}> = ({ x, y, s = 1, fill, thick, frame }) => {
  const top = -300 * fill;
  const wob = (1 - thick) * 10;
  const surf =
    fill <= 0
      ? ""
      : `M -150 ${top} Q -75 ${top - wob * Math.sin(frame * 0.3) - thick * 30} 0 ${top - thick * 34} T 150 ${top} L 150 -10 Q 150 0 140 0 L -140 0 Q -150 0 -150 -10 Z`;
  const r = Math.round(0xf6 + (0xfc - 0xf6) * thick);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M -160 -340 L -160 -10 Q -160 10 -140 10 L 140 10 Q 160 10 160 -10 L 160 -340"
        fill="#eef7ff"
        opacity={0.6}
      />
      {fill > 0 ? (
        <path
          d={surf}
          fill={`rgb(255, ${r}, ${Math.round(0xe8 + (0xf6 - 0xe8) * thick)})`}
          stroke="#e6c98f"
          strokeWidth={6}
        />
      ) : null}
      <path
        d="M -160 -340 L -160 -10 Q -160 10 -140 10 L 140 10 Q 160 10 160 -10 L 160 -340"
        fill="none"
        stroke={INK}
        strokeWidth={8}
        strokeLinejoin="round"
      />
      <rect
        x={-176}
        y={-360}
        width={352}
        height={30}
        rx={15}
        fill="#cfe6ff"
        stroke={INK}
        strokeWidth={6}
      />
      <path
        d="M -130 -280 L -130 -60"
        stroke="#ffffff"
        strokeWidth={14}
        strokeLinecap="round"
        opacity={0.7}
      />
    </g>
  );
};

/** すっぱい つぶ（さくさん・にゅうさん）。きいろい しずく に ちいさな かお */
export const SourDrop: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  color?: string;
}> = ({ x, y, s = 1, frame, color = "#ffe14d" }) =>
  s <= 0 ? null : (
    <g
      transform={`translate(${x} ${y + Math.sin(frame * 0.2 + x) * 6}) scale(${s})`}
    >
      <path
        d="M 0 -40 C 18 -14 30 0 30 14 C 30 32 16 42 0 42 C -16 42 -30 32 -30 14 C -30 0 -18 -14 0 -40 Z"
        fill={color}
        stroke={INK}
        strokeWidth={5}
      />
      <path
        d="M -10 14 l 6 -6 l 6 6 M 4 14 l 6 -6 l 6 6"
        stroke={INK}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M -6 28 q 6 -6 12 0"
        stroke={INK}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );

/** しょくもつせんい（みどりの すじ） */
export const Fiber: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  color?: string;
}> = ({ x, y, s = 1, rot = 0, color = "#7cc96b" }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {[-16, 0, 16].map((dy, i) => (
        <path
          key={i}
          d={`M -90 ${dy} C -50 ${dy - 22} -10 ${dy + 22} 30 ${dy} S 80 ${dy - 16} 96 ${dy}`}
          stroke={INK}
          strokeWidth={16}
          strokeLinecap="round"
          fill="none"
        />
      ))}
      {[-16, 0, 16].map((dy, i) => (
        <path
          key={`c${i}`}
          d={`M -90 ${dy} C -50 ${dy - 22} -10 ${dy + 22} 30 ${dy} S 80 ${dy - 16} 96 ${dy}`}
          stroke={i === 1 ? "#a6e08f" : color}
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </g>
  );

/** いぶくろ（だんめん）。cx, cy が まんなか */
export const Stomach: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => {
  const d =
    "M -140 -440 L -140 -250 C -400 -230 -440 120 -250 260 C -60 400 320 360 410 140 C 480 -20 380 -220 220 -240 C 110 -254 40 -250 30 -310 L 30 -440 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d={d}
        fill="#ff8fab"
        stroke={INK}
        strokeWidth={10}
        strokeLinejoin="round"
      />
      <path d={d} fill="#ffd2dc" transform="translate(0 10) scale(0.86)" />
    </g>
  );
};

/** みずの はいった コップ */
export const WaterGlass: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -80 -200 L 80 -200 L 64 0 L -64 0 Z" fill="#e8f6ff" />
    <path d="M -72 -140 L 72 -140 L 64 0 L -64 0 Z" fill="#7cc8ff" />
    <path
      d="M -80 -200 L 80 -200 L 64 0 L -64 0 Z"
      fill="none"
      stroke={INK}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path
      d="M -50 -120 L -44 -30"
      stroke="#ffffff"
      strokeWidth={10}
      strokeLinecap="round"
    />
  </g>
);

export const Banana: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M -110 -40 Q -60 70 60 50 Q 110 40 120 -10 Q 90 20 40 20 Q -40 20 -86 -56 Z"
      fill="#ffe14d"
      stroke={INK}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path
      d="M -110 -40 L -100 -66 L -86 -56"
      fill="#7a5235"
      stroke={INK}
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </g>
);

export const Apple: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M 0 -50 C -40 -80 -100 -50 -90 10 C -80 70 -30 90 0 70 C 30 90 80 70 90 10 C 100 -50 40 -80 0 -50 Z"
      fill="#ff5d5d"
      stroke={INK}
      strokeWidth={6}
    />
    <path
      d="M 0 -50 Q 4 -80 16 -94"
      stroke="#7a5235"
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 10 -76 Q 50 -100 60 -70 Q 30 -60 10 -76 Z"
      fill="#5cbf5a"
      stroke={INK}
      strokeWidth={4}
    />
    <ellipse cx={-46} cy={-20} rx={12} ry={20} fill="#fff" opacity={0.5} />
  </g>
);

/** けんびきょう */
export const Microscope: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect
      x={-110}
      y={-20}
      width={220}
      height={30}
      rx={12}
      fill="#6c7a99"
      stroke={INK}
      strokeWidth={6}
    />
    <path
      d="M 40 -20 Q 90 -120 40 -220"
      stroke={INK}
      strokeWidth={34}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 40 -20 Q 90 -120 40 -220"
      stroke="#8a9bc2"
      strokeWidth={22}
      fill="none"
      strokeLinecap="round"
    />
    <rect
      x={-70}
      y={-110}
      width={120}
      height={18}
      rx={8}
      fill="#c8d2e8"
      stroke={INK}
      strokeWidth={5}
    />
    <g transform="rotate(-25 -10 -200)">
      <rect
        x={-40}
        y={-290}
        width={60}
        height={170}
        rx={18}
        fill="#f0f4ff"
        stroke={INK}
        strokeWidth={6}
      />
      <rect
        x={-48}
        y={-310}
        width={76}
        height={34}
        rx={10}
        fill="#6c7a99"
        stroke={INK}
        strokeWidth={6}
      />
    </g>
  </g>
);

/** あかちゃん（かお と おくるみ）。おなかが げんてん */
export const Baby: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
}> = ({ x, y, s = 1, frame }) => (
  <g
    transform={`translate(${x} ${y + Math.sin(frame * 0.08) * 6}) scale(${s})`}
  >
    <ellipse
      cx={0}
      cy={40}
      rx={170}
      ry={200}
      fill="#ffe0ec"
      stroke={INK}
      strokeWidth={7}
    />
    <ellipse cx={0} cy={30} rx={120} ry={140} fill="#fff4f8" />
    <circle
      cx={0}
      cy={-200}
      r={120}
      fill="#ffe3cf"
      stroke={INK}
      strokeWidth={7}
    />
    <path
      d="M -10 -318 q 20 -30 30 -6 q -16 -6 -18 10"
      fill="none"
      stroke="#5b3a29"
      strokeWidth={8}
      strokeLinecap="round"
    />
    <g transform="translate(0 -190)">
      <Face r={110} frame={frame} mood="sleep" />
    </g>
  </g>
);

/** はかせの めがね と はくい（Kid の うえに かさねる） */
export const LabCoat: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect
      x={-80}
      y={-66}
      width={160}
      height={164}
      rx={56}
      fill="#ffffff"
      stroke={INK}
      strokeWidth={5}
    />
    <path
      d="M -30 -66 L 0 0 L 30 -66"
      fill="#ffd166"
      stroke={INK}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path d="M 0 0 L 0 96" stroke={INK} strokeWidth={4} />
    <circle
      cx={-30}
      cy={-160}
      r={24}
      fill="none"
      stroke={INK}
      strokeWidth={6}
    />
    <circle cx={30} cy={-160} r={24} fill="none" stroke={INK} strokeWidth={6} />
    <path d="M -6 -160 L 6 -160" stroke={INK} strokeWidth={6} />
  </g>
);

/** トイレ（べんざの まんなかが げんてん） */
export const Toilet: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect
      x={-130}
      y={-330}
      width={260}
      height={170}
      rx={24}
      fill="#ffffff"
      stroke={INK}
      strokeWidth={7}
    />
    <rect
      x={-60}
      y={-300}
      width={70}
      height={18}
      rx={9}
      fill="#cfd8e6"
      stroke={INK}
      strokeWidth={4}
    />
    <path
      d="M -90 -160 L 90 -160 L 70 40 Q 60 140 0 140 Q -60 140 -70 40 Z"
      fill="#ffffff"
      stroke={INK}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <ellipse
      cx={0}
      cy={-150}
      rx={180}
      ry={46}
      fill="#ffffff"
      stroke={INK}
      strokeWidth={7}
    />
    <ellipse cx={0} cy={-150} rx={120} ry={26} fill="#dbeeff" />
    <rect
      x={-80}
      y={140}
      width={160}
      height={30}
      rx={10}
      fill="#ffffff"
      stroke={INK}
      strokeWidth={7}
    />
  </g>
);
