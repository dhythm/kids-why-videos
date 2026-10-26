import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import { EGG_D, Yolk } from "../components/Farm";
import { Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S05_DURATION = 440;

const WRAP = 40;
const DONE = 190;
const BOILED = 245;

export const S05Skin: React.FC = () => {
  const f = useCurrentFrame();
  const wrap = ip(f, [WRAP, DONE], [0, 1], Easing.inOut(Easing.quad));
  const shift = ip(f, [BOILED - 25, BOILED + 10], [0, -330]);
  const eggS = 3.4 - ip(f, [BOILED - 25, BOILED + 10], [0, 0.6]);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#f3ecff, #ffe1ec)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {new Array(16).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={(random(`kx${i}`) * 1920 + f * 0.4) % 1920}
            cy={random(`ky${i}`) * 1080}
            r={10 + random(`kr${i}`) * 22}
            fill={["#d7c4ff", "#ffc8dd", "#cdeac0"][i % 3]}
            opacity={0.55}
          />
        ))}
        <g
          transform={`translate(${960 + shift} 610) rotate(${Math.sin(f * 0.05) * 3})`}
        >
          <g transform={`scale(${eggS})`}>
            {/* しろみ */}
            <path
              d={EGG_D}
              fill="#ffffff"
              opacity={0.75}
              stroke="#ffffff"
              strokeWidth={2}
            />
            {/* うすい かわ */}
            <path d={EGG_D} fill="#d7c4ff" opacity={wrap * 0.35} />
            <path
              d={EGG_D}
              fill="none"
              stroke="#9b7bff"
              strokeWidth={4}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - wrap}
            />
            {/* くるくる つつむ リボン */}
            {f > WRAP && f < DONE + 10
              ? [0, 1, 2].map((i) => {
                  const t = ((f - WRAP) / 50 + i / 3) % 1;
                  const y = -55 + t * 115;
                  const half =
                    Math.sqrt(Math.max(0, 1 - ((y - 5) / 62) ** 2)) * 50;
                  return (
                    <ellipse
                      key={i}
                      cx={0}
                      cy={y}
                      rx={half}
                      ry={6}
                      fill="none"
                      stroke="#9b7bff"
                      strokeWidth={2.5}
                      opacity={0.7 * ip(f, [DONE - 10, DONE + 10], [1, 0])}
                    />
                  );
                })
              : null}
          </g>
          <Yolk x={0} y={40} r={95} frame={f} />
        </g>
        {f >= DONE
          ? [0, 1, 2].map((i) => (
              <Sparkle
                key={i}
                x={960 + shift + Math.cos(i * 2.1) * 230}
                y={560 + Math.sin(i * 2.1) * 220}
                s={
                  pop(f, DONE + i * 6, 14) * (0.9 + Math.sin(f * 0.2 + i) * 0.2)
                }
                color="#9b7bff"
              />
            ))
          : null}

        {/* ゆでたまご */}
        {f >= BOILED ? (
          <g
            transform={`translate(1300 620) scale(${pop(f, BOILED, 20) * 2.6})`}
          >
            <path d={EGG_D} fill="#ffffff" stroke="#2b2b4a" strokeWidth={4} />
            {/* のこっている から */}
            <path
              d="M -50 20 C -48 48 -26 62 0 62 C 26 62 48 48 50 20 L 34 30 L 20 14 L 4 32 L -12 16 L -30 30 Z"
              fill="#f4d9b5"
              stroke="#2b2b4a"
              strokeWidth={3.5}
              strokeLinejoin="round"
            />
            {/* めくれた うすい かわ */}
            <g
              transform={`translate(42 -8) rotate(${Math.sin(f * 0.15) * 8 - 10})`}
            >
              <path
                d="M 0 0 C 22 -6 40 6 46 24 C 34 18 18 16 4 20 Z"
                fill="#e6dcff"
                opacity={0.9}
                stroke="#9b7bff"
                strokeWidth={2.5}
              />
            </g>
            <ellipse
              cx={-18}
              cy={-28}
              rx={8}
              ry={16}
              fill="#f0f6ff"
              transform="rotate(20 -18 -28)"
            />
          </g>
        ) : null}
        {f >= BOILED + 20 ? (
          <g
            transform={`translate(1480 420) scale(${pop(f, BOILED + 20, 14)})`}
          >
            <path
              d="M -30 30 Q 40 20 60 -40"
              stroke="#9b7bff"
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 60 -40 L 34 -26 M 60 -40 L 68 -12"
              stroke="#9b7bff"
              strokeWidth={10}
              strokeLinecap="round"
            />
          </g>
        ) : null}
        <Sfx
          text="ふわっ"
          x={1450}
          y={330}
          start={WRAP + 10}
          end={DONE}
          size={110}
          color="#d7c4ff"
        />
        <Sfx
          text="これ！"
          x={1640}
          y={300}
          start={BOILED + 30}
          end={S05_DURATION}
          size={110}
          color="#d7c4ff"
        />
      </svg>
      <Caption
        text="うすい かわ で つつむよ"
        start={15}
        end={BOILED - 15}
        position="top"
        size={92}
      />
      <Caption
        text="ゆでたまご の うすい かわ！"
        start={BOILED}
        end={S05_DURATION}
        position="top"
        size={88}
      />
    </AbsoluteFill>
  );
};
