import React from "react";
import {
  partialPath,
  Pt,
  radialEnds,
  spiralPoints,
  toPathD,
} from "../lib/web";

export const SILK = "#ffffff";

/** くものすの わく（まんなか = 0,0）。うえの へんが えだの あいだの はしに そろう */
export const WEB_FRAME: Pt[] = [
  { x: -330, y: -390 },
  { x: 330, y: -390 },
  { x: 450, y: -40 },
  { x: 300, y: 330 },
  { x: -300, y: 330 },
  { x: -450, y: -40 },
];
export const RADII = 18;
export const RADIAL_ENDS = radialEnds(RADII, WEB_FRAME, -Math.PI / 2);
export const SPIRAL = spiralPoints(RADIAL_ENDS, 0.93, 0.16, 10);
const FRAME_LOOP = [...WEB_FRAME, WEB_FRAME[0]];

/** よこいとの とちゅう（0..1）の いち（くもを そこに おく ため） */
export function spiralTip(t: number): Pt {
  const p = partialPath(SPIRAL, t);
  return p[p.length - 1];
}
export function frameTip(t: number): Pt {
  const p = partialPath(FRAME_LOOP, t);
  return p[p.length - 1];
}

/**
 * くものす。各 progress は 0..1。
 * - frameP: わく / radiiP: たていと（1ぽんずつ）/ spiralP: よこいと（そと → うち）
 * - beads: よこいとの ねばねば つぶつぶ / dew: あさつゆ / shake: ぶるぶる
 */
export const Web: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  frameP?: number;
  radiiP?: number;
  spiralP?: number;
  beads?: number;
  dew?: number;
  shake?: number;
  radialColor?: string;
  spiralColor?: string;
  width?: number;
}> = ({
  x,
  y,
  s = 1,
  frame,
  frameP = 1,
  radiiP = 1,
  spiralP = 1,
  beads = 0,
  dew = 0,
  shake = 0,
  radialColor = SILK,
  spiralColor = SILK,
  width = 4,
}) => {
  const dx = Math.sin(frame * 1.7) * shake;
  const dy = Math.cos(frame * 2.3) * shake * 0.7;
  const shown = Math.floor(radiiP * RADII + 1e-6);
  const growing = radiiP * RADII - shown;
  const spiral = spiralP > 0 ? partialPath(SPIRAL, spiralP) : [];
  return (
    <g transform={`translate(${x + dx} ${y + dy}) scale(${s})`}>
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 3px rgba(60,60,130,0.55))" }}
      >
        {frameP > 0 ? (
          <path
            d={toPathD(partialPath(FRAME_LOOP, frameP))}
            stroke={SILK}
            strokeWidth={width * 1.4}
          />
        ) : null}
        {RADIAL_ENDS.map((e, i) => {
          const k = i < shown ? 1 : i === shown ? growing : 0;
          if (k <= 0) {
            return null;
          }
          return (
            <path
              key={i}
              d={`M 0 0 L ${e.x * k} ${e.y * k}`}
              stroke={radialColor}
              strokeWidth={width}
            />
          );
        })}
        {spiral.length > 1 ? (
          <path d={toPathD(spiral)} stroke={spiralColor} strokeWidth={width * 0.8} />
        ) : null}
      </g>
      {/* まんなかの こしき */}
      {radiiP > 0 ? <circle r={14} fill={SILK} opacity={0.9} /> : null}
      {beads > 0
        ? spiral
            .filter((_, i) => i % 2 === 1)
            .map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={5 * beads}
                fill="#fff3a6"
                stroke="#e3b84a"
                strokeWidth={1.5}
              />
            ))
        : null}
      {dew > 0
        ? SPIRAL.filter((_, i) => i % 7 === 0).map((p, i) => {
            const tw = 0.6 + 0.4 * Math.sin(frame * 0.15 + i * 1.3);
            return (
              <g key={i} transform={`translate(${p.x} ${p.y})`} opacity={dew}>
                <circle r={9} fill="#d8f3ff" stroke="#9fd8f5" strokeWidth={2} />
                <circle cx={-3} cy={-3} r={3} fill="#ffffff" opacity={tw} />
              </g>
            );
          })
        : null}
    </g>
  );
};
