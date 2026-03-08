---
name: qa-test-doc-compiler
description: Compile formal test documentation per ISO/IEC/IEEE 29119-3 including test policies, plans, specifications, execution logs, incident reports, and completion reports.
output_dir: docs/compiled
dependencies:
  recommended:
    - qa-test-reporter
---

# QA Test Doc Compiler

## Purpose

Compile formal test documentation per ISO/IEC/IEEE 29119-3. Collect inputs from other QA skills, organize content per ISO structure, format documents, and validate completeness. Supports tailoring for Agile, Scrum, and DevOps contexts.

## Document Types

| Category | Document Types |
| -------- | -------------- |
| **Governance** | Test Policy, Organizational Test Practices |
| **Planning** | Project Test Plan, Level Test Plans (unit/integration/system/acceptance), Type Test Plans (functional/performance/security) |
| **Specification** | Test Model Specification, Test Case Specification, Test Procedure Specification |
| **Execution** | Test Execution Log, Test Incident Report |
| **Reporting** | Test Status Report, Test Completion Report |
| **Readiness** | Test Data Requirements, Test Environment Requirements, Test Data Readiness Report, Test Environment Readiness Report |

See `references/iso-29119-3-documents.md` for required sections per document type.

## Document Compilation Workflow

1. **Collect inputs** — Gather content from other skills:
   - `qa-requirements-generator` → requirements, acceptance criteria
   - `qa-plan-creator` → test plans, sprint plans, release plans
   - `qa-spec-writer` → specifications, acceptance criteria
   - `qa-testcase-from-docs` → test cases, RTM
   - `qa-nfr-analyst` → NFR criteria for performance/security plans
   - Manual inputs: execution logs, incident reports, status updates

2. **Organize per ISO structure** — Map content to ISO 29119-3 document templates. Use `references/iso-29119-3-documents.md` for mandatory/recommended sections.

3. **Format** — Apply consistent formatting (Markdown, tables, traceability IDs). Call `qa-diagram-generator` for Gantt charts, flowcharts, or RTM visualizations when needed.

4. **Validate completeness** — Check:
   - All mandatory sections present
   - Traceability links preserved (requirement → test model → test case → procedure)
   - IDs follow project conventions
   - No orphaned references

5. **Tailor for context** — If Agile/DevOps, apply `references/agile-tailoring.md` to reduce ceremony and merge documents where appropriate.

## Trigger Phrases

- "Compile test documentation per ISO 29119-3"
- "Create test policy / organizational test practices"
- "Assemble test plan from [sources]"
- "Format test execution log / incident report"
- "Generate test completion report"
- "Tailor ISO 29119-3 for Agile/DevOps"

## Scope

**Can do (autonomous):**
- Compile any ISO 29119-3 document type from provided inputs
- Organize content into ISO structure
- Merge outputs from multiple QA skills into coherent documents
- Apply Agile/DevOps tailoring per reference guide
- Call qa-diagram-generator for timelines, RTM, flowcharts
- Validate mandatory sections and traceability

**Cannot do (requires confirmation):**
- Create content from scratch without inputs (policy, practices, plans need stakeholder input)
- Override organizational test policy or practices
- Change scope or priorities set by stakeholders

**Will not do (out of scope):**
- Execute tests or automation
- Modify production code or environments
- Approve documents (approval is stakeholder responsibility)
- Generate test code

## Embedding: Diagram Generator

When visualization is needed, reference qa-diagram-generator:
- **Timelines** → `references/gantt.md`
- **Traceability** → `references/flowchart.md` or mindmap
- **Test flow** → `references/sequence.md`

## Quality Checklist

- [ ] Document type matches ISO 29119-3 definition
- [ ] All mandatory sections present per `references/iso-29119-3-documents.md`
- [ ] Traceability links preserved (REQ → model → case → procedure)
- [ ] IDs follow project conventions (e.g., TC-001, TIR-001)
- [ ] Agile tailoring applied when context is Agile/DevOps
- [ ] No hardcoded secrets or sensitive data
- [ ] Format consistent (Markdown, tables, headings)

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Missing mandatory sections | Inputs incomplete or wrong document type | Check `references/iso-29119-3-documents.md`; request missing inputs |
| Broken traceability links | IDs changed or content merged incorrectly | Re-map requirement → test case links; validate RTM |
| Document too heavy for Agile | Full ISO structure applied | Apply `references/agile-tailoring.md`; merge/omit non-essential sections |
| Inconsistent formatting | Multiple sources with different styles | Normalize to single template; use consistent ID prefixes |
| Orphaned references | Deleted or renamed items | Audit references; update or remove broken links |
| Policy conflicts with plan | Stakeholder input contradicts | Flag for resolution; do not override policy |

## Reference Files

| Topic | File |
| ----- | ---- |
| ISO 29119-3 document types & sections | `references/iso-29119-3-documents.md` |
| Agile/Scrum/DevOps tailoring | `references/agile-tailoring.md` |
