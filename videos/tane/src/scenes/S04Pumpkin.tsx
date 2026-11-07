import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Cloud } from "../components/Characters";
import { Caption, Sfx } from "../components/Caption";
import {
  BigLeaf,
  Pill,
  Pumpkin,
  PumpkinCut,
  PumpkinFlower,
  Soil,
  STEM,
  Sun,
} from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S04_DURATION = DURATIONS[3];

const FLOWER = 20; // かぼちゃにも きいろい はなが さくよ
const BABY = 125; // はなの したの ちいさな かぼちゃが
const GROW = 175; // ぐんぐん おおきく
const EAT = 285; // この みを たべている
const CUT = 345; // だから たねが ある

const CX = 860;

export const S04Pumpkin: React.FC = () => {
  const f = useCurrentFrame();
  const bloom = ip(f, [FLOWER + 10, FLOWER + 40], [0.1, 1]);
  const grow = ip(f, [GROW, GROW + 70], [0, 1]);
  const wilt = ip(f, [GROW + 10, GROW + 50], [0, 1]);
  // ちいさな かぼちゃ → おおきな かぼちゃ（じめんに おりる）
  const pkS = 0.3 + grow * 0.7;
  const pkY = 520 + grow * 170;
  const flowerY = pkY - 112 * pkS - 70;
  const open = ip(f, [CUT, CUT + 18], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#cdeeff" />
        <Sun x={1700} y={140} frame={f} s={0.8} />
        <Cloud x={420 - f * 0.25} y={160} s={0.8} />
        <Soil y={780} h={300} />
        {/* つる と は */}
        <path
          d="M -20 760 Q 300 700 560 760 T 1100 750 T 1940 760"
          stroke={STEM}
          strokeWidth={16}
          fill="none"
        />
        <BigLeaf x={240} y={750} s={1.1} rot={-10} />
        <BigLeaf x={470} y={760} s={0.9} rot={15} />
        <BigLeaf x={1230} y={760} s={1.0} rot={-12} />

        {/* はなと かぼちゃ */}
        {open <= 0 ? (
          <g>
            <path
              d={`M ${CX - 160} 760 Q ${CX - 60} ${pkY + 40} ${CX} ${pkY}`}
              stroke={STEM}
              strokeWidth={12}
              fill="none"
            />
            {wilt < 1 ? (
              <PumpkinFlower
                x={CX}
                y={flowerY}
                s={1.3 * pop(f, FLOWER) * (1 - wilt * 0.6)}
                bloom={bloom}
                wilt={wilt}
              />
            ) : null}
            <Pumpkin x={CX} y={pkY} s={pkS * pop(f, FLOWER)} />
          </g>
        ) : (
          <PumpkinCut x={CX} y={pkY} open={open} />
        )}

        <Pill
          text="ちいさな かぼちゃ"
          x={CX - 470}
          y={470}
          s={pop(f, BABY + 10) * ip(f, [GROW + 20, GROW + 35], [1, 0])}
          size={60}
          color="#d7f5c2"
          frame={f}
        />
        {f >= BABY + 20 && f < GROW + 30 ? (
          <path
            d={`M ${CX - 250} 500 L ${CX - 60} 540`}
            stroke="#ff7b54"
            strokeWidth={12}
            strokeLinecap="round"
          />
        ) : null}
        <Sfx
          text="ぐんぐん"
          x={CX + 360}
          y={460}
          start={GROW + 10}
          end={EAT - 10}
          size={100}
          color="#a5dc86"
        />

        <Pill
          text="み"
          x={CX}
          y={360}
          s={pop(f, EAT + 10)}
          size={90}
          color="#ff9a8a"
          frame={f}
        />
        <Sfx
          text="パカッ！"
          x={CX + 330}
          y={500}
          start={CUT}
          end={CUT + 50}
          size={90}
          color="#ffb627"
        />
        {f >= CUT + 18
          ? [0, 1, 2, 3].map((i) => (
              <Sparkle
                key={i}
                x={CX + Math.cos(i * 1.6) * 250}
                y={pkY + Math.sin(i * 1.6) * 120}
                s={pop(f, CUT + 18 + i * 4, 12) * (0.8 + 0.2 * Math.sin(f * 0.3 + i))}
              />
            ))
          : null}

        <Kid
          x={1560}
          y={560}
          s={0.72}
          frame={f}
          mood={f >= CUT ? "wow" : "smile"}
          armUp={ip(f, [CUT + 10, CUT + 30], [0, 0.7])}
        />
      </svg>
      <Caption
        text="かぼちゃの はな"
        start={FLOWER + 10}
        end={BABY - 5}
        position="top"
        size={100}
        color="#ffe14d"
      />
      <Caption
        text="みを たべてる！"
        start={EAT + 20}
        end={S04_DURATION}
        position="top"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
