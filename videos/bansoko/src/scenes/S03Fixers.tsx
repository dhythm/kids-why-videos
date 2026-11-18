import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { BodyBg, DotsBg } from "../components/Backgrounds";
import { Fixer, SkinWall } from "../components/Bansoko";
import { Kid, Sparkle } from "../components/Kid";
import { Drop, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S03_DURATION = DURATIONS[2];

const IN = 20; // なおしやさん とうじょう
const WORK = 200; // ちを とめて、ひふを つくる
const BODY = 400; // なおすのは からだ

const WALL_Y = 420;
const START = [460, 800, 1120, 1460];
const SPOT = [760, 890, 1030, 1160];
const COLORS = ["#ffffff", "#ffd0e0", "#ffffff", "#ffd0e0"];

export const S03Fixers: React.FC = () => {
  const f = useCurrentFrame();
  const toBody = ip(f, [BODY - 12, BODY + 8], [0, 1]);
  const go = ip(f, [WORK, WORK + 40], [0, 1]);
  const heal = ip(f, [WORK + 40, BODY - 20], [0, 1]);
  const stop = ip(f, [WORK + 10, WORK + 45], [1, 0]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toBody}>
          <BodyBg splitY={WALL_Y} frame={f} />
          <SkinWall y={WALL_Y} heal={heal} />
          {[0, 1].map((i) => (
            <Drop key={i} x={900 + i * 120} y={440 + Math.sin(f * 0.2 + i) * 10} s={stop * 1.1} />
          ))}
          {START.map((sx, i) => {
            const working = f > WORK + 40 && heal < 1;
            const x = sx + (SPOT[i] - sx) * go;
            const y = 800 - go * 190 + Math.sin(f * (working ? 0.5 : 0.12) + i * 1.4) * (working ? 22 : 10);
            return (
              <Fixer
                key={i}
                x={x}
                y={y}
                s={1.1 * pop(f, IN + 20 + i * 12)}
                frame={f}
                carry={f > WORK + 20 && heal < 1}
                color={COLORS[i]}
              />
            );
          })}
          <Sfx text="とんとん" x={960} y={900} start={WORK + 50} end={BODY - 15} size={100} color="#ffffff" />
          <Pill text="ちを とめる" x={360} y={640} s={pop(f, WORK + 15)} size={56} color="#ffe0e0" frame={f} />
          <Pill text="あたらしい ひふ" x={1520} y={640} s={pop(f, WORK + 90)} size={56} color="#ffe6cf" frame={f} />
        </g>
        <g opacity={toBody}>
          <DotsBg color="#fff3e0" dot="#ffe6c4" />
          <Kid
            x={760}
            y={660}
            s={1.1}
            frame={f}
            armUp={ip(f, [BODY + 20, BODY + 40], [0, 1])}
            tummyGlow={0.6 + 0.4 * Math.sin(f * 0.15)}
          />
          <Fixer x={1300} y={620 + Math.sin(f * 0.12) * 12} s={1.9 * pop(f, BODY + 10)} frame={f} carry />
          {f > BODY + 40
            ? [0, 1, 2, 3].map((i) => (
                <Sparkle
                  key={i}
                  x={760 + Math.cos(i * 1.6 + 0.4) * 330}
                  y={520 + Math.sin(i * 1.6 + 0.4) * 230}
                  s={pop(f, BODY + 40 + i * 5, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))}
                />
              ))
            : null}
        </g>
      </svg>
      <Caption text="なおしやさん" start={IN + 20} end={WORK - 10} position="top" size={110} />
      <Caption text="あなを ふさぐ" start={WORK + 20} end={BODY - 15} position="top" size={100} />
      <Caption text="なおすのは からだ" start={BODY + 20} end={S03_DURATION} position="top" size={100} color="#ffe14d" />
    </AbsoluteFill>
  );
};
