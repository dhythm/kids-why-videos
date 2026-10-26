import React, { useId } from "react";
import { random } from "remotion";
import { Cloud } from "./Characters";

const INK = "#2b2b4a";

/* ---------- にわとりの おなかの なか（ローカル座標・右むき） ---------- */
export const OVARY = { x: 70, y: -35 };
export const VENT = { x: -165, y: 50 };

/** たまごの トンネル（らんかん）を 4つの へやに わけたもの */
export const DUCT_SEGMENTS = [
  { key: "white", d: "M 55 -5 C 20 -40 -60 -30 -60 10", color: "#bfe3ff" },
  { key: "skin", d: "M -60 10 C -60 40 0 40 10 65", color: "#d7c4ff" },
  { key: "shell", d: "M 10 65 C 20 88 -50 88 -95 66", color: "#ffd59e" },
  { key: "exit", d: "M -95 66 C -125 55 -150 50 -165 50", color: "#ffb3c6" },
] as const;

export const DUCT_PATH =
  DUCT_SEGMENTS[0].d +
  DUCT_SEGMENTS.slice(1)
    .map((s) => s.d.replace(/^M [-\d.]+ [-\d.]+ /, " "))
    .join("");

/** うんちの みち（ちょう） */
export const GUT_PATH =
  "M 120 40 C 110 110 0 125 -80 110 C -120 100 -150 72 -165 52";

type HenMood = "smile" | "strain" | "sleep" | "wow";

/* ---------- にわとり ---------- */
export const Hen: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  flip?: boolean;
  sitting?: boolean;
  walk?: number; // 0..1
  beakOpen?: number; // 0..1
  flap?: number; // 0..1 はねを ぱたぱた
  mood?: HenMood;
  xray?: number; // 0..1 おなかの なかを みせる
  inside?: React.ReactNode;
  peck?: number; // 0..1 くびを さげて つんつん
}> = ({
  x,
  y,
  s = 1,
  frame,
  flip = false,
  sitting = false,
  walk = 0,
  beakOpen = 0,
  flap = 0,
  mood = "smile",
  xray = 0,
  inside,
  peck = 0,
}) => {
  const id = useId().replace(/:/g, "");
  const swing = Math.sin(frame * 0.45) * 28 * walk;
  const bob = -Math.abs(Math.sin(frame * 0.45)) * 10 * walk;
  const wing = -Math.abs(Math.sin(frame * 0.9)) * 35 * flap;
  // くびを さげると あたまが まえへ
  const hx = 120 + peck * 90;
  const hy = -130 + peck * 230;

  const shapes = (fill: string, stroke?: string) => (
    <g fill={fill} stroke={stroke} strokeWidth={stroke ? 14 : 0}>
      {/* しっぽ */}
      <ellipse
        cx={-175}
        cy={-95}
        rx={38}
        ry={85}
        transform="rotate(-25 -175 -95)"
      />
      <ellipse
        cx={-205}
        cy={-55}
        rx={32}
        ry={70}
        transform="rotate(-50 -205 -55)"
      />
      <ellipse cx={0} cy={0} rx={180} ry={135} />
      <ellipse
        cx={(hx + 40) / 2}
        cy={(hy - 40) / 2}
        rx={70}
        ry={95}
        transform={`rotate(${30 + peck * 30} ${(hx + 40) / 2} ${(hy - 40) / 2})`}
      />
      <circle cx={hx} cy={hy} r={78} />
    </g>
  );

  const eyeX = hx + 30;
  const eyeY = hy - 12;
  const blink = (frame + 23) % 100 > 94 ? 0.15 : 1;

  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s})`}>
      <defs>
        <clipPath id={`body${id}`}>
          <ellipse cx={0} cy={0} rx={176} ry={131} />
        </clipPath>
      </defs>
      {/* あし */}
      {sitting ? null : (
        <g stroke="#ff9f1c" strokeWidth={14} strokeLinecap="round" fill="none">
          {[
            [-35, swing],
            [35, -swing],
          ].map(([lx, sw]) => (
            <g key={lx} transform={`rotate(${sw} ${lx} 110)`}>
              <path d={`M ${lx} 110 L ${lx} 200`} />
              <path
                d={`M ${lx - 26} 214 L ${lx} 200 L ${lx + 30} 214 M ${lx} 200 L ${lx + 6} 220`}
              />
            </g>
          ))}
        </g>
      )}
      {/* とさか（うしろ） */}
      <g fill="#ff4d6d" stroke={INK} strokeWidth={6}>
        <circle cx={hx - 40} cy={hy - 70} r={24} />
        <circle cx={hx - 5} cy={hy - 85} r={28} />
        <circle cx={hx + 32} cy={hy - 72} r={24} />
      </g>
      {shapes(INK, INK)}
      {shapes("#fffdf7")}
      {/* おなかの なか */}
      {xray > 0 ? (
        <g clipPath={`url(#body${id})`} opacity={xray}>
          <ellipse cx={0} cy={0} rx={180} ry={135} fill="#ffe3ea" />
          {inside}
        </g>
      ) : null}
      {/* はね */}
      {xray < 0.5 ? (
        <g transform={`rotate(${wing} 60 -30)`} opacity={1 - xray * 2}>
          <path
            d="M 60 -30 C 20 -60 -110 -50 -120 20 C -90 10 -70 50 -40 40 C -20 70 40 50 60 -30 Z"
            fill="#f3ebdc"
            stroke={INK}
            strokeWidth={6}
            strokeLinejoin="round"
          />
        </g>
      ) : null}
      {/* くちばし */}
      <g transform={`translate(${hx + 70} ${hy + 5})`}>
        <path
          d={`M -8 -18 L 46 ${-4 - beakOpen * 10} L -8 6 Z`}
          fill="#ffb627"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <path
          d={`M -8 6 L 38 ${10 + beakOpen * 22} L -8 ${20 + beakOpen * 6} Z`}
          fill="#ff9f1c"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
      </g>
      {/* にくぜん */}
      <ellipse
        cx={hx + 62}
        cy={hy + 52 + beakOpen * 10}
        rx={15}
        ry={24}
        fill="#ff4d6d"
        stroke={INK}
        strokeWidth={6}
      />
      {/* め */}
      {mood === "strain" ? (
        <path
          d={`M ${eyeX - 14} ${eyeY - 12} L ${eyeX + 8} ${eyeY} L ${eyeX - 14} ${eyeY + 12}`}
          stroke={INK}
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : mood === "sleep" ? (
        <path
          d={`M ${eyeX - 14} ${eyeY} q 14 12 28 0`}
          stroke={INK}
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <>
          <ellipse
            cx={eyeX}
            cy={eyeY}
            rx={mood === "wow" ? 14 : 11}
            ry={(mood === "wow" ? 17 : 14) * blink}
            fill={INK}
          />
          <circle cx={eyeX + 4} cy={eyeY - 5} r={4.5 * blink} fill="#fff" />
        </>
      )}
      <ellipse
        cx={hx + 10}
        cy={hy + 28}
        rx={18}
        ry={10}
        fill="#ff8fa3"
        opacity={0.75}
      />
    </g>
  );
};

/* ---------- たまご ---------- */
export const EGG_D =
  "M 0 -62 C 40 -62 52 -5 50 20 C 48 48 26 62 0 62 C -26 62 -48 48 -50 20 C -52 -5 -40 -62 0 -62 Z";

export const Egg: React.FC<{
  x: number;
  y: number;
  s?: number;
  rotate?: number;
  color?: string;
  face?: boolean;
  frame?: number;
  wet?: number; // 0..1 うまれたての ぬれた ひかり
  crack?: number; // 0..1 ひび
}> = ({
  x,
  y,
  s = 1,
  rotate = 0,
  color = "#fff4e0",
  face = false,
  frame = 0,
  wet = 0,
  crack = 0,
}) => {
  const blink = (frame + 41) % 90 > 84 ? 0.15 : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <path d={EGG_D} fill={color} stroke={INK} strokeWidth={5} />
      <ellipse
        cx={-20}
        cy={-25}
        rx={9}
        ry={18}
        fill="#fff"
        opacity={0.8}
        transform="rotate(20 -20 -25)"
      />
      {wet > 0 ? (
        <g opacity={wet}>
          <path
            d="M -38 -10 C -40 -40 -20 -55 0 -58"
            stroke="#fff"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 30 30 q 6 10 0 16 q -6 -6 0 -16 Z"
            fill="#9bd8ff"
            stroke={INK}
            strokeWidth={2}
          />
        </g>
      ) : null}
      {crack > 0 ? (
        <path
          d="M -50 0 L -30 -12 L -14 4 L 4 -14 L 20 2 L 36 -12 L 50 0"
          stroke={INK}
          strokeWidth={4}
          fill="none"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - crack}
        />
      ) : null}
      {face ? (
        <g transform="translate(0 12)">
          <ellipse cx={-15} cy={-6} rx={5} ry={7 * blink} fill={INK} />
          <ellipse cx={15} cy={-6} rx={5} ry={7 * blink} fill={INK} />
          <ellipse cx={-26} cy={8} rx={7} ry={4} fill="#ff8fa3" opacity={0.8} />
          <ellipse cx={26} cy={8} rx={7} ry={4} fill="#ff8fa3" opacity={0.8} />
          <path
            d="M -8 6 Q 0 14 8 6"
            stroke={INK}
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ) : null}
    </g>
  );
};

/* ---------- きみ（かお つき） ---------- */
export const Yolk: React.FC<{
  x: number;
  y: number;
  r: number;
  frame?: number;
  face?: boolean;
}> = ({ x, y, r, frame = 0, face = true }) => {
  const blink = (frame + 11) % 90 > 84 ? 0.15 : 1;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle
        r={r}
        fill="#ffc93c"
        stroke={INK}
        strokeWidth={Math.max(2, r * 0.07)}
      />
      <ellipse
        cx={-r * 0.38}
        cy={-r * 0.42}
        rx={r * 0.2}
        ry={r * 0.12}
        fill="#fff6c9"
        transform={`rotate(-35 ${-r * 0.38} ${-r * 0.42})`}
      />
      {face ? (
        <g>
          <ellipse
            cx={-r * 0.3}
            cy={-r * 0.02}
            rx={r * 0.08}
            ry={r * 0.11 * blink}
            fill={INK}
          />
          <ellipse
            cx={r * 0.3}
            cy={-r * 0.02}
            rx={r * 0.08}
            ry={r * 0.11 * blink}
            fill={INK}
          />
          <ellipse
            cx={-r * 0.5}
            cy={r * 0.2}
            rx={r * 0.12}
            ry={r * 0.07}
            fill="#ff8fa3"
            opacity={0.8}
          />
          <ellipse
            cx={r * 0.5}
            cy={r * 0.2}
            rx={r * 0.12}
            ry={r * 0.07}
            fill="#ff8fa3"
            opacity={0.8}
          />
          <path
            d={`M ${-r * 0.14} ${r * 0.16} Q 0 ${r * 0.32} ${r * 0.14} ${r * 0.16}`}
            stroke={INK}
            strokeWidth={Math.max(2, r * 0.05)}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ) : null}
    </g>
  );
};

/* ---------- ひよこ ---------- */
export const Chick: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  hop?: number; // 0..1
  flip?: boolean;
  beakOpen?: number;
}> = ({ x, y, s = 1, frame, hop = 0, flip = false, beakOpen = 0 }) => {
  const by = -Math.abs(Math.sin(frame * 0.3)) * 30 * hop;
  const wing = Math.sin(frame * 0.6) * 20 * hop;
  const blink = (frame + 7) % 80 > 75 ? 0.15 : 1;
  return (
    <g transform={`translate(${x} ${y + by}) scale(${flip ? -s : s} ${s})`}>
      <g stroke="#ff9f1c" strokeWidth={8} strokeLinecap="round" fill="none">
        <path d="M -18 60 L -18 84 M -30 90 L -18 84 L -6 90" />
        <path d="M 18 60 L 18 84 M 6 90 L 18 84 L 30 90" />
      </g>
      <ellipse
        cx={0}
        cy={10}
        rx={70}
        ry={62}
        fill="#ffe14d"
        stroke={INK}
        strokeWidth={6}
      />
      <circle
        cx={20}
        cy={-50}
        r={48}
        fill="#ffe14d"
        stroke={INK}
        strokeWidth={6}
      />
      <ellipse cx={20} cy={10} rx={66} ry={58} fill="#ffe14d" />
      <circle cx={20} cy={-50} r={44} fill="#ffe14d" />
      <path
        d="M 10 -96 q 6 -18 16 -4 q 8 -16 14 2"
        stroke={INK}
        strokeWidth={5}
        fill="#ffe14d"
      />
      <g transform={`rotate(${wing} -30 0)`}>
        <ellipse
          cx={-38}
          cy={14}
          rx={30}
          ry={20}
          fill="#ffd21f"
          stroke={INK}
          strokeWidth={5}
          transform="rotate(-20 -38 14)"
        />
      </g>
      <path
        d={`M 58 -54 L 84 ${-48 - beakOpen * 6} L 58 -40 Z M 58 -40 L 80 ${-36 + beakOpen * 10} L 58 -32 Z`}
        fill="#ff9f1c"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <ellipse cx={42} cy={-58} rx={7} ry={9 * blink} fill={INK} />
      <circle cx={44} cy={-61} r={2.5 * blink} fill="#fff" />
      <ellipse cx={34} cy={-34} rx={10} ry={6} fill="#ff8fa3" opacity={0.8} />
    </g>
  );
};

/* ---------- わらの す ---------- */
export const Nest: React.FC<{
  x: number;
  y: number;
  s?: number;
  front?: boolean;
}> = ({ x, y, s = 1, front = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {front ? (
      <g>
        <path
          d="M -230 0 Q -220 80 0 90 Q 220 80 230 0 Q 0 40 -230 0 Z"
          fill="#e9b949"
          stroke={INK}
          strokeWidth={6}
        />
        {new Array(14).fill(0).map((_, i) => (
          <path
            key={i}
            d={`M ${-200 + i * 30} ${20 + (i % 3) * 8} q 20 ${10 + (i % 2) * 10} 40 0`}
            stroke="#c98b2b"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </g>
    ) : (
      <ellipse
        cx={0}
        cy={0}
        rx={230}
        ry={50}
        fill="#c98b2b"
        stroke={INK}
        strokeWidth={6}
      />
    )}
  </g>
);

/* ---------- えさの つぶ ---------- */
export const Grain: React.FC<{
  x: number;
  y: number;
  s?: number;
  kind?: number;
}> = ({ x, y, s = 1, kind = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {kind === 0 ? (
      <ellipse rx={12} ry={8} fill="#ffd166" stroke={INK} strokeWidth={3} />
    ) : kind === 1 ? (
      <ellipse rx={10} ry={10} fill="#9ccc65" stroke={INK} strokeWidth={3} />
    ) : (
      // かいがら（からの もと）
      <path
        d="M -14 6 Q -14 -14 0 -14 Q 14 -14 14 6 Z M -8 6 L -4 -10 M 0 6 L 0 -12 M 8 6 L 4 -10"
        fill="#ffffff"
        stroke={INK}
        strokeWidth={3}
      />
    )}
  </g>
);

/* ---------- はなまる ---------- */
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

/* ---------- ぼくじょうの はいけい ---------- */
export const FarmBg: React.FC<{ frame: number; night?: number }> = ({
  frame,
  night = 0,
}) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#bfe8ff" />
    <rect
      x={0}
      y={0}
      width={1920}
      height={1080}
      fill="#26305e"
      opacity={night}
    />
    {night > 0
      ? new Array(50)
          .fill(0)
          .map((_, i) => (
            <circle
              key={i}
              cx={random(`fx${i}`) * 1920}
              cy={random(`fy${i}`) * 600}
              r={2 + random(`fr${i}`) * 3}
              fill="#fff"
              opacity={
                night * (0.4 + 0.6 * Math.abs(Math.sin(frame * 0.05 + i)))
              }
            />
          ))
      : null}
    {/* おひさま / おつきさま */}
    <g transform={`translate(1660 190)`} opacity={1 - night}>
      {new Array(10).fill(0).map((_, i) => (
        <rect
          key={i}
          x={-7}
          y={-150}
          width={14}
          height={40}
          rx={7}
          fill="#ffd23f"
          transform={`rotate(${i * 36 + frame * 0.4})`}
        />
      ))}
      <circle r={95} fill="#ffd23f" stroke="#ffb627" strokeWidth={8} />
    </g>
    <g transform={`translate(1660 190)`} opacity={night}>
      <path
        d="M 40 -90 A 95 95 0 1 0 60 80 A 75 75 0 1 1 40 -90 Z"
        fill="#fff59d"
      />
    </g>
    <g opacity={1 - night * 0.8}>
      <Cloud x={((300 + frame * 0.6) % 2300) - 200} y={170} s={0.9} />
      <Cloud x={((1200 + frame * 0.4) % 2300) - 200} y={300} s={0.6} />
    </g>
    <path
      d="M -50 760 Q 400 600 900 720 Q 1400 600 1980 740 L 1980 1100 L -50 1100 Z"
      fill="#8ed66b"
    />
    <path
      d="M -50 840 Q 600 760 1980 850 L 1980 1100 L -50 1100 Z"
      fill="#6cc04a"
    />
    <rect
      x={0}
      y={0}
      width={1920}
      height={1080}
      fill="#1a2048"
      opacity={night * 0.35}
    />
    {/* さく */}
    <g fill="#f7d9a8" stroke={INK} strokeWidth={5}>
      <rect x={-20} y={690} width={1960} height={22} />
      <rect x={-20} y={740} width={1960} height={22} />
      {new Array(13).fill(0).map((_, i) => (
        <path
          key={i}
          d={`M ${40 + i * 155} 760 L ${40 + i * 155} 660 L ${60 + i * 155} 640 L ${80 + i * 155} 660 L ${80 + i * 155} 760 Z`}
        />
      ))}
    </g>
  </g>
);
