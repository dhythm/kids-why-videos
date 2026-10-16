import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Earth, Moon, Stars } from "../components/Characters";
import { Caption, FONT } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S02_DURATION = 580;

const EARTH_D = 50; // ちきゅう の ちょっけい（px）
const START_X = 230;
const COUNT = 30; // つきまで ちきゅう 30こ ぶん
const POP_START = 120;
const POP_EVERY = 9;

export const S02Distance: React.FC = () => {
  const f = useCurrentFrame();
  const moonX = START_X + EARTH_D * COUNT;
  const shown = Math.max(
    1,
    Math.min(COUNT, Math.floor((f - POP_START) / POP_EVERY) + 2),
  );
  const counting = f >= POP_START;
  const done = f > POP_START + POP_EVERY * (COUNT - 1) + 20;
  // カメラ: はじめは ちきゅうに よって → ひいて ぜんたいを みせる
  const zoom = ip(f, [0, 30, 110], [2.6, 2.6, 1], Easing.inOut(Easing.cubic));
  const camX = ip(
    f,
    [0, 30, 110],
    [START_X, START_X, 960],
    Easing.inOut(Easing.cubic),
  );
  const bounce = done ? 1 + Math.sin((f - POP_START) * 0.25) * 0.04 : 1;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0b1240, #1d2a7a)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Stars frame={f} scrollX={-f * 0.4} seed="d" />
        <g
          transform={`translate(960 600) scale(${zoom}) translate(${-camX} -600)`}
        >
          {/* てんてんの みち */}
          <line
            x1={START_X}
            y1={600}
            x2={moonX}
            y2={600}
            stroke="#ffffff"
            strokeWidth={4}
            strokeDasharray="6 14"
            strokeDashoffset={-f * 1.5}
            opacity={ip(f, [60, 100], [0, 0.6])}
          />
          {/* ならぶ ちきゅう */}
          {new Array(COUNT - 1).fill(0).map((_, i) => {
            const n = i + 1;
            const s = pop(f, POP_START + (n - 1) * POP_EVERY, 12);
            if (s <= 0) {
              return null;
            }
            return (
              <g
                key={i}
                transform={`translate(${START_X + n * EARTH_D} ${600 + Math.sin(f * 0.12 + n * 0.5) * 6}) scale(${s * bounce})`}
              >
                <Earth
                  x={0}
                  y={0}
                  r={EARTH_D / 2 - 2}
                  frame={f + n * 7}
                  face={false}
                />
              </g>
            );
          })}
          <Earth
            x={START_X}
            y={600}
            r={EARTH_D / 2 - 2}
            frame={f}
            mood="smile"
          />
          <g
            transform={`translate(${moonX} 600) scale(${1 + Math.sin(f * 0.1) * 0.06})`}
          >
            <Moon x={0} y={0} r={18} frame={f} />
          </g>
          {/* つき への やじるし */}
          <g
            opacity={
              ip(f, [40, 70], [0, 1]) *
              (counting ? ip(f, [POP_START, POP_START + 20], [1, 0]) : 1)
            }
          >
            <path
              d={`M ${moonX} ${520 + Math.sin(f * 0.2) * 10} l -16 -30 l 32 0 z`}
              fill="#ffe14d"
              stroke="#2b2b4a"
              strokeWidth={3}
            />
          </g>
        </g>
        {/* かぞえる すうじ */}
        {counting ? (
          <g
            transform={`translate(960 330) scale(${done ? 1.25 + Math.sin(f * 0.2) * 0.05 : 1 + (pop(f, POP_START + (shown - 2) * POP_EVERY, 8) - 1) * 0.3})`}
          >
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontFamily: FONT, fontWeight: 800, fontSize: 220 }}
              fill="#ffe14d"
              stroke="#2b2b4a"
              strokeWidth={22}
              paintOrder="stroke"
            >
              {shown}
            </text>
          </g>
        ) : null}
      </svg>
      <Caption
        text="つきって どのくらい とおい？"
        start={10}
        end={POP_START - 5}
        position="top"
        size={92}
      />
      <Caption
        text="ちきゅう 30こ ぶん！"
        start={POP_START + POP_EVERY * COUNT + 20}
        end={S02_DURATION}
        position="bottom"
        size={110}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
