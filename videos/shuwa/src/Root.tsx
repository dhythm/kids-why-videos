import { Composition } from "remotion";
import { ShuwaVideo, SCENES, TOTAL_DURATION } from "./ShuwaVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Shuwa"
        component={ShuwaVideo}
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
