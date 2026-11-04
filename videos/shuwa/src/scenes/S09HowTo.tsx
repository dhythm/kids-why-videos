import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person } from "../components/Person";
import { FRIEND, ME } from "../components/cast";
import { Sfx } from "../components/Caption";
import { Notepad, Pill, Room } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { chatSign, poseAt, REST, waveSign, type Pose } from "../lib/signs";

export const S09_DURATION = 450;

const TAP = 20; // かたを とんとん
const TAP_AT = 75;
const TURN = 130; // ふりむく
const WAVE_AT = 135; // 手を ふって
const TIPS = 225; // かおを 見て、くちを はっきり。みぶりや 字を かいても

const FRIEND_X = 1250;
const S = 1.05;
const WAVE = waveSign(90);

export const S09HowTo: React.FC = () => {
  const f = useCurrentFrame();
  const meX = ip(f, [TAP, TAP + 50], [420, 960]);
  // ともだちの かた（うしろむき・がめん ひだりがわ）に みぎての てを のせる
  let mePose: Pose = REST;
  if (f >= TAP + 45 && f < TURN) {
    const reach = ip(f, [TAP + 50, TAP_AT], [0, 1]) * (1 - ip(f, [TURN - 12, TURN], [0, 1]));
    const tap = Math.max(0, Math.sin((f - TAP_AT) * 0.5)) * 18 * (f > TAP_AT ? 1 : 0);
    // ともだちの かた（がめん ひだりがわ）を、じぶんの からだの きじゅんに なおす（S で わる）
    const target = { x: (FRIEND_X - 60 * S - meX) / S, y: -55 - tap, rot: 70 };
    mePose = {
      ...REST,
      r: {
        x: REST.r.x + (target.x - REST.r.x) * reach,
        y: REST.r.y + (target.y - REST.r.y) * reach,
        rot: REST.r.rot + (target.rot - REST.r.rot) * reach,
      },
    };
  } else if (f >= WAVE_AT && f < WAVE_AT + WAVE.len) {
    mePose = poseAt(WAVE, f - WAVE_AT);
  } else if (f >= TIPS + 70) {
    mePose = poseAt(chatSign(9999, 1), f - TIPS - 70);
  }
  const turned = f >= TURN;
  const friendPose = f >= TIPS + 90 ? poseAt(chatSign(9999, 5), f - TIPS - 90) : REST;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Room frame={f} wall="#fdeef4" floor="#e9c9b0" />
        <Person x={meX} y={650} s={S} frame={f} pose={mePose} mood={f >= TIPS ? "wow" : "smile"} {...ME} />
        <Person x={FRIEND_X} y={650} s={S} frame={f} back={!turned} pose={friendPose} mood="laugh" blinkOffset={15} {...FRIEND} />
        <Sfx text="とんとん" x={FRIEND_X - 40} y={300} start={TAP_AT} end={TURN + 10} size={100} color="#ffe14d" rotate={-6} />
        <Sfx text="！" x={FRIEND_X + 130} y={330} start={TURN} end={TURN + 60} size={150} color="#ff8fa3" rotate={10} />
        <Pill text="かおを みて" x={380} y={190} s={pop(f, TIPS + 5, 16)} frame={f} color="#ffe14d" size={60} />
        <Pill text="くちを はっきり" x={960} y={190} s={pop(f, TIPS + 40, 16)} frame={f} color="#c6f0ff" size={60} />
        <Pill text="みぶり" x={1530} y={190} s={pop(f, TIPS + 75, 16)} frame={f} color="#ffd6e0" size={60} />
        <Notepad x={1630} y={560} s={pop(f, TIPS + 110, 18)} text="こんにちは" />
      </svg>
    </AbsoluteFill>
  );
};
