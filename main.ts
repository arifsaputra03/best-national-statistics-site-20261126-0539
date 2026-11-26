// main.ts — hand-in program for the NusaData national statistics site entry.
// Node 22, standard library only. It copies app/ and screenshots/ from this
// repository into the output directory and writes dossier.json there with the
// kit's buildDossier, exactly the bytes the scorer rebuilds and compares.
// Outside the grader, MAKEFUN_OUTPUT_DIR names the output directory.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoDir, 'app'), join(outputDir, 'app'), { recursive: true });

const shotsDir = join(outputDir, 'screenshots');
mkdirSync(shotsDir, { recursive: true });
if (existsSync(join(repoDir, 'screenshots'))) {
  cpSync(join(repoDir, 'screenshots'), shotsDir, { recursive: true });
}

// The caps mirror the gate: dossier text at most 160 KiB inside a 1.5 MiB
// dossier, at most 4 screenshots of 256 KiB, app/ at most 993 entries / 16 MiB.
// buildDossier refuses anything past those caps, so a bad entry fails here
// with the gate's own words instead of reaching the scorer.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
