# QA Discovery Interview — Completeness Checklist

Verify all critical areas are covered before generating the QA Discovery Brief. Each item must be either answered or explicitly marked N/A with rationale.

## Critical (Must Have)

| # | Area | Question | Status | Notes |
|---|------|----------|--------|-------|
| 1 | Product Overview | Do we know what the product/feature does? | {{Yes/No/Partial}} | |
| 2 | Testing Scope | Are testing types and boundaries defined? | {{Yes/No/Partial}} | |
| 3 | Critical Flows | Are top 3 user journeys identified? | {{Yes/No/Partial}} | |
| 4 | Tech Stack | Do we know frontend, backend, DB, and key integrations? | {{Yes/No/Partial}} | |
| 5 | Risk Areas | Are high-risk areas identified and ranked? | {{Yes/No/Partial}} | |
| 6 | Exit Criteria | Is "done" defined for QA? | {{Yes/No/Partial}} | |

## Important (Should Have)

| # | Area | Question | Status | Notes |
|---|------|----------|--------|-------|
| 7 | User Roles | Are different user roles and their permissions clear? | {{Yes/No/N-A}} | |
| 8 | Environments | Do we know what environments exist and their purpose? | {{Yes/No/N-A}} | |
| 9 | Existing Tests | Do we know what testing already exists? | {{Yes/No/N-A}} | |
| 10 | CI/CD | Is the CI/CD pipeline understood? | {{Yes/No/N-A}} | |
| 11 | Team Skills | Do we know the team's automation capability? | {{Yes/No/N-A}} | |
| 12 | Timeline | Are schedule constraints known? | {{Yes/No/N-A}} | |

## Optional (Nice to Have)

| # | Area | Question | Status | Notes |
|---|------|----------|--------|-------|
| 13 | Compliance | Are regulatory requirements identified? | {{Yes/No/N-A}} | |
| 14 | Accessibility | Is WCAG level defined? | {{Yes/No/N-A}} | |
| 15 | Security | Are security testing requirements clear? | {{Yes/No/N-A}} | |
| 16 | Performance | Are SLAs/thresholds defined? | {{Yes/No/N-A}} | |
| 17 | Browser/Device Matrix | Are supported platforms listed? | {{Yes/No/N-A}} | |
| 18 | Defect History | Are historical patterns known? | {{Yes/No/N-A}} | |

## Completeness Scoring

| Score | Meaning | Action |
|-------|---------|--------|
| **All Critical = Yes** | Ready to generate brief | Proceed to Phase 6 |
| **1-2 Critical = Partial** | Gaps exist but manageable | Note gaps in brief, recommend follow-up |
| **Any Critical = No** | Not ready | Return to Phase 2, ask targeted questions for missing areas |
| **Important mostly N/A** | New project or limited context | Acceptable — note assumptions in brief |

## Before Generating Brief

- [ ] All 6 Critical items are Yes or Partial (with notes)
- [ ] No unresolved conflicts from Phase 4
- [ ] Interviewee confirmed summary is accurate
- [ ] Assumptions are explicitly stated
- [ ] Research loops completed for uncertain areas
