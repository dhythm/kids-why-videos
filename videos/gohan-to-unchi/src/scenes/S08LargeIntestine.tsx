import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolateColors,
  random,
  useCurrentFrame,
} from "remotion";
import { getLength } from "@remotion/paths";
import { pointAt, tangentAt } from "../lib/path";
import { Buddy, Drop, Sparkle, Unchi } from "../components/Food";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S08_DURATION = 690;

const WATER = 95;
const WATER_END = 250;
const BUDDIES = 255;
const DONE = 520;

const COLON =
  "M 330 990 L 330 330 Q 330 230 430 230 L 1490 230 Q 1590 230 1590 330 L 1590 760 Q 1590 860 1490 860 L 1120 860";
const COLON_LEN = getLength(COLON);
const BUDDY_COLORS = ["#7bd389", "#7fd0ff", "#ffd166", "#c3a6ff", "#ff9fb2"];

function at(t: number) {
  const l = Math.max(0, Math.min(1, t)) * COLON_LEN;
  return { p: pointAt(COLON, l), tan: tangentAt(COLON, l) };
}

export const S08LargeIntestine: React.FC = () => {
  const f = useCurrentFrame();
  // なかみの すすみぐあい
  const g = ip(f, [10, DONE - 10], [0.08, 1.0], Easing.inOut(Easing.sin));
  const gather = ip(f, [DONE - 20, DONE + 20], [0, 1], Easing.in(Easing.quad));
  const blobs = [];
  for (let i = 0; i < 16; i++) {
    const t = g - i * 0.04;
    if (t < 0) {
      continue;
    }
    const { p } = at(t);
    const firm = ip(t, [0.15, 0.9], [0, 1]);
    const color = interpolateColors(firm, [0, 1], ["#f2d08a", "#9b6a3c"]);
    const r = 46 - firm * 12;
    const wob = (1 - firm) * 8;
    blobs.push(
      <ellipse
        key={i}
        cx={p.x + Math.sin(f * 0.2 + i) * wob}
        cy={p.y + Math.cos(f * 0.23 + i) * wob}
        rx={r + Math.sin(f * 0.3 + i) * wob}
        ry={r - Math.sin(f * 0.3 + i) * wob}
        fill={color}
        stroke="#2b2b4a"
        strokeWidth={firm > 0.5 ? 4 : 0}
        opacity={(0.75 + firm * 0.25) * (1 - gather)}
      />,
    );
  }

  // すいとられる みず
  const drops = [];
  if (f >= WATER && f < WATER_END + 40) {
    for (let k = 0; k < 24; k++) {
      const born = WATER + k * 6;
      const age = f - born;
      if (age < 0 || age > 40 || born > WATER_END) {
        continue;
      }
      const t = g - (k % 8) * 0.04;
      const { p, tan } = at(t);
      const side = random(`ds${k}`) > 0.5 ? 1 : -1;
      const nx = -tan.y * side;
      const ny = tan.x * side;
      const d = 20 + age * 4;
      drops.push(
        <Drop
          key={k}
          x={p.x + nx * d}
          y={p.y + ny * d}
          s={0.8}
          opacity={1 - age / 40}
        />,
      );
    }
  }

  // おなかの なかま
  const buddies = [];
  if (f >= BUDDIES) {
    for (let i = 0; i < 10; i++) {
      const t = 0.08 + i * 0.09;
      const { p, tan } = at(t);
      const s =
        pop(f, BUDDIES + i * 8, 16) *
        0.55 *
        ip(f, [DONE + 30, DONE + 50], [1, 0.0001]);
      const rot =
        (Math.atan2(tan.y, tan.x) * 180) / Math.PI +
        Math.sin(f * 0.15 + i) * 10;
      const off = Math.sin(f * 0.1 + i * 2) * 30;
      buddies.push(
        <Buddy
          key={i}
          x={p.x - tan.y * off}
          y={p.y + tan.x * off}
          s={s}
          frame={f + i * 10}
          color={BUDDY_COLORS[i % 5]}
          rotate={rot}
          munch
        />,
      );
    }
  }

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#fff0f5, #ffe1ec)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* だいちょう */}
        <g opacity={ip(f, [DONE, DONE + 25], [1, 0])}>
          <path
            d={COLON}
            stroke="#2b2b4a"
            strokeWidth={214}
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d={COLON}
            stroke="#ff9fb2"
            strokeWidth={200}
            fill="none"
            strokeLinejoin="round"
          />
          {/* くびれ */}
          {new Array(26).fill(0).map((_, i) => {
            const { p, tan } = at(i / 26 + 0.02);
            return (
              <line
                key={i}
                x1={p.x - tan.y * 100}
                y1={p.y + tan.x * 100}
                x2={p.x - tan.y * 76}
                y2={p.y + tan.x * 76}
                stroke="#ff6f91"
                strokeWidth={10}
                strokeLinecap="round"
              />
            );
          })}
          <path
            d={COLON}
            stroke="#d9486f"
            strokeWidth={140}
            fill="none"
            strokeLinejoin="round"
          />
          {blobs}
          {drops}
          {buddies}
        </g>
        {/* できあがり */}
        {f >= DONE ? (
          <g>
            <circle
              cx={960}
              cy={560}
              r={220 * pop(f, DONE + 10, 24)}
              fill="#fff59d"
              opacity={0.6}
            />
            <Unchi
              x={960}
              y={570 + Math.sin(f * 0.15) * 8}
              s={1.25 * pop(f, DONE + 15, 24)}
              frame={f}
              squash={1 + Math.sin(f * 0.25) * 0.05}
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <Sparkle
                key={i}
                x={960 + Math.cos(i * 1.3) * 250}
                y={540 + Math.sin(i * 1.9) * 170}
                s={
                  pop(f, DONE + 30 + i * 6, 14) *
                  (0.8 + Math.sin(f * 0.2 + i) * 0.2)
                }
              />
            ))}
          </g>
        ) : null}
        <Sfx
          text="ぎゅー"
          x={960}
          y={700}
          start={WATER + 20}
          end={WATER_END}
          size={100}
          color="#7fd0ff"
        />
        <Sfx
          text="もぐもぐ"
          x={960}
          y={700}
          start={BUDDIES + 60}
          end={DONE - 30}
          size={100}
          color="#7bd389"
        />
      </svg>
      <Caption
        text="だいちょう"
        start={15}
        end={WATER - 5}
        position="center"
        size={96}
      />
      <Caption
        text="みずを すいとる"
        start={WATER}
        end={WATER_END}
        position="center"
        size={96}
      />
      <Caption
        text="おなかの なかま"
        start={BUDDIES + 10}
        end={DONE - 10}
        position="center"
        size={96}
      />
      <Caption
        text="うんちの できあがり！"
        start={DONE + 20}
        end={S08_DURATION}
        position="top"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
