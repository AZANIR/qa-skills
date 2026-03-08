---
name: qa-locust-writer
description: Generate Locust performance tests in Python for load testing with distributed mode, custom load shapes, and real-time web UI monitoring.
output_dir: tests/performance
---

# QA Locust Writer

## Purpose

Write Locust performance tests from test case specifications and performance plans. Transform structured test cases (from qa-testcase-from-docs, qa-manual-test-designer) and performance plans (from qa-plan-creator, qa-nfr-analyst) into executable Locust load tests with distributed mode, custom load shapes, real-time web UI, and event hooks.

## Trigger Phrases

- "Write Locust tests for [API/endpoint]"
- "Generate Locust load tests from performance plan"
- "Create Locust stress tests for [service]"
- "Add Locust tests with custom load shape"
- "Locust distributed load test for [URL]"
- "Python load tests with Locust"
- "Locust soak test for [endpoint]"
- "Spike test with Locust"
- "Locust tests with web UI"

## Key Features

| Feature | Description |
| ------- | ----------- |
| **HttpUser class** | Base class for HTTP-based load; `self.client` for requests |
| **TaskSets** | Group related tasks; nest for complex flows |
| **@task decorator** | Define user behaviors with optional weight |
| **wait_time** | `between`, `constant`, `constant_pacing` for think time |
| **Custom load shapes** | `LoadTestShape` for ramp, spike, soak, custom profiles |
| **Event hooks** | `events.request`, `events.init`, `events.test_start/stop` |
| **Distributed mode** | Master/worker for scaling across machines |
| **Real-time web UI** | Built-in dashboard at `http://localhost:8089` |

## Test Types

| Type | Description | Use Case |
| ---- | ----------- | -------- |
| **Load** | Steady load to verify baseline capacity | Baseline, capacity planning |
| **Stress** | Increase load until failure | Find breaking point |
| **Spike** | Sudden burst of traffic | Black Friday, flash sales |
| **Soak** | Sustained load over hours | Memory leaks, stability |
| **Custom shapes** | User-defined profile via LoadTestShape | Complex scenarios |

## Workflow

1. **Read performance plan** — From qa-plan-creator, qa-nfr-analyst, or test case specs
2. **Define user classes** — Create `HttpUser` subclasses per user type (e.g., `ApiUser`, `WebUser`)
3. **Set task weights** — Use `@task(weight=N)` for probability distribution
4. **Generate locustfile** — Produce `locustfile.py` with user classes, tasks, wait_time
5. **Configure** — Add `locust.conf` or CLI args; document distributed setup

## Context7 MCP

Use **Context7 MCP** for Locust documentation when:
- HttpUser, TaskSet, or LoadTestShape APIs need verification
- Event hooks or distributed mode options are uncertain
- wait_time, task weights, or configuration syntax require clarification

## Key Patterns

| Pattern | Usage |
| ------- | ----- |
| `class MyUser(HttpUser)` | Define user class; inherits `self.client` |
| `@task` / `@task(weight=3)` | Task method; weight = relative probability |
| `wait_time = between(1, 3)` | Random wait between tasks (seconds) |
| `wait_time = constant(2)` | Fixed wait |
| `wait_time = constant_pacing(1)` | Maintain ~1 req/sec per user |
| `self.client.get(url)` / `self.client.post(url)` | HTTP requests |
| `on_start` / `on_stop` | Setup/teardown per user instance |
| `LoadTestShape` | Custom load profile; override `tick()` |
| `events.request.add_listener` | Request-level hooks (success/failure) |

See `references/patterns.md` for user classes, task sets, load shapes, events, distributed.

## Distributed Setup

| Role | Command | Purpose |
| ---- | ------- | ------- |
| **Master** | `locust -f locustfile.py --master` | Coordinates workers, aggregates stats |
| **Worker** | `locust -f locustfile.py --worker --master-host=<master-ip>` | Runs load |
| **Expect workers** | `--expect-workers=4` | Master waits for N workers before starting |

## Configuration

- **CLI args** — `--host`, `--users`, `--spawn-rate`, `--run-time`, `--headless`
- **locust.conf** — Same options in config file
- **Environment variables** — `LOCUST_HOST`, `LOCUST_USERS`, etc.

See `references/config.md` for full configuration guide.

## File Naming

- `locustfile.py` — Default; or `locustfile_{service}.py` for multiple files
- `locust.conf` — Optional configuration
- Place in `tests/load/` or project root per convention

## Scope

**Can do (autonomous):**
- Generate Locust load tests from performance plans and test cases
- Define HttpUser classes, tasks, task weights, wait_time
- Implement LoadTestShape for load, stress, spike, soak profiles
- Add event hooks for request logging, custom metrics
- Document distributed setup (master/worker)
- Configure locust.conf, CLI args, env vars
- Use Context7 MCP for Locust docs

**Cannot do (requires confirmation):**
- Change production API implementation
- Add dependencies not in requirements.txt/pyproject.toml
- Override project config without approval
- Target production URLs without explicit request

**Will not do (out of scope):**
- Execute load tests (user runs `locust`)
- Write E2E browser tests (use qa-playwright-ts-writer)
- Modify CI/CD pipelines
- Bypass rate limits or ToS

## References

- `references/patterns.md` — User classes, task sets, load shapes, events, distributed
- `references/config.md` — CLI, locust.conf, environment variables, distributed setup
- `references/best-practices.md` — Realistic scenarios, correlation, custom shapes, CI integration

## Quality Checklist

- [ ] User classes match performance plan user types
- [ ] Task weights reflect realistic user behavior distribution
- [ ] wait_time is appropriate (avoid constant(0) unless intentional)
- [ ] No hardcoded secrets; use env vars for host, auth
- [ ] LoadTestShape tick() returns (user_count, spawn_rate) or None
- [ ] Event hooks do not block or slow down requests
- [ ] Distributed setup documented when scaling required
- [ ] Traceability to performance plan / NFR criteria

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Connection refused | Wrong host or service down | Verify `--host`; ensure target is reachable |
| Low RPS despite many users | wait_time too high or blocking | Reduce wait_time; avoid sync I/O in tasks |
| Workers not connecting | Firewall, wrong master host | Check `--master-host`; open port 5557 |
| Memory growth in soak test | Leaks in app or test code | Profile app; avoid accumulating state in tasks |
| Inconsistent results | Shared state, non-determinism | Use per-user state; avoid global variables |
| Task distribution wrong | Incorrect weights | Verify @task(weight=N) sums; check task selection |
| Load shape not applied | LoadTestShape not used | Pass `--class-picker` or ensure shape in locustfile |
