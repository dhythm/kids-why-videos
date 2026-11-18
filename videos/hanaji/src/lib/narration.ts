// ナレーションの 1 せりふ。text は 台本（ひらがな）、tts は よみあげ用の かきかた（なくても よい）
export type NarrationLine = { text: string; tts?: string };

// ひらがなの「はな」は「花」の アクセントに なったり「は」が 助詞に きこえたり するので、
// よみまちがう せりふ だけ tts に 漢字まじりの 文を いれる
export function spokenText(line: NarrationLine): string {
  const tts = line.tts?.trim();
  return tts ? tts : line.text;
}
