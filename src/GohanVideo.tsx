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
import { S02Map, S02_DURATION } from "./scenes/S02Map";
import { S03Mouth, S03_DURATION } from "./scenes/S03Mouth";
import { S04Esophagus, S04_DURATION } from "./scenes/S04Esophagus";
import { S05Stomach, S05_DURATION } from "./scenes/S05Stomach";
import { S06SmallIntestine, S06_DURATION } from "./scenes/S06SmallIntestine";
import { S07Energy, S07_DURATION } from "./scenes/S07Energy";
import { S08LargeIntestine, S08_DURATION } from "./scenes/S08LargeIntestine";
import { S09Toilet, S09_DURATION } from "./scenes/S09Toilet";
import { S10Letter, S10_DURATION } from "./scenes/S10Letter";
import { bgmVolume, buildCues, NarrationLine, VoiceManifest } from "./lib/cues";
import narration from "./narration.json";
import manifest from "./voiceover-manifest.json";

const T = 20; // トランジションの ながさ

export const SCENES = [
  { C: S01Intro, d: S01_DURATION },
  { C: S02Map, d: S02_DURATION },
  { C: S03Mouth, d: S03_DURATION },
  { C: S04Esophagus, d: S04_DURATION },
  { C: S05Stomach, d: S05_DURATION },
  { C: S06SmallIntestine, d: S06_DURATION },
  { C: S07Energy, d: S07_DURATION },
  { C: S08LargeIntestine, d: S08_DURATION },
  { C: S09Toilet, d: S09_DURATION },
  { C: S10Letter, d: S10_DURATION },
];

const presentations = [
  slide({ direction: "from-right" }),
  wipe({ direction: "from-top" }),
  slide({ direction: "from-top" }),
  slide({ direction: "from-top" }),
  wipe({ direction: "from-left" }),
  fade(),
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-right" }),
  fade(),
] as unknown as TransitionPresentation<Record<string, unknown>>[];

export const TOTAL_DURATION =
  SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);

const CUES = buildCues(
  narration as NarrationLine[],
  manifest as VoiceManifest,
  SCENES.map((s) => s.d),
  T,
  30,
);

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
        durationInFrames={c.frames + 15}
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

export const GohanVideo: React.FC = () => (
  <AbsoluteFill>
    <Scenes />
    <Soundtrack />
  </AbsoluteFill>
);
