import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Bandage, Bell, Knee, Medicine, Shirt } from "../components/Bansoko";
import { Sparkle } from "../components/Kid";
import { Cross, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { painLevel } from "../lib/wound";
import { DURATIONS } from "../lib/durations";

export const S05_DURATION = DURATIONS[4];

const BELL = 20; // いたいのは おしらせ ベル
const NOTMED = 250; // くすり じゃない
const TOUCH = 390; // さわるのを ふせぐ だけ
const QUIET = 580; // なおると しずかに

const KNEE = { x: 620, y: 620 };
const BELL_POS = { x: 1380, y: 520 };

/** きずから ベルへ とどく おしらせ（つぶが はしる） */
const Signal: React.FC<{ frame: number; strength: number }> = ({ frame, strength }) => (
  <g opacity={strength}>
    {new Array(7).fill(0).map((_, i) => {
      const t = ((frame * 0.03 + i / 7) % 1 + 1) % 1;
      const x = KNEE.x + 70 + (BELL_POS.x - 190 - KNEE.x - 70) * t;
      const y = KNEE.y - 30 + (BELL_POS.y - KNEE.y + 30) * t - Math.sin(t * Math.PI) * 150;
      return <circle key={i} cx={x} cy={y} r={14} fill="#ff7b54" stroke="#2b2b4a" strokeWidth={4} />;
    })}
  </g>
);

export const S05Pain: React.FC = () => {
  const f = useCurrentFrame();
  const toTouch = ip(f, [TOUCH - 12, TOUCH + 8], [0, 1]);
  const toQuiet = ip(f, [QUIET - 12, QUIET + 8], [0, 1]);
  const heal = ip(f, [QUIET + 10, QUIET + 110], [0.1, 1]);
  // ふくが ゆれて、きずに さわる（swing が 1 に ちかいとき さわっている）
  const swing = Math.sin((f - TOUCH) * 0.11);
  const touching = swing > 0.75;
  const dip = Math.max(0, swing) * 205;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* 1. おしらせ ベル ／ くすり じゃない */}
        <g opacity={1 - toTouch}>
          <DotsBg color="#fff0f0" dot="#ffdede" />
          <Knee x={KNEE.x} y={KNEE.y} s={0.9} heal={0} />
          <Signal frame={f} strength={pop(f, BELL + 20)} />
          <Bandage x={KNEE.x} y={KNEE.y} s={0.9 * pop(f, NOTMED + 10, 14)} rot={-16} />
          <Bell x={BELL_POS.x} y={BELL_POS.y} s={1.9 * pop(f, BELL + 10)} ring={1} frame={f} />
          <Sfx text="りんりん！" x={1500} y={850} start={BELL + 35} end={TOUCH - 15} size={100} />
          <Pill text="ここ けがしたよ" x={640} y={410} s={pop(f, BELL + 120) * (f < NOTMED ? 1 : 0)} size={56} color="#fff3a8" frame={f} />
          <Medicine x={1040} y={830} s={1.2 * pop(f, NOTMED + 30)} />
          <Cross x={1040} y={830} s={1.1 * pop(f, NOTMED + 55, 12)} />
        </g>
        {/* 2. ふくが さわる: はっていないと ちくっ、はっていると へいき */}
        <g opacity={toTouch * (1 - toQuiet)}>
          <DotsBg color="#eaf6ff" dot="#d6ecff" />
          {[0, 1].map((i) => {
            const kx = 560 + i * 900;
            const ky = 700;
            return (
              <g key={i}>
                <Knee x={kx} y={ky} s={0.7} heal={0} />
                {i === 1 ? <Bandage x={kx} y={ky} s={0.7} rot={-16} /> : null}
                <Shirt x={kx + 10} y={ky - 330 + dip} s={1.1} rot={Math.cos((f - TOUCH) * 0.11) * 6} color={i ? "#ffb86b" : "#7fd6a8"} />
                <Bell x={kx + 340} y={ky - 300} s={0.75} ring={i === 0 ? (touching ? 1 : 0.2) : 0.05} frame={f} />
              </g>
            );
          })}
          {touching ? <Sfx text="ちくっ！" x={260} y={560} start={0} end={S05_DURATION} size={96} color="#ff8fa3" /> : null}
          <Pill text="いたっ" x={560} y={990} s={pop(f, TOUCH + 40)} size={56} color="#ffe0e0" frame={f} />
          <Pill text="へいき" x={1460} y={990} s={pop(f, TOUCH + 60)} size={56} color="#d9f7e1" frame={f} />
        </g>
        {/* 3. なおって くると ベルは しずかに */}
        <g opacity={toQuiet}>
          <DotsBg color="#eef8e4" dot="#dcf0c8" />
          <Knee x={KNEE.x} y={KNEE.y} s={0.9} heal={heal} />
          <Bell x={BELL_POS.x} y={BELL_POS.y} s={1.9} ring={painLevel(heal)} frame={f} />
          <Sfx text="しーん" x={1500} y={850} start={QUIET + 105} end={S05_DURATION} size={100} color="#ffffff" />
          {heal >= 1
            ? [0, 1, 2].map((i) => (
                <Sparkle key={i} x={KNEE.x - 90 + i * 90} y={KNEE.y - 110 + (i % 2) * 40} s={pop(f, QUIET + 112 + i * 5, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))} />
              ))
            : null}
        </g>
      </svg>
      <Caption text="いたい ＝ おしらせ" start={BELL + 10} end={NOTMED - 10} position="top" size={96} />
      <Caption text="くすり じゃない" start={NOTMED + 15} end={TOUCH - 15} position="top" size={104} color="#ffe14d" />
      <Caption text="さわるのを ふせぐ" start={TOUCH + 15} end={QUIET - 15} position="top" size={96} />
      <Caption text="なおると しずか" start={QUIET + 20} end={S05_DURATION} position="top" size={100} />
    </AbsoluteFill>
  );
};
