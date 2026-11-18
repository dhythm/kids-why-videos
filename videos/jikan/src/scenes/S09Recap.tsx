import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Check, ClockChar, RiceBowl, Shirt, Shower, TimeBar } from "../components/Jikan";
import { Arrow, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S09_DURATION = DURATIONS[8];

const CLOCK = 20; // とけいは とまらない
const FIRST = 145; // さきに したく → たのしい じかん
const BYE = 300; // いくつ のこせるかな？ またね！

export const S09Recap: React.FC = () => {
  const f = useCurrentFrame();
  const toBye = ip(f, [BYE - 10, BYE + 10], [0, 1]);
  const fun = FIRST + 75;
  const side = ip(f, [FIRST - 28, FIRST - 6], [0, 1]); // まんなか → ひだりへ
  const cx = 960 - side * 620;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toBye}>
          <DotsBg color="#eef8e4" dot="#dcf0c8" />
          <ClockChar x={cx} y={590} s={(1.45 - side * 0.5) * pop(f, CLOCK)} frame={f} angle={f * 5} walk={1} />
          <Pill text="とまらない" x={cx} y={860 + (1 - side) * 40} s={pop(f, CLOCK + 25)} size={52} color="#ffe6cf" frame={f} />
          <Arrow x1={590} y1={640} x2={590 + 130 * pop(f, FIRST - 10)} y2={640} />
          <Shower x={870} y={560} s={0.8 * pop(f, FIRST)} frame={f} />
          <Shirt x={1050} y={560} s={0.8 * pop(f, FIRST + 8)} />
          <RiceBowl x={950} y={725} s={0.75 * pop(f, FIRST + 16)} />
          <Check x={1120} y={690} s={1.2 * pop(f, FIRST + 35)} />
          <Pill text="さきに したく" x={960} y={860} s={pop(f, FIRST + 25)} size={52} color="#cfe7ff" frame={f} />
          <Arrow x1={1200} y1={640} x2={1200 + 130 * pop(f, fun - 10)} y2={640} />
          <TimeBar x={1405} y={650} total={3} size={110} gap={10} used={0} frame={f} appear={(i) => pop(f, fun + i * 6, 12)} glow={1} />
          {f > fun + 20
            ? [0, 1, 2].map((i) => (
                <Sparkle key={i} x={1460 + i * 120} y={470 + (i % 2) * 50} s={pop(f, fun + 20 + i * 5, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))} />
              ))
            : null}
          <Pill text="たのしい じかん" x={1580} y={860} s={pop(f, fun + 25)} size={48} color="#fff3a8" frame={f} />
        </g>
        <g opacity={toBye}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <Kid x={680} y={660} s={1.1} frame={f} armUp={ip(f, [BYE + 80, BYE + 100], [0, 1])} />
          <ClockChar x={1300} y={540 + Math.sin(f * 0.1) * 12} s={1.2 * pop(f, BYE + 15)} frame={f} />
          <TimeBar x={1125} y={860} total={3} size={110} gap={10} used={0} frame={f} appear={(i) => pop(f, BYE + 30 + i * 6, 12)} glow={1} />
          {f > BYE + 95
            ? [0, 1, 2, 3].map((i) => (
                <Sparkle key={i} x={680 + Math.cos(i * 1.6) * 340} y={470 + Math.sin(i * 1.6) * 200} s={pop(f, BYE + 95 + i * 5, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))} />
              ))
            : null}
        </g>
      </svg>
      <Caption text="とけいは とまらない" start={CLOCK + 10} end={FIRST - 10} position="top" size={96} />
      <Caption text="さきに したく！" start={FIRST + 15} end={BYE - 15} position="top" size={104} color="#ffe14d" />
      <Caption text="いくつ のこせるかな？" start={BYE + 12} end={BYE + 84} position="top" size={96} />
      <Caption text="またね！" start={BYE + 90} end={S09_DURATION} position="top" size={130} color="#ffe14d" />
    </AbsoluteFill>
  );
};
