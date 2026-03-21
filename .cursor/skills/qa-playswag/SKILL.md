---
name: qa-playswag
description: Analyze OpenAPI/Swagger spec (JSON or YAML) against existing test files and generate an HTML coverage report with QA automation tasks. Use when user provides an OpenAPI spec file and wants to know test coverage status.
disable-model-invocation: true
allowed-tools: Read, Bash, Glob, Grep, Write, AskUserQuestion
---

# PlaySwag — API Coverage Analyzer

Analyze an OpenAPI spec against your test suite and generate an HTML report with coverage gaps + ready-made QA automation tasks.

**Usage:** `/playswag [spec-file] [tests-dir] [--js|--ts|--py]`

All arguments are **optional** — missing ones will be asked interactively.

---

## Step 1 — Gather Required Inputs

### Spec file

If `$ARGUMENTS` contains a path to a `.json`, `.yaml`, or `.yml` file — use it as `SPEC_FILE`.

Otherwise, **ask the user:**

> "What is the path to your OpenAPI/Swagger spec file? (JSON or YAML)"

Verify the file exists:
```bash
test -f "$SPEC_FILE" && echo "found" || echo "not found"
```

If not found, show the error and ask again.

---

### Tests directory

If `$ARGUMENTS` contains a second path argument — use it as `TESTS_DIR`.

Otherwise, **auto-detect** by checking (relative to spec file's parent dir, then cwd):
`tests/` → `test/` → `e2e/` → `__tests__/` → `specs/` → `src/tests/` → `.` (cwd)

If none of these exist, **ask the user:**

> "Where are your test files? (provide directory path, or press Enter to use current directory)"

---

### Language / Runner

Determine `LANG` from:
1. `--py` flag in `$ARGUMENTS` → `LANG=py`
2. `--ts` flag in `$ARGUMENTS` → `LANG=ts`
3. `--js` flag in `$ARGUMENTS` → `LANG=js`
4. Auto-detect: check if `node` is available → `LANG=js` (recommended default)
5. Auto-detect: check if `python3` is available → `LANG=py`
6. If unclear, **ask the user:**

> "Which runner should I use to analyze?"
> - **JavaScript** (node analyze.js) — runs anywhere with Node.js installed, no extra packages needed ✅
> - **TypeScript** (npx tsx analyze.ts) — requires tsx
> - **Python** (python3 analyze.py) — requires Python 3

---

## Step 2 — Locate Scripts

Find skill scripts dir. Try in order:

```bash
# Project-local (preferred)
SCRIPTS=".claude/skills/qa-playswag/scripts"

# Global install
SCRIPTS="$HOME/.claude/skills/qa-playswag/scripts"
```

Use whichever exists:
```bash
[ -f "$SCRIPTS/analyze.js" ] && echo "found" || echo "not found"
```

---

## Step 3 — Run the Analyzer

### JavaScript (LANG=js) — PRIMARY, recommended

`analyze.js` is pure CommonJS — runs with **any Node.js 14+**, zero dependencies needed for JSON specs.
For YAML specs it auto-tries `js-yaml`, `yaml`, then falls back to `python3`.

```bash
node "$SCRIPTS/analyze.js" "$SPEC_FILE" "$TESTS_DIR" [options]
```

### TypeScript (LANG=ts) — try runners in order:

```bash
npx --yes tsx "$SCRIPTS/analyze.ts" "$SPEC_FILE" "$TESTS_DIR" [options]
```

If tsx fails, try `ts-node` or compile+run. If all fail → **auto-fallback to analyze.js**.

### Python (LANG=py):

```bash
python3 "$SCRIPTS/analyze.py" "$SPEC_FILE" "$TESTS_DIR" [options]
```

If PyYAML missing and spec is YAML — `pip3 install pyyaml` first.
If Python fails → **auto-fallback to analyze.js** (if node available).

### Multi-spec & URL support

```bash
# Multiple spec files (merge endpoints, dedup by method+path)
node "$SCRIPTS/analyze.js" spec1.yaml spec2.yaml -- "$TESTS_DIR"

# Spec from URL (fetched and cached in /tmp for 5 min)
node "$SCRIPTS/analyze.js" https://api.example.com/openapi.json "$TESTS_DIR"
```

### CLI Options (all runtimes)

| Flag | Description |
|------|-------------|
| `--fail-under <pct>` | Exit 1 if endpoint coverage < `pct`% (CI quality gate) |
| `--output <dir>`, `-o <dir>` | Output directory (default: `./playswag-report`) |
| `--format <list>` | Comma-separated: `html`, `json`, `tasks`, `badge`, `junit` (default: all) |
| `--json-only` | Shorthand for `--format json` |
| `--include <patterns>` | Only analyze matching paths (comma-sep, wildcard `*`) |
| `--exclude <patterns>` | Skip matching paths |
| `--include-tags <tags>` | Only analyze endpoints with these tags |
| `--exclude-tags <tags>` | Skip endpoints with these tags |
| `--history` | Append to `playswag-history.json` and show delta |

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success (and coverage >= threshold, if specified) |
| `1` | Coverage below `--fail-under` threshold |
| `2` | Fatal error (spec not found, parse failure) |

### CI/CD Example (GitHub Actions)

```yaml
- name: API coverage gate
  run: node .cursor/skills/qa-playswag/scripts/analyze.js openapi.yaml tests/ --fail-under 80 --json-only
```

---

## Step 4 — Show Results

After the script runs, read `./playswag-report/summary.json` and display:

```
## PlaySwag Coverage Report

**Spec:** {spec-file}
**Tests:** {tests-dir}

| Metric                    | Value      |
|---------------------------|------------|
| 📊 Endpoint Coverage      | XX% (A/B)  |
| ✗ Uncovered endpoints     | N          |
| 🗑 Deprecated still tested | N          |
| 📋 QA Tasks created       | N          |
| ⚠ Unmatched test calls    | N          |

### Uncovered Endpoints (N) — by priority:

🔴 HIGH (POST/PUT/DELETE/auth):
  - POST /api/users — Create user [users]
  - DELETE /api/orders/{id} — Cancel order [orders]

🟡 MEDIUM (GET):
  - GET /api/reports — List reports [reports]

### Files:
→ HTML Report: ./playswag-report/report.html
→ QA Tasks:    ./playswag-report/tasks.md
→ Badge:       ./playswag-report/playswag-badge.svg
→ Summary:     ./playswag-report/summary.json

Open: open ./playswag-report/report.html
```

---

## Step 5 — Error Handling

| Error | What to do |
|-------|-----------|
| Spec file not found | Ask user to confirm path |
| JSON parse error | Show first 5 lines of file, ask user to fix |
| YAML parse error | Suggest `npm i js-yaml` or `pip3 install pyyaml` |
| `node` not found | Use Python script |
| `python3` not found | Inform user, suggest `brew install python3` |
| No test files found | Run anyway (0% coverage), inform user |
| Script error | Show stderr, offer manual analysis via Read+Grep |

**Manual fallback** (if all scripts fail):
1. Read spec with Read tool
2. Scan tests with Grep for URL/request patterns
3. Print text summary in chat
4. Write tasks.md manually

---

## Notes

### Supported spec formats

| Format | Version | Features |
|--------|---------|----------|
| OpenAPI 2.0 (Swagger) | JSON/YAML | `basePath`, `definitions`, `$ref` resolution |
| OpenAPI 3.0 | JSON/YAML | `servers[].url`, `components.schemas`, `$ref` resolution |
| OpenAPI 3.1 | JSON/YAML | Same as 3.0 |

### Test files detected

`.spec.ts/js`, `.test.ts/js`, `.e2e.ts/js`, `.spec.tsx/jsx`, `test_*.py`, `*_test.py`

### HTTP clients detected

Playwright `request`, axios, fetch, supertest (`request(app)`), got, ky, httpx, requests, cy.request (Cypress), Node.js http/https, RestAssured (`given().when()`), aiohttp session, `.request('METHOD', path)`

Template literal URLs (`/api/users/${id}`) are partially matched by extracting the static prefix.

### Output files

| File | Description |
|------|-------------|
| `report.html` | Interactive HTML report with filters, search, tag coverage, copy/export/print |
| `summary.json` | Machine-readable coverage data with `coverageByTag`, status code and parameter metrics |
| `tasks.md` | Markdown QA automation tasks sorted by priority |
| `playswag-badge.svg` | Shields.io-style SVG badge |
| `playswag-junit.xml` | JUnit XML for CI (uncovered = failure) |
| `playswag-history.json` | Coverage history for trend tracking (`--history`) |

### Coverage dimensions

| Dimension | Method |
|-----------|--------|
| Endpoint | Regex-matched API calls in tests vs spec paths |
| Status code | Assertion patterns (`.expect(200)`, `toHaveStatus()`, `assert status_code ==`) |
| Parameter | Name-match scan (param names from spec appearing in test files) |
| By tag | Per-tag breakdown (spec `tags` field) |

### QA task example

From `tasks.md`:

```markdown
### TASK-001: Cover `POST /api/users`

| Field | Value |
|-------|-------|
| **Priority** | High |
| **Endpoint** | `POST /api/users` |
| **Auth required** | Yes |

**Acceptance Criteria:**
- [ ] Happy path -> `201`
- [ ] Invalid input -> 400/422
- [ ] Unauthenticated -> 401
```

### Known limitations

- **Static analysis only** — regex-based; cannot detect dynamic URL construction or runtime-generated paths beyond template literal prefixes.
- **Status code coverage** is assertion-based (scans for `.expect(200)` etc.), not runtime-verified.
- **Parameter coverage** uses name-matching heuristic — a param name appearing in a test file is counted as "used", even if it's unrelated.
- **No auth flow verification** — `authRequired` flag comes from spec security definitions, but actual auth testing is not verified.
- **YAML** requires either `js-yaml`/`yaml` npm package, PyYAML, or `python3` with PyYAML as fallback.

### vs [MichalFidor/playswag](https://github.com/MichalFidor/playswag) (npm)

| | npm playswag | This skill |
|---|----------------|------------|
| Approach | Runtime (Playwright intercepts HTTP) | Static (regex scan of test files) |
| Spec | `$ref`, `servers` | Resolved `$ref`; `basePath` / `servers[].url`; multi-spec merge |
| Languages | TypeScript tests | JS / TS / Python (same canonical regex set) |
| Output | HTML | HTML + JSON + Markdown + SVG + JUnit XML |
| Coverage | Endpoint only | Endpoint + status code + parameter + by-tag |
| CI | — | `--fail-under`, JUnit XML, `--history` delta |

### Analyzer behavior

- **`basePath` (Swagger 2.0)** and **`servers[].url` path (OAS 3.x)** are collected and used when matching test URLs to spec paths (direct match, strip base, or base + template).
- **`$ref`** in the spec is resolved (JSON Pointer `#/...`) before parsing operations, so request body fields in QA tasks are populated from `components.schemas` / `definitions`.
- **Multi-spec** (`--` separator): endpoints are merged and deduplicated by `method:path`.
- **URL specs**: fetched via curl/wget/node http, cached in `/tmp` for 5 minutes.
- **YAML fallback** (when no js-yaml in Node): the temp spec path is passed via **`PLAYSWAG_YAML_FILE`** to Python — not embedded in the shell string.
- **`analyze.js`** is the safest runner — no build step, no extra packages, works in any Node.js 14+ project.
