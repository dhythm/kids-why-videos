import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Egg, FarmBg, Hanamaru, Hen, Nest, VENT } from "../components/Farm";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, FONT, Sfx } from "../components/Caption";
import { ip, pop, shake } from "../lib/anim";

export const S01_DURATION = 760;

const SIT = 115;
const STRAIN = 150;
const LAY = 230;
const ASK = 285;
const GUESS = 390;
const RIGHT = 465;
const HOW = 600;

const HEN_X = 820;
const HEN_S = 1.1;

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  const walkX = ip(f, [5, SIT - 10], [-350, HEN_X], Easing.inOut(Easing.quad));
  const henY = ip(f, [SIT - 5, SIT + 15], [560, 650], Easing.out(Easing.quad));
  const straining = f >= STRAIN && f < LAY;
  const [sx] = straining ? shake(f, 4) : [0];
  const crow = f > 20 && f < 75 ? Math.abs(Math.sin(f * 0.25)) : 0;

  const ventX = HEN_X + VENT.x * HEN_S;
  const ventY = 650 + VENT.y * HEN_S;
  // たまごが ころん
  const lay = ip(f, [LAY, LAY + 25], [0, 1], Easing.out(Easing.back(1.6)));
  const eggX = ventX - 20 - lay * 60;
  const eggY = ventY + 10 + lay * 45;

  const kidJump =
    f >= RIGHT && f < HOW ? -Math.abs(Math.sin((f - RIGHT) * 0.2)) * 50 : 0;

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <FarmBg frame={f} />
        <Nest x={HEN_X} y={800} s={1.1} />
        <Hen
          x={walkX + sx}
          y={f < SIT - 5 ? 560 : henY}
          s={HEN_S}
          frame={f}
          walk={f < SIT - 10 ? 1 : 0}
          sitting={f >= SIT}
          beakOpen={crow}
          flap={crow > 0 ? 1 : f >= LAY && f < LAY + 30 ? 1 : 0}
          mood={straining ? "strain" : f >= LAY && f < ASK ? "wow" : "smile"}
        />
        {f >= LAY ? (
          <Egg
            x={eggX}
            y={eggY}
            s={0.9 * pop(f, LAY, 14)}
            rotate={-20 + lay * 20}
          />
        ) : null}
        <Nest x={HEN_X} y={800} s={1.1} front />

        {/* おしりの あな を おしえる まる */}
        {f >= GUESS && f < HOW + 30 ? (
          <g transform={`translate(${ventX} ${ventY})`}>
            <circle
              r={60 + Math.sin(f * 0.3) * 6}
              fill="none"
              stroke="#ff4d6d"
              strokeWidth={10}
              strokeDasharray="22 14"
              opacity={pop(f, GUESS + 10, 14)}
              transform={`rotate(${f * 2})`}
            />
          </g>
        ) : null}
        {f >= GUESS && f < RIGHT + 20 ? (
          <g
            transform={`translate(${ventX - 150 + Math.sin(f * 0.3) * 10} ${ventY - 120}) scale(${pop(f, GUESS + 15, 14)}) rotate(40)`}
          >
            <path
              d="M 0 -40 L 0 30 M -28 4 L 0 34 L 28 4"
              stroke="#ff4d6d"
              strokeWidth={16}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ) : null}

        <Kid
          x={1520}
          y={640 + kidJump}
          s={1.15}
          frame={f}
          mood={f >= LAY && f < ASK + 40 ? "wow" : "smile"}
          armUp={f >= RIGHT && f < HOW ? 1 : 0}
        />
        {/* はてな */}
        {(f >= ASK && f < GUESS) || f >= HOW
          ? [0, 1].map((i) => {
              const st = f >= HOW ? HOW : ASK;
              const bx = f >= HOW ? HEN_X + 40 + i * 110 : 1640 + i * 90;
              const by = f >= HOW ? 330 - i * 50 : 300 - i * 60;
              return (
                <g
                  key={i}
                  transform={`translate(${bx} ${by + Math.sin(f * 0.12 + i) * 12}) scale(${pop(f, st + 10 + i * 10, 16)}) rotate(${Math.sin(f * 0.1 + i) * 12})`}
                >
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 130 + i * 20,
                    }}
                    fill="#ff5d8f"
                    stroke="#2b2b4a"
                    strokeWidth={12}
                    paintOrder="stroke"
                  >
                    ?
                  </text>
                </g>
              );
            })
          : null}
        {/* おなかが ひかる */}
        {f >= HOW ? (
          <circle
            cx={HEN_X - 10}
            cy={660}
            r={90}
            fill="#fff59d"
            opacity={pop(f, HOW, 20) * (0.35 + Math.sin(f * 0.2) * 0.15)}
          />
        ) : null}

        {/* あたり！ */}
        {f >= RIGHT && f < HOW + 10 ? (
          <g opacity={ip(f, [HOW - 5, HOW + 10], [1, 0])}>
            <Hanamaru
              x={1150}
              y={430}
              s={0.7}
              p={ip(f, [RIGHT, RIGHT + 40], [0, 1])}
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <Sparkle
                key={i}
                x={1150 + Math.cos(i * 1.3) * 210}
                y={430 + Math.sin(i * 2.1) * 180}
                s={
                  pop(f, RIGHT + 20 + i * 5, 14) *
                  (0.9 + Math.sin(f * 0.2 + i) * 0.2)
                }
              />
            ))}
          </g>
        ) : null}

        <Sfx
          text="コケコッコー！"
          x={620}
          y={230}
          start={20}
          end={95}
          size={110}
        />
        <Sfx
          text="うーん…"
          x={520}
          y={330}
          start={STRAIN + 5}
          end={LAY}
          size={100}
          color="#ffffff"
        />
        <Sfx text="ぽんっ！" x={420} y={560} start={LAY} end={ASK} size={120} />
      </svg>
      <Caption
        text="たまご どこから？"
        start={ASK + 5}
        end={GUESS - 5}
        position="top"
        size={100}
      />
      <Caption
        text="おしり から？"
        start={GUESS + 5}
        end={RIGHT - 5}
        position="top"
        size={100}
      />
      <Caption
        text="あたり！"
        start={RIGHT + 5}
        end={HOW - 5}
        position="top"
        size={120}
        color="#ffe14d"
      />
      <Caption
        text="でも どうやって できるの？"
        start={HOW + 5}
        end={S01_DURATION}
        position="top"
        size={92}
      />
    </AbsoluteFill>
  );
};
