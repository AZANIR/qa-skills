# JMeter Configuration

## CLI Mode (Non-GUI)

### Basic Run

```bash
jmeter -n -t test.jmx -l results.jtl
```

| Option | Purpose |
|--------|---------|
| `-n` | Non-GUI mode (required for CI/headless) |
| `-t test.jmx` | Test plan file |
| `-l results.jtl` | Results file (JTL/CSV) |
| `-j jmeter.log` | Log file |
| `-q user.properties` | User properties file |

### HTML Report Generation

```bash
jmeter -n -t test.jmx -l results.jtl -e -o report/
```

| Option | Purpose |
|--------|---------|
| `-e` | Generate HTML report after run |
| `-o report/` | Output directory for HTML report |

Report includes: dashboard, APDEX, response times, throughput, errors.

### Property Overrides

```bash
jmeter -n -t test.jmx -l results.jtl -Jhost=api.staging.example.com -Jusers=50
```

| Option | Purpose |
|--------|---------|
| `-Jprop=value` | Set JMeter property (single) |
| `-Gprop=value` | Global property (distributed mode) |
| `-q user.properties` | Load from file |

Use in test plan: `${__P(host, default)}`, `${__P(users, 10)}`.

---

## Key Properties

### JTL Output Format

```properties
# user.properties or -J
jmeter.save.saveservice.output_format=csv
jmeter.save.saveservice.response_data=false
jmeter.save.saveservice.samplerData=false
jmeter.save.saveservice.requestHeaders=false
jmeter.save.saveservice.responseHeaders=false
jmeter.save.saveservice.url=false
jmeter.save.saveservice.filename=false
jmeter.save.saveservice.hostname=false
jmeter.save.saveservice.thread_counts=false
jmeter.save.saveservice.latency=true
jmeter.save.saveservice.timestamp_format=yyyy/MM/dd HH:mm:ss
jmeter.save.saveservice.print_field_names=true
```

Minimal JTL for performance: `timeStamp`, `elapsed`, `label`, `responseCode`, `success`, `bytes`, `latency`.

### HTML Report

```properties
jmeter.reportgenerator.overall_granularity=60000
jmeter.reportgenerator.apdex_satisfied_threshold=500
jmeter.reportgenerator.apdex_tolerated_threshold=1500
```

### JVM Heap

```bash
# Set in jmeter or jmeter.bat
HEAP="-Xms1g -Xmx4g -XX:MaxMetaspaceSize=256m"
```

Increase for high thread counts (e.g., 10k+ threads).

---

## Plugins

### JMeter Plugins Manager

Install via Plugins Manager (Options → Plugins Manager):

| Plugin | Purpose |
|--------|---------|
| **Custom Thread Groups** | Ultimate Thread Group, Stepping Thread Group |
| **3 Basic Graphs** | Response Times, Throughput, Active Threads |
| **PerfMon** | Server metrics (CPU, memory) |
| **Dummy Sampler** | Simulate responses for debugging |
| **JSON Path Assertion** | JSONPath assertions (built-in 5.2+) |

### Maven/Gradle

```xml
<!-- For programmatic JMeter execution -->
<dependency>
  <groupId>org.apache.jmeter</groupId>
  <artifactId>ApacheJMeter_core</artifactId>
  <version>5.6.3</version>
</dependency>
```

---

## Distributed Testing

### Architecture

- **Controller**: Runs GUI/non-GUI, orchestrates workers
- **Workers**: Run actual load, send results to controller

### Setup

1. **Same JMeter version** on all nodes
2. **Same plugins** on all nodes
3. **RMI ports**: 1099 (default), 4000 (server)
4. **Firewall**: Allow controller ↔ workers

### Start Workers

```bash
# On each worker machine
jmeter-server
# or
jmeter -s -Jserver.rmi.localport=50000
```

### Run from Controller

```bash
jmeter -n -t test.jmx -l results.jtl -R worker1,worker2,worker3
# or
jmeter -n -t test.jmx -l results.jtl -Gremote_hosts=worker1,worker2
```

| Option | Purpose |
|--------|---------|
| `-R host1,host2` | Remote hosts (workers) |
| `-Gprop=value` | Global property for all workers |
| `-Jserver.rmi.ssl.disable=true` | Disable RMI SSL if needed |

### Remote Hosts Property

```properties
# jmeter.properties
remote_hosts=127.0.0.1:1099,worker2:1099
```

---

## Directory Layout

```
project/
  jmeter/
    plans/
      api-load.jmx
      api-stress.jmx
    data/
      users.csv
    results/          # JTL output
    report/           # HTML report
  user.properties     # Overrides
  jmeter.log
```

---

## CI Integration (GitHub Actions)

```yaml
- name: Run JMeter
  run: |
    jmeter -n -t jmeter/plans/api-load.jmx \
      -l jmeter/results/results.jtl \
      -e -o jmeter/report \
      -Jhost=${{ env.API_HOST }} \
      -Jusers=${{ env.LOAD_USERS }}
```

---

## User Defined Variables

Define at Test Plan or Thread Group level:

| Variable | Value | Usage |
|----------|-------|-------|
| `host` | api.example.com | `${host}` |
| `basePath` | /v1 | `${basePath}` |
| `protocol` | https | `${protocol}` |

Prefer `${__P(var, default)}` for CI overrides.
