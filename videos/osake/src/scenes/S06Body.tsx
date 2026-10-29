import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { getLength } from "@remotion/paths";
import { Adult, BeerMug } from "../components/Home";
import { Alco } from "../components/Things";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, FONT, Sfx } from "../components/Caption";
import { pointAt } from "../lib/path";
import { ip, pop } from "../lib/anim";

export const S06_DURATION = 640;

const DRINK = 15;
const FLOW = 100;
const HEAD = 270;
const SLEEP = 490;

const AX = 760;
const AY = 720;
const AS = 1.35;

/** ちの めぐり（おなか → あたま → おなか） */
const LOOP =
  "M 760 800 C 870 800 870 650 805 600 C 790 560 805 520 795 440 C 785 380 735 380 725 440 C 715 520 730 560 715 600 C 650 650 650 800 760 800 Z";
const LOOP_LEN = getLength(LOOP);

export const S06Body: React.FC = () => {
  const f = useCurrentFrame();
  const raise = ip(
    f,
    [DRINK, DRINK + 20, DRINK + 60, DRINK + 80],
    [0, 1, 1, 0.05],
  );
  const level = ip(f, [DRINK + 20, DRINK + 60], [1, 0.5], (x) => x);
  const xray = ip(f, [FLOW - 20, FLOW], [0, 1]);
  const blush = ip(f, [HEAD, HEAD + 60], [0, 1]);
  const sway = ip(f, [HEAD + 20, HEAD + 60], [0, 1]);
  const sleeping = f >= SLEEP;
  const headY = AY - 185 * AS;
  // おとなの ゆれ（Adult の sway と おなじ）に すけた なかみを あわせる
  const rot = Math.sin(f * 0.08) * 6 * sway;

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#e3f2ff" />
        <circle cx={AX} cy={600} r={520} fill="#fff" opacity={0.6} />
        <Adult
          x={AX}
          y={AY}
          s={AS}
          frame={f}
          variant="papa"
          raise={raise}
          blush={blush}
          sway={sway}
          mood={sleeping ? "sleep" : raise > 0.8 ? "sleep" : "smile"}
          hold={<BeerMug frame={f} level={level} s={0.8} />}
        />

        <g transform={`rotate(${rot} ${AX} ${AY + 160 * AS})`}>
          {/* からだの なかを すけて みせる */}
          {xray > 0 ? (
            <g opacity={xray}>
              <ellipse
                cx={AX}
                cy={790}
                rx={60}
                ry={42}
                fill="#ffb3c6"
                stroke="#2b2b4a"
                strokeWidth={5}
              />
              <path
                d={LOOP}
                fill="none"
                stroke="#ff4d6d"
                strokeWidth={16}
                strokeLinecap="round"
                opacity={0.75}
              />
              <path
                d={LOOP}
                fill="none"
                stroke="#fff"
                strokeWidth={4}
                strokeDasharray="14 22"
                strokeDashoffset={-f * 3}
                opacity={0.8}
              />
            </g>
          ) : null}
          {f >= FLOW
            ? new Array(12).fill(0).map((_, i) => {
                const start = FLOW + i * 10;
                if (f < start) {
                  return null;
                }
                const p = pointAt(LOOP, ((f - start) * 5) % LOOP_LEN);
                return (
                  <Alco
                    key={i}
                    x={p.x}
                    y={p.y}
                    s={0.6 * pop(f, start, 10)}
                    frame={f + i * 9}
                  />
                );
              })
            : null}
        </g>

        {/* ふわふわ */}
        {f >= HEAD + 30 && !sleeping
          ? [0, 1, 2, 3].map((i) => {
              const a = f * 0.05 + (i * Math.PI) / 2;
              return (
                <Sparkle
                  key={i}
                  x={AX + Math.cos(a) * 190}
                  y={headY - 40 + Math.sin(a) * 60}
                  s={pop(f, HEAD + 30 + i * 5, 12) * 0.8}
                  color={i % 2 ? "#ffb3d1" : "#ffe14d"}
                />
              );
            })
          : null}
        {sleeping
          ? [0, 1, 2].map((i) => {
              const k = ((f - SLEEP + i * 20) % 60) / 60;
              return (
                <text
                  key={i}
                  x={AX + 150 + k * 80 + i * 10}
                  y={headY - 100 - k * 120}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 60 + i * 14,
                  }}
                  fill="#5c6bc0"
                  stroke="#fff"
                  strokeWidth={6}
                  paintOrder="stroke"
                  opacity={(1 - k) * pop(f, SLEEP + i * 10, 10)}
                >
                  Z
                </text>
              );
            })
          : null}

        <Kid
          x={1560}
          y={760}
          s={1}
          frame={f}
          mood={f >= HEAD && f < SLEEP ? "wow" : "smile"}
        />

        <Sfx
          text="ごくごく"
          x={1100}
          y={260}
          start={DRINK + 20}
          end={DRINK + 75}
          size={90}
          color="#ffffff"
        />
        <Sfx
          text="ふわ〜"
          x={1150}
          y={330}
          start={HEAD + 40}
          end={SLEEP - 5}
          size={110}
          color="#ffb3d1"
        />
      </svg>
      <Caption
        text="からだ じゅうを めぐる"
        start={FLOW + 5}
        end={HEAD - 5}
        position="top"
        size={96}
      />
      <Caption
        text="かおが あかく なる"
        start={HEAD + 5}
        end={SLEEP - 5}
        position="top"
        size={96}
        color="#ffb3c6"
      />
      <Caption
        text="ねむく なる ことも"
        start={SLEEP + 5}
        end={S06_DURATION}
        position="top"
        size={96}
      />
    </AbsoluteFill>
  );
};
