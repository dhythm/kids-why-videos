import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person, Sparkle } from "../components/Person";
import { ME, TEACHER } from "../components/cast";
import { Caption, Sfx } from "../components/Caption";
import { Room } from "../components/Things";
import { pop } from "../lib/anim";
import { ARIGATOU, chatSign, poseAt, REST, shuwaSign } from "../lib/signs";

export const S01_DURATION = 470;

const LEARN = 30; // ほいくえんで 手話を ならったんだ
const THANKS = 130; // 見て！ これは、ありがとう
const THANKS_SIGN = 150;
const WHY = 290; // なんの ために あるのかな？

const SHUWA = shuwaSign(80);

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  let pose = REST;
  if (f >= LEARN + 10 && f < LEARN + 10 + SHUWA.len) {
    pose = poseAt(SHUWA, f - LEARN - 10);
  } else if (f >= THANKS_SIGN) {
    pose = poseAt(ARIGATOU, f - THANKS_SIGN);
  }
  const teacherPose = poseAt(chatSign(9999, 2), f - 10);
  const lifted = f - THANKS_SIGN - 46;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Room frame={f} />
        <Person
          x={1500}
          y={600}
          s={1.05}
          frame={f}
          pose={f < WHY ? teacherPose : REST}
          mood="smile"
          blinkOffset={40}
          {...TEACHER}
        />
        <Person
          x={860}
          y={650}
          s={1.2}
          frame={f}
          pose={pose}
          mood={f >= WHY ? "think" : f >= THANKS_SIGN + 40 ? "laugh" : "smile"}
          {...ME}
        />
        {lifted >= 0 && lifted < 40
          ? [0, 1, 2, 3].map((i) => (
              <Sparkle
                key={i}
                x={860 + Math.cos(i * 1.7) * 190}
                y={420 + Math.sin(i * 2.3) * 90}
                s={pop(f, THANKS_SIGN + 46 + i * 3, 12) * (1 - lifted / 40)}
              />
            ))
          : null}
        <Sfx text="？" x={1110} y={380} start={WHY + 15} end={S01_DURATION} size={170} color="#ff8fa3" rotate={10} />
      </svg>
      <Caption text="しゅわ" start={LEARN + 10} end={THANKS - 5} position="top" size={130} color="#ffe14d" />
      <Caption text="ありがとう" start={THANKS_SIGN + 20} end={WHY - 5} position="top" size={120} color="#ffe14d" />
      <Caption text="しゅわって なんの ため？" start={WHY + 10} end={S01_DURATION} position="top" size={96} />
    </AbsoluteFill>
  );
};
