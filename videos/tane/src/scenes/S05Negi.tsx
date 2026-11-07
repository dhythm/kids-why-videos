import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import {
  Arrow,
  Leader,
  Negi,
  NegiBozu,
  Pill,
} from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S05_DURATION = DURATIONS[4];

const ASK = 20; // ネギは どこを たべているのかな？
const GREEN = 165; // みどりの ところも
const WHITE = 205; // しろい ところも
const ALL = 240; // ぜんぶ はっぱ
const BEFORE = 300; // はなが さく まえの はっぱを たべている

export const S05Negi: React.FC = () => {
  const f = useCurrentFrame();
  const gl = ip(f, [GREEN, GREEN + 10], [0, 1]) * ip(f, [ALL + 30, ALL + 45], [1, 0]);
  const hl = ip(f, [WHITE, WHITE + 10], [0, 1]) * ip(f, [ALL + 30, ALL + 45], [1, 0]);
  const shift = ip(f, [BEFORE - 10, BEFORE + 20], [0, 1]);
  // ネギは ひだりへ よって ちいさく
  const nx = 860 - shift * 420;
  const ns = 1.1 - shift * 0.25;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#f0fbe8" />
        {new Array(14).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={(i % 7) * 300 + 60}
            cy={Math.floor(i / 7) * 560 + 300}
            r={24}
            fill="#dcf3cf"
          />
        ))}
        <rect y={930} width={1920} height={150} fill="#cfe8b8" />

        <Negi x={nx} y={930} s={ns * pop(f, 0, 20)} green={360} gl={gl} hl={hl} />

        {/* は ラベル */}
        {shift < 1 ? (
          <g opacity={1 - shift}>
            <Leader x1={1080} y1={430} x2={890} y2={480} p={ip(f, [GREEN, GREEN + 14], [0, 1])} />
            <Pill text="はっぱ" x={1180} y={430} s={pop(f, GREEN)} size={80} color="#b6e59e" frame={f} />
            <Leader x1={1080} y1={790} x2={900} y2={800} p={ip(f, [WHITE, WHITE + 14], [0, 1])} />
            <Pill text="はっぱ" x={1180} y={790} s={pop(f, WHITE)} size={80} color="#ffffff" frame={f} />
            <Pill
              text="ぜんぶ はっぱ！"
              x={1290}
              y={610}
              s={pop(f, ALL)}
              size={66}
              color="#ffe14d"
              frame={f}
            />
          </g>
        ) : null}

        {/* はなが さく まえ */}
        {shift > 0 ? (
          <g opacity={shift}>
            <Pill text="いま たべる" x={nx} y={370} s={pop(f, BEFORE + 15)} size={60} color="#b6e59e" frame={f} />
            <Arrow x1={720} y1={600} x2={720 + 260 * pop(f, BEFORE + 35)} y2={600} />
            <g opacity={0.4}>
              <path d="M 1240 930 L 1240 520" stroke="#4fae4a" strokeWidth={18} strokeLinecap="round" />
              <NegiBozu x={1240} y={470} s={1.2} open={1} frame={f} />
            </g>
            <Sfx text="？" x={1240} y={460} start={BEFORE + 45} end={S05_DURATION} size={120} color="#ff8fa3" />
            <Pill text="はな まだ" x={1240} y={340} s={pop(f, BEFORE + 50)} size={60} color="#ffffff" frame={f} />
          </g>
        ) : null}

        <Kid
          x={1740}
          y={680}
          s={0.62}
          frame={f}
          mood={f < GREEN || (f > BEFORE + 40) ? "wow" : "smile"}
        />
        <Sfx text="？" x={1790} y={380} start={ASK + 20} end={GREEN - 5} size={110} color="#ff8fa3" rotate={10} />
      </svg>
      <Caption
        text="ネギは どこを たべる？"
        start={ASK + 5}
        end={GREEN - 10}
        position="top"
        size={96}
      />
      <Caption
        text="はなが さく まえの はっぱ"
        start={BEFORE + 60}
        end={S05_DURATION}
        position="top"
        size={90}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
