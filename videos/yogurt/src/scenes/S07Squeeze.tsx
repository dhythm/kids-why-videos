import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { Sparkle } from "../components/Kid";
import { Unchi } from "../components/Body";
import { SourDrop } from "../components/Microbes";
import { ip, pop } from "../lib/anim";
import { pushedX, squeezeAt, wavePosition } from "../lib/peristalsis";
import { DURATIONS } from "../lib/durations";

export const S07_DURATION = DURATIONS[6];

const SIGNAL = 20; // かべに あいず
const PUSH = 230; // ぐにゅぐにゅ
const DONE = 420; // しくみの ひとつ

const MID = 560; // くだの まんなか
const R = 210; // くだの はんけい
const SQ = 120; // しぼる ふかさ
const PERIOD = 190; // なみ 1かいで うんちを はこびきる

/** うえと したの かべ（なみで しぼられる） */
function wallPath(waveX: number, amount: number, side: 1 | -1): string {
  const pts: string[] = [];
  for (let x = -40; x <= 1960; x += 40) {
    const y = MID + side * (R - SQ * amount * squeezeAt(x, waveX, 130));
    pts.push(`${x} ${y}`);
  }
  const edge = side === 1 ? 1100 : -20;
  return `M -40 ${edge} L ${pts.join(" L ")} L 1960 ${edge} Z`;
}

export const S07Squeeze: React.FC = () => {
  const f = useCurrentFrame();
  const on = ip(f, [PUSH - 10, PUSH + 10], [0, 1]);
  const waveX = wavePosition(f, PUSH, PERIOD, -100, 2000);
  // うんちは なみに おされて すすむ
  const poopX =
    pushedX(f, 420, {
      start: PUSH,
      period: PERIOD,
      from: -100,
      to: 2000,
      gap: 230,
      maxX: 2300,
    }) +
    Math.sin(f * 0.2) * 4 * on;
  const flash =
    f > SIGNAL + 60 && f < PUSH ? Math.abs(Math.sin((f - SIGNAL) * 0.25)) : 0;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#ffe6ea" />
        {/* くだの なか */}
        <rect x={-40} y={MID - R} width={2000} height={R * 2} fill="#ffc9d3" />
        <Unchi
          x={poopX}
          y={MID + 10}
          s={0.95 * pop(f, SIGNAL)}
          frame={f}
          mood={on > 0.5 ? "wow" : "smile"}
          squash={1 - 0.15 * on * squeezeAt(poopX - 120, waveX, 130)}
        />
        {/* あいずを おくる さくさん */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const tx = 260 + i * 270;
          const top = i % 2 === 0;
          const go = ip(f, [SIGNAL + 10 + i * 6, SIGNAL + 60 + i * 6], [0, 1]);
          const y = MID + (top ? -1 : 1) * (40 + go * (R - 90));
          return (
            <SourDrop
              key={i}
              x={tx}
              y={y}
              s={0.75 * pop(f, SIGNAL + 5 + i * 6) * (1 - on)}
              frame={f}
            />
          );
        })}
        {/* かべ */}
        <path
          d={wallPath(waveX, on, -1)}
          fill="#ff8fab"
          stroke="#2b2b4a"
          strokeWidth={8}
          strokeLinejoin="round"
        />
        <path
          d={wallPath(waveX, on, 1)}
          fill="#ff8fab"
          stroke="#2b2b4a"
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {/* かべが ぴかっ（あいずが とどいた） */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Sparkle
            key={i}
            x={260 + i * 270}
            y={MID + (i % 2 === 0 ? -R - 10 : R + 10)}
            s={0.9 * flash * pop(f, SIGNAL + 60 + i * 6, 10)}
            color="#fff59d"
          />
        ))}
        <Sfx
          text="うごいて！"
          x={960}
          y={170}
          start={SIGNAL + 60}
          end={PUSH - 10}
          size={110}
        />
        <Sfx
          text="ぐにゅ ぐにゅ"
          x={760}
          y={950}
          start={PUSH + 20}
          end={DONE + 20}
          size={110}
          color="#ffffff"
        />
        {f > DONE ? (
          <g>
            <Sfx
              text="すっきり！"
              x={1500}
              y={190}
              start={DONE + 20}
              end={S07_DURATION}
              size={110}
            />
          </g>
        ) : null}
      </svg>
      <Caption
        text="ちょうの かべに あいず"
        start={SIGNAL + 5}
        end={PUSH - 10}
        position="bottom"
        size={84}
      />
      <Caption
        text="うんちを おくりだす"
        start={PUSH + 120}
        end={DONE - 5}
        position="top"
        size={90}
        color="#ffe14d"
      />
      <Caption
        text="これが しくみの ひとつ"
        start={DONE + 10}
        end={S07_DURATION}
        position="bottom"
        size={84}
      />
    </AbsoluteFill>
  );
};
