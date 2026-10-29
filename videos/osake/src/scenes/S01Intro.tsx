import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Adult, BeerMug, DiningBg, Table, WineGlass } from "../components/Home";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, FONT, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S01_DURATION = 640;

const CHEERS = 30;
const DRINK = 100;
const KID = 190;
const ASK = 200;
const NO = 330;
const WHAT = 500;

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  // かんぱい → ごくごく → おろす
  const raise =
    f < DRINK
      ? ip(f, [5, CHEERS], [0, 0.42], Easing.out(Easing.back(1.4)))
      : ip(f, [DRINK, DRINK + 20, DRINK + 75, DRINK + 95], [0.42, 1, 1, 0.1]);
  const mamaRaise = ip(
    f,
    [5, CHEERS, CHEERS + 40, CHEERS + 60],
    [0, 0.42, 0.42, 0.1],
  );
  const level = ip(f, [DRINK + 20, DRINK + 75], [1, 0.6], Easing.linear);
  const kidX = ip(
    f,
    [KID - 30, KID + 15],
    [2150, 1560],
    Easing.out(Easing.quad),
  );
  const kidMood = f >= NO && f < NO + 60 ? "wow" : "smile";

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DiningBg frame={f} />
        <Adult
          x={600}
          y={640}
          s={1.1}
          frame={f}
          variant="papa"
          raise={raise}
          mood={f > DRINK + 20 && f < DRINK + 75 ? "sleep" : "smile"}
          hold={<BeerMug frame={f} level={level} s={0.8} />}
        />
        <Adult
          x={1060}
          y={640}
          s={1.1}
          frame={f}
          variant="mama"
          flip
          raise={mamaRaise}
          hold={
            <g transform="translate(0 40)">
              <WineGlass s={0.7} />
            </g>
          }
        />
        <Kid
          x={kidX}
          y={700}
          s={1.05}
          frame={f}
          run={f > KID - 30 && f < KID + 15 ? 1 : 0}
          mood={kidMood}
          armUp={f >= WHAT ? ip(f, [WHAT, WHAT + 15], [0, 0.6]) : 0}
        />
        <Table />

        {/* かちん */}
        {f >= CHEERS - 2 && f < CHEERS + 40
          ? [0, 1, 2, 3].map((i) => (
              <Sparkle
                key={i}
                x={830 + Math.cos(i * 1.6) * 90}
                y={540 + Math.sin(i * 1.6) * 70}
                s={
                  pop(f, CHEERS + i * 3, 12) *
                  ip(f, [CHEERS + 25, CHEERS + 40], [1, 0])
                }
              />
            ))
          : null}

        {/* しゅわしゅわ の まる */}
        {f >= ASK + 20 && f < NO + 10 ? (
          <circle
            cx={760}
            cy={600}
            r={110 + Math.sin(f * 0.2) * 6}
            fill="none"
            stroke="#ff4d6d"
            strokeWidth={10}
            strokeDasharray="22 14"
            opacity={pop(f, ASK + 20, 14) * ip(f, [NO - 5, NO + 10], [1, 0])}
            transform={`rotate(${f * 1.5} 760 600)`}
          />
        ) : null}

        {/* はてな */}
        {(f >= ASK && f < NO) || f >= WHAT
          ? [0, 1, 2].map((i) => {
              const st = f >= WHAT ? WHAT : ASK;
              const bx = f >= WHAT ? 1440 + i * 120 : 1620 + i * 90;
              const by = f >= WHAT ? 220 - (i % 2) * 60 : 230 - i * 50;
              return (
                <g
                  key={i}
                  transform={`translate(${bx} ${by + Math.sin(f * 0.12 + i) * 12}) scale(${pop(f, st + 10 + i * 8, 16)}) rotate(${Math.sin(f * 0.1 + i) * 12})`}
                >
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 130 + i * 15,
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

        <Sfx
          text="かんぱーい！"
          x={830}
          y={250}
          start={CHEERS - 5}
          end={CHEERS + 70}
          size={120}
        />
        <Sfx
          text="ごくごく"
          x={360}
          y={300}
          start={DRINK + 25}
          end={DRINK + 85}
          size={90}
          color="#ffffff"
        />
        <Sfx
          text="しゅわしゅわ"
          x={760}
          y={420}
          start={ASK + 10}
          end={NO - 5}
          size={80}
          color="#9fe7ff"
          rotate={6}
        />
      </svg>
      <Caption
        text="ジュース かな？"
        start={ASK + 40}
        end={NO - 5}
        position="top"
        size={100}
      />
      <Caption
        text="これは「おさけ」"
        start={NO + 5}
        end={NO + 90}
        position="top"
        size={100}
        color="#ffe14d"
      />
      <Caption
        text="おとなの のみもの"
        start={NO + 90}
        end={WHAT - 5}
        position="top"
        size={100}
      />
      <Caption
        text="おさけって なーに？"
        start={WHAT + 5}
        end={S01_DURATION}
        position="top"
        size={110}
      />
    </AbsoluteFill>
  );
};
