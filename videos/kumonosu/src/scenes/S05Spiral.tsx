import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { Clock, Garden, Moorings, Pill, Spider, WEB_C } from "../components/Things";
import { spiralTip, Web } from "../components/Web";
import { ip, pop } from "../lib/anim";

export const S05_DURATION = 620;

const SPIRAL_T = 20; // ぐるぐるの よこいと
const ROUND = 160; // そとから まんなかへ
const DONE = 420; // できあがり！ 1じかん

export const S05Spiral: React.FC = () => {
  const f = useCurrentFrame();
  const spiralP = ip(f, [SPIRAL_T + 60, DONE - 20], [0, 1], (t) => t);
  const tip = spiralP > 0 ? spiralTip(spiralP) : { x: 0, y: -360 };
  const done = f >= DONE;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Garden frame={f} />
        <Moorings />
        <Web x={WEB_C.x} y={WEB_C.y} frame={f} spiralP={spiralP} spiralColor={done ? "#ffffff" : "#ffe9a0"} width={5} />
        <Spider
          x={WEB_C.x + (done ? 0 : tip.x)}
          y={WEB_C.y + (done ? 10 : tip.y)}
          s={done ? 0.5 : 0.42}
          frame={f}
          walk={done ? 0 : 1}
          mood={done ? "wow" : "smile"}
        />
        <Sfx text="ぐるぐる" x={1560} y={460} start={ROUND} end={DONE - 5} size={110} color="#ffe14d" rotate={8} />
        {done && f < DONE + 70
          ? [0, 1, 2, 3, 4, 5].map((i) => (
              <Sparkle key={i} x={WEB_C.x + Math.cos(i * 1.05) * 380} y={WEB_C.y + Math.sin(i * 1.05) * 330} s={pop(f, DONE + i * 4, 12) * ip(f, [DONE + 50, DONE + 70], [1.4, 0])} />
            ))
          : null}
        <Clock x={1650} y={780} s={pop(f, DONE + 50, 18)} frame={f} />
        <Pill text="1じかん くらい" x={1650} y={610} s={pop(f, DONE + 60, 18)} size={48} frame={f} color="#ffffff" />
      </svg>
      <Caption text="よこいと" start={SPIRAL_T + 5} end={ROUND - 5} position="bottom" size={110} color="#ffe14d" />
      <Caption text="そとから まんなかへ" start={ROUND + 5} end={DONE - 5} position="bottom" size={90} />
      <Caption text="できあがり！" start={DONE + 5} end={S05_DURATION} position="top" size={120} color="#ffe14d" />
    </AbsoluteFill>
  );
};
