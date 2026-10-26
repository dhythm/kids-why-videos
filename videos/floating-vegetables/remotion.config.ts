import { Config } from "@remotion/cli/config";
import os from "node:os";
import path from "node:path";

// 同梱の chrome-headless-shell は icudtl.dat が見つからず落ちるため、puppeteer のものを使う
Config.setBrowserExecutable(
  path.join(
    os.homedir(),
    ".cache/puppeteer/chrome-headless-shell/mac_arm-148.0.7778.97/chrome-headless-shell-mac-arm64/chrome-headless-shell",
  ),
);
Config.setVideoImageFormat("jpeg");
