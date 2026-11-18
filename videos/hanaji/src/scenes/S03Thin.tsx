import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { NoseWall, SideHead, SKIN } from "../components/Hanaji";
import { Arrow, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S03_DURATION = DURATIONS[2];

const MANY = 20; // いりぐちの ちかくは ちの みちが いっぱい
const THIN = 160; // かべが うすい
const TEAR = 310; // やぶれて ちが でる

export const S03Thin: React.FC = () => {
  const f = useCurrentFrame();
  const locator = ip(f, [THIN - 15, THIN], [1, 0]);
  const ring = 1 + Math.sin(f * 0.25) * 0.15;
  const tear = ip(f, [TEAR + 30, TEAR + 45], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#fff0f0" dot="#ffe0e0" />
        <NoseWall id="s03wall" x={1210} y={660} w={1060} h={560} s={pop(f, MANY, 20)} frame={f} tear={tear} />
        {/* ばしょ: はなの いりぐちの ちかく */}
        <g opacity={locator}>
          <SideHead x={360} y={560} s={0.62} frame={f} inside={1} />
          <circle cx={360 - 250 * 0.62} cy={560 + 20 * 0.62} r={52 * ring} fill="none" stroke="#e5484d" strokeWidth={12} />
          <Pill text="ここ！" x={170} y={380} s={pop(f, MANY + 40)} size={60} color="#ffe14d" frame={f} />
        </g>
        {/* くらべる: ひふは あつい */}
        <g opacity={1 - locator}>
          <NoseWall id="s03skin" x={340} y={600} w={440} h={360} s={pop(f, THIN + 10)} frame={f} thick={96} wallColor={SKIN} />
          <Pill text="ひふ：あつい" x={340} y={860} s={pop(f, THIN + 30)} size={50} color="#ffe6cf" frame={f} />
        </g>
        <Arrow x1={1560} y1={400} x2={1560} y2={400 + 150 * pop(f, THIN + 60)} color="#e5484d" width={20} />
        <Pill text="はな：うすい" x={1210} y={990} s={pop(f, THIN + 70)} size={56} color="#ffd0e0" frame={f} />
        <Sfx text="ぷちっ" x={1210} y={400} start={TEAR + 30} end={TEAR + 110} size={120} color="#ffffff" />
      </svg>
      <Caption text="ちの みちが いっぱい" start={MANY + 20} end={THIN - 12} position="top" size={96} />
      <Caption text="うすい かべ" start={THIN + 20} end={TEAR - 12} position="top" size={110} color="#ffc4d4" />
      <Caption text="これが はなぢ" start={TEAR + 115} end={S03_DURATION} position="top" size={110} color="#ffe14d" />
    </AbsoluteFill>
  );
};
