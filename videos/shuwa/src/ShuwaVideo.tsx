import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  linearTiming,
  TransitionPresentation,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { S01Intro, S01_DURATION } from "./scenes/S01Intro";
import { S02Ear, S02_DURATION } from "./scenes/S02Ear";
import { S03Call, S03_DURATION } from "./scenes/S03Call";
import { S04Eyes, S04_DURATION } from "./scenes/S04Eyes";
import { S05Language, S05_DURATION } from "./scenes/S05Language";
import { S06Face, S06_DURATION } from "./scenes/S06Face";
import { S07Places, S07_DURATION } from "./scenes/S07Places";
import { S08Silent, S08_DURATION } from "./scenes/S08Silent";
import { S09HowTo, S09_DURATION } from "./scenes/S09HowTo";
import { S10Try, S10_DURATION } from "./scenes/S10Try";
import { S11Recap, S11_DURATION } from "./scenes/S11Recap";
import {
  bgmVolume,
  buildCues,
  findOverlaps,
  NarrationLine,
  VoiceManifest,
  voicedLines,
} from "./lib/cues";
import narration from "./narration.json";
import manifest from "./voiceover-manifest.json";

const T = 20; // トランジションの ながさ

export const SCENES = [
  { C: S01Intro, d: S01_DURATION },
  { C: S02Ear, d: S02_DURATION },
  { C: S03Call, d: S03_DURATION },
  { C: S04Eyes, d: S04_DURATION },
  { C: S05Language, d: S05_DURATION },
  { C: S06Face, d: S06_DURATION },
  { C: S07Places, d: S07_DURATION },
  { C: S08Silent, d: S08_DURATION },
  { C: S09HowTo, d: S09_DURATION },
  { C: S10Try, d: S10_DURATION },
  { C: S11Recap, d: S11_DURATION },
];

const presentations = [
  wipe({ direction: "from-left" }),
  fade(),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-top" }),
  fade(),
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  fade(),
  wipe({ direction: "from-left" }),
] as unknown as TransitionPresentation<Record<string, unknown>>[];

export const TOTAL_DURATION =
  SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);

const CUES = buildCues(
  voicedLines(narration as NarrationLine[], manifest as VoiceManifest),
  manifest as VoiceManifest,
  SCENES.map((s) => s.d),
  T,
  30,
);

// せりふが まえや つぎの せりふに かさなったら、かきだしを とめて しらせる
const MIN_GAP = 6;
const OVERLAPS = findOverlaps(CUES, MIN_GAP);
if (OVERLAPS.length > 0) {
  throw new Error(
    `ナレーションが かさなっています: ${OVERLAPS.map((o) => `${o.id}→${o.next}（あいだ ${o.gap}f）`).join(", ")}`,
  );
}

const Soundtrack: React.FC = () => (
  <>
    <Audio
      src={staticFile("bgm.mp3")}
      volume={(f) => bgmVolume(f, CUES, 0.5, 0.18)}
    />
    {CUES.map((c) => (
      <Sequence
        key={c.id}
        from={c.from}
        durationInFrames={c.frames + 2}
        layout="none"
      >
        <Audio src={staticFile(`voiceover/${c.id}.mp3`)} volume={1} />
      </Sequence>
    ))}
  </>
);

const Scenes: React.FC = () => (
  <TransitionSeries>
    {SCENES.flatMap(({ C, d }, i) => {
      const items = [
        <TransitionSeries.Sequence key={`s${i}`} durationInFrames={d}>
          <C />
        </TransitionSeries.Sequence>,
      ];
      if (i < SCENES.length - 1) {
        items.push(
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={presentations[i]}
            timing={linearTiming({ durationInFrames: T })}
          />,
        );
      }
      return items;
    })}
  </TransitionSeries>
);

export const ShuwaVideo: React.FC = () => (
  <AbsoluteFill>
    <Scenes />
    <Soundtrack />
  </AbsoluteFill>
);
