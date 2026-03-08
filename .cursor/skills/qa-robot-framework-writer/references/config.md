# Robot Framework Configuration

## CLI Options

### Basic Execution

```bash
robot tests/                          # Run all tests in tests/
robot login.robot                     # Run single file
robot tests/login.robot tests/api/    # Run specific files/dirs
```

### Output and Reports

| Option | Description | Example |
| ------ | ----------- | ------- |
| `-d DIR` | Output directory | `-d results` |
| `-o FILE` | Output XML file | `-o output.xml` |
| `-l FILE` | Log file (HTML) | `-l log.html` |
| `-r FILE` | Report file (HTML) | `-r report.html` |
| `-N NAME` | Set suite name | `-N "Smoke Tests"` |

```bash
robot -d results -l results/log.html -r results/report.html tests/
```

### Variables

| Option | Description | Example |
| ------ | ----------- | ------- |
| `-v VAR:value` | Set scalar variable | `-v BROWSER:chrome` |
| `-v VAR:value1;value2` | Set list variable | `-v USERS:user1;user2` |
| `-V FILE` | Variable file (Python/YAML) | `-V config/env.py` |
| `--variablefile FILE` | Legacy variable file | `--variablefile env.py` |

```bash
robot -v BROWSER:headlesschrome -v BASE_URL:https://staging.example.com -V config/prod.py tests/
```

### Test Selection

| Option | Description | Example |
| ------ | ----------- | ------- |
| `-t "Test Name"` | Run specific test | `-t "User Can Log In"` |
| `-i TAG` | Include tests with tag | `-i smoke` |
| `-e TAG` | Exclude tests with tag | `-e slow` |
| `--include TAG*` | Include (supports patterns) | `--include smoke*` |
| `--exclude TAG*` | Exclude (supports patterns) | `--exclude skip` |

```bash
robot -i smoke --exclude slow -d results tests/
```

### Execution Control

| Option | Description | Example |
| ------ | ----------- | ------- |
| `--loglevel LEVEL` | Log level (TRACE, DEBUG, INFO, WARN) | `--loglevel DEBUG` |
| `--randomize all` | Randomize test order | `--randomize all` |
| `--rerunfailed FILE` | Re-run failed tests from output | `--rerunfailed output.xml` |
| `--dryrun` | Validate without executing | `--dryrun` |
| `--test "Name"` | Run single test | `--test "Login Test"` |
| `--suite "Suite"` | Run single suite | `--suite "Login"` |

### Parallel Execution (pabot)

For parallel runs, use `pabot` (parallel Robot Framework):

```bash
pip install robotframework-pabot
pabot --processes 4 -d results tests/
```

---

## Variable Files

### Python Variable File

**config/env.py:**
```python
def get_variables(env=None):
    return {
        'BROWSER': 'chrome',
        'BASE_URL': 'https://example.com',
        'HEADLESS': env == 'ci',
    }
```

Dynamic variables based on environment:

```python
import os

def get_variables():
    return {
        'BASE_URL': os.getenv('BASE_URL', 'https://default.example.com'),
        'API_KEY': os.getenv('API_KEY', ''),
    }
```

### YAML Variable File

**config/default.yaml:**
```yaml
BROWSER: chrome
BASE_URL: https://example.com
USERS:
  - user1
  - user2
```

### JSON Variable File (RF 6.0+)

**config/default.json:**
```json
{
  "BROWSER": "chrome",
  "BASE_URL": "https://example.com"
}
```

---

## robot.yaml / pyproject.toml

Robot Framework 6.0+ supports `robot.yaml` for configuration:

**robot.yaml:**
```yaml
default:
  outputDir: results
  log: results/log.html
  report: results/report.html
  variableFiles:
    - config/env.yaml
  variables:
    BROWSER: chrome
  include:
    - smoke
  exclude:
    - skip
```

Or in **pyproject.toml** under `[tool.robotframework]`:

```toml
[tool.robotframework]
outputDir = "results"
log = "results/log.html"
report = "results/report.html"
variableFiles = ["config/env.yaml"]
```

---

## Listeners

Custom listeners for hooks (start/end suite, test, keyword):

**listeners/custom_listener.py:**
```python
class CustomListener:
    ROBOT_LISTENER_API_VERSION = 3

    def start_test(self, data, test):
        print(f"Starting: {test.name}")

    def end_test(self, data, test):
        print(f"Ended: {test.name} - {test.status}")
```

Usage: `robot --listener listeners/custom_listener.py tests/`

---

## Resource and Library Paths

- **Resource imports** — Relative to the file containing the import
- **PYTHONPATH** — For Python libraries; set before running: `export PYTHONPATH=libs:$PYTHONPATH`
- **--pythonpath** — Add path: `robot --pythonpath libs tests/`

---

## Recommended Project Layout

```
project/
├── tests/
│   ├── login.robot
│   ├── checkout.robot
│   └── api/
│       └── users.robot
├── resources/
│   ├── common.robot
│   ├── login_keywords.robot
│   └── api_keywords.robot
├── variables/
│   ├── env.yaml
│   └── prod.py
├── results/           # -d results
├── robot.yaml         # Optional config
└── requirements.txt
```
