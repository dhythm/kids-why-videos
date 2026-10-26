import { Composition } from "remotion";
import { RocketVideo, SCENES, TOTAL_DURATION } from "./RocketVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RocketToMoon"
        component={RocketVideo}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      {SCENES.map(({ C, d }, i) => (
        <Composition
          key={i}
          id={`Scene${String(i + 1).padStart(2, "0")}`}
          component={C}
          durationInFrames={d}
          fps={30}
          width={1920}
          height={1080}
        />
      ))}
    </>
  );
};
