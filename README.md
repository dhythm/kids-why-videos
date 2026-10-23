# うかぶ？ しずむ？ — 野菜が水に浮く・沈むわけ（子ども向け解説動画）

リンゴやピーマンは水に浮くのに、ジャガイモや大根は沈むのはなぜか。それを子ども向けに説明する、約2分半の動画です。Remotion で作っています。

- 完成動画: `out/ukabu_shizumu.mp4`
- 台本（ナレーション読み・字幕）: `scenes.json`
- 画面: `src/`

## 作り直し方

```bash
npm install
# ナレーション（ElevenLabs eleven_v4）。キーは環境変数で渡す
ELEVEN_API_KEY=... python3 gen_voice_eleven.py scenes.json
# BGM の合成（numpy が必要）
uv run --with numpy python make_bgm.py /tmp/bgm.wav <動画の秒数>
# 書き出し
npm run render
```

`remotion.config.ts` は、puppeteer の chrome-headless-shell を使うように設定しています。
