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
import { S02Distance, S02_DURATION } from "./scenes/S02Distance";
import { S03Parts, S03_DURATION } from "./scenes/S03Parts";
import { S04Push, S04_DURATION } from "./scenes/S04Push";
import { S05Launch, S05_DURATION } from "./scenes/S05Launch";
import { S06Separation, S06_DURATION } from "./scenes/S06Separation";
import { S07EarthOrbit, S07_DURATION } from "./scenes/S07EarthOrbit";
import { S08Journey, S08_DURATION } from "./scenes/S08Journey";
import {
  S09Landing,
  S09MoonArrive,
  S09A_DURATION,
  S09B_DURATION,
} from "./scenes/S09Moon";
import { S10Return, S10_DURATION } from "./scenes/S10Return";
import { bgmVolume, buildCues, NarrationLine, VoiceManifest } from "./lib/cues";
import narration from "./narration.json";
import manifest from "./voiceover-manifest.json";

const T = 20; // トランジションの ながさ

export const SCENES = [
  { C: S01Intro, d: S01_DURATION },
  { C: S02Distance, d: S02_DURATION },
  { C: S03Parts, d: S03_DURATION },
  { C: S04Push, d: S04_DURATION },
  { C: S05Launch, d: S05_DURATION },
  { C: S06Separation, d: S06_DURATION },
  { C: S07EarthOrbit, d: S07_DURATION },
  { C: S08Journey, d: S08_DURATION },
  { C: S09MoonArrive, d: S09A_DURATION },
  { C: S09Landing, d: S09B_DURATION },
  { C: S10Return, d: S10_DURATION },
];

const presentations = [
  slide({ direction: "from-right" }),
  wipe({ direction: "from-left" }),
  slide({ direction: "from-bottom" }),
  fade(),
  fade(),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-right" }),
  fade(),
  fade(),
  slide({ direction: "from-top" }),
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

export const RocketVideo: React.FC = () => (
  <AbsoluteFill>
    <Scenes />
    <Soundtrack />
  </AbsoluteFill>
);
