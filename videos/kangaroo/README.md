# カンガルーは どうして ぴょんぴょん はねるの？

子供向け（未就学〜小学校低学年）の解説動画を Remotion で作るプロジェクト。

## つくりかた

```bash
npm install
# ナレーション生成（Eleven v4）。--engine say で macOS の Kyoko 音声
ELEVENLABS_API_KEY=... python3 scripts/make_voice.py
# BGM（自作の合成音）
uv run --with numpy python scripts/make_bgm.py 104
npx remotion render src/index.ts Kangaroo out/kangaroo.mp4
```

同梱の Chrome が起動しない場合は `REMOTION_BROWSER=<headless Chrome のパス>` を付けて実行する。

## 内容の出典

- Dawson & Taylor (1973): 時速9〜22kmで跳ねる速さを上げても酸素消費量がほぼ一定
- O'Connor et al. (2014) "The kangaroo's tail propels and powers pentapedal locomotion", Biology Letters
