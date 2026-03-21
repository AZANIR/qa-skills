#!/usr/bin/env node
/**
 * playswag — API Coverage Analyzer
 * Pure JavaScript, runs with: node analyze.js <spec-file> [tests-dir]
 *
 * No npm install needed. Optional: npm i js-yaml (for YAML specs without python3)
 *
 * Usage:
 *   node analyze.js openapi.yaml tests/
 *   node analyze.js spec1.yaml spec2.yaml -- tests/
 *   node analyze.js https://api.example.com/openapi.json tests/
 */

"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync, execFileSync } = require("child_process");
const crypto = require("crypto");

// ─── URL fetch (TASK-006) ─────────────────────────────────────────────────────

function isUrl(s) {
  return typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"));
}

function fetchUrl(url) {
  const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
  const ext = url.endsWith(".yaml") || url.endsWith(".yml") ? ".yaml" : ".json";
  const cached = path.join(os.tmpdir(), `playswag_${hash}${ext}`);

  try {
    const stat = fs.statSync(cached);
    if (Date.now() - stat.mtimeMs < 300000) {
      console.log(`   Using cached spec: ${cached}`);
      return cached;
    }
  } catch {}

  console.log(`   Fetching spec from ${url}...`);
  for (const cmd of [
    ["curl", ["-sL", "--max-time", "30", "-o", cached, url]],
    ["wget", ["-qO", cached, "--timeout=30", url]],
  ]) {
    try { execFileSync(cmd[0], cmd[1]); return cached; } catch {}
  }

  const env = { ...process.env, PLAYSWAG_FETCH_URL: url, PLAYSWAG_FETCH_OUT: cached };
  execSync(
    'node -e "const u=process.env.PLAYSWAG_FETCH_URL,o=process.env.PLAYSWAG_FETCH_OUT,h=require(u.startsWith(\'https\')?\'https\':\'http\'),f=require(\'fs\');h.get(u,r=>{const c=[];r.on(\'data\',d=>c.push(d));r.on(\'end\',()=>f.writeFileSync(o,Buffer.concat(c)))}).on(\'error\',e=>{process.stderr.write(e.message);process.exit(1)})"',
    { encoding: "utf8", env }
  );
  return cached;
}

// ─── YAML loader ──────────────────────────────────────────────────────────────

function loadSpec(specFile) {
  const filePath = isUrl(specFile) ? fetchUrl(specFile) : specFile;
  const content = fs.readFileSync(filePath, "utf8").trim();
  if (content.startsWith("{") || content.startsWith("[")) {
    return JSON.parse(content);
  }

  for (const mod of ["js-yaml", "yaml"]) {
    try {
      const lib = require(mod);
      return typeof lib.load === "function" ? lib.load(content) : lib.parse(content);
    } catch {}
  }

  try {
    const tmp = path.join(os.tmpdir(), `playswag_${Date.now()}.yaml`);
    fs.writeFileSync(tmp, content);
    const env = { ...process.env, PLAYSWAG_YAML_FILE: tmp };
    const json = execSync(
      `python3 -c "import os,sys,json,yaml; p=os.environ['PLAYSWAG_YAML_FILE']; print(json.dumps(yaml.safe_load(open(p, encoding='utf-8'))))"`,
      { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], env }
    ).trim();
    try { fs.unlinkSync(tmp); } catch {}
    return JSON.parse(json);
  } catch {}

  throw new Error(
    "Cannot parse YAML spec.\n" +
    "Install js-yaml:  npm install js-yaml\n" +
    "  OR  PyYAML:     pip3 install pyyaml\n" +
    "  OR  convert your spec to JSON."
  );
}

// ─── $ref resolver (JSON Pointer #/...) ────────────────────────────────────────

function getPointerParts(refHash) {
  return refHash.slice(2).split("/").map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function getAtPointer(root, parts) {
  let cur = root;
  for (const key of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[key];
  }
  return cur;
}

function deepCloneJson(obj) {
  try { return JSON.parse(JSON.stringify(obj)); } catch { return obj; }
}

function resolveRefs(spec, maxDepth = 10) {
  const root = spec;
  const resolving = new Set();

  function resolve(obj, depth) {
    if (depth > maxDepth) return obj;
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map((item) => resolve(item, depth + 1));

    if (typeof obj.$ref === "string" && obj.$ref.startsWith("#/")) {
      const ref = obj.$ref;
      if (resolving.has(ref)) return { __playswag_circularRef: ref };
      resolving.add(ref);
      const parts = getPointerParts(ref);
      let target = getAtPointer(root, parts);
      if (target === undefined || (typeof target !== "object" && !Array.isArray(target))) {
        resolving.delete(ref);
        const fallback = {};
        for (const [k, v] of Object.entries(obj)) {
          fallback[k] = k === "$ref" ? v : resolve(v, depth + 1);
        }
        return fallback;
      }
      target = resolve(deepCloneJson(target), depth + 1);
      const merged = Array.isArray(target) ? [...target] : { ...target };
      for (const [k, v] of Object.entries(obj)) {
        if (k !== "$ref") merged[k] = resolve(v, depth + 1);
      }
      resolving.delete(ref);
      return merged;
    }

    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = resolve(v, depth + 1);
    }
    return out;
  }

  return resolve(spec, 0);
}

// ─── Base path (Swagger basePath / OAS servers[].url) ───────────────────────

function normalizeBasePath(p) {
  if (p == null || p === "") return "";
  let s = String(p).trim();
  if (!s || s === "/") return "";
  if (!s.startsWith("/")) s = "/" + s;
  return s.replace(/\/+$/, "") || "";
}

function joinBaseAndPath(base, tpl) {
  const b = normalizeBasePath(base);
  const t = tpl && tpl.startsWith("/") ? tpl : "/" + (tpl || "");
  if (!b) return t;
  return (b + t).replace(/\/{2,}/g, "/") || "/";
}

function extractPathFromServerUrl(url) {
  if (!url || typeof url !== "string") return "";
  const u = url.trim();
  try {
    if (u.startsWith("http://") || u.startsWith("https://")) {
      return new URL(u).pathname || "/";
    }
  } catch {}
  return u.split("?")[0].split("#")[0];
}

function extractBasePaths(spec) {
  const out = [];
  if (spec.swagger && spec.basePath != null) {
    const b = normalizeBasePath(spec.basePath);
    if (b) out.push(b);
  }
  if (spec.openapi && Array.isArray(spec.servers)) {
    for (const s of spec.servers) {
      if (!s || !s.url) continue;
      const p = extractPathFromServerUrl(s.url);
      const b = normalizeBasePath(p);
      if (b) out.push(b);
    }
  }
  return [...new Set(out)];
}

function hitMatchesEndpointPath(hitPath, templatePath, basePaths) {
  if (pathMatchesTemplate(hitPath, templatePath)) return true;
  const bases = basePaths && basePaths.length ? basePaths : [];
  const hl = hitPath.replace(/\/+$/, "").toLowerCase();

  for (const base of bases) {
    const nb = normalizeBasePath(base).toLowerCase();
    if (!nb) continue;
    if (hl === nb || hl.startsWith(nb + "/")) {
      const stripped = hl === nb ? "/" : hl.slice(nb.length) || "/";
      const toMatch = stripped.startsWith("/") ? stripped : "/" + stripped;
      if (pathMatchesTemplate(toMatch, templatePath)) return true;
    }
  }
  for (const base of bases) {
    const combined = joinBaseAndPath(base, templatePath);
    if (pathMatchesTemplate(hitPath, combined)) return true;
  }
  return false;
}

// ─── Spec parser ──────────────────────────────────────────────────────────────

function extractBodyFields(schema, prefix, depth) {
  if (!schema || depth === 0) return [];
  const fields = [];
  let props = schema.properties || {};

  for (const key of ["allOf", "anyOf", "oneOf"]) {
    for (const sub of schema[key] || []) {
      Object.assign(props, sub.properties || {});
    }
  }

  for (const [name, val] of Object.entries(props)) {
    const fullKey = prefix ? `${prefix}.${name}` : name;
    fields.push(fullKey);
    if (val && typeof val === "object") {
      fields.push(...extractBodyFields(val, fullKey, depth - 1));
    }
  }
  return fields;
}

function parseSpec(spec) {
  const endpoints = [];
  const isOAS3 = !!spec.openapi;
  const paths = spec.paths || {};
  const globalSecurity = spec.security || [];

  for (const [pathTemplate, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== "object") continue;

    const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "head", "options"];
    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!op || typeof op !== "object") continue;

      const paramMap = new Map();
      for (const p of [...(pathItem.parameters || []), ...(op.parameters || [])]) {
        if (p && p.name) {
          paramMap.set(`${p.in}:${p.name}`, {
            name: p.name, in: p.in, required: !!p.required, description: p.description || "",
          });
        }
      }
      const parameters = [...paramMap.values()];

      let bodyFields = [];
      if (isOAS3 && op.requestBody) {
        const content = op.requestBody.content || {};
        const jsonContent = content["application/json"] || content["application/x-www-form-urlencoded"] || Object.values(content)[0] || {};
        bodyFields = extractBodyFields(jsonContent.schema || {}, "", 3);
      } else if (!isOAS3) {
        const bodyParam = (op.parameters || []).find((p) => p && p.in === "body");
        if (bodyParam && bodyParam.schema) bodyFields = extractBodyFields(bodyParam.schema, "", 3);
      }

      const statusCodes = Object.keys(op.responses || {});
      const opSecurity = op.security !== undefined ? op.security : globalSecurity;
      const authRequired = Array.isArray(opSecurity) && opSecurity.length > 0;

      endpoints.push({
        method: method.toUpperCase(), path: pathTemplate,
        operationId: op.operationId || "", summary: op.summary || "",
        description: op.description || "", tags: op.tags || [],
        deprecated: !!op.deprecated, parameters, requestBodyFields: bodyFields,
        statusCodes, authRequired,
      });
    }
  }
  return endpoints;
}

// ─── Endpoint filter (TASK-008) ───────────────────────────────────────────────

function wildcardMatch(pattern, value) {
  const re = new RegExp("^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i");
  return re.test(value);
}

function filterEndpoints(endpoints, opts) {
  let filtered = endpoints;
  const ignored = [];

  if (opts.include && opts.include.length) {
    const next = [];
    for (const ep of filtered) {
      if (opts.include.some((pat) => wildcardMatch(pat, ep.path))) next.push(ep);
      else ignored.push(ep);
    }
    filtered = next;
  }

  if (opts.exclude && opts.exclude.length) {
    const next = [];
    for (const ep of filtered) {
      if (opts.exclude.some((pat) => wildcardMatch(pat, ep.path))) ignored.push(ep);
      else next.push(ep);
    }
    filtered = next;
  }

  if (opts.includeTags && opts.includeTags.length) {
    const next = [];
    for (const ep of filtered) {
      const epTags = ep.tags.map((t) => t.toLowerCase());
      if (opts.includeTags.some((t) => epTags.includes(t))) next.push(ep);
      else ignored.push(ep);
    }
    filtered = next;
  }

  if (opts.excludeTags && opts.excludeTags.length) {
    const next = [];
    for (const ep of filtered) {
      const epTags = ep.tags.map((t) => t.toLowerCase());
      if (opts.excludeTags.some((t) => epTags.includes(t))) ignored.push(ep);
      else next.push(ep);
    }
    filtered = next;
  }

  return { endpoints: filtered, ignored };
}

// ─── Test scanner ─────────────────────────────────────────────────────────────

/** Canonical HTTP hit patterns — keep analyze.js / analyze.ts / analyze.py in sync. */
const HIT_PATTERNS = [
  { re: /\b(?:request|req|api|client|http)\.(get|post|put|patch|delete|head)\s*\(\s*[`'"](.*?)[`'"]/gi, mGrp: 1, uGrp: 2 },
  { re: /\baxios\.(get|post|put|patch|delete|head)\s*\(\s*[`'"](.*?)[`'"]/gi, mGrp: 1, uGrp: 2 },
  { re: /\)\.(get|post|put|patch|delete|head)\s*\(\s*[`'"](\/[^`'"]*)[`'"]/gi, mGrp: 1, uGrp: 2 },
  { re: /\bfetch\s*\(\s*[`'"](.*?)[`'"]\s*,\s*\{[^}]*method\s*:\s*[`'"](GET|POST|PUT|PATCH|DELETE|HEAD)[`'"]/gis, mGrp: 2, uGrp: 1 },
  { re: /\bfetch\s*\(\s*[`'"]((?:https?:\/\/[^`'" ]+|\/[^`'" ]+))[`'"]\s*(?:\)|\s*,\s*\{[^}]*\})/gi, mGrp: 0, uGrp: 1 },
  { re: /cy\.request\s*\(\s*\{[^}]*method\s*:\s*[`'"](GET|POST|PUT|PATCH|DELETE|HEAD)[`'"][^}]*url\s*:\s*[`'"](.*?)[`'"]/gis, mGrp: 1, uGrp: 2 },
  { re: /\b(?:got|ky)\.(get|post|put|patch|delete|head)\s*\(\s*[`'"](.*?)[`'"]/gi, mGrp: 1, uGrp: 2 },
  { re: /\bhttps?\.get\s*\(\s*[`'"](https?:\/\/[^`'"]+)[`'"]/gi, mGrp: 0, uGrp: 1 },
  { re: /test\.describe\s*\(\s*[`'"](GET|POST|PUT|PATCH|DELETE|HEAD)\s+(\/[^`'"\n]+)[`'"]/gi, mGrp: 1, uGrp: 2 },
  { re: /\bself\.client\.(get|post|put|patch|delete|head)\s*\(\s*[`'"](.*?)[`'"]/gi, mGrp: 1, uGrp: 2 },
  { re: /\bawait\s+\w+\.(get|post|put|patch|delete|head)\s*\(\s*[`'"](.*?)[`'"]/gi, mGrp: 1, uGrp: 2 },
  // TASK-010: Additional patterns
  { re: /\brequest\s*\(\s*\w+\s*\)\s*\.\s*(get|post|put|patch|delete|head)\s*\(\s*[`'"](.*?)[`'"]/gi, mGrp: 1, uGrp: 2 },
  { re: /\bgiven\s*\(\s*\)[\s\S]*?\.(?:when|request)\s*\(\s*\)[\s\S]*?\.(get|post|put|patch|delete|head)\s*\(\s*[`'"](.*?)[`'"]/gi, mGrp: 1, uGrp: 2 },
  { re: /\b(?:session|aiohttp_client)\.(get|post|put|patch|delete|head)\s*\(\s*[`'"](.*?)[`'"]/gi, mGrp: 1, uGrp: 2 },
  { re: /\b(?:requests|httpx)\.(get|post|put|patch|delete|head)\s*\(\s*[`'"](.*?)[`'"]/gi, mGrp: 1, uGrp: 2 },
  { re: /\.request\s*\(\s*[`'"](GET|POST|PUT|PATCH|DELETE|HEAD)[`'"]\s*,\s*[`'"](.*?)[`'"]/gi, mGrp: 1, uGrp: 2 },
];

const TEST_EXTENSIONS = new Set([
  ".spec.ts", ".test.ts", ".spec.js", ".test.js",
  ".spec.tsx", ".test.tsx", ".spec.jsx", ".test.jsx",
  ".e2e.ts", ".e2e.js",
]);

function isTestFile(filePath) {
  const base = path.basename(filePath).toLowerCase();
  return TEST_EXTENSIONS.has(path.extname(base)) ||
    TEST_EXTENSIONS.has(base.slice(base.indexOf("."))) ||
    (base.startsWith("test_") && base.endsWith(".py")) ||
    (base.endsWith("_test.py"));
}

function findTestFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  function walk(d) {
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }

    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && isTestFile(full)) results.push(full);
    }
  }
  walk(dir);
  return results;
}

function extractPath(url) {
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) return new URL(url).pathname;
  } catch {}
  return url.split("?")[0].split("#")[0];
}

function scanTestFile(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, "utf8"); } catch { return []; }

  const hits = [];
  const seen = new Set();

  for (const { re, mGrp, uGrp } of HIT_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(content)) !== null) {
      let rawUrl = m[uGrp];
      const rawMethod = mGrp === 0 ? "GET" : m[mGrp];
      if (!rawUrl) continue;

      // TASK-009: partial match for template literals
      let isPartial = false;
      if (rawUrl.includes("${") || rawUrl.includes("#{")) {
        const idx = Math.min(
          rawUrl.includes("${") ? rawUrl.indexOf("${") : Infinity,
          rawUrl.includes("#{") ? rawUrl.indexOf("#{") : Infinity,
        );
        const staticPart = rawUrl.slice(0, idx);
        if (staticPart.includes("/") && staticPart.length > 1) {
          rawUrl = staticPart;
          isPartial = true;
        } else {
          continue;
        }
      }

      const beforeMatch = content.slice(0, m.index);
      const lineNum = beforeMatch.split("\n").length;
      const matchedPath = extractPath(rawUrl);
      const key = `${rawMethod.toUpperCase()}:${matchedPath}:${filePath}:${lineNum}`;
      if (seen.has(key)) continue;
      seen.add(key);

      hits.push({
        method: rawMethod.toUpperCase(), matchedPath, rawUrl,
        file: filePath, line: lineNum, partial: isPartial,
      });
    }
  }
  return hits;
}

// ─── Status code assertion scanner (TASK-014) ────────────────────────────────

const STATUS_ASSERTION_PATTERNS = [
  /\.expect\s*\(\s*(\d{3})\s*\)/g,
  /\.toHaveStatus\s*\(\s*(\d{3})\s*\)/g,
  /\.status\s*(?:===?|!==?|==)\s*(\d{3})/g,
  /status[_\s]*(?:code)?\s*(?:===?|==|is|equals?)\s*(\d{3})/gi,
  /assert.*?(?:status|code).*?(\d{3})/gi,
  /\.status_code\s*==\s*(\d{3})/g,
  /expect\s*\(.*?status.*?\).*?(?:toBe|toEqual|to\.equal)\s*\(\s*(\d{3})\s*\)/gi,
  /\.should\.have\.status\s*\(\s*(\d{3})\s*\)/g,
];

function scanStatusCodeAssertions(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, "utf8"); } catch { return []; }

  const results = [];
  const seen = new Set();
  for (const re of STATUS_ASSERTION_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(content)) !== null) {
      const code = m[1];
      const lineNum = content.slice(0, m.index).split("\n").length;
      const key = `${code}:${filePath}:${lineNum}`;
      if (!seen.has(key)) { seen.add(key); results.push({ code, file: filePath, line: lineNum }); }
    }
  }
  return results;
}

// ─── Parameter coverage scanner (TASK-015) ───────────────────────────────────

function scanParameterUsage(filePath, paramNames) {
  if (!paramNames.length) return new Set();
  let content;
  try { content = fs.readFileSync(filePath, "utf8"); } catch { return new Set(); }

  const found = new Set();
  const lower = content.toLowerCase();
  for (const name of paramNames) {
    const nl = name.toLowerCase();
    if (lower.includes(nl)) found.add(name);
  }
  return found;
}

// ─── Path matcher ─────────────────────────────────────────────────────────────

function pathMatchesTemplate(hitPath, template) {
  const normHit = hitPath.replace(/\/+$/, "").toLowerCase();
  const normTpl = template.replace(/\/+$/, "").toLowerCase();
  if (normHit === normTpl) return true;

  const regexStr =
    "^" +
    normTpl
      .split("/")
      .map((seg) =>
        seg.startsWith("{") && seg.endsWith("}")
          ? "[^/]+"
          : seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      )
      .join("\\/") +
    "$";

  try { return new RegExp(regexStr).test(normHit); } catch { return false; }
}

/** TASK-009: prefix match for partial (template literal) hits */
function pathPrefixMatchesTemplate(hitPrefix, template) {
  const normHit = hitPrefix.replace(/\/+$/, "").toLowerCase();
  const normTpl = template.replace(/\/+$/, "").toLowerCase();
  if (normTpl.startsWith(normHit)) return true;

  const hitSegs = normHit.split("/");
  const tplSegs = normTpl.split("/");
  if (hitSegs.length > tplSegs.length) return false;

  for (let i = 0; i < hitSegs.length; i++) {
    const ts = tplSegs[i];
    const hs = hitSegs[i];
    if (ts.startsWith("{") && ts.endsWith("}")) continue;
    if (ts !== hs) return false;
  }
  return true;
}

function matchHitToEndpoint(hit, endpoints, basePaths = []) {
  let best = null;
  let bestScore = -1;
  const matcher = hit.partial ? pathPrefixMatchesTemplate : null;

  for (const ep of endpoints) {
    if (ep.method !== hit.method) continue;
    let matched = false;
    if (hit.partial) {
      matched = pathPrefixMatchesTemplate(hit.matchedPath, ep.path);
      if (!matched) {
        for (const base of basePaths) {
          const combined = joinBaseAndPath(base, ep.path);
          if (pathPrefixMatchesTemplate(hit.matchedPath, combined)) { matched = true; break; }
        }
      }
    } else {
      matched = hitMatchesEndpointPath(hit.matchedPath, ep.path, basePaths);
    }
    if (!matched) continue;
    const score = ep.path.split("/").filter((s) => !s.startsWith("{")).length;
    if (score > bestScore) { bestScore = score; best = ep; }
  }
  return best;
}

// ─── Coverage ─────────────────────────────────────────────────────────────────

function calculateCoverage(endpoints, allHits, basePaths = [], testFiles = []) {
  const coveredKeys = new Set();
  const endpointHitsMap = new Map();
  const orphanHits = [];

  for (const hit of allHits) {
    const ep = matchHitToEndpoint(hit, endpoints, basePaths);
    if (ep) {
      const key = `${ep.method}:${ep.path}`;
      coveredKeys.add(key);
      if (!endpointHitsMap.has(key)) endpointHitsMap.set(key, []);
      endpointHitsMap.get(key).push(hit);
    } else {
      orphanHits.push(hit);
    }
  }

  const covered = endpoints.filter((ep) => coveredKeys.has(`${ep.method}:${ep.path}`));
  const uncovered = endpoints.filter((ep) => !coveredKeys.has(`${ep.method}:${ep.path}`));
  const deprecated = endpoints.filter((ep) => ep.deprecated);
  const deprecatedInTests = deprecated
    .filter((ep) => coveredKeys.has(`${ep.method}:${ep.path}`))
    .map((ep) => ({ endpoint: ep, hits: endpointHitsMap.get(`${ep.method}:${ep.path}`) || [] }));

  const endpointCoverage = endpoints.length === 0 ? 0 : Math.round((covered.length / endpoints.length) * 1000) / 10;

  // TASK-014: Real status code coverage
  const allStatusAssertions = [];
  for (const f of testFiles) allStatusAssertions.push(...scanStatusCodeAssertions(f));
  const assertedCodes = new Set(allStatusAssertions.map((a) => a.code));

  let totalSC = 0, coveredSC = 0;
  const perEndpointSC = new Map();
  for (const ep of endpoints) {
    const key = `${ep.method}:${ep.path}`;
    const specCodes = ep.statusCodes.filter((c) => /^\d{3}$/.test(c));
    totalSC += specCodes.length;
    const testedCodes = specCodes.filter((c) => assertedCodes.has(c));
    if (coveredKeys.has(key)) coveredSC += testedCodes.length || Math.min(specCodes.length, 1);
    perEndpointSC.set(key, { spec: specCodes, tested: testedCodes });
  }
  const statusCodeCoverage = totalSC === 0 ? 0 : Math.round((coveredSC / totalSC) * 1000) / 10;

  // TASK-015: Parameter coverage
  let totalParams = 0, coveredParams = 0;
  const perEndpointParams = new Map();
  for (const ep of covered) {
    const key = `${ep.method}:${ep.path}`;
    const paramNames = ep.parameters.map((p) => p.name);
    totalParams += paramNames.length;
    const hits = endpointHitsMap.get(key) || [];
    const testFilesForEp = [...new Set(hits.map((h) => h.file))];
    const usedParams = new Set();
    for (const tf of testFilesForEp) {
      for (const p of scanParameterUsage(tf, paramNames)) usedParams.add(p);
    }
    coveredParams += usedParams.size;
    perEndpointParams.set(key, { total: paramNames, used: [...usedParams] });
  }
  const parameterCoverage = totalParams === 0 ? 0 : Math.round((coveredParams / totalParams) * 1000) / 10;

  // TASK-016: Coverage by tag
  const tagMap = new Map();
  for (const ep of endpoints) {
    const tags = ep.tags.length ? ep.tags : ["Untagged"];
    for (const t of tags) {
      if (!tagMap.has(t)) tagMap.set(t, { total: 0, covered: 0 });
      tagMap.get(t).total++;
      if (coveredKeys.has(`${ep.method}:${ep.path}`)) tagMap.get(t).covered++;
    }
  }
  const coverageByTag = {};
  for (const [tag, data] of tagMap) {
    coverageByTag[tag] = {
      total: data.total, covered: data.covered,
      pct: data.total === 0 ? 0 : Math.round((data.covered / data.total) * 1000) / 10,
    };
  }

  return {
    covered, uncovered, deprecated, deprecatedInTests, orphanHits,
    endpointCoverage, statusCodeCoverage, parameterCoverage,
    perEndpointSC, perEndpointParams, coverageByTag,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const METHOD_COLORS = {
  GET: "#61affe", POST: "#49cc90", PUT: "#fca130",
  PATCH: "#50e3c2", DELETE: "#f93e3e", HEAD: "#9012fe", OPTIONS: "#0d5aa7",
};
const methodColor = (m) => METHOD_COLORS[m] || "#999";
const coverageColor = (p) => p >= 80 ? "#49cc90" : p >= 50 ? "#fca130" : "#f93e3e";
const priority = (ep) => ep.deprecated ? "Low" : ["POST","PUT","DELETE","PATCH"].includes(ep.method) || ep.authRequired ? "High" : "Medium";
const priorityColor = (p) => ({ High: "#f93e3e", Medium: "#fca130", Low: "#aaa" })[p] || "#aaa";
const rel = (p) => { try { return path.relative(process.cwd(), p); } catch { return p; } };

// ─── HTML ─────────────────────────────────────────────────────────────────────

function generateHTML(report) {
  const { specFile, testsDir, timestamp, endpoints, covered, uncovered, deprecated, deprecatedInTests, orphanHits, endpointCoverage, coverageByTag } = report;
  const total = endpoints.length;
  const allTags = [...new Set(endpoints.flatMap((ep) => ep.tags.length ? ep.tags : []))].sort();
  const pct = endpointCoverage;

  // TASK-016: Tag coverage bars
  const tagBars = Object.entries(coverageByTag || {}).sort((a, b) => a[1].pct - b[1].pct).map(([tag, data]) => `
    <div class="tag-bar-row">
      <span class="tag-bar-label">${tag}</span>
      <div class="tag-bar-track"><div class="tag-bar-fill" style="width:${data.pct}%;background:${coverageColor(data.pct)}"></div></div>
      <span class="tag-bar-pct" style="color:${coverageColor(data.pct)}">${data.pct}% (${data.covered}/${data.total})</span>
    </div>`).join("");

  const epRows = endpoints.map((ep) => {
    const isCov = covered.includes(ep);
    const isDep = ep.deprecated;
    const prio = priority(ep);
    const tags = ep.tags.join(", ") || "\u2014";
    const scBadges = ep.statusCodes.map((sc) => `<span class="badge sc sc-${sc[0]}xx">${sc}</span>`).join(" ");
    const depHtml = isDep ? ' <span class="dep-tag">deprecated</span>' : "";
    const statusHtml = isCov
      ? '<span class="covered-badge">\u2713 Covered</span>'
      : `<span class="uncovered-badge" style="color:${priorityColor(prio)}">\u2717 ${prio}</span>`;

    return `
    <tr class="ep-row ${isCov?"covered":"uncovered"} ${isDep?"deprecated":""}"
        data-covered="${isCov}" data-deprecated="${isDep}"
        data-tags="${ep.tags.join(",").toLowerCase()}">
      <td><span class="method-badge" style="background:${methodColor(ep.method)}">${ep.method}</span></td>
      <td class="path-cell"><code>${ep.path}</code>${depHtml}</td>
      <td>${ep.summary || ep.operationId || "\u2014"}</td>
      <td>${tags}</td>
      <td>${scBadges}</td>
      <td>${statusHtml}</td>
    </tr>`;
  }).join("\n");

  const taskCards = uncovered.map((ep, i) => {
    const prio = priority(ep);
    const successCode = ep.statusCodes.find((sc) => sc.startsWith("2")) || "200";
    const hasPathParam = ep.path.includes("{");
    const reqParams = ep.parameters.filter((p) => p.required).map((p) => `<code>${p.name}</code> (${p.in})`).join(", ") || "none";
    const bodyFieldsHtml = ep.requestBodyFields.slice(0, 8).map((f) => `<code>${f}</code>`).join(", ") || "none";
    const metaParts = [
      ep.operationId ? `<span class="meta-item"><b>operationId:</b> ${ep.operationId}</span>` : "",
      ep.tags.length ? `<span class="meta-item"><b>tags:</b> ${ep.tags.join(", ")}</span>` : "",
      ep.authRequired ? '<span class="meta-item auth-required">\uD83D\uDD10 Auth required</span>' : "",
    ].filter(Boolean).join("");

    const criteria = [
      `<li>\u2705 Happy path \u2014 successful <code>${successCode}</code> response</li>`,
      ["POST","PUT","PATCH"].includes(ep.method) ? "<li>\u2B1C Invalid input \u2192 400/422 validation error</li>" : "",
      ep.authRequired ? "<li>\u2B1C Unauthenticated request \u2192 401</li><li>\u2B1C Insufficient permissions \u2192 403</li>" : "",
      hasPathParam ? "<li>\u2B1C Non-existent resource \u2192 404</li>" : "",
      ep.method === "DELETE" ? "<li>\u2B1C Idempotency \u2014 double DELETE \u2192 404 or 204</li>" : "",
      ep.parameters.some((p) => p.required) ? "<li>\u2B1C Missing required parameter \u2192 400</li>" : "",
    ].filter(Boolean).join("\n          ");

    return `
    <div class="task-card priority-${prio.toLowerCase()}">
      <div class="task-header">
        <span class="task-num">TASK-${String(i+1).padStart(3,"0")}</span>
        <span class="method-badge" style="background:${methodColor(ep.method)}">${ep.method}</span>
        <code class="task-path">${ep.path}</code>
        <span class="priority-badge" style="color:${priorityColor(prio)}">${prio}</span>
      </div>
      <p class="task-summary">${ep.summary || ep.description || "No description in spec."}</p>
      <div class="task-meta">${metaParts}</div>
      <div class="task-criteria">
        <b>Acceptance Criteria:</b>
        <ul>${criteria}</ul>
      </div>
      <div class="task-hints">
        <b>Test Hints:</b>
        <table>
          <tr><td>Required params:</td><td>${reqParams}</td></tr>
          ${ep.requestBodyFields.length ? `<tr><td>Body fields:</td><td>${bodyFieldsHtml}</td></tr>` : ""}
          <tr><td>Status codes:</td><td>${ep.statusCodes.join(", ") || "not defined in spec"}</td></tr>
        </table>
      </div>
    </div>`;
  }).join("\n");

  const cleanupCards = deprecatedInTests.map((item, i) => {
    const { endpoint: ep, hits } = item;
    const filesHtml = [...new Set(hits.map((h) => `<code>${rel(h.file)}</code>`))].join(", ");
    return `
    <div class="task-card priority-low cleanup">
      <div class="task-header">
        <span class="task-num">CLEANUP-${String(i+1).padStart(3,"0")}</span>
        <span class="method-badge" style="background:${methodColor(ep.method)}">${ep.method}</span>
        <code class="task-path">${ep.path}</code>
        <span class="dep-tag">deprecated</span>
      </div>
      <p class="task-summary">Remove or update tests for deprecated endpoint. Found in: ${filesHtml}</p>
    </div>`;
  }).join("\n");

  const orphanSection = orphanHits.length > 0 ? `
  <div class="section">
    <h2>Unmatched Hits <span class="count-badge">${orphanHits.length}</span></h2>
    <p class="section-desc">API calls in tests that don't match any spec endpoint.</p>
    <table class="data-table">
      <thead><tr><th>Method</th><th>Path</th><th>File</th><th>Line</th></tr></thead>
      <tbody>
        ${orphanHits.map((h) => `
        <tr>
          <td><span class="method-badge" style="background:${methodColor(h.method)}">${h.method}</span></td>
          <td><code>${h.matchedPath}</code>${h.partial ? ' <span class="badge" style="background:#4a3a1a;color:#fca130">partial</span>' : ''}</td>
          <td><code>${rel(h.file)}</code></td>
          <td>${h.line}</td>
        </tr>`).join("")}
      </tbody>
    </table>
  </div>` : "";

  const filterBtns = [
    `<button class="filter-btn active" data-filter="all" onclick="setFilter('all',this)">All (${total})</button>`,
    `<button class="filter-btn" data-filter="covered" onclick="setFilter('covered',this)">\u2713 Covered (${covered.length})</button>`,
    `<button class="filter-btn" data-filter="uncovered" onclick="setFilter('uncovered',this)">\u2717 Uncovered (${uncovered.length})</button>`,
    `<button class="filter-btn" data-filter="deprecated" onclick="setFilter('deprecated',this)">Deprecated (${deprecated.length})</button>`,
    ...allTags.map((t) => `<button class="filter-btn" data-filter="tag:${t.toLowerCase()}" onclick="setFilter('tag:${t.toLowerCase()}',this)">${t}</button>`),
  ].join("\n      ");

  const specRel = typeof specFile === "string" ? rel(specFile) : specFile.map(rel).join(", ");
  const testsRel = rel(testsDir);

  // TASK-018: Summary data for copy/export
  const summaryText = `Endpoint Coverage: ${pct}% (${covered.length}/${total})\\nUncovered: ${uncovered.length}\\nDeprecated: ${deprecated.length} (${deprecatedInTests.length} still tested)\\nUnmatched: ${orphanHits.length}`;

  const csvData = endpoints.map((ep) => {
    const isCov = covered.includes(ep);
    return `${ep.method},${ep.path},"${ep.tags.join(";")}",${ep.statusCodes.join(";")},${isCov?"Covered":"Uncovered"},${ep.deprecated?"Yes":"No"}`;
  });
  const csvContent = `Method,Path,Tags,StatusCodes,Coverage,Deprecated\\n${csvData.join("\\n")}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>PlaySwag \u2014 API Coverage Report</title>
  <style>
    :root{--bg:#1a1a2e;--surface:#16213e;--surface2:#0f3460;--text:#e0e0e0;--text-muted:#8888aa;--accent:#61affe;--border:#2a2a4a;--covered:#49cc90;--uncovered:#f93e3e;--warning:#fca130}
    [data-theme=light]{--bg:#f8f9fa;--surface:#fff;--surface2:#e9ecef;--text:#212529;--text-muted:#6c757d;--border:#dee2e6}
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.5}
    header{background:var(--surface2);padding:20px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;border-bottom:2px solid var(--accent)}
    header h1{font-size:1.6rem;color:var(--accent)}
    .meta{color:var(--text-muted);font-size:.85rem}
    .theme-btn,.action-btn{background:var(--surface);border:1px solid var(--border);color:var(--text);padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem}
    .action-btn:hover{background:var(--accent);color:#fff}
    .header-actions{display:flex;gap:8px;flex-wrap:wrap}
    main{max-width:1400px;margin:0 auto;padding:24px 20px}
    .summary-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:32px}
    .card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px}
    .card h3{font-size:.8rem;text-transform:uppercase;color:var(--text-muted);letter-spacing:.5px;margin-bottom:8px}
    .card .val{font-size:2rem;font-weight:700}
    .card .sub{font-size:.8rem;color:var(--text-muted);margin-top:4px}
    .progress-bar{height:8px;border-radius:4px;background:var(--surface2);overflow:hidden;margin-top:8px}
    .progress-fill{height:100%;border-radius:4px}
    .section{background:var(--surface);border:1px solid var(--border);border-radius:10px;margin-bottom:24px;overflow:hidden}
    .section>h2{padding:16px 20px;background:var(--surface2);font-size:1.1rem;border-bottom:1px solid var(--border)}
    .section-desc{padding:10px 20px;color:var(--text-muted);font-size:.9rem}
    .filters{padding:12px 20px;display:flex;gap:8px;flex-wrap:wrap;border-bottom:1px solid var(--border)}
    .filter-btn{padding:5px 14px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;font-size:.85rem}
    .filter-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}
    .data-table{width:100%;border-collapse:collapse;font-size:.88rem}
    .data-table th{padding:10px 14px;text-align:left;color:var(--text-muted);font-weight:600;border-bottom:1px solid var(--border);background:var(--surface2);position:sticky;top:0}
    .data-table td{padding:9px 14px;border-bottom:1px solid var(--border)}
    .data-table tr.covered{border-left:3px solid var(--covered)}
    .data-table tr.uncovered{border-left:3px solid var(--uncovered)}
    .data-table tr.deprecated{opacity:.7}
    .table-wrap{overflow-x:auto}
    .method-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-weight:700;font-size:.75rem;color:#fff;letter-spacing:.5px}
    .badge{display:inline-block;padding:2px 7px;border-radius:4px;font-size:.75rem;margin:1px}
    .sc{background:var(--surface2);color:var(--text-muted)}
    .sc-2xx{background:#1a4a2a;color:#49cc90}.sc-4xx{background:#4a1a1a;color:#f93e3e}.sc-5xx{background:#4a3a1a;color:#fca130}
    .covered-badge{color:var(--covered);font-weight:600}
    .uncovered-badge{font-weight:600}
    .dep-tag{display:inline-block;padding:1px 6px;background:#4a3a1a;color:#fca130;border-radius:3px;font-size:.75rem;margin-left:6px}
    .path-cell{font-family:monospace}
    .count-badge{background:var(--surface2);color:var(--text-muted);padding:2px 8px;border-radius:10px;font-size:.8rem;margin-left:8px}
    .tasks-grid{display:grid;gap:16px;padding:20px}
    .task-card{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:16px}
    .task-card.priority-high{border-left:4px solid #f93e3e}
    .task-card.priority-medium{border-left:4px solid #fca130}
    .task-card.priority-low{border-left:4px solid #aaa}
    .task-card.cleanup{border-left:4px solid #fca130}
    .task-header{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px}
    .task-num{font-family:monospace;font-size:.8rem;color:var(--text-muted)}
    .task-path{font-size:.9rem;color:var(--accent)}
    .priority-badge{font-size:.8rem;font-weight:600;margin-left:auto}
    .task-summary{color:var(--text-muted);font-size:.9rem;margin-bottom:12px}
    .task-meta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:10px;font-size:.82rem}
    .meta-item{color:var(--text-muted)}
    .auth-required{color:var(--warning)!important}
    .task-criteria{margin-bottom:10px}
    .task-criteria b,.task-hints b{display:block;margin-bottom:6px;font-size:.88rem;color:var(--text-muted)}
    .task-criteria ul{padding-left:20px;font-size:.87rem}
    .task-criteria li{margin-bottom:3px}
    .task-hints table{font-size:.82rem;border-collapse:collapse}
    .task-hints td{padding:2px 12px 2px 0;color:var(--text-muted)}
    .task-hints td:first-child{color:var(--text);font-weight:600;white-space:nowrap}
    code{font-family:'JetBrains Mono','Fira Code',monospace;font-size:.88em}
    .search-wrap{padding:12px 20px;border-bottom:1px solid var(--border)}
    #search{width:100%;max-width:400px;padding:7px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:.9rem}
    .hidden{display:none!important}
    .tag-bar-row{display:flex;align-items:center;gap:12px;padding:6px 20px}
    .tag-bar-label{min-width:100px;font-size:.85rem;text-align:right}
    .tag-bar-track{flex:1;height:10px;background:var(--surface2);border-radius:5px;overflow:hidden}
    .tag-bar-fill{height:100%;border-radius:5px}
    .tag-bar-pct{min-width:100px;font-size:.82rem;font-weight:600}
    .toast{position:fixed;bottom:24px;right:24px;background:var(--accent);color:#fff;padding:10px 20px;border-radius:8px;font-size:.9rem;opacity:0;transition:opacity .3s;pointer-events:none;z-index:999}
    .toast.show{opacity:1}
    @media print{header .header-actions,.filters,.search-wrap,.theme-btn,.action-btn{display:none!important}.section,.card{break-inside:avoid}body{background:#fff;color:#000}:root{--bg:#fff;--surface:#fff;--surface2:#f0f0f0;--text:#000;--text-muted:#666;--border:#ddd}}
  </style>
</head>
<body>
<header>
  <div>
    <h1>\uD83D\uDD0D PlaySwag Coverage Report</h1>
    <div class="meta">
      \uD83D\uDCC4 Spec: <code>${specRel}</code> &nbsp;|&nbsp;
      \uD83E\uDDEA Tests: <code>${testsRel}</code> &nbsp;|&nbsp;
      \uD83D\uDD52 ${new Date(timestamp).toLocaleString()}
    </div>
  </div>
  <div class="header-actions">
    <button class="action-btn" onclick="copySummary()">Copy Summary</button>
    <button class="action-btn" onclick="exportCSV()">Export CSV</button>
    <button class="action-btn" onclick="window.print()">Print</button>
    <button class="theme-btn" onclick="toggleTheme()">\uD83C\uDF19 Toggle Theme</button>
  </div>
</header>
<main>
  <div class="summary-cards">
    <div class="card">
      <h3>Endpoint Coverage</h3>
      <div class="val" style="color:${coverageColor(pct)}">${pct}%</div>
      <div class="sub">${covered.length} / ${total}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${coverageColor(pct)}"></div></div>
    </div>
    <div class="card">
      <h3>Status Codes</h3>
      <div class="val" style="color:${coverageColor(report.statusCodeCoverage || 0)}">${report.statusCodeCoverage || 0}%</div>
      <div class="sub">assertion-based</div>
    </div>
    <div class="card">
      <h3>Parameters</h3>
      <div class="val" style="color:${coverageColor(report.parameterCoverage || 0)}">${report.parameterCoverage || 0}%</div>
      <div class="sub">name-match</div>
    </div>
    <div class="card">
      <h3>Uncovered</h3>
      <div class="val" style="color:var(--uncovered)">${uncovered.length}</div>
      <div class="sub">${uncovered.filter(e=>!e.deprecated).length} active, ${uncovered.filter(e=>e.deprecated).length} deprecated</div>
    </div>
    <div class="card">
      <h3>Deprecated</h3>
      <div class="val" style="color:var(--warning)">${deprecated.length}</div>
      <div class="sub">${deprecatedInTests.length} still tested</div>
    </div>
    <div class="card">
      <h3>Unmatched</h3>
      <div class="val" style="color:var(--text-muted)">${orphanHits.length}</div>
      <div class="sub">calls not in spec</div>
    </div>
  </div>

  ${tagBars ? `<div class="section">
    <h2>Coverage by Tag</h2>
    <div style="padding:12px 0">${tagBars}</div>
  </div>` : ""}

  <div class="section">
    <h2>All Endpoints <span class="count-badge">${total}</span></h2>
    <div class="filters">${filterBtns}</div>
    <div class="search-wrap">
      <input id="search" type="text" placeholder="Filter by path, method, tags..." oninput="filterSearch(this.value)">
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Method</th><th>Path</th><th>Summary</th><th>Tags</th><th>Status Codes</th><th>Status</th></tr></thead>
        <tbody id="ep-body">${epRows}</tbody>
      </table>
    </div>
  </div>

  ${uncovered.length > 0 ? `
  <div class="section">
    <h2>\uD83D\uDCCB QA Tasks \u2014 Endpoints to Cover <span class="count-badge">${uncovered.length}</span></h2>
    <p class="section-desc">
      Priority: <span style="color:#f93e3e">\u25A0 High</span> (POST/PUT/DELETE/auth) &nbsp;
      <span style="color:#fca130">\u25A0 Medium</span> (GET) &nbsp; <span style="color:#aaa">\u25A0 Low</span> (deprecated).
    </p>
    <div class="tasks-grid">${taskCards}</div>
  </div>` : '<div class="section" style="padding:20px"><h2>\u2705 All endpoints covered!</h2></div>'}

  ${deprecatedInTests.length > 0 ? `
  <div class="section">
    <h2>\uD83E\uDDF9 Cleanup Tasks <span class="count-badge">${deprecatedInTests.length}</span></h2>
    <div class="tasks-grid">${cleanupCards}</div>
  </div>` : ""}

  ${orphanSection}
</main>
<div class="toast" id="toast"></div>
<script>
  function toggleTheme(){const t=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=t;localStorage.setItem('playswag-theme',t);}
  (()=>{const t=localStorage.getItem('playswag-theme')||'dark';if(t==='light')document.documentElement.dataset.theme='light';})();
  let cf='all',sv='';
  function applyFilters(){
    document.querySelectorAll('#ep-body .ep-row').forEach(r=>{
      let show=true;
      if(cf==='covered')show=r.dataset.covered==='true';
      else if(cf==='uncovered')show=r.dataset.covered==='false';
      else if(cf==='deprecated')show=r.dataset.deprecated==='true';
      else if(cf.startsWith('tag:'))show=r.dataset.tags.includes(cf.slice(4));
      if(show&&sv){const t=r.textContent.toLowerCase();show=t.includes(sv.toLowerCase());}
      r.classList.toggle('hidden',!show);
    });
  }
  function setFilter(f,btn){cf=f;document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');applyFilters();}
  function filterSearch(v){sv=v;applyFilters();}
  function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);}
  function copySummary(){navigator.clipboard.writeText("${summaryText}").then(()=>showToast('Summary copied!'));}
  function exportCSV(){const b=new Blob(["${csvContent}"],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='playswag-coverage.csv';a.click();showToast('CSV exported!');}
</script>
</body>
</html>`;
}

// ─── Markdown tasks ───────────────────────────────────────────────────────────

function generateTasks(report) {
  const { specFile, uncovered, deprecatedInTests, orphanHits, endpointCoverage } = report;
  const lines = [
    "# PlaySwag \u2014 QA Automation Tasks", "",
    `**Generated:** ${new Date(report.timestamp).toLocaleString()}`,
    `**Spec:** ${typeof specFile === "string" ? rel(specFile) : specFile.map(rel).join(", ")}`,
    `**Endpoint Coverage:** ${endpointCoverage}% (${report.covered.length}/${report.endpoints.length})`,
    "", "---", "",
  ];

  if (uncovered.length === 0) {
    lines.push("## \u2705 All endpoints are covered!");
  } else {
    lines.push(`## \uD83D\uDCCB Coverage Tasks (${uncovered.length})`, "");
    const sorted = [...uncovered].sort((a, b) => {
      const o = { High: 0, Medium: 1, Low: 2 };
      return o[priority(a)] - o[priority(b)];
    });

    sorted.forEach((ep, i) => {
      const prio = priority(ep);
      const successCode = ep.statusCodes.find((s) => s.startsWith("2")) || "200";
      const hasPathParam = ep.path.includes("{");
      const reqParams = ep.parameters.filter((p) => p.required).map((p) => `\`${p.name}\` (${p.in})`).join(", ") || "none";
      const bodyFields = ep.requestBodyFields.slice(0, 8).map((f) => `\`${f}\``).join(", ") || "none";

      lines.push(
        `### TASK-${String(i+1).padStart(3,"0")}: Cover \`${ep.method} ${ep.path}\``, "",
        "| Field | Value |", "|-------|-------|",
        `| **Priority** | ${prio} |`,
        `| **Endpoint** | \`${ep.method} ${ep.path}\` |`,
        `| **OperationId** | \`${ep.operationId || "N/A"}\` |`,
        `| **Tags** | ${ep.tags.join(", ") || "\u2014"} |`,
        `| **Auth required** | ${ep.authRequired ? "Yes \uD83D\uDD10" : "No"} |`,
        `| **Summary** | ${ep.summary || "\u2014"} |`, "",
        "**Acceptance Criteria:**",
        `- [ ] Happy path \u2192 \`${successCode}\``,
        ...(["POST","PUT","PATCH"].includes(ep.method) ? ["- [ ] Invalid input \u2192 400/422"] : []),
        ...(ep.authRequired ? ["- [ ] Unauthenticated \u2192 401", "- [ ] Forbidden \u2192 403"] : []),
        ...(hasPathParam ? ["- [ ] Not found \u2192 404"] : []),
        ...(ep.method === "DELETE" ? ["- [ ] Idempotency \u2014 double DELETE \u2192 404 or 204"] : []),
        ...(ep.parameters.some((p) => p.required) ? ["- [ ] Missing required param \u2192 400"] : []),
        "", "**Test Hints:**",
        `- Required params: ${reqParams}`,
        ...(ep.requestBodyFields.length ? [`- Body fields: ${bodyFields}`] : []),
        `- Status codes in spec: ${ep.statusCodes.join(", ") || "not defined"}`, "", "---", "",
      );
    });
  }

  if (deprecatedInTests.length > 0) {
    lines.push(`## \uD83E\uDDF9 Cleanup Tasks (${deprecatedInTests.length})`, "");
    deprecatedInTests.forEach(({ endpoint: ep, hits }, i) => {
      const files = [...new Set(hits.map((h) => rel(h.file)))].join(", ");
      lines.push(
        `### CLEANUP-${String(i+1).padStart(3,"0")}: \`${ep.method} ${ep.path}\``, "",
        `- **Found in:** ${files}`,
        "- [ ] Identify replacement endpoint",
        "- [ ] Update or remove test references", "", "---", "",
      );
    });
  }

  if (orphanHits.length > 0) {
    lines.push(`## \u26A0\uFE0F Unmatched Calls (${orphanHits.length})`, "");
    lines.push("| Method | Path | File |", "|--------|------|------|");
    const seen = new Set();
    for (const h of orphanHits.slice(0, 30)) {
      const key = `${h.method}:${h.matchedPath}`;
      if (!seen.has(key)) { seen.add(key); lines.push(`| \`${h.method}\` | \`${h.matchedPath}\` | ${rel(h.file)} |`); }
    }
  }

  return lines.join("\n");
}

// ─── JUnit XML (TASK-017) ─────────────────────────────────────────────────────

function generateJunit(report) {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const total = report.endpoints.length;
  const failures = report.uncovered.length;
  const tests = total;

  const cases = report.endpoints.map((ep) => {
    const isCov = report.covered.includes(ep);
    const name = `${ep.method} ${ep.path}`;
    if (isCov) {
      return `    <testcase classname="playswag" name="${esc(name)}" time="0"/>`;
    }
    return `    <testcase classname="playswag" name="${esc(name)}" time="0">
      <failure message="Endpoint not covered by tests" type="UNCOVERED">${esc(name)} has no test coverage. Priority: ${priority(ep)}</failure>
    </testcase>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="PlaySwag API Coverage" tests="${tests}" failures="${failures}" errors="0" time="0" timestamp="${report.timestamp}">
${cases.join("\n")}
</testsuite>`;
}

// ─── SVG badge ────────────────────────────────────────────────────────────────

function generateBadge(pct) {
  const color = pct >= 80 ? "#4c1" : pct >= 50 ? "#dfb317" : "#e05d44";
  const label = "API coverage";
  const value = `${pct}%`;
  const lw = label.length * 6.5 + 10;
  const vw = value.length * 7.5 + 10;
  const w = lw + vw;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="20" role="img" aria-label="${label}: ${value}">`,
    `<linearGradient id="s"><stop offset="0" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>`,
    `<clipPath id="r"><rect width="${w}" height="20" rx="3" fill="#fff"/></clipPath>`,
    `<g clip-path="url(#r)">`,
    `<rect width="${lw}" height="20" fill="#555"/>`,
    `<rect x="${lw}" width="${vw}" height="20" fill="${color}"/>`,
    `<rect width="${w}" height="20" fill="url(#s)"/>`,
    `</g>`,
    `<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">`,
    `<text x="${lw / 2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>`,
    `<text x="${lw / 2}" y="14">${label}</text>`,
    `<text x="${lw + vw / 2}" y="15" fill="#010101" fill-opacity=".3">${value}</text>`,
    `<text x="${lw + vw / 2}" y="14">${value}</text>`,
    `</g></svg>`,
  ].join("");
}

// ─── Coverage history (TASK-013) ──────────────────────────────────────────────

function loadHistory(outDir) {
  const p = path.join(outDir, "playswag-history.json");
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return []; }
}

function saveHistory(outDir, entry, maxEntries = 50) {
  const history = loadHistory(outDir);
  history.push(entry);
  while (history.length > maxEntries) history.shift();
  fs.writeFileSync(path.join(outDir, "playswag-history.json"), JSON.stringify(history, null, 2), "utf8");
  return history;
}

function formatDelta(current, previous) {
  if (previous == null) return "";
  const diff = current - previous;
  if (diff === 0) return " (\u2192 0)";
  return diff > 0 ? ` (\u2191 +${diff.toFixed(1)}%)` : ` (\u2193 ${diff.toFixed(1)}%)`;
}

// ─── Auto-detect tests dir ────────────────────────────────────────────────────

function findTestsDir(specFile) {
  const specDir = path.dirname(path.resolve(specFile));
  const candidates = [
    path.join(specDir, "tests"), path.join(specDir, "test"), path.join(specDir, "e2e"),
    path.join(specDir, "__tests__"), path.join(specDir, "specs"),
    path.join(process.cwd(), "tests"), path.join(process.cwd(), "test"),
    path.join(process.cwd(), "e2e"), path.join(process.cwd(), "__tests__"),
    path.join(process.cwd(), "specs"), process.cwd(),
  ];
  return candidates.find((d) => fs.existsSync(d)) || process.cwd();
}

// ─── CLI arg parser ───────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    specFiles: [], testsDir: null, failUnder: null, outDir: null, formats: null,
    include: null, exclude: null, includeTags: null, excludeTags: null, history: false,
  };
  let foundSep = false;
  const beforeSep = [];
  const afterSep = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") { foundSep = true; continue; }
    if (a === "--fail-under" && i + 1 < argv.length) { opts.failUnder = parseFloat(argv[++i]); }
    else if ((a === "--output" || a === "-o") && i + 1 < argv.length) { opts.outDir = argv[++i]; }
    else if (a === "--format" && i + 1 < argv.length) { opts.formats = argv[++i].split(",").map((s) => s.trim().toLowerCase()); }
    else if (a === "--json-only") { opts.formats = ["json"]; }
    else if (a === "--include" && i + 1 < argv.length) { opts.include = argv[++i].split(",").map((s) => s.trim()); }
    else if (a === "--exclude" && i + 1 < argv.length) { opts.exclude = argv[++i].split(",").map((s) => s.trim()); }
    else if (a === "--include-tags" && i + 1 < argv.length) { opts.includeTags = argv[++i].split(",").map((s) => s.trim().toLowerCase()); }
    else if (a === "--exclude-tags" && i + 1 < argv.length) { opts.excludeTags = argv[++i].split(",").map((s) => s.trim().toLowerCase()); }
    else if (a === "--history") { opts.history = true; }
    else if (!a.startsWith("-")) { if (foundSep) afterSep.push(a); else beforeSep.push(a); }
  }

  if (foundSep) {
    opts.specFiles = beforeSep;
    opts.testsDir = afterSep[0] || null;
  } else {
    opts.specFiles = beforeSep.length > 0 ? [beforeSep[0]] : [];
    opts.testsDir = beforeSep[1] || null;
  }
  return opts;
}

const ALL_FORMATS = ["html", "json", "tasks", "badge", "junit"];

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.specFiles.length) {
    console.error(
      "Usage: node analyze.js <spec-file> [tests-dir] [options]\n" +
      "       node analyze.js spec1.yaml spec2.yaml -- tests/ [options]\n\n" +
      "Options:\n" +
      "  --fail-under <pct>        Exit 1 if endpoint coverage < pct\n" +
      "  --output, -o <dir>        Output directory (default: ./playswag-report)\n" +
      "  --format <list>           Comma-separated: html,json,tasks,badge,junit (default: all)\n" +
      "  --json-only               Shorthand for --format json\n" +
      "  --include <patterns>      Only analyze matching paths (comma-sep, wildcard *)\n" +
      "  --exclude <patterns>      Skip matching paths\n" +
      "  --include-tags <tags>     Only analyze endpoints with these tags\n" +
      "  --exclude-tags <tags>     Skip endpoints with these tags\n" +
      "  --history                 Append to playswag-history.json"
    );
    process.exit(1);
  }

  // TASK-005: Load and merge multiple specs
  let allEndpoints = [];
  let allBasePaths = [];
  const specFiles = [];
  for (const sf of opts.specFiles) {
    const specFile = isUrl(sf) ? sf : path.resolve(sf);
    if (!isUrl(sf) && !fs.existsSync(specFile)) {
      console.error(`ERROR: Spec file not found: ${specFile}`);
      process.exit(2);
    }
    specFiles.push(specFile);

    let specData;
    try { specData = loadSpec(specFile); } catch (e) { console.error(`ERROR: ${e.message}`); process.exit(2); }
    specData = resolveRefs(specData);
    const bp = extractBasePaths(specData);
    allBasePaths.push(...bp);
    const eps = parseSpec(specData);

    // De-duplicate by method+path
    for (const ep of eps) {
      const key = `${ep.method}:${ep.path}`;
      if (allEndpoints.some((e) => `${e.method}:${e.path}` === key)) {
        console.log(`   Warning: duplicate endpoint ${key} (from ${typeof specFile === "string" ? rel(specFile) : specFile})`);
      } else {
        allEndpoints.push(ep);
      }
    }
  }
  allBasePaths = [...new Set(allBasePaths)];

  const testsDir = opts.testsDir ? path.resolve(opts.testsDir) : findTestsDir(specFiles[0]);
  const formats = new Set(opts.formats || ALL_FORMATS);

  console.log("\n\uD83D\uDD0D PlaySwag Analyzer (JS)");
  console.log(`   Spec:  ${specFiles.map((s) => isUrl(s) ? s : rel(s)).join(", ")}`);
  console.log(`   Tests: ${testsDir}`);
  console.log(`   Base paths: ${allBasePaths.length ? allBasePaths.join(", ") : "(none)"}`);

  // TASK-008: Filter endpoints
  const { endpoints, ignored } = filterEndpoints(allEndpoints, opts);
  if (ignored.length) console.log(`   Filtered out: ${ignored.length} endpoints`);
  console.log(`   Endpoints: ${endpoints.length}`);

  console.log("\uD83E\uDDEA Scanning test files...");
  const testFiles = findTestFiles(testsDir);
  console.log(`   Found ${testFiles.length} test files`);

  const allHits = testFiles.flatMap((f) => scanTestFile(f));
  console.log(`   Found ${allHits.length} API call patterns`);

  const cov = calculateCoverage(endpoints, allHits, allBasePaths, testFiles);
  const deprecated = endpoints.filter((ep) => ep.deprecated);

  const report = {
    specFile: specFiles.length === 1 ? specFiles[0] : specFiles,
    testsDir, timestamp: new Date().toISOString(),
    endpoints, testHits: allHits,
    covered: cov.covered, uncovered: cov.uncovered,
    deprecated, deprecatedInTests: cov.deprecatedInTests,
    orphanHits: cov.orphanHits,
    endpointCoverage: cov.endpointCoverage,
    statusCodeCoverage: cov.statusCodeCoverage,
    parameterCoverage: cov.parameterCoverage,
    coverageByTag: cov.coverageByTag,
  };

  const outDir = opts.outDir ? path.resolve(opts.outDir) : path.join(process.cwd(), "playswag-report");
  fs.mkdirSync(outDir, { recursive: true });

  const written = [];
  if (formats.has("html")) {
    const p = path.join(outDir, "report.html");
    fs.writeFileSync(p, generateHTML(report), "utf8");
    written.push(`HTML:    ${p}`);
  }
  if (formats.has("tasks")) {
    const p = path.join(outDir, "tasks.md");
    fs.writeFileSync(p, generateTasks(report), "utf8");
    written.push(`Tasks:   ${p}`);
  }
  if (formats.has("badge")) {
    const p = path.join(outDir, "playswag-badge.svg");
    fs.writeFileSync(p, generateBadge(cov.endpointCoverage), "utf8");
    written.push(`Badge:   ${p}`);
  }
  if (formats.has("junit")) {
    const p = path.join(outDir, "playswag-junit.xml");
    fs.writeFileSync(p, generateJunit(report), "utf8");
    written.push(`JUnit:   ${p}`);
  }

  const summary = {
    timestamp: report.timestamp,
    specFiles: Array.isArray(report.specFile) ? report.specFile : [report.specFile],
    testsDir: report.testsDir,
    basePaths: allBasePaths,
    totalEndpoints: endpoints.length,
    coveredEndpoints: cov.covered.length,
    uncoveredEndpoints: cov.uncovered.length,
    deprecatedEndpoints: deprecated.length,
    deprecatedInTests: cov.deprecatedInTests.length,
    orphanHits: cov.orphanHits.length,
    endpointCoverage: cov.endpointCoverage,
    statusCodeCoverage: cov.statusCodeCoverage,
    parameterCoverage: cov.parameterCoverage,
    coverageByTag: cov.coverageByTag,
    taskCount: cov.uncovered.length + cov.deprecatedInTests.length,
    uncoveredList: cov.uncovered.map((ep) => ({
      method: ep.method, path: ep.path,
      priority: priority(ep), tags: ep.tags, operationId: ep.operationId,
    })),
  };
  if (ignored.length) {
    summary.ignoredEndpoints = ignored.length;
  }
  if (formats.has("json")) {
    const p = path.join(outDir, "summary.json");
    fs.writeFileSync(p, JSON.stringify(summary, null, 2), "utf8");
    written.push(`Summary: ${p}`);
  }

  // TASK-013: History
  let delta = "";
  if (opts.history) {
    const history = saveHistory(outDir, {
      timestamp: report.timestamp,
      endpointCoverage: cov.endpointCoverage,
      statusCodeCoverage: cov.statusCodeCoverage,
      parameterCoverage: cov.parameterCoverage,
      totalEndpoints: endpoints.length,
      coveredEndpoints: cov.covered.length,
    });
    if (history.length >= 2) {
      const prev = history[history.length - 2];
      delta = formatDelta(cov.endpointCoverage, prev.endpointCoverage);
    }
    written.push(`History: ${path.join(outDir, "playswag-history.json")}`);
  }

  console.log(`\n\uD83D\uDCCA Coverage:`);
  console.log(`   Endpoint Coverage:  ${cov.endpointCoverage}% (${cov.covered.length}/${endpoints.length})${delta}`);
  console.log(`   Status Code:        ${cov.statusCodeCoverage}%`);
  console.log(`   Parameter:          ${cov.parameterCoverage}%`);
  console.log(`   Uncovered:          ${cov.uncovered.length}`);
  console.log(`   Deprecated:         ${deprecated.length} (${cov.deprecatedInTests.length} still tested)`);
  console.log(`   Unmatched hits:     ${cov.orphanHits.length}`);
  console.log(`   Tasks created:      ${summary.taskCount}`);

  if (Object.keys(cov.coverageByTag).length > 1) {
    console.log(`\n   Coverage by tag:`);
    for (const [tag, data] of Object.entries(cov.coverageByTag).sort((a, b) => a[1].pct - b[1].pct)) {
      console.log(`     ${tag}: ${data.pct}% (${data.covered}/${data.total})`);
    }
  }

  if (written.length) {
    console.log(`\n\uD83D\uDCC1 Output:`);
    for (const line of written) console.log(`   ${line}`);
  }

  if (opts.failUnder != null) {
    if (cov.endpointCoverage < opts.failUnder) {
      console.log(`\n\u274C FAIL: Endpoint coverage ${cov.endpointCoverage}% < threshold ${opts.failUnder}%`);
      process.exit(1);
    }
    console.log(`\n\u2705 PASS: Endpoint coverage ${cov.endpointCoverage}% >= threshold ${opts.failUnder}%`);
  }
}

main();
