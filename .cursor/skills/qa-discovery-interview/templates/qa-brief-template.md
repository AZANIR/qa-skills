---
id: "{{brief_id}}"
title: "QA Discovery Brief — {{project_name}}"
project: "{{project_name}}"
version: "{{document_version}}"
date: "{{YYYY-MM-DD}}"
interviewer: "{{interviewer}}"
interviewee: "{{interviewee}}"
status: "{{Draft | Reviewed | Approved}}"
---

# QA Discovery Brief — {{project_name}}

## 1. Product Overview

### 1.1 What We're Testing
{{Brief description of the product/feature, its purpose, and core value proposition.}}

### 1.2 Business Context
- **Impact of defects:** {{What happens if this ships with bugs?}}
- **User base:** {{Who uses it, how many, technical proficiency}}
- **Project type:** {{New / Existing / Migration / Redesign}}

## 2. Testing Scope & Objectives

### 2.1 In Scope
| Testing Type | Priority | Rationale |
|-------------|----------|-----------|
| {{Functional}} | {{P0}} | {{Core user flows}} |
| {{Performance}} | {{P1}} | {{SLA requirements}} |
| {{Security}} | {{P1}} | {{Handles PII}} |
| {{Accessibility}} | {{P2}} | {{WCAG AA target}} |

### 2.2 Out of Scope
| Area | Reason |
|------|--------|
| {{area}} | {{rationale}} |

### 2.3 Exit Criteria
- [ ] {{exit_criterion_1}}
- [ ] {{exit_criterion_2}}
- [ ] {{exit_criterion_3}}

## 3. Critical User Flows

### Flow 1: {{flow_name}}
{{Step-by-step description of the primary happy path.}}

### Flow 2: {{flow_name}}
{{Step-by-step description of the second critical flow.}}

### Flow 3: {{flow_name}}
{{Step-by-step description of the third critical flow.}}

### Edge Cases & Negative Scenarios
- {{edge_case_1}}
- {{edge_case_2}}
- {{negative_scenario_1}}

## 4. Technical Landscape

### 4.1 Technology Stack
| Layer | Technology |
|-------|-----------|
| Frontend | {{framework, language}} |
| Backend | {{framework, language}} |
| Database | {{type, engine}} |
| Infrastructure | {{cloud, hosting}} |

### 4.2 Architecture
{{Monolith / Microservices / Serverless / Hybrid — brief description.}}

### 4.3 External Integrations
| Service | Type | Mock Available? |
|---------|------|-----------------|
| {{service}} | {{API / webhook / SDK}} | {{Yes / No / Partial}} |

### 4.4 Technical Constraints
- {{constraint_1}}
- {{constraint_2}}

## 5. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| {{risk_1}} | {{High/Med/Low}} | {{High/Med/Low}} | {{action}} |
| {{risk_2}} | {{High/Med/Low}} | {{High/Med/Low}} | {{action}} |
| {{risk_3}} | {{High/Med/Low}} | {{High/Med/Low}} | {{action}} |

### Defect History / Known Problem Areas
- {{known_issue_1}}
- {{known_issue_2}}

## 6. Existing QA State

### 6.1 Current Testing
| Type | Coverage | Tools |
|------|----------|-------|
| {{Manual}} | {{areas}} | {{tool}} |
| {{Automated}} | {{areas}} | {{framework}} |

### 6.2 CI/CD Pipeline
{{Description of current pipeline, what runs automatically, deployment process.}}

### 6.3 Test Management
{{Tools used: Jira, Qase, TestRail, spreadsheets, none.}}

## 7. Team & Infrastructure

### 7.1 Team
| Role | Count | Automation Experience |
|------|-------|----------------------|
| {{QA}} | {{N}} | {{Junior/Mid/Senior}} |
| {{Dev}} | {{N}} | {{unit test writing}} |

### 7.2 Environments
| Environment | Purpose | Status |
|-------------|---------|--------|
| {{dev}} | {{development}} | {{Active}} |
| {{staging}} | {{pre-production}} | {{Active / Missing}} |

### 7.3 Browser / Device Matrix
| Browser/Device | Version | Priority |
|---------------|---------|----------|
| {{Chrome}} | {{latest}} | {{P0}} |
| {{Safari/iOS}} | {{latest}} | {{P1}} |

## 8. Compliance & Standards

| Standard | Applicability | Level/Scope |
|----------|--------------|-------------|
| {{WCAG 2.2}} | {{Yes / No / TBD}} | {{Level AA}} |
| {{OWASP}} | {{Yes / No / TBD}} | {{Top 10}} |
| {{GDPR}} | {{Yes / No / TBD}} | {{EU users}} |
| {{Industry-specific}} | {{Yes / No / TBD}} | {{scope}} |

## 9. Recommendations

### 9.1 Recommended Testing Approach
{{Summary of recommended testing types, frameworks, and strategy.}}

### 9.2 Recommended QA Skills Pipeline
```
{{skill_1}} → {{skill_2}} → {{skill_3}} → {{skill_4}}
```

### 9.3 Estimated Timeline
| Phase | Duration | Activities |
|-------|----------|------------|
| {{Setup}} | {{X days}} | {{environment, tools, framework}} |
| {{Test Design}} | {{X days}} | {{test cases, test data}} |
| {{Automation}} | {{X days}} | {{test writing, CI integration}} |
| {{Execution}} | {{X days}} | {{test runs, bug filing}} |

## 10. Open Questions & Assumptions

### Open Questions
1. {{question_needing_follow_up}}
2. {{question_needing_follow_up}}

### Assumptions
1. {{assumption_made_during_interview}}
2. {{assumption_made_during_interview}}

### Conflicts Resolved
| Conflict | Resolution | Decided By |
|----------|------------|------------|
| {{conflict}} | {{resolution}} | {{stakeholder}} |
