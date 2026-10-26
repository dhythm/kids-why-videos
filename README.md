# kids-why-videos

こどもの「なんで？」に こたえる、モーショングラフィックス動画の シリーズです。
文字は ひらがなを すこしだけにして、絵と うごきで つたえます。

| 動画 | フォルダ |
| --- | --- |
| ロケットで つきへ いこう！ | [videos/rocket-to-moon](videos/rocket-to-moon) |
| なんで ごはんが うんちに なるの？ | [videos/gohan-to-unchi](videos/gohan-to-unchi) |
| うかぶ？ しずむ？ やさいと くだものの ふしぎ | [videos/floating-vegetables](videos/floating-vegetables) |
| カンガルーは どうして ぴょんぴょん はねるの？ | [videos/kangaroo](videos/kangaroo) |
| にわとりの たまごは どうやって できるの？ | [videos/niwatori-tamago](videos/niwatori-tamago) |

## 使いかた

```bash
npm i                                      # ルートで 1 回（全部の動画の依存を入れる）
npm run dev -w videos/niwatori-tamago      # プレビュー
npm run render -w videos/niwatori-tamago   # 書き出し
npm test                                   # 全部の動画の テスト
```

動画ごとの くわしい説明は、それぞれの フォルダの README を見てください。
動画ごとに Remotion の バージョンが ちがっても、npm workspaces が それぞれに あわせて 入れます。

それぞれの 動画は、もとの リポジトリから コミット履歴ごと 取りこんでいます（`git subtree`）。
