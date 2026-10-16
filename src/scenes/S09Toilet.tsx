import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Door, Kid, Onigiri, Sparkle, Unchi } from "../components/Food";
import { Caption, FONT, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S09_DURATION = 450;

const RUN = 95;
const CLOSE = 145;
const PLOP = 165;
const FLUSH = 195;
const OPEN = 232;
const DAYS = 285;

const Sun: React.FC<{
  x: number;
  y: number;
  s: number;
  n: number;
  frame: number;
}> = ({ x, y, s, n, frame }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`rotate(${frame * 1.5})`}>
      {new Array(10).fill(0).map((_, i) => (
        <rect
          key={i}
          x={-8}
          y={-92}
          width={16}
          height={30}
          rx={8}
          fill="#ffb703"
          transform={`rotate(${i * 36})`}
        />
      ))}
    </g>
    <circle r={58} fill="#ffd23f" stroke="#2b2b4a" strokeWidth={5} />
    <text
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76 }}
      fill="#2b2b4a"
    >
      {n}
    </text>
  </g>
);

export const S09Toilet: React.FC = () => {
  const f = useCurrentFrame();
  const wiggle = f < RUN ? Math.sin(f * 0.6) * 8 : 0;
  const kidX =
    f < RUN
      ? 760
      : f < CLOSE
        ? ip(f, [RUN, CLOSE - 10], [760, 1460], Easing.in(Easing.quad))
        : ip(f, [OPEN, OPEN + 40], [1460, 1000], Easing.out(Easing.quad));
  const inside = f >= CLOSE - 10 && f < OPEN + 5;
  const doorOpen =
    f < CLOSE
      ? 1
      : f < OPEN
        ? ip(f, [CLOSE, CLOSE + 8], [1, 0])
        : ip(f, [OPEN, OPEN + 10], [0, 1]);
  const scene2 = ip(f, [DAYS - 20, DAYS + 10], [0, 1]);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#e8f6ff, #fdf2ff)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - scene2}>
          {/* かべと ゆか */}
          <rect x={-20} y={880} width={1960} height={220} fill="#d9c7f0" />
          <Door x={1460} y={760} open={doorOpen} />
          {!inside ? (
            <Kid
              x={kidX}
              y={690}
              s={1}
              frame={f}
              rotate={wiggle}
              mood={f < RUN ? "wow" : "smile"}
              run={f >= RUN && f < CLOSE ? 1 : 0}
              armUp={f > OPEN + 20 ? 1 : 0}
            />
          ) : null}
          {/* おなか ぐるぐる */}
          {f < RUN ? (
            <g
              transform={`translate(760 705) rotate(${f * 8}) scale(${pop(f, 10, 14)})`}
            >
              <path
                d="M 0 0 m -30 0 a 30 30 0 1 1 30 30 a 18 18 0 1 1 -18 -18"
                stroke="#9b6a3c"
                strokeWidth={8}
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ) : null}
          {/* ジャー */}
          {f >= FLUSH && f < OPEN ? (
            <g
              transform={`translate(1460 380) rotate(${-f * 12}) scale(${pop(f, FLUSH, 14)})`}
            >
              <path
                d="M 70 0 A 70 70 0 1 1 0 -70"
                stroke="#7fd0ff"
                strokeWidth={18}
                fill="none"
                strokeLinecap="round"
              />
              <path d="M 0 -95 L 30 -70 L 0 -45 Z" fill="#7fd0ff" />
            </g>
          ) : null}
          {f > OPEN + 20
            ? [0, 1, 2, 3].map((i) => (
                <Sparkle
                  key={i}
                  x={kidX + Math.cos(i * 1.6) * 220}
                  y={480 + Math.sin(i * 2.2) * 150}
                  s={
                    pop(f, OPEN + 20 + i * 5, 14) *
                    (0.8 + Math.sin(f * 0.2 + i) * 0.2)
                  }
                />
              ))
            : null}
          <Sfx
            text="ぐるぐる〜"
            x={420}
            y={470}
            start={10}
            end={RUN}
            size={100}
            color="#c48a55"
          />
          <Sfx
            text="ぽちゃん"
            x={1150}
            y={330}
            start={PLOP}
            end={PLOP + 40}
            size={100}
            color="#7fd0ff"
          />
          <Sfx
            text="ジャーッ"
            x={1150}
            y={330}
            start={FLUSH + 5}
            end={OPEN}
            size={100}
            color="#7fd0ff"
          />
        </g>
        {/* なんにち？ */}
        {scene2 > 0 ? (
          <g opacity={scene2}>
            <Onigiri
              x={250}
              y={560 + Math.sin(f * 0.1) * 10}
              s={0.9}
              frame={f}
            />
            <path
              d="M 400 560 L 1500 560"
              stroke="#ffb3c6"
              strokeWidth={18}
              strokeDasharray="4 30"
              strokeLinecap="round"
              strokeDashoffset={-f * 2}
            />
            {[1, 2, 3].map((n, i) => (
              <Sun
                key={n}
                x={620 + i * 340}
                y={560 + Math.sin(f * 0.1 + i) * 10}
                s={pop(f, DAYS + 20 + i * 25, 18)}
                n={n}
                frame={f}
              />
            ))}
            <Unchi
              x={1680}
              y={570 + Math.sin(f * 0.12) * 10}
              s={0.9 * pop(f, DAYS + 100, 20)}
              frame={f}
            />
          </g>
        ) : null}
      </svg>
      <Caption
        text="トイレへ ゴー！"
        start={20}
        end={CLOSE}
        position="top"
        size={100}
      />
      <Caption
        text="すっきり！"
        start={OPEN + 15}
        end={DAYS - 15}
        position="top"
        size={120}
        color="#ffe14d"
      />
      <Caption
        text="1にち 〜 3にち の たび"
        start={DAYS + 30}
        end={S09_DURATION}
        position="top"
        size={96}
      />
    </AbsoluteFill>
  );
};
