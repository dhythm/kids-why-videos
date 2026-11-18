import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { RoomBg } from "../components/Backgrounds";
import { blockX, Car, Check, Door, RiceBowl, Shirt, Shower, TimeBar, ToyTower } from "../components/Jikan";
import { Heart } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S04_DURATION = DURATIONS[3];

const WASH = 20; // ざーっ
const DRESS = 80; // ぱぱっ
const EAT = 135; // もぐもぐ
const LEFT = 215; // みっつ のこった
const PLAYT = 345; // たくさん あそべる

const BAR = { x: 420, y: 930 };
const lin = (t: number): number => t;

export const S04Quick: React.FC = () => {
  const f = useCurrentFrame();
  const used =
    ip(f, [WASH + 8, DRESS - 6], [0, 1], lin) +
    ip(f, [DRESS + 6, EAT - 6], [0, 1], lin) +
    ip(f, [EAT + 6, EAT + 52], [0, 1], lin);
  const done = [DRESS - 6, EAT - 6, EAT + 52];
  const play = f >= PLAYT;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <RoomBg frame={f} />
        <Kid
          x={700}
          y={640}
          s={0.9}
          frame={f}
          shirt={f < DRESS + 28 ? "#c9b8f0" : "#ffd166"}
          mood={f >= LEFT && f < LEFT + 60 ? "wow" : "smile"}
          armUp={play ? 0.75 + 0.25 * Math.sin(f * 0.3) : f >= DRESS + 20 && f < DRESS + 40 ? 1 : 0}
        />
        {f < DRESS - 4 ? <Shower x={990} y={610} s={1.5 * pop(f, WASH, 12)} frame={f} /> : null}
        {f >= DRESS - 4 && f < DRESS + 28 ? <Shirt x={990 - ip(f, [DRESS + 12, DRESS + 28], [0, 290])} y={610} s={1.4 * pop(f, DRESS - 4, 10) * ip(f, [DRESS + 12, DRESS + 28], [1, 0.4])} color="#ffd166" /> : null}
        {f >= EAT && f < LEFT - 12 ? <RiceBowl x={990} y={640} s={1.5 * pop(f, EAT, 10)} eaten={ip(f, [EAT + 6, EAT + 52], [0, 1], lin)} /> : null}
        <Sfx text="ざーっ" x={1400} y={430} start={WASH + 5} end={DRESS - 8} size={110} color="#ffffff" />
        <Sfx text="ぱぱっ" x={1400} y={430} start={DRESS + 2} end={EAT - 8} size={110} />
        <Sfx text="もぐもぐ" x={1400} y={430} start={EAT + 4} end={LEFT - 14} size={100} color="#ffffff" />
        <ToyTower x={1090} y={650} s={1.0 * pop(f, PLAYT)} rot={Math.sin(f * 0.15) * 3} />
        <Car x={1380 + Math.sin(f * 0.1) * 60} y={750} s={0.85 * pop(f, PLAYT + 10)} />
        <Heart x={880} y={400} s={0.8 * pop(f, PLAYT + 25)} />
        <Door x={1570} y={900} s={0.6} />
        <TimeBar x={BAR.x} y={BAR.y} used={used} frame={f} glow={ip(f, [LEFT, LEFT + 15], [0, 1])} />
        {done.map((d, i) => (
          <Check key={i} x={blockX(i, BAR.x)} y={BAR.y} s={pop(f, d, 12)} />
        ))}
        {f > LEFT + 10
          ? [3, 4, 5].map((i) => (
              <Sparkle key={i} x={blockX(i, BAR.x) + 50} y={BAR.y - 120 - (i % 2) * 30} s={pop(f, LEFT + 10 + (i - 3) * 6, 12) * (0.8 + 0.2 * Math.sin(f * 0.3 + i))} />
            ))
          : null}
        <Sfx text="みっつ！" x={1400} y={430} start={LEFT + 20} end={PLAYT - 10} size={120} />
      </svg>
      <Caption text="さっと おわると…" start={WASH + 10} end={LEFT - 10} position="top" size={100} />
      <Caption text="みっつ のこった！" start={LEFT + 10} end={PLAYT - 10} position="top" size={104} />
      <Caption text="たくさん あそべる！" start={PLAYT + 10} end={S04_DURATION} position="top" size={100} color="#ffe14d" />
    </AbsoluteFill>
  );
};
