import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import {
  Bus,
  Momiji,
  Pill,
  Sakura,
  SEA,
  WaveLine,
  Whirl,
} from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S08_DURATION = 360;

const BIG = 20; // バス 2だいぶん
const SEASON = 150; // はると あき、おおしお

const CX = 960;
const CY = 520;
const R = 320;

export const S08Size: React.FC = () => {
  const f = useCurrentFrame();
  const grow = ip(f, [BIG, BIG + 50], [0.3, 1]);
  const busIn = (k: number) => pop(f, BIG + 55 + k * 10, 18);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill={SEA} />
        <WaveLine y={240} frame={f} opacity={0.4} />
        <WaveLine y={880} frame={f + 50} opacity={0.4} />
        <Whirl x={CX} y={CY} r={R * grow} frame={f} face arms={6} speed={3} />
        {/* うずの はば = バス 2だい */}
        <g
          opacity={busIn(0)}
          stroke="#ffffff"
          strokeWidth={6}
          strokeDasharray="14 10"
        >
          <line x1={CX - R} y1={CY} x2={CX - R} y2={860} />
          <line x1={CX + R} y1={CY} x2={CX + R} y2={860} />
        </g>
        <g
          transform={`translate(0 ${(1 - busIn(0)) * 120})`}
          opacity={busIn(0)}
        >
          <Bus x={CX - R} y={870} w={R} frame={f} />
        </g>
        <g
          transform={`translate(0 ${(1 - busIn(1)) * 120})`}
          opacity={busIn(1)}
        >
          <Bus x={CX} y={870} w={R} frame={f} />
        </g>
        <Sakura
          x={300}
          y={420}
          s={1.4 * pop(f, SEASON + 10, 18)}
          rot={f * 0.8}
        />
        <Pill
          text="はる"
          x={300}
          y={600}
          s={pop(f, SEASON + 15, 16)}
          frame={f}
          color="#ffc2d4"
        />
        <Momiji
          x={1620}
          y={410}
          s={1.3 * pop(f, SEASON + 40, 18)}
          rot={Math.sin(f * 0.08) * 12}
        />
        <Pill
          text="あき"
          x={1620}
          y={600}
          s={pop(f, SEASON + 45, 16)}
          frame={f}
          color="#ffcf9e"
        />
      </svg>
      <Caption
        text="バス 2だいぶん！"
        start={BIG + 60}
        end={SEASON - 5}
        position="top"
        size={100}
        color="#ffe14d"
      />
      <Caption
        text="おおしおの ころが いちばん"
        start={SEASON + 70}
        end={S08_DURATION}
        position="top"
        size={84}
      />
    </AbsoluteFill>
  );
};
