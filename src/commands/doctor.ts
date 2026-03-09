import chalk from 'chalk';
import { log } from '@clack/prompts';
import fs from 'fs-extra';
import path from 'node:path';
import { AGENT_REGISTRY } from '../agents/registry.js';
import { resolveGlobalPath } from '../agents/registry.js';
import { readManifest } from '../utils/manifest.js';
import { printBanner } from '../utils/ui.js';

interface DiagnosticResult {
  label: string;
  status: 'ok' | 'warn' | 'error';
  detail?: string;
}

export async function runDoctor(): Promise<void> {
  printBanner();
  console.log(chalk.bold('\n  QA Skills Doctor\n'));

  const targetDir = process.cwd();
  const results: DiagnosticResult[] = [];

  const manifest = await readManifest(targetDir);
  if (!manifest) {
    results.push({
      label: 'Manifest (.qa-skills.json)',
      status: 'error',
      detail: 'Not found. Run `qa-skills init` first.',
    });
    printResults(results);
    return;
  }

  results.push({
    label: 'Manifest (.qa-skills.json)',
    status: 'ok',
    detail: `v${manifest.version}, ${manifest.skills.length} skills, ${manifest.agents.length} agent(s)`,
  });

  for (const agentId of manifest.agents) {
    const agent = AGENT_REGISTRY.find((a) => a.id === agentId);
    if (!agent) {
      results.push({ label: `Agent: ${agentId}`, status: 'warn', detail: 'Unknown agent ID' });
      continue;
    }

    const basePath = manifest.scope === 'global' && agent.globalSkillsPath
      ? resolveGlobalPath(agent.globalSkillsPath)
      : path.join(targetDir, agent.projectSkillsPath);

    if (!(await fs.pathExists(basePath))) {
      results.push({ label: `Agent: ${agent.name}`, status: 'error', detail: `Skills dir missing: ${basePath}` });
      continue;
    }

    let installedCount = 0;
    let missingCount = 0;
    let brokenLinks = 0;

    for (const skillId of manifest.skills) {
      const skillDir = path.join(basePath, `qa-${skillId}`);
      if (!(await fs.pathExists(skillDir))) {
        missingCount++;
        continue;
      }

      if (manifest.method === 'symlink') {
        try {
          const stat = await fs.lstat(skillDir);
          if (stat.isSymbolicLink()) {
            const target = await fs.readlink(skillDir);
            if (!(await fs.pathExists(target))) {
              brokenLinks++;
              continue;
            }
          }
        } catch {
          brokenLinks++;
          continue;
        }
      }

      const skillMd = path.join(skillDir, 'SKILL.md');
      if (!(await fs.pathExists(skillMd))) {
        missingCount++;
        continue;
      }

      installedCount++;
    }

    const parts = [`${installedCount}/${manifest.skills.length} skills ok`];
    if (missingCount > 0) parts.push(`${missingCount} missing`);
    if (brokenLinks > 0) parts.push(`${brokenLinks} broken symlinks`);

    results.push({
      label: `Agent: ${agent.name}`,
      status: missingCount > 0 || brokenLinks > 0 ? 'warn' : 'ok',
      detail: parts.join(', '),
    });

    if (agent.mcpPath) {
      const mcpFile = path.join(targetDir, agent.mcpPath);
      if (await fs.pathExists(mcpFile)) {
        try {
          await fs.readJson(mcpFile);
          results.push({ label: `  MCP config (${agent.mcpPath})`, status: 'ok' });
        } catch {
          results.push({ label: `  MCP config (${agent.mcpPath})`, status: 'error', detail: 'Invalid JSON' });
        }
      } else {
        results.push({ label: `  MCP config (${agent.mcpPath})`, status: 'warn', detail: 'Not found' });
      }
    }
  }

  const envFile = path.join(targetDir, '.env');
  if (await fs.pathExists(envFile)) {
    const content = await fs.readFile(envFile, 'utf-8');
    const hasGithubToken = content.includes('GITHUB_PERSONAL_ACCESS_TOKEN=') &&
      !content.match(/GITHUB_PERSONAL_ACCESS_TOKEN=\s*$/m);
    results.push({
      label: '.env file',
      status: hasGithubToken ? 'ok' : 'warn',
      detail: hasGithubToken ? 'GitHub token configured' : 'GITHUB_PERSONAL_ACCESS_TOKEN not set',
    });
  } else {
    results.push({ label: '.env file', status: 'warn', detail: 'Not found' });
  }

  printResults(results);
}

function printResults(results: DiagnosticResult[]): void {
  console.log();
  for (const r of results) {
    const icon = r.status === 'ok'
      ? chalk.green('\u2713')
      : r.status === 'warn'
        ? chalk.yellow('\u26a0')
        : chalk.red('\u2717');
    const detail = r.detail ? chalk.dim(` \u2014 ${r.detail}`) : '';
    console.log(`  ${icon} ${r.label}${detail}`);
  }
  console.log();

  const errors = results.filter((r) => r.status === 'error').length;
  const warnings = results.filter((r) => r.status === 'warn').length;

  if (errors > 0) {
    log.error(`${errors} error(s), ${warnings} warning(s)`);
  } else if (warnings > 0) {
    log.warning(`All good with ${warnings} warning(s)`);
  } else {
    log.success('Everything looks healthy!');
  }
}
