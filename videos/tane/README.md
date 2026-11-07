# たねは どこに あるの？

「かぼちゃには たねが あるのに、ネギには どうして ないの？」という、こども（4〜6さいくらい）の ぎもんに こたえる、約2分30秒のモーショングラフィックス動画です。
文字はひらがなを少しだけにして、絵と動きで伝えます。

伝えたいことは、次の3つです。

- たねは「はな → み」の あとに、「み」の なかに できる
- かぼちゃは「み」を、ネギは「はっぱ」を たべている（ネギは しろい ところも ぜんぶ はっぱ）
- ネギも、はるに「ねぎぼうず」という はなが さくと、くろい たねが できる

## シーン

1. はじまり — かぼちゃを きると たねが いっぱい。ネギを きると…たねは？ どうして？
2. しょくぶつの からだ — ねっこ・くき・はっぱ・はな・み
3. たねは どこ？ — はな → み → みの なかに たね
4. かぼちゃ — きいろい はなの したの ちいさな かぼちゃが ぐんぐん。「み」を たべている
5. ネギ — みどりも しろいところも ぜんぶ「はっぱ」。はなが さく まえに たべている
6. ねぎぼうず — はるに まるい はなが さいて、くろい たねが できる。ネギにも たね あった！
7. なかま わけ — み（トマト・きゅうり・ピーマン）、はっぱ（キャベツ・ほうれんそう）、ねっこ（にんじん・だいこん）
8. たねを たべる — おこめ・おまめ・とうもろこし
9. たねの おしごと — つちに まいて おみずを あげると、めが でて また かぼちゃ
10. ふりかえり — はな → み → たね。どこを たべてるか さがしてみてね。またね！

- 2D: SVG + React（Remotion）
- BGM: Python（numpy）で合成
- ナレーション: ElevenLabs `eleven_v4`（声: Sameno）。せりふごとに べつべつに 生成し、あたまと おしりの むおんを きって みじかく フェード
- サムネイル: `thumbnail-youtube.png` / `thumbnail-youtube.jpg`（Remotion の `Thumbnail` コンポジションを `remotion still` で書き出した絵を参照画像にして画像生成。プロンプトは `thumbnail-youtube-prompt.txt`）

## 必要なもの

- Node.js 22 以上
- Python 3 + numpy
- ffmpeg

## 使いかた

```bash
npm i
npm run bgm      # BGM を生成（プレビューの前に 1 回）
npm run dev      # Remotion Studio でプレビュー
npm run render   # BGM を生成して out/tane.mp4 に書き出し
npm test         # タイミング計算のテスト（せりふが かさならないか・シーンから はみださないか）
npx remotion still src/index.ts Thumbnail thumbnail.png   # サムネイルの参照画像
```

python3 に numpy が ないときは `uv run --no-project --with numpy python scripts/make_bgm.py public/bgm.wav` でも作れます。

## ナレーション

台本 `src/narration.json` に、せりふごとの「シーン番号（0はじまり）」と「シーン内で話しはじめるフレーム（at）」が入っています。
シーンの ながさは `src/lib/durations.ts` に まとめてあります。
音声 `public/voiceover/*.mp3` はリポジトリに含めています（TTS は作るたびに少し変わるため）。

- 台本を変えたら `.env`（この フォルダ か リポジトリの ルート）に `ELEVENLABS_API_KEY=...` を書いて `npm run voiceover`。変わったセリフだけを作り直し、`src/voiceover-manifest.json` に長さを記録します。
- 「実」は TTS が「み」と読むことを whisper で たしかめています。読みが かわったら、ひらがなに するか 漢字に するかで 調整してください。
- せりふが まえや つぎの せりふに かさなると、プレビュー・書き出しが エラーで とまります。シーンの きりかえに かかる せりふは `npm test` で みつかります。
- 話しているあいだは BGM が自動で小さくなります。

## 構成

```
src/
  TaneVideo.tsx         シーンをつなぐ本体 + ナレーション/BGM
  Thumbnail.tsx         サムネイル
  scenes/               シーン（S01〜S10）
  components/           かぼちゃ・ネギ・ねぎぼうず・やさい など（Things.tsx）、こども・文字
  lib/                  アニメーション・タイミング計算（cues.ts / timeline.ts）・シーンの ながさ
scripts/
  make_bgm.py           BGM 合成
  generate-voiceover.ts ナレーション生成
  stills.mjs            確認用の静止画書き出し
```

Remotion の利用には条件によって会社ライセンスが必要です（[ライセンス](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)）。
