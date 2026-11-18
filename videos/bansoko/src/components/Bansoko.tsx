import React from "react";
import { Face, Mood } from "./Characters";
import { INK } from "./Things";
import { brickFill, NEW_SKIN, SKIN, woundColor } from "../lib/wound";

export const TAPE = "#f2c79b";
export const PAD = "#fff3df";

/* ---------- ばんそうこう ---------- */
export const Bandage: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  face?: boolean;
  mood?: Mood;
  frame?: number;
  dirty?: number; // 0..1 よごれ・ぬれ
  opacity?: number;
}> = ({
  x,
  y,
  s = 1,
  rot = 0,
  face = false,
  mood = "smile",
  frame = 0,
  dirty = 0,
  opacity = 1,
}) => {
  if (s <= 0 || opacity <= 0) {
    return null;
  }
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
      opacity={opacity}
    >
      <rect
        x={-160}
        y={-50}
        width={320}
        height={100}
        rx={50}
        fill={TAPE}
        stroke={INK}
        strokeWidth={6}
      />
      {[-1, 1].flatMap((d) =>
        [92, 114, 136].flatMap((dx) =>
          [-20, 0, 20].map((dy) => (
            <circle
              key={`${d}-${dx}-${dy}`}
              cx={d * dx}
              cy={dy}
              r={4}
              fill="#d9a877"
            />
          )),
        ),
      )}
      <rect
        x={-62}
        y={-42}
        width={124}
        height={84}
        rx={14}
        fill={PAD}
        stroke={INK}
        strokeWidth={4}
      />
      {dirty > 0 ? (
        <g opacity={dirty}>
          <ellipse cx={-100} cy={10} rx={34} ry={22} fill="#9c6b3f" />
          <ellipse cx={86} cy={-16} rx={28} ry={18} fill="#8a5a33" />
          <ellipse cx={20} cy={18} rx={30} ry={16} fill="#b98a5a" />
          <ellipse cx={-30} cy={-22} rx={12} ry={16} fill="#7fd0ff" />
          <ellipse cx={120} cy={22} rx={10} ry={14} fill="#7fd0ff" />
        </g>
      ) : null}
      {face ? <Face r={44} frame={frame} mood={mood} /> : null}
    </g>
  );
};

/* ---------- ひざ（おおきく）。まんなか = きずの ばしょ ---------- */
const KneeShapes: React.FC = () => (
  <>
    <rect x={-420} y={-108} width={430} height={216} rx={104} />
    <rect x={-96} y={-10} width={192} height={520} rx={92} />
    <circle r={124} />
  </>
);

export const Knee: React.FC<{
  x: number;
  y: number;
  s?: number;
  heal?: number; // 0 = けがした ばかり、1 = なおった
  blood?: number; // 0..1 ちの しずく
  wet?: number; // 0..1 じゅくじゅく
}> = ({ x, y, s = 1, heal = 0, blood = 0, wet = 0 }) => {
  const raw = Math.max(0, 1 - heal / 0.6);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g fill={SKIN} stroke={INK} strokeWidth={14}>
        <KneeShapes />
      </g>
      <g fill={SKIN}>
        <KneeShapes />
      </g>
      {/* ズボン */}
      <rect
        x={-470}
        y={-128}
        width={270}
        height={256}
        rx={36}
        fill="#3a86ff"
        stroke={INK}
        strokeWidth={7}
      />
      {heal < 1 ? (
        <g>
          <ellipse rx={54} ry={40} fill={woundColor(heal)} />
          <g opacity={raw}>
            <ellipse
              rx={54}
              ry={40}
              fill="none"
              stroke="#b3261e"
              strokeWidth={5}
              strokeDasharray="14 9"
            />
            {[-18, 0, 18].map((dy) => (
              <line
                key={dy}
                x1={-26}
                y1={dy + 4}
                x2={26}
                y2={dy - 4}
                stroke="#b3261e"
                strokeWidth={5}
                strokeLinecap="round"
              />
            ))}
          </g>
          {wet > 0
            ? [
                [-22, -12],
                [14, -18],
                [6, 14],
              ].map(([dx, dy], i) => (
                <ellipse
                  key={i}
                  cx={dx}
                  cy={dy}
                  rx={11}
                  ry={7}
                  fill="#ffffff"
                  opacity={wet * 0.85}
                />
              ))
            : null}
        </g>
      ) : null}
      {blood > 0 ? (
        <g transform={`translate(16 62) scale(${blood})`}>
          <path
            d="M 0 -34 Q 26 0 26 14 A 26 26 0 1 1 -26 14 Q -26 0 0 -34 Z"
            fill="#e5484d"
            stroke={INK}
            strokeWidth={5}
          />
        </g>
      ) : null}
    </g>
  );
};

/** げんきな ひふに はりつづけた あとの しろく ふやけた ひふ */
export const SoggyPatch: React.FC<{
  x: number;
  y: number;
  s: number;
  itch?: number;
}> = ({ x, y, s, itch = 0 }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect
        x={-66}
        y={-44}
        width={132}
        height={88}
        rx={22}
        fill="#fffaf5"
        stroke="#d9b8a0"
        strokeWidth={4}
      />
      {[-20, 0, 20].map((dy) => (
        <path
          key={dy}
          d={`M -44 ${dy} q 11 -9 22 0 t 22 0 t 22 0 t 22 0`}
          stroke="#d9b8a0"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {itch > 0
        ? new Array(10).fill(0).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={Math.cos(a) * (92 + (i % 2) * 22)}
                cy={Math.sin(a) * (62 + (i % 2) * 16)}
                r={9}
                fill="#ff6b6b"
                opacity={itch * 0.9}
              />
            );
          })
        : null}
    </g>
  );

/* ---------- ひふの かべ（よこから みた ところ） ---------- */
const BRICK = 120;
const GAP_FROM = 6;
const GAP_COUNT = 4;

export const SkinWall: React.FC<{
  y: number; // かべの まんなかの たかさ
  heal: number; // 0 = あなが あいている、1 = ふさがった
  intact?: boolean; // けがを する まえ（あたらしい ひふの いろに しない）
}> = ({ y, heal, intact = false }) => {
  const fill = brickFill(GAP_COUNT, heal);
  return (
    <g>
      {new Array(16).fill(0).map((_, i) => {
        const g = i - GAP_FROM;
        const inGap = g >= 0 && g < GAP_COUNT;
        const k = inGap ? fill[g] : 1;
        if (k <= 0) {
          return null;
        }
        return (
          <g
            key={i}
            transform={`translate(${i * BRICK + BRICK / 2} ${y}) scale(${k})`}
          >
            <rect
              x={-BRICK / 2 + 4}
              y={-BRICK / 2}
              width={BRICK - 8}
              height={BRICK}
              rx={24}
              fill={
                inGap && !intact ? NEW_SKIN : i % 2 === 0 ? SKIN : "#ffcfa6"
              }
              stroke={INK}
              strokeWidth={6}
            />
            <ellipse
              cx={-22}
              cy={-30}
              rx={16}
              ry={8}
              fill="#fff"
              opacity={0.5}
            />
          </g>
        );
      })}
    </g>
  );
};

/** よこから みた ばんそうこう（きずの やね）。x,y = あなの まんなかの うえ */
export const RoofBandage: React.FC<{
  x: number;
  y: number;
  s: number;
}> = ({ x, y, s }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M -340 0 Q 0 -120 340 0"
        stroke={INK}
        strokeWidth={50}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M -340 0 Q 0 -120 340 0"
        stroke={TAPE}
        strokeWidth={38}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M -170 -22 Q 0 -52 170 -22"
        stroke={INK}
        strokeWidth={30}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M -170 -22 Q 0 -52 170 -22"
        stroke={PAD}
        strokeWidth={20}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );

/* ---------- ばいきん ---------- */
export const Germ: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  rot?: number;
  mood?: Mood;
  color?: string;
}> = ({ x, y, s = 1, frame, rot = 0, mood = "smile", color = "#9b6bd6" }) => {
  if (s <= 0) {
    return null;
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {new Array(9).fill(0).map((_, i) => {
        const a = i * 40 + Math.sin(frame * 0.2 + i) * 6;
        return (
          <path
            key={i}
            transform={`rotate(${a})`}
            d="M -16 -56 L 0 -92 L 16 -56 Z"
            fill={color}
            stroke={INK}
            strokeWidth={6}
            strokeLinejoin="round"
          />
        );
      })}
      <circle r={64} fill={color} stroke={INK} strokeWidth={6} />
      <ellipse cx={-28} cy={-34} rx={16} ry={8} fill="#fff" opacity={0.45} />
      {/* いたずらっこの まゆげ */}
      <path
        d="M -36 -26 L -10 -16 M 36 -26 L 10 -16"
        stroke={INK}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <Face r={56} frame={frame} mood={mood} blinkOffset={Math.round(x)} />
    </g>
  );
};

/* ---------- からだの なおしやさん（ヘルメットの さいぼう） ---------- */
export const Fixer: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  carry?: boolean; // あたらしい ひふの ブロックを もつ
  color?: string;
  mood?: Mood;
}> = ({
  x,
  y,
  s = 1,
  frame,
  carry = false,
  color = "#ffffff",
  mood = "smile",
}) => {
  if (s <= 0) {
    return null;
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {carry ? (
        <rect
          x={-34}
          y={-128 + Math.sin(frame * 0.3 + x) * 4}
          width={68}
          height={46}
          rx={12}
          fill={NEW_SKIN}
          stroke={INK}
          strokeWidth={5}
        />
      ) : null}
      {/* て */}
      <circle
        cx={-62}
        cy={carry ? -52 : 10}
        r={14}
        fill={color}
        stroke={INK}
        strokeWidth={5}
      />
      <circle
        cx={62}
        cy={carry ? -52 : 10}
        r={14}
        fill={color}
        stroke={INK}
        strokeWidth={5}
      />
      <circle r={58} fill={color} stroke={INK} strokeWidth={6} />
      <Face r={52} frame={frame} mood={mood} blinkOffset={Math.round(x)} />
      {/* ヘルメット */}
      <path
        d="M -52 -28 Q -50 -82 0 -82 Q 50 -82 52 -28 Z"
        fill="#ffcf3f"
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <rect
        x={-64}
        y={-34}
        width={128}
        height={14}
        rx={7}
        fill="#ffcf3f"
        stroke={INK}
        strokeWidth={5}
      />
    </g>
  );
};

/* ---------- いたみの おしらせ ベル ---------- */
export const Bell: React.FC<{
  x: number;
  y: number;
  s?: number;
  ring: number; // 0..1 なる つよさ
  frame: number;
}> = ({ x, y, s = 1, ring, frame }) => {
  if (s <= 0) {
    return null;
  }
  const swing = Math.sin(frame * 0.7) * 20 * ring;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {ring > 0.15
        ? [-1, 1].map((d) => (
            <g
              key={d}
              opacity={ring * (0.5 + 0.5 * Math.sin(frame * 0.7))}
              stroke="#ff7b54"
              strokeWidth={9}
              strokeLinecap="round"
              fill="none"
            >
              <path d={`M ${d * 122} -40 q ${d * 26} 40 0 80`} />
              <path d={`M ${d * 156} -66 q ${d * 44} 66 0 132`} />
            </g>
          ))
        : null}
      <g transform={`rotate(${swing} 0 -100)`}>
        <circle
          cx={0}
          cy={-104}
          r={18}
          fill="none"
          stroke={INK}
          strokeWidth={9}
        />
        <circle
          cx={-swing * 0.9}
          cy={88}
          r={20}
          fill="#ff9f43"
          stroke={INK}
          strokeWidth={6}
        />
        <path
          d="M -76 56 Q -76 -84 0 -88 Q 76 -84 76 56 L 98 78 L -98 78 Z"
          fill="#ffd23f"
          stroke={INK}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <ellipse cx={-34} cy={-34} rx={14} ry={30} fill="#fff" opacity={0.5} />
      </g>
    </g>
  );
};

/* ---------- じゃぐち（みずが でる さき = 145, 62） ---------- */
export const Tap: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) =>
  s <= 0 ? null : (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke={INK}
      strokeWidth={6}
    >
      <rect x={-34} y={0} width={68} height={170} fill="#c9d3df" />
      <rect x={-34} y={-32} width={210} height={60} rx={30} fill="#dfe6ee" />
      <rect x={118} y={-32} width={56} height={94} rx={16} fill="#dfe6ee" />
      <rect x={-12} y={-70} width={24} height={40} fill="#c9d3df" />
      <rect x={-60} y={-96} width={120} height={34} rx={17} fill="#4f8fff" />
    </g>
  );

/* ---------- ふく ---------- */
export const Shirt: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  color?: string;
}> = ({ x, y, s = 1, rot = 0, color = "#7fd6a8" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M -90 -80 L -40 -100 Q 0 -66 40 -100 L 90 -80 L 130 -20 L 86 6 L 70 -18 L 70 100 L -70 100 L -70 -18 L -86 6 L -130 -20 Z"
      fill={color}
      stroke={INK}
      strokeWidth={6}
      strokeLinejoin="round"
    />
  </g>
);

/* ---------- こおりの ふくろ ---------- */
export const IcePack: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect
        x={-84}
        y={-60}
        width={168}
        height={130}
        rx={44}
        fill="#bfe6ff"
        stroke={INK}
        strokeWidth={6}
      />
      {[
        [-36, -6, 12],
        [22, -20, -10],
        [10, 30, 24],
      ].map(([dx, dy, r], i) => (
        <rect
          key={i}
          x={dx - 20}
          y={dy - 20}
          width={40}
          height={40}
          rx={8}
          fill="#ffffff"
          stroke="#7fb8e6"
          strokeWidth={4}
          transform={`rotate(${r} ${dx} ${dy})`}
        />
      ))}
      <rect
        x={-30}
        y={-88}
        width={60}
        height={34}
        rx={12}
        fill="#4f8fff"
        stroke={INK}
        strokeWidth={6}
      />
    </g>
  );

/* ---------- なでなでの て（ゆびが した、うでは うえへ） ---------- */
export const Hand: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect
        x={-44}
        y={-520}
        width={88}
        height={470}
        rx={40}
        fill="#ff9f6b"
        stroke={INK}
        strokeWidth={6}
      />
      {[-51, -17, 17, 51].map((dx, i) => (
        <rect
          key={dx}
          x={dx - 15}
          y={10}
          width={30}
          height={62 + (i === 1 || i === 2 ? 12 : 0)}
          rx={15}
          fill="#ffe0c4"
          stroke={INK}
          strokeWidth={5}
        />
      ))}
      <ellipse
        cx={-78}
        cy={-10}
        rx={16}
        ry={34}
        fill="#ffe0c4"
        stroke={INK}
        strokeWidth={5}
        transform="rotate(28 -78 -10)"
      />
      <rect
        x={-70}
        y={-70}
        width={140}
        height={104}
        rx={40}
        fill="#ffe0c4"
        stroke={INK}
        strokeWidth={5}
      />
    </g>
  );

/* ---------- くすりの びん ---------- */
export const Medicine: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect
        x={-36}
        y={-104}
        width={72}
        height={40}
        rx={8}
        fill="#6bc5a0"
        stroke={INK}
        strokeWidth={6}
      />
      <rect
        x={-62}
        y={-68}
        width={124}
        height={168}
        rx={22}
        fill="#ffffff"
        stroke={INK}
        strokeWidth={6}
      />
      <rect x={-62} y={-20} width={124} height={80} fill="#d8f3e6" />
      <path
        d="M -10 -6 h 20 v 16 h 16 v 20 h -16 v 16 h -20 v -16 h -16 v -20 h 16 Z"
        fill="#3aa87a"
      />
      <rect
        x={-62}
        y={-68}
        width={124}
        height={168}
        rx={22}
        fill="none"
        stroke={INK}
        strokeWidth={6}
      />
    </g>
  );
