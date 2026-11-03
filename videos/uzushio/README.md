# うずしおって なあに？

こども（4〜6さいくらい）向けに「うずしおは どうして できるのか」を紹介する、約2分24秒のモーショングラフィックス動画です。
文字はひらがなを少しだけにして、絵と動きで伝えます。

1. はじまり — みさきから 海を みると、ぐるぐる。「これは うずしお」「どうして まわるの？」
2. なるとかいきょう — とくしまけんと あわじしまの あいだの、せまい海
3. おつきさま — 海の水を ぐいーっと ひっぱる → 水が ふえたり へったり
4. たかさが ちがう — かいきょうの こっちは たかい、あっちは ひくい
5. ざばーっ — せまい ところを とおるから、じてんしゃ くらい はやい
6. くるっ！ — まんなかは はやく、はしっこは ゆっくり。すれちがう ところで うずが できる
7. やってみよう — えんぴつを りょうてで はさんで ずらすと くるくる。おんなじ しくみ
8. おおきさ — バス 2だいぶん くらい。はると あきの おおしおの ころが いちばん
9. みに いこう — ふねや はしから 見られる。ちかくで およぐのは あぶない
10. ふりかえり — おつきさま → はやい ながれ → くるっ！ またね

- 2D: SVG + React（Remotion）
- BGM: Python（numpy）で合成
- ナレーション: ElevenLabs `eleven_v4`（声: Sameno）。せりふごとに べつべつに 生成し、あたまと おしりの むおんを きって みじかく フェード

## 必要なもの

- Node.js 22 以上
- Python 3 + numpy
- ffmpeg

## 使いかた

```bash
npm i
npm run bgm      # BGM を生成（プレビューの前に 1 回）
npm run dev      # Remotion Studio でプレビュー
npm run render   # BGM を生成して out/uzushio.mp4 に書き出し
npm test         # タイミング計算・ながれの計算のテスト
```

## ナレーション

台本 `src/narration.json` に、せりふごとの「シーン番号（0はじまり）」と「シーン内で話しはじめるフレーム（at）」が入っています。
音声 `public/voiceover/*.mp3` はリポジトリに含めています（TTS は作るたびに少し変わるため）。

- 台本を変えたら `.env`（この フォルダ か リポジトリの ルート）に `ELEVENLABS_API_KEY=...` を書いて `npm run voiceover`。変わったセリフだけを作り直し、`src/voiceover-manifest.json` に長さを記録します。
- 自分で録音する場合: `public/voiceover/<id>.mp3` に置き、`src/voiceover-manifest.json` に `{ "<id>": { "duration": 秒, "hash": "" } }` を書きます。
- せりふが まえや つぎの せりふに かさなると、プレビュー・書き出しが エラーで とまります（`at` か シーンの ながさを なおしてください）。
- 話しているあいだは BGM が自動で小さくなります。

## 構成

```
src/
  UzushioVideo.tsx      シーンをつなぐ本体 + ナレーション/BGM
  scenes/               シーン（S01〜S10）
  components/           うずしお・おつきさま・はし・ふね など（Things.tsx）、こども・文字・ラベル
  lib/                  アニメーション・タイミング計算・ながれの計算（flow.ts）
scripts/
  make_bgm.py           BGM 合成
  generate-voiceover.ts ナレーション生成
  stills.mjs            確認用の静止画書き出し
```

Remotion の利用には条件によって会社ライセンスが必要です（[ライセンス](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)）。
