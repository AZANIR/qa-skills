---
name: qa-robot-framework-writer
description: Generate Robot Framework tests for E2E, acceptance testing, and RPA with keyword-driven human-readable syntax, SeleniumLibrary, BrowserLibrary, and RequestsLibrary.
output_dir: tests/e2e
---

# QA Robot Framework Writer

## Purpose

Write Robot Framework tests from test case specifications. Transform structured test cases (from qa-testcase-from-docs, qa-manual-test-designer, qa-testcase-from-ui, or specs) into executable `.robot` files with keyword-driven syntax, resource files, and proper configuration.

## Trigger Phrases

- "Write Robot Framework tests for [feature/flow]"
- "Generate Robot Framework E2E tests from test cases"
- "Create Robot Framework acceptance tests"
- "Add Robot Framework tests with SeleniumLibrary"
- "Robot Framework tests for [URL/flow]"
- "Robot Framework API tests with RequestsLibrary"
- "Robot Framework RPA automation for [task]"
- "BrowserLibrary Playwright tests in Robot Framework"
- "Data-driven Robot Framework tests"
- "BDD-style Robot Framework tests"

## Key Features

| Feature | Description |
| ------- | ----------- |
| **Keyword-driven** | Human-readable keywords; business logic in reusable keywords |
| **Human-readable syntax** | Plain-text, tab-separated; no programming required for basic tests |
| **SeleniumLibrary** | Browser automation (Open Browser, Input Text, Click Element) |
| **BrowserLibrary** | Playwright-based modern browser automation |
| **RequestsLibrary** | API testing (GET, POST, PUT, DELETE) |
| **Built-in data-driven** | FOR loops, template tests, variable tables |
| **Variable support** | `*** Variables ***`, variable files, `${VAR}` syntax |
| **Extensible via Python** | Custom libraries, listener APIs |

## Test Types

| Type | Scope | Approach |
|------|-------|----------|
| **E2E web** | Full user flows, browser interactions | SeleniumLibrary or BrowserLibrary |
| **Acceptance** | BDD-style Given/When/Then | Gherkin-like keywords |
| **RPA** | Desktop/file/process automation | RPA Framework, Process, OperatingSystem |
| **API** | REST endpoints | RequestsLibrary |

## Workflow

1. **Read test cases** — From specs, requirements, or manual test designs
2. **Generate .robot files** — Produce `{feature}.robot` with test cases and keywords
3. **Add resource files** — Shared keywords in `resources/*.robot`
4. **Configure** — Variable files, output dir, listeners, CLI options

## Context7 MCP

Use **Context7 MCP** for Robot Framework documentation when:
- Library keyword syntax (SeleniumLibrary, BrowserLibrary, RequestsLibrary) is uncertain
- Variable scope, FOR loops, or template syntax needs verification
- Resource file import or variable file format requires reference

## Key Patterns

| Pattern | Usage |
| ------- | ----- |
| `*** Settings ***` | Library imports, resource imports, suite/test setup |
| `*** Variables ***` | Suite-level variables |
| `*** Test Cases ***` | Test case definitions |
| `*** Keywords ***` | Reusable keyword definitions |
| Given/When/Then | BDD-style keyword naming |
| FOR loops | `FOR    ${item}    IN    @{list}` |
| IF/ELSE | `IF    condition    ...    ELSE    ...` |
| TRY/EXCEPT | Error handling in keywords |
| Template tests | Data-driven via `[Template]` |
| `[Documentation]` | Test/keyword documentation |
| `[Tags]` | Test categorization |

## Libraries

| Library | Purpose | Key Keywords |
| ------- | ------- | ------------ |
| **SeleniumLibrary** | Browser (Selenium) | Open Browser, Input Text, Click Element, Get Title, Close Browser |
| **BrowserLibrary** | Browser (Playwright) | New Browser, Click, Fill Text, Get Text, Close Browser |
| **RequestsLibrary** | API | GET, POST, PUT, DELETE, Create Session, Status Should Be |
| **BuiltIn** | Core | Log, Should Be Equal, Run Keyword If, Fail, Sleep |
| **Collections** | Lists/dicts | Get From List, Append To List, Dictionary Should Contain Key |
| **String** | String ops | Get Length, Should Contain, Replace String |
| **DateTime** | Date/time | Get Current Date, Add Time To Date |

## File Naming

- `{feature}.robot` — Test files (e.g., `login.robot`, `checkout.robot`)
- `resources/*.robot` — Resource files for shared keywords (e.g., `resources/common.robot`)
- `variables.py` or `variables.robot` — Variable files for environment/config

## Scope

**Can do (autonomous):**
- Generate Robot Framework tests from test case specs
- Create .robot files with Settings, Variables, Test Cases, Keywords
- Add resource files for shared keywords
- Use SeleniumLibrary, BrowserLibrary, RequestsLibrary as appropriate
- Apply BDD-style Given/When/Then, data-driven (FOR, template), TRY/EXCEPT
- Configure variable files, output dir, basic CLI options
- Call qa-diagram-generator for test flow diagrams if needed
- Use Context7 MCP for Robot Framework docs

**Cannot do (requires confirmation):**
- Change production code to satisfy tests
- Add tests for requirements not in source documents
- Override project-level Robot config without approval
- Install new libraries not in project dependencies

**Will not do (out of scope):**
- Execute tests (user runs `robot tests/` or `robot -d output tests/`)
- Write Playwright/Cypress TypeScript tests (use qa-playwright-ts-writer, qa-cypress-writer)
- Modify CI/CD pipelines

## References

- `references/patterns.md` — Keyword-driven, BDD, data-driven, resource files, variable files
- `references/libraries.md` — SeleniumLibrary, BrowserLibrary, RequestsLibrary, BuiltIn, Collections
- `references/config.md` — CLI options, variable files, output dir, listeners
- `references/best-practices.md` — Keyword naming, resource organization, variable scope, test independence

## Quality Checklist

- [ ] Tests match test case steps and expected results
- [ ] Keywords are reusable and well-named (Given/When/Then where appropriate)
- [ ] No hardcoded secrets or sensitive data (use variables)
- [ ] Resource files used for shared logic; no duplication
- [ ] Proper teardown (Close Browser, Delete All Sessions) in suite/test teardown
- [ ] File naming follows `{feature}.robot` convention
- [ ] [Documentation] and [Tags] applied for traceability
- [ ] Variable scope appropriate (suite vs test vs keyword)

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Keyword not found | Library not imported, typo | Add `Library    LibraryName` in Settings; check keyword spelling |
| Variable not defined | Scope or variable file | Define in Variables section or variable file; check `${VAR}` syntax |
| Element not found | Selector, timing | Use Wait Until Element Is Visible; verify locator (id, xpath, css) |
| Resource import fails | Path, file missing | Use relative path from test file; ensure resource exists |
| API test fails | Session, URL | Create Session before requests; verify base URL |
| Browser not opening | Driver, browser binary | Install chromedriver/geckodriver; or use BrowserLibrary (bundled) |
| FOR loop syntax error | Indentation, IN RANGE | Use 4+ spaces between FOR items; check `IN` vs `IN RANGE` |
