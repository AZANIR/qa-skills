---
name: qa-api-contract-curator
description: Manage and formalize API contracts from existing endpoints, swagger/JSON, network traffic, or developer interviews into OpenAPI specifications.
output_dir: docs/api-contracts
---

# QA API Contract Curator

## Purpose

Manage and formalize API contracts. Detect breaking changes, generate OpenAPI (OAS) specifications, and produce versioning rules. Transform disparate API information into a single, validated, version-controlled contract.

## Input Sources

| Source | Description | How to Use |
| ------ | ----------- | ---------- |
| **Existing endpoints** | Live API or network traffic capture | Capture requests/responses via HAR, Postman, browser DevTools; infer schema from payloads |
| **Swagger/OpenAPI JSON/YAML** | Existing spec files | Parse, validate, normalize to OpenAPI 3.x, fill gaps |
| **Developer interviews/descriptions** | Natural language API descriptions | Extract endpoints, methods, parameters, responses; formalize into OAS |
| **Codebase analysis** | Express routes, FastAPI endpoints, Spring controllers, etc. | Scan route definitions, decorators, DTOs; derive contract from implementation |

## Workflow

1. **Collect endpoint data** — Gather from one or more input sources; merge and deduplicate.
2. **Normalize into OpenAPI 3.x** — Convert all data into a single OpenAPI 3.x specification (YAML preferred).
3. **Validate schema completeness** — Ensure paths, schemas, parameters, and responses are documented; flag gaps.
4. **Detect breaking changes** — Compare against previous version (if available); produce breaking change report.
5. **Generate request/response examples** — Add realistic examples for each operation.

## Output

- **OpenAPI 3.x specification** (YAML) — Single source of truth for the API contract
- **Request/response examples** — Per-operation examples for documentation and testing
- **Versioning rules** — Semantic versioning guidance, deprecation notes
- **Breaking change report** — When comparing versions: list of breaking changes with severity and migration notes

## Breaking Change Detection

| Change Type | Description | Severity |
| ----------- | ----------- | -------- |
| **Removed endpoints** | Path or method no longer exists | Breaking |
| **Changed response schemas** | Added/removed fields, type changes | Breaking or additive |
| **Modified required fields** | New required field in request/response | Breaking |
| **Authentication changes** | New auth requirement, changed scheme | Breaking |
| **Parameter changes** | Removed/renamed path/query/header params | Breaking |
| **Status code changes** | Success/error codes removed or redefined | Breaking |
| **Additive changes** | New optional fields, new endpoints | Non-breaking |

See `references/breaking-changes.md` for catalog and mitigation strategies.

## Feeds Into

- **qa-supertest-writer** — TypeScript/Node API tests from contract
- **qa-httpx-writer** — Python API tests from contract
- **qa-pact-writer** — Consumer-driven contract tests from OAS

## Scope

**Can do (autonomous):**
- Generate OpenAPI 3.x from any supported input source
- Merge multiple sources into one spec
- Validate schema completeness and flag gaps
- Detect breaking changes vs previous version
- Generate request/response examples
- Document authentication schemes
- Define versioning strategy

**Cannot do (requires confirmation):**
- Modify production API implementation
- Change business logic or endpoint behavior
- Override stakeholder decisions on versioning

**Will not do (out of scope):**
- Implement API endpoints
- Deploy or modify live services
- Make business decisions about API design

## Quality Checklist

Before delivering an OpenAPI specification:

- [ ] All endpoints are documented (paths, methods, parameters)
- [ ] Request/response examples provided for each operation
- [ ] Error responses defined (4xx, 5xx) where applicable
- [ ] Authentication documented (security schemes, scopes)
- [ ] Versioning strategy defined (info.version, deprecation notes)
- [ ] Schemas are complete (no `{}` or placeholder types)
- [ ] Breaking change report included when comparing versions

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Missing request/response schemas | Source has no examples | Infer from code DTOs, add placeholder schemas, ask for samples |
| Duplicate paths from multiple sources | Same API documented in different formats | Merge by path+method, reconcile differences, prefer most complete |
| Breaking changes false positives | Optional vs required misinterpreted | Verify `required` arrays; additive optional changes are non-breaking |
| Auth not documented | Source lacks auth info | Check codebase for middleware, add `security` at spec or operation level |
| Invalid OpenAPI output | Schema syntax errors | Validate with `openapi-generator validate` or Swagger Editor |
| Incomplete codebase extraction | Framework not recognized | Add framework-specific patterns to extraction logic; fall back to manual |

## References

- `references/openapi-structure.md` — OpenAPI 3.x specification structure with examples
- `references/breaking-changes.md` — Catalog of breaking changes and mitigation strategies
