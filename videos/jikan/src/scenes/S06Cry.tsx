import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { RoomBg } from "../components/Backgrounds";
import { blockX, ClockChar, Door, TimeBar } from "../components/Jikan";
import { Heart, Pill } from "../components/Things";
import { ip, pop, shake } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S06_DURATION = DURATIONS[5];

const CRY = 20; // ないて いる あいだも とけいは すすむ
const GONE = 185; // さいごの ひとつも なくなった
const HUG = 295; // かなしいね

const BAR = { x: 420, y: 930 };
const lin = (t: number): number => t;

export const S06Cry: React.FC = () => {
  const f = useCurrentFrame();
  const cry = ip(f, [CRY + 10, GONE + 40], [0, 1], lin);
  const calm = f >= HUG + 30;
  const [sx] = calm ? [0] : shake(f, ip(f, [HUG, HUG + 30], [7, 0]));
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <RoomBg frame={f} />
        <Kid
          x={ip(f, [HUG - 10, HUG + 25], [2150, 1010])}
          y={592}
          s={1.2}
          frame={f}
          longHair
          shirt="#ff9aa2"
          pants="#6b6fa8"
          hair="#3d2a20"
          armUp={ip(f, [HUG + 25, HUG + 45], [0, 0.35])}
        />
        <Kid
          x={760 + sx}
          y={640}
          s={0.9}
          frame={f}
          mood={calm ? "sad" : "ouch"}
          armUp={calm ? 0 : 0.5 + 0.4 * Math.sin(f * 0.6)}
        />
        <Heart x={890} y={400} s={0.9 * pop(f, HUG + 45)} />
        <Sfx text="やだやだ！" x={1240} y={430} start={CRY + 5} end={GONE - 10} size={104} color="#7fc8ff" />
        <Sfx text="よしよし" x={1480} y={440} start={HUG + 50} end={S06_DURATION} size={92} color="#ffffff" />
        <Door x={1570} y={900} s={0.6} open={ip(f, [GONE + 45, GONE + 70], [0, 0.7])} />
        <TimeBar x={BAR.x} y={BAR.y} used={5} cry={cry} frame={f} />
        <ClockChar
          x={blockX(5, BAR.x) - 75 + cry * 150}
          y={772}
          s={0.45}
          frame={f}
          angle={f * 5}
          walk={cry < 1 ? 1 : 0}
        />
        <Sfx text="ちくたく" x={blockX(3, BAR.x)} y={790} start={CRY + 20} end={GONE - 10} size={64} color="#ffffff" />
        <Pill text="いく じかん" x={1650} y={765} s={pop(f, GONE + 55)} size={44} color="#fff3a8" frame={f} />
      </svg>
      <Caption text="ないて いても…" start={CRY + 10} end={GONE - 10} position="top" size={104} />
      <Caption text="なくなっちゃった" start={GONE + 20} end={HUG - 10} position="top" size={104} />
      <Caption text="じかんは もどらない" start={HUG + 25} end={S06_DURATION} position="top" size={96} color="#ffe14d" />
    </AbsoluteFill>
  );
};
