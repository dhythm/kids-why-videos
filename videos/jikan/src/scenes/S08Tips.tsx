import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { blockX, Check, Door, RiceBowl, Sun, TimeBar, ToyTower } from "../components/Jikan";
import { Heart, INK, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S08_DURATION = DURATIONS[7];

const ASK = 20; // どう したら いいかな？
const ONLY = 100; // したくの ときは したく だけ
const LATER = 200; // あとでね、まっててね
const MINE = 350; // のこりは ぜんぶ きみの もの

const BAR = { x: 420, y: 640 };

export const S08Tips: React.FC = () => {
  const f = useCurrentFrame();
  const toLater = ip(f, [LATER - 12, LATER], [0, 1]);
  const toMine = ip(f, [MINE - 12, MINE], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#eef8e4" dot="#dcf0c8" />
        <g opacity={1 - toLater}>
          <Sfx text="？" x={960} y={600} start={ASK + 5} end={ONLY - 8} size={300} color="#ff8fa3" />
          {f >= ONLY - 8 ? (
            <>
              <g opacity={0.3}>
                <ToyTower x={1560} y={640} s={0.85} />
              </g>
              <circle cx={840} cy={610} r={345 * pop(f, ONLY - 8)} fill="#fffdf0" stroke={INK} strokeWidth={9} strokeDasharray="4 24" strokeLinecap="round" />
              <Kid x={690} y={640} s={0.92 * pop(f, ONLY)} frame={f} />
              <RiceBowl x={990} y={670} s={1.35 * pop(f, ONLY + 8)} eaten={ip(f, [ONLY + 20, LATER - 15], [0, 0.9])} />
              <Sfx text="もぐもぐ" x={1500} y={400} start={ONLY + 20} end={LATER - 12} size={96} color="#ffffff" />
            </>
          ) : null}
        </g>
        <g opacity={toLater * (1 - toMine)}>
          <Kid x={620} y={690} s={0.95} frame={f} armUp={0.6 + 0.3 * Math.sin(f * 0.35)} />
          <ToyTower x={1300} y={690} s={1.2} rot={Math.sin(f * 0.15) * 3} face frame={f} />
          <Pill text="あとでね" x={620} y={370} s={pop(f, LATER + 12)} size={56} frame={f} />
          <Pill text="まってるよ" x={1300} y={420} s={pop(f, LATER + 80)} size={52} color="#fff3a8" frame={f} />
          <Heart x={960} y={580} s={pop(f, LATER + 95)} />
        </g>
        <g opacity={toMine}>
          <Sun x={285} y={BAR.y} s={0.85} rot={f * 0.4} />
          <Door x={1570} y={BAR.y} s={0.72} />
          <TimeBar x={BAR.x} y={BAR.y} used={3} frame={f} glow={toMine} />
          {[0, 1, 2].map((i) => (
            <Check key={i} x={blockX(i, BAR.x)} y={BAR.y} s={pop(f, MINE + 5 + i * 6, 12)} />
          ))}
          {[3, 4, 5].map((i) => (
            <Sparkle key={i} x={blockX(i, BAR.x)} y={440 - (i % 2) * 40} s={pop(f, MINE + 20 + (i - 3) * 6, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))} />
          ))}
          <Pill text="ぜんぶ きみの もの" x={blockX(4, BAR.x)} y={830} s={pop(f, MINE + 40)} size={48} color="#fff3a8" frame={f} />
        </g>
      </svg>
      <Caption text="どう したら いい？" start={ASK + 8} end={ONLY - 10} position="top" size={100} />
      <Caption text="したくの ときは したく だけ" start={ONLY + 5} end={LATER - 12} position="top" size={84} />
      <Caption text="あとでね、まっててね" start={LATER + 12} end={MINE - 12} position="top" size={92} />
      <Caption text="のこりは ぜんぶ きみの もの" start={MINE + 15} end={S08_DURATION} position="top" size={84} color="#ffe14d" />
    </AbsoluteFill>
  );
};
