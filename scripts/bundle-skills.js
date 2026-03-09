#!/usr/bin/env node

/**
 * Copies skills from the monorepo source of truth (.cursor/skills/)
 * into skills/ so they ship with the npm package.
 *
 * Runs automatically as the `prebuild` npm script.
 * Only copies SKILL.md, references/, and templates/ from each skill directory
 * to keep the bundle lean.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.resolve(__dirname, '..', '.cursor', 'skills');
const DEST = path.resolve(__dirname, '..', 'skills');

if (!fs.existsSync(SOURCE)) {
  console.log('\u26a0 Skills source not found at', SOURCE);
  console.log('  Skipping bundle (bundled skills/ may already exist).');
  process.exit(0);
}

if (fs.existsSync(DEST)) {
  fs.rmSync(DEST, { recursive: true, force: true });
}
fs.mkdirSync(DEST, { recursive: true });

const entries = fs.readdirSync(SOURCE).filter((e) => e.startsWith('qa-'));
let count = 0;

for (const entry of entries) {
  const srcDir = path.join(SOURCE, entry);
  if (!fs.statSync(srcDir).isDirectory()) continue;

  const destDir = path.join(DEST, entry);
  fs.mkdirSync(destDir, { recursive: true });

  const skillMd = path.join(srcDir, 'SKILL.md');
  if (fs.existsSync(skillMd)) {
    fs.copyFileSync(skillMd, path.join(destDir, 'SKILL.md'));
  }

  const refsDir = path.join(srcDir, 'references');
  if (fs.existsSync(refsDir) && fs.statSync(refsDir).isDirectory()) {
    copyDirRecursive(refsDir, path.join(destDir, 'references'));
  }

  const templatesDir = path.join(srcDir, 'templates');
  if (fs.existsSync(templatesDir) && fs.statSync(templatesDir).isDirectory()) {
    copyDirRecursive(templatesDir, path.join(destDir, 'templates'));
  }

  count++;
}

console.log(`Bundled ${count} skills into skills/`);

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    if (fs.statSync(s).isDirectory()) {
      copyDirRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}
