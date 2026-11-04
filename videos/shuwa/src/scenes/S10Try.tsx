import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person, Sparkle } from "../components/Person";
import { ME } from "../components/cast";
import { Caption } from "../components/Caption";
import { Pill } from "../components/Things";
import { pop } from "../lib/anim";
import { ARIGATOU, KONNICHIWA, poseAt, REST } from "../lib/signs";

export const S10_DURATION = 380;

const LETS = 20; // いっしょに やってみよう
const HELLO = 85; // こんにちは
const THANKS = 225; // ありがとう

export const S10Try: React.FC = () => {
  const f = useCurrentFrame();
  let pose = REST;
  if (f >= HELLO && f < HELLO + KONNICHIWA.len) {
    pose = poseAt(KONNICHIWA, f - HELLO);
  } else if (f >= THANKS) {
    pose = poseAt(ARIGATOU, f - THANKS);
  }
  const done = f - THANKS - 50;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fff6dc" />
        {new Array(24).fill(0).map((_, i) => (
          <circle key={i} cx={(i % 6) * 360 + (Math.floor(i / 6) % 2) * 180} cy={Math.floor(i / 6) * 300 + 90} r={20} fill="#ffe7a8" />
        ))}
        <Person x={960} y={740} s={1.55} frame={f} pose={pose} mood={done > 0 ? "laugh" : "smile"} {...ME} />
        <Pill text="いっしょに！" x={1560} y={560} s={pop(f, LETS + 5, 18)} frame={f} color="#ffe14d" size={70} />
        {/* ひる → あいさつ の ヒント */}
        <Pill text="① おでこ" x={380} y={430} s={pop(f, HELLO + 5, 14) * (f < HELLO + 50 ? 1 : 0)} frame={f} color="#c6f0ff" size={56} />
        <Pill text="② おじぎ" x={380} y={430} s={pop(f, HELLO + 52, 14) * (f < HELLO + KONNICHIWA.len ? 1 : 0)} frame={f} color="#c6f0ff" size={56} />
        {done >= 0 && done < 50
          ? [0, 1, 2, 3, 4].map((i) => (
              <Sparkle key={i} x={960 + Math.cos(i * 1.3) * 330} y={420 + Math.sin(i * 2.1) * 140} s={pop(f, THANKS + 50 + i * 3, 12) * (1 - done / 50)} />
            ))
          : null}
      </svg>
      <Caption text="こんにちは" start={HELLO + 5} end={HELLO + KONNICHIWA.len} position="top" size={120} color="#ffe14d" />
      <Caption text="ありがとう" start={THANKS + 5} end={S10_DURATION} position="top" size={120} color="#ffe14d" />
    </AbsoluteFill>
  );
};
