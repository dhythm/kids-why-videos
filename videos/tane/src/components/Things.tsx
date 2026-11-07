import React from "react";
import { FONT } from "./Caption";

export const INK = "#2b2b4a";
export const SOIL = "#a9744f";
export const SOIL_DARK = "#7a5235";
export const LEAF = "#5cbf5a";
export const LEAF_DARK = "#3d9a42";
export const STEM = "#4caf50";

const SW = 6; // せんの ふとさ

/* ---------- ラベル・やじるし ---------- */

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

/** ラベルから ものへ のびる せん（p: 0..1 で のびる） */
export const Leader: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p: number;
}> = ({ x1, y1, x2, y2, p }) =>
  p <= 0 ? null : (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x1 + (x2 - x1) * p}
        y2={y1 + (y2 - y1) * p}
        stroke={INK}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="2 14"
      />
      {p >= 1 ? <circle cx={x2} cy={y2} r={10} fill={INK} /> : null}
    </g>
  );

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

/* ---------- たね ---------- */

/** かぼちゃの たね（ひらたい たまご がた） */
export const PumpkinSeed: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse
      rx={16}
      ry={9}
      fill="#fff3cf"
      stroke={INK}
      strokeWidth={3.5}
    />
    <ellipse rx={10} ry={4.5} fill="#ffe7a0" />
  </g>
);

/** ネギの たね（ちいさくて くろい） */
export const NegiSeed: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M -9 6 Q -10 -6 0 -10 Q 10 -6 9 6 Q 0 10 -9 6 Z"
      fill="#1f1f2e"
      stroke="#000"
      strokeWidth={1.5}
    />
    <ellipse cx={-3} cy={-3} rx={2.5} ry={1.6} fill="#ffffff" opacity={0.5} />
  </g>
);

/* ---------- かぼちゃ ---------- */

const PK_RX = 150;
const PK_RY = 112;
const PK_SKIN = "#3f7a3c";
const PK_SKIN_LIGHT = "#5a9a4f";
const PK_FLESH = "#ffb627";

// たねの ならび（まんなかの へこみに ぐるっと）
const PK_SEEDS: [number, number, number][] = [
  [-46, -18, 30],
  [-22, -32, 10],
  [6, -34, -15],
  [32, -24, -35],
  [50, -2, 80],
  [36, 22, 40],
  [10, 32, 15],
  [-18, 30, -20],
  [-44, 14, -60],
  [-8, -4, 70],
  [18, 6, -50],
];

/** かぼちゃ（まるごと）。そとが こい みどり の にほんの かぼちゃ */
export const Pumpkin: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d={`M -6 ${-PK_RY + 6} q -4 -36 18 -52`}
      stroke="#8a6a3a"
      strokeWidth={20}
      strokeLinecap="round"
      fill="none"
    />
    <ellipse
      rx={PK_RX}
      ry={PK_RY}
      fill={PK_SKIN}
      stroke={INK}
      strokeWidth={SW}
    />
    {[-0.62, -0.25, 0.25, 0.62].map((k) => (
      <path
        key={k}
        d={`M 0 ${-PK_RY + 8} Q ${k * PK_RX * 1.25} 0 0 ${PK_RY - 8}`}
        stroke={INK}
        strokeWidth={4}
        fill="none"
        opacity={0.55}
      />
    ))}
    <ellipse
      cx={-60}
      cy={-50}
      rx={34}
      ry={16}
      fill={PK_SKIN_LIGHT}
      opacity={0.8}
      transform="rotate(-25 -60 -50)"
    />
    {/* ぽつぽつ もよう */}
    {[
      [40, -40],
      [80, 10],
      [-90, 30],
      [-30, 60],
      [60, 60],
    ].map(([px, py], i) => (
      <circle key={i} cx={px} cy={py} r={5} fill="#9cc98a" opacity={0.7} />
    ))}
  </g>
);

/** かぼちゃの きりくち（よこから みた だんめん） */
const PumpkinFace: React.FC<{ seeds: number }> = ({ seeds }) => (
  <g>
    <ellipse
      rx={PK_RX}
      ry={PK_RY}
      fill={PK_SKIN}
      stroke={INK}
      strokeWidth={SW}
    />
    <ellipse rx={PK_RX - 12} ry={PK_RY - 11} fill={PK_FLESH} />
    <ellipse rx={78} ry={56} fill="#ffd36e" stroke="#f29e1f" strokeWidth={4} />
    {/* わた */}
    {[-50, -25, 0, 25, 50].map((dx, i) => (
      <path
        key={i}
        d={`M ${dx} -46 q ${i % 2 ? 14 : -14} 46 0 92`}
        stroke="#f6a623"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        opacity={0.8}
      />
    ))}
    {PK_SEEDS.slice(0, seeds).map(([sx, sy, r], i) => (
      <PumpkinSeed key={i} x={sx} y={sy} rot={r} />
    ))}
  </g>
);

/**
 * かぼちゃを きる。open = 0 は まるごと、0 より おおきいと
 * きりくちが みえて、ひだりと みぎに ひらく
 */
export const PumpkinCut: React.FC<{
  x: number;
  y: number;
  s?: number;
  open: number;
  seeds?: number;
}> = ({ x, y, s = 1, open, seeds = PK_SEEDS.length }) => {
  if (open <= 0) {
    return <Pumpkin x={x} y={y} s={s} />;
  }
  const d = open * 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id="pk-left">
          <rect x={-200} y={-200} width={200} height={400} />
        </clipPath>
        <clipPath id="pk-right">
          <rect x={0} y={-200} width={200} height={400} />
        </clipPath>
      </defs>
      <g transform={`translate(${-d} 0) rotate(${-open * 6})`}>
        <g clipPath="url(#pk-left)">
          <PumpkinFace seeds={seeds} />
        </g>
        <line
          x1={0}
          y1={-PK_RY}
          x2={0}
          y2={PK_RY}
          stroke={INK}
          strokeWidth={SW}
        />
      </g>
      <g transform={`translate(${d} 0) rotate(${open * 6})`}>
        <g clipPath="url(#pk-right)">
          <PumpkinFace seeds={seeds} />
        </g>
        <line
          x1={0}
          y1={-PK_RY}
          x2={0}
          y2={PK_RY}
          stroke={INK}
          strokeWidth={SW}
        />
      </g>
    </g>
  );
};

/** かぼちゃの はな（ほしがたの きいろい はな）。fruit: はなの したの ちいさな かぼちゃ */
export const PumpkinFlower: React.FC<{
  x: number;
  y: number;
  s?: number;
  bloom?: number; // 0..1
  wilt?: number; // 0..1 しぼむ
}> = ({ x, y, s = 1, bloom = 1, wilt = 0 }) => {
  const petals = 5;
  const open = bloom * (1 - wilt * 0.7);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={1 - wilt * 0.4}>
      {new Array(petals).fill(0).map((_, i) => {
        const a = (i / petals) * 360 - 90;
        return (
          <g key={i} transform={`rotate(${a}) scale(${0.3 + open * 0.7})`}>
            <path
              d="M 0 0 Q 30 -26 74 0 Q 30 26 0 0 Z"
              fill={wilt > 0.5 ? "#e0b84a" : "#ffd23f"}
              stroke={INK}
              strokeWidth={5}
              strokeLinejoin="round"
            />
            <path
              d="M 10 0 L 62 0"
              stroke="#f2a900"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
        );
      })}
      <circle r={18} fill="#ff9f1c" stroke={INK} strokeWidth={5} />
    </g>
  );
};

/** かぼちゃの は（おおきな まるい は） */
export const BigLeaf: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  color?: string;
}> = ({ x, y, s = 1, rot = 0, color = LEAF }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M 0 0 C -70 -10 -90 -90 -40 -120 C -20 -150 20 -150 40 -120 C 90 -90 70 -10 0 0 Z"
      fill={color}
      stroke={INK}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path
      d="M 0 0 L 0 -115 M 0 -40 L -40 -80 M 0 -40 L 40 -80"
      stroke={LEAF_DARK}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

/* ---------- ネギ ---------- */

/**
 * ネギ（たてに たっている）。(x, y) は ねもと。
 * green: みどりの は の ながさ、 hl: しろい ところを ひからせる、gl: みどりを ひからせる
 */
export const Negi: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  green?: number;
  hl?: number;
  gl?: number;
  roots?: boolean;
}> = ({ x, y, s = 1, rot = 0, green = 360, hl = 0, gl = 0, roots = true }) => {
  const white = 200;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {roots
        ? [-18, -9, 0, 9, 18].map((dx, i) => (
            <path
              key={i}
              d={`M ${dx * 0.8} 0 q ${dx * 0.6} 20 ${dx * 1.4} ${34 + (i % 2) * 10}`}
              stroke="#e8dcc0"
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
          ))
        : null}
      {/* みどりの は（3ぼん） */}
      {[
        [-1, -14],
        [1, 12],
        [0, 0],
      ].map(([k, tilt], i) => (
        <path
          key={i}
          d={`M ${k * 8 - 13} ${-white + 20} Q ${k * 10 - 14} ${-white - green * 0.5} ${k * 40 + tilt} ${-white - green} Q ${k * 10 + 14} ${-white - green * 0.5} ${k * 8 + 13} ${-white + 20} Z`}
          fill={i === 2 ? "#4fae4a" : "#5fc157"}
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      ))}
      {gl > 0 ? (
        <path
          d={`M -40 ${-white - green - 10} L 40 ${-white - green - 10} L 30 ${-white + 10} L -30 ${-white + 10} Z`}
          fill="#fff59d"
          opacity={gl * 0.45}
        />
      ) : null}
      {/* しろい ところ */}
      <rect
        x={-26}
        y={-white}
        width={52}
        height={white}
        rx={22}
        fill="#fbfbf2"
        stroke={INK}
        strokeWidth={5}
      />
      <rect x={-26} y={-white} width={52} height={50} fill="#d8efb0" />
      <rect
        x={-26}
        y={-white}
        width={52}
        height={white}
        rx={22}
        fill="none"
        stroke={INK}
        strokeWidth={5}
      />
      {hl > 0 ? (
        <rect
          x={-34}
          y={-white - 8}
          width={68}
          height={white + 16}
          rx={30}
          fill="#fff59d"
          opacity={hl * 0.45}
        />
      ) : null}
      <path
        d={`M -8 ${-white + 60} L -8 -16`}
        stroke="#e4e4d4"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </g>
  );
};

/** ネギの わぎり（まるい わっか。たねは ない） */
export const NegiSlice: React.FC<{
  x: number;
  y: number;
  s?: number;
  green?: boolean;
}> = ({ x, y, s = 1, green = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle
      r={34}
      fill={green ? "#a5dc86" : "#f6f9e6"}
      stroke={INK}
      strokeWidth={5}
    />
    <circle r={24} fill="none" stroke={green ? "#6fbf55" : "#d6e8b0"} strokeWidth={4} />
    <circle r={14} fill="none" stroke={green ? "#6fbf55" : "#d6e8b0"} strokeWidth={4} />
    <circle r={5} fill={green ? "#6fbf55" : "#d6e8b0"} />
  </g>
);

/** ネギ（よこに ねている）。cut: 0..1 で みぎはしから わぎりが とんでいく */
export const NegiLying: React.FC<{
  x: number;
  y: number;
  s?: number;
}> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(90) scale(${s})`}>
    <Negi x={0} y={0} green={240} roots={false} />
  </g>
);

/**
 * ねぎぼうず（ネギの はな）。(x, y) は くきの さき（たまの まんなか）。
 * open: 0 = とがった つぼみ、1 = まるい はなの たま。seeds: 0..1 で くろい たねが みえる
 */
export const NegiBozu: React.FC<{
  x: number;
  y: number;
  s?: number;
  open: number;
  seeds?: number;
  frame: number;
}> = ({ x, y, s = 1, open, seeds = 0, frame }) => {
  const R = 70;
  const florets: React.ReactNode[] = [];
  if (open > 0) {
    const n = 46;
    for (let i = 0; i < n; i++) {
      // フィボナッチ ならびで たまの ひょうめんに ちらす
      const a = i * 2.39996;
      const rr = Math.sqrt((i + 0.5) / n) * R * 0.92;
      const fx = Math.cos(a) * rr;
      const fy = Math.sin(a) * rr;
      const wob = Math.sin(frame * 0.08 + i) * 1.2;
      florets.push(
        <g key={i} transform={`translate(${fx + wob} ${fy}) scale(${open})`}>
          <path
            d="M 0 -9 L 3 -3 L 9 0 L 3 3 L 0 9 L -3 3 L -9 0 L -3 -3 Z"
            fill="#ffffff"
            stroke="#b9c9a0"
            strokeWidth={1.5}
          />
          <circle r={2.8} fill="#c8d86a" />
        </g>,
      );
    }
  }
  const seedPts: React.ReactNode[] = [];
  if (seeds > 0) {
    const n = 14;
    for (let i = 0; i < n; i++) {
      const a = i * 2.39996 + 0.6;
      const rr = Math.sqrt((i + 0.5) / n) * R * 0.8;
      seedPts.push(
        <NegiSeed
          key={i}
          x={Math.cos(a) * rr}
          y={Math.sin(a) * rr}
          s={seeds * 1.1}
          rot={i * 40}
        />,
      );
    }
  }
  // つぼみ（うすい かわに つつまれた とんがり）
  const budS = Math.max(0, 1 - open * 1.3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {open > 0 ? (
        <circle
          r={R * (0.55 + open * 0.45)}
          fill="#eef4dc"
          stroke={INK}
          strokeWidth={5}
        />
      ) : null}
      {florets}
      {seedPts}
      {budS > 0 ? (
        <g transform={`scale(${0.6 + budS * 0.4})`} opacity={budS}>
          <path
            d="M 0 -95 Q 42 -30 40 15 Q 30 50 0 52 Q -30 50 -40 15 Q -42 -30 0 -95 Z"
            fill="#e9eedb"
            stroke={INK}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <path
            d="M 0 -85 Q 12 -20 6 45"
            stroke="#c7d1ae"
            strokeWidth={4}
            fill="none"
          />
        </g>
      ) : null}
    </g>
  );
};

/* ---------- いろいろな やさい ---------- */

export const Tomato: React.FC<{
  x: number;
  y: number;
  s?: number;
  cut?: boolean;
  color?: string;
}> = ({ x, y, s = 1, cut = false, color = "#ff4d4d" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={78} ry={68} fill={color} stroke={INK} strokeWidth={SW} />
    {cut ? (
      <g>
        <ellipse rx={62} ry={53} fill="#ff8a7a" />
        {[0, 120, 240].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <ellipse cx={0} cy={-28} rx={22} ry={18} fill="#ffd166" opacity={0.9} />
            <ellipse cx={-7} cy={-30} rx={4} ry={6} fill="#fff6d0" stroke={INK} strokeWidth={2} />
            <ellipse cx={7} cy={-28} rx={4} ry={6} fill="#fff6d0" stroke={INK} strokeWidth={2} />
            <ellipse cx={0} cy={-18} rx={4} ry={6} fill="#fff6d0" stroke={INK} strokeWidth={2} />
          </g>
        ))}
        <circle r={12} fill="#ffb3a6" />
      </g>
    ) : (
      <g>
        <path
          d="M 0 -66 L -24 -82 L -10 -66 L -34 -60 L -6 -58 L 0 -40 L 6 -58 L 34 -60 L 10 -66 L 24 -82 Z"
          fill={STEM}
          stroke={INK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <ellipse cx={-34} cy={-22} rx={16} ry={9} fill="#fff" opacity={0.6} transform="rotate(-30 -34 -22)" />
      </g>
    )}
  </g>
);

export const Cucumber: React.FC<{
  x: number;
  y: number;
  s?: number;
  cut?: boolean;
}> = ({ x, y, s = 1, cut = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {cut ? (
      <g>
        <circle r={62} fill="#3f8f3a" stroke={INK} strokeWidth={SW} />
        <circle r={52} fill="#dff3c2" />
        {[0, 120, 240].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <ellipse cx={0} cy={-18} rx={14} ry={20} fill="#c3e39b" />
            <ellipse cx={0} cy={-22} rx={4} ry={7} fill="#fbfbe6" stroke={INK} strokeWidth={2} />
          </g>
        ))}
      </g>
    ) : (
      <g transform="rotate(-20)">
        <rect x={-130} y={-34} width={260} height={68} rx={34} fill="#3f8f3a" stroke={INK} strokeWidth={SW} />
        {[-90, -50, -10, 30, 70, 100].map((dx, i) => (
          <circle key={i} cx={dx} cy={i % 2 ? -12 : 10} r={4} fill="#a5d98a" />
        ))}
        <rect x={-130} y={-12} width={20} height={24} rx={6} fill="#ffe066" />
      </g>
    )}
  </g>
);

export const Piman: React.FC<{
  x: number;
  y: number;
  s?: number;
  cut?: boolean;
}> = ({ x, y, s = 1, cut = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {cut ? (
      <g>
        <path
          d="M -66 -20 Q -70 -62 -30 -64 Q 0 -74 30 -64 Q 70 -62 66 -20 Q 70 40 34 62 Q 0 74 -34 62 Q -70 40 -66 -20 Z"
          fill="#2fa84f"
          stroke={INK}
          strokeWidth={SW}
        />
        <path
          d="M -54 -16 Q -56 -50 -24 -52 Q 0 -60 24 -52 Q 56 -50 54 -16 Q 56 32 28 50 Q 0 60 -28 50 Q -56 32 -54 -16 Z"
          fill="#e9f7df"
        />
        <circle r={18} fill="#f4f1d0" />
        {new Array(10).fill(0).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <ellipse
              key={i}
              cx={Math.cos(a) * 26}
              cy={Math.sin(a) * 26}
              rx={6}
              ry={4}
              fill="#fff4c4"
              stroke={INK}
              strokeWidth={2}
              transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 26} ${Math.sin(a) * 26})`}
            />
          );
        })}
      </g>
    ) : (
      <g>
        <path
          d="M -60 -40 Q -64 -78 -26 -74 Q 0 -84 26 -74 Q 64 -78 60 -40 Q 62 40 30 76 Q 0 92 -30 76 Q -62 40 -60 -40 Z"
          fill="#2fa84f"
          stroke={INK}
          strokeWidth={SW}
        />
        <path d="M -20 -70 Q -24 0 -14 70" stroke="#1f8a3c" strokeWidth={5} fill="none" />
        <path d="M 22 -70 Q 26 0 16 70" stroke="#1f8a3c" strokeWidth={5} fill="none" />
        <path d="M 0 -80 q -4 -24 16 -34" stroke="#4caf50" strokeWidth={14} strokeLinecap="round" fill="none" />
      </g>
    )}
  </g>
);

export const Cabbage: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={86} fill="#a7dd7c" stroke={INK} strokeWidth={SW} />
    <path d="M -86 0 Q -60 -90 20 -84 Q -40 -50 -46 30 Z" fill="#c4ec9a" stroke={INK} strokeWidth={4} />
    <path d="M 86 10 Q 70 -80 0 -86 Q 60 -40 50 50 Z" fill="#bde68f" stroke={INK} strokeWidth={4} />
    <path d="M -20 -60 Q 0 0 -10 70 M 20 -50 Q 34 0 30 60" stroke="#78b85a" strokeWidth={4} fill="none" />
  </g>
);

export const Spinach: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-34, -12, 12, 34].map((a, i) => (
      <g key={i} transform={`rotate(${a} 0 70)`}>
        <path d="M 0 70 L 0 -10" stroke="#5aa64a" strokeWidth={9} strokeLinecap="round" />
        <path
          d="M 0 -6 C -40 -20 -40 -90 0 -120 C 40 -90 40 -20 0 -6 Z"
          fill={i % 2 ? "#2f8f3e" : "#38a047"}
          stroke={INK}
          strokeWidth={5}
        />
        <path d="M 0 -10 L 0 -105" stroke="#1f6f2e" strokeWidth={3} />
      </g>
    ))}
    <ellipse cx={0} cy={78} rx={16} ry={12} fill="#ff6f91" stroke={INK} strokeWidth={4} />
  </g>
);

export const Carrot: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-18, 0, 18].map((a) => (
      <path
        key={a}
        d={`M 0 -60 q ${a} -40 ${a * 1.8} -80`}
        stroke="#4caf50"
        strokeWidth={14}
        strokeLinecap="round"
        fill="none"
      />
    ))}
    <path
      d="M -40 -62 Q 0 -74 40 -62 Q 30 40 0 120 Q -30 40 -40 -62 Z"
      fill="#ff8c1a"
      stroke={INK}
      strokeWidth={SW}
      strokeLinejoin="round"
    />
    {[-20, 10, 40].map((yy, i) => (
      <path
        key={i}
        d={`M ${i % 2 ? 6 : -26} ${yy} l 20 0`}
        stroke="#d96c00"
        strokeWidth={5}
        strokeLinecap="round"
      />
    ))}
  </g>
);

export const Daikon: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-22, 0, 22].map((a) => (
      <path
        key={a}
        d={`M 0 -100 q ${a} -50 ${a * 2} -100`}
        stroke="#4caf50"
        strokeWidth={18}
        strokeLinecap="round"
        fill="none"
      />
    ))}
    <path
      d="M -40 -100 Q 0 -112 40 -100 Q 46 60 0 150 Q -46 60 -40 -100 Z"
      fill="#fbfbf4"
      stroke={INK}
      strokeWidth={SW}
      strokeLinejoin="round"
    />
    <path d="M -40 -100 Q 0 -112 40 -100 L 40 -64 Q 0 -72 -40 -64 Z" fill="#d6efb0" />
    <path
      d="M -40 -100 Q 0 -112 40 -100 Q 46 60 0 150 Q -46 60 -40 -100 Z"
      fill="none"
      stroke={INK}
      strokeWidth={SW}
    />
  </g>
);

/** おこめ（ひとつぶ） */
export const RiceGrain: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse rx={20} ry={32} fill="#ffffff" stroke={INK} strokeWidth={4} />
    <ellipse cx={-6} cy={-10} rx={5} ry={10} fill="#eef3ff" />
  </g>
);

/** おまめ（だいず） */
export const Bean: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={34} ry={30} fill="#f3d58b" stroke={INK} strokeWidth={4} />
    <path d="M -6 -18 q -8 18 0 36" stroke="#c9a352" strokeWidth={4} fill="none" />
    <ellipse cx={-14} cy={-12} rx={7} ry={4} fill="#fff" opacity={0.6} />
  </g>
);

/** えだまめの さや（まめが 3つ） */
export const BeanPod: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M -110 0 Q -110 -44 -60 -40 Q -36 -54 0 -40 Q 36 -54 60 -40 Q 110 -44 110 0 Q 110 40 60 38 Q 36 50 0 38 Q -36 50 -60 38 Q -110 40 -110 0 Z"
      fill="#8fd16b"
      stroke={INK}
      strokeWidth={5}
    />
    {[-64, 0, 64].map((dx) => (
      <circle key={dx} cx={dx} cy={0} r={28} fill="#b8e68f" stroke={INK} strokeWidth={3} />
    ))}
  </g>
);

export const Corn: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
}) => {
  const kernels: React.ReactNode[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 4; col++) {
      const yy = -110 + row * 26;
      const half = 46 - Math.abs(yy + 10) * 0.18;
      const xx = -half + 10 + col * ((half * 2 - 20) / 3);
      kernels.push(
        <rect
          key={`${row}-${col}`}
          x={xx - 11}
          y={yy - 11}
          width={22}
          height={22}
          rx={8}
          fill="#ffd93b"
          stroke="#e0a800"
          strokeWidth={3}
        />,
      );
    }
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse rx={58} ry={138} fill="#ffe46b" stroke={INK} strokeWidth={SW} />
      {kernels}
      <path
        d="M -50 60 Q -90 110 -40 160 Q -20 100 0 80 Z"
        fill="#8ccf63"
        stroke={INK}
        strokeWidth={5}
      />
      <path
        d="M 50 60 Q 90 110 40 160 Q 20 100 0 80 Z"
        fill="#7cc356"
        stroke={INK}
        strokeWidth={5}
      />
    </g>
  );
};

/* ---------- しょくぶつ ---------- */

/** ふつうの はな（5まい） */
export const Flower: React.FC<{
  x: number;
  y: number;
  s?: number;
  color?: string;
  bloom?: number;
}> = ({ x, y, s = 1, color = "#ffd23f", bloom = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse
        key={a}
        cx={0}
        cy={-34 * bloom}
        rx={22 * (0.4 + bloom * 0.6)}
        ry={30 * (0.4 + bloom * 0.6)}
        fill={color}
        stroke={INK}
        strokeWidth={4}
        transform={`rotate(${a})`}
      />
    ))}
    <circle r={20} fill="#ff9f1c" stroke={INK} strokeWidth={4} />
  </g>
);

/** はっぱ（ほそながい） */
export const Leaf: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  color?: string;
}> = ({ x, y, s = 1, rot = 0, color = LEAF }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M 0 0 Q 40 -40 110 -6 Q 50 34 0 0 Z"
      fill={color}
      stroke={INK}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path d="M 6 -2 L 96 -6" stroke={LEAF_DARK} strokeWidth={3} />
  </g>
);

/** つち（はたけの だん） */
export const Soil: React.FC<{ y: number; h?: number }> = ({ y, h = 400 }) => (
  <g>
    <rect x={0} y={y} width={1920} height={h} fill={SOIL} />
    <path
      d={`M 0 ${y} ${new Array(25)
        .fill(0)
        .map((_, i) => `Q ${i * 80 + 40} ${y - 18} ${i * 80 + 80} ${y}`)
        .join(" ")}`}
      fill={SOIL}
      stroke={SOIL_DARK}
      strokeWidth={5}
    />
    {new Array(30).fill(0).map((_, i) => (
      <ellipse
        key={i}
        cx={(i * 211) % 1920}
        cy={y + 40 + ((i * 97) % (h - 60))}
        rx={10}
        ry={6}
        fill={SOIL_DARK}
        opacity={0.5}
      />
    ))}
  </g>
);

/** まないた */
export const Board: React.FC<{ x: number; y: number; w: number; h: number }> = ({
  x,
  y,
  w,
  h,
}) => (
  <g>
    <rect x={x} y={y + 14} width={w} height={h} rx={26} fill="#c99a62" />
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={26}
      fill="#f1cf98"
      stroke={INK}
      strokeWidth={SW}
    />
    {[0.25, 0.5, 0.75].map((k) => (
      <path
        key={k}
        d={`M ${x + 40} ${y + h * k} q ${w / 2} -14 ${w - 80} 0`}
        stroke="#e2b77a"
        strokeWidth={4}
        fill="none"
      />
    ))}
  </g>
);

/** じょうろ */
export const WateringCan: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 60 -20 L 150 -80 L 160 -66 L 74 4 Z" fill="#4fa3e0" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <ellipse cx={156} cy={-74} rx={12} ry={20} fill="#7cc4f5" stroke={INK} strokeWidth={4} transform="rotate(-35 156 -74)" />
    <rect x={-80} y={-60} width={150} height={110} rx={22} fill="#4fa3e0" stroke={INK} strokeWidth={5} />
    <path d="M -70 -60 Q -10 -130 50 -60" stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M -70 -60 Q -10 -130 50 -60" stroke="#4fa3e0" strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);

/** ちょうちょ（はる） */
export const Butterfly: React.FC<{ x: number; y: number; frame: number; s?: number; color?: string }> = ({
  x,
  y,
  frame,
  s = 1,
  color = "#ff9ec7",
}) => {
  const flap = 0.35 + Math.abs(Math.sin(frame * 0.35)) * 0.65;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`scale(${flap} 1)`}>
        <ellipse cx={-26} cy={-14} rx={26} ry={22} fill={color} stroke={INK} strokeWidth={4} />
        <ellipse cx={26} cy={-14} rx={26} ry={22} fill={color} stroke={INK} strokeWidth={4} />
        <ellipse cx={-18} cy={16} rx={16} ry={14} fill={color} stroke={INK} strokeWidth={4} />
        <ellipse cx={18} cy={16} rx={16} ry={14} fill={color} stroke={INK} strokeWidth={4} />
      </g>
      <rect x={-5} y={-26} width={10} height={52} rx={5} fill={INK} />
    </g>
  );
};

/** さくらの はなびら */
export const Petal: React.FC<{ x: number; y: number; rot: number; s?: number }> = ({
  x,
  y,
  rot,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 -14 Q 12 -6 8 8 L 0 4 L -8 8 Q -12 -6 0 -14 Z" fill="#ffc4d6" stroke="#f08aa8" strokeWidth={2} />
  </g>
);

/** おひさま */
export const Sun: React.FC<{ x: number; y: number; frame: number; s?: number }> = ({
  x,
  y,
  frame,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${frame * 0.4})`}>
    {new Array(10).fill(0).map((_, i) => (
      <rect
        key={i}
        x={-8}
        y={-110}
        width={16}
        height={36}
        rx={8}
        fill="#ffcf3f"
        transform={`rotate(${i * 36})`}
      />
    ))}
    <circle r={64} fill="#ffdb4d" stroke="#f2b600" strokeWidth={6} />
  </g>
);
