import React, { useId } from "react";
import { Face } from "./Characters";
import { FONT } from "./Caption";

const INK = "#2b2b4a";

/* ---------- お酒の もと ---------- */

/** おこめ（おちゃわん） */
export const Rice: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
}> = ({ x, y, s = 1, frame }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -110 -20 Q -110 -120 0 -120 Q 110 -120 110 -20 Z"
      fill="#fffdf5"
      stroke={INK}
      strokeWidth={6}
    />
    {new Array(9).fill(0).map((_, i) => (
      <ellipse
        key={i}
        cx={-70 + (i % 5) * 35 + (i > 4 ? 17 : 0)}
        cy={i > 4 ? -95 : -60}
        rx={9}
        ry={14}
        fill="#fff"
        stroke="#d9d2bf"
        strokeWidth={3}
        transform={`rotate(${i * 40} ${-70 + (i % 5) * 35 + (i > 4 ? 17 : 0)} ${i > 4 ? -95 : -60})`}
      />
    ))}
    <path
      d="M -125 -20 L 125 -20 Q 110 80 0 80 Q -110 80 -125 -20 Z"
      fill="#e85d75"
      stroke={INK}
      strokeWidth={6}
    />
    <path
      d="M -100 10 Q 0 30 100 10"
      stroke="#fff"
      strokeWidth={8}
      fill="none"
      opacity={0.6}
    />
    <rect
      x={-40}
      y={78}
      width={80}
      height={18}
      rx={6}
      fill="#c44569"
      stroke={INK}
      strokeWidth={5}
    />
    <g transform="translate(0 25)">
      <Face r={70} frame={frame} blinkOffset={10} />
    </g>
  </g>
);

/** ぶどう */
export const Grape: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
}> = ({ x, y, s = 1, frame }) => {
  const balls = [
    [-60, -80],
    [0, -90],
    [60, -80],
    [-30, -30],
    [30, -30],
    [-60, 20],
    [0, 20],
    [60, 20],
    [-30, 70],
    [30, 70],
    [0, 115],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M 0 -120 Q 5 -160 -10 -180"
        stroke="#7a4a2a"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 0 -150 Q 60 -200 110 -150 Q 60 -120 0 -150 Z"
        fill="#4cc38a"
        stroke={INK}
        strokeWidth={5}
      />
      {balls.map(([cx, cy], i) => (
        <g key={i}>
          <circle
            cx={cx}
            cy={cy}
            r={38}
            fill="#8e44ad"
            stroke={INK}
            strokeWidth={5}
          />
          <circle cx={cx - 12} cy={cy - 14} r={9} fill="#fff" opacity={0.45} />
        </g>
      ))}
      <g transform="translate(0 -5)">
        <Face r={70} frame={frame} blinkOffset={30} />
      </g>
    </g>
  );
};

/** むぎ */
export const Wheat: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
}> = ({ x, y, s = 1, frame }) => (
  <g
    transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(frame * 0.07) * 4})`}
  >
    {[-55, 0, 55].map((dx, k) => (
      <g key={k} transform={`translate(${dx} 0) rotate(${dx * 0.25})`}>
        <path
          d="M 0 150 L 0 -60"
          stroke="#c8a24a"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {new Array(6).fill(0).map((_, i) => (
          <g key={i}>
            <ellipse
              cx={-16}
              cy={-40 - i * 26}
              rx={14}
              ry={22}
              fill="#f4c95d"
              stroke={INK}
              strokeWidth={4}
              transform={`rotate(-25 -16 ${-40 - i * 26})`}
            />
            <ellipse
              cx={16}
              cy={-40 - i * 26}
              rx={14}
              ry={22}
              fill="#f4c95d"
              stroke={INK}
              strokeWidth={4}
              transform={`rotate(25 16 ${-40 - i * 26})`}
            />
          </g>
        ))}
        <path d="M 0 -190 L 0 -230" stroke="#c8a24a" strokeWidth={4} />
      </g>
    ))}
    <ellipse
      cx={0}
      cy={60}
      rx={95}
      ry={70}
      fill="#f4c95d"
      stroke={INK}
      strokeWidth={5}
    />
    <g transform="translate(0 60)">
      <Face r={70} frame={frame} blinkOffset={60} />
    </g>
  </g>
);

/** いっしょうびん（にほんしゅ・そこが 0,0） */
export const SakeBottle: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path
      d="M -60 0 L -60 -200 Q -60 -250 -25 -280 L -25 -360 L 25 -360 L 25 -280 Q 60 -250 60 -200 L 60 0 Z"
      fill="#3f8f5a"
      stroke={INK}
      strokeWidth={7}
    />
    <rect
      x={-30}
      y={-385}
      width={60}
      height={30}
      rx={6}
      fill="#ffe14d"
      stroke={INK}
      strokeWidth={6}
    />
    <rect
      x={-42}
      y={-190}
      width={84}
      height={150}
      rx={6}
      fill="#fffdf5"
      stroke={INK}
      strokeWidth={5}
    />
    <path
      d="M 0 -170 L 0 -60 M -18 -150 L 18 -150 M -18 -110 L 18 -110"
      stroke="#e63946"
      strokeWidth={9}
      strokeLinecap="round"
    />
    <rect
      x={-48}
      y={-240}
      width={12}
      height={60}
      rx={6}
      fill="#fff"
      opacity={0.35}
    />
  </g>
);

/** ワインの びん（そこが 0,0） */
export const WineBottle: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path
      d="M -55 0 L -55 -210 Q -55 -250 -20 -270 L -20 -350 L 20 -350 L 20 -270 Q 55 -250 55 -210 L 55 0 Z"
      fill="#6b1d3a"
      stroke={INK}
      strokeWidth={7}
    />
    <rect
      x={-24}
      y={-370}
      width={48}
      height={40}
      rx={6}
      fill="#e63946"
      stroke={INK}
      strokeWidth={6}
    />
    <rect
      x={-42}
      y={-170}
      width={84}
      height={100}
      rx={8}
      fill="#fff3d6"
      stroke={INK}
      strokeWidth={5}
    />
    {[
      [0, -135],
      [-14, -115],
      [14, -115],
      [0, -95],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r={11} fill="#8e44ad" />
    ))}
    <rect
      x={-44}
      y={-240}
      width={12}
      height={60}
      rx={6}
      fill="#fff"
      opacity={0.3}
    />
  </g>
);

/** ビールの びん（そこが 0,0） */
export const BeerBottle: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path
      d="M -55 0 L -55 -190 Q -55 -230 -22 -260 L -22 -330 L 22 -330 L 22 -260 Q 55 -230 55 -190 L 55 0 Z"
      fill="#9c5a1a"
      stroke={INK}
      strokeWidth={7}
    />
    <rect
      x={-28}
      y={-350}
      width={56}
      height={24}
      rx={6}
      fill="#ffd166"
      stroke={INK}
      strokeWidth={6}
    />
    <ellipse
      cx={0}
      cy={-110}
      rx={44}
      ry={56}
      fill="#ffe14d"
      stroke={INK}
      strokeWidth={5}
    />
    <path
      d="M 0 -140 L 0 -80 M -12 -125 L 0 -140 L 12 -125"
      stroke="#c8a24a"
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
    <rect
      x={-44}
      y={-220}
      width={12}
      height={60}
      rx={6}
      fill="#fff"
      opacity={0.3}
    />
  </g>
);

/* ---------- はっこう ---------- */

/** きの たる（そこの まんなかが 0,0） */
export const Barrel: React.FC<{
  s?: number;
  frame: number;
  bubbling?: number;
  open?: boolean;
  liquid?: string;
}> = ({ s = 1, frame, bubbling = 0, open = true, liquid = "#f3e3b5" }) => (
  <g transform={`scale(${s})`}>
    <path
      d="M -170 0 Q -210 -200 -170 -400 L 170 -400 Q 210 -200 170 0 Z"
      fill="#c9844f"
      stroke={INK}
      strokeWidth={8}
    />
    {[-110, -40, 40, 110].map((dx) => (
      <path
        key={dx}
        d={`M ${dx} -8 Q ${dx * 1.18} -200 ${dx} -392`}
        stroke="#a0673d"
        strokeWidth={6}
        fill="none"
      />
    ))}
    {[-60, -340].map((yy) => (
      <path
        key={yy}
        d={`M ${-192} ${yy} Q 0 ${yy + 22} 192 ${yy}`}
        stroke="#6e6e7a"
        strokeWidth={22}
        fill="none"
      />
    ))}
    <path
      d="M -198 -200 Q 0 -178 198 -200"
      stroke="#6e6e7a"
      strokeWidth={22}
      fill="none"
    />
    {open ? (
      <>
        <ellipse
          cx={0}
          cy={-400}
          rx={170}
          ry={40}
          fill="#a0673d"
          stroke={INK}
          strokeWidth={8}
        />
        <ellipse cx={0} cy={-396} rx={150} ry={30} fill={liquid} />
        {new Array(10).fill(0).map((_, i) => {
          const t = ((frame * 1.3 + i * 23) % 60) / 60;
          const bx = -110 + ((i * 53) % 220);
          return (
            <circle
              key={i}
              cx={bx + Math.sin(frame * 0.2 + i) * 6}
              cy={-400 - t * 140 * bubbling}
              r={(8 + (i % 3) * 6) * (0.5 + t * 0.6)}
              fill="#fffdf5"
              stroke={INK}
              strokeWidth={3}
              opacity={bubbling * (1 - t)}
            />
          );
        })}
      </>
    ) : null}
  </g>
);

/** こうぼさん（2D）。すこし ふくれて めが ある */
export const Yeast: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  chew?: number; // 0..1 もぐもぐ
  seed?: number;
  bud?: boolean;
}> = ({ x, y, s = 1, frame, chew = 0, seed = 0, bud = true }) => {
  const sq = 1 + Math.sin(frame * 0.6 + seed) * 0.08 * chew;
  return (
    <g
      transform={`translate(${x} ${y + Math.sin(frame * 0.09 + seed) * 6}) scale(${s * sq} ${s / sq})`}
    >
      {bud ? (
        <circle
          cx={52}
          cy={-42}
          r={24}
          fill="#fff1c9"
          stroke={INK}
          strokeWidth={5}
        />
      ) : null}
      <ellipse
        cx={0}
        cy={0}
        rx={68}
        ry={60}
        fill="#fff1c9"
        stroke={INK}
        strokeWidth={6}
      />
      <ellipse cx={-22} cy={-26} rx={16} ry={9} fill="#fff" opacity={0.7} />
      <Face
        r={60}
        frame={frame}
        blinkOffset={seed * 13}
        mood={chew > 0.5 && Math.sin(frame * 0.6 + seed) > 0 ? "wow" : "smile"}
      />
    </g>
  );
};

/** あまい つぶ（とう） */
export const Sugar: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect
      x={-24}
      y={-24}
      width={48}
      height={48}
      rx={8}
      fill="#ffd6e7"
      stroke={INK}
      strokeWidth={4}
    />
    <path
      d="M -12 -10 L -4 -14 M 6 6 L 12 2"
      stroke="#fff"
      strokeWidth={5}
      strokeLinecap="round"
    />
  </g>
);

/** あわ */
export const Bubble: React.FC<{
  x: number;
  y: number;
  r: number;
  opacity?: number;
}> = ({ x, y, r, opacity = 1 }) => (
  <g opacity={opacity}>
    <circle
      cx={x}
      cy={y}
      r={r}
      fill="#dff4ff"
      fillOpacity={0.6}
      stroke={INK}
      strokeWidth={4}
    />
    <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.22} fill="#fff" />
  </g>
);

/** アルコールの つぶ（むらさき・ぐるぐる め） */
export const Alco: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  opacity?: number;
}> = ({ x, y, s = 1, frame, opacity = 1 }) => (
  <g
    transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(frame * 0.15 + x) * 10})`}
    opacity={opacity}
  >
    <path
      d="M 0 -40 Q 32 -4 30 14 Q 28 40 0 40 Q -28 40 -30 14 Q -32 -4 0 -40 Z"
      fill="#b388ff"
      stroke={INK}
      strokeWidth={4}
    />
    {[-11, 11].map((dx) => (
      <path
        key={dx}
        d={`M ${dx} 12 m -5 0 a 5 5 0 1 1 5 5 a 3 3 0 1 1 -3 -3`}
        stroke={INK}
        strokeWidth={2.5}
        fill="none"
      />
    ))}
  </g>
);

/** かんぞうさん（ヘルメットと ハンマー） */
export const Liver: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  swing?: number; // 0..1 ハンマーを ふる
  mood?: "smile" | "wow" | "sleep";
  sweat?: number;
}> = ({ x, y, s = 1, frame, swing = 0, mood = "smile", sweat = 0 }) => {
  const hammer = -40 + Math.abs(Math.sin(frame * 0.15)) * 90 * swing;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* ハンマー */}
      <g transform={`rotate(${hammer} 120 0)`}>
        <rect
          x={115}
          y={-130}
          width={14}
          height={130}
          rx={6}
          fill="#a0673d"
          stroke={INK}
          strokeWidth={4}
        />
        <rect
          x={82}
          y={-170}
          width={80}
          height={46}
          rx={10}
          fill="#8d99ae"
          stroke={INK}
          strokeWidth={5}
        />
      </g>
      <path
        d="M -150 -10 Q -160 -100 -40 -105 Q 80 -110 150 -60 Q 175 -30 120 20 Q 40 80 -60 75 Q -145 70 -150 -10 Z"
        fill="#b5413b"
        stroke={INK}
        strokeWidth={7}
      />
      <path
        d="M -110 -60 Q -60 -85 0 -80"
        stroke="#fff"
        strokeWidth={8}
        fill="none"
        opacity={0.35}
        strokeLinecap="round"
      />
      {/* ヘルメット */}
      <path
        d="M -80 -100 Q -70 -175 10 -175 Q 90 -175 95 -100 Z"
        fill="#ffd166"
        stroke={INK}
        strokeWidth={6}
      />
      <rect
        x={-100}
        y={-108}
        width={215}
        height={18}
        rx={9}
        fill="#ffb627"
        stroke={INK}
        strokeWidth={5}
      />
      <g transform="translate(0 -10)">
        <Face r={85} frame={frame} mood={mood} blinkOffset={20} />
      </g>
      {sweat > 0 ? (
        <path
          d="M 110 -90 Q 124 -66 110 -60 Q 96 -66 110 -90 Z"
          fill="#7fd1ff"
          stroke={INK}
          strokeWidth={3}
          opacity={sweat}
        />
      ) : null}
    </g>
  );
};

/** パン（ふくらみ 0..1） */
export const Bread: React.FC<{
  x: number;
  y: number;
  s?: number;
  rise: number;
  baked: number;
  frame: number;
}> = ({ x, y, s = 1, rise, baked, frame }) => {
  const h = 60 + rise * 120;
  const w = 150 + rise * 60;
  const dough = baked > 0 ? mix("#fff1d6", "#d98b3a", baked) : "#fff1d6";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d={`M ${-w} 0 Q ${-w - 20} ${-h * 1.4} 0 ${-h * 1.5} Q ${w + 20} ${-h * 1.4} ${w} 0 Z`}
        fill={dough}
        stroke={INK}
        strokeWidth={7}
      />
      {baked > 0.5
        ? [-0.4, 0, 0.4].map((k) => (
            <path
              key={k}
              d={`M ${k * w - 30} ${-h * 0.9} Q ${k * w} ${-h * 1.05} ${k * w + 30} ${-h * 0.9}`}
              stroke="#a0582a"
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
            />
          ))
        : null}
      <g transform={`translate(0 ${-h * 0.55})`}>
        <Face r={Math.min(90, 50 + h * 0.3)} frame={frame} blinkOffset={70} />
      </g>
    </g>
  );
};

function mix(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const k = Math.max(0, Math.min(1, t));
  return `#${pa
    .map((v, i) =>
      Math.round(v + (pb[i] - v) * k)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/* ---------- しるし ---------- */

export const Hanamaru: React.FC<{
  x: number;
  y: number;
  s?: number;
  p: number;
}> = ({ x, y, s = 1, p }) => {
  const petals = new Array(10).fill(0).map((_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return `${i === 0 ? "M" : "Q"} ${i === 0 ? "" : `${Math.cos(a - 0.31) * 200} ${Math.sin(a - 0.31) * 200} `}${Math.cos(a) * 150} ${Math.sin(a) * 150}`;
  });
  const flower = `${petals.join(" ")} Q ${Math.cos(-0.31) * 200} ${Math.sin(-0.31) * 200} 150 0`;
  const spiral =
    "M 0 0 C 40 -40 90 0 60 50 C 20 100 -80 70 -90 0 C -100 -80 0 -120 70 -100";
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="none"
      stroke="#ff4d6d"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={flower}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.min(1, p * 1.6)}
      />
      <path
        d={spiral}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, p * 2.2 - 1.2))}
      />
    </g>
  );
};

/** だめ の ばつ */
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

/** たいよう と おつきさま（ひにちが すすむ） */
export const DayNight: React.FC<{ x: number; y: number; t: number }> = ({
  x,
  y,
  t,
}) => {
  // t: 0..1 で ひとまわり（ひる → よる）。うえ半分だけ みえる
  const a = t * Math.PI * 2;
  const id = useId().replace(/:/g, "");
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={`sky${id}`}>
          <rect x={-220} y={-240} width={440} height={250} />
        </clipPath>
      </defs>
      <g clipPath={`url(#sky${id})`}>
        <g transform={`rotate(${(a * 180) / Math.PI})`}>
          <g transform="translate(0 -120)">
            <circle r={46} fill="#ffd166" stroke={INK} strokeWidth={5} />
            {new Array(8).fill(0).map((_, i) => (
              <line
                key={i}
                x1={0}
                y1={-60}
                x2={0}
                y2={-80}
                stroke="#ffb627"
                strokeWidth={8}
                strokeLinecap="round"
                transform={`rotate(${i * 45})`}
              />
            ))}
          </g>
          <g transform="translate(0 120) rotate(180)">
            <circle r={42} fill="#fff6c2" stroke={INK} strokeWidth={5} />
            <circle cx={18} cy={-12} r={36} fill="#3a4a8a" />
          </g>
        </g>
      </g>
    </g>
  );
};

/** ぽよんと でる なまえの ふだ（SVG内） */
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
