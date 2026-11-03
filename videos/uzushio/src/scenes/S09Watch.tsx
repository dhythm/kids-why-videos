import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid } from "../components/Kid";
import { Cloud } from "../components/Characters";
import { Caption } from "../components/Caption";
import {
  BigX,
  Boat,
  Bridge,
  Pill,
  SEA,
  Ukiwa,
  WaveLine,
  Whirl,
} from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S09_DURATION = 420;

const SEE = 20; // ふねや はしから 見られる
const DANGER = 170; // およぐのは あぶない
const TOGETHER = 270; // おうちの ひとと いっしょに

const DECK = 430;

export const S09Watch: React.FC = () => {
  const f = useCurrentFrame();
  const boatX = ip(f, [0, S09_DURATION], [1750, 250], (t) => t);
  const kidS = 0.5;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#bfe9ff" />
        <Cloud x={1600 - f * 0.3} y={130} s={0.7} />
        <rect y={600} width={1920} height={480} fill={SEA} />
        <WaveLine y={640} frame={f} />
        <Whirl x={700} y={850} r={190} frame={f} squash={0.42} />
        <Whirl x={1350} y={930} r={140} frame={f} squash={0.42} dir={-1} />
        <Bridge y={DECK} />
        <Kid x={1720} y={DECK - 175 * kidS} s={kidS} frame={f} mood="wow" />
        <Boat x={boatX} y={760} s={0.85} frame={f} />
        <Pill
          text="はし"
          x={1150}
          y={DECK + 140}
          s={pop(f, SEE + 40, 16)}
          frame={f}
        />
        <Pill
          text="ふね"
          x={boatX}
          y={540}
          s={pop(f, SEE + 60, 16)}
          frame={f}
        />
        <g opacity={pop(f, DANGER, 16)}>
          <Ukiwa x={1350} y={880} s={0.8} rot={f * 3} />
          <BigX
            x={1350}
            y={880}
            s={0.9}
            p={ip(f, [DANGER + 30, DANGER + 60], [0, 1])}
          />
        </g>
      </svg>
      <Caption
        text="あぶない！"
        start={DANGER + 40}
        end={TOGETHER - 5}
        position="top"
        size={120}
        color="#ff8fa3"
      />
      <Caption
        text="おうちの ひとと いっしょに"
        start={TOGETHER + 5}
        end={S09_DURATION}
        position="top"
        size={84}
      />
    </AbsoluteFill>
  );
};
