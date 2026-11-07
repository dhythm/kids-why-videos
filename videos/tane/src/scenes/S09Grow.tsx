import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import {
  BigLeaf,
  Pill,
  Pumpkin,
  PumpkinFlower,
  PumpkinSeed,
  Soil,
  STEM,
  Sun,
  WateringCan,
} from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S09_DURATION = DURATIONS[8];

const LIFE = 20; // あたらしい いのちを つなぐ
const SOW = 165; // つちに まいて
const WATER = 200; // おみずを あげると
const SPROUT = 255; // めが でて
const PUMPKIN = 295; // また かぼちゃが できる

const GX = 900; // たねを まく ところ
const GY = 760; // じめん

export const S09Grow: React.FC = () => {
  const f = useCurrentFrame();
  // たね: まんなかで おおきく → つちの なかへ
  const sow = ip(f, [SOW, SOW + 25], [0, 1]);
  const seedX = 960 + (GX - 960) * sow;
  const seedY = 520 + (GY + 50 - 520) * sow;
  const seedS = 4 - sow * 2.8;
  const can = ip(f, [WATER - 10, WATER + 10], [0, 1]) * ip(f, [SPROUT - 5, SPROUT + 10], [1, 0]);
  const sprout = ip(f, [SPROUT, SPROUT + 30], [0, 1]);
  const vine = ip(f, [SPROUT + 25, PUMPKIN + 15], [0, 1]);
  const pk = ip(f, [PUMPKIN + 5, PUMPKIN + 40], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#d6f0ff" />
        <Sun x={1720} y={150} frame={f} s={0.8} />
        <Soil y={GY} h={320} />

        {/* め */}
        {sprout > 0 ? (
          <g>
            <path
              d={`M ${GX} ${GY + 30} L ${GX} ${GY - 90 * sprout}`}
              stroke={STEM}
              strokeWidth={14}
              strokeLinecap="round"
            />
            <ellipse cx={GX - 40 * sprout} cy={GY - 95 * sprout} rx={44 * sprout} ry={22 * sprout} fill="#7ed36a" stroke="#2b2b4a" strokeWidth={5} transform={`rotate(-20 ${GX - 40 * sprout} ${GY - 95 * sprout})`} />
            <ellipse cx={GX + 40 * sprout} cy={GY - 95 * sprout} rx={44 * sprout} ry={22 * sprout} fill="#7ed36a" stroke="#2b2b4a" strokeWidth={5} transform={`rotate(20 ${GX + 40 * sprout} ${GY - 95 * sprout})`} />
          </g>
        ) : null}
        {/* つる → はな → かぼちゃ */}
        {vine > 0 ? (
          <g>
            <path
              d={`M ${GX} ${GY - 40} Q ${GX + 200} ${GY - 120} ${GX + 450 * vine} ${GY - 10}`}
              stroke={STEM}
              strokeWidth={14}
              fill="none"
              strokeLinecap="round"
            />
            <BigLeaf x={GX + 140} y={GY - 70} s={0.9 * ip(vine, [0.2, 0.5], [0, 1])} rot={-20} />
            <BigLeaf x={GX + 330} y={GY - 50} s={0.8 * ip(vine, [0.4, 0.7], [0, 1])} rot={15} />
            <BigLeaf x={GX - 160} y={GY - 10} s={0.9 * ip(vine, [0.3, 0.6], [0, 1])} rot={-35} />
            {pk < 0.5 ? (
              <PumpkinFlower x={GX + 450} y={GY - 120} s={0.8 * ip(vine, [0.7, 1], [0, 1]) * (1 - pk)} />
            ) : null}
          </g>
        ) : null}
        {pk > 0 ? <Pumpkin x={GX + 470} y={GY - 50} s={0.75 * pk} /> : null}

        {/* たね */}
        {sprout < 0.5 ? (
          <g opacity={1 - sprout * 2}>
            <PumpkinSeed x={seedX} y={seedY} s={seedS * pop(f, LIFE)} rot={-20 + Math.sin(f * 0.1) * 6} />
          </g>
        ) : null}
        {f < SOW
          ? [0, 1, 2, 3].map((i) => (
              <Sparkle
                key={i}
                x={960 + Math.cos(i * 1.6 + f * 0.02) * 150}
                y={520 + Math.sin(i * 1.6 + f * 0.02) * 90}
                s={pop(f, LIFE + 15 + i * 5, 12) * (0.7 + 0.3 * Math.sin(f * 0.2 + i))}
              />
            ))
          : null}

        {/* じょうろ */}
        {can > 0 ? (
          <g opacity={can}>
            <WateringCan x={GX - 230} y={GY - 300} s={1.1} rot={20} />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const k = ((f - WATER + i * 6) % 30) / 30;
              return (
                <ellipse
                  key={i}
                  cx={GX - 20 + (i % 3) * 20}
                  cy={GY - 300 + k * 290}
                  rx={7}
                  ry={11}
                  fill="#6cc3ff"
                />
              );
            })}
          </g>
        ) : null}
        <Sfx text="ぴょこっ" x={GX + 180} y={GY - 170} start={SPROUT + 10} end={PUMPKIN} size={90} color="#a5dc86" />
        <Pill text="また かぼちゃ！" x={GX + 470} y={GY - 260} s={pop(f, PUMPKIN + 35)} size={64} color="#ffe14d" frame={f} />
      </svg>
      <Caption text="いのちを つなぐ" start={LIFE + 10} end={SOW - 5} position="top" size={100} color="#ffe14d" />
    </AbsoluteFill>
  );
};
