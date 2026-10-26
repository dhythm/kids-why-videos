import { Config } from "@remotion/cli/config";

// 同梱の chrome-headless-shell が起動しない環境向け。REMOTION_BROWSER に別の headless Chrome を指定できる
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
