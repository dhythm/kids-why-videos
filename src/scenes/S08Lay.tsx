import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import { getLength } from "@remotion/paths";
import {
  DUCT_PATH,
  DUCT_SEGMENTS,
  Egg,
  FarmBg,
  Hen,
  Nest,
  VENT,
} from "../components/Farm";
import { HenInside } from "../components/HenInside";
import { Sparkle } from "../components/Kid";
import { Tag } from "../components/Tag";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop, shake } from "../lib/anim";
import { pointAt } from "../lib/path";

export const S08_DURATION = 720;

const TRAVEL = 20;
const GUT = 150;
const CLOSE = 270;
const OUT = 470;
const LAY = 560;
const SHINE = 610;

const HX = 860;
const HY = 650;
const HS = 1.55;

const SEG_LEN = DUCT_SEGMENTS.map((s) => getLength(s.d));
const SHELL_START = SEG_LEN[0] + SEG_LEN[1];
const STOP = getLength(DUCT_PATH) - 12;

export const S08Lay: React.FC = () => {
  const f = useCurrentFrame();
  const xray = ip(f, [0, 15], [0, 1]) * ip(f, [OUT, OUT + 30], [1, 0]);
  const t = ip(f, [TRAVEL, GUT - 10], [0, 1], Easing.inOut(Easing.sin));
  const p = pointAt(DUCT_PATH, SHELL_START + (STOP - SHELL_START) * t);
  const straining = f >= OUT + 30 && f < LAY;
  const [sx] = straining ? shake(f, 4) : [0];
  const ventX = HX + VENT.x * HS;
  const ventY = HY + VENT.y * HS;
  const lay = ip(f, [LAY, LAY + 25], [0, 1], Easing.out(Easing.back(1.6)));
  const wet =
    ip(f, [SHINE, SHINE + 20], [0, 1]) *
    ip(f, [S08_DURATION - 60, S08_DURATION - 20], [1, 0.3]);

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <FarmBg frame={f} />
        <rect
          x={0}
          y={0}
          width={1920}
          height={1080}
          fill="#ffe3ec"
          opacity={xray * 0.85}
        />
        <Nest x={HX} y={HY + 230} s={1.55} />
        <Hen
          x={HX + sx}
          y={HY}
          s={HS}
          frame={f}
          sitting
          xray={xray}
          mood={straining ? "strain" : f >= LAY && f < SHINE ? "wow" : "smile"}
          flap={f >= LAY && f < LAY + 30 ? 1 : 0}
          inside={
            <>
              <HenInside
                frame={f}
                colored={0}
                gut={ip(f, [GUT, GUT + 20], [0, 1])}
                gutClosed={pop(f, CLOSE + 10, 16)}
                ventGlow={ip(f, [GUT - 20, GUT + 10], [0, 1])}
              />
              <Egg x={p.x} y={p.y} s={0.42} rotate={70} />
            </>
          }
        />
        {f >= LAY ? (
          <Egg
            x={ventX - 30 - lay * 70}
            y={ventY + 20 + lay * 120}
            s={1.4 * pop(f, LAY, 14)}
            rotate={-25 + lay * 25}
            wet={wet}
            face={f >= SHINE}
            frame={f}
          />
        ) : null}
        <Nest x={HX} y={HY + 230} s={1.55} front />
        <Tag
          text="うんち の みち"
          x={1500}
          y={900}
          toX={HX + 20 * HS}
          toY={HY + 118 * HS}
          start={GUT + 15}
          end={OUT}
          color="#e3b48a"
        />
        {/* おやすみ の Zzz */}
        {f >= CLOSE + 10 && f < OUT
          ? [0, 1, 2].map((i) => (
              <text
                key={i}
                x={HX + 260 + i * 50}
                y={HY + 300 - i * 50 - ((f * 0.8 + i * 20) % 30)}
                style={{
                  fontFamily: "sans-serif",
                  fontWeight: 900,
                  fontSize: 50 + i * 14,
                }}
                fill="#6c63ff"
                opacity={pop(f, CLOSE + 15 + i * 8, 12)}
              >
                Z
              </text>
            ))
          : null}
        {f >= SHINE
          ? [0, 1, 2, 3].map((i) => (
              <Sparkle
                key={i}
                x={ventX - 100 + Math.cos(i * 1.7) * 150}
                y={ventY + 170 + Math.sin(i * 1.9) * 120}
                s={
                  pop(f, SHINE + i * 6, 14) *
                  (0.8 + Math.sin(f * 0.2 + i) * 0.2)
                }
                color={random(`c${i}`) > 0.5 ? "#ffe14d" : "#ffffff"}
              />
            ))
          : null}
        <Sfx
          text="ぱたん"
          x={1550}
          y={430}
          start={CLOSE + 5}
          end={CLOSE + 70}
          size={100}
          color="#ff8fab"
        />
        <Sfx
          text="うーん…"
          x={1500}
          y={300}
          start={OUT + 35}
          end={LAY}
          size={110}
          color="#ffffff"
        />
        <Sfx
          text="ぽんっ！"
          x={330}
          y={560}
          start={LAY}
          end={SHINE + 20}
          size={130}
        />
        <Sfx
          text="ぴかぴか"
          x={1500}
          y={300}
          start={SHINE + 10}
          end={S08_DURATION}
          size={110}
        />
      </svg>
      <Caption
        text="いよいよ おしり の あなへ"
        start={10}
        end={GUT - 5}
        position="top"
        size={88}
      />
      <Caption
        text="うんち と おなじ あな！"
        start={GUT + 5}
        end={CLOSE - 5}
        position="top"
        size={92}
      />
      <Caption
        text="うんちの みち は おやすみ"
        start={CLOSE + 5}
        end={OUT + 20}
        position="top"
        size={88}
      />
      <Caption
        text="うまれた！"
        start={LAY + 10}
        end={S08_DURATION}
        position="top"
        size={120}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
