import chalk from 'chalk';
import { log, spinner } from '@clack/prompts';
import fs from 'fs-extra';
import { AGENT_REGISTRY } from '../agents/registry.js';
import { resolveSourceDir } from '../utils/source.js';
import { installSkillsToAgent } from '../utils/install.js';
import { writeStructureRule, writeAgentsMd, isGitignored } from '../utils/scaffold.js';
import { readManifest, writeManifest } from '../utils/manifest.js';
import { printBanner } from '../utils/ui.js';

export async function runSync(opts: { copy?: boolean } = {}): Promise<void> {
  printBanner();
  const targetDir = process.cwd();

  const manifest = await readManifest(targetDir);
  if (!manifest) {
    log.error('No .qa-skills.json found. Run `qa-skills init` first.');
    process.exit(1);
  }

  const method = opts.copy ? 'copy' : manifest.method;

  const sourceDir = await resolveSourceDir();
  if (!(await fs.pathExists(sourceDir))) {
    log.error(`Skills source not found: ${sourceDir}`);
    process.exit(1);
  }

  const skillDirNames = manifest.skills.map((id) => `qa-${id}`);
  const agentConfigs = manifest.agents
    .map((id) => AGENT_REGISTRY.find((a) => a.id === id))
    .filter(Boolean) as typeof AGENT_REGISTRY;

  if (agentConfigs.length === 0) {
    log.error('No valid agents in manifest.');
    process.exit(1);
  }

  const s = spinner();
  s.start(`Syncing ${manifest.skills.length} skill(s) to ${agentConfigs.length} agent(s)...`);

  let totalInstalled = 0;
  let totalSkipped = 0;

  for (const agent of agentConfigs) {
    const { installed, skipped } = await installSkillsToAgent(
      sourceDir, targetDir, agent, skillDirNames, manifest.scope, method,
    );

    totalInstalled += installed.length;
    totalSkipped += skipped.length;

    if (agent.rulesPath && !(await isGitignored(targetDir, agent.rulesPath))) {
      await writeStructureRule(targetDir, agent.rulesPath, manifest.skills);
    }
  }

  await writeAgentsMd(targetDir, manifest.skills);

  await writeManifest(targetDir, {
    skills: manifest.skills,
    agents: manifest.agents,
    scope: manifest.scope,
    method,
  });

  s.stop('Sync complete');

  log.success(`${chalk.bold(totalInstalled)} skill(s) synced across ${agentConfigs.length} agent(s)`);
  if (totalSkipped > 0) {
    log.warning(`${totalSkipped} skill(s) not found in source`);
  }
}
