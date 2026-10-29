import React from "react";
import { Face } from "./Characters";
import { FONT } from "./Caption";

const INK = "#2b2b4a";

/* ---------- よるの ダイニング ---------- */
export const DiningBg: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect width={1920} height={1080} fill="#ffe8c7" />
    {/* かべの もよう */}
    {new Array(13).fill(0).map((_, i) => (
      <rect
        key={i}
        x={i * 160 + 40}
        y={0}
        width={60}
        height={1080}
        fill="#ffdfb3"
      />
    ))}
    {/* よるの まど */}
    <g transform="translate(300 120)">
      <rect
        width={420}
        height={330}
        rx={24}
        fill="#2c3570"
        stroke="#a0673d"
        strokeWidth={22}
      />
      <circle cx={300} cy={100} r={52} fill="#fff6c2" />
      <circle cx={322} cy={86} r={46} fill="#2c3570" />
      {[
        [80, 80],
        [150, 200],
        [230, 60],
        [360, 240],
        [100, 260],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={5}
          fill="#fff"
          opacity={0.5 + 0.5 * Math.sin(frame * 0.1 + i * 2)}
        />
      ))}
      <line
        x1={210}
        y1={0}
        x2={210}
        y2={330}
        stroke="#a0673d"
        strokeWidth={14}
      />
      <line
        x1={0}
        y1={165}
        x2={420}
        y2={165}
        stroke="#a0673d"
        strokeWidth={14}
      />
    </g>
    {/* ランプ */}
    <g transform={`translate(1180 0) rotate(${Math.sin(frame * 0.04) * 2})`}>
      <line x1={0} y1={0} x2={0} y2={150} stroke={INK} strokeWidth={6} />
      <path
        d="M -110 230 Q 0 110 110 230 Z"
        fill="#ff9f43"
        stroke={INK}
        strokeWidth={6}
      />
      <ellipse cx={0} cy={235} rx={40} ry={16} fill="#fff6c2" />
    </g>
    <ellipse
      cx={1180}
      cy={700}
      rx={600}
      ry={260}
      fill="#fff6c2"
      opacity={0.35}
    />
  </g>
);

/** テーブル（まえに かく） */
export const Table: React.FC<{ y?: number }> = ({ y = 780 }) => (
  <g>
    <rect
      x={-20}
      y={y}
      width={1960}
      height={44}
      rx={12}
      fill="#c9844f"
      stroke={INK}
      strokeWidth={6}
    />
    <rect x={-20} y={y + 44} width={1960} height={400} fill="#a0673d" />
  </g>
);

type Mood = "smile" | "wow" | "sleep";

/* ---------- おとな（パパ・ママ） ---------- */
export const Adult: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  variant?: "papa" | "mama";
  mood?: Mood;
  blush?: number; // 0..1 かおが あかい
  raise?: number; // 0..1 みぎてを くちもとへ
  hold?: React.ReactNode; // みぎてに もつ もの
  sway?: number; // 0..1 ふわふわ ゆれる
  flip?: boolean;
}> = ({
  x,
  y,
  s = 1,
  frame,
  variant = "papa",
  mood = "smile",
  blush = 0,
  raise = 0,
  hold,
  sway = 0,
  flip = false,
}) => {
  const shirt = variant === "papa" ? "#4cc38a" : "#ff8fab";
  const hair = variant === "papa" ? "#3b2a20" : "#7a4a2a";
  const arm = 20 + raise * 165;
  const rot = Math.sin(frame * 0.08) * 6 * sway;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${rot} 0 160)`}
    >
      {/* ママの うしろがみ */}
      {variant === "mama" ? (
        <path
          d="M -100 -200 Q -120 -40 -70 -40 L 70 -40 Q 120 -40 100 -200 Z"
          fill={hair}
        />
      ) : null}
      {/* ひだりうで */}
      <g transform="rotate(20 -70 -40)">
        <rect
          x={-92}
          y={-50}
          width={38}
          height={130}
          rx={19}
          fill={shirt}
          stroke={INK}
          strokeWidth={5}
        />
        <circle
          cx={-73}
          cy={88}
          r={22}
          fill="#ffd9b8"
          stroke={INK}
          strokeWidth={5}
        />
      </g>
      {/* からだ */}
      <rect
        x={-85}
        y={-75}
        width={170}
        height={240}
        rx={60}
        fill={shirt}
        stroke={INK}
        strokeWidth={5}
      />
      {/* くび + あたま */}
      <circle
        cx={0}
        cy={-185}
        r={92}
        fill="#ffd9b8"
        stroke={INK}
        strokeWidth={5}
      />
      <circle cx={0} cy={-185} r={88} fill="#ff6b6b" opacity={blush * 0.22} />
      {variant === "papa" ? (
        <path
          d="M -92 -190 Q -95 -290 0 -285 Q 95 -290 92 -190 Q 70 -240 10 -238 Q -50 -240 -92 -190 Z"
          fill={hair}
        />
      ) : (
        <>
          <path
            d="M -94 -180 Q -100 -292 0 -287 Q 100 -292 94 -180 Q 40 -250 -94 -180 Z"
            fill={hair}
          />
          <circle cx={0} cy={-290} r={38} fill={hair} />
        </>
      )}
      <g transform="translate(0 -175)">
        <Face
          r={92}
          frame={frame}
          mood={mood}
          blinkOffset={variant === "papa" ? 0 : 40}
        />
        {blush > 0 ? (
          <>
            <ellipse
              cx={-46}
              cy={14}
              rx={22}
              ry={12}
              fill="#ff4d6d"
              opacity={blush * 0.75}
            />
            <ellipse
              cx={46}
              cy={14}
              rx={22}
              ry={12}
              fill="#ff4d6d"
              opacity={blush * 0.75}
            />
          </>
        ) : null}
      </g>
      {/* みぎうで（もちものは てに つく） */}
      <g transform={`rotate(${-arm} 70 -40)`}>
        <rect
          x={54}
          y={-50}
          width={38}
          height={130}
          rx={19}
          fill={shirt}
          stroke={INK}
          strokeWidth={5}
        />
        {hold ? (
          <g transform={`translate(73 88) rotate(${arm})`}>{hold}</g>
        ) : null}
        <circle
          cx={73}
          cy={88}
          r={22}
          fill="#ffd9b8"
          stroke={INK}
          strokeWidth={5}
        />
      </g>
    </g>
  );
};

/* ---------- のみもの ---------- */

/** ビールの ジョッキ（てで もつ ところが 0,0） */
export const BeerMug: React.FC<{
  frame: number;
  level?: number;
  s?: number;
}> = ({ frame, level = 1, s = 1 }) => {
  const top = -150 + (1 - level) * 120;
  return (
    <g transform={`scale(${s})`}>
      <path
        d="M 50 -110 q 55 0 55 45 q 0 45 -55 45"
        fill="none"
        stroke={INK}
        strokeWidth={14}
      />
      <path
        d="M 50 -110 q 55 0 55 45 q 0 45 -55 45"
        fill="none"
        stroke="#eaf6ff"
        strokeWidth={7}
      />
      <rect
        x={-55}
        y={-160}
        width={110}
        height={180}
        rx={16}
        fill="#eaf6ff"
        opacity={0.6}
        stroke={INK}
        strokeWidth={6}
      />
      <rect
        x={-48}
        y={top}
        width={96}
        height={12 - top}
        rx={10}
        fill="#ffb627"
      />
      {new Array(6).fill(0).map((_, i) => {
        const t = ((frame * 2 + i * 37) % 120) / 120;
        return (
          <circle
            key={i}
            cx={-30 + (i % 3) * 30}
            cy={10 - t * (10 - top)}
            r={4}
            fill="#fff3c4"
            opacity={1 - t}
          />
        );
      })}
      {level > 0.05 ? (
        <path
          d={`M -56 ${top + 4} q 0 -34 28 -30 q 14 -22 38 -6 q 30 -10 46 18 q 4 14 0 18 Z`}
          fill="#fffdf5"
          stroke={INK}
          strokeWidth={5}
        />
      ) : null}
    </g>
  );
};

/** ワイングラス（あしの したが 0,0） */
export const WineGlass: React.FC<{ s?: number; level?: number }> = ({
  s = 1,
  level = 1,
}) => (
  <g transform={`scale(${s})`}>
    <ellipse
      cx={0}
      cy={0}
      rx={45}
      ry={10}
      fill="#eaf6ff"
      stroke={INK}
      strokeWidth={5}
    />
    <rect
      x={-5}
      y={-90}
      width={10}
      height={90}
      fill="#eaf6ff"
      stroke={INK}
      strokeWidth={4}
    />
    <path
      d="M -55 -200 Q -60 -90 0 -90 Q 60 -90 55 -200 Z"
      fill="#eaf6ff"
      opacity={0.6}
      stroke={INK}
      strokeWidth={6}
    />
    {level > 0 ? (
      <path
        d={`M ${-52 + (1 - level) * 10} ${-160 + (1 - level) * 50} Q -52 -96 0 -96 Q 52 -96 ${52 - (1 - level) * 10} ${-160 + (1 - level) * 50} Z`}
        fill="#9b2242"
      />
    ) : null}
  </g>
);

/** ジュースの コップ（そこが 0,0） */
export const JuiceGlass: React.FC<{
  s?: number;
  color?: string;
  straw?: boolean;
}> = ({ s = 1, color = "#ff9f1c", straw = true }) => (
  <g transform={`scale(${s})`}>
    {straw ? (
      <path
        d="M 10 -130 L 40 -200 L 70 -200"
        stroke="#ff4d6d"
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
    ) : null}
    <path
      d="M -45 -140 L -38 0 L 38 0 L 45 -140 Z"
      fill="#eaf6ff"
      opacity={0.6}
      stroke={INK}
      strokeWidth={6}
    />
    <path d="M -42 -110 L -37 -4 L 37 -4 L 42 -110 Z" fill={color} />
    <circle cx={-12} cy={-70} r={8} fill="#fff" opacity={0.6} />
  </g>
);

/** かん（そこが 0,0）。osake=true だと「おさけ」マーク */
export const Can: React.FC<{
  s?: number;
  color: string;
  fruit: "orange" | "grape" | "lemon" | "peach";
  osake?: boolean;
  markGlow?: number;
}> = ({ s = 1, color, fruit, osake = false, markGlow = 0 }) => {
  const fruitColor = {
    orange: "#ff9f1c",
    grape: "#8e44ad",
    lemon: "#ffe14d",
    peach: "#ffb3c6",
  }[fruit];
  return (
    <g transform={`scale(${s})`}>
      <rect
        x={-80}
        y={-300}
        width={160}
        height={300}
        rx={22}
        fill={color}
        stroke={INK}
        strokeWidth={7}
      />
      <rect
        x={-70}
        y={-318}
        width={140}
        height={26}
        rx={10}
        fill="#cfd8e3"
        stroke={INK}
        strokeWidth={6}
      />
      <rect
        x={-80}
        y={-26}
        width={160}
        height={26}
        rx={10}
        fill="#cfd8e3"
        stroke={INK}
        strokeWidth={6}
      />
      {fruit === "grape" ? (
        [
          [0, -205],
          [-24, -180],
          [24, -180],
          [-12, -155],
          [12, -155],
          [0, -132],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={20}
            fill={fruitColor}
            stroke={INK}
            strokeWidth={4}
          />
        ))
      ) : (
        <>
          <circle
            cx={0}
            cy={-170}
            r={56}
            fill={fruitColor}
            stroke={INK}
            strokeWidth={5}
          />
          <circle cx={0} cy={-170} r={40} fill="#fff" opacity={0.25} />
          <path
            d="M 0 -226 q 18 -24 40 -14 q -16 22 -40 14"
            fill="#4cc38a"
            stroke={INK}
            strokeWidth={4}
          />
        </>
      )}
      <circle cx={-48} cy={-260} r={10} fill="#fff" opacity={0.5} />
      {osake ? (
        <g transform="translate(0 -70)">
          {markGlow > 0 ? (
            <circle r={58} fill="#ffe14d" opacity={markGlow * 0.8} />
          ) : null}
          <circle r={40} fill="#fff" stroke="#e63946" strokeWidth={7} />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30 }}
            fill="#e63946"
          >
            お酒
          </text>
        </g>
      ) : null}
    </g>
  );
};
