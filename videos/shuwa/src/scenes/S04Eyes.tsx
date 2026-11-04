import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person, Sparkle } from "../components/Person";
import { FRIEND, ME } from "../components/cast";
import { Caption } from "../components/Caption";
import { Bulb, Eye, Pill, Room } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { chatSign, poseAt, REST, waveSign } from "../lib/signs";

export const S04_DURATION = 380;

const IDEA = 20; // そうだ！ 目で 見える ことばなら
const SHUWA = 160; // 手と、かおで はなす ことば。それが 手話
const NAME = 240; // 「手話なんだ」

const WAVE = waveSign(80);
const CHAT_ME = chatSign(S04_DURATION, 0);
const CHAT_FRIEND = chatSign(S04_DURATION, 3);

export const S04Eyes: React.FC = () => {
  const f = useCurrentFrame();
  const turned = f >= IDEA + 70;
  const mePose = f < IDEA + 50 ? REST : f < SHUWA ? poseAt(WAVE, f - IDEA - 50) : poseAt(CHAT_ME, f - SHUWA);
  const friendPose = f < SHUWA + 30 ? REST : poseAt(CHAT_FRIEND, f - SHUWA - 30);
  const eye = pop(f, IDEA + 80, 18) * (1 - ip(f, [SHUWA - 10, SHUWA], [0, 1]));
  // しせん（ともだちの め → わたしの て）
  const sight = ip(f, [IDEA + 90, IDEA + 115], [0, 1]) * (1 - ip(f, [SHUWA - 10, SHUWA], [0, 1]));
  const name = pop(f, NAME, 20);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Room frame={f} wall="#eef7e4" floor="#cfe3b0" />
        <Bulb x={560} y={170} s={pop(f, IDEA + 5, 16) * (1 - ip(f, [IDEA + 90, IDEA + 100], [0, 1]))} frame={f} />
        <Person x={640} y={650} s={1.1} frame={f} pose={mePose} mood={f >= IDEA ? "laugh" : "think"} {...ME} />
        <Person x={1320} y={650} s={1.1} frame={f} pose={friendPose} back={!turned} mood={f >= SHUWA ? "laugh" : "wow"} blinkOffset={20} {...FRIEND} />
        {sight > 0 ? (
          <path
            d={`M 1300 ${650 - 175 * 1.1} Q 1000 250 ${640 + 160} ${650 - 150 * 1.1}`}
            stroke="#ff5d8f"
            strokeWidth={10}
            strokeDasharray="4 22"
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDashoffset={0}
            opacity={sight}
          />
        ) : null}
        {eye > 0 ? <Eye x={1000} y={220} s={eye * 0.9} frame={f} /> : null}
        <Pill text="て" x={420} y={470} s={pop(f, SHUWA + 10, 16) * (1 - ip(f, [NAME - 8, NAME], [0, 1]))} frame={f} color="#ffe14d" size={70} />
        <Pill text="かお" x={860} y={250} s={pop(f, SHUWA + 40, 16) * (1 - ip(f, [NAME - 8, NAME], [0, 1]))} frame={f} color="#ffe14d" size={70} />
        {name > 0
          ? [0, 1, 2, 3, 4].map((i) => (
              <Sparkle key={i} x={960 + Math.cos(i * 1.3) * 420} y={190 + Math.sin(i * 2.1) * 90} s={name * (0.6 + 0.4 * Math.sin(f * 0.2 + i))} />
            ))
          : null}
      </svg>
      <Caption text="めで みる ことば" start={IDEA + 20} end={SHUWA - 5} position="bottom" size={100} />
      <Caption text="しゅわ" start={NAME} end={S04_DURATION} position="top" size={150} color="#ffe14d" />
    </AbsoluteFill>
  );
};
