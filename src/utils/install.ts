import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import type { AgentConfig } from '../agents/types.js';
import { resolveGlobalPath } from '../agents/registry.js';

export function getDefaultMcpConfig(): object {
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

export async function installSkillsToAgent(
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

export async function writeMcpConfig(targetDir: string, mcpPath: string): Promise<void> {
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

export async function writeEnvTemplate(targetDir: string): Promise<void> {
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
