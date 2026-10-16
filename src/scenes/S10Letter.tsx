import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import {
  BananaUnchi,
  Buddy,
  Kid,
  Onigiri,
  Sparkle,
  Unchi,
} from "../components/Food";
import { Caption, FONT } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S10_DURATION = 570;

const OPEN = 30;
const HANAMARU = 120;
const TIPS = 232;
const TIP_AT = [240, 285, 320];
const BYE = 405;

const Hanamaru: React.FC<{ x: number; y: number; s: number; draw: number }> = ({
  x,
  y,
  s,
  draw,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {new Array(8).fill(0).map((_, i) => (
      <ellipse
        key={i}
        cx={0}
        cy={-150}
        rx={45}
        ry={60}
        fill="none"
        stroke="#ef476f"
        strokeWidth={10}
        transform={`rotate(${i * 45})`}
        opacity={draw}
      />
    ))}
    <circle
      r={120}
      fill="none"
      stroke="#ef476f"
      strokeWidth={14}
      strokeDasharray={`${754 * draw} 754`}
    />
    <circle
      r={95}
      fill="none"
      stroke="#ef476f"
      strokeWidth={10}
      strokeDasharray={`${597 * draw} 597`}
    />
  </g>
);

const Tip: React.FC<{
  x: number;
  y: number;
  s: number;
  label: string;
  children: React.ReactNode;
}> = ({ x, y, s, label, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={170} fill="#ffffff" stroke="#2b2b4a" strokeWidth={6} />
    {children}
    <text
      y={240}
      textAnchor="middle"
      style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64 }}
      fill="#2b2b4a"
      stroke="#ffffff"
      strokeWidth={10}
      paintOrder="stroke"
    >
      {label}
    </text>
  </g>
);

export const S10Letter: React.FC = () => {
  const f = useCurrentFrame();
  const flap = ip(f, [OPEN, OPEN + 20], [0, 1], Easing.out(Easing.quad));
  const rise = ip(
    f,
    [OPEN + 15, OPEN + 50],
    [0, 1],
    Easing.out(Easing.back(1.4)),
  );
  const part1 = ip(f, [TIPS - 15, TIPS], [1, 0]);
  const part2 =
    ip(f, [TIPS - 5, TIPS + 10], [0, 1]) * ip(f, [BYE - 15, BYE], [1, 0]);
  const part3 = ip(f, [BYE - 5, BYE + 10], [0, 1]);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#fff3d6, #ffe1ec)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {new Array(24).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={
              (random(`lx${i}`) * 1920 + f * (0.3 + random(`lv${i}`) * 0.5)) %
              1920
            }
            cy={random(`ly${i}`) * 1080}
            r={10 + random(`lr${i}`) * 26}
            fill={["#ffd6a5", "#ffc8dd", "#cdeac0", "#bde0fe"][i % 4]}
            opacity={0.6}
          />
        ))}
        {/* おてがみ */}
        {part1 > 0 ? (
          <g opacity={part1}>
            {f >= HANAMARU ? (
              <Hanamaru
                x={960}
                y={360}
                s={1.2}
                draw={ip(f, [HANAMARU, HANAMARU + 30], [0, 1])}
              />
            ) : null}
            <g transform={`translate(960 ${560 - rise * 200})`}>
              {f >= OPEN + 15 ? (
                <BananaUnchi x={0} y={-20} s={rise * 1.2} frame={f} />
              ) : null}
            </g>
            <g transform={`translate(960 ${700 + rise * 330})`}>
              <rect
                x={-300}
                y={-150}
                width={600}
                height={330}
                rx={20}
                fill="#ff9fb2"
                stroke="#2b2b4a"
                strokeWidth={6}
              />
              <path
                d="M -300 -150 L 0 60 L 300 -150"
                fill="none"
                stroke="#2b2b4a"
                strokeWidth={6}
              />
              <g transform={`translate(0 -150) scale(1 ${1 - flap * 2})`}>
                <path
                  d="M -300 0 L 0 200 L 300 0 Z"
                  fill="#ffb3c6"
                  stroke="#2b2b4a"
                  strokeWidth={6}
                  strokeLinejoin="round"
                />
              </g>
              <path d="M -25 40 q 25 -35 50 0 q -25 30 -50 0" fill="#ef476f" />
            </g>
            {f >= HANAMARU + 25
              ? [0, 1, 2, 3, 4].map((i) => (
                  <Sparkle
                    key={i}
                    x={960 + Math.cos(i * 1.3) * 420}
                    y={380 + Math.sin(i * 1.9) * 220}
                    s={
                      pop(f, HANAMARU + 25 + i * 6, 14) *
                      (0.8 + Math.sin(f * 0.2 + i) * 0.2)
                    }
                  />
                ))
              : null}
          </g>
        ) : null}
        {/* やくそく */}
        {part2 > 0 ? (
          <g opacity={part2}>
            <Tip
              x={460}
              y={500 + Math.sin(f * 0.1) * 10}
              s={pop(f, TIP_AT[0], 18)}
              label="やさい"
            >
              <path
                d="M -40 -60 L 40 -60 L 0 110 Z"
                fill="#ff9f1c"
                stroke="#2b2b4a"
                strokeWidth={5}
                strokeLinejoin="round"
                transform="translate(-40 0) rotate(-15)"
              />
              <path
                d="M -40 -60 q -20 -50 0 -70 q 10 30 0 70 M -40 -60 q 30 -50 50 -40 q -20 25 -50 40"
                fill="#5ccf6b"
                transform="translate(-40 0) rotate(-15)"
              />
              <rect x={45} y={0} width={24} height={90} rx={8} fill="#8ac06b" />
              <circle
                cx={57}
                cy={-20}
                r={50}
                fill="#5ccf6b"
                stroke="#2b2b4a"
                strokeWidth={5}
              />
              <circle cx={30} cy={-45} r={30} fill="#7bd389" />
              <circle cx={85} cy={-40} r={28} fill="#7bd389" />
            </Tip>
            <Tip
              x={960}
              y={500 + Math.sin(f * 0.1 + 1) * 10}
              s={pop(f, TIP_AT[1], 18)}
              label="おみず"
            >
              <path
                d="M -70 -90 L 70 -90 L 55 100 L -55 100 Z"
                fill="#e0f4ff"
                stroke="#2b2b4a"
                strokeWidth={6}
                strokeLinejoin="round"
              />
              <path
                d={`M -64 ${-20 + Math.sin(f * 0.2) * 5} Q 0 ${-35 + Math.sin(f * 0.2) * 5} 64 ${-20 + Math.sin(f * 0.2) * 5} L 55 100 L -55 100 Z`}
                fill="#7fd0ff"
              />
            </Tip>
            <Tip
              x={1460}
              y={500 + Math.sin(f * 0.1 + 2) * 10}
              s={pop(f, TIP_AT[2], 18)}
              label="あそぶ"
            >
              <g
                transform={`translate(0 ${-Math.abs(Math.sin(f * 0.15)) * 40}) rotate(${f * 4})`}
              >
                <circle
                  r={85}
                  fill="#ffffff"
                  stroke="#2b2b4a"
                  strokeWidth={6}
                />
                <path
                  d="M -85 0 Q 0 -60 85 0"
                  fill="none"
                  stroke="#ef476f"
                  strokeWidth={12}
                />
                <path
                  d="M -85 0 Q 0 60 85 0"
                  fill="none"
                  stroke="#3a86ff"
                  strokeWidth={12}
                />
              </g>
            </Tip>
          </g>
        ) : null}
        {/* またね */}
        {part3 > 0 ? (
          <g opacity={part3}>
            <rect x={-20} y={890} width={1960} height={220} fill="#bfe3a5" />
            <Onigiri
              x={430}
              y={760 - Math.abs(Math.sin(f * 0.15)) * 40}
              s={0.9 * pop(f, BYE + 5, 18)}
              frame={f}
            />
            <Kid
              x={960}
              y={680}
              s={1.05 * pop(f, BYE, 18)}
              frame={f}
              armUp={Math.sin(f * 0.25) > 0 ? 1 : 0.6}
            />
            <Unchi
              x={1490}
              y={790 - Math.abs(Math.sin(f * 0.15 + 1)) * 40}
              s={0.9 * pop(f, BYE + 10, 18)}
              frame={f}
            />
            {[0, 1, 2, 3].map((i) => (
              <Buddy
                key={i}
                x={250 + i * 470}
                y={960 - Math.abs(Math.sin(f * 0.2 + i)) * 30}
                s={0.5 * pop(f, BYE + 15 + i * 5, 14)}
                frame={f + i * 10}
                color={["#7bd389", "#7fd0ff", "#ffd166", "#c3a6ff"][i]}
              />
            ))}
          </g>
        ) : null}
      </svg>
      <Caption
        text="うんちは おてがみ"
        start={15}
        end={HANAMARU - 5}
        position="top"
        size={100}
      />
      <Caption
        text="バナナうんちは げんき！"
        start={HANAMARU + 10}
        end={TIPS - 15}
        position="bottom"
        size={96}
        color="#ffe14d"
      />
      <Caption
        text="またね！"
        start={BYE + 15}
        end={S10_DURATION}
        position="top"
        size={150}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
