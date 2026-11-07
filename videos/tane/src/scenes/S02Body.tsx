import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import {
  Carrot,
  Flower,
  INK,
  Leader,
  Leaf,
  Negi,
  Pill,
  Pumpkin,
  Soil,
  STEM,
  Tomato,
} from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S02_DURATION = DURATIONS[1];

const VEG = 20; // やさいは みんな しょくぶつ
const BODY = 115; // しょくぶつの からだには…
// ことばに あわせて ラベルを だす
const LABELS = [
  { t: 172, text: "ねっこ", x: 640, y: 960, tx: 930, ty: 920, color: "#e7c39b" },
  { t: 195, text: "くき", x: 1300, y: 720, tx: 972, ty: 700, color: "#b6e59e" },
  { t: 218, text: "はっぱ", x: 1340, y: 540, tx: 1080, ty: 560, color: "#b6e59e" },
  { t: 240, text: "はな", x: 1400, y: 330, tx: 1130, ty: 370, color: "#ffe14d" },
  { t: 280, text: "み", x: 560, y: 470, tx: 770, ty: 560, color: "#ff9a8a" },
];

export const S02Body: React.FC = () => {
  const f = useCurrentFrame();
  const vegOut = ip(f, [BODY - 20, BODY], [1, 0]);
  const plant = ip(f, [BODY - 10, BODY + 30], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#d9f2ff" />
        <Soil y={820} h={260} />

        {/* やさいは みんな しょくぶつ */}
        {vegOut > 0 ? (
          <g opacity={vegOut}>
            <Pumpkin x={380} y={640} s={0.8 * pop(f, VEG + 10)} />
            <g transform={`translate(800 760) scale(${pop(f, VEG + 20)})`}>
              <Negi x={0} y={0} s={0.7} />
            </g>
            <Tomato x={1160} y={640} s={1.1 * pop(f, VEG + 30)} />
            <Carrot
              x={1540}
              y={620}
              s={1.0 * pop(f, VEG + 40)}
              rot={20}
            />
          </g>
        ) : null}

        {/* しょくぶつの からだ */}
        {plant > 0 ? (
          <g opacity={plant}>
            {/* ね */}
            {[-60, -30, 0, 30, 60].map((dx, i) => (
              <path
                key={i}
                d={`M 960 830 q ${dx * 0.6} 40 ${dx * 1.5} ${100 + (i % 2) * 40}`}
                stroke="#f3e2c4"
                strokeWidth={9}
                strokeLinecap="round"
                fill="none"
              />
            ))}
            {/* くき */}
            <path
              d="M 960 830 Q 950 600 965 320"
              stroke={STEM}
              strokeWidth={22}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 962 470 Q 1040 420 1110 380"
              stroke={STEM}
              strokeWidth={14}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 958 520 Q 870 480 800 500"
              stroke={STEM}
              strokeWidth={14}
              strokeLinecap="round"
              fill="none"
            />
            {/* は */}
            <Leaf x={955} y={680} rot={-160} s={1.3} />
            <Leaf x={960} y={600} rot={-20} s={1.3} />
            <Leaf x={962} y={380} rot={-130} s={0.9} />
            {/* はな */}
            <Flower x={1120} y={370} s={1.1} />
            {/* み */}
            <path
              d="M 800 500 L 790 520"
              stroke={STEM}
              strokeWidth={10}
              strokeLinecap="round"
            />
            <Tomato x={780} y={590} s={0.95} />
          </g>
        ) : null}

        {LABELS.map((l) => {
          const s = pop(f, l.t);
          if (s <= 0) {
            return null;
          }
          return (
            <g key={l.text}>
              <Leader
                x1={l.x}
                y1={l.y}
                x2={l.tx}
                y2={l.ty}
                p={ip(f, [l.t, l.t + 14], [0, 1])}
              />
              <Pill
                text={l.text}
                x={l.x}
                y={l.y}
                s={s}
                size={72}
                color={l.color}
                frame={f}
              />
            </g>
          );
        })}
        <rect width={1920} height={1080} fill="none" stroke={INK} strokeWidth={0} />
      </svg>
      <Caption
        text="やさいは しょくぶつ"
        start={VEG + 5}
        end={BODY - 10}
        position="top"
        size={100}
      />
    </AbsoluteFill>
  );
};
