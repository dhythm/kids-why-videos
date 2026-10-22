import { AbsoluteFill, interpolate, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import timeline from "./timeline.json";
import { Subtitle } from "./parts";
import { Australia, Energy, Intro, Legs, Outro, SceneData, SpringScene, Tail } from "./scenes";

const SCENES: Record<string, (p: { scene: SceneData }) => React.ReactNode> = {
  intro: Intro,
  legs: Legs,
  spring: SpringScene,
  energy: Energy,
  tail: Tail,
  australia: Australia,
  outro: Outro,
};

const data = timeline as SceneData[];
export const TOTAL_FRAMES = data.reduce((sum, s) => sum + s.frames, 0);

function FadeIn({ children, frames }: { children: React.ReactNode; frames: number }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity, backgroundColor: "#fff" }}>{children}</AbsoluteFill>;
}

function SceneWithVoice({ scene }: { scene: SceneData }) {
  const Comp = SCENES[scene.id];
  if (!Comp) throw new Error(`シーンが みつかりません: ${scene.id}`);
  return (
    <FadeIn frames={scene.frames}>
      <Comp scene={scene} />
      {scene.lines.map((line, i) => {
        const next = scene.lines[i + 1];
        const dur = (next ? next.from : scene.frames) - line.from;
        return (
          <Sequence key={line.file} from={line.from} durationInFrames={dur}>
            <Audio src={staticFile(line.file)} />
            <Subtitle text={line.sub} start={0} />
          </Sequence>
        );
      })}
    </FadeIn>
  );
}

export function Main() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#fff" }}>
      <Audio src={staticFile("sfx/bgm.wav")} volume={0.13} />
      <Series>
        {data.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.frames}>
            <SceneWithVoice scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
}
