import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import {
  Board,
  INK,
  NegiLying,
  NegiSlice,
  PumpkinCut,
} from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S01_DURATION = DURATIONS[0];

const PK = 30; // かぼちゃを きってみると… たねが いっぱい！
const PK_CUT = PK + 52;
const NG = 175; // ネギを きってみると… あれれ？
const NG_CUT = 232;
const WHY = 360; // どうして？

// ネギの わぎりが とんでいく さき
const SLICES = [
  [1290, 470],
  [1400, 430],
  [1510, 470],
  [1620, 430],
];

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  const open = ip(f, [PK_CUT, PK_CUT + 18], [0, 1]);
  const why = f >= WHY;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* だいどころ */}
        <rect width={1920} height={1080} fill="#fff1d6" />
        {new Array(8).fill(0).map((_, i) => (
          <rect
            key={i}
            x={i * 260 - 40}
            y={0}
            width={130}
            height={720}
            fill="#ffe8bd"
          />
        ))}
        <rect y={720} width={1920} height={360} fill="#e3a868" />
        <rect y={720} width={1920} height={18} fill={INK} opacity={0.15} />

        <Kid
          x={960}
          y={470}
          s={0.72}
          frame={f}
          mood={why || (f > NG_CUT + 20 && f < WHY) ? "wow" : "smile"}
          armUp={why ? ip(f, [WHY, WHY + 20], [0, 0.5]) : 0}
        />
        <Board x={180} y={600} w={1560} h={250} />

        {/* かぼちゃ */}
        <PumpkinCut x={540} y={700} s={1.05} open={open} />
        <Sfx
          text="パカッ！"
          x={540}
          y={470}
          start={PK_CUT}
          end={PK_CUT + 50}
          size={100}
          color="#ffb627"
        />
        {f >= PK_CUT + 18 && f < NG
          ? [0, 1, 2, 3, 4].map((i) => (
              <Sparkle
                key={i}
                x={540 + Math.cos(i * 1.3) * 230}
                y={680 + Math.sin(i * 2.1) * 120}
                s={
                  pop(f, PK_CUT + 18 + i * 4, 12) *
                  (0.8 + 0.2 * Math.sin(f * 0.3 + i))
                }
              />
            ))
          : null}

        {/* ネギ */}
        {(() => {
          // きると みぎから すこし みじかく なる
          const cut = ip(f, [NG_CUT, NG_CUT + 30], [0, 1]);
          return (
            <g>
              <g>
                <defs>
                  <clipPath id="negi-cut">
                    <rect x={0} y={0} width={1600 - cut * 200} height={1080} />
                  </clipPath>
                </defs>
                <g clipPath="url(#negi-cut)">
                  <NegiLying x={1100} y={700} s={0.95} />
                </g>
              </g>
              {SLICES.map(([tx, ty], i) => {
                const t0 = NG_CUT + i * 7;
                if (f < t0) {
                  return null;
                }
                const k = ip(f, [t0, t0 + 18], [0, 1]);
                const sx = 1560 - i * 50 + (tx - (1560 - i * 50)) * k;
                const sy = 700 + (ty - 700) * k - Math.sin(k * Math.PI) * 80;
                return (
                  <NegiSlice
                    key={i}
                    x={sx}
                    y={sy}
                    s={0.6 + k * 0.9}
                    green={i >= 2}
                  />
                );
              })}
            </g>
          );
        })()}
        <Sfx
          text="トントン"
          x={1460}
          y={600}
          start={NG_CUT - 6}
          end={NG_CUT + 40}
          size={80}
          color="#a5dc86"
          rotate={6}
        />
        <Sfx
          text="？"
          x={1455}
          y={300}
          start={NG_CUT + 40}
          end={S01_DURATION}
          size={150}
          color="#ff8fa3"
          rotate={10}
        />
      </svg>
      <Caption
        text="たね いっぱい！"
        start={PK_CUT + 20}
        end={NG - 5}
        position="top"
        size={100}
        color="#ffe14d"
      />
      <Caption
        text="ネギの たねは？"
        start={NG_CUT + 30}
        end={WHY - 5}
        position="top"
        size={100}
      />
      <Caption
        text="どうして？"
        start={WHY + 5}
        end={S01_DURATION}
        position="top"
        size={120}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
