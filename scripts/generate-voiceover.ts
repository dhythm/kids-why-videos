// ナレーション音声を ElevenLabs で生成する
// つかいかた: node --env-file=.env scripts/generate-voiceover.ts
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

type Line = { id: string; scene: number; at: number; text: string };
type Manifest = Record<string, { duration: number; hash: string }>;

const VOICE_ID = "hMK7c1GPJmptCzI4bQIu"; // Sameno（あまくて やさしい かわいい声）
const MODEL_ID = "eleven_v4";
const OUT_DIR = "public/voiceover";
const MANIFEST = "src/voiceover-manifest.json";

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("ELEVENLABS_API_KEY が設定されていません（.env を確認してください）");
  process.exit(1);
}

const lines: Line[] = JSON.parse(readFileSync("src/narration.json", "utf8"));
const manifest: Manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
mkdirSync(OUT_DIR, { recursive: true });

function hashOf(text: string): string {
  return createHash("sha1").update(`${VOICE_ID}|${MODEL_ID}|${text}`).digest("hex").slice(0, 12);
}

async function tts(text: string, attempt = 1): Promise<Buffer> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": apiKey!, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: MODEL_ID, seed: 42 }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (attempt < 3 && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      return tts(text, attempt + 1);
    }
    throw new Error(`TTS failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

function durationOf(file: string): number {
  const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  return Number(out.toString().trim());
}

let failed = 0;
for (const line of lines) {
  const file = `${OUT_DIR}/${line.id}.mp3`;
  const hash = hashOf(line.text);
  if (existsSync(file) && manifest[line.id]?.hash === hash) {
    continue;
  }
  try {
    writeFileSync(file, await tts(line.text));
    manifest[line.id] = { duration: durationOf(file), hash };
    console.log(`ok ${line.id} ${manifest[line.id].duration.toFixed(2)}s`);
  } catch (e) {
    failed++;
    console.error(`NG ${line.id}:`, e instanceof Error ? e.message : e);
  }
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
if (failed > 0) {
  process.exit(1);
}
