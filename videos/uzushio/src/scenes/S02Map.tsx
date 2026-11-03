import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { INK, LAND, Pill, WaveLine, Whirl } from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S02_DURATION = 360;

const NARUTO = 20; // なるとかいきょう
const ZOOM = 150; // とくしまけんと あわじしまの あいだ
const STRAIT = { x: 1040, y: 690 };

export const S02Map: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = ip(f, [ZOOM + 40, ZOOM + 100], [1, 1.35]);
  const pulse = 1 + 0.08 * Math.sin(f * 0.2);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#9ad7f5" />
        <g
          transform={`translate(${STRAIT.x} ${STRAIT.y}) scale(${zoom}) translate(${-STRAIT.x} ${-STRAIT.y})`}
        >
          <WaveLine y={420} frame={f} opacity={0.5} />
          <WaveLine y={900} frame={f + 50} opacity={0.5} />
          {/* ほんしゅう */}
          <path
            d="M 700 -20 L 1940 -20 L 1940 320 C 1700 370 1500 250 1300 280 C 1150 300 1000 220 820 190 Z"
            fill={LAND}
            stroke={INK}
            strokeWidth={7}
          />
          {/* あわじしま */}
          <path
            d="M 1220 330 C 1290 320 1320 390 1305 480 C 1290 570 1230 650 1110 680 C 1060 690 1050 650 1075 610 C 1120 530 1160 410 1220 330 Z"
            fill={LAND}
            stroke={INK}
            strokeWidth={7}
          />
          {/* しこく */}
          <path
            d="M -20 420 C 250 380 520 470 780 510 C 900 530 980 640 1005 720 C 1020 790 1090 900 1110 1100 L -20 1100 Z"
            fill={LAND}
            stroke={INK}
            strokeWidth={7}
          />
          <Pill
            text="とくしまけん"
            x={700}
            y={830}
            s={pop(f, ZOOM + 5, 16)}
            frame={f}
            size={56}
          />
          <Pill
            text="あわじしま"
            x={1360}
            y={470}
            s={pop(f, ZOOM + 35, 16)}
            frame={f}
            size={56}
          />
          <g
            transform={`translate(${STRAIT.x} ${STRAIT.y}) scale(${pop(f, NARUTO + 20, 18) * pulse})`}
          >
            <circle
              r={70}
              fill="none"
              stroke="#ff4d6d"
              strokeWidth={10}
              strokeDasharray="20 12"
            />
            <Whirl x={0} y={0} r={42} frame={f} speed={6} />
          </g>
        </g>
        <Sfx
          text="せまい！"
          x={1500}
          y={880}
          start={ZOOM + 100}
          end={S02_DURATION}
          size={110}
          color="#ffffff"
        />
      </svg>
      <Caption
        text="なるとかいきょう"
        start={NARUTO + 5}
        end={S02_DURATION}
        position="top"
        size={110}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
