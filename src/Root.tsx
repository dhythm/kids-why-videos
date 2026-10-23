import React from "react";
import { Composition } from "remotion";
import { FloatSink, TOTAL_FRAMES } from "./Video";

export function RemotionRoot() {
  return <Composition id="FloatSink" component={FloatSink} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
}
