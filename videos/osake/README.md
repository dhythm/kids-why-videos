# おさけって なーに？

こども（4〜6さいくらい）向けに「おさけは なにから、どうやって できるのか」「どうして こどもは のんじゃ だめなのか」を紹介する、約3分12秒のモーショングラフィックス動画です。
文字はひらがなを少しだけにして、絵と動きで伝えます。

1. はじまり — パパと ママが かんぱい。「しゅわしゅわ… ジュース？」「これは おさけ。おとなの のみもの」
2. おさけの もと — おこめ → にほんしゅ、ぶどう → ワイン、むぎ → ビール
3. こうぼさん（3D）— むしめがねで のぞくと ちいさな いきもの。あまい ところを ぱくぱく → あわ と アルコール
4. はっこう — なんにちも ぷくぷく。だんだん おさけに なる
5. パン — パンが ふくらむのも こうぼさんの あわ
6. からだの なか — アルコールが ちと いっしょに めぐる。かおが あかく、ふわふわ、ねむく なる
7. かんぞうさん — アルコールを えいっ！と こわす。でも じかんが かかる → のみすぎは だめ
8. こどもは だめ — からだも かんぞうも そだっている とちゅう → おさけは 20さい から
9. きを つけて — ジュースみたいな おさけも ある。のむ まえに おうちの ひとに きいてね
10. ふりかえり — こうぼさんが たべて おさけが できる。こどもは ジュースで かんぱーい！

- 2D パート: SVG + React（Remotion）
- 3D パート: three.js / React Three Fiber（`@remotion/three`）
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
npm run render   # BGM を生成して out/osake.mp4 に書き出し
npm test         # タイミング計算のテスト
```

## ナレーション

台本 `src/narration.json` に、せりふごとの「シーン番号（0はじまり）」と「シーン内で話しはじめるフレーム（at）」が入っています。
音声 `public/voiceover/*.mp3` はリポジトリに含めています（TTS は作るたびに少し変わるため）。

- 台本を変えたら `.env` に `ELEVENLABS_API_KEY=...` を書いて `npm run voiceover`。変わったセリフだけを作り直し、`src/voiceover-manifest.json` に長さを記録します。
- 自分で録音する場合: `public/voiceover/<id>.mp3` に置き、`src/voiceover-manifest.json` に `{ "<id>": { "duration": 秒, "hash": "" } }` を書きます。
- せりふが まえや つぎの せりふに かさなると、プレビュー・書き出しが エラーで とまります（`at` か シーンの ながさを なおしてください）。
- 話しているあいだは BGM が自動で小さくなります。

## 構成

```
src/
  OsakeVideo.tsx        シーンをつなぐ本体 + ナレーション/BGM
  scenes/               シーン（S01〜S10）
  components/           おうち・おとな・のみもの（Home.tsx）、おさけの もと・こうぼ・かんぞう など（Things.tsx）、こども・文字・ラベル
  three/Base.tsx        3D の共通部品（カメラ・ライト・顔）
  lib/                  アニメーション・タイミング計算・パス計算
scripts/
  make_bgm.py           BGM 合成
  generate-voiceover.ts ナレーション生成
  stills.mjs            確認用の静止画書き出し
```

Remotion の利用には条件によって会社ライセンスが必要です（[ライセンス](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)）。
