# Coverage Tools Reference

Reference for code coverage tools: Istanbul, V8, JaCoCo, coverage.py, and SonarQube. Use for parsing reports and configuring coverage analysis.

---

## JavaScript / TypeScript

### Istanbul (nyc / c8)

**Purpose:** Line, branch, function, statement coverage for Node.js and browser tests.

**Install:**
```bash
npm install -D c8
# or
npm install -D nyc
```

**Run:**
```bash
c8 npm test
# or
nyc npm test
```

**Report formats:** JSON, LCOV, HTML, text-summary

**Output location:** `coverage/` (default)

**Key config (package.json or .nycrc):**
```json
{
  "coverage": {
    "reporter": ["text", "lcov", "html"],
    "exclude": ["**/*.test.js", "**/node_modules/**"]
  }
}
```

### V8 Native Coverage

**Purpose:** Native V8 coverage (Chrome/Node); often used with Vitest, Jest, or Playwright.

**Vitest:**
```javascript
// vitest.config.ts
export default {
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', '**/*.spec.ts']
    }
  }
}
```

**Jest (with v8):**
```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov', 'html']
};
```

**Report formats:** V8 format, LCOV, HTML

---

## Java

### JaCoCo

**Purpose:** Line, branch, instruction coverage for JVM languages (Java, Kotlin, Scala).

**Maven:**
```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.11</version>
  <executions>
    <execution>
      <goals><goal>prepare-agent</goal></goals>
      <configuration>
        <destFile>${project.build.directory}/jacoco.exec</destFile>
      </configuration>
    </execution>
    <execution>
      <id>report</id>
      <phase>test</phase>
      <goals><goal>report</goal></goals>
    </execution>
  </executions>
</plugin>
```

**Gradle:**
```groovy
plugins {
  id 'jacoco'
}
jacoco {
  toolVersion = "0.8.11"
}
test {
  finalizedBy jacocoTestReport
}
```

**Report formats:** XML, HTML, CSV

**Output:** `target/site/jacoco/` (Maven), `build/reports/jacoco/` (Gradle)

**Parsing:** XML report contains `<package>`, `<class>`, `<counter type="LINE">` etc.

---

## Python

### coverage.py

**Purpose:** Line and branch coverage for Python.

**Install:**
```bash
pip install coverage
```

**Run:**
```bash
coverage run -m pytest
coverage report
coverage html
```

**Config (.coveragerc or pyproject.toml):**
```ini
[run]
source = src
omit = */tests/*, */venv/*

[report]
exclude_lines =
    pragma: no cover
    def __repr__
```

**Report formats:** XML (Cobertura), HTML, JSON

**Output:** `htmlcov/`, `coverage.xml`

**Branch coverage:**
```bash
coverage run --branch -m pytest
```

---

## SonarQube

**Purpose:** Centralized quality and coverage across languages. Aggregates coverage from Istanbul, JaCoCo, coverage.py, etc.

**Setup:**
1. Run SonarQube server (Docker or standalone)
2. Configure `sonar-project.properties`:
```properties
sonar.projectKey=my-project
sonar.sources=src
sonar.tests=test
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.java.jacoco.reportPaths=target/site/jacoco/jacoco.xml
sonar.python.coverage.reportPaths=coverage.xml
```
3. Run scanner: `sonar-scanner`

**Coverage sources:** LCOV (JS/TS), JaCoCo XML (Java), Cobertura/coverage.xml (Python)

**Use for:** Unified dashboard, quality gates, trend tracking

---

## Report Parsing Tips

| Tool | Key File | Structure |
|------|----------|-----------|
| Istanbul/c8 | coverage/coverage-final.json | `[file path]: { s: statements, f: functions, b: branches }` |
| JaCoCo | jacoco.xml | `<package name="">` → `<class>` → `<counter type="LINE" missed="..." covered="..."/>` |
| coverage.py | coverage.xml | Cobertura format: `<packages>` → `<package>` → `<classes>` → `<line number="..." hits="..."/>` |
| SonarQube | API / scanner output | Use Sonar API or scanner for aggregated metrics |

---

## CI Integration

| CI | Example |
|----|---------|
| GitHub Actions | `npm run test:coverage` → upload `coverage/` artifact |
| GitLab CI | `coverage: '/Lines:\s+(\d+\.?\d*)%/'` in job |
| Jenkins | Publish HTML/LCOV/XML; use Coverage plugin |
| Azure Pipelines | Publish Code Coverage task with format (Cobertura, JaCoCo) |
