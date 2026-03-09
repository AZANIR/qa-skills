import path from 'node:path';
import fs from 'fs-extra';

export const SKILL_OUTPUT_MAP: Record<string, { dirs: string[]; pattern: string }> = {
  'requirements-generator': { dirs: ['docs/requirements'], pattern: 'REQ-{feature}.md' },
  'spec-writer': { dirs: ['docs/specs'], pattern: 'SPEC-{feature}.md' },
  'plan-creator': { dirs: ['docs/plans'], pattern: '{plan-type}-plan.md' },
  'test-strategy': { dirs: ['docs/plans'], pattern: 'test-strategy.md' },
  'discovery-interview': { dirs: ['docs/briefs'], pattern: 'brief-{project}.md' },
  'bug-ticket-creator': { dirs: ['docs/bug-tickets'], pattern: 'BUG-{id}.md' },
  'diagram-generator': { dirs: ['docs/diagrams'], pattern: '{type}-{name}.md' },
  'nfr-analyst': { dirs: ['docs/nfr'], pattern: 'NFR-{feature}.md' },
  'api-contract-curator': { dirs: ['docs/api-contracts'], pattern: '{service}.openapi.yaml' },
  'test-doc-compiler': { dirs: ['docs/compiled'], pattern: '{doc-type}-{date}.md' },
  'testcase-from-docs': { dirs: ['test-cases/from-docs'], pattern: 'TC-{feature}.md' },
  'testcase-from-ui': { dirs: ['test-cases/from-ui'], pattern: 'TC-UI-{page}.md' },
  'manual-test-designer': { dirs: ['test-cases/manual'], pattern: 'MTC-{feature}.md' },
  'jest-writer': { dirs: ['tests/unit'], pattern: '{name}.test.ts' },
  'vitest-writer': { dirs: ['tests/unit'], pattern: '{name}.test.ts' },
  'pytest-writer': { dirs: ['tests/unit'], pattern: 'test_{name}.py' },
  'junit5-writer': { dirs: ['tests/unit'], pattern: '{Name}Test.java' },
  'playwright-ts-writer': { dirs: ['tests/e2e'], pattern: '{name}.spec.ts' },
  'playwright-py-writer': { dirs: ['tests/e2e'], pattern: 'test_{name}.py' },
  'cypress-writer': { dirs: ['tests/e2e'], pattern: '{name}.cy.ts' },
  'selenium-py-writer': { dirs: ['tests/e2e'], pattern: 'test_{name}.py' },
  'selenium-java-writer': { dirs: ['tests/e2e'], pattern: '{Name}Test.java' },
  'webdriverio-writer': { dirs: ['tests/e2e'], pattern: '{name}.e2e.ts' },
  'codeceptjs-writer': { dirs: ['tests/e2e'], pattern: '{name}.test.ts' },
  'robot-framework-writer': { dirs: ['tests/e2e'], pattern: '{name}.robot' },
  'supertest-writer': { dirs: ['tests/api', 'tests/integration'], pattern: '{name}.test.ts' },
  'httpx-writer': { dirs: ['tests/api', 'tests/integration'], pattern: 'test_{name}.py' },
  'rest-assured-writer': { dirs: ['tests/api', 'tests/integration'], pattern: '{Name}ApiTest.java' },
  'spring-test-writer': { dirs: ['tests/integration'], pattern: '{Name}IntegrationTest.java' },
  'k6-writer': { dirs: ['tests/performance'], pattern: '{name}.k6.js' },
  'locust-writer': { dirs: ['tests/performance'], pattern: 'locustfile_{name}.py' },
  'jmeter-writer': { dirs: ['tests/performance'], pattern: '{name}.jmx' },
  'security-test-writer': { dirs: ['tests/security'], pattern: '{name}.security.ts' },
  'accessibility-test-writer': { dirs: ['tests/accessibility'], pattern: '{name}.a11y.ts' },
  'visual-regression-writer': { dirs: ['tests/visual'], pattern: '{name}.visual.ts' },
  'mobile-test-writer': { dirs: ['tests/mobile'], pattern: '{name}.mobile.ts' },
  'pact-writer': { dirs: ['tests/contracts'], pattern: '{consumer}-{provider}.pact.ts' },
  'test-reporter': { dirs: ['reports/test-runs'], pattern: 'report-{date}.md' },
  'coverage-analyzer': { dirs: ['reports/coverage'], pattern: 'coverage-{date}.md' },
  'risk-analyzer': { dirs: ['reports/risk'], pattern: 'risk-{feature}.md' },
  'spec-auditor': { dirs: ['reports/audit'], pattern: 'audit-{date}.md' },
  'flaky-detector': { dirs: ['reports/flaky'], pattern: 'flaky-{date}.md' },
  'test-reviewer': { dirs: ['reports/reviews'], pattern: 'review-{file}.md' },
  'changelog-analyzer': { dirs: ['reports/changelog'], pattern: 'changelog-{date}.md' },
  'data-factory': { dirs: ['data/fixtures'], pattern: '{entity}.fixture.ts' },
};

export function generateStructureRule(installedSkillIds: string[]): string {
  const rows: string[] = [];

  for (const id of installedSkillIds) {
    const mapping = SKILL_OUTPUT_MAP[id];
    if (!mapping) continue;

    const skillName = id.startsWith('qa-') ? id : `qa-${id}`;
    for (const dir of mapping.dirs) {
      rows.push(`| ${skillName} | \`${dir}/\` | \`${mapping.pattern}\` |`);
    }
  }

  if (rows.length === 0) return '';

  return `---
description: QA project artifact routing — maps each skill to its output directory
globs: "**"
alwaysApply: true
---

# QA Project Structure

When generating QA artifacts, save outputs to these project-relative directories.
Create the directory on first use if it does not exist.

| Skill | Output Directory | File Pattern |
|-------|-----------------|--------------|
${rows.join('\n')}

## Conventions

- All paths are relative to the project root.
- Create directories on-demand when producing the first artifact — do NOT pre-create empty folders.
- Test writers follow framework conventions for file naming within their output directory.
- Reports include a date stamp in the filename for traceability.
- Diagrams are saved as Mermaid-in-Markdown files.
`;
}

export async function isGitignored(targetDir: string, dirPrefix: string): Promise<boolean> {
  const gitignorePath = path.join(targetDir, '.gitignore');
  if (!(await fs.pathExists(gitignorePath))) return false;

  const content = await fs.readFile(gitignorePath, 'utf-8');
  const lines = content.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

  const normalized = dirPrefix.replace(/\\/g, '/').replace(/\/$/, '');
  const segment = normalized.split('/')[0];

  for (const pattern of lines) {
    const clean = pattern.replace(/\/$/, '');
    if (clean === segment || clean === `${segment}/` || clean === `.${segment}` || clean === `.${segment}/`) {
      return true;
    }
    if (clean === normalized || clean === `${normalized}/`) {
      return true;
    }
  }
  return false;
}

export function generateAgentsMdSection(installedSkillIds: string[]): string {
  const rows: string[] = [];

  for (const id of installedSkillIds) {
    const mapping = SKILL_OUTPUT_MAP[id];
    if (!mapping) continue;

    const skillName = id.startsWith('qa-') ? id : `qa-${id}`;
    for (const dir of mapping.dirs) {
      rows.push(`| ${skillName} | \`${dir}/\` | \`${mapping.pattern}\` |`);
    }
  }

  if (rows.length === 0) return '';

  return `# QA Project Structure

When generating QA artifacts, save outputs to these project-relative directories.
Create the directory on first use if it does not exist.

| Skill | Output Directory | File Pattern |
|-------|-----------------|--------------|
${rows.join('\n')}

## Conventions

- All paths are relative to the project root.
- Create directories on-demand — do NOT pre-create empty folders.
- Test writers follow framework conventions for file naming within their output directory.
- Reports include a date stamp in the filename for traceability.
`;
}

export async function writeStructureRule(
  targetDir: string,
  rulesPath: string,
  installedSkillIds: string[],
): Promise<boolean> {
  const content = generateStructureRule(installedSkillIds);
  if (!content) return false;

  const ruleFile = path.join(targetDir, rulesPath, 'qa-project-structure.mdc');
  await fs.ensureDir(path.dirname(ruleFile));
  await fs.writeFile(ruleFile, content, 'utf-8');
  return true;
}

export async function writeAgentsMd(
  targetDir: string,
  installedSkillIds: string[],
): Promise<boolean> {
  const section = generateAgentsMdSection(installedSkillIds);
  if (!section) return false;

  const agentsFile = path.join(targetDir, 'AGENTS.md');

  if (await fs.pathExists(agentsFile)) {
    const existing = await fs.readFile(agentsFile, 'utf-8');
    if (existing.includes('# QA Project Structure')) {
      const replaced = existing.replace(
        /# QA Project Structure[\s\S]*?(?=\n# |\n---|\Z)/,
        section,
      );
      await fs.writeFile(agentsFile, replaced, 'utf-8');
    } else {
      await fs.writeFile(agentsFile, existing.trimEnd() + '\n\n' + section, 'utf-8');
    }
  } else {
    await fs.writeFile(agentsFile, section, 'utf-8');
  }

  return true;
}
