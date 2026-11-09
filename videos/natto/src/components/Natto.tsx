import React from "react";
import { random } from "remotion";
import { Face } from "./Characters";
import { INK } from "./Things";
import { sagFor, threadPath, threadWidth, XY } from "../lib/strings";
import { mix } from "../lib/color";

type Mood = "smile" | "wow" | "sleep";

export const SOY = "#f3d58b"; // にた だいず
export const NATTO = "#c98a45"; // なっとう
export const KIN = "#9ee6c9"; // なっとうきん
export const NEBA = "#fffbe8"; // ネバネバ
export const GLU = "#ffb86b"; // グルタミンさん

/* ---------- まめ ---------- */
export const Soybean: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  natto?: number; // 0: にた だいず 〜 1: なっとう
  film?: number; // しろい ネバネバの まく
}> = ({ x, y, s = 1, rot = 0, natto = 0, film = 0 }) => {
  if (s <= 0) {
    return null;
  }
  const fill = mix(SOY, NATTO, natto);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse rx={40} ry={33} fill={fill} stroke={INK} strokeWidth={5} />
      <path
        d="M -4 -20 q -9 20 0 40"
        stroke={mix("#c9a352", "#8a5a2b", natto)}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={-16} cy={-14} rx={9} ry={5} fill="#fff" opacity={0.6} />
      {film > 0 ? (
        <ellipse
          rx={44}
          ry={37}
          fill={NEBA}
          opacity={film * 0.45}
          stroke={NEBA}
          strokeWidth={4}
        />
      ) : null}
    </g>
  );
};

/* ---------- ネバネバの いと ---------- */
export const StickyThread: React.FC<{
  a: XY;
  b: XY;
  length: number; // いとの ながさ（これより はなれると ぴんと はる）
  base?: number;
  opacity?: number;
}> = ({ a, b, length, base = 9, opacity = 1 }) => {
  if (opacity <= 0) {
    return null;
  }
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const w = threadWidth(dist, length * 0.6, base);
  const d = threadPath(a, b, sagFor(dist, length));
  return (
    <g opacity={opacity}>
      <path
        d={d}
        stroke="#e8dcb0"
        strokeWidth={w + 3}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
      <path
        d={d}
        stroke={NEBA}
        strokeWidth={w}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={d}
        stroke="#ffffff"
        strokeWidth={Math.max(1, w * 0.3)}
        fill="none"
        strokeLinecap="round"
        transform="translate(-2 -2)"
      />
    </g>
  );
};

/* ---------- なっとうの はち ---------- */
const BOWL_BEANS = new Array(16).fill(0).map((_, i) => ({
  r: 40 + random(`br${i}`) * 120,
  a: random(`ba${i}`) * Math.PI * 2,
  h: random(`bh${i}`) * 40,
  rot: random(`bo${i}`) * 180,
}));

/** はち。げんてんは ふちの まんなか */
export const NattoBowl: React.FC<{
  x: number;
  y: number;
  s?: number;
  stir?: number; // まめが まわる かくど（ラジアン）
  natto?: number;
  foam?: number; // ふわふわの あわ 0..1
  empty?: boolean;
}> = ({ x, y, s = 1, stir = 0, natto = 1, foam = 0, empty = false }) => {
  if (s <= 0) {
    return null;
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse rx={220} ry={56} fill="#7a4a2a" stroke={INK} strokeWidth={7} />
      {empty
        ? null
        : BOWL_BEANS.map((b, i) => {
            const a = b.a + stir * (1 - b.r / 260);
            return (
              <Soybean
                key={i}
                x={Math.cos(a) * b.r}
                y={Math.sin(a) * b.r * 0.25 - 10 - b.h * 0.6}
                s={0.95}
                rot={b.rot + stir * 30}
                natto={natto}
                film={foam}
              />
            );
          })}
      {foam > 0
        ? new Array(14).fill(0).map((_, i) => (
            <circle
              key={i}
              cx={Math.cos(i * 2.4 + stir) * (40 + (i % 5) * 32)}
              cy={Math.sin(i * 2.4 + stir) * 26 - 30 - (i % 3) * 10}
              r={10 + (i % 4) * 5}
              fill="#ffffff"
              stroke="#e8dcb0"
              strokeWidth={3}
              opacity={foam * 0.9}
            />
          ))
        : null}
      <path
        d="M -220 0 Q -200 190 0 200 Q 200 190 220 0 Q 110 56 0 56 Q -110 56 -220 0 Z"
        fill="#e05d4a"
        stroke={INK}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      <path
        d="M -150 80 Q -20 150 140 90"
        stroke="#ffffff"
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="2 40"
      />
      <ellipse
        cx={-120}
        cy={70}
        rx={26}
        ry={12}
        fill="#ffffff"
        opacity={0.4}
      />
    </g>
  );
};

/* ---------- おはし（さきっぽが げんてん） ---------- */
export const Chopsticks: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 20 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-14, 14].map((dx, i) => (
      <g key={i} transform={`rotate(${dx * 0.25})`}>
        <path
          d={`M ${dx * 0.3} 0 L ${dx} -420`}
          stroke={INK}
          strokeWidth={22}
          strokeLinecap="round"
        />
        <path
          d={`M ${dx * 0.3} 0 L ${dx} -420`}
          stroke="#e9b872"
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path
          d={`M ${dx * 0.85} -320 L ${dx} -420`}
          stroke="#b5482f"
          strokeWidth={12}
          strokeLinecap="round"
        />
      </g>
    ))}
  </g>
);

/* ---------- なっとうきん ---------- */
export const NattoKin: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  rot?: number;
  mood?: Mood;
  opacity?: number;
  color?: string;
}> = ({
  x,
  y,
  s = 1,
  frame,
  rot = 0,
  mood = "smile",
  opacity = 1,
  color = KIN,
}) => {
  if (s <= 0) {
    return null;
  }
  // からだの まわりの ちいさな け（べんもう）
  const hairs = [
    [-60, -44, -100],
    [0, -48, -90],
    [60, -44, -80],
    [-60, 44, 100],
    [0, 48, 90],
    [60, 44, 80],
    [-92, 0, 180],
    [92, 0, 0],
  ];
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
      opacity={opacity}
    >
      {hairs.map(([hx, hy, deg], i) => {
        const a = (deg * Math.PI) / 180;
        const w = Math.sin(frame * 0.35 + i * 1.3) * 10;
        const ex = hx + Math.cos(a) * 46;
        const ey = hy + Math.sin(a) * 46;
        const nx = -Math.sin(a) * w;
        const ny = Math.cos(a) * w;
        return (
          <path
            key={i}
            d={`M ${hx} ${hy} Q ${(hx + ex) / 2 + nx} ${(hy + ey) / 2 + ny} ${ex} ${ey}`}
            stroke={INK}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
      <rect
        x={-95}
        y={-50}
        width={190}
        height={100}
        rx={50}
        fill={color}
        stroke={INK}
        strokeWidth={6}
      />
      <ellipse cx={-50} cy={-26} rx={22} ry={9} fill="#fff" opacity={0.6} />
      <Face r={44} frame={frame} mood={mood} blinkOffset={Math.round(x)} />
    </g>
  );
};

/** たくさんの なっとうきん（はいけい・まめの うえ） */
export const KinCrowd: React.FC<{
  frame: number;
  count: number;
  seed: string;
  area: [number, number, number, number]; // x, y, w, h
  s?: number;
  show?: number; // 0..1 なんびき でるか
  opacity?: number;
}> = ({ frame, count, seed, area, s = 0.4, show = 1, opacity = 1 }) => {
  const [ax, ay, aw, ah] = area;
  const n = Math.round(count * show);
  return (
    <g opacity={opacity}>
      {new Array(n).fill(0).map((_, i) => (
        <NattoKin
          key={i}
          x={ax + random(`${seed}x${i}`) * aw + Math.sin(frame * 0.04 + i) * 8}
          y={ay + random(`${seed}y${i}`) * ah + Math.cos(frame * 0.05 + i) * 8}
          s={s * (0.8 + random(`${seed}s${i}`) * 0.4)}
          rot={random(`${seed}r${i}`) * 360}
          frame={frame + i * 7}
        />
      ))}
    </g>
  );
};

/* ---------- わらづと（いねの わらで つつんだ なっとう） ---------- */
export const Wara: React.FC<{
  x: number;
  y: number;
  s?: number;
  open?: number; // まんなかが ひらいて なっとうが みえる
}> = ({ x, y, s = 1, open = 0 }) => {
  if (s <= 0) {
    return null;
  }
  const bulge = 70 + open * 60;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {new Array(13).fill(0).map((_, i) => {
        const k = (i - 6) / 6;
        const yy = k * bulge;
        return (
          <path
            key={i}
            d={`M -330 ${k * 26} Q -170 ${yy} 0 ${yy} Q 170 ${yy} 330 ${k * 26}`}
            stroke={i % 2 ? "#e2b84f" : "#f2d27a"}
            strokeWidth={22}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
      {open > 0 ? (
        <g opacity={open}>
          <ellipse rx={150} ry={50 * open} fill="#7a4a2a" />
          {[-90, -30, 30, 90, -60, 0, 60].map((bx, i) => (
            <Soybean
              key={i}
              x={bx}
              y={(i < 4 ? 8 : -18) * open}
              s={0.8 * open}
              natto={1}
              film={0.5}
              rot={i * 40}
            />
          ))}
        </g>
      ) : null}
      {[-250, 250].map((tx) => (
        <rect
          key={tx}
          x={tx - 16}
          y={-48}
          width={32}
          height={96}
          rx={10}
          fill="#c98a4b"
          stroke={INK}
          strokeWidth={5}
        />
      ))}
      {[-330, 330].map((ex) => (
        <path
          key={ex}
          d={`M ${ex} -30 L ${ex + Math.sign(ex) * 50} -50 M ${ex} 0 L ${ex + Math.sign(ex) * 60} 0 M ${ex} 30 L ${ex + Math.sign(ex) * 50} 50`}
          stroke="#e2b84f"
          strokeWidth={14}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

/* ---------- つくりかたの どうぐ ---------- */

/** みずに つけた だいず */
export const WaterBowl: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse rx={170} ry={44} fill="#9fd8ff" stroke={INK} strokeWidth={6} />
      {[-90, -30, 30, 90, -60, 0, 60].map((bx, i) => (
        <Soybean
          key={i}
          x={bx}
          y={i < 4 ? 8 : -12}
          s={0.7}
          rot={i * 50}
        />
      ))}
      <ellipse rx={170} ry={44} fill="#9fd8ff" opacity={0.45} />
      <path
        d="M -170 0 Q -150 150 0 156 Q 150 150 170 0 Q 85 44 0 44 Q -85 44 -170 0 Z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    </g>
  );

/** ゆげの でる おなべ（むす） */
export const SteamPot: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
}> = ({ x, y, s = 1, frame }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-60, 0, 60].map((sx, i) => {
        const t = ((frame + i * 12) % 40) / 40;
        return (
          <path
            key={i}
            d={`M ${sx} ${-90 - t * 60} q 18 -24 0 -48 q -18 -24 0 -48`}
            stroke="#ffffff"
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
            opacity={1 - t}
          />
        );
      })}
      <path
        d="M -150 -70 Q 0 -130 150 -70 Z"
        fill="#9aa7c7"
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <circle cx={0} cy={-104} r={14} fill="#6c7a99" stroke={INK} strokeWidth={5} />
      <rect
        x={-150}
        y={-70}
        width={300}
        height={160}
        rx={24}
        fill="#b8c4e0"
        stroke={INK}
        strokeWidth={6}
      />
      <rect x={-190} y={-40} width={44} height={22} rx={10} fill="#6c7a99" stroke={INK} strokeWidth={5} />
      <rect x={146} y={-40} width={44} height={22} rx={10} fill="#6c7a99" stroke={INK} strokeWidth={5} />
      <path d="M -120 110 L 120 110" stroke="#ff7b54" strokeWidth={14} strokeLinecap="round" strokeDasharray="20 18" />
    </g>
  );

/** あったかい はこ（おんどけい つき） */
export const WarmBox: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  children?: React.ReactNode;
}> = ({ x, y, s = 1, frame, children }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={200 + Math.sin(frame * 0.15) * 10} fill="#ffcf70" opacity={0.35} />
      <rect
        x={-170}
        y={-130}
        width={340}
        height={260}
        rx={30}
        fill="#f6b26b"
        stroke={INK}
        strokeWidth={6}
      />
      <rect x={-140} y={-100} width={220} height={200} rx={20} fill="#fff1d6" stroke={INK} strokeWidth={5} />
      <g transform="translate(-30 20)">{children}</g>
      {/* おんどけい */}
      <rect x={100} y={-100} width={40} height={170} rx={20} fill="#ffffff" stroke={INK} strokeWidth={5} />
      <rect x={112} y={-40 + Math.sin(frame * 0.1) * 4} width={16} height={100} rx={8} fill="#ff5a5a" />
      <circle cx={120} cy={80} r={26} fill="#ff5a5a" stroke={INK} strokeWidth={5} />
    </g>
  );

/* ---------- グルタミンさん（うまみの もと）と くさり ---------- */
export const GluBead: React.FC<{
  x: number;
  y: number;
  r?: number;
  frame: number;
  face?: boolean;
  color?: string;
}> = ({ x, y, r = 40, frame, face = false, color = GLU }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={color} stroke={INK} strokeWidth={Math.max(3, r * 0.12)} />
    <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.25} ry={r * 0.13} fill="#fff" opacity={0.6} />
    {face ? <Face r={r * 0.9} frame={frame} blinkOffset={Math.round(x)} /> : null}
  </g>
);

/** たまが てを つないだ くさり */
export const Chain: React.FC<{
  points: XY[];
  r?: number;
  frame: number;
  faces?: boolean;
  color?: string;
  show?: number; // 0..1 ひだりから じゅんに つながる
}> = ({ points, r = 40, frame, faces = true, color = GLU, show = 1 }) => {
  const n = Math.round(points.length * show);
  const ps = points.slice(0, n);
  if (ps.length === 0) {
    return null;
  }
  const d = ps.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={r * 0.55} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="#ffe3b8" strokeWidth={r * 0.3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {ps.map((p, i) => (
        <GluBead
          key={i}
          x={p.x}
          y={p.y}
          r={r}
          frame={frame + i * 9}
          face={faces && i % 2 === 0}
          color={color}
        />
      ))}
    </g>
  );
};

/** あわ（くうき） */
export const Bubble: React.FC<{ x: number; y: number; r: number }> = ({
  x,
  y,
  r,
}) =>
  r <= 0 ? null : (
    <g>
      <circle cx={x} cy={y} r={r} fill="#ffffff" opacity={0.55} stroke="#ffffff" strokeWidth={4} />
      <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.22} fill="#ffffff" />
    </g>
  );

/** ネバネバの おふとん（なっとうきんを つつむ） */
export const NebaBlanket: React.FC<{
  x: number;
  y: number;
  s: number;
  frame: number;
}> = ({ x, y, s, frame }) => {
  if (s <= 0) {
    return null;
  }
  const pts = new Array(12).fill(0).map((_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const rr = 1 + Math.sin(frame * 0.08 + i * 1.7) * 0.06;
    return { x: Math.cos(a) * 200 * rr, y: Math.sin(a) * 140 * rr };
  });
  const d =
    pts
      .map((p, i) => {
        const q = pts[(i + 1) % pts.length];
        const mx = (p.x + q.x) / 2;
        const my = (p.y + q.y) / 2;
        return `${i === 0 ? `M ${mx} ${my}` : ""} Q ${q.x} ${q.y} ${(q.x + pts[(i + 2) % pts.length].x) / 2} ${(q.y + pts[(i + 2) % pts.length].y) / 2}`;
      })
      .join(" ") + " Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={d} fill={NEBA} opacity={0.55} stroke="#e8dcb0" strokeWidth={8} />
      <path d="M -120 -70 Q -60 -110 20 -100" stroke="#ffffff" strokeWidth={12} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** からっぽの おさら */
export const EmptyPlate: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse rx={150} ry={50} fill="#ffffff" stroke={INK} strokeWidth={6} />
      <ellipse rx={95} ry={28} fill="#eef3ff" stroke="#c8d2e8" strokeWidth={4} />
    </g>
  );

/* ---------- はかせ ---------- */
export const Microscope: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-20} width={220} height={30} rx={12} fill="#6c7a99" stroke={INK} strokeWidth={6} />
    <path d="M 40 -20 Q 90 -120 40 -220" stroke={INK} strokeWidth={34} fill="none" strokeLinecap="round" />
    <path d="M 40 -20 Q 90 -120 40 -220" stroke="#8a9bc2" strokeWidth={22} fill="none" strokeLinecap="round" />
    <rect x={-70} y={-110} width={120} height={18} rx={8} fill="#c8d2e8" stroke={INK} strokeWidth={5} />
    <g transform="rotate(-25 -10 -200)">
      <rect x={-40} y={-290} width={60} height={170} rx={18} fill="#f0f4ff" stroke={INK} strokeWidth={6} />
      <rect x={-48} y={-310} width={76} height={34} rx={10} fill="#6c7a99" stroke={INK} strokeWidth={6} />
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
    <rect x={-80} y={-66} width={160} height={164} rx={56} fill="#ffffff" stroke={INK} strokeWidth={5} />
    <path d="M -30 -66 L 0 0 L 30 -66" fill="#ffd166" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 0 0 L 0 96" stroke={INK} strokeWidth={4} />
    <circle cx={-30} cy={-160} r={24} fill="none" stroke={INK} strokeWidth={6} />
    <circle cx={30} cy={-160} r={24} fill="none" stroke={INK} strokeWidth={6} />
    <path d="M -6 -160 L 6 -160" stroke={INK} strokeWidth={6} />
  </g>
);

/** まるい むしめがね（なかに children を えがく） */
export const Lens: React.FC<{
  x: number;
  y: number;
  r: number;
  id: string;
  bg?: string;
  children?: React.ReactNode;
}> = ({ x, y, r, id, bg = "#fff4d8", children }) =>
  r <= 0 ? null : (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <circle cx={x} cy={y} r={r} fill={bg} />
      <g clipPath={`url(#${id})`}>{children}</g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth={14} />
      <circle cx={x} cy={y} r={r - 12} fill="none" stroke="#ffffff" strokeWidth={6} opacity={0.6} />
    </g>
  );
