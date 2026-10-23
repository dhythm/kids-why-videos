import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile, useCurrentFrame } from "remotion";
import { Expr, halfHeight, Veg, VegKind } from "./veg";

export type TankItem = {
  kind: VegKind;
  x: number; // タンク内の横位置（左端からの px）
  delay: number; // 落下開始フレーム
  mode: "float" | "sink" | "rise";
  s?: number;
  riseAt?: number; // mode=rise のとき、底から浮き上がり始めるフレーム
  sinkTau?: number; // 沈む速さ（大きいほどゆっくり）
  expr?: Expr;
};

const DROP = 330;
const G = 1.5;
export const T_IMPACT = Math.sqrt((2 * DROP) / G);

function itemPose(frame: number, it: TankItem, surface: number, bottom: number) {
  const s = it.s ?? 1;
  const hh = halfHeight[it.kind] * s;
  const t = frame - it.delay;
  const floatRest = surface + hh * 0.35;
  const sinkRest = bottom - hh - 6;
  if (t < T_IMPACT) {
    return { y: surface - DROP + 0.5 * G * t * t, rot: 0 };
  }
  const tau = t - T_IMPACT;
  if (it.mode === "float") {
    const y = floatRest + 70 * Math.exp(-tau / 14) * Math.sin(tau * 0.22) + 4 * Math.sin(frame * 0.08 + it.x);
    return { y, rot: 3 * Math.sin(frame * 0.06 + it.x) };
  }
  const sunk = surface + (sinkRest - surface) * (1 - Math.exp(-tau / (it.sinkTau ?? 22)));
  if (it.mode === "rise" && it.riseAt !== undefined && frame > it.riseAt) {
    const r = frame - it.riseAt;
    const k = 1 - Math.exp(-r / 20);
    const y = sinkRest + (floatRest - sinkRest) * k + 4 * k * Math.sin(frame * 0.08);
    return { y, rot: 0 };
  }
  return { y: sunk, rot: 6 * Math.sin(tau * 0.15) * Math.exp(-tau / 40) };
}

export function Tank({
  x,
  y,
  w,
  h,
  items,
  waterColor = "#4fc3f7",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  items: TankItem[];
  waterColor?: string;
}) {
  const frame = useCurrentFrame();
  const surface = h * 0.3;
  const bottom = h;
  const wave = (ox: number) => {
    let d = `M0,${surface}`;
    for (let i = 0; i <= 20; i++) {
      const px = (w / 20) * i;
      d += ` L${px},${surface + 5 * Math.sin(frame * 0.12 + i * 0.9 + ox)}`;
    }
    return d + ` L${w},${bottom} L0,${bottom}Z`;
  };

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-8} y={-10} width={w + 16} height={h + 18} rx={22} fill="#ffffff" opacity={0.5} />
      <path d={wave(0)} fill={waterColor} opacity={0.45} />
      {items.map((it, i) => {
        if (frame < it.delay) return null;
        const { y: iy, rot } = itemPose(frame, it, surface, bottom);
        const s = it.s ?? 1;
        const t = frame - it.delay - T_IMPACT;
        return (
          <g key={i}>
            <g transform={`translate(${it.x} ${iy}) rotate(${rot}) scale(${s})`}>
              <Veg kind={it.kind} expr={it.expr} />
            </g>
            {t > 0 && t < 26 ? (
              <ellipse cx={it.x} cy={surface} rx={30 + t * 5 * s} ry={8 + t * 1.2} fill="none" stroke="#fff" strokeWidth={5} opacity={1 - t / 26} />
            ) : null}
            {it.mode !== "float" && t > 0 && t < 70
              ? [0, 1, 2, 3].map((b) => {
                  const bt = t - b * 9;
                  if (bt < 0) return null;
                  const by = iy - bt * 4;
                  if (by < surface) return null;
                  return <circle key={b} cx={it.x + (b - 1.5) * 18 * s + 6 * Math.sin(bt * 0.3)} cy={by} r={7 + b} fill="#e1f5fe" opacity={0.8} />;
                })
              : null}
          </g>
        );
      })}
      <path d={wave(1.3)} fill={waterColor} opacity={0.3} />
      <rect x={-8} y={-10} width={w + 16} height={h + 18} rx={22} fill="none" stroke="#5b7a99" strokeWidth={8} />
    </g>
  );
}

// 水に落ちた瞬間の「ぽちゃん」。<svg> の外に置く
export function TankSounds({ items }: { items: TankItem[] }) {
  return (
    <>
      {items.map((it, i) => (
        <Sequence key={i} from={Math.round(it.delay + T_IMPACT)} durationInFrames={20} layout="none">
          <Audio src={staticFile("plop.mp3")} volume={0.6} />
        </Sequence>
      ))}
    </>
  );
}
