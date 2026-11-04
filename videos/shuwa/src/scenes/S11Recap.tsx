import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { INK, Person } from "../components/Person";
import { FRIEND, ME } from "../components/cast";
import { Caption, FONT } from "../components/Caption";
import { Ear, HandIcon, Heart } from "../components/Things";
import { Face } from "../components/Characters";
import { ip, pop } from "../lib/anim";
import { poseAt, waveSign } from "../lib/signs";

export const S11_DURATION = 450;

const EAR = 20; // 耳が 聞こえない人も いる
const HANDS = 110; // 手と かおで はなす ことば、それが 手話
const FRIENDS = 240; // なかよく なれるね。またね！
const BYE = 330;

const WAVE = waveSign(200);

const Card: React.FC<{ x: number; s: number; text: string; children: React.ReactNode; color: string }> = ({ x, s, text, children, color }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} 540) scale(${s})`}>
      <rect x={-330} y={-300} width={660} height={600} rx={56} fill={color} stroke={INK} strokeWidth={9} />
      {children}
      <text y={210} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54 }} fill={INK}>
        {text}
      </text>
    </g>
  );

export const S11Recap: React.FC = () => {
  const f = useCurrentFrame();
  const cards = 1 - ip(f, [FRIENDS - 15, FRIENDS + 5], [0, 1]);
  const pair = ip(f, [FRIENDS, FRIENDS + 20], [0, 1]);
  const pose = poseAt(WAVE, f - BYE + 20);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#e9f6ff" />
        <g opacity={cards}>
          <Card x={540} s={pop(f, EAR, 18)} text="きこえない ひとも いる" color="#fff1c9">
            <Ear x={0} y={-60} s={0.9} />
          </Card>
          <Card x={1380} s={pop(f, HANDS, 18)} text="て と かお の ことば" color="#e4f7dc">
            <HandIcon x={-170} y={-30} s={1.1} rotate={-15 + Math.sin(f * 0.2) * 10} />
            <g transform="translate(0 -70)">
              <circle r={95} fill="#f6cfa8" stroke={INK} strokeWidth={6} />
              <Face r={95} frame={f} mood="laugh" />
            </g>
            <HandIcon x={170} y={-30} s={1.1} rotate={15 - Math.sin(f * 0.2) * 10} />
          </Card>
        </g>
        <g opacity={pair}>
          {new Array(10).fill(0).map((_, i) => (
            <Heart key={i} x={(i * 197 + 100) % 1920} y={1050 - ((f * 2 + i * 110) % 1150)} s={0.6 + (i % 3) * 0.25} color={i % 2 ? "#ffc2d4" : "#ffd9a8"} />
          ))}
          <Person x={720} y={680} s={1.2} frame={f} pose={pose} mood="laugh" {...ME} />
          <Person x={1200} y={680} s={1.2} frame={f} pose={pose} mood="laugh" blinkOffset={30} {...FRIEND} />
          <Heart x={960} y={470} s={pop(f, FRIENDS + 30, 18) * 1.6} />
        </g>
      </svg>
      <Caption text="なかよく なれるね" start={FRIENDS + 10} end={BYE - 5} position="top" size={100} color="#ffe14d" />
      <Caption text="またね！" start={BYE} end={S11_DURATION} position="top" size={140} color="#ffe14d" />
    </AbsoluteFill>
  );
};
