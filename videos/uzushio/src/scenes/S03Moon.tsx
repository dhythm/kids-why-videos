import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid } from "../components/Kid";
import { Stars } from "../components/Characters";
import { Caption, Sfx } from "../components/Caption";
import { INK, Moon, Pill, SAND, SEA, WaveLine } from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S03_DURATION = 470;

const MOON = 20; // ひみつは おつきさま
const PULL = 120; // ぐいーっと ひっぱる
const TIDE = 280; // ふえたり へったり

// すなはまの さか（x → y）
const slopeY = (x: number) => 1080 - (x - 600) * (480 / 1320);

export const S03Moon: React.FC = () => {
  const f = useCurrentFrame();
  // うみの たかさ: ひっぱると あがる → ふえたり へったり
  const up = ip(f, [PULL + 20, PULL + 110], [0, 110]);
  const tide = f < TIDE ? up : 110 * Math.cos(((f - TIDE) / 70) * Math.PI);
  const level = 860 - tide;
  const kidX = 1680;
  const kidS = 0.6;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#2c3570" />
        <Stars frame={f} count={80} />
        <g>
          <Moon
            x={1300}
            y={430}
            frame={f}
            s={0.95 * pop(f, MOON, 20)}
            mood={f > PULL && f < TIDE ? "wow" : "smile"}
          />
        </g>

        {/* ひっぱる やじるし */}
        {f > PULL
          ? [0, 1, 2].map((i) => {
              const k = ((f - PULL + i * 15) % 45) / 45;
              return (
                <path
                  key={i}
                  d={`M ${700 + i * 220} ${level - 40 - k * 220} l -26 34 m 26 -34 l 26 34`}
                  stroke="#ffe14d"
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={
                    Math.sin(k * Math.PI) * ip(f, [TIDE - 20, TIDE], [1, 0])
                  }
                />
              );
            })
          : null}

        <rect y={level} width={1920} height={1080 - level} fill={SEA} />
        <rect y={level} width={1920} height={10} fill="#ffffff" opacity={0.6} />
        <WaveLine y={level + 60} frame={f} opacity={0.4} />
        <path
          d={`M 600 1100 L 1940 600 L 1940 1100 Z`}
          fill={SAND}
          stroke={INK}
          strokeWidth={7}
        />
        <Kid
          x={kidX}
          y={slopeY(kidX) - 162 * kidS}
          s={kidS}
          frame={f}
          mood={tide > 60 ? "wow" : "smile"}
        />
        <Sfx
          text="ぐいーっ"
          x={900}
          y={420}
          start={PULL + 10}
          end={TIDE - 10}
          size={110}
          color="#ffe14d"
        />
        <Pill
          text="ふえた！"
          x={420}
          y={level - 90}
          s={f >= TIDE - 60 && f < TIDE + 20 ? pop(f, TIDE - 60, 14) : 0}
          frame={f}
          color="#bfe6ff"
        />
        <Pill
          text="へった！"
          x={420}
          y={level - 90}
          s={f >= TIDE + 55 && f < TIDE + 100 ? pop(f, TIDE + 55, 14) : 0}
          frame={f}
          color="#ffe0a3"
        />
      </svg>
      <Caption
        text="おつきさま"
        start={MOON + 5}
        end={PULL - 5}
        position="top"
        size={110}
        color="#ffe14d"
      />
      <Caption
        text="ぐいーっと ひっぱる"
        start={PULL + 5}
        end={TIDE - 5}
        position="top"
        size={96}
      />
      <Caption
        text="ふえたり へったり"
        start={TIDE + 5}
        end={S03_DURATION}
        position="top"
        size={96}
      />
    </AbsoluteFill>
  );
};
