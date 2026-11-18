import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Bandage, Fixer, Germ } from "../components/Bansoko";
import { Kid, Sparkle } from "../components/Kid";
import { Arrow, INK, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { SKIN } from "../lib/wound";
import { DURATIONS } from "../lib/durations";

export const S09_DURATION = DURATIONS[8];

const ROOF = 20; // きずを まもる やね
const BODY = 130; // なおすのは からだ・なおったら おしまい
const BYE = 330; // またね！

export const S09Recap: React.FC = () => {
  const f = useCurrentFrame();
  const toBye = ip(f, [BYE - 10, BYE + 10], [0, 1]);
  const done = BODY + 100;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toBye}>
          <DotsBg color="#eef8e4" dot="#dcf0c8" />
          {/* 1. やね */}
          <Bandage x={340} y={660} s={1.25 * pop(f, ROOF)} rot={-6} />
          <Germ
            x={340}
            y={470 - Math.abs(Math.sin(f * 0.15)) * 70}
            s={0.6 * pop(f, ROOF + 20)}
            frame={f}
            mood="wow"
            rot={Math.sin(f * 0.15) * 20}
          />
          <Pill text="まもる やね" x={340} y={860} s={pop(f, ROOF + 30)} size={52} color="#ffe6cf" frame={f} />
          <Arrow x1={590} y1={660} x2={590 + 130 * pop(f, BODY - 10)} y2={660} />
          {/* 2. なおすのは からだ */}
          <Fixer x={960} y={680 + Math.sin(f * 0.3) * 12} s={1.7 * pop(f, BODY)} frame={f} carry />
          <Pill text="からだが なおす" x={960} y={860} s={pop(f, BODY + 20)} size={52} color="#fff3a8" frame={f} />
          <Arrow x1={1190} y1={660} x2={1190 + 130 * pop(f, done - 10)} y2={660} />
          {/* 3. なおったら おしまい */}
          <circle cx={1580} cy={660} r={130 * pop(f, done)} fill={SKIN} stroke={INK} strokeWidth={8} />
          {f > done + 10
            ? [0, 1, 2].map((i) => (
                <Sparkle key={i} x={1520 + i * 60} y={620 + (i % 2) * 70} s={pop(f, done + 10 + i * 5, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))} color="#ffffff" />
              ))
            : null}
          <Bandage
            x={1580 + ip(f, [done + 25, done + 60], [0, 170])}
            y={660 - ip(f, [done + 25, done + 60], [0, 200])}
            s={0.6 * pop(f, done)}
            rot={-16 + ip(f, [done + 25, done + 60], [0, 40])}
            face
            frame={f}
          />
          <Pill text="おしまい" x={1580} y={860} s={pop(f, done + 30)} size={52} color="#ffffff" frame={f} />
        </g>
        <g opacity={toBye}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <Kid x={680} y={680} s={1.1} frame={f} armUp={ip(f, [BYE + 60, BYE + 80], [0, 1])} />
          <Bandage x={1300} y={520 + Math.sin(f * 0.1) * 14} s={1.5 * pop(f, BYE + 15)} rot={-10 + Math.sin(f * 0.25) * 10} face frame={f} />
          <Fixer x={1300} y={810} s={1.2 * pop(f, BYE + 30)} frame={f} />
          {f > BYE + 80
            ? [0, 1, 2, 3].map((i) => (
                <Sparkle key={i} x={680 + Math.cos(i * 1.6) * 340} y={480 + Math.sin(i * 1.6) * 210} s={pop(f, BYE + 80 + i * 5, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))} />
              ))
            : null}
        </g>
      </svg>
      <Caption text="きずの やね" start={ROOF + 10} end={BODY - 10} position="top" size={100} />
      <Caption text="なおったら おしまい" start={BODY + 20} end={BYE - 15} position="top" size={92} color="#ffe14d" />
      <Caption text="またね！" start={BYE + 90} end={S09_DURATION} position="top" size={130} color="#ffe14d" />
    </AbsoluteFill>
  );
};
