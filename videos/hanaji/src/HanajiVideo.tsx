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
import { S02Tunnel, S02_DURATION } from "./scenes/S02Tunnel";
import { S03Thin, S03_DURATION } from "./scenes/S03Thin";
import { S04When, S04_DURATION } from "./scenes/S04When";
import { S05Why, S05_DURATION } from "./scenes/S05Why";
import { S06Stop, S06_DURATION } from "./scenes/S06Stop";
import { S07Dont, S07_DURATION } from "./scenes/S07Dont";
import { S08After, S08_DURATION } from "./scenes/S08After";
import { S09Recap, S09_DURATION } from "./scenes/S09Recap";
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
  { C: S02Tunnel, d: S02_DURATION },
  { C: S03Thin, d: S03_DURATION },
  { C: S04When, d: S04_DURATION },
  { C: S05Why, d: S05_DURATION },
  { C: S06Stop, d: S06_DURATION },
  { C: S07Dont, d: S07_DURATION },
  { C: S08After, d: S08_DURATION },
  { C: S09Recap, d: S09_DURATION },
];

const presentations = [
  wipe({ direction: "from-left" }),
  fade(),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-top" }),
  fade(),
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-right" }),
  fade(),
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

export const HanajiVideo: React.FC = () => (
  <AbsoluteFill>
    <Scenes />
    <Soundtrack />
  </AbsoluteFill>
);
