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
import { S02Clock, S02_DURATION } from "./scenes/S02Clock";
import { S03Blocks, S03_DURATION } from "./scenes/S03Blocks";
import { S04Quick, S04_DURATION } from "./scenes/S04Quick";
import { S05Slow, S05_DURATION } from "./scenes/S05Slow";
import { S06Cry, S06_DURATION } from "./scenes/S06Cry";
import { S07Night, S07_DURATION } from "./scenes/S07Night";
import { S08Tips, S08_DURATION } from "./scenes/S08Tips";
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
  { C: S02Clock, d: S02_DURATION },
  { C: S03Blocks, d: S03_DURATION },
  { C: S04Quick, d: S04_DURATION },
  { C: S05Slow, d: S05_DURATION },
  { C: S06Cry, d: S06_DURATION },
  { C: S07Night, d: S07_DURATION },
  { C: S08Tips, d: S08_DURATION },
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

export const JikanVideo: React.FC = () => (
  <AbsoluteFill>
    <Scenes />
    <Soundtrack />
  </AbsoluteFill>
);
