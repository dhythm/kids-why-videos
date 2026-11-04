import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { Arrow, INK, Pill, Spider } from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S06_DURATION = 560;

const LOOK = 20; // よーく 見てみると
const BEADS = 130; // つぶつぶ ねばねば
const WALK = 300; // たていとは ねばねば しない

// アップ: たていと = たて の せん、よこいと = たるんだ よこの せん
const RADIAL_X = [520, 1100, 1640];
const SPIRAL_Y = [250, 520, 790];

function sagY(x: number, y: number): number {
  // たていとの あいだで すこし たるむ
  const seg = x < RADIAL_X[1] ? [RADIAL_X[0] - 600, RADIAL_X[0], RADIAL_X[1]] : [RADIAL_X[1], RADIAL_X[2], RADIAL_X[2] + 600];
  for (let i = 0; i < seg.length - 1; i++) {
    if (x >= seg[i] && x <= seg[i + 1]) {
      const t = (x - seg[i]) / (seg[i + 1] - seg[i]);
      return y + Math.sin(t * Math.PI) * 30;
    }
  }
  return y;
}

export const S06Sticky: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = ip(f, [0, LOOK + 60], [0.6, 1]);
  const beads = pop(f, BEADS + 10, 24);
  const walk = ip(f, [WALK + 30, S06_DURATION - 30], [0, 1], (t) => t);
  const spY = 1150 - walk * 800;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#2f3b6b" />
        <g transform={`translate(960 540) scale(${zoom}) translate(-960 -540)`}>
          {RADIAL_X.map((x, i) => (
            <line key={i} x1={x} y1={-100} x2={x} y2={1180} stroke="#ffffff" strokeWidth={14} strokeLinecap="round" />
          ))}
          {SPIRAL_Y.map((y, j) => {
            const pts: string[] = [];
            for (let x = -40; x <= 1960; x += 20) {
              pts.push(`${x} ${sagY(x, y).toFixed(1)}`);
            }
            return (
              <g key={j}>
                <path d={`M ${pts.join(" L ")}`} stroke="#ffe9a0" strokeWidth={9} fill="none" />
                {beads > 0
                  ? new Array(34).fill(0).map((_, k) => {
                      const x = k * 60 + 10 + (j % 2) * 30;
                      if (RADIAL_X.some((rx) => Math.abs(rx - x) < 30)) {
                        return null;
                      }
                      return (
                        <g key={k} transform={`translate(${x} ${sagY(x, y)}) scale(${beads})`}>
                          <circle r={15} fill="#fff3a6" stroke="#e3b84a" strokeWidth={4} />
                          <circle cx={-5} cy={-5} r={5} fill="#ffffff" opacity={0.6 + 0.4 * Math.sin(f * 0.2 + k)} />
                        </g>
                      );
                    })
                  : null}
              </g>
            );
          })}
        </g>
        {f >= WALK + 30 ? <Spider x={RADIAL_X[1]} y={spY} s={0.8} frame={f} walk={walk < 1 ? 1 : 0} /> : null}
        <Pill text="ねばねば" x={RADIAL_X[0] + 290} y={SPIRAL_Y[1] - 110} s={pop(f, BEADS + 40, 18)} size={64} frame={f} color="#ffe14d" />
        <Pill text="つるつる" x={RADIAL_X[2] - 10} y={SPIRAL_Y[0] + 140} s={pop(f, WALK + 10, 18)} size={64} frame={f} color="#ffffff" />
        {f > WALK + 10 ? <Arrow x1={RADIAL_X[2] - 40} y1={SPIRAL_Y[0] + 200} x2={RADIAL_X[2] - 10} y2={SPIRAL_Y[0] + 300} color="#ffffff" width={12} /> : null}
        {f > WALK + 90 ? (
          <g transform={`translate(${RADIAL_X[1] + 170} ${spY - 40}) scale(${pop(f, WALK + 90, 14)})`}>
            <circle r={52} fill="#7ed957" stroke={INK} strokeWidth={6} />
            <path d="M -24 0 L -6 18 L 26 -16" stroke="#ffffff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </svg>
      <Caption text="よーく 見ると…" start={LOOK + 5} end={BEADS - 5} position="bottom" size={96} />
      <Caption text="くもは くっつかない" start={WALK + 110} end={S06_DURATION} position="bottom" size={92} color="#ffe14d" />
    </AbsoluteFill>
  );
};
