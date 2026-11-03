import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { Arrow, INK, LAND, Pill, SEA, Whirl } from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S06_DURATION = 500;

const FASTSLOW = 20; // まんなかは はやい、はしっこは ゆっくり
const SLOW = 110;
const MEET = 200; // すれちがうと…
const SPIN = 345; // くるっ！

const TOP = 230;
const BOTTOM = 950;
const ROWS = [
  { y: 330, v: 0.25 },
  { y: 470, v: 1 },
  { y: 590, v: 1 },
  { y: 710, v: 1 },
  { y: 850, v: 0.25 },
];
const SEAMS = [400, 780];

export const S06Spin: React.FC = () => {
  const f = useCurrentFrame();
  const seamGlow = ip(f, [MEET, MEET + 30], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill={SEA} />
        <rect
          y={-20}
          width={1920}
          height={TOP + 20}
          fill={LAND}
          stroke={INK}
          strokeWidth={7}
        />
        <rect
          y={BOTTOM}
          width={1920}
          height={150}
          fill={LAND}
          stroke={INK}
          strokeWidth={7}
        />
        {ROWS.map((r, ri) => {
          const show = pop(
            f,
            r.v > 0.5 ? FASTSLOW + ri * 6 : SLOW + ri * 4,
            16,
          );
          if (show <= 0) {
            return null;
          }
          const step = 480;
          const len = 80 + r.v * 220;
          const shift = (f * r.v * 12) % step;
          return new Array(6).fill(0).map((_, k) => {
            const x = k * step + shift - step;
            return (
              <g key={`${ri}-${k}`} opacity={show}>
                <Arrow
                  x1={x}
                  y1={r.y}
                  x2={x + len * show}
                  y2={r.y}
                  color={r.v > 0.5 ? "#ff7b54" : "#ffffff"}
                  width={r.v > 0.5 ? 18 : 12}
                />
              </g>
            );
          });
        })}
        {SEAMS.map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={1920}
            y2={y}
            stroke="#ffe14d"
            strokeWidth={10}
            strokeDasharray="30 22"
            strokeDashoffset={-f * 3}
            opacity={seamGlow * (0.6 + 0.4 * Math.sin(f * 0.3))}
          />
        ))}
        {[460, 960, 1460].map((x, i) =>
          SEAMS.map((y, j) => (
            <Whirl
              key={`${x}-${y}`}
              x={x + j * 250 - 125}
              y={y}
              r={95 * pop(f, SPIN + i * 6 + j * 3, 20)}
              frame={f}
              speed={7}
              dir={j === 0 ? -1 : 1}
              face={i === 1 && j === 0}
              mood="wow"
            />
          )),
        )}
        <Pill
          text="はやい"
          x={200}
          y={590}
          s={pop(f, FASTSLOW + 20, 16)}
          frame={f}
          color="#ffe14d"
        />
        <Pill
          text="ゆっくり"
          x={1700}
          y={330}
          s={pop(f, SLOW + 15, 16)}
          frame={f}
        />
        <Pill
          text="ゆっくり"
          x={1700}
          y={850}
          s={pop(f, SLOW + 25, 16)}
          frame={f}
        />
        <Sfx
          text="くるっ！"
          x={1500}
          y={600}
          start={SPIN + 10}
          end={S06_DURATION}
          size={140}
          color="#ffe14d"
        />
      </svg>
      <Caption
        text="すれちがうと…"
        start={MEET + 5}
        end={SPIN - 5}
        position="top"
        size={96}
      />
      <Caption
        text="うずが できた！"
        start={SPIN + 30}
        end={S06_DURATION}
        position="top"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
