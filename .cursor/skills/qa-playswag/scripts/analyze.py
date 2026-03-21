#!/usr/bin/env python3
"""
playswag — API Coverage Analyzer (Python)
Analyzes OpenAPI/Swagger spec vs existing test files.
Generates HTML report + Markdown tasks for QA automation engineers.

Usage:
    python3 analyze.py <spec-file> [tests-dir]
    python3 analyze.py spec1.yaml spec2.yaml -- tests/
    python3 analyze.py https://api.example.com/openapi.json tests/

Requirements:
    pip install pyyaml     (optional, for YAML specs)
"""

from __future__ import annotations

import copy
import fnmatch
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path
from datetime import datetime
from dataclasses import dataclass, field
from typing import Optional


# ─── Data types ───────────────────────────────────────────────────────────────

@dataclass
class OAParameter:
    name: str
    location: str  # query, path, header, cookie
    required: bool
    description: str = ""


@dataclass
class OAEndpoint:
    method: str
    path: str
    operation_id: str = ""
    summary: str = ""
    description: str = ""
    tags: list[str] = field(default_factory=list)
    deprecated: bool = False
    parameters: list[OAParameter] = field(default_factory=list)
    request_body_fields: list[str] = field(default_factory=list)
    status_codes: list[str] = field(default_factory=list)
    auth_required: bool = False


@dataclass
class TestHit:
    method: str
    matched_path: str
    raw_url: str
    file: str
    line: int
    partial: bool = False


@dataclass
class CoverageReport:
    spec_file: str | list[str]
    tests_dir: str
    timestamp: str
    endpoints: list[OAEndpoint]
    test_hits: list[TestHit]
    covered: list[OAEndpoint]
    uncovered: list[OAEndpoint]
    deprecated: list[OAEndpoint]
    deprecated_in_tests: list[dict]
    orphan_hits: list[TestHit]
    endpoint_coverage: float
    status_code_coverage: float
    parameter_coverage: float = 0.0
    coverage_by_tag: dict = field(default_factory=dict)


# ─── URL fetch (TASK-006) ─────────────────────────────────────────────────────

def is_url(s: str) -> bool:
    return isinstance(s, str) and (s.startswith("http://") or s.startswith("https://"))


def fetch_url(url: str) -> str:
    url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
    ext = ".yaml" if url.endswith(".yaml") or url.endswith(".yml") else ".json"
    cached = os.path.join(tempfile.gettempdir(), f"playswag_{url_hash}{ext}")

    try:
        stat = os.stat(cached)
        if (time.time() - stat.st_mtime) < 300:
            print(f"   Using cached spec: {cached}")
            return cached
    except OSError:
        pass

    print(f"   Fetching spec from {url}...")

    # Try curl / wget first
    for cmd, args in [
        ("curl", ["-sL", "--max-time", "30", "-o", cached, url]),
        ("wget", ["-qO", cached, "--timeout=30", url]),
    ]:
        try:
            subprocess.run([cmd, *args], check=True, capture_output=True)
            return cached
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass

    # Fallback: urllib (zero-dep)
    req = urllib.request.Request(url, headers={"User-Agent": "playswag/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    Path(cached).write_bytes(data)
    return cached


# ─── YAML / JSON loader ───────────────────────────────────────────────────────

def load_spec(spec_file: str) -> dict:
    file_path = fetch_url(spec_file) if is_url(spec_file) else spec_file
    content = Path(file_path).read_text(encoding="utf-8").strip()

    if content.startswith("{") or content.startswith("["):
        return json.loads(content)

    # Try PyYAML
    try:
        import yaml
        return yaml.safe_load(content)
    except ImportError:
        pass

    # Try ruamel.yaml
    try:
        from ruamel.yaml import YAML
        from io import StringIO
        y = YAML(typ="safe")
        return y.load(StringIO(content))
    except ImportError:
        pass

    # Fallback: Node.js js-yaml — path via env (no injection)
    try:
        fd, tmp_path = tempfile.mkstemp(suffix=".yaml", prefix="playswag_")
        os.write(fd, content.encode("utf-8"))
        os.close(fd)
        env = os.environ.copy()
        env["PLAYSWAG_YAML_FILE"] = tmp_path
        result = subprocess.run(
            [
                "node", "-e",
                "const fs=require('fs'),y=require('js-yaml');const p=process.env.PLAYSWAG_YAML_FILE;"
                "process.stdout.write(JSON.stringify(y.load(fs.readFileSync(p,'utf8'))));",
            ],
            capture_output=True, text=True, check=True, env=env,
        )
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
        return json.loads(result.stdout)
    except Exception:
        pass

    raise RuntimeError(
        "Cannot parse YAML. Install pyyaml:  pip3 install pyyaml\n"
        "Or convert your spec to JSON."
    )


# ─── $ref resolver — keep in sync with analyze.js / analyze.ts ───────────────

def _pointer_parts(ref_hash: str) -> list[str]:
    return [p.replace("~1", "/").replace("~0", "~") for p in ref_hash[2:].split("/")]


def _get_at_pointer(root: dict, parts: list[str]):
    cur: object = root
    for key in parts:
        if not isinstance(cur, dict):
            return None
        cur = cur.get(key)
    return cur


def resolve_refs(spec: dict, max_depth: int = 10) -> dict:
    root = spec
    resolving: set[str] = set()

    def resolve(obj: object, depth: int) -> object:
        if depth > max_depth:
            return obj
        if obj is None or not isinstance(obj, dict):
            return obj
        if isinstance(obj, list):
            return [resolve(x, depth + 1) for x in obj]

        ref = obj.get("$ref")
        if isinstance(ref, str) and ref.startswith("#/"):
            if ref in resolving:
                return {"__playswag_circularRef": ref}
            resolving.add(ref)
            parts = _pointer_parts(ref)
            target = _get_at_pointer(root, parts)
            if target is None or not isinstance(target, (dict, list)):
                resolving.discard(ref)
                return {k: (v if k == "$ref" else resolve(v, depth + 1)) for k, v in obj.items()}
            target = resolve(copy.deepcopy(target), depth + 1)
            if isinstance(target, list):
                merged: object = list(target)
            else:
                merged = dict(target) if isinstance(target, dict) else target
            if isinstance(merged, dict):
                for k, v in obj.items():
                    if k != "$ref":
                        merged[k] = resolve(v, depth + 1)
            resolving.discard(ref)
            return merged

        return {k: resolve(v, depth + 1) for k, v in obj.items()}

    out = resolve(spec, 0)
    return out if isinstance(out, dict) else spec


# ─── Base path helpers ────────────────────────────────────────────────────────

def _normalize_base_path(p: Optional[str]) -> str:
    if p is None or p == "":
        return ""
    s = str(p).strip()
    if not s or s == "/":
        return ""
    if not s.startswith("/"):
        s = "/" + s
    return s.rstrip("/") or ""


def _join_base_and_path(base: str, tpl: str) -> str:
    b = _normalize_base_path(base)
    t = tpl if tpl.startswith("/") else "/" + (tpl or "")
    if not b:
        return t
    s = b + t
    while "//" in s:
        s = s.replace("//", "/")
    return s or "/"


def _extract_path_from_server_url(url: str) -> str:
    if not url or not isinstance(url, str):
        return ""
    u = url.strip()
    try:
        from urllib.parse import urlparse
        if u.startswith("http://") or u.startswith("https://"):
            return urlparse(u).path or "/"
    except Exception:
        pass
    return u.split("?")[0].split("#")[0]


def extract_base_paths(spec: dict) -> list[str]:
    out: list[str] = []
    if spec.get("swagger") and spec.get("basePath") is not None:
        b = _normalize_base_path(str(spec["basePath"]))
        if b:
            out.append(b)
    if spec.get("openapi") and isinstance(spec.get("servers"), list):
        for s in spec["servers"]:
            if not isinstance(s, dict) or not s.get("url"):
                continue
            p = _extract_path_from_server_url(str(s["url"]))
            b = _normalize_base_path(p)
            if b:
                out.append(b)
    return list(dict.fromkeys(out))


# ─── Body fields extraction ───────────────────────────────────────────────────

def extract_body_fields(schema: dict, prefix: str = "", depth: int = 3) -> list[str]:
    if not schema or depth == 0:
        return []
    fields: list[str] = []
    props = dict(schema.get("properties", {}))

    for key in ("allOf", "anyOf", "oneOf"):
        for sub in schema.get(key, []):
            props.update(sub.get("properties", {}))

    for name, val in props.items():
        full_key = f"{prefix}.{name}" if prefix else name
        fields.append(full_key)
        if isinstance(val, dict):
            fields.extend(extract_body_fields(val, full_key, depth - 1))

    return fields


# ─── OpenAPI parser ───────────────────────────────────────────────────────────

def parse_spec(spec: dict) -> list[OAEndpoint]:
    endpoints: list[OAEndpoint] = []
    is_oas3 = "openapi" in spec
    paths = spec.get("paths", {})
    global_security = spec.get("security", [])

    for path_template, path_item in paths.items():
        if not isinstance(path_item, dict):
            continue

        for method in ("get", "post", "put", "patch", "delete", "head", "options"):
            op = path_item.get(method)
            if not op or not isinstance(op, dict):
                continue

            path_params = {
                f"{p['in']}:{p['name']}": OAParameter(
                    name=p["name"], location=p["in"],
                    required=bool(p.get("required", False)),
                    description=p.get("description", "")
                )
                for p in path_item.get("parameters", []) if isinstance(p, dict) and "name" in p
            }
            op_params = {
                f"{p['in']}:{p['name']}": OAParameter(
                    name=p["name"], location=p["in"],
                    required=bool(p.get("required", False)),
                    description=p.get("description", "")
                )
                for p in op.get("parameters", []) if isinstance(p, dict) and "name" in p
            }
            path_params.update(op_params)
            parameters = list(path_params.values())

            body_fields: list[str] = []
            if is_oas3 and "requestBody" in op:
                content = op["requestBody"].get("content", {})
                json_content = (
                    content.get("application/json")
                    or content.get("application/x-www-form-urlencoded")
                    or (next(iter(content.values()), {}) if content else {})
                )
                schema = json_content.get("schema", {}) if isinstance(json_content, dict) else {}
                body_fields = extract_body_fields(schema)
            elif not is_oas3:
                for p in op.get("parameters", []):
                    if isinstance(p, dict) and p.get("in") == "body" and "schema" in p:
                        body_fields = extract_body_fields(p["schema"])
                        break

            status_codes = [str(k) for k in op.get("responses", {}).keys()]

            op_security = op.get("security", global_security)
            auth_required = isinstance(op_security, list) and len(op_security) > 0

            endpoints.append(OAEndpoint(
                method=method.upper(),
                path=path_template,
                operation_id=op.get("operationId", ""),
                summary=op.get("summary", ""),
                description=op.get("description", ""),
                tags=op.get("tags", []),
                deprecated=bool(op.get("deprecated", False)),
                parameters=parameters,
                request_body_fields=body_fields,
                status_codes=status_codes,
                auth_required=auth_required,
            ))

    return endpoints


# ─── Endpoint filter (TASK-008) ───────────────────────────────────────────────

def wildcard_match(pattern: str, value: str) -> bool:
    return fnmatch.fnmatch(value.lower(), pattern.lower())


def filter_endpoints(endpoints: list[OAEndpoint], opts: dict) -> tuple[list[OAEndpoint], list[OAEndpoint]]:
    filtered = list(endpoints)
    ignored: list[OAEndpoint] = []

    include = opts.get("include")
    if include:
        nxt: list[OAEndpoint] = []
        for ep in filtered:
            if any(wildcard_match(pat, ep.path) for pat in include):
                nxt.append(ep)
            else:
                ignored.append(ep)
        filtered = nxt

    exclude = opts.get("exclude")
    if exclude:
        nxt = []
        for ep in filtered:
            if any(wildcard_match(pat, ep.path) for pat in exclude):
                ignored.append(ep)
            else:
                nxt.append(ep)
        filtered = nxt

    include_tags = opts.get("include_tags")
    if include_tags:
        nxt = []
        for ep in filtered:
            ep_tags = [t.lower() for t in ep.tags]
            if any(t in ep_tags for t in include_tags):
                nxt.append(ep)
            else:
                ignored.append(ep)
        filtered = nxt

    exclude_tags = opts.get("exclude_tags")
    if exclude_tags:
        nxt = []
        for ep in filtered:
            ep_tags = [t.lower() for t in ep.tags]
            if any(t in ep_tags for t in exclude_tags):
                ignored.append(ep)
            else:
                nxt.append(ep)
        filtered = nxt

    return filtered, ignored


# ─── Test file scanner ────────────────────────────────────────────────────────

# Canonical HTTP hit patterns — keep analyze.js / analyze.ts / analyze.py in sync.
HIT_PATTERNS: list[tuple[re.Pattern, int, int]] = [
    (re.compile(r'\b(?:request|req|api|client|http)\.(get|post|put|patch|delete|head)\s*\(\s*[\'"`](.*?)[\'"`]', re.IGNORECASE), 1, 2),
    (re.compile(r'\baxios\.(get|post|put|patch|delete|head)\s*\(\s*[\'"`](.*?)[\'"`]', re.IGNORECASE), 1, 2),
    (re.compile(r'\)\.(get|post|put|patch|delete|head)\s*\(\s*[\'"`](\/[^\'"`]*)[\'"`]', re.IGNORECASE), 1, 2),
    (re.compile(r'\bfetch\s*\(\s*[\'"`](.*?)[\'"`]\s*,\s*\{[^}]*method\s*[:=]\s*[\'"`](GET|POST|PUT|PATCH|DELETE|HEAD)[\'"`]', re.IGNORECASE | re.DOTALL), 2, 1),
    (re.compile(r'\bfetch\s*\(\s*[\'"`]((?:https?://[^\'"` ]+|/[^\'"` ]+))[\'"`]\s*(?:\)|\s*,\s*\{[^}]*\})', re.IGNORECASE), 0, 1),
    (re.compile(r'cy\.request\s*\(\s*\{[^}]*method\s*:\s*[\'"`](GET|POST|PUT|PATCH|DELETE|HEAD)[\'"`][^}]*url\s*:\s*[\'"`](.*?)[\'"`]', re.IGNORECASE | re.DOTALL), 1, 2),
    (re.compile(r'\b(?:got|ky)\.(get|post|put|patch|delete|head)\s*\(\s*[\'"`](.*?)[\'"`]', re.IGNORECASE), 1, 2),
    (re.compile(r'\bhttps?\.get\s*\(\s*[\'"`](https?://[^\'"`]+)[\'"`]', re.IGNORECASE), 0, 1),
    (re.compile(r'test\.describe\s*\(\s*[\'"`](GET|POST|PUT|PATCH|DELETE|HEAD)\s+(\/[^\'"`\n]+)[\'"`]', re.IGNORECASE), 1, 2),
    (re.compile(r'\bself\.client\.(get|post|put|patch|delete|head)\s*\(\s*[\'"`](.*?)[\'"`]', re.IGNORECASE), 1, 2),
    (re.compile(r'\bawait\s+\w+\.(get|post|put|patch|delete|head)\s*\(\s*[\'"`](.*?)[\'"`]', re.IGNORECASE), 1, 2),
    # TASK-010: Additional patterns
    (re.compile(r'\brequest\s*\(\s*\w+\s*\)\s*\.\s*(get|post|put|patch|delete|head)\s*\(\s*[\'"`](.*?)[\'"`]', re.IGNORECASE), 1, 2),
    (re.compile(r'\bgiven\s*\(\s*\)[\s\S]*?\.(?:when|request)\s*\(\s*\)[\s\S]*?\.(get|post|put|patch|delete|head)\s*\(\s*[\'"`](.*?)[\'"`]', re.IGNORECASE), 1, 2),
    (re.compile(r'\b(?:session|aiohttp_client)\.(get|post|put|patch|delete|head)\s*\(\s*[\'"`](.*?)[\'"`]', re.IGNORECASE), 1, 2),
    (re.compile(r'\b(?:requests|httpx)\.(get|post|put|patch|delete|head)\s*\(\s*[\'"`](.*?)[\'"`]', re.IGNORECASE), 1, 2),
    (re.compile(r'\.request\s*\(\s*[\'"`](GET|POST|PUT|PATCH|DELETE|HEAD)[\'"`]\s*,\s*[\'"`](.*?)[\'"`]', re.IGNORECASE), 1, 2),
]

TEST_EXTENSIONS = {
    ".spec.ts", ".test.ts", ".spec.js", ".test.js", ".spec.tsx", ".test.tsx",
    ".spec.jsx", ".test.jsx", ".e2e.ts", ".e2e.js",
}

PYTHON_TEST_PATTERNS = re.compile(r'^(test_.*|.*_test)\.(py)$')


def is_test_file(p: Path) -> bool:
    name = p.name.lower()
    return (
        any(name.endswith(ext) for ext in TEST_EXTENSIONS)
        or PYTHON_TEST_PATTERNS.match(name) is not None
        or (name.startswith("test_") and name.endswith(".py"))
    )


def find_test_files(tests_dir: str) -> list[str]:
    results: list[str] = []
    root = Path(tests_dir)
    if not root.exists():
        return results

    skip_parts = {
        ".git", "node_modules", "dist", "__pycache__", ".venv", ".pytest_cache",
        ".mypy_cache", ".idea", ".vscode", ".svn",
    }
    for p in root.rglob("*"):
        if p.is_file() and is_test_file(p):
            if any(part in skip_parts for part in p.parts):
                continue
            results.append(str(p))

    return results


def extract_path(url: str) -> str:
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        if parsed.scheme:
            return parsed.path
    except Exception:
        pass
    return url.split("?")[0].split("#")[0]


def scan_test_file(file_path: str) -> list[TestHit]:
    hits: list[TestHit] = []
    try:
        content = Path(file_path).read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return hits

    lines = content.split("\n")
    seen: set[str] = set()

    offsets = [0]
    for line in lines:
        offsets.append(offsets[-1] + len(line) + 1)

    def char_to_line(pos: int) -> int:
        lo, hi = 0, len(offsets) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if offsets[mid] <= pos < offsets[mid + 1]:
                return mid + 1
            elif pos < offsets[mid]:
                hi = mid
            else:
                lo = mid + 1
        return lo + 1

    for regex, method_grp, url_grp in HIT_PATTERNS:
        for m in regex.finditer(content):
            raw_url = m.group(url_grp)
            raw_method = m.group(method_grp) if method_grp != 0 else "GET"
            if not raw_url:
                continue

            # TASK-009: partial match for template literals
            is_partial = False
            if "${" in raw_url or "#{" in raw_url:
                idx_dollar = raw_url.index("${") if "${" in raw_url else float("inf")
                idx_hash = raw_url.index("#{") if "#{" in raw_url else float("inf")
                idx = int(min(idx_dollar, idx_hash))
                static_part = raw_url[:idx]
                if "/" in static_part and len(static_part) > 1:
                    raw_url = static_part
                    is_partial = True
                else:
                    continue

            line_num = char_to_line(m.start())
            path_ = extract_path(raw_url)
            key = f"{raw_method.upper()}:{path_}:{file_path}:{line_num}"
            if key in seen:
                continue
            seen.add(key)

            hits.append(TestHit(
                method=raw_method.upper(),
                matched_path=path_,
                raw_url=raw_url,
                file=file_path,
                line=line_num,
                partial=is_partial,
            ))

    return hits


# ─── Status code assertion scanner (TASK-014) ────────────────────────────────

STATUS_ASSERTION_PATTERNS: list[re.Pattern] = [
    re.compile(r'\.expect\s*\(\s*(\d{3})\s*\)'),
    re.compile(r'\.toHaveStatus\s*\(\s*(\d{3})\s*\)'),
    re.compile(r'\.status\s*(?:===?|!==?|==)\s*(\d{3})'),
    re.compile(r'status[_\s]*(?:code)?\s*(?:===?|==|is|equals?)\s*(\d{3})', re.IGNORECASE),
    re.compile(r'assert.*?(?:status|code).*?(\d{3})', re.IGNORECASE),
    re.compile(r'\.status_code\s*==\s*(\d{3})'),
    re.compile(r'expect\s*\(.*?status.*?\).*?(?:toBe|toEqual|to\.equal)\s*\(\s*(\d{3})\s*\)', re.IGNORECASE),
    re.compile(r'\.should\.have\.status\s*\(\s*(\d{3})\s*\)'),
]


def scan_status_code_assertions(file_path: str) -> list[dict]:
    try:
        content = Path(file_path).read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return []

    results: list[dict] = []
    seen: set[str] = set()
    for pattern in STATUS_ASSERTION_PATTERNS:
        for m in pattern.finditer(content):
            code = m.group(1)
            line_num = content[:m.start()].count("\n") + 1
            key = f"{code}:{file_path}:{line_num}"
            if key not in seen:
                seen.add(key)
                results.append({"code": code, "file": file_path, "line": line_num})
    return results


# ─── Parameter coverage scanner (TASK-015) ───────────────────────────────────

def scan_parameter_usage(file_path: str, param_names: list[str]) -> set[str]:
    if not param_names:
        return set()
    try:
        content = Path(file_path).read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return set()

    found: set[str] = set()
    lower = content.lower()
    for name in param_names:
        if name.lower() in lower:
            found.add(name)
    return found


# ─── Path matcher ─────────────────────────────────────────────────────────────

def path_matches_template(hit_path: str, template: str) -> bool:
    norm_hit = hit_path.rstrip("/").lower()
    norm_tpl = template.rstrip("/").lower()

    if norm_hit == norm_tpl:
        return True

    segments = norm_tpl.split("/")
    regex_parts = []
    for seg in segments:
        if seg.startswith("{") and seg.endswith("}"):
            regex_parts.append("[^/]+")
        else:
            regex_parts.append(re.escape(seg))

    pattern = "^" + "/".join(regex_parts) + "$"
    try:
        return bool(re.match(pattern, norm_hit))
    except re.error:
        return False


def path_prefix_matches_template(hit_prefix: str, template: str) -> bool:
    """TASK-009: prefix match for partial (template literal) hits."""
    norm_hit = hit_prefix.rstrip("/").lower()
    norm_tpl = template.rstrip("/").lower()
    if norm_tpl.startswith(norm_hit):
        return True

    hit_segs = norm_hit.split("/")
    tpl_segs = norm_tpl.split("/")
    if len(hit_segs) > len(tpl_segs):
        return False

    for i in range(len(hit_segs)):
        ts = tpl_segs[i]
        hs = hit_segs[i]
        if ts.startswith("{") and ts.endswith("}"):
            continue
        if ts != hs:
            return False
    return True


def hit_matches_endpoint_path(hit_path: str, template_path: str, base_paths: list[str]) -> bool:
    if path_matches_template(hit_path, template_path):
        return True
    bases = base_paths or []
    hl = hit_path.rstrip("/").lower()
    for base in bases:
        nb = _normalize_base_path(base).lower()
        if not nb:
            continue
        if hl == nb or hl.startswith(nb + "/"):
            stripped = "/" if hl == nb else hl[len(nb):] or "/"
            if not stripped.startswith("/"):
                stripped = "/" + stripped
            if path_matches_template(stripped, template_path):
                return True
    for base in bases:
        combined = _join_base_and_path(base, template_path)
        if path_matches_template(hit_path, combined):
            return True
    return False


def match_hit_to_endpoint(
    hit: TestHit, endpoints: list[OAEndpoint], base_paths: list[str] | None = None
) -> Optional[OAEndpoint]:
    best: Optional[OAEndpoint] = None
    best_score = -1
    bp = base_paths or []

    for ep in endpoints:
        if ep.method != hit.method:
            continue

        matched = False
        if hit.partial:
            matched = path_prefix_matches_template(hit.matched_path, ep.path)
            if not matched:
                for base in bp:
                    combined = _join_base_and_path(base, ep.path)
                    if path_prefix_matches_template(hit.matched_path, combined):
                        matched = True
                        break
        else:
            matched = hit_matches_endpoint_path(hit.matched_path, ep.path, bp)

        if not matched:
            continue
        score = sum(1 for seg in ep.path.split("/") if not seg.startswith("{"))
        if score > best_score:
            best_score = score
            best = ep

    return best


# ─── Coverage calculation ─────────────────────────────────────────────────────

def calculate_coverage(
    endpoints: list[OAEndpoint],
    all_hits: list[TestHit],
    base_paths: list[str] | None = None,
    test_files: list[str] | None = None,
) -> dict:
    covered_keys: set[str] = set()
    endpoint_hits: dict[str, list[TestHit]] = {}
    orphan_hits: list[TestHit] = []

    bp = base_paths or []
    for hit in all_hits:
        ep = match_hit_to_endpoint(hit, endpoints, bp)
        if ep:
            key = f"{ep.method}:{ep.path}"
            covered_keys.add(key)
            endpoint_hits.setdefault(key, []).append(hit)
        else:
            orphan_hits.append(hit)

    covered = [ep for ep in endpoints if f"{ep.method}:{ep.path}" in covered_keys]
    uncovered = [ep for ep in endpoints if f"{ep.method}:{ep.path}" not in covered_keys]
    deprecated = [ep for ep in endpoints if ep.deprecated]

    deprecated_in_tests = [
        {"endpoint": ep, "hits": endpoint_hits.get(f"{ep.method}:{ep.path}", [])}
        for ep in deprecated
        if f"{ep.method}:{ep.path}" in covered_keys
    ]

    total = len(endpoints)
    endpoint_coverage = round(len(covered) / total * 100, 1) if total else 0.0

    # TASK-014: Real status code coverage
    all_status_assertions: list[dict] = []
    for f in (test_files or []):
        all_status_assertions.extend(scan_status_code_assertions(f))
    asserted_codes = {a["code"] for a in all_status_assertions}

    total_sc = 0
    covered_sc = 0
    per_endpoint_sc: dict[str, dict] = {}
    for ep in endpoints:
        key = f"{ep.method}:{ep.path}"
        spec_codes = [c for c in ep.status_codes if re.fullmatch(r'\d{3}', c)]
        total_sc += len(spec_codes)
        tested_codes = [c for c in spec_codes if c in asserted_codes]
        if key in covered_keys:
            covered_sc += len(tested_codes) or min(len(spec_codes), 1)
        per_endpoint_sc[key] = {"spec": spec_codes, "tested": tested_codes}
    status_code_coverage = round(covered_sc / total_sc * 100, 1) if total_sc else 0.0

    # TASK-015: Parameter coverage
    total_params = 0
    covered_params = 0
    per_endpoint_params: dict[str, dict] = {}
    for ep in covered:
        key = f"{ep.method}:{ep.path}"
        param_names = [p.name for p in ep.parameters]
        total_params += len(param_names)
        hits_for_ep = endpoint_hits.get(key, [])
        test_files_for_ep = list({h.file for h in hits_for_ep})
        used_params: set[str] = set()
        for tf in test_files_for_ep:
            used_params |= scan_parameter_usage(tf, param_names)
        covered_params += len(used_params)
        per_endpoint_params[key] = {"total": param_names, "used": list(used_params)}
    parameter_coverage = round(covered_params / total_params * 100, 1) if total_params else 0.0

    # TASK-016: Coverage by tag
    tag_map: dict[str, dict[str, int]] = {}
    for ep in endpoints:
        tags = ep.tags if ep.tags else ["Untagged"]
        for t in tags:
            if t not in tag_map:
                tag_map[t] = {"total": 0, "covered": 0}
            tag_map[t]["total"] += 1
            if f"{ep.method}:{ep.path}" in covered_keys:
                tag_map[t]["covered"] += 1

    coverage_by_tag: dict[str, dict] = {}
    for tag, data in tag_map.items():
        pct = round(data["covered"] / data["total"] * 100, 1) if data["total"] else 0.0
        coverage_by_tag[tag] = {"total": data["total"], "covered": data["covered"], "pct": pct}

    return {
        "covered": covered,
        "uncovered": uncovered,
        "deprecated": deprecated,
        "deprecated_in_tests": deprecated_in_tests,
        "orphan_hits": orphan_hits,
        "endpoint_coverage": endpoint_coverage,
        "status_code_coverage": status_code_coverage,
        "parameter_coverage": parameter_coverage,
        "per_endpoint_sc": per_endpoint_sc,
        "per_endpoint_params": per_endpoint_params,
        "coverage_by_tag": coverage_by_tag,
    }


# ─── Helpers ──────────────────────────────────────────────────────────────────

METHOD_COLORS: dict[str, str] = {
    "GET": "#61affe", "POST": "#49cc90", "PUT": "#fca130",
    "PATCH": "#50e3c2", "DELETE": "#f93e3e",
    "HEAD": "#9012fe", "OPTIONS": "#0d5aa7",
}


def method_color(m: str) -> str:
    return METHOD_COLORS.get(m, "#999")


def coverage_color(pct: float) -> str:
    if pct >= 80:
        return "#49cc90"
    if pct >= 50:
        return "#fca130"
    return "#f93e3e"


def priority_for(ep: OAEndpoint) -> str:
    if ep.deprecated:
        return "Low"
    if ep.method in ("POST", "PUT", "DELETE", "PATCH") or ep.auth_required:
        return "High"
    return "Medium"


def priority_color(p: str) -> str:
    return {"High": "#f93e3e", "Medium": "#fca130", "Low": "#aaa"}.get(p, "#aaa")


def rel(path_: str | list[str]) -> str:
    if isinstance(path_, list):
        return ", ".join(_rel_single(p) for p in path_)
    return _rel_single(path_)


def _rel_single(path_: str) -> str:
    try:
        return os.path.relpath(path_)
    except ValueError:
        return path_


# ─── HTML report ──────────────────────────────────────────────────────────────

def generate_html(report: CoverageReport) -> str:
    total = len(report.endpoints)
    cov_count = len(report.covered)
    uncov_count = len(report.uncovered)
    dep_count = len(report.deprecated)
    dep_in_tests = len(report.deprecated_in_tests)
    pct = report.endpoint_coverage
    all_tags = sorted({t for ep in report.endpoints for t in (ep.tags if ep.tags else [])})

    # TASK-016: Tag coverage bars
    tag_bars = ""
    if report.coverage_by_tag:
        sorted_tags = sorted(report.coverage_by_tag.items(), key=lambda x: x[1]["pct"])
        tag_bar_rows = []
        for tag, data in sorted_tags:
            tag_bar_rows.append(
                f'<div class="tag-bar-row">'
                f'<span class="tag-bar-label">{_esc(tag)}</span>'
                f'<div class="tag-bar-track"><div class="tag-bar-fill" style="width:{data["pct"]}%;background:{coverage_color(data["pct"])}"></div></div>'
                f'<span class="tag-bar-pct" style="color:{coverage_color(data["pct"])}">{data["pct"]}% ({data["covered"]}/{data["total"]})</span>'
                f'</div>'
            )
        tag_bars = "\n".join(tag_bar_rows)

    ep_rows: list[str] = []
    for ep in report.endpoints:
        is_cov = ep in report.covered
        is_dep = ep.deprecated
        pri = priority_for(ep)
        tags = ", ".join(ep.tags) if ep.tags else "\u2014"
        sc_badges = " ".join(
            f'<span class="badge sc sc-{sc[0]}xx">{sc}</span>'
            for sc in ep.status_codes
        )
        dep_html = ' <span class="dep-tag">deprecated</span>' if is_dep else ""
        status_html = (
            '<span class="covered-badge">\u2713 Covered</span>'
            if is_cov
            else f'<span class="uncovered-badge" style="color:{priority_color(pri)}">\u2717 {pri}</span>'
        )
        ep_rows.append(
            f'<tr class="ep-row {"covered" if is_cov else "uncovered"} {"deprecated" if is_dep else ""}"'
            f' data-covered="{str(is_cov).lower()}" data-deprecated="{str(is_dep).lower()}"'
            f' data-tags="{",".join(ep.tags).lower()}">'
            f'<td><span class="method-badge" style="background:{method_color(ep.method)}">{ep.method}</span></td>'
            f'<td class="path-cell"><code>{ep.path}</code>{dep_html}</td>'
            f'<td>{ep.summary or ep.operation_id or "\u2014"}</td>'
            f'<td>{tags}</td>'
            f'<td>{sc_badges}</td>'
            f'<td>{status_html}</td>'
            f'</tr>'
        )

    task_cards: list[str] = []
    for i, ep in enumerate(report.uncovered):
        pri = priority_for(ep)
        success_code = next((sc for sc in ep.status_codes if sc.startswith("2")), "200")
        has_path_param = "{" in ep.path
        req_params = ", ".join(f'<code>{p.name}</code> ({p.location})' for p in ep.parameters if p.required) or "none"
        body_fields_html = ", ".join(f'<code>{f}</code>' for f in ep.request_body_fields[:8]) or "none"
        meta_parts = []
        if ep.operation_id:
            meta_parts.append(f'<span class="meta-item"><b>operationId:</b> {ep.operation_id}</span>')
        if ep.tags:
            meta_parts.append(f'<span class="meta-item"><b>tags:</b> {", ".join(ep.tags)}</span>')
        if ep.auth_required:
            meta_parts.append('<span class="meta-item auth-required">\U0001f510 Auth required</span>')

        criteria = [f'<li>\u2705 Happy path \u2014 successful <code>{success_code}</code> response</li>']
        if ep.method in ("POST", "PUT", "PATCH"):
            criteria.append("<li>\u2b1c Invalid input \u2192 400/422 validation error</li>")
        if ep.auth_required:
            criteria.extend([
                "<li>\u2b1c Unauthenticated request \u2192 401</li>",
                "<li>\u2b1c Insufficient permissions \u2192 403</li>",
            ])
        if has_path_param:
            criteria.append("<li>\u2b1c Non-existent resource \u2192 404</li>")
        if ep.method == "DELETE":
            criteria.append("<li>\u2b1c Idempotency \u2014 double DELETE \u2192 404 or 204</li>")
        if any(p.required for p in ep.parameters):
            criteria.append("<li>\u2b1c Missing required parameter \u2192 400</li>")

        body_row = f'<tr><td>Body fields:</td><td>{body_fields_html}</td></tr>' if ep.request_body_fields else ""
        task_cards.append(
            f'<div class="task-card priority-{pri.lower()}">'
            f'<div class="task-header">'
            f'<span class="task-num">TASK-{str(i+1).zfill(3)}</span>'
            f'<span class="method-badge" style="background:{method_color(ep.method)}">{ep.method}</span>'
            f'<code class="task-path">{ep.path}</code>'
            f'<span class="priority-badge" style="color:{priority_color(pri)}">{pri}</span>'
            f'</div>'
            f'<p class="task-summary">{ep.summary or ep.description or "No description in spec."}</p>'
            f'<div class="task-meta">{"".join(meta_parts)}</div>'
            f'<div class="task-criteria"><b>Acceptance Criteria:</b><ul>{"".join(criteria)}</ul></div>'
            f'<div class="task-hints"><b>Test Hints:</b><table>'
            f'<tr><td>Required params:</td><td>{req_params}</td></tr>'
            f'{body_row}'
            f'<tr><td>Status codes:</td><td>{", ".join(ep.status_codes) or "not defined in spec"}</td></tr>'
            f'</table></div></div>'
        )

    cleanup_cards: list[str] = []
    for i, item in enumerate(report.deprecated_in_tests):
        ep = item["endpoint"]
        hits_: list[TestHit] = item["hits"]
        files_str = ", ".join({f"<code>{_rel_single(h.file)}</code>" for h in hits_})
        cleanup_cards.append(
            f'<div class="task-card priority-low cleanup">'
            f'<div class="task-header">'
            f'<span class="task-num">CLEANUP-{str(i+1).zfill(3)}</span>'
            f'<span class="method-badge" style="background:{method_color(ep.method)}">{ep.method}</span>'
            f'<code class="task-path">{ep.path}</code>'
            f'<span class="dep-tag">deprecated</span>'
            f'</div>'
            f'<p class="task-summary">Remove or update tests for deprecated endpoint. Found in: {files_str}</p>'
            f'</div>'
        )

    orphan_section = ""
    if report.orphan_hits:
        orphan_rows = "".join(
            f'<tr>'
            f'<td><span class="method-badge" style="background:{method_color(h.method)}">{h.method}</span></td>'
            f'<td><code>{h.matched_path}</code>'
            f'{" " if h.partial else ""}'
            f'{"<span class=\"badge\" style=\"background:#4a3a1a;color:#fca130\">partial</span>" if h.partial else ""}'
            f'</td>'
            f'<td><code>{_rel_single(h.file)}</code></td>'
            f'<td>{h.line}</td>'
            f'</tr>'
            for h in report.orphan_hits
        )
        orphan_section = (
            f'<div class="section">'
            f'<h2>Unmatched Hits <span class="count-badge">{len(report.orphan_hits)}</span></h2>'
            f'<p class="section-desc">API calls in tests that don\'t match any spec endpoint.</p>'
            f'<table class="data-table">'
            f'<thead><tr><th>Method</th><th>Path</th><th>File</th><th>Line</th></tr></thead>'
            f'<tbody>{orphan_rows}</tbody>'
            f'</table></div>'
        )

    filter_btns = (
        f'<button class="filter-btn active" data-filter="all" onclick="setFilter(\'all\',this)">All ({total})</button>'
        f'<button class="filter-btn" data-filter="covered" onclick="setFilter(\'covered\',this)">\u2713 Covered ({cov_count})</button>'
        f'<button class="filter-btn" data-filter="uncovered" onclick="setFilter(\'uncovered\',this)">\u2717 Uncovered ({uncov_count})</button>'
        f'<button class="filter-btn" data-filter="deprecated" onclick="setFilter(\'deprecated\',this)">Deprecated ({dep_count})</button>'
        + "".join(
            f'<button class="filter-btn" data-filter="tag:{t.lower()}" onclick="setFilter(\'tag:{t.lower()}\',this)">{t}</button>'
            for t in all_tags
        )
    )

    spec_rel = rel(report.spec_file)
    tests_rel = _rel_single(report.tests_dir)

    # TASK-018: Summary data for copy/export
    summary_text = (
        f"Endpoint Coverage: {pct}% ({cov_count}/{total})\\n"
        f"Uncovered: {uncov_count}\\n"
        f"Deprecated: {dep_count} ({dep_in_tests} still tested)\\n"
        f"Unmatched: {len(report.orphan_hits)}"
    )

    csv_rows = []
    for ep in report.endpoints:
        is_cov = ep in report.covered
        csv_rows.append(
            f'{ep.method},{ep.path},"{";".join(ep.tags)}",{";".join(ep.status_codes)},'
            f'{"Covered" if is_cov else "Uncovered"},{"Yes" if ep.deprecated else "No"}'
        )
    csv_content = "Method,Path,Tags,StatusCodes,Coverage,Deprecated\\n" + "\\n".join(csv_rows)

    tasks_section = (
        f'<div class="section">'
        f'<h2>\U0001f4cb QA Tasks \u2014 Endpoints to Cover <span class="count-badge">{uncov_count}</span></h2>'
        f'<p class="section-desc">'
        f'Priority: <span style="color:#f93e3e">\u25a0 High</span> (POST/PUT/DELETE/auth) &nbsp;'
        f'<span style="color:#fca130">\u25a0 Medium</span> (GET) &nbsp; <span style="color:#aaa">\u25a0 Low</span> (deprecated).'
        f'</p>'
        f'<div class="tasks-grid">{"".join(task_cards)}</div>'
        f'</div>'
    ) if report.uncovered else '<div class="section" style="padding:20px"><h2>\u2705 All endpoints covered!</h2></div>'

    cleanup_section = (
        f'<div class="section">'
        f'<h2>\U0001f9f9 Cleanup Tasks <span class="count-badge">{dep_in_tests}</span></h2>'
        f'<div class="tasks-grid">{"".join(cleanup_cards)}</div>'
        f'</div>'
    ) if report.deprecated_in_tests else ""

    tag_section = ""
    if tag_bars:
        tag_section = (
            f'<div class="section">'
            f'<h2>Coverage by Tag</h2>'
            f'<div style="padding:12px 0">{tag_bars}</div>'
            f'</div>'
        )

    ts_display = datetime.fromisoformat(report.timestamp).strftime("%Y-%m-%d %H:%M:%S")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>PlaySwag \u2014 API Coverage Report</title>
  <style>
    :root{{--bg:#1a1a2e;--surface:#16213e;--surface2:#0f3460;--text:#e0e0e0;--text-muted:#8888aa;--accent:#61affe;--border:#2a2a4a;--covered:#49cc90;--uncovered:#f93e3e;--warning:#fca130}}
    [data-theme=light]{{--bg:#f8f9fa;--surface:#fff;--surface2:#e9ecef;--text:#212529;--text-muted:#6c757d;--border:#dee2e6}}
    *{{box-sizing:border-box;margin:0;padding:0}}
    body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.5}}
    header{{background:var(--surface2);padding:20px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;border-bottom:2px solid var(--accent)}}
    header h1{{font-size:1.6rem;color:var(--accent)}}
    .meta{{color:var(--text-muted);font-size:.85rem}}
    .theme-btn,.action-btn{{background:var(--surface);border:1px solid var(--border);color:var(--text);padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem}}
    .action-btn:hover{{background:var(--accent);color:#fff}}
    .header-actions{{display:flex;gap:8px;flex-wrap:wrap}}
    main{{max-width:1400px;margin:0 auto;padding:24px 20px}}
    .summary-cards{{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:32px}}
    .card{{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px}}
    .card h3{{font-size:.8rem;text-transform:uppercase;color:var(--text-muted);letter-spacing:.5px;margin-bottom:8px}}
    .card .val{{font-size:2rem;font-weight:700}}
    .card .sub{{font-size:.8rem;color:var(--text-muted);margin-top:4px}}
    .progress-bar{{height:8px;border-radius:4px;background:var(--surface2);overflow:hidden;margin-top:8px}}
    .progress-fill{{height:100%;border-radius:4px}}
    .section{{background:var(--surface);border:1px solid var(--border);border-radius:10px;margin-bottom:24px;overflow:hidden}}
    .section>h2{{padding:16px 20px;background:var(--surface2);font-size:1.1rem;border-bottom:1px solid var(--border)}}
    .section-desc{{padding:10px 20px;color:var(--text-muted);font-size:.9rem}}
    .filters{{padding:12px 20px;display:flex;gap:8px;flex-wrap:wrap;border-bottom:1px solid var(--border)}}
    .filter-btn{{padding:5px 14px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;font-size:.85rem}}
    .filter-btn.active{{background:var(--accent);color:#fff;border-color:var(--accent)}}
    .data-table{{width:100%;border-collapse:collapse;font-size:.88rem}}
    .data-table th{{padding:10px 14px;text-align:left;color:var(--text-muted);font-weight:600;border-bottom:1px solid var(--border);background:var(--surface2);position:sticky;top:0}}
    .data-table td{{padding:9px 14px;border-bottom:1px solid var(--border)}}
    .data-table tr.covered{{border-left:3px solid var(--covered)}}
    .data-table tr.uncovered{{border-left:3px solid var(--uncovered)}}
    .data-table tr.deprecated{{opacity:.7}}
    .table-wrap{{overflow-x:auto}}
    .method-badge{{display:inline-block;padding:2px 8px;border-radius:4px;font-weight:700;font-size:.75rem;color:#fff;letter-spacing:.5px}}
    .badge{{display:inline-block;padding:2px 7px;border-radius:4px;font-size:.75rem;margin:1px}}
    .sc{{background:var(--surface2);color:var(--text-muted)}}
    .sc-2xx{{background:#1a4a2a;color:#49cc90}}.sc-4xx{{background:#4a1a1a;color:#f93e3e}}.sc-5xx{{background:#4a3a1a;color:#fca130}}
    .covered-badge{{color:var(--covered);font-weight:600}}
    .uncovered-badge{{font-weight:600}}
    .dep-tag{{display:inline-block;padding:1px 6px;background:#4a3a1a;color:#fca130;border-radius:3px;font-size:.75rem;margin-left:6px}}
    .path-cell{{font-family:monospace}}
    .count-badge{{background:var(--surface2);color:var(--text-muted);padding:2px 8px;border-radius:10px;font-size:.8rem;margin-left:8px}}
    .tasks-grid{{display:grid;gap:16px;padding:20px}}
    .task-card{{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:16px}}
    .task-card.priority-high{{border-left:4px solid #f93e3e}}
    .task-card.priority-medium{{border-left:4px solid #fca130}}
    .task-card.priority-low{{border-left:4px solid #aaa}}
    .task-card.cleanup{{border-left:4px solid #fca130}}
    .task-header{{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px}}
    .task-num{{font-family:monospace;font-size:.8rem;color:var(--text-muted)}}
    .task-path{{font-size:.9rem;color:var(--accent)}}
    .priority-badge{{font-size:.8rem;font-weight:600;margin-left:auto}}
    .task-summary{{color:var(--text-muted);font-size:.9rem;margin-bottom:12px}}
    .task-meta{{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:10px;font-size:.82rem}}
    .meta-item{{color:var(--text-muted)}}
    .auth-required{{color:var(--warning)!important}}
    .task-criteria{{margin-bottom:10px}}
    .task-criteria b,.task-hints b{{display:block;margin-bottom:6px;font-size:.88rem;color:var(--text-muted)}}
    .task-criteria ul{{padding-left:20px;font-size:.87rem}}
    .task-criteria li{{margin-bottom:3px}}
    .task-hints table{{font-size:.82rem;border-collapse:collapse}}
    .task-hints td{{padding:2px 12px 2px 0;color:var(--text-muted)}}
    .task-hints td:first-child{{color:var(--text);font-weight:600;white-space:nowrap}}
    code{{font-family:'JetBrains Mono','Fira Code',monospace;font-size:.88em}}
    .search-wrap{{padding:12px 20px;border-bottom:1px solid var(--border)}}
    #search{{width:100%;max-width:400px;padding:7px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:.9rem}}
    .hidden{{display:none!important}}
    .tag-bar-row{{display:flex;align-items:center;gap:12px;padding:6px 20px}}
    .tag-bar-label{{min-width:100px;font-size:.85rem;text-align:right}}
    .tag-bar-track{{flex:1;height:10px;background:var(--surface2);border-radius:5px;overflow:hidden}}
    .tag-bar-fill{{height:100%;border-radius:5px}}
    .tag-bar-pct{{min-width:100px;font-size:.82rem;font-weight:600}}
    .toast{{position:fixed;bottom:24px;right:24px;background:var(--accent);color:#fff;padding:10px 20px;border-radius:8px;font-size:.9rem;opacity:0;transition:opacity .3s;pointer-events:none;z-index:999}}
    .toast.show{{opacity:1}}
    @media print{{header .header-actions,.filters,.search-wrap,.theme-btn,.action-btn{{display:none!important}}.section,.card{{break-inside:avoid}}body{{background:#fff;color:#000}}:root{{--bg:#fff;--surface:#fff;--surface2:#f0f0f0;--text:#000;--text-muted:#666;--border:#ddd}}}}
  </style>
</head>
<body>
<header>
  <div>
    <h1>\U0001f50d PlaySwag Coverage Report</h1>
    <div class="meta">
      \U0001f4c4 Spec: <code>{spec_rel}</code> &nbsp;|&nbsp;
      \U0001f9ea Tests: <code>{tests_rel}</code> &nbsp;|&nbsp;
      \U0001f552 {ts_display}
    </div>
  </div>
  <div class="header-actions">
    <button class="action-btn" onclick="copySummary()">Copy Summary</button>
    <button class="action-btn" onclick="exportCSV()">Export CSV</button>
    <button class="action-btn" onclick="window.print()">Print</button>
    <button class="theme-btn" onclick="toggleTheme()">\U0001f319 Toggle Theme</button>
  </div>
</header>
<main>
  <div class="summary-cards">
    <div class="card">
      <h3>Endpoint Coverage</h3>
      <div class="val" style="color:{coverage_color(pct)}">{pct}%</div>
      <div class="sub">{cov_count} / {total}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:{pct}%;background:{coverage_color(pct)}"></div></div>
    </div>
    <div class="card">
      <h3>Status Codes</h3>
      <div class="val" style="color:{coverage_color(report.status_code_coverage)}">{report.status_code_coverage}%</div>
      <div class="sub">assertion-based</div>
    </div>
    <div class="card">
      <h3>Parameters</h3>
      <div class="val" style="color:{coverage_color(report.parameter_coverage)}">{report.parameter_coverage}%</div>
      <div class="sub">name-match</div>
    </div>
    <div class="card">
      <h3>Uncovered</h3>
      <div class="val" style="color:var(--uncovered)">{uncov_count}</div>
      <div class="sub">{len([e for e in report.uncovered if not e.deprecated])} active, {len([e for e in report.uncovered if e.deprecated])} deprecated</div>
    </div>
    <div class="card">
      <h3>Deprecated</h3>
      <div class="val" style="color:var(--warning)">{dep_count}</div>
      <div class="sub">{dep_in_tests} still tested</div>
    </div>
    <div class="card">
      <h3>Unmatched</h3>
      <div class="val" style="color:var(--text-muted)">{len(report.orphan_hits)}</div>
      <div class="sub">calls not in spec</div>
    </div>
  </div>

  {tag_section}

  <div class="section">
    <h2>All Endpoints <span class="count-badge">{total}</span></h2>
    <div class="filters">{filter_btns}</div>
    <div class="search-wrap">
      <input id="search" type="text" placeholder="Filter by path, method, tags..." oninput="filterSearch(this.value)">
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Method</th><th>Path</th><th>Summary</th><th>Tags</th><th>Status Codes</th><th>Status</th></tr></thead>
        <tbody id="ep-body">{"".join(ep_rows)}</tbody>
      </table>
    </div>
  </div>

  {tasks_section}
  {cleanup_section}
  {orphan_section}
</main>
<div class="toast" id="toast"></div>
<script>
  function toggleTheme(){{const t=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=t;localStorage.setItem('playswag-theme',t);}}
  (function(){{const t=localStorage.getItem('playswag-theme')||'dark';if(t==='light')document.documentElement.dataset.theme='light';}})();
  let cf='all',sv='';
  function applyFilters(){{
    document.querySelectorAll('#ep-body .ep-row').forEach(r=>{{
      let show=true;
      if(cf==='covered')show=r.dataset.covered==='true';
      else if(cf==='uncovered')show=r.dataset.covered==='false';
      else if(cf==='deprecated')show=r.dataset.deprecated==='true';
      else if(cf.startsWith('tag:'))show=r.dataset.tags.includes(cf.slice(4));
      if(show&&sv){{const t=r.textContent.toLowerCase();show=t.includes(sv.toLowerCase());}}
      r.classList.toggle('hidden',!show);
    }});
  }}
  function setFilter(f,btn){{cf=f;document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');applyFilters();}}
  function filterSearch(v){{sv=v;applyFilters();}}
  function showToast(msg){{const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);}}
  function copySummary(){{navigator.clipboard.writeText("{summary_text}").then(()=>showToast('Summary copied!'));}}
  function exportCSV(){{const b=new Blob(["{csv_content}"],{{type:'text/csv'}});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='playswag-coverage.csv';a.click();showToast('CSV exported!');}}
</script>
</body>
</html>"""


# ─── Markdown tasks ───────────────────────────────────────────────────────────

def generate_tasks(report: CoverageReport) -> str:
    spec_display = rel(report.spec_file)
    lines = [
        "# PlaySwag \u2014 QA Automation Tasks",
        "",
        f"**Generated:** {datetime.fromisoformat(report.timestamp).strftime('%Y-%m-%d %H:%M:%S')}",
        f"**Spec:** {spec_display}",
        f"**Endpoint Coverage:** {report.endpoint_coverage}% ({len(report.covered)}/{len(report.endpoints)})",
        "",
        "---",
        "",
    ]

    if not report.uncovered:
        lines.append("## \u2705 All endpoints are covered!")
    else:
        lines.append(f"## \U0001f4cb Coverage Tasks ({len(report.uncovered)})")
        lines.append("")

        sorted_uncov = sorted(
            report.uncovered,
            key=lambda e: {"High": 0, "Medium": 1, "Low": 2}[priority_for(e)],
        )

        for i, ep in enumerate(sorted_uncov):
            pri = priority_for(ep)
            success_code = next((sc for sc in ep.status_codes if sc.startswith("2")), "200")
            has_path_param = "{" in ep.path
            req_params = ", ".join(f"`{p.name}` ({p.location})" for p in ep.parameters if p.required) or "none"
            body_fields = ", ".join(f"`{f}`" for f in ep.request_body_fields[:8]) or "none"

            lines += [
                f"### TASK-{str(i+1).zfill(3)}: Cover `{ep.method} {ep.path}`",
                "",
                "| Field | Value |",
                "|-------|-------|",
                f"| **Priority** | {pri} |",
                f"| **Endpoint** | `{ep.method} {ep.path}` |",
                f"| **OperationId** | `{ep.operation_id or 'N/A'}` |",
                f"| **Tags** | {', '.join(ep.tags) or '\u2014'} |",
                f"| **Auth required** | {'Yes \U0001f510' if ep.auth_required else 'No'} |",
                f"| **Summary** | {ep.summary or '\u2014'} |",
                "",
                "**Acceptance Criteria:**",
                f"- [ ] Happy path \u2192 `{success_code}`",
            ]
            if ep.method in ("POST", "PUT", "PATCH"):
                lines.append("- [ ] Invalid input \u2192 400/422")
            if ep.auth_required:
                lines += ["- [ ] Unauthenticated \u2192 401", "- [ ] Forbidden \u2192 403"]
            if has_path_param:
                lines.append("- [ ] Not found \u2192 404")
            if ep.method == "DELETE":
                lines.append("- [ ] Idempotency \u2014 double DELETE \u2192 404 or 204")
            if any(p.required for p in ep.parameters):
                lines.append("- [ ] Missing required param \u2192 400")

            lines += [
                "",
                "**Test Hints:**",
                f"- Required params: {req_params}",
            ]
            if ep.request_body_fields:
                lines.append(f"- Body fields: {body_fields}")
            lines += [
                f"- Status codes in spec: {', '.join(ep.status_codes) or 'not defined'}",
                "",
                "---",
                "",
            ]

    if report.deprecated_in_tests:
        lines += [f"## \U0001f9f9 Cleanup Tasks ({len(report.deprecated_in_tests)})", ""]
        for i, item in enumerate(report.deprecated_in_tests):
            ep = item["endpoint"]
            hits_: list[TestHit] = item["hits"]
            files_str = ", ".join({_rel_single(h.file) for h in hits_})
            lines += [
                f"### CLEANUP-{str(i+1).zfill(3)}: `{ep.method} {ep.path}`",
                "",
                f"- **Found in:** {files_str}",
                "- [ ] Identify replacement endpoint",
                "- [ ] Update or remove test references",
                "",
                "---",
                "",
            ]

    if report.orphan_hits:
        lines += [f"## \u26a0\ufe0f Unmatched Calls ({len(report.orphan_hits)})", ""]
        lines.append("| Method | Path | File |")
        lines.append("|--------|------|------|")
        seen: set[str] = set()
        for h in report.orphan_hits[:30]:
            key = f"{h.method}:{h.matched_path}"
            if key not in seen:
                seen.add(key)
                lines.append(f"| `{h.method}` | `{h.matched_path}` | {_rel_single(h.file)} |")

    return "\n".join(lines)


# ─── JUnit XML (TASK-017) ─────────────────────────────────────────────────────

def _esc(s: str) -> str:
    return (
        str(s)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def generate_junit(report: CoverageReport) -> str:
    total = len(report.endpoints)
    failures = len(report.uncovered)

    cases: list[str] = []
    for ep in report.endpoints:
        is_cov = ep in report.covered
        name = f"{ep.method} {ep.path}"
        if is_cov:
            cases.append(f'    <testcase classname="playswag" name="{_esc(name)}" time="0"/>')
        else:
            pri = priority_for(ep)
            cases.append(
                f'    <testcase classname="playswag" name="{_esc(name)}" time="0">\n'
                f'      <failure message="Endpoint not covered by tests" type="UNCOVERED">'
                f'{_esc(name)} has no test coverage. Priority: {pri}'
                f'</failure>\n'
                f'    </testcase>'
            )

    return (
        f'<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<testsuite name="PlaySwag API Coverage" tests="{total}" failures="{failures}" errors="0" time="0" timestamp="{report.timestamp}">\n'
        + "\n".join(cases) + "\n"
        f'</testsuite>'
    )


# ─── SVG badge ────────────────────────────────────────────────────────────────

def generate_badge(pct: float) -> str:
    color = "#4c1" if pct >= 80 else "#dfb317" if pct >= 50 else "#e05d44"
    label = "API coverage"
    value = f"{pct}%"
    lw = len(label) * 6.5 + 10
    vw = len(value) * 7.5 + 10
    w = lw + vw
    return "".join([
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="20" role="img" aria-label="{label}: {value}">',
        '<linearGradient id="s"><stop offset="0" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>',
        f'<clipPath id="r"><rect width="{w}" height="20" rx="3" fill="#fff"/></clipPath>',
        '<g clip-path="url(#r)">',
        f'<rect width="{lw}" height="20" fill="#555"/>',
        f'<rect x="{lw}" width="{vw}" height="20" fill="{color}"/>',
        f'<rect width="{w}" height="20" fill="url(#s)"/>',
        '</g>',
        '<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">',
        f'<text x="{lw / 2}" y="15" fill="#010101" fill-opacity=".3">{label}</text>',
        f'<text x="{lw / 2}" y="14">{label}</text>',
        f'<text x="{lw + vw / 2}" y="15" fill="#010101" fill-opacity=".3">{value}</text>',
        f'<text x="{lw + vw / 2}" y="14">{value}</text>',
        '</g></svg>',
    ])


# ─── Coverage history (TASK-013) ──────────────────────────────────────────────

def load_history(out_dir: str) -> list[dict]:
    p = os.path.join(out_dir, "playswag-history.json")
    try:
        return json.loads(Path(p).read_text(encoding="utf-8"))
    except Exception:
        return []


def save_history(out_dir: str, entry: dict, max_entries: int = 50) -> list[dict]:
    history = load_history(out_dir)
    history.append(entry)
    while len(history) > max_entries:
        history.pop(0)
    p = os.path.join(out_dir, "playswag-history.json")
    Path(p).write_text(json.dumps(history, indent=2), encoding="utf-8")
    return history


def format_delta(current: float, previous: float | None) -> str:
    if previous is None:
        return ""
    diff = current - previous
    if diff == 0:
        return " (\u2192 0)"
    if diff > 0:
        return f" (\u2191 +{diff:.1f}%)"
    return f" (\u2193 {diff:.1f}%)"


# ─── Auto-detect tests dir ────────────────────────────────────────────────────

def find_tests_dir(spec_file: str) -> str:
    spec_dir = Path(spec_file).resolve().parent
    candidates = [
        spec_dir / "tests", spec_dir / "test", spec_dir / "e2e",
        spec_dir / "__tests__", spec_dir / "specs",
        Path.cwd() / "tests", Path.cwd() / "test", Path.cwd() / "e2e",
        Path.cwd() / "__tests__", Path.cwd() / "specs",
        Path.cwd(),
    ]
    for c in candidates:
        if c.exists():
            return str(c)
    return str(Path.cwd())


# ─── CLI arg parser ───────────────────────────────────────────────────────────

ALL_FORMATS = ("html", "json", "tasks", "badge", "junit")


def parse_cli_args(argv: list[str]) -> dict:
    opts: dict = {
        "spec_files": [],
        "tests_dir": None,
        "fail_under": None,
        "out_dir": None,
        "formats": None,
        "include": None,
        "exclude": None,
        "include_tags": None,
        "exclude_tags": None,
        "history": False,
    }
    found_sep = False
    before_sep: list[str] = []
    after_sep: list[str] = []

    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--":
            found_sep = True
            i += 1
            continue
        if a == "--fail-under" and i + 1 < len(argv):
            i += 1
            opts["fail_under"] = float(argv[i])
        elif a in ("--output", "-o") and i + 1 < len(argv):
            i += 1
            opts["out_dir"] = argv[i]
        elif a == "--format" and i + 1 < len(argv):
            i += 1
            opts["formats"] = [s.strip().lower() for s in argv[i].split(",")]
        elif a == "--json-only":
            opts["formats"] = ["json"]
        elif a == "--include" and i + 1 < len(argv):
            i += 1
            opts["include"] = [s.strip() for s in argv[i].split(",")]
        elif a == "--exclude" and i + 1 < len(argv):
            i += 1
            opts["exclude"] = [s.strip() for s in argv[i].split(",")]
        elif a == "--include-tags" and i + 1 < len(argv):
            i += 1
            opts["include_tags"] = [s.strip().lower() for s in argv[i].split(",")]
        elif a == "--exclude-tags" and i + 1 < len(argv):
            i += 1
            opts["exclude_tags"] = [s.strip().lower() for s in argv[i].split(",")]
        elif a == "--history":
            opts["history"] = True
        elif not a.startswith("-"):
            if found_sep:
                after_sep.append(a)
            else:
                before_sep.append(a)
        i += 1

    if found_sep:
        opts["spec_files"] = before_sep
        opts["tests_dir"] = after_sep[0] if after_sep else None
    else:
        opts["spec_files"] = [before_sep[0]] if before_sep else []
        opts["tests_dir"] = before_sep[1] if len(before_sep) > 1 else None

    return opts


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    opts = parse_cli_args(sys.argv[1:])
    if not opts["spec_files"]:
        print(
            "Usage: python3 analyze.py <spec-file> [tests-dir] [options]\n"
            "       python3 analyze.py spec1.yaml spec2.yaml -- tests/ [options]\n\n"
            "Options:\n"
            "  --fail-under <pct>        Exit 1 if endpoint coverage < pct\n"
            "  --output, -o <dir>        Output directory (default: ./playswag-report)\n"
            "  --format <list>           Comma-separated: html,json,tasks,badge,junit (default: all)\n"
            "  --json-only               Shorthand for --format json\n"
            "  --include <patterns>      Only analyze matching paths (comma-sep, wildcard *)\n"
            "  --exclude <patterns>      Skip matching paths\n"
            "  --include-tags <tags>     Only analyze endpoints with these tags\n"
            "  --exclude-tags <tags>     Skip endpoints with these tags\n"
            "  --history                 Append to playswag-history.json",
            file=sys.stderr,
        )
        sys.exit(1)

    # TASK-005: Load and merge multiple specs
    all_endpoints: list[OAEndpoint] = []
    all_base_paths: list[str] = []
    spec_files: list[str] = []

    for sf in opts["spec_files"]:
        spec_file = sf if is_url(sf) else str(Path(sf).resolve())
        if not is_url(sf) and not Path(spec_file).exists():
            print(f"ERROR: Spec file not found: {spec_file}", file=sys.stderr)
            sys.exit(2)
        spec_files.append(spec_file)

        try:
            spec_data = load_spec(spec_file)
        except Exception as e:
            print(f"ERROR: {e}", file=sys.stderr)
            sys.exit(2)

        spec_data = resolve_refs(spec_data)
        bp = extract_base_paths(spec_data)
        all_base_paths.extend(bp)
        eps = parse_spec(spec_data)

        for ep in eps:
            key = f"{ep.method}:{ep.path}"
            if any(f"{e.method}:{e.path}" == key for e in all_endpoints):
                print(f"   Warning: duplicate endpoint {key} (from {_rel_single(spec_file) if not is_url(spec_file) else spec_file})")
            else:
                all_endpoints.append(ep)

    all_base_paths = list(dict.fromkeys(all_base_paths))

    tests_dir = str(Path(opts["tests_dir"]).resolve()) if opts["tests_dir"] else find_tests_dir(spec_files[0])
    formats = set(opts["formats"] or ALL_FORMATS)

    print(f"\n\U0001f50d PlaySwag Analyzer (Python)")
    print(f"   Spec:  {', '.join(sf if is_url(sf) else _rel_single(sf) for sf in spec_files)}")
    print(f"   Tests: {tests_dir}")
    print(f"   Base paths: {', '.join(all_base_paths) if all_base_paths else '(none)'}")

    # TASK-008: Filter endpoints
    endpoints, ignored = filter_endpoints(all_endpoints, opts)
    if ignored:
        print(f"   Filtered out: {len(ignored)} endpoints")
    print(f"   Endpoints: {len(endpoints)}")

    print("\U0001f9ea Scanning test files...")
    test_files = find_test_files(tests_dir)
    print(f"   Found {len(test_files)} test files")

    all_hits: list[TestHit] = []
    for f in test_files:
        all_hits.extend(scan_test_file(f))
    print(f"   Found {len(all_hits)} API call patterns")

    cov = calculate_coverage(endpoints, all_hits, all_base_paths, test_files)
    deprecated = [ep for ep in endpoints if ep.deprecated]

    report = CoverageReport(
        spec_file=spec_files[0] if len(spec_files) == 1 else spec_files,
        tests_dir=tests_dir,
        timestamp=datetime.now().isoformat(),
        endpoints=endpoints,
        test_hits=all_hits,
        covered=cov["covered"],
        uncovered=cov["uncovered"],
        deprecated=deprecated,
        deprecated_in_tests=cov["deprecated_in_tests"],
        orphan_hits=cov["orphan_hits"],
        endpoint_coverage=cov["endpoint_coverage"],
        status_code_coverage=cov["status_code_coverage"],
        parameter_coverage=cov["parameter_coverage"],
        coverage_by_tag=cov["coverage_by_tag"],
    )

    out_dir = Path(opts["out_dir"]).resolve() if opts["out_dir"] else Path.cwd() / "playswag-report"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_dir_str = str(out_dir)

    written: list[str] = []
    if "html" in formats:
        p = out_dir / "report.html"
        p.write_text(generate_html(report), encoding="utf-8")
        written.append(f"HTML:    {p}")
    if "tasks" in formats:
        p = out_dir / "tasks.md"
        p.write_text(generate_tasks(report), encoding="utf-8")
        written.append(f"Tasks:   {p}")
    if "badge" in formats:
        p = out_dir / "playswag-badge.svg"
        p.write_text(generate_badge(report.endpoint_coverage), encoding="utf-8")
        written.append(f"Badge:   {p}")
    if "junit" in formats:
        p = out_dir / "playswag-junit.xml"
        p.write_text(generate_junit(report), encoding="utf-8")
        written.append(f"JUnit:   {p}")

    summary = {
        "timestamp": report.timestamp,
        "specFiles": spec_files,
        "testsDir": report.tests_dir,
        "basePaths": all_base_paths,
        "totalEndpoints": len(endpoints),
        "coveredEndpoints": len(cov["covered"]),
        "uncoveredEndpoints": len(cov["uncovered"]),
        "deprecatedEndpoints": len(deprecated),
        "deprecatedInTests": len(cov["deprecated_in_tests"]),
        "orphanHits": len(cov["orphan_hits"]),
        "endpointCoverage": cov["endpoint_coverage"],
        "statusCodeCoverage": cov["status_code_coverage"],
        "parameterCoverage": cov["parameter_coverage"],
        "coverageByTag": cov["coverage_by_tag"],
        "taskCount": len(cov["uncovered"]) + len(cov["deprecated_in_tests"]),
        "uncoveredList": [
            {
                "method": ep.method, "path": ep.path,
                "priority": priority_for(ep), "tags": ep.tags,
                "operationId": ep.operation_id,
            }
            for ep in cov["uncovered"]
        ],
    }
    if ignored:
        summary["ignoredEndpoints"] = len(ignored)
    if "json" in formats:
        p = out_dir / "summary.json"
        p.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
        written.append(f"Summary: {p}")

    # TASK-013: History
    delta = ""
    if opts["history"]:
        history = save_history(out_dir_str, {
            "timestamp": report.timestamp,
            "endpointCoverage": cov["endpoint_coverage"],
            "statusCodeCoverage": cov["status_code_coverage"],
            "parameterCoverage": cov["parameter_coverage"],
            "totalEndpoints": len(endpoints),
            "coveredEndpoints": len(cov["covered"]),
        })
        if len(history) >= 2:
            prev = history[-2]
            delta = format_delta(cov["endpoint_coverage"], prev.get("endpointCoverage"))
        written.append(f"History: {os.path.join(out_dir_str, 'playswag-history.json')}")

    print(f"\n\U0001f4ca Coverage:")
    print(f"   Endpoint Coverage:  {cov['endpoint_coverage']}% ({len(cov['covered'])}/{len(endpoints)}){delta}")
    print(f"   Status Code:        {cov['status_code_coverage']}%")
    print(f"   Parameter:          {cov['parameter_coverage']}%")
    print(f"   Uncovered:          {len(cov['uncovered'])}")
    print(f"   Deprecated:         {len(deprecated)} ({len(cov['deprecated_in_tests'])} still tested)")
    print(f"   Unmatched hits:     {len(cov['orphan_hits'])}")
    print(f"   Tasks created:      {summary['taskCount']}")

    if len(cov["coverage_by_tag"]) > 1:
        print(f"\n   Coverage by tag:")
        for tag, data in sorted(cov["coverage_by_tag"].items(), key=lambda x: x[1]["pct"]):
            print(f"     {tag}: {data['pct']}% ({data['covered']}/{data['total']})")

    if written:
        print(f"\n\U0001f4c1 Output:")
        for line in written:
            print(f"   {line}")

    if opts["fail_under"] is not None:
        threshold = opts["fail_under"]
        if report.endpoint_coverage < threshold:
            print(f"\n\u274c FAIL: Endpoint coverage {report.endpoint_coverage}% < threshold {threshold}%")
            sys.exit(1)
        print(f"\n\u2705 PASS: Endpoint coverage {report.endpoint_coverage}% >= threshold {threshold}%")


if __name__ == "__main__":
    main()
