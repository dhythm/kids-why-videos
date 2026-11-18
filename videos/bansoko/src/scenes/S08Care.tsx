import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Bell, Hand, IcePack } from "../components/Bansoko";
import { Kid } from "../components/Kid";
import { Heart } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S08_DURATION = DURATIONS[7];

const ASK = 20; // けがが ないのに いたい
const CARE = 150; // ひやす・なでなで
const SMALL = 310; // いたいのを ちいさく かんじる
const HUG = 440; // ぎゅー

const KID = { x: 640, y: 760 };
const KID_S = 1.45;
const HEAD = { x: KID.x + 64, y: KID.y - 273 };

export const S08Care: React.FC = () => {
  const f = useCurrentFrame();
  const ice = ip(f, [CARE + 5, CARE + 30], [0, 1]) * ip(f, [CARE + 75, CARE + 95], [1, 0]);
  const stroke = ip(f, [CARE + 90, CARE + 110], [0, 1]) * ip(f, [HUG - 10, HUG + 5], [1, 0]);
  const pain = ip(f, [SMALL + 10, SMALL + 110], [1, 0.15]);
  const hug = ip(f, [HUG, HUG + 20], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#fff0e6" dot="#ffe2d0" />
        {/* おとな（ぎゅー） */}
        <Kid
          x={KID.x + 600 - hug * 350}
          y={KID.y - 48}
          s={1.75 * (f >= HUG - 30 ? 1 : 0)}
          frame={f}
          armUp={0.15 + hug * 0.25}
          shirt="#ff9f6b"
          pants="#6b7fd6"
          hair="#3d2a20"
          longHair
        />
        <Kid
          x={KID.x}
          y={KID.y}
          s={KID_S}
          frame={f}
          mood={f < CARE + 30 ? "ouch" : f < SMALL ? "wow" : "smile"}
          bump={ip(f, [ASK, ASK + 10], [0, 1]) * (0.35 + 0.65 * pain)}
          armUp={hug * 0.3}
        />
        <Sfx text="ごつん" x={1150} y={420} start={ASK} end={ASK + 70} size={110} color="#ffffff" />
        <Sfx text="？" x={1300} y={620} start={ASK + 75} end={CARE - 5} size={220} color="#ff8fa3" />
        <IcePack
          x={HEAD.x + 40 + (1 - ice) * 700}
          y={HEAD.y - 30 - (1 - ice) * 60}
          s={ice > 0 ? 1.3 : 0}
          rot={14}
        />
        <Hand
          x={HEAD.x - 110 + Math.sin(f * 0.22) * 55 - (1 - stroke) * 600}
          y={HEAD.y - 150 - (1 - stroke) * 300}
          s={stroke > 0 ? 1.25 : 0}
          rot={-58 + Math.sin(f * 0.22) * 5}
        />
        <Sfx text="ひんやり" x={1380} y={480} start={CARE + 30} end={CARE + 90} size={100} color="#bfe6ff" />
        <Sfx text="なでなで" x={1380} y={480} start={CARE + 112} end={SMALL} size={100} />
        {/* いたみの ベルが ちいさく なる */}
        <Bell
          x={1420}
          y={640}
          s={(0.5 + 1.2 * pain) * pop(f, SMALL + 5) * (1 - hug)}
          ring={pain}
          frame={f}
        />
        {f > HUG + 15
          ? [0, 1, 2, 3].map((i) => (
              <Heart
                key={i}
                x={800 + Math.cos(i * 1.4 + 3.4) * 520}
                y={560 + Math.sin(i * 1.4 + 3.4) * 190 - ((f - HUG) % 60) * 0.5}
                s={pop(f, HUG + 15 + i * 6, 12) * (0.9 + 0.15 * Math.sin(f * 0.3 + i))}
              />
            ))
          : null}
      </svg>
      <Caption text="けがは ないけど いたい" start={ASK + 5} end={CARE - 15} position="top" size={84} />
      <Caption text="ひやす・なでなで" start={CARE + 15} end={SMALL - 15} position="top" size={100} color="#ffe14d" />
      <Caption text="いたいのが ちいさく" start={SMALL + 15} end={HUG - 10} position="top" size={92} />
      <Caption text="ぎゅー！" start={HUG + 10} end={S08_DURATION} position="top" size={130} color="#ffe14d" />
    </AbsoluteFill>
  );
};
