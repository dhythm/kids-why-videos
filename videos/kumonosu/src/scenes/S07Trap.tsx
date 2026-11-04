import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { Bug, Garden, Moorings, Ripple, Spider, WEB_C } from "../components/Things";
import { SPIRAL, Web } from "../components/Web";
import { ip, pop } from "../lib/anim";

export const S07_DURATION = 680;

const WHAT = 20; // なんのために？
const CATCH = 150; // むしを つかまえる ため
const HIT = 330; // くっつくと ぶるぶる
const FEEL = 490; // あしで かんじて きづく

// むしが くっつく ところ（よこいとの うえ）
const STUCK = SPIRAL[50];
const BX = WEB_C.x + STUCK.x;
const BY = WEB_C.y + STUCK.y;

export const S07Trap: React.FC = () => {
  const f = useCurrentFrame();
  const flyIn = ip(f, [CATCH + 40, HIT], [0, 1], (t) => t);
  const stuck = f >= HIT;
  const bx = stuck ? BX : 2100 + (BX - 2100) * flyIn;
  const by = stuck ? BY : BY - 250 + flyIn * 250 + Math.sin(f * 0.2) * 50 * (1 - flyIn);
  const shake = stuck ? 8 * Math.max(0, 1 - (f - HIT) / 160) + (f < FEEL + 100 ? 3 : 0) : 0;
  const go = ip(f, [FEEL + 60, S07_DURATION - 20], [0, 0.55]);
  // ゆれが いとを つたって くもへ
  const wave = f >= HIT + 20 ? ((f - HIT - 20) % 45) / 45 : -1;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Garden frame={f} />
        <Moorings />
        <Web x={WEB_C.x} y={WEB_C.y} frame={f} beads={1} shake={shake} />
        {wave >= 0 && f < FEEL + 120 ? (
          <circle cx={BX + (WEB_C.x - BX) * wave} cy={BY + (WEB_C.y - BY) * wave} r={22} fill="#ff7b54" opacity={0.85} />
        ) : null}
        <Spider
          x={WEB_C.x + (BX - WEB_C.x) * go}
          y={WEB_C.y + 10 + (BY - WEB_C.y) * go}
          s={0.5}
          rotate={go > 0 ? 60 : 0}
          frame={f}
          walk={go > 0 && go < 0.55 ? 1 : 0}
          mood={f >= FEEL ? "wow" : "smile"}
        />
        {f >= FEEL ? (
          <g transform={`translate(${WEB_C.x - 20} ${WEB_C.y - 150}) scale(${pop(f, FEEL, 14)})`}>
            <text textAnchor="middle" fontSize={130} fontWeight={800} fill="#ff4d6d" stroke="#2b2b4a" strokeWidth={10} paintOrder="stroke">！</text>
          </g>
        ) : null}
        <Bug x={bx} y={by} s={0.9} frame={f} flap={stuck ? 0.3 : 1} wiggle={stuck ? 1 : 0} rotate={stuck ? -20 : 0} />
        {stuck ? <Ripple x={BX} y={BY} frame={f} start={HIT} /> : null}
        <Sfx text="ぶーん" x={1650} y={300} start={CATCH + 50} end={HIT - 5} size={90} color="#ffffff" />
        <Sfx text="ぶるぶる" x={BX + 40} y={BY + 190} start={HIT + 5} end={FEEL + 100} size={100} color="#ff7b54" rotate={6} />
      </svg>
      <Caption text="なんのため？" start={WHAT + 5} end={CATCH - 5} position="top" size={110} />
      <Caption text="むしを つかまえる！" start={CATCH + 5} end={S07_DURATION} position="top" size={100} color="#ffe14d" />
    </AbsoluteFill>
  );
};
