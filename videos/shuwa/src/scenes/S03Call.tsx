import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person } from "../components/Person";
import { FRIEND, ME } from "../components/cast";
import { Caption, Sfx } from "../components/Caption";
import { Bubble, BubbleText, Room, SoundWaves } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { REST } from "../lib/signs";

export const S03_DURATION = 390;


const SHOUT = 75; // 「おーい！」の ところ
const NO = 175; // とどかないね
const HOW = 260; // どうしたら おはなし できるかな？

export const S03Call: React.FC = () => {
  const f = useCurrentFrame();
  const shout = f >= SHOUT && f < NO + 20;
  // くちの まえに てを あてて よぶ
  const cup = ip(f, [SHOUT - 10, SHOUT], [0, 1]) * (1 - ip(f, [NO + 10, NO + 25], [0, 1]));
  const pose = {
    ...REST,
    l: { x: -92 + (60 - -92) * cup, y: 125 + (-120 - 125) * cup, rot: 185 + (60 - 185) * cup },
    lShape: cup > 0.5 ? ("flat" as const) : REST.lShape,
  };
  // なみは とちゅうで きえて しまう
  const reach = ip(f, [SHOUT, SHOUT + 40], [0.2, 1.6]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Room frame={f} wall="#eef7e4" floor="#cfe3b0" />
        <Person x={480} y={650} s={1.1} frame={f} pose={pose} mood={f >= HOW ? "think" : shout ? "wow" : "smile"} {...ME} />
        <Person x={1450} y={650} s={1.1} frame={f} back {...FRIEND} />
        {shout ? <SoundWaves x={700} y={430} frame={f} dir={0} reach={reach} scale={1.6} /> : null}
        <Bubble x={560} y={210} w={360} h={140} s={pop(f, SHOUT, 14) * (f < NO + 20 ? 1 : 0)} tail="down">
          <BubbleText text="おーい！" size={80} />
        </Bubble>
        <Sfx text="しーん" x={1450} y={250} start={NO} end={HOW + 30} size={110} color="#c6f0ff" rotate={6} />
        <Sfx text="？" x={700} y={300} start={HOW + 10} end={S03_DURATION} size={170} color="#ff8fa3" rotate={10} />
      </svg>
      <Caption text="とどかない" start={NO + 5} end={HOW - 5} position="bottom" size={100} />
      <Caption text="どうしたら はなせる？" start={HOW + 10} end={S03_DURATION} position="bottom" size={96} />
    </AbsoluteFill>
  );
};
