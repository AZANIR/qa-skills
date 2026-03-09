import chalk from 'chalk';
import { log } from '@clack/prompts';
import fs from 'fs-extra';
import path from 'node:path';
import matter from 'gray-matter';
import { resolveSourceDir } from '../utils/source.js';
import { discoverSkills } from '../utils/skills.js';
import { resolveDependencies } from '../utils/dependencies.js';
import { readManifest } from '../utils/manifest.js';
import { printBanner } from '../utils/ui.js';

export async function runCheck(): Promise<void> {
  printBanner();
  console.log(chalk.bold('\n  QA Skills Check\n'));

  const targetDir = process.cwd();
  const manifest = await readManifest(targetDir);

  const skillIds = manifest?.skills ?? [];
  if (skillIds.length === 0) {
    log.warning('No skills installed. Run `qa-skills init` or `qa-skills add <skill>` first.');
    return;
  }

  const sourceDir = await resolveSourceDir();
  const allSkills = await discoverSkills(sourceDir);
  const availableIds = new Set(allSkills.map((s) => s.id));

  let issues = 0;

  console.log(chalk.dim('  Checking skill integrity...\n'));

  for (const id of skillIds) {
    const dirName = `qa-${id}`;
    const skillDir = path.join(sourceDir, dirName);

    if (!availableIds.has(id)) {
      console.log(`  ${chalk.red('\u2717')} ${chalk.white(dirName)} ${chalk.dim('\u2014 not found in source')}`);
      issues++;
      continue;
    }

    const skillMd = path.join(skillDir, 'SKILL.md');
    if (!(await fs.pathExists(skillMd))) {
      console.log(`  ${chalk.red('\u2717')} ${chalk.white(dirName)} ${chalk.dim('\u2014 missing SKILL.md')}`);
      issues++;
      continue;
    }

    try {
      const raw = await fs.readFile(skillMd, 'utf-8');
      const { data } = matter(raw);
      if (!data.name || !data.description) {
        console.log(`  ${chalk.yellow('\u26a0')} ${chalk.white(dirName)} ${chalk.dim('\u2014 frontmatter missing name or description')}`);
        issues++;
      } else {
        console.log(`  ${chalk.green('\u2713')} ${chalk.white(dirName)}`);
      }
    } catch {
      console.log(`  ${chalk.red('\u2717')} ${chalk.white(dirName)} ${chalk.dim('\u2014 SKILL.md parse error')}`);
      issues++;
    }
  }

  console.log(chalk.dim('\n  Checking dependencies...\n'));

  const suggestions = resolveDependencies(skillIds);
  const installedSet = new Set(skillIds);
  const missingSuggestions = suggestions.filter((s) => !installedSet.has(s.skillId));

  if (missingSuggestions.length > 0) {
    for (const s of missingSuggestions) {
      console.log(`  ${chalk.yellow('\u26a0')} ${chalk.white(`qa-${s.requiredBy}`)} recommends ${chalk.green(`qa-${s.skillId}`)} ${chalk.dim(`(${s.reason})`)}`);
    }
    issues += missingSuggestions.length;
  } else {
    console.log(`  ${chalk.green('\u2713')} All recommended companions are installed`);
  }

  console.log();

  if (issues > 0) {
    log.warning(`${issues} issue(s) found`);
  } else {
    log.success('All checks passed!');
  }
}
