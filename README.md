# なんで ごはんが うんちに なるの？

こども向けに「たべたごはんが、どうやってうんちになるのか」を紹介する、約2分50秒のモーショングラフィックス動画です。
文字はひらがなを少しだけにして、絵と動きで伝えます。

- 2D パート: SVG + React（Remotion）— はじまり・からだの地図・しょくどう・えいよう・だいちょう・トイレ・おてがみ
- 3D パート: three.js / React Three Fiber（`@remotion/three`）— お口（かみかみ）・いぶくろ（まぜまぜ）・しょうちょう（ひだのトンネル）
- ナレーション: ElevenLabs `eleven_v4`（声: Sameno）
- BGM: Python（numpy）で合成

## 必要なもの

- Node.js 22 以上
- Python 3 + numpy
- ffmpeg

## 使いかた

```bash
npm i
npm run bgm      # BGM を生成（プレビューの前に 1 回）
npm run dev      # Remotion Studio でプレビュー
npm run render   # BGM を生成して out/gohan_to_unchi.mp4 に書き出し
npm test         # タイミング計算のテスト
```

## 素材の作りかた

| 素材 | ソース | 生成コマンド |
| --- | --- | --- |
| BGM `public/bgm.mp3` | `scripts/make_bgm.py`（乱数シード固定で毎回同じ音になる） | `npm run bgm` |
| ナレーション `public/voiceover/*.mp3` | 台本 `src/narration.json` | `npm run voiceover` |

ナレーション音声はリポジトリに含めています（TTS は作るたびに少し変わるため）。
台本を変えたら `npm run voiceover` を実行すると、変わったセリフだけを作り直して `src/voiceover-manifest.json` に長さを記録します。
実行には `.env` に `ELEVENLABS_API_KEY=...` が必要です（`.env` はコミットしません）。

## 構成

```
src/
  GohanVideo.tsx        シーンをつなぐ本体 + ナレーション/BGM（ナレーション中は BGM を小さくする）
  scenes/               シーン（S01〜S10）
  components/           2D のキャラクター（Food.tsx）・からだの地図（BodyMap.tsx）・文字
  three/Base.tsx        3D の共通部品（カメラ・ライト・顔）
  lib/                  アニメーション・タイミング計算・パス計算
scripts/
  make_bgm.py           BGM 合成
  generate-voiceover.ts ナレーション生成
  stills.mjs            確認用の静止画書き出し
```

Remotion の利用には条件によって会社ライセンスが必要です（[ライセンス](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)）。
