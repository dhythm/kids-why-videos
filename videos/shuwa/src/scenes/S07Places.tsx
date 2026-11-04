import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { INK, Person } from "../components/Person";
import { DAD, FRIEND, FRIEND2, MOM, TEACHER } from "../components/cast";
import { Caption, FONT } from "../components/Caption";
import { Blackboard, Pill, Table, TV } from "../components/Things";
import { pop } from "../lib/anim";
import { chatSign, poseAt } from "../lib/signs";

export const S07_DURATION = 490;

const MANY = 20; // いろんな ところで
const HOME = 125; // かぞくや ともだちと おしゃべり
const NEWS = 205; // テレビの ニュースでも
const SCHOOL = 320; // 聞こえない子が かよう がっこうでも

const chat = (f: number, seed: number) => poseAt(chatSign(9999, seed), f + 30);

const Panel: React.FC<{ x: number; s: number; bg: string; label: string; frame: number; children: React.ReactNode }> = ({ x, s, bg, label, frame, children }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} 560) scale(${s})`}>
      <clipPath id={`clip-${label}`}>
        <rect x={-280} y={-330} width={560} height={620} rx={40} />
      </clipPath>
      <rect x={-280} y={-330} width={560} height={620} rx={40} fill={bg} />
      <g clipPath={`url(#clip-${label})`}>{children}</g>
      <rect x={-280} y={-330} width={560} height={620} rx={40} fill="none" stroke={INK} strokeWidth={9} />
      <Pill text={label} x={0} y={330} s={1} frame={frame} color="#ffe14d" size={60} />
    </g>
  );

export const S07Places: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#f3ecff" />
        <Panel x={330} s={pop(f, HOME, 20)} bg="#fff1d6" label="おうち" frame={f}>
          <rect x={-280} y={130} width={560} height={200} fill="#e8c79a" />
          <g transform="translate(-120 110) scale(0.62)">
            <Person x={0} y={0} frame={f} pose={chat(f, 1)} mood="laugh" {...MOM} />
          </g>
          <g transform="translate(130 140) scale(0.5)">
            <Person x={0} y={0} frame={f} pose={chat(f, 4)} mood="smile" {...FRIEND} />
          </g>
          <Table x={0} y={170} w={480} />
        </Panel>
        <Panel x={960} s={pop(f, NEWS, 20)} bg="#e0f0ff" label="テレビ" frame={f}>
          <TV x={0} y={-20} s={0.95}>
            <g transform="translate(-90 40) scale(0.45)">
              <Person x={0} y={0} frame={f} mood="smile" {...DAD} />
            </g>
            <rect x={-225} y={70} width={450} height={90} fill="#3a86ff" />
            <text x={-200} y={115} dominantBaseline="central" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40 }} fill="#fff">
              ニュース
            </text>
            {/* しゅわ つうやく の ひと */}
            <circle cx={135} cy={10} r={92} fill="#fff" stroke={INK} strokeWidth={6} />
            <clipPath id="interp">
              <circle cx={135} cy={10} r={88} />
            </clipPath>
            <g clipPath="url(#interp)">
              <g transform="translate(135 95) scale(0.42)">
                <Person x={0} y={0} frame={f} pose={chat(f, 7)} mood="smile" {...TEACHER} />
              </g>
            </g>
          </TV>
        </Panel>
        <Panel x={1590} s={pop(f, SCHOOL, 20)} bg="#eef7e4" label="がっこう" frame={f}>
          <Blackboard x={0} y={-210} w={440} h={130}>
            <text textAnchor="middle" dominantBaseline="central" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64 }} fill="#fff">
              あいうえお
            </text>
          </Blackboard>
          <g transform="translate(-120 80) scale(0.6)">
            <Person x={0} y={0} frame={f} pose={chat(f, 2)} mood="laugh" {...TEACHER} />
          </g>
          <g transform="translate(110 200) scale(0.42)">
            <Person x={-90} y={0} frame={f} pose={chat(f, 5)} mood="smile" {...FRIEND} />
            <Person x={250} y={0} frame={f} pose={chat(f, 8)} mood="laugh" blinkOffset={40} {...FRIEND2} />
          </g>
        </Panel>
      </svg>
      <Caption text="いろんな ところで" start={MANY + 10} end={HOME - 5} position="center" size={110} />
    </AbsoluteFill>
  );
};
