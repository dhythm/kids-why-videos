import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption } from "../components/Caption";
import {
  Arrow,
  Carrot,
  Negi,
  Pill,
  Pumpkin,
  PumpkinFlower,
  PumpkinSeed,
  Tomato,
} from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S10_DURATION = DURATIONS[9];

const FLOWER = 30; // はなが さいて
const FRUIT = 70; // みが なって
const SEED = 100; // たねが できる
const WHICH = 150; // かぼちゃは み、ネギは は
const NEGI = 200;
const BYE = 295; // こんど さがしてみてね。またね！
const MATANE = 410;

export const S10Recap: React.FC = () => {
  const f = useCurrentFrame();
  const cycleOut = ip(f, [WHICH - 15, WHICH], [1, 0]);
  const whichOut = ip(f, [BYE - 15, BYE], [1, 0]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fff1f5" />
        {new Array(18).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={(i % 6) * 360 + 100}
            cy={Math.floor(i / 6) * 380 + 120}
            r={22}
            fill="#ffe0ea"
          />
        ))}

        {/* はな → み → たね */}
        {cycleOut > 0 ? (
          <g opacity={cycleOut}>
            <PumpkinFlower x={460} y={560} s={1.3 * pop(f, FLOWER)} />
            <Pill text="はな" x={460} y={780} s={pop(f, FLOWER + 6)} size={64} color="#ffe14d" frame={f} />
            <Arrow x1={640} y1={560} x2={640 + 140 * pop(f, FRUIT - 6)} y2={560} />
            <Pumpkin x={960} y={570} s={0.95 * pop(f, FRUIT)} />
            <Pill text="み" x={960} y={780} s={pop(f, FRUIT + 6)} size={64} color="#ff9a8a" frame={f} />
            <Arrow x1={1150} y1={560} x2={1150 + 140 * pop(f, SEED - 6)} y2={560} />
            {[
              [-60, -30, 20],
              [30, -50, -30],
              [60, 30, 60],
              [-30, 40, -10],
            ].map(([dx, dy, r], i) => (
              <PumpkinSeed key={i} x={1460 + dx} y={560 + dy} s={2.8 * pop(f, SEED + i * 3)} rot={r} />
            ))}
            <Pill text="たね" x={1460} y={780} s={pop(f, SEED + 10)} size={64} color="#fff3cf" frame={f} />
          </g>
        ) : null}

        {/* かぼちゃは み、ネギは は */}
        {f >= WHICH - 5 && whichOut > 0 ? (
          <g opacity={whichOut}>
            <Pumpkin x={600} y={620} s={1.2 * pop(f, WHICH)} />
            <Pill text="み" x={600} y={360} s={pop(f, WHICH + 15)} size={90} color="#ff9a8a" frame={f} />
            <g transform={`translate(1320 920) scale(${pop(f, NEGI)})`}>
              <Negi x={0} y={0} s={0.95} green={300} gl={ip(f, [NEGI + 15, NEGI + 25], [0, 1])} hl={ip(f, [NEGI + 15, NEGI + 25], [0, 1])} />
            </g>
            <Pill text="はっぱ" x={1600} y={460} s={pop(f, NEGI + 15)} size={90} color="#b6e59e" frame={f} />
          </g>
        ) : null}

        {/* またね */}
        {f >= BYE - 5 ? (
          <g>
            <Tomato x={420} y={720} s={0.9 * pop(f, BYE + 10)} />
            <Pumpkin x={600} y={880} s={0.6 * pop(f, BYE + 16)} />
            <Carrot x={1500} y={760} s={0.9 * pop(f, BYE + 22)} rot={20} />
            <g transform={`translate(1350 960) scale(${pop(f, BYE + 28)})`}>
              <Negi x={0} y={0} s={0.55} green={260} />
            </g>
            <Kid
              x={960}
              y={600 - (f >= MATANE ? Math.abs(Math.sin((f - MATANE) * 0.18)) * 40 : 0)}
              s={0.8 * pop(f, BYE)}
              frame={f}
              mood="smile"
              armUp={f >= MATANE ? 0.6 + Math.sin(f * 0.4) * 0.3 : 0.2}
            />
            {f >= MATANE
              ? [0, 1, 2, 3, 4].map((i) => (
                  <Sparkle
                    key={i}
                    x={960 + Math.cos(i * 1.25) * 380}
                    y={560 + Math.sin(i * 1.25) * 240}
                    s={pop(f, MATANE + i * 4, 12) * (0.8 + 0.2 * Math.sin(f * 0.3 + i))}
                  />
                ))
              : null}
          </g>
        ) : null}
      </svg>
      <Caption text="はな → み → たね" start={FLOWER + 5} end={WHICH - 15} position="top" size={100} color="#ffe14d" />
      <Caption text="どこを たべてる？" start={BYE + 10} end={MATANE - 8} position="top" size={100} />
      <Caption text="またね！" start={MATANE} end={S10_DURATION} position="top" size={130} color="#ffe14d" />
    </AbsoluteFill>
  );
};
