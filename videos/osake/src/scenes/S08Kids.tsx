import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { BeerMug, JuiceGlass } from "../components/Home";
import { Alco, BigX, Liver, Pill } from "../components/Things";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, FONT, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S08_DURATION = 700;

const LIVERS = 190;
const RULE = 390;

export const S08Kids: React.FC = () => {
  const f = useCurrentFrame();
  // こどもが ぐんぐん そだつ
  const grow = 0.85 + ip(f, [30, 150], [0, 0.2], Easing.inOut(Easing.quad));
  const kidX = ip(
    f,
    [LIVERS - 20, LIVERS + 10],
    [960, 420],
    Easing.inOut(Easing.quad),
  );
  const livers = ip(f, [LIVERS, LIVERS + 20, RULE - 15, RULE], [0, 1, 1, 0]);
  const rule = f >= RULE;

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#eafbe7" />
        <rect y={900} width={1920} height={180} fill="#b6e3a8" />

        {/* せいくらべの はしら */}
        <g opacity={ip(f, [LIVERS - 20, LIVERS], [1, 0])}>
          <rect
            x={1230}
            y={240}
            width={70}
            height={660}
            rx={12}
            fill="#e0b07a"
            stroke="#2b2b4a"
            strokeWidth={6}
          />
          {new Array(8).fill(0).map((_, i) => (
            <line
              key={i}
              x1={1230}
              y1={300 + i * 75}
              x2={1270}
              y2={300 + i * 75}
              stroke="#2b2b4a"
              strokeWidth={5}
            />
          ))}
          <path
            d={`M 1340 ${820 - (grow - 0.85) * 1500} L 1340 ${700 - (grow - 0.85) * 1500} M 1310 ${730 - (grow - 0.85) * 1500} L 1340 ${700 - (grow - 0.85) * 1500} L 1370 ${730 - (grow - 0.85) * 1500}`}
            stroke="#4cc38a"
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={pop(f, 40, 14)}
          />
        </g>

        <Kid
          x={kidX}
          y={900 - 170 * grow}
          s={grow}
          frame={f}
          armUp={rule ? ip(f, [RULE + 140, RULE + 160], [0, 0.5]) : 0}
          mood={livers > 0.5 ? "wow" : "smile"}
          run={f > LIVERS - 20 && f < LIVERS + 10 ? 1 : 0}
        />
        {rule && f >= RULE + 150 ? (
          <g
            transform={`translate(${kidX + 160 * grow} ${900 - 170 * grow - 20}) scale(${pop(f, RULE + 150, 14)})`}
          >
            <JuiceGlass s={0.8} />
          </g>
        ) : null}

        {/* おとな の かんぞう と こども の かんぞう */}
        {livers > 0 ? (
          <g opacity={livers}>
            <Liver x={1050} y={560} s={1.0} frame={f} swing={1} />
            <Pill text="おとな" x={1050} y={760} s={1} frame={f} />
            <Liver
              x={1580}
              y={620}
              s={0.55}
              frame={f + 5}
              swing={0.3}
              mood="wow"
              sweat={ip(f, [LIVERS + 60, LIVERS + 90], [0, 1])}
            />
            <Pill text="こども" x={1580} y={760} s={1} frame={f} />
            {/* こどもの かんぞうの まわりに アルコールが たまる */}
            {[0, 1, 2, 3, 4].map((i) => (
              <Alco
                key={i}
                x={1580 + Math.cos(i * 1.25 + f * 0.02) * 170}
                y={600 + Math.sin(i * 1.25 + f * 0.02) * 120}
                s={0.75 * pop(f, LIVERS + 30 + i * 12, 12)}
                frame={f + i * 5}
              />
            ))}
          </g>
        ) : null}

        {/* おさけは はたち から */}
        {rule ? (
          <g>
            <g
              transform={`translate(1050 640) scale(${pop(f, RULE + 10, 16)})`}
            >
              <BeerMug frame={f} s={1.6} />
            </g>
            <BigX
              x={1090}
              y={530}
              s={1.2}
              p={ip(f, [RULE + 30, RULE + 60], [0, 1])}
            />
            <g
              transform={`translate(1560 520) scale(${pop(f, RULE + 80, 18)})`}
            >
              <circle
                r={190}
                fill="#ffe14d"
                stroke="#2b2b4a"
                strokeWidth={10}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                y={-30}
                style={{ fontFamily: FONT, fontWeight: 800, fontSize: 150 }}
                fill="#2b2b4a"
              >
                20
              </text>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                y={90}
                style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60 }}
                fill="#2b2b4a"
              >
                さい
              </text>
            </g>
            {f >= RULE + 90
              ? [0, 1, 2, 3].map((i) => (
                  <Sparkle
                    key={i}
                    x={1560 + Math.cos(i * 1.57 + 0.6) * 250}
                    y={520 + Math.sin(i * 1.57 + 0.6) * 230}
                    s={
                      pop(f, RULE + 90 + i * 5, 12) *
                      (0.9 + Math.sin(f * 0.2 + i) * 0.2)
                    }
                  />
                ))
              : null}
          </g>
        ) : null}

        <Sfx
          text="ぐんぐん"
          x={1500}
          y={420}
          start={40}
          end={LIVERS - 20}
          size={110}
          color="#4cc38a"
        />
        <Sfx
          text="こわせない〜"
          x={1580}
          y={330}
          start={LIVERS + 80}
          end={RULE - 15}
          size={80}
          color="#ff8fab"
          rotate={6}
        />
      </svg>
      <Caption
        text="こどもは そだっている とちゅう"
        start={20}
        end={LIVERS - 5}
        position="top"
        size={84}
      />
      <Caption
        text="かんぞう も まだ ちいさい"
        start={LIVERS + 5}
        end={RULE - 5}
        position="top"
        size={92}
      />
      <Caption
        text="おさけは 20さい から"
        start={RULE + 5}
        end={S08_DURATION}
        position="top"
        size={104}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
