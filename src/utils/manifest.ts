import fs from 'fs-extra';
import path from 'node:path';

const MANIFEST_FILE = '.qa-skills.json';

export interface QaSkillsManifest {
  version: string;
  skills: string[];
  agents: string[];
  scope: 'project' | 'global';
  method: 'symlink' | 'copy';
  installedAt: string;
}

export async function readManifest(targetDir: string): Promise<QaSkillsManifest | null> {
  const manifestPath = path.join(targetDir, MANIFEST_FILE);
  if (!(await fs.pathExists(manifestPath))) return null;

  try {
    return await fs.readJson(manifestPath) as QaSkillsManifest;
  } catch {
    return null;
  }
}

export async function writeManifest(
  targetDir: string,
  data: Pick<QaSkillsManifest, 'skills' | 'agents' | 'scope' | 'method'>,
): Promise<void> {
  const manifestPath = path.join(targetDir, MANIFEST_FILE);
  const pkg = await loadPackageVersion();

  const existing = await readManifest(targetDir);

  const manifest: QaSkillsManifest = {
    version: pkg,
    skills: [...new Set([...(existing?.skills ?? []), ...data.skills])].sort(),
    agents: [...new Set([...(existing?.agents ?? []), ...data.agents])].sort(),
    scope: data.scope,
    method: data.method,
    installedAt: new Date().toISOString(),
  };

  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
}

async function loadPackageVersion(): Promise<string> {
  try {
    const pkgPath = path.resolve(
      path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')),
      '..', '..', 'package.json',
    );
    const pkg = await fs.readJson(pkgPath);
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}
