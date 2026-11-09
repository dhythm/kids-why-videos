import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Pill } from "../components/Things";
import { KinCrowd, Lens, NattoKin, Soybean, Wara } from "../components/Natto";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S03_DURATION = DURATIONS[2];

const ZOOM = 20; // ぐーんと おおきく
const FOUND = 150; // なっとうきん だよ
const WARA = 340; // いねの わら

export const S03Kin: React.FC = () => {
  const f = useCurrentFrame();
  const lensR = ip(f, [ZOOM + 20, ZOOM + 90], [0, 430]);
  const toWara = ip(f, [WARA - 12, WARA + 8], [0, 1]);
  const hero = pop(f, FOUND, 22);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toWara}>
          <DotsBg color="#fff1d6" dot="#ffe3b0" />
          <Soybean x={960} y={560} s={(3 + ip(f, [ZOOM, ZOOM + 60], [0, 2])) * pop(f, 0, 14)} natto={1} film={0.4} />
          <Lens x={960} y={540} r={lensR} id="lens3" bg="#d9a464">
            {/* まめの ひょうめん */}
            {new Array(9).fill(0).map((_, i) => (
              <ellipse
                key={i}
                cx={(i % 3) * 360 + 600}
                cy={Math.floor(i / 3) * 300 + 250}
                rx={120}
                ry={50}
                fill="#c98a45"
                opacity={0.5}
              />
            ))}
            <KinCrowd frame={f} count={14} seed="k3" area={[560, 160, 800, 760]} s={0.42} show={ip(f, [ZOOM + 70, FOUND], [0, 1])} />
            <NattoKin x={960} y={560} s={1.4 * hero} frame={f} mood={f < FOUND + 30 ? "wow" : "smile"} rot={Math.sin(f * 0.06) * 6} />
          </Lens>
          <Pill text="なっとうきん" x={960} y={1010} s={pop(f, FOUND + 30)} size={64} color="#c9f7e4" frame={f} />
          <Sfx text="いたいた！" x={1560} y={260} start={FOUND} end={WARA - 10} size={100} />
        </g>
        <g opacity={toWara}>
          <DotsBg color="#fff8e0" dot="#ffefb8" />
          <Wara x={960} y={600} s={1.3 * pop(f, WARA, 22)} open={ip(f, [WARA + 70, WARA + 110], [0, 1])} />
          {[0, 1, 2, 3, 4].map((i) => (
            <NattoKin
              key={i}
              x={600 + i * 180}
              y={420 + (i % 2) * 330 + Math.sin(f * 0.08 + i) * 10}
              s={0.42 * pop(f, WARA + 30 + i * 6)}
              frame={f + i * 11}
              rot={i * 30 - 50}
            />
          ))}
          <Pill text="いねの わら" x={960} y={950} s={pop(f, WARA + 40)} size={64} color="#fff3a8" frame={f} />
        </g>
      </svg>
      <Caption text="ぐーんと おおきく" start={ZOOM + 5} end={FOUND - 5} position="top" size={96} />
      <Caption text="むかしは わらで" start={WARA + 20} end={S03_DURATION} position="top" size={100} />
    </AbsoluteFill>
  );
};
