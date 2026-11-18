import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { blockX, Car, Door, RiceBowl, Shirt, Shower, Sun, TimeBar, ToyTower } from "../components/Jikan";
import { Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S03_DURATION = DURATIONS[2];

const COUNT = 20; // ブロックが むっつ
const CHORE = 170; // したくが つかう
const REST = 360; // のこりが あそぶ じかん

const BAR = { x: 420, y: 640 };
const STEP = [0, 42, 84]; // シャワー・きがえ・ごはん

export const S03Blocks: React.FC = () => {
  const f = useCurrentFrame();
  const used = STEP.reduce((a, d) => a + ip(f, [CHORE + d + 14, CHORE + d + 32], [0, 1]), 0);
  const drop = (i: number): number => ip(f, [CHORE + STEP[i], CHORE + STEP[i] + 22], [400, BAR.y]);
  const icon = (i: number): number => 0.6 * pop(f, CHORE + STEP[i], 12);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#fff6e0" dot="#ffe8bd" />
        <Sun x={285} y={BAR.y} s={0.85 * pop(f, COUNT)} rot={f * 0.4} />
        <Door x={1570} y={BAR.y} s={0.72 * pop(f, COUNT + 10)} />
        <TimeBar x={BAR.x} y={BAR.y} used={used} frame={f} appear={(i) => pop(f, COUNT + 30 + i * 12, 12)} glow={ip(f, [REST, REST + 15], [0, 1])} />
        {new Array(6).fill(0).map((_, i) => (
          <Sfx key={i} text={String(i + 1)} x={blockX(i, BAR.x)} y={500} start={COUNT + 34 + i * 12} end={CHORE - 8} size={84} color="#ffffff" rotate={0} />
        ))}
        <Shower x={blockX(0, BAR.x)} y={drop(0)} s={icon(0)} frame={f} />
        <Shirt x={blockX(1, BAR.x)} y={drop(1)} s={icon(1)} />
        <RiceBowl x={blockX(2, BAR.x)} y={drop(2)} s={icon(2)} />
        <Pill text="したく" x={blockX(1, BAR.x)} y={810} s={pop(f, CHORE + 125)} size={56} color="#cfe7ff" frame={f} />
        <ToyTower x={blockX(4, BAR.x) - 60} y={420} s={0.62 * pop(f, REST + 30)} />
        <Car x={blockX(4, BAR.x) + 110} y={470} s={0.62 * pop(f, REST + 40)} />
        <Pill text="あそぶ じかん" x={blockX(4, BAR.x)} y={810} s={pop(f, REST + 15)} size={56} color="#fff3a8" frame={f} />
      </svg>
      <Caption text="じかんの ブロック" start={COUNT + 10} end={CHORE - 10} position="top" size={100} />
      <Caption text="したくで つかう" start={CHORE + 15} end={REST - 12} position="top" size={100} />
      <Caption text="のこりが あそぶ じかん" start={REST + 10} end={S03_DURATION} position="top" size={92} color="#ffe14d" />
    </AbsoluteFill>
  );
};
