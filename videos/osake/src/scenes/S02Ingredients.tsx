import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import {
  BeerBottle,
  Grape,
  Pill,
  Rice,
  SakeBottle,
  Wheat,
  WineBottle,
} from "../components/Things";
import { Sparkle } from "../components/Kid";
import { Caption } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S02_DURATION = 540;

const COLS = [
  { x: 420, at: 140, name: "おこめ", drink: "にほんしゅ", color: "#fff3c4" },
  { x: 960, at: 260, name: "ぶどう", drink: "ワイン", color: "#e9d5ff" },
  { x: 1500, at: 380, name: "むぎ", drink: "ビール", color: "#ffe0a3" },
];

export const S02Ingredients: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fff6dc" />
        {new Array(40).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={(i % 8) * 260 + (Math.floor(i / 8) % 2) * 130 + 40}
            cy={Math.floor(i / 8) * 240 + 60 + ((f * 0.4) % 240) - 120}
            r={18}
            fill="#ffe7a8"
          />
        ))}
        {COLS.map((c, i) => {
          const a = pop(f, c.at, 18);
          const b = pop(f, c.at + 50, 18);
          const arrow = ip(
            f,
            [c.at + 20, c.at + 50],
            [0, 1],
            Easing.out(Easing.quad),
          );
          const bounce =
            f > c.at ? Math.abs(Math.sin((f - c.at) * 0.12)) * -10 : 0;
          return (
            <g key={i}>
              <rect
                x={c.x - 240}
                y={60}
                width={480}
                height={960}
                rx={60}
                fill={c.color}
                opacity={a * 0.9}
              />
              <Pill text={c.name} x={c.x} y={130} s={a} frame={f} />
              <g transform={`translate(0 ${bounce})`}>
                {i === 0 ? (
                  <Rice x={c.x} y={360} s={0.9 * a} frame={f} />
                ) : null}
                {i === 1 ? (
                  <Grape x={c.x} y={350} s={0.85 * a} frame={f} />
                ) : null}
                {i === 2 ? (
                  <Wheat x={c.x} y={340} s={0.85 * a} frame={f} />
                ) : null}
              </g>
              {/* やじるし */}
              {arrow > 0 ? (
                <path
                  d={`M ${c.x} 520 L ${c.x} ${520 + 90 * arrow} M ${c.x - 30} ${490 + 90 * arrow} L ${c.x} ${520 + 90 * arrow} L ${c.x + 30} ${490 + 90 * arrow}`}
                  stroke="#ff7b54"
                  strokeWidth={18}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ) : null}
              <g transform={`translate(${c.x} 950) scale(${b})`}>
                {i === 0 ? <SakeBottle s={0.75} /> : null}
                {i === 1 ? <WineBottle s={0.8} /> : null}
                {i === 2 ? <BeerBottle s={0.85} /> : null}
              </g>
              <Pill
                text={c.drink}
                x={c.x}
                y={1000}
                s={pop(f, c.at + 60, 16)}
                frame={f}
                color="#ffe14d"
              />
              {f >= c.at + 50 && f < c.at + 90
                ? [0, 1, 2].map((k) => (
                    <Sparkle
                      key={k}
                      x={c.x + (k - 1) * 120}
                      y={720 - (k % 2) * 60}
                      s={
                        pop(f, c.at + 52 + k * 4, 10) *
                        ip(f, [c.at + 75, c.at + 90], [1, 0])
                      }
                    />
                  ))
                : null}
            </g>
          );
        })}
      </svg>
      <Caption
        text="おさけの もとは？"
        start={10}
        end={COLS[0].at - 5}
        position="center"
        size={110}
      />
    </AbsoluteFill>
  );
};
