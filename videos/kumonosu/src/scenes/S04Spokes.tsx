import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { Garden, Moorings, Pill, Spider, WEB_C, Wheel } from "../components/Things";
import { frameTip, RADIAL_ENDS, RADII, Web } from "../components/Web";
import { ip, pop } from "../lib/anim";

export const S04_DURATION = 580;

const FRAME = 20; // まわりの わく
const SPOKE = 170; // まんなかから そとへ
const NAME = 430; // たていと

export const S04Spokes: React.FC = () => {
  const f = useCurrentFrame();
  const frameP = ip(f, [FRAME + 10, SPOKE - 10], [0, 1]);
  const radiiP = ip(f, [SPOKE + 20, NAME - 10], [0, 1], (t) => t);
  // くもの いち: わくを まわる → たていとの さきを いったり きたり
  let sp = { x: 0, y: 0 };
  if (f < SPOKE) {
    sp = frameTip(frameP);
  } else {
    const n = radiiP * RADII;
    const i = Math.min(RADII - 1, Math.floor(n));
    const k = n - i;
    const e = RADIAL_ENDS[i];
    // まんなか → そと（のばしながら すすむ）
    sp = { x: e.x * k, y: e.y * k };
  }
  const glow = f >= NAME ? 0.5 + 0.5 * Math.sin((f - NAME) * 0.2) : 0;
  const radialColor = glow > 0 ? `rgb(255, ${Math.round(255 - glow * 60)}, ${Math.round(255 - glow * 200)})` : "#ffffff";
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Garden frame={f} />
        <Moorings p={ip(f, [FRAME, FRAME + 30], [0.4, 1])} />
        <Web x={WEB_C.x} y={WEB_C.y} frame={f} frameP={frameP} radiiP={radiiP} spiralP={0} radialColor={radialColor} width={5} />
        <Spider x={WEB_C.x + sp.x} y={WEB_C.y + sp.y} s={0.42} frame={f} walk={f < NAME ? 1 : 0} />
        <Wheel x={1590} y={800} r={130 * pop(f, SPOKE + 60, 18)} frame={f} />
        <Pill text="タイヤ みたい" x={1590} y={610} s={pop(f, SPOKE + 70, 18) * ip(f, [NAME - 20, NAME], [1, 0])} size={48} frame={f} color="#ffffff" />
        <Pill text="たていと" x={WEB_C.x} y={WEB_C.y + 420} s={pop(f, NAME + 10, 18)} size={72} frame={f} color="#ffe14d" />
      </svg>
      <Caption text="まわりの わく" start={FRAME + 5} end={SPOKE - 5} position="bottom" size={96} color="#ffe14d" />
    </AbsoluteFill>
  );
};
