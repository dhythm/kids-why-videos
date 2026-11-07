import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import {
  Butterfly,
  Negi,
  NegiBozu,
  NegiSeed,
  Petal,
  Pill,
  Soil,
  Sun,
} from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S06_DURATION = DURATIONS[5];

const WAIT = 20; // そのままに しておくと…
const SPRING = 170; // はるに まるい はなが さくよ
const NAME = 240; // これは ねぎぼうず
const SEEDS = 330; // くろい たねが できる
const YAY = 460; // ネギにも たねが あった！

const NX = 960;
const NY = 820;

export const S06Bozu: React.FC = () => {
  const f = useCurrentFrame();
  // ネギが のびて、まんなかから くきが でる
  const stalk = ip(f, [WAIT + 40, SPRING + 20], [0, 1]);
  const ballY = NY - 200 - 120 - stalk * 300; // 520 → 220 くらい
  const open = ip(f, [SPRING + 30, SPRING + 80], [0, 1]);
  const seeds = ip(f, [SEEDS + 30, SEEDS + 60], [0, 1]);
  // カメラ: ねぎぼうずに ちかづいて、また はなれる
  const focus =
    ip(f, [SEEDS - 5, SEEDS + 25], [0, 1]) * ip(f, [YAY - 25, YAY + 5], [1, 0]);
  const zoom = 1 + focus * 1.3;
  const camY = 540 + (ballY - 540) * focus;
  const sky = interpolateColors(f, [WAIT, SPRING], ["#cfe7ff", "#ffe9f1"]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill={sky} />
        <g transform={`translate(960 540) scale(${zoom}) translate(-960 ${-camY})`}>
          <Sun x={260 + ip(f, [WAIT, SPRING], [0, 1300])} y={200 - Math.sin(ip(f, [WAIT, SPRING], [0, Math.PI])) * 60} frame={f} s={0.7} />
          <Soil y={NY} h={320} />
          {/* となりの ネギ */}
          <Negi x={520} y={NY + 10} s={0.8} green={300} />
          <Negi x={1400} y={NY + 10} s={0.8} green={300} />
          {/* まんなかの ネギ と ねぎぼうず */}
          <path
            d={`M ${NX} ${NY - 200} L ${NX} ${ballY}`}
            stroke="#4fae4a"
            strokeWidth={20}
            strokeLinecap="round"
          />
          <Negi x={NX} y={NY + 10} s={1} green={300 + stalk * 60} />
          {stalk > 0.3 ? (
            <NegiBozu
              x={NX}
              y={ballY}
              s={ip(f, [WAIT + 70, WAIT + 110], [0.4, 1])}
              open={open}
              seeds={seeds}
              frame={f}
            />
          ) : null}
          {/* おちる たね */}
          {f > SEEDS + 70
            ? [0, 1, 2, 3, 4].map((i) => {
                const t0 = SEEDS + 70 + i * 8;
                const k = ip(f, [t0, t0 + 50], [0, 1]);
                if (k <= 0) {
                  return null;
                }
                const sx = NX - 40 + i * 20;
                const sy = ballY + 40 + k * (NY - ballY - 40);
                return <NegiSeed key={i} x={sx + Math.sin(k * 6 + i) * 10} y={sy} rot={k * 300} s={1.2} />;
              })
            : null}
          <Pill
            text="たね"
            x={NX + 170}
            y={ballY - 60}
            s={pop(f, SEEDS + 50) * ip(f, [YAY - 30, YAY - 20], [1, 0])}
            size={34}
            color="#ffffff"
            frame={f}
          />
        </g>

        {/* はる */}
        {f > SPRING
          ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const t = f - SPRING;
              const x = ((i * 263 + t * (1.5 + (i % 3) * 0.5)) % 2100) - 90;
              const y = ((i * 151 + t * (1.2 + (i % 2) * 0.6)) % 900) + 20;
              return <Petal key={i} x={x} y={y} rot={t * 3 + i * 40} s={1.6} />;
            })
          : null}
        {f > SPRING + 20 && focus < 0.5 ? (
          <>
            <Butterfly x={600 + Math.sin(f * 0.03) * 120} y={380 + Math.sin(f * 0.07) * 40} frame={f} />
            <Butterfly x={1350 + Math.cos(f * 0.025) * 100} y={330 + Math.sin(f * 0.06) * 50} frame={f + 7} s={0.8} color="#fff07a" />
          </>
        ) : null}
        <Sfx text="ぽろぽろ" x={1300} y={720} start={SEEDS + 75} end={YAY - 25} size={90} color="#ffffff" />

        {f >= YAY ? (
          <>
            <Kid
              x={1620}
              y={600 - Math.abs(Math.sin((f - YAY) * 0.18)) * 40}
              s={0.65 * pop(f, YAY)}
              frame={f}
              mood="wow"
              armUp={1}
            />
            {[0, 1, 2, 3].map((i) => (
              <Sparkle
                key={i}
                x={NX + Math.cos(i * 1.6) * 160}
                y={ballY + Math.sin(i * 1.6) * 140}
                s={pop(f, YAY + 10 + i * 4, 12) * (0.8 + 0.2 * Math.sin(f * 0.3 + i))}
              />
            ))}
          </>
        ) : null}
      </svg>
      <Caption text="そのままに すると…" start={WAIT + 5} end={SPRING - 5} position="bottom" size={90} />
      <Caption text="ねぎぼうず" start={NAME} end={SEEDS - 10} position="bottom" size={120} color="#ffe14d" />
      <Caption text="くろい たね！" start={SEEDS + 50} end={YAY - 25} position="top" size={100} />
      <Caption text="ネギにも たね あった！" start={YAY + 5} end={S06_DURATION} position="bottom" size={96} color="#ffe14d" />
    </AbsoluteFill>
  );
};
