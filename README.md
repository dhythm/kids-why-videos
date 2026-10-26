# kids-why-videos

こどもの「なんで？」に こたえる、モーショングラフィックス動画の シリーズです。
文字は ひらがなを すこしだけにして、絵と うごきで つたえます。

| 動画 | フォルダ |
| --- | --- |
| にわとりの たまごは どうやって できるの？ | [videos/niwatori-tamago](videos/niwatori-tamago) |

## 使いかた

```bash
npm i                                      # ルートで 1 回（全部の動画の依存を入れる）
npm run dev -w videos/niwatori-tamago      # プレビュー
npm run render -w videos/niwatori-tamago   # 書き出し
npm test                                   # 全部の動画の テスト
```

動画ごとの くわしい説明は、それぞれの フォルダの README を見てください。
