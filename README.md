# にわとりの たまごは どうやって できるの？

こども（4さいくらい）向けに「にわとりの おなかの なかで、たまごが どうやって できて、どこから うまれるのか」を紹介する、約3分13秒のモーショングラフィックス動画です。
文字はひらがなを少しだけにして、絵と動きで伝えます。

1. はじまり — たまごが ぽんっ！「どこから？」「おしりから？」「あたり！」
2. おなかの ちず — きみの へや → ながーい トンネル → おしりの あな
3. きみが そだつ（3D）— ぶどうみたいな きみが おおきくなって トンネルへ ころん
4. しろみ（3D）— トンネルの なかで くるくる まわりながら しろみが つく
5. うすい かわ — ふわっと つつむ（ゆでたまごの うすい かわ）
6. から（3D）— よるの あいだ ずーっと かけて かちかちの から
7. からの もとは ごはん — つんつん たべた ものが からに なる
8. うまれる — うんちと おなじ あな（そうはいせつこう）。でも うんちの みちは おやすみ → ぽんっ！
9. ふりかえり — ぜんぶで いちにち くらい → いちにちに ひとつ
10. ひよこ — おかあさんが あたためると ひよこに なる たまごも あるよ

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
npm run render   # BGM を生成して out/niwatori_tamago.mp4 に書き出し
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
  TamagoVideo.tsx       シーンをつなぐ本体 + ナレーション/BGM
  scenes/               シーン（S01〜S10）
  components/           にわとり・たまご・ひよこ（Farm.tsx）、おなかの なか（HenInside.tsx）、文字・ラベル
  three/Base.tsx        3D の共通部品（カメラ・ライト・顔）
  lib/                  アニメーション・タイミング計算・パス計算
scripts/
  make_bgm.py           BGM 合成
  generate-voiceover.ts ナレーション生成
  stills.mjs            確認用の静止画書き出し
```

Remotion の利用には条件によって会社ライセンスが必要です（[ライセンス](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)）。
