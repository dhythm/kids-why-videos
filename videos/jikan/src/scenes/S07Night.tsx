import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption } from "../components/Caption";
import { RoomBg } from "../components/Backgrounds";
import { blockX, Book, Futon, RiceBowl, Shirt, TimeBar, Toothbrush, ToyTower } from "../components/Jikan";
import { Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S07_DURATION = DURATIONS[6];

const START = 20; // よるも おなじ・ねる じかん
const FAST = 155; // さっと おわると
const REST = 265; // たのしい じかんが のこる

const BAR = { x: 420, y: 915 };
const STEP = [0, 30, 60]; // ごはん・きがえ・はみがき

export const S07Night: React.FC = () => {
  const f = useCurrentFrame();
  const used = STEP.reduce((a, d) => a + ip(f, [FAST + d + 12, FAST + d + 28], [0, 1]), 0);
  const drop = (i: number): number => ip(f, [FAST + STEP[i], FAST + STEP[i] + 20], [600, BAR.y]);
  const icon = (i: number): number => 0.58 * pop(f, FAST + STEP[i], 12);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <RoomBg frame={f} night />
        <Kid x={640} y={640} s={0.9} frame={f} shirt="#c9b8f0" pants="#8f7fd0" armUp={ip(f, [REST + 10, REST + 30], [0, 1])} />
        <Book x={1020} y={600} s={1.5 * pop(f, REST + 10)} rot={Math.sin(f * 0.1) * 4} />
        <ToyTower x={1340} y={640} s={0.9 * pop(f, REST + 25)} />
        {f > REST + 30
          ? [0, 1, 2, 3].map((i) => (
              <Sparkle key={i} x={900 + i * 190} y={400 + (i % 2) * 70} s={pop(f, REST + 30 + i * 5, 12) * (0.8 + 0.2 * Math.sin(f * 0.3 + i))} />
            ))
          : null}
        <Futon x={1610} y={925} s={0.78 * pop(f, START + 10)} />
        <Pill text="ねる じかん" x={1610} y={745} s={pop(f, START + 55)} size={40} color="#fff3a8" frame={f} />
        <TimeBar x={BAR.x} y={BAR.y} used={used} frame={f} appear={(i) => pop(f, START + 20 + i * 8, 12)} glow={ip(f, [REST, REST + 15], [0, 1])} />
        <RiceBowl x={blockX(0, BAR.x)} y={drop(0)} s={icon(0)} />
        <Shirt x={blockX(1, BAR.x)} y={drop(1)} s={icon(1)} color="#c9b8f0" />
        <Toothbrush x={blockX(2, BAR.x)} y={drop(2) + 8} s={icon(2)} rot={-20} />
      </svg>
      <Caption text="よるも おなじ" start={START + 10} end={FAST - 10} position="top" size={110} />
      <Caption text="さっと おわると…" start={FAST + 10} end={REST - 6} position="top" size={100} />
      <Caption text="たのしい じかんが のこる" start={REST + 15} end={S07_DURATION} position="top" size={90} color="#ffe14d" />
    </AbsoluteFill>
  );
};
