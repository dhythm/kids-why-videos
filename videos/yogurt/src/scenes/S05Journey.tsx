import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { BodyMap, organRange, pointOnTract } from "../components/Body";
import {
  Bifido,
  Bulgaricus,
  SourDrop,
  Stomach,
  Thermo,
} from "../components/Microbes";
import { Arrow, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S05_DURATION = DURATIONS[4];

const GO = 20; // たびに でる
const ACID = 190; // いぶくろは すっぱい
const PASS = 390; // とどく なかまも いる

const [, STOMACH_END] = organRange("stomach");
const [LARGE_START, LARGE_END] = organRange("large");

type Rider = { kind: 0 | 1 | 2; dx: number; dy: number; survive: boolean };
// いぶくろの なかの きんたち（のこるのは すこしだけ）
const RIDERS: Rider[] = [
  { kind: 0, dx: -280, dy: -120, survive: false },
  { kind: 1, dx: -120, dy: -200, survive: false },
  { kind: 2, dx: 60, dy: -100, survive: true },
  { kind: 0, dx: 220, dy: -40, survive: false },
  { kind: 1, dx: -200, dy: 60, survive: false },
  { kind: 2, dx: -20, dy: 110, survive: false },
  { kind: 0, dx: 160, dy: 120, survive: true },
  { kind: 1, dx: 320, dy: 40, survive: false },
  { kind: 2, dx: -330, dy: 170, survive: false },
];

const Rider: React.FC<{
  r: Rider;
  x: number;
  y: number;
  s: number;
  f: number;
  mood: "smile" | "wow" | "sleep";
  opacity?: number;
}> = ({ r, x, y, s, f, mood, opacity = 1 }) =>
  r.kind === 0 ? (
    <Bulgaricus
      x={x}
      y={y}
      s={s * 0.8}
      frame={f}
      mood={mood}
      opacity={opacity}
    />
  ) : r.kind === 1 ? (
    <Thermo x={x} y={y} s={s * 0.75} frame={f} mood={mood} opacity={opacity} />
  ) : (
    <Bifido x={x} y={y} s={s} frame={f} mood={mood} opacity={opacity} />
  );

export const S05Journey: React.FC = () => {
  const f = useCurrentFrame();
  const toStomach = ip(f, [ACID - 15, ACID + 5], [0, 1]);
  const toMap = ip(f, [PASS - 15, PASS + 5], [0, 1]);
  // からだの ちず の うえを すすむ（くち → いぶくろ）
  const travel = ip(f, [GO + 30, ACID - 20], [0, STOMACH_END - 0.02]);
  // さいごは いぶくろ → だいちょう
  const travel2 = ip(
    f,
    [PASS + 10, PASS + 120],
    [STOMACH_END, (LARGE_START + LARGE_END) / 2],
  );
  const weak = ip(f, [ACID + 60, ACID + 150], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* たびの はじまり */}
        <g opacity={1 - toStomach}>
          <rect width={1920} height={1080} fill="#fff6e0" />
          <BodyMap
            frame={f}
            draw={1}
            highlight={{ stomach: ip(f, [ACID - 50, ACID - 30], [0, 1]) }}
          />
          {[0, 1, 2].map((i) => {
            const p = pointOnTract(Math.max(0, travel - i * 0.025));
            return (
              <Rider
                key={i}
                r={RIDERS[i * 3 + 2 - i]}
                x={p.x}
                y={p.y}
                s={0.28}
                f={f}
                mood="smile"
              />
            );
          })}
          <Sfx
            text="しゅっぱつ！"
            x={1450}
            y={300}
            start={GO + 20}
            end={ACID - 20}
            size={90}
          />
        </g>
        {/* いぶくろ */}
        <g opacity={toStomach * (1 - toMap)}>
          <rect width={1920} height={1080} fill="#fff0f3" />
          <Stomach x={980} y={560} s={1.05} />
          {new Array(14).fill(0).map((_, i) => (
            <SourDrop
              key={i}
              x={700 + (i % 7) * 90}
              y={640 + Math.floor(i / 7) * 110}
              s={0.7 * pop(f, ACID + 20 + i * 3)}
              frame={f + i * 7}
              color="#d8f56a"
            />
          ))}
          {RIDERS.map((r, i) => {
            const fade = r.survive ? 0 : weak;
            return (
              <Rider
                key={i}
                r={r}
                x={980 + r.dx}
                y={560 + r.dy + fade * 40}
                s={0.6 * pop(f, ACID + i * 3)}
                f={f + i * 11}
                mood={
                  fade > 0.3
                    ? "sleep"
                    : r.survive && weak > 0.3
                      ? "wow"
                      : "smile"
                }
                opacity={1 - fade * 0.75}
              />
            );
          })}
          <Pill
            text="いぶくろ"
            x={420}
            y={300}
            s={pop(f, ACID + 10)}
            size={60}
            color="#ffd2dc"
            frame={f}
          />
          <Sfx
            text="すっぱーい！"
            x={1450}
            y={250}
            start={ACID + 30}
            end={PASS - 15}
            size={100}
            color="#d8f56a"
          />
        </g>
        {/* だいちょうへ */}
        <g opacity={toMap}>
          <rect width={1920} height={1080} fill="#fff6e0" />
          <BodyMap
            frame={f}
            draw={1}
            highlight={{ large: ip(f, [PASS + 90, PASS + 110], [0, 1]) }}
          />
          {[0, 1].map((i) => {
            const p = pointOnTract(Math.max(STOMACH_END, travel2 - i * 0.03));
            return (
              <Rider
                key={i}
                r={RIDERS[i === 0 ? 2 : 6]}
                x={p.x}
                y={p.y}
                s={0.3}
                f={f}
                mood="smile"
              />
            );
          })}
          <Arrow
            x1={1450}
            y1={780}
            x2={1450 - 240 * pop(f, PASS + 100)}
            y2={780}
          />
          <Pill
            text="だいちょうへ！"
            x={1590}
            y={680}
            s={pop(f, PASS + 100)}
            size={56}
            color="#ffd8a8"
            frame={f}
          />
        </g>
      </svg>
      <Caption
        text="きんたちの たび"
        start={GO + 5}
        end={ACID - 20}
        position="top"
        size={96}
      />
      <Caption
        text="たくさん やられちゃう…"
        start={ACID + 80}
        end={PASS - 15}
        position="top"
        size={84}
      />
      <Caption
        text="とどく なかまも いる！"
        start={PASS + 10}
        end={S05_DURATION}
        position="top"
        size={96}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
