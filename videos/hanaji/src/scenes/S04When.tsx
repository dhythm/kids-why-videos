import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Ball, Bang, Finger, FrontNose, Tissue } from "../components/Hanaji";
import { INK, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S04_DURATION = DURATIONS[3];

const ASK = 20; // どんな とき？
const PICK = 120; // ほじった とき
const BLOW = 190; // つよく かんだ とき
const BUMP = 285; // ぶつけた とき
const DRY = 335; // カラカラ
const ITCH = 460; // かぜ・かふん

const XS = [330, 750, 1170, 1590];
const CY = 620;

const Card: React.FC<{ x: number; s: number; color: string; children: React.ReactNode }> = ({
  x,
  s,
  color,
  children,
}) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${CY}) scale(${s})`}>
      <rect x={-185} y={-230} width={370} height={460} rx={56} fill={color} stroke={INK} strokeWidth={8} />
      {children}
    </g>
  );

export const S04When: React.FC = () => {
  const f = useCurrentFrame();
  const out = ip(f, [ITCH - 12, ITCH + 4], [1, 0]);
  const hit = ip(f, [BUMP + 14, BUMP + 24], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#fff6e0" dot="#ffe8bd" />
        {/* どんな とき？ */}
        <FrontNose
          x={960}
          y={600}
          s={1.9 * pop(f, ASK) * ip(f, [PICK - 12, PICK], [1, 0])}
          frame={f}
          bleed={1}
        />
        {/* 1. ほじほじ */}
        <Card x={XS[0]} s={pop(f, PICK + 5) * out} color="#ffffff">
          <Finger x={50 + Math.sin(f * 0.5) * 7} y={36 + Math.cos(f * 0.5) * 6} s={0.6} rot={-4} />
          <FrontNose x={0} y={-50} s={1.0} />
        </Card>
        {/* 2. つよく かむ */}
        <Card x={XS[1]} s={pop(f, BLOW + 5) * out} color="#ffffff">
          <FrontNose x={Math.sin(f * 1.3) * 4} y={-60} s={1.0} />
          <Tissue x={Math.sin(f * 1.3) * 4} y={70} s={1.15} />
          {[-1, 1].map((d) => (
            <path
              key={d}
              d={`M ${d * 130} 30 q ${d * 24} 10 ${d * 30} 34 M ${d * 136} 86 q ${d * 20} 4 ${d * 34} 22`}
              stroke="#7fc8ff"
              strokeWidth={9}
              fill="none"
              strokeLinecap="round"
              opacity={0.5 + 0.5 * Math.sin(f * 0.6)}
            />
          ))}
        </Card>
        {/* 3. ぶつける */}
        <Card x={XS[2]} s={pop(f, BUMP + 5) * out} color="#ffffff">
          <FrontNose x={-30 - hit * 8} y={-20} s={1.0} rot={-hit * 6} red={hit * 0.8} />
          <Ball x={250 - hit * 160 + ip(f, [BUMP + 24, BUMP + 50], [0, 50])} y={-40 - ip(f, [BUMP + 24, BUMP + 50], [0, 60])} s={0.8} rot={f * 6} />
          <Bang x={62} y={-70} s={pop(f, BUMP + 22, 10) * 0.9} />
        </Card>
        {/* 4. カラカラ */}
        <Card x={XS[3]} s={pop(f, DRY + 5) * out} color="#ffffff">
          <FrontNose x={0} y={10} s={1.0} crack={ip(f, [DRY + 20, DRY + 50], [0, 1])} />
          {[-80, 0, 80].map((dx, i) => (
            <path
              key={dx}
              d={`M ${dx} -150 q 16 -14 0 -28 t 0 -28`}
              transform={`translate(0 ${-((f * 0.8 + i * 9) % 22)})`}
              stroke="#ff9f43"
              strokeWidth={9}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </Card>
        <Pill text="ほじほじ" x={XS[0]} y={930} s={pop(f, PICK + 20) * out} size={54} color="#ffe6cf" frame={f} />
        <Pill text="つよく かむ" x={XS[1]} y={930} s={pop(f, BLOW + 20) * out} size={54} color="#d9f0ff" frame={f} />
        <Pill text="ぶつける" x={XS[2]} y={930} s={pop(f, BUMP + 20) * out} size={54} color="#d7f5e6" frame={f} />
        <Pill text="カラカラ" x={XS[3]} y={930} s={pop(f, DRY + 20) * out} size={54} color="#ffe0b0" frame={f} />
        {/* かぜ・かふんで むずむず */}
        {f >= ITCH ? (
          <g>
            <FrontNose
              x={960 + Math.sin(f * 0.9) * 8}
              y={620}
              s={2.1 * pop(f, ITCH + 5)}
              red={0.5 + 0.4 * Math.sin(f * 0.2)}
              rot={Math.sin(f * 0.9) * 3}
            />
            {new Array(12).fill(0).map((_, i) => {
              const a = i * 2.4 + f * 0.02;
              const r = 380 + (i % 3) * 70 - ((f * 1.5 + i * 31) % 120);
              return (
                <circle
                  key={i}
                  cx={960 + Math.cos(a) * r * 1.5}
                  cy={640 + Math.sin(a) * r * 0.75}
                  r={14 + (i % 3) * 5}
                  fill={i % 2 ? "#ffe14d" : "#b7e36b"}
                  stroke={INK}
                  strokeWidth={4}
                  opacity={pop(f, ITCH + 10 + i * 3)}
                />
              );
            })}
          </g>
        ) : null}
        <Sfx text="むずむず" x={1540} y={420} start={ITCH + 30} end={S04_DURATION} size={110} color="#ffffff" />
      </svg>
      <Caption text="どんな とき？" start={ASK + 10} end={PICK - 12} position="top" size={110} color="#ffe14d" />
      <Caption text="こんな とき" start={PICK + 10} end={ITCH - 14} position="top" size={100} />
      <Caption text="かぜ・かふん" start={ITCH + 15} end={S04_DURATION} position="top" size={104} />
    </AbsoluteFill>
  );
};
