import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { BRANCH_L, BRANCH_R, Garden, Spider } from "../components/Things";
import { ip } from "../lib/anim";

export const S03_DURATION = 540;

const FIRST = 20; // さいしょの 1ぽん
const BLOW = 120; // かぜに のせて ふわーっ
const STICK = 330; // くっついたら はしの できあがり
const CROSS = 400; // くもが わたる

export const S03Bridge: React.FC = () => {
  const f = useCurrentFrame();
  const fly = ip(f, [BLOW + 20, STICK - 10], [0, 1]);
  const tight = ip(f, [STICK - 10, STICK + 20], [0, 1]);
  // いとの さき: かぜで ふわふわ しながら みぎへ
  const tipX = BRANCH_L.x + 60 + fly * (BRANCH_R.x - BRANCH_L.x - 60);
  const tipY = BRANCH_L.y - 30 + Math.sin(f * 0.07) * 60 * (1 - tight) - Math.sin(fly * Math.PI) * 80 * (1 - tight);
  const endY = tipY + (BRANCH_R.y - tipY) * tight;
  const sag = 90 * (1 - tight) + 6;
  const midX = (BRANCH_L.x + tipX) / 2;
  const midY = (BRANCH_L.y + endY) / 2 + sag;
  const cross = ip(f, [CROSS, S03_DURATION - 20], [0, 1]);
  const spX = BRANCH_L.x + cross * (BRANCH_R.x - BRANCH_L.x - 120);
  const spY = BRANCH_L.y + 8 + Math.sin(cross * Math.PI) * 6;
  const windOn = f > BLOW && f < STICK;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Garden frame={f} />
        {windOn
          ? [0, 1, 2, 3].map((i) => {
              const x = ((f * 9 + i * 520) % 2200) - 200;
              return (
                <path
                  key={i}
                  d={`M ${x} ${330 + i * 120} q 60 -40 120 0 t 120 0`}
                  stroke="#ffffff"
                  strokeWidth={10}
                  strokeLinecap="round"
                  fill="none"
                  opacity={0.8}
                />
              );
            })
          : null}
        {fly > 0 ? (
          <path
            d={`M ${BRANCH_L.x} ${BRANCH_L.y} Q ${midX} ${midY} ${tipX} ${endY}`}
            stroke="#ffffff"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 3px rgba(80,80,140,0.5))" }}
          />
        ) : null}
        {/* くもは えだの うえ → いとに ぶらさがって わたる */}
        <Spider
          x={cross > 0 ? spX : BRANCH_L.x - 40}
          y={cross > 0 ? spY + 60 : BRANCH_L.y - 70}
          s={0.5}
          rotate={cross > 0 ? 90 : 0}
          frame={f}
          walk={cross > 0 && cross < 1 ? 1 : 0}
          mood={f >= STICK && f < CROSS ? "wow" : "smile"}
        />
        <Sfx text="ふわー" x={900} y={480} start={BLOW + 30} end={STICK - 5} size={110} color="#ffffff" />
        <Sfx text="ぴたっ！" x={BRANCH_R.x - 60} y={BRANCH_R.y + 160} start={STICK} end={CROSS + 40} size={100} color="#ffe14d" />
        {f >= STICK
          ? [0, 1, 2].map((i) => (
              <circle key={i} cx={BRANCH_R.x} cy={BRANCH_R.y} r={30 + ((f - STICK) * 2 + i * 25) % 90} fill="none" stroke="#ffe14d" strokeWidth={6} opacity={Math.max(0, 1 - (f - STICK) / 60)} />
            ))
          : null}
      </svg>
      <Caption text="さいしょの 1ぽん" start={FIRST + 5} end={BLOW + 120} position="bottom" size={100} color="#ffe14d" />
      <Caption text="いとの はし！" start={STICK + 20} end={S03_DURATION} position="bottom" size={110} />
    </AbsoluteFill>
  );
};
