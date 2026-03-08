/**
 * qa-skills v3 — Interactive CLI for installing QA Skills into coding agents.
 * Single entry point: `qa-skills init` (or bare `qa-skills`).
 * Skills are bundled with the npm package for zero-config usage on fresh machines.
 */

import {
  intro,
  outro,
  select,
  multiselect,
  confirm,
  spinner,
  note,
  log,
  isCancel,
  cancel,
} from '@clack/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { AGENT_REGISTRY, resolveGlobalPath } from './agents/registry.js';
import type { AgentConfig } from './agents/types.js';
import { resolveDependencies } from './dependencies.js';
import { SKILL_OUTPUT_MAP, generateStructureRule, writeStructureRule, writeAgentsMd, isGitignored } from './scaffold.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Types ──────────────────────────────────────────────────────────────

export interface SkillInfo {
  id: string;
  dirName: string;
  name: string;
  description: string;
  category: string;
}

export interface InstallerOptions {
  agents?: string[];
  skills?: string[];
  global?: boolean;
  copy?: boolean;
  yes?: boolean;
  list?: boolean;
}

// ─── Skill Categories ───────────────────────────────────────────────────

export const SKILL_CATEGORIES: Record<string, string[]> = {
  'Documentation & Planning': [
    'requirements-generator', 'spec-writer', 'nfr-analyst',
    'api-contract-curator', 'plan-creator', 'diagram-generator',
    'test-strategy', 'test-doc-compiler',
  ],
  'Test Case Design': [
    'testcase-from-docs', 'testcase-from-ui',
    'browser-data-collector', 'manual-test-designer',
  ],
  'TypeScript Test Writers': [
    'jest-writer', 'vitest-writer', 'playwright-ts-writer', 'cypress-writer',
    'webdriverio-writer', 'codeceptjs-writer', 'supertest-writer',
  ],
  'Python Test Writers': [
    'pytest-writer', 'playwright-py-writer', 'selenium-py-writer',
    'robot-framework-writer', 'httpx-writer',
  ],
  'Java Test Writers': [
    'junit5-writer', 'selenium-java-writer', 'rest-assured-writer', 'spring-test-writer',
  ],
  'Performance & Specialized': [
    'k6-writer', 'locust-writer', 'jmeter-writer', 'security-test-writer',
    'accessibility-test-writer', 'visual-regression-writer',
    'pact-writer', 'mobile-test-writer',
  ],
  'Reporting & Analysis': [
    'test-reporter', 'coverage-analyzer', 'bug-ticket-creator',
    'task-creator', 'risk-analyzer', 'spec-auditor',
  ],
  'Orchestration': ['orchestrator'],
  'Support & Maintenance': [
    'test-healer', 'changelog-analyzer', 'flaky-detector',
    'test-reviewer', 'data-factory', 'environment-checker',
    'discovery-interview',
  ],
  'Integrations': [
    'qase-integration', 'github-issues-enhanced',
    'jira-integration', 'linear-integration',
    'clickup-integration', 'shortcut-integration',
  ],
};

// ─── Banner ─────────────────────────────────────────────────────────────

function printBanner(): void {
  const banner = `
${chalk.cyan('  ╔═══════════════════════════════════════════════════════════╗')}
${chalk.cyan('  ║')}${chalk.white.bold('        QA Skills Ecosystem — Interactive Installer         ')}${chalk.cyan('║')}
${chalk.cyan('  ╚═══════════════════════════════════════════════════════════╝')}`;
  console.log(banner);
}

// ─── Source Resolution ──────────────────────────────────────────────────
// Priority: 1) QA_SKILLS_SOURCE env  2) monorepo sibling  3) bundled in npm package

async function resolveSourceDir(): Promise<string> {
  const envSource = process.env.QA_SKILLS_SOURCE;
  if (envSource) return path.resolve(envSource);

  const pkgRoot = path.resolve(__dirname, '..');

  const monorepoSkills = path.resolve(pkgRoot, '..', '.cursor', 'skills');
  if (await fs.pathExists(monorepoSkills)) return monorepoSkills;

  const bundledSkills = path.resolve(pkgRoot, 'skills');
  if (await fs.pathExists(bundledSkills)) return bundledSkills;

  return bundledSkills;
}

// ─── Skill Discovery ────────────────────────────────────────────────────

function getCategoryForSkill(skillId: string): string {
  for (const [cat, ids] of Object.entries(SKILL_CATEGORIES)) {
    if (ids.includes(skillId)) return cat;
  }
  return 'Other';
}

async function discoverSkills(sourceDir: string): Promise<SkillInfo[]> {
  const skills: SkillInfo[] = [];
  if (!(await fs.pathExists(sourceDir))) return skills;

  const entries = await fs.readdir(sourceDir);
  for (const entry of entries) {
    if (!entry.startsWith('qa-')) continue;

    const skillMd = path.join(sourceDir, entry, 'SKILL.md');
    if (!(await fs.pathExists(skillMd))) continue;

    const raw = await fs.readFile(skillMd, 'utf-8');
    const { data } = matter(raw);

    const id = entry.replace(/^qa-/, '');
    skills.push({
      id,
      dirName: entry,
      name: (data.name as string) || entry,
      description: (data.description as string) || '',
      category: getCategoryForSkill(id),
    });
  }

  return skills.sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Helpers ────────────────────────────────────────────────────────────

function handleCancel(value: unknown): void {
  if (isCancel(value)) {
    cancel('Installation cancelled.');
    process.exit(0);
  }
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + '...';
}

function getDefaultMcpConfig(): object {
  return {
    mcpServers: {
      playwright: {
        command: 'npx',
        args: ['@playwright/mcp@latest'],
      },
      github: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-github'],
        env: { GITHUB_PERSONAL_ACCESS_TOKEN: '${GITHUB_PERSONAL_ACCESS_TOKEN}' },
      },
      filesystem: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()],
      },
    },
  };
}

// ─── Installation Logic ─────────────────────────────────────────────────

async function installSkillsToAgent(
  sourceDir: string,
  targetDir: string,
  agent: AgentConfig,
  skillDirNames: string[],
  scope: 'project' | 'global',
  method: 'symlink' | 'copy',
): Promise<{ installed: string[]; skipped: string[] }> {
  const basePath = scope === 'global' && agent.globalSkillsPath
    ? resolveGlobalPath(agent.globalSkillsPath)
    : path.join(targetDir, agent.projectSkillsPath);

  await fs.ensureDir(basePath);

  const installed: string[] = [];
  const skipped: string[] = [];

  for (const dirName of skillDirNames) {
    const src = path.join(sourceDir, dirName);
    const dest = path.join(basePath, dirName);

    if (!(await fs.pathExists(src))) {
      skipped.push(dirName);
      continue;
    }

    if (await fs.pathExists(dest)) {
      await fs.remove(dest);
    }

    if (method === 'symlink') {
      const isWindows = os.platform() === 'win32';
      await fs.symlink(src, dest, isWindows ? 'junction' : 'dir');
    } else {
      await fs.copy(src, dest, { overwrite: true });
    }

    installed.push(dirName);
  }

  return { installed, skipped };
}

async function writeMcpConfig(targetDir: string, mcpPath: string): Promise<void> {
  const mcpFile = path.join(targetDir, mcpPath);
  await fs.ensureDir(path.dirname(mcpFile));

  const defaults = getDefaultMcpConfig() as Record<string, unknown>;
  const defaultServers = (defaults.mcpServers ?? {}) as Record<string, unknown>;

  let existing: Record<string, unknown> = {};
  if (await fs.pathExists(mcpFile)) {
    try {
      existing = await fs.readJson(mcpFile);
    } catch {
      existing = {};
    }
  }

  const existingServers = (existing.mcpServers ?? {}) as Record<string, unknown>;

  const merged = {
    ...existing,
    mcpServers: { ...defaultServers, ...existingServers },
  };

  await fs.writeJson(mcpFile, merged, { spaces: 2 });
}

async function writeEnvTemplate(targetDir: string): Promise<void> {
  const envFile = path.join(targetDir, '.env');

  let existing = '';
  if (await fs.pathExists(envFile)) {
    existing = await fs.readFile(envFile, 'utf-8');
  }

  const keys = ['GITHUB_PERSONAL_ACCESS_TOKEN', 'OPENAI_API_KEY'];
  const missing = keys.filter((k) => !existing.includes(k));

  if (missing.length > 0) {
    const lines = missing.map((k) => `# ${k}\n${k}=`);
    await fs.writeFile(envFile, existing.trimEnd() + '\n\n' + lines.join('\n\n') + '\n');
  }
}

// ─── List Mode ──────────────────────────────────────────────────────────

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

// ─── Interactive Flow ───────────────────────────────────────────────────

export async function runInteractive(opts: InstallerOptions = {}): Promise<void> {
  printBanner();
  intro(chalk.bgCyan.black(' qa-skills '));

  // 1. Resolve source
  const sourceDir = await resolveSourceDir();
  if (!(await fs.pathExists(sourceDir))) {
    log.error(`Skills source not found: ${sourceDir}`);
    log.info('Set QA_SKILLS_SOURCE or run from the qa-skills repo.');
    process.exit(1);
  }

  // 2. Discover skills
  const allSkills = await discoverSkills(sourceDir);
  if (allSkills.length === 0) {
    log.error('No skills found.');
    process.exit(1);
  }
  log.info(`Found ${chalk.bold(allSkills.length)} skills`);

  // 3. Select skills
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

  // 4. Check dependencies
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

  // 5. Select agents
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

  // 6. Installation scope
  const scope = await select({
    message: 'Installation scope',
    options: [
      { value: 'project', label: 'Project', hint: 'Install in current directory (committed with your project)' },
      { value: 'global', label: 'Global', hint: 'Install in user home directory' },
    ],
    initialValue: 'project',
  });
  handleCancel(scope);

  // 7. Installation method
  const method = await select({
    message: 'Installation method',
    options: [
      { value: 'symlink', label: 'Symlink (Recommended)', hint: 'Single source of truth, easy updates' },
      { value: 'copy', label: 'Copy to all agents', hint: 'Independent copies per agent' },
    ],
    initialValue: 'symlink',
  });
  handleCancel(method);

  // 8. MCP config
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

  // 9. Structure rule
  let installStructureRule = false;
  const ruleAnswer = await confirm({
    message: 'Install QA project structure rule? (maps skills to output directories)',
    initialValue: true,
  });
  handleCancel(ruleAnswer);
  installStructureRule = ruleAnswer as boolean;

  // 10. .env template
  const envAnswer = await confirm({
    message: 'Create .env template for API keys?',
    initialValue: false,
  });
  handleCancel(envAnswer);
  const configureEnv = envAnswer as boolean;

  // ─── Install ────────────────────────────────────────────────────────
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
        `${agent.name}: ${agent.projectSkillsPath} is in .gitignore — skills won't be committed (each developer must install individually)`
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

  s.stop('Installation complete');

  // ─── Gitignore warnings ─────────────────────────────────────────────
  if (gitignoreWarnings.length > 0) {
    note(
      gitignoreWarnings.map((w) => `  ${chalk.yellow('⚠')} ${w}`).join('\n'),
      'Gitignore notice',
    );
  }

  // ─── Summary ────────────────────────────────────────────────────────
  console.log();

  for (const r of results) {
    const lines: string[] = [];
    for (const skill of r.installed) {
      lines.push(`  ${chalk.green('✓')} ${skill}`);
    }
    for (const skill of r.skipped) {
      lines.push(`  ${chalk.yellow('⚠')} ${skill} ${chalk.dim('(not found)')}`);
    }
    note(lines.join('\n'), `${r.agent} — ${r.installed.length} installed`);
  }

  if (configureMcp) log.info('MCP servers configured');
  if (installStructureRule) log.info('QA project structure rule → AGENTS.md (always committed)');
  if (configureEnv) log.info('.env template created');

  outro(chalk.green.bold(`Done! Installed ${finalSkillIds.length} skills to ${agentIds.length} agent(s).`));
}

// ─── Non-Interactive Flow ───────────────────────────────────────────────

export async function runNonInteractive(opts: InstallerOptions): Promise<void> {
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
        chalk.yellow(`  ⚠ ${agent.projectSkillsPath} is in .gitignore — each developer must install individually`),
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
  console.log(chalk.dim('  Project structure rule → AGENTS.md'));

  console.log(chalk.green.bold('\nDone!'));
}
