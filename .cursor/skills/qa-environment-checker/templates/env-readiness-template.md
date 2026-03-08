# Environment Readiness Checklist

**Environment:** {staging | UAT | production | local}
**Date:** {YYYY-MM-DD}
**Checked by:** {name}

---

## Services

| Service | URL | Status | Notes |
|---------|-----|--------|-------|
| {service name} | {URL} | ☐ Up ☐ Down ☐ Unknown | |
| {service name} | {URL} | ☐ Up ☐ Down ☐ Unknown | |
| {service name} | {URL} | ☐ Up ☐ Down ☐ Unknown | |

---

## Database

| Check | Status | Notes |
|-------|--------|-------|
| Connection | ☐ OK ☐ Fail | {connection string or host} |
| Migrations applied | ☐ Yes ☐ No ☐ N/A | {version if applicable} |
| Test data seeded | ☐ Yes ☐ No ☐ N/A | |

---

## Accounts

| Account | Purpose | Status |
|---------|---------|--------|
| {user/role} | {purpose} | ☐ Ready ☐ Missing |
| {user/role} | {purpose} | ☐ Ready ☐ Missing |

---

## Configuration

- ☐ Config files present: {path}
- ☐ Environment variables set: {list or N/A}
- ☐ Feature flags: {enabled/disabled as expected}

---

## Dependencies & Tools

| Tool | Required Version | Installed | Status |
|------|------------------|-----------|--------|
| {tool} | {version} | {version} | ☐ OK ☐ Missing |
| {tool} | {version} | {version} | ☐ OK ☐ Missing |

---

## Ports & Network

| Port | Service | Status |
|------|---------|--------|
| {port} | {service} | ☐ Open ☐ Blocked |
| {port} | {service} | ☐ Open ☐ Blocked |

---

**Overall:** ☐ Ready for testing ☐ Not ready — blockers: {list}
