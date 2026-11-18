import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Fixer, NoseWall, SideHead } from "../components/Hanaji";
import { Kid, Sparkle } from "../components/Kid";
import { Arrow, Heart, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S09_DURATION = DURATIONS[8];

const HURT = 20; // ちいさな けが
const STOP = 135; // したを むいて つまむ
const OK = 215; // だいじょうぶ
const BYE = 260; // おとなに おしえてね・またね！

export const S09Recap: React.FC = () => {
  const f = useCurrentFrame();
  const toBye = ip(f, [BYE - 10, BYE + 10], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <defs>
          <clipPath id="s09head">
            <rect x={690} y={330} width={540} height={480} rx={60} />
          </clipPath>
        </defs>
        <g opacity={1 - toBye}>
          <DotsBg color="#eef8e4" dot="#dcf0c8" />
          {/* 1. ちいさな けが */}
          <NoseWall id="s09wall" x={330} y={570} w={480} h={420} s={pop(f, HURT)} frame={f} tear={1} />
          <Pill text="ちいさな けが" x={330} y={890} s={pop(f, HURT + 30)} size={50} color="#ffd0d0" frame={f} />
          <Arrow x1={600} y1={570} x2={600 + 70 * pop(f, STOP - 10)} y2={570} />
          {/* 2. したを むいて つまむ */}
          <g transform={`translate(960 570) scale(${pop(f, STOP)}) translate(-960 -570)`}>
            <rect x={690} y={330} width={540} height={480} rx={60} fill="#ffffff" />
            <g clipPath="url(#s09head)">
              <SideHead x={1020} y={560} s={0.6} frame={f} tilt={-16} pinch={1} bleed={1} />
            </g>
            <rect x={690} y={330} width={540} height={480} rx={60} fill="none" stroke="#2b2b4a" strokeWidth={10} />
          </g>
          <Pill text="したを むいて ぎゅっ" x={960} y={890} s={pop(f, STOP + 25)} size={46} color="#fff3a8" frame={f} />
          <Arrow x1={1250} y1={570} x2={1250 + 70 * pop(f, OK - 10)} y2={570} />
          {/* 3. だいじょうぶ */}
          <Kid x={1590} y={610} s={0.85 * pop(f, OK)} frame={f} armUp={ip(f, [OK + 10, OK + 25], [0, 1])} />
          <Pill text="だいじょうぶ" x={1590} y={890} s={pop(f, OK + 15)} size={50} color="#ffffff" frame={f} />
        </g>
        <g opacity={toBye}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <Kid x={1220} y={648} s={1.32} frame={f} shirt="#8ecae6" pants="#6d597a" hair="#3d2b1f" longHair />
          <Kid x={700} y={690} s={1.05} frame={f} armUp={ip(f, [BYE + 75, BYE + 95], [0, 1])} />
          <Heart x={960} y={520 + Math.sin(f * 0.1) * 10} s={pop(f, BYE + 40)} />
          <Fixer x={1620} y={800 + Math.sin(f * 0.12) * 10} s={1.1 * pop(f, BYE + 30)} frame={f} />
          {f > BYE + 95
            ? [0, 1, 2, 3].map((i) => (
                <Sparkle
                  key={i}
                  x={700 + Math.cos(i * 1.6 + 2.6) * 330}
                  y={520 + Math.sin(i * 1.6 + 2.6) * 200}
                  s={pop(f, BYE + 95 + i * 5, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))}
                />
              ))
            : null}
        </g>
      </svg>
      <Caption text="ちいさな けが" start={HURT + 10} end={STOP - 12} position="top" size={104} />
      <Caption text="したを むいて ぎゅっ" start={STOP + 15} end={BYE - 12} position="top" size={96} color="#ffe14d" />
      <Caption text="おとなに おしえてね" start={BYE + 15} end={BYE + 95} position="top" size={96} />
      <Caption text="またね！" start={BYE + 105} end={S09_DURATION} position="top" size={130} color="#ffe14d" />
    </AbsoluteFill>
  );
};
