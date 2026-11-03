import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { Bike, INK, LAND, Pill, SEA } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { areaTable, xAtArea } from "../lib/flow";

export const S05_DURATION = 420;

const RUSH = 20; // ざばーっと ながれる
const FAST = 200; // とっても はやい！ じてんしゃ くらい
const MID = 540;

// かいきょうの はば（まんなかほど せまい）
const halfWidth = (x: number) => {
  const n = (x - 960) / 560;
  return 110 + 250 * Math.min(1, n * n);
};
const TABLE = areaTable(halfWidth, 1920);

export const S05Rush: React.FC = () => {
  const f = useCurrentFrame();
  // ながれた りょう（だんだん はやく なる）
  const flow = ip(f, [RUSH, RUSH + 60], [0, 1], (t) => t * t);
  const travel = f < RUSH ? 0 : (f - RUSH) * 2400 * flow;
  const total = TABLE[TABLE.length - 1];
  const top: string[] = [];
  const bottom: string[] = [];
  for (let x = -20; x <= 1940; x += 20) {
    top.push(`${x} ${MID - halfWidth(x)}`);
    bottom.push(`${x} ${MID + halfWidth(x)}`);
  }
  const bikeX = ip(f, [FAST + 10, FAST + 150], [-200, 2150], (t) => t);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill={SEA} />
        {new Array(80).fill(0).map((_, i) => {
          const lane = random(`lane${i}`) - 0.5;
          const a =
            (((random(`a${i}`) * total + travel) % total) + total) % total;
          const x = xAtArea(TABLE, a);
          const y = MID + lane * 1.7 * halfWidth(x);
          const len = 10 + (flow * 9000) / halfWidth(x) / 10;
          return (
            <line
              key={i}
              x1={x - len}
              y1={y}
              x2={x}
              y2={y}
              stroke="#ffffff"
              strokeWidth={10}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
        <path
          d={`M -20 -20 L ${top.join(" L ")} L 1940 -20 Z`}
          fill={LAND}
          stroke={INK}
          strokeWidth={7}
        />
        <path
          d={`M -20 1100 L ${bottom.join(" L ")} L 1940 1100 Z`}
          fill={LAND}
          stroke={INK}
          strokeWidth={7}
        />
        <Pill
          text="たかい"
          x={200}
          y={MID}
          s={pop(f, RUSH + 10, 16)}
          frame={f}
          color="#ffe14d"
        />
        <Pill
          text="ひくい"
          x={1720}
          y={MID}
          s={pop(f, RUSH + 40, 16)}
          frame={f}
          color="#cdeeff"
        />
        <Bike x={bikeX} y={1000} s={0.9} frame={f} />
        <Pill
          text="じてんしゃ くらい！"
          x={1380}
          y={860}
          s={f > FAST + 60 ? pop(f, FAST + 60, 16) : 0}
          frame={f}
          color="#ffe14d"
        />
        <Sfx
          text="ざばーっ"
          x={560}
          y={360}
          start={RUSH + 30}
          end={FAST - 10}
          size={130}
          color="#ffffff"
        />
      </svg>
      <Caption
        text="はやい！"
        start={FAST + 5}
        end={S05_DURATION}
        position="top"
        size={130}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
