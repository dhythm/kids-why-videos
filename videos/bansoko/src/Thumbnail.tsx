import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

/** YouTube 用に描き下ろしたサムネイルをプレビュー・書き出しにも使用する。 */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <Img
      src={staticFile("thumbnail.jpg")}
      alt="ばんそうこうは なんで はるの？"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  </AbsoluteFill>
);
