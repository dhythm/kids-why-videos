import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { ZoomBg } from "../components/Backgrounds";
import { Leader, Pill } from "../components/Things";
import { Chain, Lens, StickyThread } from "../components/Natto";
import { beadChain } from "../lib/strings";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S06_DURATION = DURATIONS[5];

const ZOOM = 20; // もっと おおきく
const CHAIN = 140; // てを つないだ くさり
const TANGLE = 340; // からまって のびる

const TANGLED = [
  { y: 430, phase: 0, color: "#ffb86b" },
  { y: 520, phase: 2.2, color: "#ffc98f" },
  { y: 610, phase: 4.1, color: "#ffa95a" },
  { y: 700, phase: 1.1, color: "#ffd2a0" },
];

export const S06Chain: React.FC = () => {
  const f = useCurrentFrame();
  const lensR = ip(f, [ZOOM + 15, ZOOM + 80], [0, 470]);
  const toChain = ip(f, [CHAIN - 10, CHAIN + 10], [0, 1]);
  const toTangle = ip(f, [TANGLE - 10, TANGLE + 10], [0, 1]);
  const pull = ip(f, [TANGLE + 60, TANGLE + 150], [0, 1]);
  const one = beadChain(9, { x: 360, y: 560 }, 150, 50, f * 0.06);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <ZoomBg frame={f} color="#fff8ec" />
        {/* いとを むしめがねで のぞく */}
        <g opacity={1 - toChain}>
          <StickyThread a={{ x: 0, y: 420 }} b={{ x: 1920, y: 480 }} length={2100} base={30} />
          <Lens x={960} y={540} r={lensR} id="lens6" bg="#fff8ec">
            <Chain points={beadChain(9, { x: 360, y: 560 }, 150, 50, f * 0.06)} r={44} frame={f} show={ip(f, [ZOOM + 50, CHAIN], [0, 1])} />
          </Lens>
        </g>
        {/* ひとつの くさり */}
        <g opacity={toChain * (1 - toTangle)}>
          <Chain points={one} r={50} frame={f} show={ip(f, [CHAIN, CHAIN + 60], [0.3, 1])} />
          <Leader x1={one[4].x} y1={one[4].y + 60} x2={one[4].x} y2={790} p={ip(f, [CHAIN + 70, CHAIN + 90], [0, 1])} />
          <Pill text="うまみの もと" x={one[4].x} y={850} s={pop(f, CHAIN + 85)} size={64} color="#ffe0a8" frame={f} />
          <Sfx text="てを つないで" x={1500} y={330} start={CHAIN + 100} end={TANGLE - 10} size={70} color="#ffffff" />
        </g>
        {/* からまった くさりを ひっぱると のびる */}
        <g opacity={toTangle}>
          {TANGLED.map((c, i) => {
            const spacing = 95 + pull * 55;
            const wave = 90 * (1 - pull) + 12;
            const count = 14;
            const startX = 960 - ((count - 1) * spacing) / 2 + Math.sin(i * 1.7) * 60 * (1 - pull);
            const y = 560 + (c.y - 560) * (0.35 + pull * 0.65);
            return (
              <Chain
                key={i}
                points={beadChain(count, { x: startX, y }, spacing, wave, c.phase + f * 0.05)}
                r={30}
                frame={f}
                faces={false}
                color={c.color}
              />
            );
          })}
          <Sfx text="びよーん" x={1600} y={900} start={TANGLE + 70} end={S06_DURATION} size={96} />
        </g>
      </svg>
      <Caption text="もっと おおきく" start={ZOOM + 5} end={CHAIN - 5} position="top" size={96} />
      <Caption text="ながーい くさり" start={CHAIN + 10} end={TANGLE - 5} position="top" size={100} color="#ffe14d" />
      <Caption text="からまって のびる" start={TANGLE + 10} end={S06_DURATION} position="top" size={100} />
    </AbsoluteFill>
  );
};
