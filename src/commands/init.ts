import {
  intro,
  outro,
  select,
  multiselect,
  confirm,
  spinner,
  note,
  log,
} from '@clack/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import { AGENT_REGISTRY } from '../agents/registry.js';
import { resolveDependencies } from '../utils/dependencies.js';
import { resolveSourceDir } from '../utils/source.js';
import { discoverSkills } from '../utils/skills.js';
import { installSkillsToAgent, writeMcpConfig, writeEnvTemplate } from '../utils/install.js';
import { writeStructureRule, writeAgentsMd, isGitignored } from '../utils/scaffold.js';
import { printBanner, handleCancel, truncate, listSkills } from '../utils/ui.js';
import { writeManifest } from '../utils/manifest.js';

export interface InitOptions {
  agents?: string[];
  skills?: string[];
  global?: boolean;
  copy?: boolean;
  yes?: boolean;
  list?: boolean;
}

export async function runInteractive(opts: InitOptions = {}): Promise<void> {
  printBanner();
  intro(chalk.bgCyan.black(' create-qa-skills '));

  const sourceDir = await resolveSourceDir();
  if (!(await fs.pathExists(sourceDir))) {
    log.error(`Skills source not found: ${sourceDir}`);
    log.info('Set QA_SKILLS_SOURCE or run from the qa-skills repo.');
    process.exit(1);
  }

  const allSkills = await discoverSkills(sourceDir);
  if (allSkills.length === 0) {
    log.error('No skills found.');
    process.exit(1);
  }
  log.info(`Found ${chalk.bold(allSkills.length)} skills`);

  const skillChoices = allSkills.map((s) => ({
    value: s.id,
    label: s.dirName,
    hint: truncate(s.description, 60),
  }));

  const selectedSkills = await multiselect({
    message: 'Select skills to install (space to toggle)',
    options: skillChoices,
    required: true,
  });
  handleCancel(selectedSkills);
  const selectedIds = selectedSkills as string[];

  const suggestions = resolveDependencies(selectedIds);
  let finalSkillIds = [...selectedIds];

  if (suggestions.length > 0) {
    const depLines = suggestions.map(
      (s) => `  ${chalk.yellow('qa-' + s.requiredBy)} recommends ${chalk.green('qa-' + s.skillId)}\n    ${chalk.dim(s.reason)}`
    );
    note(depLines.join('\n\n'), 'Recommended companion skills');

    const addDeps = await multiselect({
      message: 'Add recommended skills? (space to toggle, enter to confirm)',
      options: suggestions.map((s) => ({
        value: s.skillId,
        label: `qa-${s.skillId}`,
        hint: s.reason,
      })),
      required: false,
    });
    handleCancel(addDeps);

    if (Array.isArray(addDeps) && addDeps.length > 0) {
      finalSkillIds.push(...(addDeps as string[]));
      finalSkillIds = [...new Set(finalSkillIds)];
    }
  }

  log.success(`${finalSkillIds.length} skills selected`);

  const agentChoices = AGENT_REGISTRY.map((a) => ({
    value: a.id,
    label: a.name,
    hint: a.projectSkillsPath,
  }));

  const selectedAgents = await multiselect({
    message: 'Which agents do you want to install to?',
    options: agentChoices,
    required: true,
    initialValues: opts.agents || ['cursor'],
  });
  handleCancel(selectedAgents);
  const agentIds = selectedAgents as string[];

  const scope = await select({
    message: 'Installation scope',
    options: [
      { value: 'project', label: 'Project', hint: 'Install in current directory (committed with your project)' },
      { value: 'global', label: 'Global', hint: 'Install in user home directory' },
    ],
    initialValue: 'project',
  });
  handleCancel(scope);

  const method = await select({
    message: 'Installation method',
    options: [
      { value: 'symlink', label: 'Symlink (Recommended)', hint: 'Single source of truth, easy updates' },
      { value: 'copy', label: 'Copy to all agents', hint: 'Independent copies per agent' },
    ],
    initialValue: 'symlink',
  });
  handleCancel(method);

  const agentConfigs = agentIds.map((id) => AGENT_REGISTRY.find((a) => a.id === id)!);
  const hasMcpAgents = agentConfigs.some((a) => a.mcpPath);
  let configureMcp = false;
  if (hasMcpAgents) {
    const mcpAnswer = await confirm({
      message: 'Configure MCP servers? (Playwright, GitHub, Filesystem)',
      initialValue: true,
    });
    handleCancel(mcpAnswer);
    configureMcp = mcpAnswer as boolean;
  }

  let installStructureRule = false;
  const ruleAnswer = await confirm({
    message: 'Install QA project structure rule? (maps skills to output directories)',
    initialValue: true,
  });
  handleCancel(ruleAnswer);
  installStructureRule = ruleAnswer as boolean;

  const envAnswer = await confirm({
    message: 'Create .env template for API keys?',
    initialValue: false,
  });
  handleCancel(envAnswer);
  const configureEnv = envAnswer as boolean;

  const targetDir = process.cwd();
  const skillDirNames = finalSkillIds.map((id) => `qa-${id}`);
  const s = spinner();

  s.start('Installing skills...');

  const results: { agent: string; installed: string[]; skipped: string[] }[] = [];
  const gitignoreWarnings: string[] = [];

  for (const agent of agentConfigs) {
    const { installed, skipped } = await installSkillsToAgent(
      sourceDir, targetDir, agent, skillDirNames,
      scope as 'project' | 'global',
      method as 'symlink' | 'copy',
    );
    results.push({ agent: agent.name, installed, skipped });

    if (scope === 'project' && await isGitignored(targetDir, agent.projectSkillsPath)) {
      gitignoreWarnings.push(
        `${agent.name}: ${agent.projectSkillsPath} is in .gitignore \u2014 skills won't be committed (each developer must install individually)`
      );
    }

    if (configureMcp && agent.mcpPath) {
      await writeMcpConfig(targetDir, agent.mcpPath);
    }

    if (installStructureRule && agent.rulesPath) {
      const rulesIgnored = await isGitignored(targetDir, agent.rulesPath);
      if (!rulesIgnored) {
        await writeStructureRule(targetDir, agent.rulesPath, finalSkillIds);
      }
    }
  }

  if (installStructureRule) {
    await writeAgentsMd(targetDir, finalSkillIds);
  }

  if (configureEnv) {
    await writeEnvTemplate(targetDir);
  }

  await writeManifest(targetDir, {
    skills: finalSkillIds,
    agents: agentIds,
    scope: scope as 'project' | 'global',
    method: method as 'symlink' | 'copy',
  });

  s.stop('Installation complete');

  if (gitignoreWarnings.length > 0) {
    note(
      gitignoreWarnings.map((w) => `  ${chalk.yellow('\u26a0')} ${w}`).join('\n'),
      'Gitignore notice',
    );
  }

  console.log();

  for (const r of results) {
    const lines: string[] = [];
    for (const skill of r.installed) {
      lines.push(`  ${chalk.green('\u2713')} ${skill}`);
    }
    for (const skill of r.skipped) {
      lines.push(`  ${chalk.yellow('\u26a0')} ${skill} ${chalk.dim('(not found)')}`);
    }
    note(lines.join('\n'), `${r.agent} \u2014 ${r.installed.length} installed`);
  }

  if (configureMcp) log.info('MCP servers configured');
  if (installStructureRule) log.info('QA project structure rule \u2192 AGENTS.md (always committed)');
  if (configureEnv) log.info('.env template created');

  outro(chalk.green.bold(`Done! Installed ${finalSkillIds.length} skills to ${agentIds.length} agent(s).`));
}

export async function runNonInteractive(opts: InitOptions): Promise<void> {
  printBanner();

  const sourceDir = await resolveSourceDir();
  if (!(await fs.pathExists(sourceDir))) {
    console.error(chalk.red(`Skills source not found: ${sourceDir}`));
    process.exit(1);
  }

  const allSkills = await discoverSkills(sourceDir);
  const agentIds = opts.agents || ['cursor'];
  const skillIds = opts.skills || allSkills.map((s) => s.id);
  const normalizedIds = skillIds.map((id) => id.replace(/^qa-/, ''));
  const scope = opts.global ? 'global' : 'project';
  const method = opts.copy ? 'copy' : 'symlink';
  const targetDir = process.cwd();
  const skillDirNames = normalizedIds.map((id) => `qa-${id}`);

  console.log(chalk.dim(`Installing ${skillIds.length} skills to ${agentIds.length} agent(s)...`));

  for (const agentId of agentIds) {
    const agent = AGENT_REGISTRY.find((a) => a.id === agentId);
    if (!agent) {
      console.error(chalk.yellow(`Unknown agent: ${agentId}, skipping.`));
      continue;
    }

    const { installed, skipped } = await installSkillsToAgent(
      sourceDir, targetDir, agent, skillDirNames, scope, method,
    );

    if (scope === 'project' && await isGitignored(targetDir, agent.projectSkillsPath)) {
      console.log(
        chalk.yellow(`  \u26a0 ${agent.projectSkillsPath} is in .gitignore \u2014 each developer must install individually`),
      );
    }

    if (agent.rulesPath && !(await isGitignored(targetDir, agent.rulesPath))) {
      await writeStructureRule(targetDir, agent.rulesPath, normalizedIds);
    }

    console.log(
      chalk.white(`  ${agent.name}: `) +
      chalk.green(`${installed.length} installed`) +
      (skipped.length ? chalk.yellow(` ${skipped.length} skipped`) : ''),
    );
  }

  await writeAgentsMd(targetDir, normalizedIds);
  console.log(chalk.dim('  Project structure rule \u2192 AGENTS.md'));

  await writeManifest(targetDir, {
    skills: normalizedIds,
    agents: agentIds,
    scope,
    method,
  });

  console.log(chalk.green.bold('\nDone!'));
}

export { listSkills };
