import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import { getLength } from "@remotion/paths";
import { pointAt } from "../lib/path";
import { Kid, Nutrient, NUTRIENT_COLORS, Sparkle } from "../components/Food";
import { Caption, FONT, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S07_DURATION = 420;

const FLOW_END = 140;
const RUN = 150;
const THINK = 235;
const GROW = 305;

// こども（x=960, y=600, s=1.3）の おなか から からだじゅうへ
const VESSELS = [
  "M 960 620 C 930 540 990 470 960 380",
  "M 960 620 C 920 600 900 640 865 672",
  "M 960 620 C 1000 600 1020 640 1055 672",
  "M 950 640 C 930 700 935 760 921 805",
  "M 970 640 C 990 700 985 760 999 805",
];
const LENS = VESSELS.map((d) => getLength(d));

export const S07Energy: React.FC = () => {
  const f = useCurrentFrame();
  const vesselOpacity =
    ip(f, [5, 25], [0, 1]) * ip(f, [FLOW_END - 10, FLOW_END + 10], [1, 0]);

  // はしる → かんがえる → おおきくなる
  const runT = ip(f, [RUN, THINK - 10], [0, 1]);
  const kidX = f < RUN ? 960 : 960 + Math.sin(runT * Math.PI * 2) * 420;
  const running = f >= RUN && f < THINK - 10;
  const facing = running ? (Math.cos(runT * Math.PI * 2) >= 0 ? 1 : -1) : 1;
  const grow = ip(
    f,
    [GROW + 10, GROW + 90],
    [1, 1.22],
    Easing.out(Easing.back(1.5)),
  );
  const kidS = 1.3 * grow * (f < RUN ? 1 : 0.85);
  const kidY = f < RUN ? 600 : 640 - (grow - 1) * 200;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#e0f7ff, #fff8e1)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {new Array(16).fill(0).map((_, i) => (
          <Nutrient
            key={i}
            x={(random(`bgx${i}`) * 1920 + f * 0.8) % 1920}
            y={random(`bgy${i}`) * 1080 + Math.sin(f * 0.05 + i) * 20}
            s={0.6}
            color={NUTRIENT_COLORS[i % 5]}
            rotate={f * 2 + i * 30}
          />
        ))}
        <rect x={-20} y={880} width={1960} height={220} fill="#bfe3a5" />
        {/* せの たかさ */}
        {f >= GROW ? (
          <g opacity={ip(f, [GROW, GROW + 15], [0, 1])}>
            <rect
              x={1300}
              y={300}
              width={70}
              height={590}
              rx={12}
              fill="#ffffff"
              stroke="#2b2b4a"
              strokeWidth={5}
            />
            {new Array(12).fill(0).map((_, i) => (
              <line
                key={i}
                x1={1300}
                y1={330 + i * 48}
                x2={i % 2 ? 1330 : 1345}
                y2={330 + i * 48}
                stroke="#2b2b4a"
                strokeWidth={4}
              />
            ))}
            <line
              x1={760}
              y1={kidY - 262 * kidS}
              x2={1300}
              y2={kidY - 262 * kidS}
              stroke="#ff5d8f"
              strokeWidth={5}
              strokeDasharray="14 10"
            />
          </g>
        ) : null}
        <g
          transform={`translate(${kidX} 0) scale(${facing} 1) translate(${-kidX} 0)`}
        >
          <Kid
            x={kidX}
            y={kidY}
            s={kidS}
            frame={f}
            run={running ? 1 : 0}
            armUp={f > GROW + 60 ? 1 : 0}
            tummyGlow={f < FLOW_END ? 0.6 : 0}
          />
        </g>
        {/* ち の みち と えいよう */}
        {vesselOpacity > 0 ? (
          <g opacity={vesselOpacity}>
            {VESSELS.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke="#ef476f"
                strokeWidth={12}
                fill="none"
                strokeLinecap="round"
                opacity={0.75}
              />
            ))}
            {VESSELS.map((d, i) =>
              [0, 1, 2].map((k) => {
                const t = (((f * 0.012 + k / 3 + i * 0.13) % 1) + 1) % 1;
                const p = pointAt(d, t * LENS[i]);
                return (
                  <Nutrient
                    key={`${i}-${k}`}
                    x={p.x}
                    y={p.y}
                    s={0.7}
                    color={NUTRIENT_COLORS[(i + k) % 5]}
                    rotate={f * 4}
                  />
                );
              }),
            )}
          </g>
        ) : null}
        {/* ひらめき */}
        {f >= THINK && f < GROW + 10 ? (
          <g
            transform={`translate(${kidX} ${kidY - 470 * kidS * 0.85}) scale(${pop(f, THINK + 5, 16)})`}
          >
            <circle
              r={90}
              fill="#fff59d"
              opacity={0.6 + Math.sin(f * 0.3) * 0.2}
            />
            <path
              d="M -40 10 Q -50 -60 0 -62 Q 50 -60 40 10 Q 25 25 25 45 L -25 45 Q -25 25 -40 10 Z"
              fill="#ffe14d"
              stroke="#2b2b4a"
              strokeWidth={5}
            />
            <rect
              x={-22}
              y={45}
              width={44}
              height={22}
              rx={6}
              fill="#9aa0b8"
              stroke="#2b2b4a"
              strokeWidth={4}
            />
          </g>
        ) : null}
        {f >= GROW + 60
          ? [0, 1, 2, 3].map((i) => (
              <Sparkle
                key={i}
                x={kidX + Math.cos(i * 1.6) * 260}
                y={420 + Math.sin(i * 2.1) * 160}
                s={pop(f, GROW + 60 + i * 6, 14)}
              />
            ))
          : null}
        <Sfx
          text="たったったっ"
          x={960}
          y={250}
          start={RUN + 10}
          end={THINK - 10}
          size={100}
        />
        <Sfx
          text="ピカッ！"
          x={1350}
          y={300}
          start={THINK + 10}
          end={GROW}
          size={110}
        />
        <Sfx
          text="ぐんぐん！"
          x={560}
          y={300}
          start={GROW + 20}
          end={S07_DURATION}
          size={110}
          color="#5ccf6b"
        />
        {f < FLOW_END ? (
          <text
            x={1500}
            y={560}
            textAnchor="middle"
            style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64 }}
            fill="#ef476f"
            stroke="#ffffff"
            strokeWidth={10}
            paintOrder="stroke"
            opacity={vesselOpacity}
          >
            ち に のって…
          </text>
        ) : null}
      </svg>
      <Caption
        text="からだじゅうへ！"
        start={15}
        end={FLOW_END - 5}
        position="top"
        size={96}
      />
      <Caption
        text="げんきの もと！"
        start={RUN + 5}
        end={S07_DURATION}
        position="bottom"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
