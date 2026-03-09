import fs from 'fs-extra';
import path from 'node:path';
import matter from 'gray-matter';

export interface SkillInfo {
  id: string;
  dirName: string;
  name: string;
  description: string;
  category: string;
}

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

export function getCategoryForSkill(skillId: string): string {
  for (const [cat, ids] of Object.entries(SKILL_CATEGORIES)) {
    if (ids.includes(skillId)) return cat;
  }
  return 'Other';
}

export async function discoverSkills(sourceDir: string): Promise<SkillInfo[]> {
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
