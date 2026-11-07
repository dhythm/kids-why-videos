import { Composition } from "remotion";
import { Still } from "remotion";
import { YogurtVideo, SCENES, TOTAL_DURATION } from "./YogurtVideo";
import { Thumbnail } from "./Thumbnail";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Yogurt"
        component={YogurtVideo}
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
      <Still id="Thumbnail" component={Thumbnail} width={1920} height={1080} />
    </>
  );
};
