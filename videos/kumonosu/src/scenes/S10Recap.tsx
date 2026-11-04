import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, FONT } from "../components/Caption";
import { Arrow, Bug, Garden, INK, Moorings, Spider, WEB_C } from "../components/Things";
import { Web } from "../components/Web";
import { ip, pop } from "../lib/anim";

export const S10_DURATION = 600;

const RECAP = 20; // おさらい
const ONE = 80; // いとを とばして はし
const TWO = 200; // たていと → よこいと
const THREE = 370; // むしを つかまえる わな
const BYE = 510; // またね

const PANEL_W = 500;
const PANEL_H = 440;
const PANELS = [360, 960, 1560];

const Panel: React.FC<{ x: number; s: number; n: number; children: React.ReactNode }> = ({ x, s, n, children }) => {
  if (s <= 0) {
    return null;
  }
  return (
    <g transform={`translate(${x} 560) scale(${s})`}>
      <rect x={-PANEL_W / 2} y={-PANEL_H / 2} width={PANEL_W} height={PANEL_H} rx={40} fill="#3b4a7e" stroke={INK} strokeWidth={8} />
      <circle cx={-PANEL_W / 2 + 20} cy={-PANEL_H / 2 + 20} r={42} fill="#ffe14d" stroke={INK} strokeWidth={6} />
      <text x={-PANEL_W / 2 + 20} y={-PANEL_H / 2 + 22} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52 }} fill={INK}>
        {n}
      </text>
      {children}
    </g>
  );
};

export const S10Recap: React.FC = () => {
  const f = useCurrentFrame();
  const bye = ip(f, [BYE - 20, BYE], [0, 1]);
  const panels = 1 - bye;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fff6dc" />
        <g opacity={panels}>
          <Panel x={PANELS[0]} s={pop(f, ONE, 18)} n={1}>
            <rect x={-250} y={-120} width={70} height={340} fill="#9a6b45" />
            <rect x={180} y={-120} width={70} height={340} fill="#9a6b45" />
            <path d={`M -180 -60 Q 0 ${-40 + Math.sin(f * 0.1) * 20} 180 -60`} stroke="#ffffff" strokeWidth={8} fill="none" />
            <Spider x={-60} y={-20} s={0.3} rotate={90} frame={f} walk={1} />
          </Panel>
          <Panel x={PANELS[1]} s={pop(f, TWO, 18)} n={2}>
            <Web x={0} y={10} s={0.42} frame={f} spiralP={ip(f, [TWO + 40, TWO + 140], [0, 1])} width={8} />
          </Panel>
          <Panel x={PANELS[2]} s={pop(f, THREE, 18)} n={3}>
            <Web x={0} y={10} s={0.42} frame={f} beads={1} width={8} />
            <Bug x={90} y={-40} s={0.6} frame={f} flap={0.3} wiggle={1} />
            <Spider x={0} y={14} s={0.22} frame={f} mood="wow" />
          </Panel>
          {f > TWO ? <Arrow x1={622} y1={560} x2={698} y2={560} width={14} /> : null}
          {f > THREE ? <Arrow x1={1222} y1={560} x2={1298} y2={560} width={14} /> : null}
        </g>
        {bye > 0 ? (
          <g opacity={bye}>
            <Garden frame={f} />
            <Moorings />
            <Web x={WEB_C.x} y={WEB_C.y} frame={f} dew={1} />
            <Spider x={WEB_C.x} y={WEB_C.y + 10} s={0.7 * pop(f, BYE, 18)} frame={f} walk={0.6} />
          </g>
        ) : null}
      </svg>
      <Caption text="おさらい！" start={RECAP} end={BYE - 20} position="top" size={110} color="#ffe14d" />
      <Caption text="くもの わな！" start={THREE + 40} end={BYE - 20} position="bottom" size={96} />
      <Caption text="またね！" start={BYE + 5} end={S10_DURATION} position="top" size={140} color="#ffe14d" />
    </AbsoluteFill>
  );
};
