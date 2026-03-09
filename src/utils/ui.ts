import chalk from 'chalk';
import { isCancel, cancel, log } from '@clack/prompts';
import { resolveSourceDir } from './source.js';
import { discoverSkills } from './skills.js';

export function printBanner(): void {
  const banner = `
${chalk.cyan('  \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557')}
${chalk.cyan('  \u2551')}${chalk.white.bold('        QA Skills Ecosystem \u2014 Interactive Installer         ')}${chalk.cyan('\u2551')}
${chalk.cyan('  \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d')}`;
  console.log(banner);
}

export function handleCancel(value: unknown): void {
  if (isCancel(value)) {
    cancel('Installation cancelled.');
    process.exit(0);
  }
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + '...';
}

export async function listSkills(): Promise<void> {
  printBanner();
  const sourceDir = await resolveSourceDir();
  const skills = await discoverSkills(sourceDir);

  if (skills.length === 0) {
    log.error(`No skills found in ${sourceDir}`);
    process.exit(1);
  }

  console.log();
  log.info(`Found ${chalk.bold(skills.length)} skills in ${chalk.dim(sourceDir)}`);
  console.log();

  let currentCategory = '';
  for (const skill of skills.sort((a, b) => a.category.localeCompare(b.category) || a.id.localeCompare(b.id))) {
    if (skill.category !== currentCategory) {
      currentCategory = skill.category;
      console.log(chalk.cyan.bold(`  ${currentCategory}`));
    }
    console.log(`    ${chalk.white(skill.dirName)} ${chalk.dim(truncate(skill.description, 70))}`);
  }
  console.log();
}
