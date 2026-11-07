import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { ColonBg, DotsBg } from "../components/Backgrounds";
import { Kid } from "../components/Kid";
import {
  Bifido,
  Bulgaricus,
  Crowd,
  LabCoat,
  Microscope,
  Thermo,
  YogurtCup,
} from "../components/Microbes";
import { Unchi } from "../components/Body";
import { INK, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S09_DURATION = DURATIONS[8];

const STAY = 20; // ずっと すみつかない
const LEAVE = 200; // たびびと
const DIFF = 350; // ききめは ちがう
const LAB = 520; // はかせも しらべちゅう

/** たびびとの ぼうし */
const Hat: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse rx={70} ry={16} fill="#e0a85a" stroke={INK} strokeWidth={5} />
      <path
        d="M -40 0 Q -40 -56 0 -56 Q 40 -56 40 0 Z"
        fill="#f2c27a"
        stroke={INK}
        strokeWidth={5}
      />
      <rect x={-40} y={-16} width={80} height={12} fill="#ff6b6b" />
    </g>
  );

export const S09Truth: React.FC = () => {
  const f = useCurrentFrame();
  const toDiff = ip(f, [DIFF - 15, DIFF + 5], [0, 1]);
  const toLab = ip(f, [LAB - 15, LAB + 5], [0, 1]);
  // たびびとは みぎへ でていく
  const walk = ip(f, [LEAVE + 30, DIFF - 20], [0, 1]);
  const travelers = [
    { C: Bulgaricus, x: 520, y: 500, s: 0.6 },
    { C: Bifido, x: 800, y: 640, s: 0.65 },
    { C: Thermo, x: 1060, y: 480, s: 0.55 },
  ];
  // 3にんの こども（ききめは ひとそれぞれ）
  const meters = [0.85, 0.35, 0.6];
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toDiff}>
          <ColonBg frame={f} />
          <Crowd
            frame={f}
            count={16}
            seed="c09"
            s={0.36}
            area={[60, 160, 1800, 120]}
          />
          <Crowd
            frame={f}
            count={16}
            seed="c09b"
            s={0.36}
            area={[60, 820, 1800, 120]}
          />
          <Unchi x={480 + walk * 1500} y={760} s={0.6} frame={f} />
          {travelers.map(({ C, x, y, s }, i) => {
            const xx = x + walk * 1400 + Math.sin(f * 0.3 + i) * 4;
            const yy =
              y +
              Math.abs(Math.sin(f * 0.25 + i)) *
                -16 *
                (walk > 0 && walk < 1 ? 1 : 0);
            return (
              <g key={i}>
                <C
                  x={xx}
                  y={yy}
                  s={s * pop(f, STAY + i * 6)}
                  frame={f + i * 9}
                />
                <Hat x={xx} y={yy - 70} s={0.9 * pop(f, LEAVE + i * 6)} />
              </g>
            );
          })}
          <Pill
            text="たびびと"
            x={960}
            y={330}
            s={pop(f, LEAVE + 20) * (1 - ip(f, [DIFF - 40, DIFF - 25], [0, 1]))}
            size={64}
            color="#f2c27a"
            frame={f}
          />
          <Sfx
            text="またね〜"
            x={1600}
            y={420}
            start={LEAVE + 80}
            end={DIFF - 15}
            size={90}
            color="#ffffff"
          />
        </g>
        {/* ひとによって ちがう */}
        <g opacity={toDiff * (1 - toLab)}>
          <DotsBg color="#fff6e0" dot="#ffeecb" />
          {meters.map((m, i) => {
            const x = 420 + i * 540;
            const h =
              300 *
              m *
              ip(f, [DIFF + 60 + i * 10, DIFF + 110 + i * 10], [0, 1]);
            return (
              <g key={i}>
                <Kid
                  x={x - 70}
                  y={640}
                  s={0.75 * pop(f, DIFF + i * 6)}
                  frame={f + i * 20}
                  mood={m > 0.7 ? "wow" : "smile"}
                />
                <YogurtCup
                  x={x + 130}
                  y={900}
                  s={0.55 * pop(f, DIFF + 10 + i * 6)}
                />
                <rect
                  x={x + 100}
                  y={680 - 300}
                  width={60}
                  height={300}
                  rx={14}
                  fill="#ffffff"
                  stroke={INK}
                  strokeWidth={6}
                />
                <rect
                  x={x + 106}
                  y={680 - h}
                  width={48}
                  height={h}
                  rx={10}
                  fill={["#7ed957", "#ffd166", "#7aa7ff"][i]}
                />
              </g>
            );
          })}
        </g>
        {/* はかせ */}
        <g opacity={toLab}>
          <DotsBg color="#eef3ff" dot="#dde6ff" />
          <Kid x={760} y={620} s={1.1} frame={f} mood="wow" />
          <LabCoat x={760} y={620} s={1.1} />
          <Microscope x={1220} y={860} s={1.4 * pop(f, LAB)} />
          <Sfx
            text="ふむふむ"
            x={1640}
            y={400}
            start={LAB + 20}
            end={S09_DURATION}
            size={100}
          />
        </g>
      </svg>
      <Caption
        text="ずっとは すまない"
        start={STAY + 10}
        end={LEAVE + 10}
        position="top"
        size={96}
      />
      <Caption
        text="うんちと いっしょに でていく"
        start={LEAVE + 25}
        end={DIFF - 15}
        position="top"
        size={80}
        color="#ffe14d"
      />
      <Caption
        text="ひとに よって ちがう"
        start={DIFF + 20}
        end={LAB - 15}
        position="top"
        size={96}
      />
      <Caption
        text="いまも しらべちゅう"
        start={LAB + 10}
        end={S09_DURATION}
        position="top"
        size={96}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
