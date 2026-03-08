export interface SkillDependency {
  recommended: string[];
  reason: string;
}

/**
 * Dependency map: skill ID (without qa- prefix) -> recommended companion skills.
 * Only lists strong/moderate pairings where skills genuinely enhance each other.
 * Pipeline-upstream skills (e.g. every writer recommending testcase-from-docs) are omitted.
 */
export const SKILL_DEPENDENCIES: Record<string, SkillDependency> = {
  'requirements-generator': {
    recommended: ['discovery-interview'],
    reason: 'Auto-delegates when input is insufficient (<3 sentences)',
  },
  'spec-writer': {
    recommended: ['requirements-generator'],
    reason: 'Transforms requirements into detailed specs',
  },
  'plan-creator': {
    recommended: ['diagram-generator'],
    reason: 'Embeds diagrams into plans (Gantt, flowchart)',
  },
  'test-strategy': {
    recommended: ['diagram-generator', 'risk-analyzer'],
    reason: 'Uses diagrams for visualization and risk data for prioritization',
  },
  'test-doc-compiler': {
    recommended: ['test-reporter'],
    reason: 'Aggregates test reports into ISO 29119-3 documents',
  },
  'testcase-from-docs': {
    recommended: ['requirements-generator', 'spec-writer'],
    reason: 'Best results when fed structured requirements/specs',
  },
  'testcase-from-ui': {
    recommended: ['browser-data-collector'],
    reason: 'Browser data collector provides page structure for test case generation',
  },
  'task-creator': {
    recommended: ['bug-ticket-creator'],
    reason: 'Paired mode: auto-create linked fix tasks from bug tickets',
  },
  'bug-ticket-creator': {
    recommended: ['task-creator', 'github-issues-enhanced'],
    reason: 'Create GitHub Issues and linked fix tasks',
  },
  'spec-auditor': {
    recommended: ['requirements-generator', 'spec-writer'],
    reason: 'Compares live behavior against requirement and spec docs',
  },
  'risk-analyzer': {
    recommended: ['coverage-analyzer'],
    reason: 'Uses coverage data in risk formula: Risk = Complexity x ChangeFreq x (1 - Coverage)',
  },
  'flaky-detector': {
    recommended: ['test-healer'],
    reason: 'Test healer auto-fixes issues that flaky detector identifies',
  },
  'orchestrator': {
    recommended: ['diagram-generator', 'discovery-interview'],
    reason: 'Orchestrator chains depend on these embedded services',
  },
  'pact-writer': {
    recommended: ['api-contract-curator'],
    reason: 'Contract tests work best with formalized API contracts',
  },
  'supertest': {
    recommended: ['api-contract-curator'],
    reason: 'API tests benefit from structured OpenAPI contracts',
  },
  'httpx': {
    recommended: ['api-contract-curator'],
    reason: 'API tests benefit from structured OpenAPI contracts',
  },
  'rest-assured': {
    recommended: ['api-contract-curator'],
    reason: 'API tests benefit from structured OpenAPI contracts',
  },
  'github-issues-enhanced': {
    recommended: ['bug-ticket-creator'],
    reason: 'Enhanced GitHub workflows work with structured bug reports',
  },
  'jira-integration': {
    recommended: ['bug-ticket-creator', 'task-creator'],
    reason: 'Syncs bug tickets and tasks to Jira issues',
  },
  'linear-integration': {
    recommended: ['bug-ticket-creator', 'task-creator'],
    reason: 'Syncs bug tickets and tasks to Linear issues',
  },
  'clickup-integration': {
    recommended: ['bug-ticket-creator', 'task-creator'],
    reason: 'Syncs bug tickets and tasks to ClickUp tasks',
  },
  'shortcut-integration': {
    recommended: ['bug-ticket-creator', 'task-creator'],
    reason: 'Syncs bug tickets and tasks to Shortcut stories',
  },
  'qase-integration': {
    recommended: ['testcase-from-docs', 'test-reporter'],
    reason: 'Syncs test cases and results with Qase.io TMS',
  },
};

export interface DependencySuggestion {
  requiredBy: string;
  skillId: string;
  reason: string;
}

/**
 * Given a list of selected skill IDs (without qa- prefix),
 * returns suggestions for missing recommended companions.
 */
export function resolveDependencies(selectedIds: string[]): DependencySuggestion[] {
  const selectedSet = new Set(selectedIds);
  const suggestions: DependencySuggestion[] = [];
  const alreadySuggested = new Set<string>();

  for (const id of selectedIds) {
    const dep = SKILL_DEPENDENCIES[id];
    if (!dep) continue;

    for (const rec of dep.recommended) {
      if (!selectedSet.has(rec) && !alreadySuggested.has(rec)) {
        suggestions.push({
          requiredBy: id,
          skillId: rec,
          reason: dep.reason,
        });
        alreadySuggested.add(rec);
      }
    }
  }

  return suggestions;
}
