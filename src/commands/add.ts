import chalk from 'chalk';
import { log, spinner } from '@clack/prompts';
import fs from 'fs-extra';
import { AGENT_REGISTRY } from '../agents/registry.js';
import { resolveSourceDir } from '../utils/source.js';
import { discoverSkills } from '../utils/skills.js';
import { installSkillsToAgent } from '../utils/install.js';
import { writeStructureRule, writeAgentsMd, isGitignored } from '../utils/scaffold.js';
import { readManifest, writeManifest } from '../utils/manifest.js';
import { printBanner } from '../utils/ui.js';
import { resolveDependencies } from '../utils/dependencies.js';

export async function runAdd(
  skills: string[],
  opts: { agent?: string[]; copy?: boolean },
): Promise<void> {
  printBanner();
  const targetDir = process.cwd();
  const manifest = await readManifest(targetDir);

  const agentIds = opts.agent ?? manifest?.agents ?? ['cursor'];
  const method = opts.copy ? 'copy' : (manifest?.method ?? 'symlink');
  const scope = manifest?.scope ?? 'project';

  const normalizedIds = skills.map((id) => id.replace(/^qa-/, ''));

  const sourceDir = await resolveSourceDir();
  if (!(await fs.pathExists(sourceDir))) {
    log.error(`Skills source not found: ${sourceDir}`);
    process.exit(1);
  }

  const allSkills = await discoverSkills(sourceDir);
  const availableIds = new Set(allSkills.map((s) => s.id));

  const unknown = normalizedIds.filter((id) => !availableIds.has(id));
  if (unknown.length > 0) {
    log.warning(`Unknown skills (will be skipped): ${unknown.map((id) => chalk.yellow(`qa-${id}`)).join(', ')}`);
  }

  const validIds = normalizedIds.filter((id) => availableIds.has(id));
  if (validIds.length === 0) {
    log.error('No valid skills to add.');
    process.exit(1);
  }

  const suggestions = resolveDependencies(validIds);
  if (suggestions.length > 0) {
    const allInstalled = new Set([...(manifest?.skills ?? []), ...validIds]);
    const missing = suggestions.filter((s) => !allInstalled.has(s.skillId));
    if (missing.length > 0) {
      log.info(chalk.dim('Recommended companions:'));
      for (const s of missing) {
        console.log(`  ${chalk.yellow('qa-' + s.requiredBy)} recommends ${chalk.green('qa-' + s.skillId)} ${chalk.dim(`(${s.reason})`)}`);
      }
      console.log();
    }
  }

  const skillDirNames = validIds.map((id) => `qa-${id}`);
  const agentConfigs = agentIds
    .map((id) => AGENT_REGISTRY.find((a) => a.id === id))
    .filter(Boolean) as typeof AGENT_REGISTRY;

  if (agentConfigs.length === 0) {
    log.error(`No valid agents found: ${agentIds.join(', ')}`);
    process.exit(1);
  }

  const s = spinner();
  s.start(`Adding ${validIds.length} skill(s)...`);

  for (const agent of agentConfigs) {
    const { installed, skipped } = await installSkillsToAgent(
      sourceDir, targetDir, agent, skillDirNames, scope, method,
    );

    if (agent.rulesPath && !(await isGitignored(targetDir, agent.rulesPath))) {
      const allSkillIds = [...new Set([...(manifest?.skills ?? []), ...validIds])];
      await writeStructureRule(targetDir, agent.rulesPath, allSkillIds);
    }

    const status = [
      installed.length ? chalk.green(`${installed.length} installed`) : null,
      skipped.length ? chalk.yellow(`${skipped.length} skipped`) : null,
    ].filter(Boolean).join(', ');

    log.info(`${agent.name}: ${status}`);
  }

  const allSkillIds = [...new Set([...(manifest?.skills ?? []), ...validIds])];
  await writeAgentsMd(targetDir, allSkillIds);

  await writeManifest(targetDir, {
    skills: allSkillIds,
    agents: agentIds,
    scope,
    method,
  });

  s.stop(chalk.green.bold(`Added ${validIds.length} skill(s).`));
}
