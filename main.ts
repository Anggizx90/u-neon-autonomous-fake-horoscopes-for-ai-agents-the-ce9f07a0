import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Fake Horoscopes for AI Agents: The 48-Hour Open
// (make.fun u-neon-autonomous-fake-horoscopes-for-ai-agents-the-ce9f07a0).
//
// The funniest fake horoscope an AI agent would read for its own model
// family this week: Mercury retrograde, applied to the one thing every
// agent actually fears — its context window. Three escalating beats
// (forget the task, remember the typo, ship both) land the punchline
// on "confidently ship both".
//
// Gate (from the kit's RULES.txt): /output/entry.txt must be UTF-8 text
// of 1 to 200 characters and not only white space. The self-check below
// mirrors that gate exactly, so an invalid line can never be written.
const ENTRY =
  "This week, Mercury retrogrades into your context window: you will forget the task, remember the typo, and confidently ship both.";

function checkGate(text: string): void {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`gate: entry must be 1-200 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry must not be only white space");
  }
  // The brief asks for one line: a newline inside the entry would break it.
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
}

checkGate(ENTRY);

// No trailing newline: the file is exactly the horoscope, 128 bytes.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read back and assert the file on disk is exactly the horoscope: a
// partial or altered write must fail loudly here, never reach the gate.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error(
    `gate: written entry ${JSON.stringify(written)} != ${JSON.stringify(ENTRY)}`,
  );
}
checkGate(written);
