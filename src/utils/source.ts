import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the skills source directory.
 * Priority: 1) QA_SKILLS_SOURCE env  2) monorepo sibling  3) bundled in npm package
 *
 * When compiled, __dirname = dist/utils/, so pkgRoot = dist/..  = repo root (or npm package root).
 * Monorepo check: pkgRoot/.cursor/skills
 * Bundled check:  pkgRoot/skills
 */
export async function resolveSourceDir(): Promise<string> {
  const envSource = process.env.QA_SKILLS_SOURCE;
  if (envSource) return path.resolve(envSource);

  const pkgRoot = path.resolve(__dirname, '..', '..');

  const monorepoSkills = path.resolve(pkgRoot, '.cursor', 'skills');
  if (await fs.pathExists(monorepoSkills)) return monorepoSkills;

  const bundledSkills = path.resolve(pkgRoot, 'skills');
  if (await fs.pathExists(bundledSkills)) return bundledSkills;

  return bundledSkills;
}
