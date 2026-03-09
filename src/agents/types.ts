export interface AgentConfig {
  readonly id: string;
  readonly name: string;
  readonly projectSkillsPath: string;
  readonly globalSkillsPath: string | null;
  readonly rulesPath: string | null;
  readonly mcpPath: string | null;
}
