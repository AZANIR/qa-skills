import type { AgentConfig } from './types.js';

export const AGENT_REGISTRY: AgentConfig[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    projectSkillsPath: '.cursor/skills',
    globalSkillsPath: '~/.cursor/skills',
    rulesPath: '.cursor/rules',
    mcpPath: '.cursor/mcp.json',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    projectSkillsPath: '.claude/skills',
    globalSkillsPath: '~/.claude/skills',
    rulesPath: null,
    mcpPath: null,
  },
  {
    id: 'codex',
    name: 'Codex',
    projectSkillsPath: '.agents/skills',
    globalSkillsPath: '~/.codex/skills',
    rulesPath: null,
    mcpPath: null,
  },
  {
    id: 'cline',
    name: 'Cline',
    projectSkillsPath: '.agents/skills',
    globalSkillsPath: '~/.agents/skills',
    rulesPath: null,
    mcpPath: null,
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    projectSkillsPath: '.agents/skills',
    globalSkillsPath: '~/.copilot/skills',
    rulesPath: null,
    mcpPath: null,
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    projectSkillsPath: '.windsurf/skills',
    globalSkillsPath: '~/.codeium/windsurf/skills',
    rulesPath: '.windsurf/rules',
    mcpPath: '.windsurf/mcp.json',
  },
  {
    id: 'roo',
    name: 'Roo Code',
    projectSkillsPath: '.roo/skills',
    globalSkillsPath: '~/.roo/skills',
    rulesPath: null,
    mcpPath: null,
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    projectSkillsPath: '.agents/skills',
    globalSkillsPath: '~/.config/opencode/skills',
    rulesPath: null,
    mcpPath: null,
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    projectSkillsPath: '.agents/skills',
    globalSkillsPath: '~/.gemini/skills',
    rulesPath: null,
    mcpPath: null,
  },
  {
    id: 'amp',
    name: 'Amp',
    projectSkillsPath: '.agents/skills',
    globalSkillsPath: '~/.config/agents/skills',
    rulesPath: null,
    mcpPath: null,
  },
  {
    id: 'vscode',
    name: 'VS Code',
    projectSkillsPath: '.agents/skills',
    globalSkillsPath: null,
    rulesPath: null,
    mcpPath: null,
  },
];

export function getAgentById(id: string): AgentConfig | undefined {
  return AGENT_REGISTRY.find((a) => a.id === id);
}

export function resolveGlobalPath(globalPath: string): string {
  if (globalPath.startsWith('~/')) {
    const home = process.env.HOME || process.env.USERPROFILE || '';
    return globalPath.replace('~', home);
  }
  return globalPath;
}
