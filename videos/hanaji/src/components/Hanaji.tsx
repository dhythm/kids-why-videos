import React from "react";
import { Face, Mood } from "./Characters";
import { INK } from "./Things";
import {
  airColor,
  bleedLevel,
  BLOOD,
  clockAngle,
  MEMBRANE,
  plugFill,
  SCAB,
} from "../lib/nose";

export const SKIN = "#ffd9b8";
const NOSE_SKIN = "#ffc9a3";

/* ---------- しずくの かたち（まんなか = ふくらみ） ---------- */
const DROP_D = "M 0 -34 Q 26 0 26 14 A 26 26 0 1 1 -26 14 Q -26 0 0 -34 Z";

/* ---------- はなの トンネル（よこがおの なか） ---------- */
type P = [number, number];
const CH: P[] = [
  [-272, 52],
  [-250, -20],
  [-150, -12],
  [-20, -5],
  [40, 70],
  [62, 120],
  [62, 200],
  [62, 380],
];
const CH_D = `M ${CH[0]} Q ${CH[1]} ${CH[2]} Q ${CH[3]} ${CH[4]} Q ${CH[5]} ${CH[6]} L ${CH[7]}`;
const CH_CUTS = [0.22, 0.54, 0.74];

function quad(a: P, b: P, c: P, t: number): P {
  const u = 1 - t;
  return [
    u * u * a[0] + 2 * u * t * b[0] + t * t * c[0],
    u * u * a[1] + 2 * u * t * b[1] + t * t * c[1],
  ];
}

/** トンネルの うえの てん（t: 0 = はなの あな、1 = のどの おく） */
export function channelPoint(t: number): P {
  const k = Math.min(1, Math.max(0, t));
  if (k < CH_CUTS[0]) {
    return quad(CH[0], CH[1], CH[2], k / CH_CUTS[0]);
  }
  if (k < CH_CUTS[1]) {
    return quad(CH[2], CH[3], CH[4], (k - CH_CUTS[0]) / (CH_CUTS[1] - CH_CUTS[0]));
  }
  if (k < CH_CUTS[2]) {
    return quad(CH[4], CH[5], CH[6], (k - CH_CUTS[1]) / (CH_CUTS[2] - CH_CUTS[1]));
  }
  const r = (k - CH_CUTS[2]) / (1 - CH_CUTS[2]);
  return [CH[6][0], CH[6][1] + (CH[7][1] - CH[6][1]) * r];
}

export type SideMood = "smile" | "wow" | "ouch" | "sick" | "breathe";

/* ---------- よこがお（ひだりむき）。まんなか = あたまの まんなか ---------- */
export const SideHead: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  mood?: SideMood;
  tilt?: number; // ＋ = うえを むく、− = したを むく（ど）
  bleed?: number; // はなから でる ち（0..1）
  pinch?: number; // はなを つまむ て（0..1）
  inside?: number; // はなの トンネルを みせる（0..1）
  air?: number; // くうきの つぶ（0..1）
  warm?: number; // くうきが あたたまる（0..1）
  bloodBack?: number; // のどへ ながれる ち（0..1）
  shirt?: string;
  hair?: string;
}> = ({
  x,
  y,
  s = 1,
  frame,
  mood = "smile",
  tilt = 0,
  bleed = 0,
  pinch = 0,
  inside = 0,
  air = 0,
  warm = 0,
  bloodBack = 0,
  shirt = "#ffd166",
  hair = "#5b3a29",
}) => {
  const blink = frame % 90 > 84 ? 0.15 : 1;
  const drip = (frame % 45) / 45;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* からだ */}
      <rect
        x={-150}
        y={350}
        width={420}
        height={420}
        rx={110}
        fill={shirt}
        stroke={INK}
        strokeWidth={6}
      />
      <g transform={`rotate(${tilt} 60 330)`}>
        {/* くび */}
        <rect x={-20} y={190} width={160} height={210} rx={40} fill={SKIN} stroke={INK} strokeWidth={6} />
        {/* あたま */}
        <circle r={240} fill={SKIN} stroke={INK} strokeWidth={6} />
        {/* はな */}
        <path
          d="M -228 -75 Q -250 -40 -300 10 Q -335 45 -300 68 Q -270 82 -226 74 Z"
          fill={SKIN}
        />
        <rect x={-247} y={-64} width={28} height={130} fill={SKIN} />
        <path
          d="M -228 -75 Q -250 -40 -300 10 Q -335 45 -300 68 Q -270 82 -226 74"
          fill="none"
          stroke={INK}
          strokeWidth={6}
          strokeLinecap="round"
        />
        {/* はなの トンネル */}
        {inside > 0 ? (
          <g opacity={inside}>
            <path d={CH_D} fill="none" stroke="#e58aa0" strokeWidth={62} strokeLinecap="round" />
            <path d={CH_D} fill="none" stroke="#fff0f3" strokeWidth={50} strokeLinecap="round" />
            {bloodBack > 0 ? (
              <path
                d={CH_D}
                fill="none"
                stroke={BLOOD}
                strokeWidth={20}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={`${bloodBack} 1`}
              />
            ) : null}
            {air > 0
              ? new Array(9).fill(0).map((_, i) => {
                  const u = (frame * 0.006 + i / 9) % 1;
                  const t = (u - 0.25) / 0.75;
                  const [px, py] =
                    t < 0
                      ? [-272 - 280 * (-t / 0.333), 52 + 110 * (-t / 0.333)]
                      : channelPoint(t);
                  const k = Math.min(1, Math.max(0, (t - 0.05) / 0.4)) * warm;
                  return (
                    <circle
                      key={i}
                      cx={px}
                      cy={py + Math.sin(frame * 0.2 + i * 2) * 5}
                      r={15}
                      fill={airColor(k)}
                      stroke={INK}
                      strokeWidth={3}
                      opacity={air * Math.min(1, u * 8, (1 - u) * 8)}
                    />
                  );
                })
              : null}
          </g>
        ) : null}
        {/* かみ・みみ */}
        <path
          d="M -212 -112 A 240 240 0 0 1 236 44 Q 170 10 150 -70 Q 60 -150 -80 -120 Q -150 -110 -212 -112 Z"
          fill={hair}
          opacity={inside > 0 ? 1 - inside * 0.35 : 1}
        />
        <ellipse cx={92} cy={20} rx={30} ry={44} fill={SKIN} stroke={INK} strokeWidth={6} opacity={1 - inside * 0.6} />
        {/* め */}
        {mood === "ouch" || mood === "sick" ? (
          <path
            d="M -140 -68 L -104 -48 L -140 -28"
            fill="none"
            stroke={INK}
            strokeWidth={11}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <ellipse cx={-120} cy={-48} rx={16} ry={(mood === "wow" ? 27 : 22) * blink} fill={INK} />
            <circle cx={-125} cy={-57} r={6 * blink} fill="#fff" />
          </>
        )}
        <ellipse cx={-120} cy={52} rx={30} ry={17} fill={mood === "sick" ? "#9bc7e8" : "#ff8fa3"} opacity={0.7} />
        {/* くち */}
        {mood === "wow" || mood === "breathe" ? (
          <ellipse
            cx={-172}
            cy={128}
            rx={15}
            ry={mood === "breathe" ? 16 + Math.sin(frame * 0.12) * 5 : 20}
            fill="#7a3b2e"
            stroke={INK}
            strokeWidth={5}
          />
        ) : mood === "sick" ? (
          <path d="M -200 132 q 12 -14 24 0 t 24 0" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        ) : mood === "ouch" ? (
          <path d="M -198 138 Q -172 116 -148 134" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        ) : (
          <path d="M -200 118 Q -176 146 -146 126" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        )}
        {/* はなぢ */}
        {bleed > 0 && pinch < 0.6 ? (
          <g>
            <path
              d={`M -282 76 q -6 ${24 * bleed} 0 ${52 * bleed}`}
              fill="none"
              stroke={BLOOD}
              strokeWidth={15}
              strokeLinecap="round"
            />
            <path
              d={DROP_D}
              transform={`translate(-282 ${92 + 52 * bleed + drip * 150}) scale(${bleed * 0.62})`}
              fill={BLOOD}
              stroke={INK}
              strokeWidth={5}
              opacity={1 - drip * 0.8}
            />
          </g>
        ) : null}
        {/* つまむ て */}
        {pinch > 0 ? (
          <g transform={`translate(${(1 - pinch) * -170} ${(1 - pinch) * 240})`} opacity={Math.min(1, pinch * 2)}>
            <rect x={-372} y={120} width={84} height={420} rx={40} fill={shirt} stroke={INK} strokeWidth={6} />
            <rect
              x={-70}
              y={-17}
              width={140}
              height={36}
              rx={18}
              fill={SKIN}
              stroke={INK}
              strokeWidth={5}
              transform="translate(-258 96) rotate(-12)"
            />
            <circle cx={-330} cy={104} r={54} fill={SKIN} stroke={INK} strokeWidth={6} />
            <rect
              x={-72}
              y={-19}
              width={144}
              height={38}
              rx={19}
              fill={SKIN}
              stroke={INK}
              strokeWidth={5}
              transform="translate(-276 30) rotate(-38)"
            />
          </g>
        ) : null}
      </g>
    </g>
  );
};

/* ---------- はなの なかの かべ（よこから きった ところ）。まんなか = かべの まんなか ---------- */
export const NoseWall: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  s?: number;
  frame: number;
  thick?: number; // かべの あつさ
  wallColor?: string;
  tear?: number; // やぶれ（0..1）
  clot?: number; // ちの ふた（0..1）
  wobble?: number; // ふたが ぐらぐら（0..1）
  id: string;
}> = ({
  x,
  y,
  w = 900,
  h = 520,
  s = 1,
  frame,
  thick = 18,
  wallColor = MEMBRANE,
  tear = 0,
  clot = 0,
  wobble = 0,
  id,
}) => {
  if (s <= 0) {
    return null;
  }
  const mY = -h * 0.12;
  const vY = mY + thick + 42;
  const g = 78 * Math.min(1, Math.max(0, tear));
  const level = bleedLevel(tear, clot);
  const plugs = plugFill(4, clot);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={id}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={48} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#eaf7ff" />
        <rect x={-w / 2} y={mY} width={w} height={h} fill="#ffd0d6" />
        {/* ちの みち */}
        {[-0.3, 0.06, 0.34].map((k, i) => (
          <g key={i}>
            <path
              d={`M ${k * w} ${vY} q ${i % 2 ? 60 : -50} ${h * 0.2} ${i % 2 ? -10 : 20} ${h * 0.5}`}
              fill="none"
              stroke={INK}
              strokeWidth={30}
            />
            <path
              d={`M ${k * w} ${vY} q ${i % 2 ? 60 : -50} ${h * 0.2} ${i % 2 ? -10 : 20} ${h * 0.5}`}
              fill="none"
              stroke={BLOOD}
              strokeWidth={20}
            />
          </g>
        ))}
        <line x1={-w} y1={vY} x2={w} y2={vY} stroke={INK} strokeWidth={50} />
        <line x1={-w} y1={vY} x2={w} y2={vY} stroke={BLOOD} strokeWidth={38} />
        {new Array(7).fill(0).map((_, i) => (
          <ellipse
            key={i}
            cx={((i * 163 + frame * 3.2) % (w + 60)) - w / 2 - 30}
            cy={vY + Math.sin(i * 2.1) * 6}
            rx={13}
            ry={10}
            fill="#ff9d9d"
          />
        ))}
        {/* やぶれた ところから ちが でる */}
        {level > 0 ? (
          <g>
            <rect x={-g * 0.8} y={mY - 4} width={g * 1.6} height={vY - mY} fill={BLOOD} />
            {new Array(5).fill(0).map((_, i) => {
              const ph = (frame * 0.022 + i / 5) % 1;
              return (
                <path
                  key={i}
                  d={DROP_D}
                  transform={`translate(${(i - 2) * 30 + Math.sin(i * 3 + frame * 0.1) * 12} ${mY - 20 - ph * h * 0.3}) scale(${level * (0.95 - ph * 0.35)})`}
                  fill={BLOOD}
                  stroke={INK}
                  strokeWidth={5}
                  opacity={1 - ph * ph}
                />
              );
            })}
          </g>
        ) : null}
        {/* かべ */}
        <rect x={-w} y={mY} width={w - g} height={thick} rx={Math.min(9, thick / 2)} fill={wallColor} stroke={INK} strokeWidth={6} />
        <rect x={g} y={mY} width={w} height={thick} rx={Math.min(9, thick / 2)} fill={wallColor} stroke={INK} strokeWidth={6} />
        {/* ちの ふた */}
        {g > 0
          ? plugs.map((k, i) =>
              k <= 0 ? null : (
                <g
                  key={i}
                  transform={`translate(${-g + (i + 0.5) * (g / 2)} ${mY + thick / 2 - 4 + Math.sin(frame * 0.9 + i) * 7 * wobble}) rotate(${Math.sin(frame * 0.7 + i * 2) * 9 * wobble}) scale(${k})`}
                >
                  <rect
                    x={-g / 4 - 3}
                    y={-22}
                    width={g / 2 + 6}
                    height={44}
                    rx={14}
                    fill={SCAB}
                    stroke={INK}
                    strokeWidth={5}
                  />
                </g>
              ),
            )
          : null}
      </g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={48} fill="none" stroke={INK} strokeWidth={10} />
    </g>
  );
};

/* ---------- まえから みた はな。まんなか = はなの まんなか ---------- */
export const FrontNose: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame?: number;
  red?: number; // あれて あかい（0..1）
  crack?: number; // かわいて ひび（0..1）
  bleed?: number; // ち（0..1）
  rot?: number;
}> = ({ x, y, s = 1, frame = 0, red = 0, crack = 0, bleed = 0, rot = 0 }) => {
  if (s <= 0) {
    return null;
  }
  const drip = (frame % 50) / 50;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path
        d="M -40 -130 Q -50 0 -110 50 Q -135 112 -62 112 Q -30 112 0 96 Q 30 112 62 112 Q 135 112 110 50 Q 50 0 40 -130 Z"
        fill={NOSE_SKIN}
        stroke={INK}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      {red > 0 ? (
        <ellipse cx={0} cy={62} rx={96} ry={48} fill="#ff6b6b" opacity={red * 0.55} />
      ) : null}
      <ellipse cx={-52} cy={80} rx={26} ry={16} fill="#7a3b2e" />
      <ellipse cx={52} cy={80} rx={26} ry={16} fill="#7a3b2e" />
      <ellipse cx={-18} cy={-50} rx={10} ry={36} fill="#fff" opacity={0.45} />
      {crack > 0 ? (
        <g opacity={crack} stroke="#b0553f" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M -82 40 l 16 12 l -10 14 l 18 8" />
          <path d="M 84 34 l -18 14 l 12 12 l -14 10" />
          <path d="M -8 20 l 10 16 l -12 12" />
        </g>
      ) : null}
      {bleed > 0 ? (
        <g>
          <path
            d={`M 52 88 q 6 ${30 * bleed} 0 ${64 * bleed}`}
            fill="none"
            stroke={BLOOD}
            strokeWidth={16}
            strokeLinecap="round"
          />
          <path
            d={DROP_D}
            transform={`translate(52 ${104 + 64 * bleed + drip * 110}) scale(${bleed * 0.6})`}
            fill={BLOOD}
            stroke={INK}
            strokeWidth={5}
            opacity={1 - drip * 0.85}
          />
        </g>
      ) : null}
    </g>
  );
};

/* ---------- ゆび（さきが うえ） ---------- */
export const Finger: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
}) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-27} y={0} width={54} height={300} rx={27} fill={SKIN} stroke={INK} strokeWidth={6} />
      <rect x={-15} y={8} width={30} height={34} rx={12} fill="#fff3ea" stroke="#e0a988" strokeWidth={3} />
      <path d="M -14 110 h 28 M -14 124 h 28" stroke="#e0a988" strokeWidth={4} strokeLinecap="round" />
    </g>
  );

/* ---------- ティッシュ ---------- */
export const Tissue: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
}) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path
        d="M -110 -40 Q -60 -70 0 -50 Q 60 -72 112 -38 Q 96 20 120 70 Q 50 60 0 84 Q -56 58 -118 72 Q -96 14 -110 -40 Z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path d="M -50 -20 q 20 30 0 60 M 40 -24 q -18 34 4 62" stroke="#cfd8e6" strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );

/* ---------- ボール ---------- */
export const Ball: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
}) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <circle r={70} fill="#5ec9a6" stroke={INK} strokeWidth={6} />
      <path d="M -70 0 Q 0 -40 70 0 M -70 0 Q 0 40 70 0" fill="none" stroke="#ffffff" strokeWidth={9} />
    </g>
  );

/** ぶつかった ほし */
export const Bang: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) =>
  s <= 0 ? null : (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M 0 -60 L 14 -20 L 56 -30 L 28 4 L 54 40 L 12 28 L 0 66 L -14 28 L -56 40 L -28 4 L -56 -30 L -14 -20 Z"
      fill="#ffe14d"
      stroke={INK}
      strokeWidth={6}
      strokeLinejoin="round"
    />
  );

/* ---------- とけい（10ぷん はかる） ---------- */
export const Clock: React.FC<{ x: number; y: number; s: number; minutes: number }> = ({
  x,
  y,
  s,
  minutes,
}) => {
  if (s <= 0) {
    return null;
  }
  const deg = clockAngle(minutes);
  const a = ((deg - 90) * Math.PI) / 180;
  const R = 132;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={170} fill="#ffffff" stroke={INK} strokeWidth={10} />
      {deg > 0.5 ? (
        <path
          d={`M 0 0 L 0 ${-R} A ${R} ${R} 0 ${deg > 180 ? 1 : 0} 1 ${Math.cos(a) * R} ${Math.sin(a) * R} Z`}
          fill="#ffd166"
        />
      ) : null}
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={-5} y={-158} width={10} height={i % 3 === 0 ? 30 : 18} rx={5} fill={INK} transform={`rotate(${i * 30})`} />
      ))}
      <rect x={-8} y={-128} width={16} height={136} rx={8} fill="#e5484d" stroke={INK} strokeWidth={4} transform={`rotate(${deg})`} />
      <rect x={-8} y={-84} width={16} height={92} rx={8} fill={INK} transform="rotate(300)" />
      <circle r={14} fill={INK} />
    </g>
  );
};

/* ---------- からだの なおしやさん（ヘルメットの さいぼう） ---------- */
export const Fixer: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  carry?: boolean; // ふたの かけらを もつ
  color?: string;
  mood?: Mood;
}> = ({ x, y, s = 1, frame, carry = false, color = "#ffffff", mood = "smile" }) => {
  if (s <= 0) {
    return null;
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {carry ? (
        <rect
          x={-34}
          y={-128 + Math.sin(frame * 0.3 + x) * 4}
          width={68}
          height={46}
          rx={14}
          fill={SCAB}
          stroke={INK}
          strokeWidth={5}
        />
      ) : null}
      <circle cx={-62} cy={carry ? -52 : 10} r={14} fill={color} stroke={INK} strokeWidth={5} />
      <circle cx={62} cy={carry ? -52 : 10} r={14} fill={color} stroke={INK} strokeWidth={5} />
      <circle r={58} fill={color} stroke={INK} strokeWidth={6} />
      <Face r={52} frame={frame} mood={mood} blinkOffset={Math.round(x)} />
      <path d="M -52 -28 Q -50 -82 0 -82 Q 50 -82 52 -28 Z" fill="#ffcf3f" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <rect x={-64} y={-34} width={128} height={14} rx={7} fill="#ffcf3f" stroke={INK} strokeWidth={5} />
    </g>
  );
};

/* ---------- ひざの すりきず（くらべる よう） ---------- */
export const KneeScrape: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={170} fill={SKIN} stroke={INK} strokeWidth={8} />
      <ellipse cx={-50} cy={-70} rx={44} ry={22} fill="#fff" opacity={0.5} />
      <ellipse cx={10} cy={10} rx={66} ry={46} fill={BLOOD} stroke={INK} strokeWidth={5} />
      <path d="M -24 0 h 60 M -14 20 h 50" stroke="#b92f36" strokeWidth={6} strokeLinecap="round" />
    </g>
  );

/** まる（これで いいよ） */
export const Maru: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) =>
  s <= 0 ? null : (
    <circle cx={x} cy={y} r={90 * s} fill="none" stroke="#2fbf71" strokeWidth={30 * s} />
  );
