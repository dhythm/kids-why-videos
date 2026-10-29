import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Alco, Liver, Pill } from "../components/Things";
import { Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S07_DURATION = 660;

const WORK = 180;
const SLOW = 390;

const LX = 1000;
const LY = 700;
const LS = 1.6;
// ハンマーが いちばん したに くる ところ（Liver の ふりかたに あわせる）
const HIT = { x: 1430, y: 600 };
const HIT_PERIOD = Math.PI / 0.15;
const hitFrame = (k: number) => Math.round(HIT_PERIOD / 2 + HIT_PERIOD * k);

/** WORK〜 で つぎつぎ くる アルコール（ハンマーの タイミングで とどく） */
const ARRIVALS = new Array(30)
  .fill(0)
  .map((_, k) => hitFrame(k))
  .filter((t) => t >= WORK + 25 && t < S07_DURATION);

export const S07Liver: React.FC = () => {
  const f = useCurrentFrame();
  const swing = f >= WORK ? 1 : 0;
  const busy = ip(f, [SLOW + 60, SLOW + 120], [0, 1]);
  const inset = ip(f, [SLOW - 20, SLOW], [1, 0]);
  // SLOW から あとは ならんで まつ（たくさん きて なかなか おわらない）
  const queue = f >= SLOW ? Math.min(8, Math.floor((f - SLOW) / 12) + 2) : 0;

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#ffe3ea" />
        {new Array(18).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={(i * 211) % 1920}
            cy={(i * 347) % 1080}
            r={60 + (i % 4) * 30}
            fill="#ffd0dc"
            opacity={0.7}
          />
        ))}

        {/* どこに あるの？（ちいさな からだの え） */}
        {inset > 0 ? (
          <g transform="translate(300 560)" opacity={inset * pop(f, 10, 16)}>
            <circle
              cx={0}
              cy={-210}
              r={80}
              fill="#fff"
              stroke="#2b2b4a"
              strokeWidth={6}
            />
            <rect
              x={-95}
              y={-125}
              width={190}
              height={300}
              rx={70}
              fill="#fff"
              stroke="#2b2b4a"
              strokeWidth={6}
            />
            <path
              d="M -70 -30 Q -75 -70 -10 -70 Q 50 -72 70 -45 Q 80 -25 50 -5 Q 10 20 -40 15 Q -72 12 -70 -30 Z"
              fill="#b5413b"
              stroke="#2b2b4a"
              strokeWidth={4}
              opacity={0.6 + Math.sin(f * 0.2) * 0.4}
            />
            <path
              d="M 110 -40 Q 320 -140 440 90"
              stroke="#2b2b4a"
              strokeWidth={6}
              strokeDasharray="14 12"
              fill="none"
              opacity={pop(f, 40, 20)}
            />
          </g>
        ) : null}

        <Liver
          x={LX}
          y={LY}
          s={LS * pop(f, 20, 20)}
          frame={f}
          swing={swing}
          mood={busy > 0.5 ? "wow" : "smile"}
          sweat={busy}
        />
        <Pill
          text="かんぞう"
          x={LX}
          y={940}
          s={pop(f, 45, 16)}
          frame={f}
          color="#ffe14d"
        />

        {/* アルコールが きて、えいっ！で ばらばら */}
        {f < SLOW
          ? ARRIVALS.filter((t) => t < SLOW + 10).map((t) => {
              const start = t - 45;
              if (f < start || f > t + 25) {
                return null;
              }
              if (f < t) {
                const k = ip(f, [start, t], [0, 1], Easing.inOut(Easing.quad));
                return (
                  <Alco
                    key={t}
                    x={2000 + (HIT.x + 40 - 2000) * k}
                    y={HIT.y + Math.sin(k * 7) * 30}
                    s={1.1}
                    frame={f}
                  />
                );
              }
              const b = ip(f, [t, t + 25], [0, 1], Easing.out(Easing.quad));
              return (
                <g key={t} opacity={1 - b}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Sparkle
                      key={i}
                      x={HIT.x + 40 + Math.cos(i * 1.26) * 110 * b}
                      y={HIT.y + Math.sin(i * 1.26) * 110 * b}
                      s={0.7}
                      color={i % 2 ? "#7fd1ff" : "#ffe14d"}
                    />
                  ))}
                </g>
              );
            })
          : null}

        {/* たくさん まってる… */}
        {f >= SLOW
          ? new Array(queue).fill(0).map((_, i) => {
              const step = ((f - SLOW) % HIT_PERIOD) / HIT_PERIOD;
              return (
                <Alco
                  key={i}
                  x={HIT.x + 60 + i * 85 - step * 20}
                  y={HIT.y + Math.sin(f * 0.2 + i) * 10 + (i % 2) * 40}
                  s={1}
                  frame={f + i * 7}
                  opacity={pop(f, SLOW + i * 12, 10)}
                />
              );
            })
          : null}

        {/* とけい（じかんが かかる） */}
        {f >= SLOW ? (
          <g transform={`translate(330 520) scale(${pop(f, SLOW + 10, 18)})`}>
            <circle r={170} fill="#fff" stroke="#2b2b4a" strokeWidth={14} />
            {new Array(12).fill(0).map((_, i) => (
              <circle
                key={i}
                cx={Math.cos((i / 12) * Math.PI * 2) * 135}
                cy={Math.sin((i / 12) * Math.PI * 2) * 135}
                r={9}
                fill="#2b2b4a"
              />
            ))}
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-80}
              stroke="#2b2b4a"
              strokeWidth={16}
              strokeLinecap="round"
              transform={`rotate(${(f - SLOW) * 1.2})`}
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-120}
              stroke="#ff4d6d"
              strokeWidth={10}
              strokeLinecap="round"
              transform={`rotate(${(f - SLOW) * 14})`}
            />
            <circle r={16} fill="#2b2b4a" />
          </g>
        ) : null}

        <Sfx
          text="えいっ！"
          x={1500}
          y={330}
          start={WORK + 20}
          end={WORK + 110}
          size={120}
        />
        <Sfx
          text="えいっ！"
          x={1650}
          y={420}
          start={WORK + 110}
          end={SLOW - 5}
          size={110}
          color="#ffffff"
          rotate={8}
        />
        <Sfx
          text="たいへん！"
          x={1100}
          y={300}
          start={SLOW + 110}
          end={S07_DURATION}
          size={110}
          color="#ff8fab"
        />
      </svg>
      <Caption
        text="かんぞう さん が がんばる"
        start={20}
        end={WORK - 5}
        position="top"
        size={92}
      />
      <Caption
        text="アルコールを こわす"
        start={WORK + 5}
        end={SLOW - 5}
        position="top"
        size={96}
        color="#ffe14d"
      />
      <Caption
        text="じかんが かかる"
        start={SLOW + 5}
        end={SLOW + 120}
        position="top"
        size={96}
      />
      <Caption
        text="のみすぎ は だめ！"
        start={SLOW + 120}
        end={S07_DURATION}
        position="top"
        size={110}
        color="#ffb3c6"
      />
    </AbsoluteFill>
  );
};
