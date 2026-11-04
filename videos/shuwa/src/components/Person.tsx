import React from "react";
import { Face } from "./Characters";
import { armJoints, FORE, SHOULDER_L, SHOULDER_R, UPPER, type HandPose } from "../lib/arm";
import { REST, type Pose, type Shape } from "../lib/signs";

export const INK = "#2b2b4a";
export const SKIN = "#ffd9b8";

type Mood = "smile" | "wow" | "sleep" | "laugh" | "think";
export type Hair = "short" | "long" | "bob" | "bun" | "spiky";


/* ---------- て（ゆびさきは うえむき・てのひらの まんなかが 0,0） ---------- */
export const HandShape: React.FC<{
  shape: Shape;
  thumb: 1 | -1;
  skin?: string;
}> = ({ shape, thumb, skin = SKIN }) => {
  const st = { fill: skin, stroke: INK, strokeWidth: 5, strokeLinejoin: "round" as const };
  switch (shape) {
    case "flat":
      return (
        <g>
          <ellipse cx={thumb * 22} cy={6} rx={9} ry={17} transform={`rotate(${thumb * -25} ${thumb * 22} 6)`} {...st} />
          <rect x={-21} y={-36} width={42} height={62} rx={18} {...st} />
          <path d="M -7 -34 L -7 -12 M 7 -34 L 7 -12" stroke={INK} strokeWidth={3} opacity={0.35} />
        </g>
      );
    case "edge":
      return (
        <g>
          <rect x={-11} y={-38} width={22} height={66} rx={11} {...st} />
          <ellipse cx={thumb * 10} cy={4} rx={6} ry={12} {...st} />
        </g>
      );
    case "fist":
      return (
        <g>
          <circle cx={0} cy={0} r={23} {...st} />
          <path d={`M ${thumb * -12} -6 Q 0 -2 ${thumb * 12} -8`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      );
    case "point":
      return (
        <g>
          <rect x={-7.5} y={-46} width={15} height={44} rx={7.5} {...st} />
          <circle cx={0} cy={8} r={21} {...st} />
          <path d={`M ${thumb * -10} 2 Q 0 6 ${thumb * 12} 0`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      );
    case "two":
      return (
        <g>
          <rect x={-15} y={-44} width={14} height={44} rx={7} transform="rotate(-9 -8 0)" {...st} />
          <rect x={1} y={-44} width={14} height={44} rx={7} transform="rotate(9 8 0)" {...st} />
          <circle cx={0} cy={8} r={21} {...st} />
        </g>
      );
  }
};

const Arm: React.FC<{
  shoulder: { x: number; y: number };
  hand: HandPose;
  shape: Shape;
  bend: 1 | -1;
  thumb: 1 | -1;
  shirt: string;
  skin: string;
}> = ({ shoulder, hand, shape, bend, thumb, shirt, skin }) => {
  // とどかない ときは て を ひきもどす（うでが のびない）。たかく あげると ひじは そとがわへ
  const { elbow: e, hand: h } = armJoints(shoulder, hand, UPPER, FORE, bend);
  const d = `M ${shoulder.x} ${shoulder.y} L ${e.x} ${e.y} L ${h.x} ${h.y}`;
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={42} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={shirt} strokeWidth={32} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(${h.x} ${h.y}) rotate(${hand.rot}) scale(1.25)`}>
        <HandShape shape={shape} thumb={thumb} skin={skin} />
      </g>
    </g>
  );
};

const HairBack: React.FC<{ hair: Hair; color: string }> = ({ hair, color }) => {
  if (hair === "long") {
    return <path d="M -100 -170 Q -110 -40 -70 -20 L 70 -20 Q 110 -40 100 -170 Z" fill={color} stroke={INK} strokeWidth={5} />;
  }
  if (hair === "bob") {
    return <path d="M -104 -175 Q -112 -80 -80 -70 L 80 -70 Q 112 -80 104 -175 Z" fill={color} stroke={INK} strokeWidth={5} />;
  }
  if (hair === "bun") {
    return <circle cx={0} cy={-268} r={40} fill={color} stroke={INK} strokeWidth={5} />;
  }
  return null;
};

const HairFront: React.FC<{ hair: Hair; color: string }> = ({ hair, color }) => {
  if (hair === "spiky") {
    return (
      <path
        d="M -95 -170 L -88 -240 L -55 -228 L -35 -268 L -5 -238 L 25 -270 L 45 -232 L 80 -245 L 95 -170 Q 60 -212 0 -205 Q -60 -212 -95 -170 Z"
        fill={color}
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    );
  }
  if (hair === "long" || hair === "bob") {
    return <path d="M -98 -160 Q -95 -272 0 -262 Q 95 -272 98 -160 Q 85 -200 40 -205 Q 0 -190 -30 -212 Q -80 -205 -98 -160 Z" fill={color} />;
  }
  return <path d="M -95 -170 Q -90 -270 0 -262 Q 90 -270 95 -170 Q 60 -215 0 -205 Q -60 -215 -95 -170 Z" fill={color} />;
};

/* ---------- 人（まんなか = おなか）。pose で 手話を する ---------- */
export const Person: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  pose?: Pose;
  mood?: Mood;
  shirt?: string;
  pants?: string;
  hair?: Hair;
  hairColor?: string;
  skin?: string;
  hearingAid?: boolean;
  /** うしろむき（かおが みえない） */
  back?: boolean;
  blinkOffset?: number;
}> = ({
  x,
  y,
  s = 1,
  frame,
  pose = REST,
  mood = "smile",
  shirt = "#ffd166",
  pants = "#3a86ff",
  hair = "short",
  hairColor = "#5b3a29",
  skin = SKIN,
  hearingAid = false,
  back = false,
  blinkOffset = 0,
}) => {
  const nodY = pose.nod * 16;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* あし */}
      <rect x={-46} y={70} width={34} height={90} rx={16} fill={pants} />
      <ellipse cx={-30} cy={162} rx={26} ry={13} fill={INK} />
      <rect x={12} y={70} width={34} height={90} rx={16} fill={pants} />
      <ellipse cx={30} cy={162} rx={26} ry={13} fill={INK} />
      {/* からだ */}
      <rect x={-75} y={-70} width={150} height={160} rx={60} fill={shirt} stroke={INK} strokeWidth={5} />
      {/* あたま */}
      <g transform={`translate(0 ${nodY})`}>
        <HairBack hair={hair} color={hairColor} />
        <circle cx={-94} cy={-150} r={20} fill={skin} stroke={INK} strokeWidth={5} />
        <circle cx={94} cy={-150} r={20} fill={skin} stroke={INK} strokeWidth={5} />
        {hearingAid ? (
          <path d="M 96 -178 Q 122 -176 118 -150 Q 116 -132 104 -134" fill="#7ec8e3" stroke={INK} strokeWidth={4} />
        ) : null}
        <circle cx={0} cy={-160} r={95} fill={skin} stroke={INK} strokeWidth={5} />
        {back ? (
          <path d="M -97 -150 Q -100 -272 0 -264 Q 100 -272 97 -150 Q 90 -95 0 -88 Q -90 -95 -97 -150 Z" fill={hairColor} />
        ) : (
          <>
            <HairFront hair={hair} color={hairColor} />
            <g transform="translate(0 -150)">
              <Face r={95} frame={frame} mood={mood} blinkOffset={blinkOffset} />
            </g>
          </>
        )}
      </g>
      {/* うで（からだの まえ） */}
      <Arm shoulder={SHOULDER_L} hand={pose.l} shape={pose.lShape} bend={1} thumb={1} shirt={shirt} skin={skin} />
      <Arm shoulder={SHOULDER_R} hand={pose.r} shape={pose.rShape} bend={-1} thumb={-1} shirt={shirt} skin={skin} />
    </g>
  );
};

/* ---------- キラキラ ---------- */
export const Sparkle: React.FC<{
  x: number;
  y: number;
  s: number;
  color?: string;
}> = ({ x, y, s, color = "#ffe14d" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -30 L 9 -9 L 30 0 L 9 9 L 0 30 L -9 9 L -30 0 L -9 -9 Z" fill={color} />
  </g>
);
