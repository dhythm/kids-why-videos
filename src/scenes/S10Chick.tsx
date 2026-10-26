import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Chick, Egg, FarmBg, Hen, Nest } from "../components/Farm";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop, shake } from "../lib/anim";

export const S10_DURATION = 720;

const DAYS = 90;
const DAYS_END = 270;
const STEP_ASIDE = 280;
const CRACK = 330;
const HATCH = 380;
const END = 490;

export const S10Chick: React.FC = () => {
  const f = useCurrentFrame();
  const night =
    f > DAYS && f < DAYS_END
      ? 0.5 - 0.5 * Math.cos(((f - DAYS) / (DAYS_END - DAYS)) * Math.PI * 6)
      : 0;
  const henX = ip(
    f,
    [STEP_ASIDE, STEP_ASIDE + 40],
    [820, 1240],
    Easing.inOut(Easing.quad),
  );
  const henY = ip(f, [STEP_ASIDE - 10, STEP_ASIDE + 5], [640, 560]);
  const standing = f >= STEP_ASIDE - 5;
  const crack = ip(f, [CRACK, HATCH], [0, 1]);
  const [wx] = f >= CRACK && f < HATCH ? shake(f, 5) : [0];
  const hatch = pop(f, HATCH, 18);
  const kidIn = ip(
    f,
    [END - 20, END + 20],
    [2300, 1720],
    Easing.out(Easing.quad),
  );

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <FarmBg frame={f} night={night} />
        <Nest x={820} y={800} s={1.1} />
        {/* たまご たち */}
        <Egg x={700} y={770} s={0.9} rotate={-10} />
        <Egg x={940} y={775} s={0.9} rotate={12} />
        {f < HATCH ? (
          <Egg x={820 + wx} y={760} s={1.0} crack={crack} />
        ) : (
          <g>
            {/* われた から */}
            <g
              transform={`translate(${820 - hatch * 60} ${790}) rotate(${-hatch * 30})`}
            >
              <path
                d="M -50 0 L -30 -12 L -14 4 L 4 -14 L 20 2 L 36 -12 L 50 0 C 48 30 26 44 0 44 C -26 44 -48 30 -50 0 Z"
                fill="#fff4e0"
                stroke="#2b2b4a"
                strokeWidth={5}
              />
            </g>
            <Chick
              x={820}
              y={ip(
                f,
                [HATCH, HATCH + 20],
                [790, 690],
                Easing.out(Easing.back(2)),
              )}
              s={0.9 * hatch}
              frame={f}
              hop={f > HATCH + 40 ? 0.6 : 0}
              beakOpen={Math.abs(Math.sin(f * 0.3))}
            />
            <g
              transform={`translate(${820 + hatch * 70} ${700 - hatch * 70}) rotate(${hatch * 40}) scale(${1 - ip(f, [HATCH + 30, HATCH + 60], [0, 1])})`}
            >
              <path
                d="M -50 0 L -30 -12 L -14 4 L 4 -14 L 20 2 L 36 -12 L 50 0 C 50 -30 30 -62 0 -62 C -30 -62 -50 -30 -50 0 Z"
                fill="#fff4e0"
                stroke="#2b2b4a"
                strokeWidth={5}
                transform="scale(1 -1) translate(0 30)"
              />
            </g>
          </g>
        )}
        <Hen
          x={henX}
          y={standing ? henY : 640}
          s={1.1}
          frame={f}
          sitting={!standing || f < STEP_ASIDE}
          walk={f >= STEP_ASIDE && f < STEP_ASIDE + 40 ? 1 : 0}
          flip={f >= STEP_ASIDE + 40}
          mood={night > 0.5 ? "sleep" : f >= HATCH ? "wow" : "smile"}
          flap={f >= HATCH && f < HATCH + 40 ? 1 : 0}
        />
        <Nest x={820} y={800} s={1.1} front />
        {/* ぬくぬく の ハート */}
        {f > 20 && f < STEP_ASIDE
          ? [0, 1, 2].map((i) => {
              const t = ((f + i * 25) % 75) / 75;
              return (
                <path
                  key={i}
                  d="M 0 10 C -30 -15 -20 -40 0 -25 C 20 -40 30 -15 0 10 Z"
                  fill="#ff8fab"
                  stroke="#2b2b4a"
                  strokeWidth={3}
                  transform={`translate(${700 + i * 120} ${540 - t * 160}) scale(${1.2 * (1 - t * 0.4)})`}
                  opacity={1 - t}
                />
              );
            })
          : null}
        {f >= HATCH + 10
          ? [0, 1, 2, 3].map((i) => (
              <Sparkle
                key={i}
                x={820 + Math.cos(i * 1.6) * 200}
                y={650 + Math.sin(i * 1.6) * 160}
                s={
                  pop(f, HATCH + 10 + i * 5, 14) *
                  (0.8 + Math.sin(f * 0.2 + i) * 0.2)
                }
              />
            ))
          : null}
        {f >= END - 20 ? (
          <Kid
            x={kidIn}
            y={640}
            s={1.1}
            frame={f}
            armUp={f > END + 20 ? 1 : 0}
            mood="wow"
          />
        ) : null}
        <Sfx
          text="ぬくぬく"
          x={1350}
          y={420}
          start={25}
          end={DAYS}
          size={110}
          color="#ff8fab"
        />
        <Sfx
          text="ぱきっ"
          x={1050}
          y={560}
          start={CRACK + 10}
          end={HATCH + 10}
          size={110}
          color="#ffffff"
        />
        <Sfx
          text="ぴよっ！"
          x={560}
          y={520}
          start={HATCH + 5}
          end={END}
          size={130}
        />
      </svg>
      <Caption
        text="おかあさんが あたためると…"
        start={15}
        end={CRACK - 5}
        position="top"
        size={88}
      />
      <Caption
        text="ひよこ に なる たまご も あるよ"
        start={HATCH}
        end={END - 5}
        position="top"
        size={84}
        color="#ffe14d"
      />
      <Caption
        text="たまご って すごいね！"
        start={END}
        end={S10_DURATION}
        position="top"
        size={100}
      />
    </AbsoluteFill>
  );
};
