# ヨーグルトを たべると、どうして うんちが でやすく なるの？

「ヨーグルトを たべると いい うんちが でるのは なぜ？」という、こども（4〜6さいくらい）の ぎもんに こたえる、約3分のモーショングラフィックス動画です。
文字はひらがなを少しだけにして、絵と動きで伝えます。

伝えたいことは、次の4つです。

- おなか（大腸）には、目に見えない さいきんが からだの 細胞と おなじくらい すんでいる。ビフィズス菌は その なかま
- 菌たちは、ひとが こなしきれなかった 食物せんいを たべて、酢酸などを つくる。それが 腸の かべに「うごいて！」と あいずを おくる、と かんがえられている
- ヨーグルトの 菌は おなかに すみつかない「たびびと」。ききめは 菌の しゅるいや ひとに よって ちがい、まだ しらべている ところ
- いい うんちには、やさい・くだもの・まめ（菌の ごはん）、おみず、からだを うごかすことが だいじ

## シーン

1. はじまり — あさごはんに ヨーグルト → トイレで すっきり！ どうして？
2. おなかの なか — 大腸を のぞくと さいきんが いっぱい。からだの 細胞と おなじくらい
3. ビフィズス菌 — Y の かたち。くうきが にがて。あかちゃんの おなかに たくさん
4. ヨーグルトの つくりかた — 牛乳 + 乳酸菌（ブルガリア菌・サーモフィルス菌）→ すっぱく なって かたまる。ビフィズス菌いりも ある
5. たび — 口 → いぶくろ（すっぱくて たくさん やられちゃう）→ とどく なかまも いる
6. もぐもぐ — 食物せんいを たべて、酢酸などを つくる
7. ぐにゅぐにゅ — 腸の かべに あいず → ぜんどう うんどうで うんちを おくりだす（しくみの ひとつ）
8. うんちの なかみ — いちばん おおいのは おみず。のこりの はんぶん くらいは 細菌
9. ほんとうの ところ — ヨーグルトの 菌は たびびと。ききめは ひとそれぞれ。はかせも しらべちゅう
10. ふりかえり — やさい・くだもの・まめ、おみず、からだを うごかす。またね！

- 2D: SVG + React（Remotion）。からだの 地図と うんちの 絵は `gohan-to-unchi` から、ラベル・やさいの 絵は `tane` から 流用
- BGM: Python（numpy）で合成
- ナレーション: ElevenLabs `eleven_v4`（声: Sameno）。せりふごとに べつべつに 生成し、あたまと おしりの むおんを きって みじかく フェード
- サムネイル: `thumbnail-youtube.png` / `thumbnail-youtube.jpg`（Remotion の `Thumbnail` コンポジションを `remotion still` で書き出した絵を参照画像にして画像生成。プロンプトは `thumbnail-youtube-prompt.txt`）

## 内容の根拠（おとな向け）

動画では「言いすぎない」ことを優先し、次のように表現をえらんでいます。

| 動画での 言いかた | 根拠・注意 |
| --- | --- |
| 細菌は からだの 細胞と おなじくらい | 成人で 細菌 約38兆・ヒト細胞 約30兆、ほとんどが 大腸（Sender ら 2016）。むかしの「10倍」「100兆」は 古い 見積もり |
| ビフィズス菌は Y の かたち・くうきが にがて | 名前の 由来が「ふたまた（bifid）」。偏性嫌気性菌。分類上は 乳酸菌とは べつの グループ（放線菌門）で、乳等省令でも 乳酸菌に ふくめない |
| あかちゃんの おなかに たくさん | 母乳の オリゴ糖を つかえるため 乳児期に 多く、離乳後・成人・高齢と へっていく |
| ヨーグルトは 牛乳 + 乳酸菌 | 乳等省令の 発酵乳（乳酸菌数 1mL あたり 1000万以上）。代表的な 菌は ブルガリア菌と サーモフィルス菌 |
| いぶくろで たくさん やられちゃう | ブルガリア菌・サーモフィルス菌は 胃酸に よわい（in vitro）。菌株に よって 生きのこりやすさは ちがう |
| 酢酸などが 腸に あいずを おくる、と かんがえられている | 短鎖脂肪酸が 神経・セロトニンを 介して 腸の うごきに 影響する という 仮説。根拠の 多くは 動物実験で、ヒトでは 一貫していない（Dimidi ら 2017）。「すっぱさ（pH）」ではなく 物質そのものの はたらきと されるので、動画でも すっぱさが うごかす とは 言っていない |
| うんちの のこりの はんぶんくらいは 細菌 | ふつう うんちの 約75% が 水。かわかした 重さの 約35〜55% が 細菌 |
| ヨーグルトの 菌は たびびと | 食べた プロバイオティクスの 菌は、食べるのを やめると 数日〜数週間で 便から 検出されなくなる（菌株による） |
| ききめは ひとや 菌で ちがう | 成人の 便秘では、プロバイオティクス全体で 排便回数が 週 +1.3 回、とくに Bifidobacterium lactis で 効果が みられた（Dimidi ら 2014）。のちの メタ解析（van der Schoot ら 2022）でも 排便回数は ふえたが、有意だったのは B. lactis だけで、腸の 通過時間には 差が なかった。菌株ごとの 差が 大きい |

### こどもの 便秘について

**こどもの 機能性便秘に プロバイオティクス（ヨーグルトの 菌など）が 効くという 十分な 根拠は、まだ ありません。** 系統的レビューの 結論は 一致しておらず、「単独の 治療としては すすめられない」とする ネットワークメタ解析が ある 一方、「役立つ 可能性は あるが 根拠は かぎられ 一貫しない」とする レビューや、一部の 菌株を 下剤と 併用すると 改善したとする 報告も あります（下の 参考文献の こども向けレビュー）。
動画で「すっきりする ひとも いる」「ひとに よって ちがう」と 言っているのは このためです。
うんちが 何日も でない、いたがる、血が まじる などが あれば、ヨーグルトを ふやすより 小児科に 相談してください。

### 参考文献

- Sender R, Fuchs S, Milo R. Revised estimates for the number of human and bacteria cells in the body. *PLoS Biol.* 2016;14(8):e1002533. https://pmc.ncbi.nlm.nih.gov/articles/PMC4991899/
- Dimidi E, et al. The effect of probiotics on functional constipation in adults: a systematic review and meta-analysis of randomized controlled trials. *Am J Clin Nutr.* 2014. https://pubmed.ncbi.nlm.nih.gov/25099542/
- van der Schoot A, Helander C, Whelan K, Dimidi E. Probiotics and synbiotics in chronic constipation in adults: a systematic review and meta-analysis of randomized controlled trials. 2022. https://pubmed.ncbi.nlm.nih.gov/36372047/
- Dimidi E, Christodoulides S, Scott SM, Whelan K. Mechanisms of action of probiotics and the gastrointestinal microbiota on gut motility and constipation. *Adv Nutr.* 2017;8(3):484–94. https://pmc.ncbi.nlm.nih.gov/articles/PMC5421123/
- Zhang Y, et al. Probiotics for functional constipation in children: an overview of overlapping systematic reviews. *Front Cell Infect Microbiol.* 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC10800793/
- Efficacy of probiotics compared with pharmacological treatments for maintenance therapy for functional constipation in children: a systematic review and network meta-analysis. https://pmc.ncbi.nlm.nih.gov/articles/PMC12066947/
- Untangling human milk oligosaccharides and infant gut microbiome（母乳オリゴ糖と 乳児の ビフィズス菌）. https://pubmed.ncbi.nlm.nih.gov/34950861/
- 厚生労働省「乳及び乳製品の成分規格等に関する省令」発酵乳の成分規格（乳酸菌数 1000万/mL 以上） https://www.mhlw.go.jp/file/05-Shingikai-11121000-Iyakushokuhinkyoku-Soumuka/0000036782.pdf
- 農畜産業振興機構（ALIC）発酵乳・乳酸菌飲料の規格（ビフィズス菌は乳酸菌に含まれない） https://alic.go.jp/joho-c/joho05_002972.html
- 便の組成（水分 約75%、乾燥重量の 35〜55% が 細菌）: BioNumbers https://bionumbers.hms.harvard.edu/bionumber.aspx?id=108514 ほか

## 必要なもの

- Node.js 22 以上
- Python 3 + numpy
- ffmpeg

## 使いかた

```bash
npm i
npm run bgm      # BGM を生成（プレビューの前に 1 回）
npm run dev      # Remotion Studio でプレビュー
npm run render   # BGM を生成して out/yogurt.mp4 に書き出し
npm test         # タイミング計算・ぜんどう うんどうの 計算の テスト
npx remotion still src/index.ts Thumbnail thumbnail.png   # サムネイルの参照画像
```

python3 に numpy が ないときは `uv run --no-project --with numpy python scripts/make_bgm.py public/bgm.wav` でも作れます。

## ナレーション

台本 `src/narration.json` に、せりふごとの「シーン番号（0はじまり）」と「シーン内で話しはじめるフレーム（at）」が入っています。
シーンの ながさは `src/lib/durations.ts` に まとめてあります。
音声 `public/voiceover/*.mp3` はリポジトリに含めています（TTS は作るたびに少し変わるため）。

- 台本を変えたら `.env`（この フォルダ か リポジトリの ルート）に `ELEVENLABS_API_KEY=...` を書いて `npm run voiceover`。変わったセリフだけを作り直し、`src/voiceover-manifest.json` に長さを記録します。
- 「大腸」「細菌」「菌」「酢酸」「腸」は 漢字で 書き、TTS が「だいちょう」「さいきん」「きん」「さくさん」「ちょう」と 読むことを whisper で たしかめています。
- s08_b は whisper では「のこり**は** はんぶんくらいは」とも きこえます。いみは かわりませんが、気になれば 作り直してください。
- せりふが まえや つぎの せりふに かさなると、プレビュー・書き出しが エラーで とまります。シーンの きりかえに かかる せりふは `npm test` で みつかります。
- 話しているあいだは BGM が自動で小さくなります。

## 構成

```
src/
  YogurtVideo.tsx       シーンをつなぐ本体 + ナレーション/BGM
  Thumbnail.tsx         サムネイル
  scenes/               シーン（S01〜S10）
  components/           きんたち・ヨーグルト・いぶくろ など（Microbes.tsx）、からだの 地図・うんち（Body.tsx）、はいけい、こども・文字
  lib/                  アニメーション・タイミング計算（cues.ts / timeline.ts）・ぜんどう うんどう（peristalsis.ts）・シーンの ながさ
scripts/
  make_bgm.py           BGM 合成
  generate-voiceover.ts ナレーション生成
  stills.mjs            確認用の静止画書き出し
```

Remotion の利用には条件によって会社ライセンスが必要です（[ライセンス](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)）。
