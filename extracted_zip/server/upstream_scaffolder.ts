/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * Tags: #NoExploitRobot #NoExploitAlbert
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * Upstream Sync: github.com/AlbertLaneDevice/Joules-Supply-Chain (Master Ledger)
 * Framework Spec: JOULES-SUPPLY-CHAIN-CONJECTURE-2026 / SAFD-SPEC-01 / RFC 0103
 * ============================================================================== */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const PROVENANCE_HEADER_JS = `/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * Tags: #NoExploitRobot #NoExploitAlbert
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * Upstream Sync: github.com/AlbertLaneDevice/Joules-Supply-Chain (Master Ledger)
 * Framework Spec: JOULES-SUPPLY-CHAIN-CONJECTURE-2026 / SAFD-SPEC-01 / RFC 0103
 * ============================================================================== */\n\n`;

const PROVENANCE_HEADER_HASH = `# ==============================================================================
# PROVENANCE METADATA (.lvm / .lane v1.0)
# Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
# Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
# Tags: #NoExploitRobot #NoExploitAlbert
# License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
# Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
# Authority: https://provenance.albertlane.net/.provenance.jsonld
# Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
# Upstream Sync: github.com/AlbertLaneDevice/Joules-Supply-Chain (Master Ledger)
# Framework Spec: JOULES-SUPPLY-CHAIN-CONJECTURE-2026 / SAFD-SPEC-01 / RFC 0103
# ==============================================================================\n\n`;

const PROVENANCE_HEADER_XML = `<!-- ==============================================================================
  PROVENANCE METADATA (.lvm / .lane v1.0)
  Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
  Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
  Tags: #NoExploitRobot #NoExploitAlbert
  License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
  Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
  Authority: https://provenance.albertlane.net/.provenance.jsonld
  Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
  Upstream Sync: github.com/AlbertLaneDevice/Joules-Supply-Chain (Master Ledger)
  Framework Spec: JOULES-SUPPLY-CHAIN-CONJECTURE-2026 / SAFD-SPEC-01 / RFC 0103
============================================================================== -->\n\n`;

function stripOldProvenanceHeader(content: string): string {
  // Regex to remove existing PROVENANCE METADATA block if present at top
  return content
    .replace(/^\/\* ==============================================================================\n \* PROVENANCE METADATA[\s\S]*?\* ============================================================================== \*\/\n\n?/, '')
    .replace(/^# ==============================================================================\n# PROVENANCE METADATA[\s\S]*?# ==============================================================================\n\n?/, '')
    .replace(/^<!-- ==============================================================================\n[\s\S]*?PROVENANCE METADATA[\s\S]*?============================================================================== -->\n\n?/, '');
}

export function applyUpstreamProvenance(rootDir: string = process.cwd()): { updated: string[]; hashes: Record<string, string> } {
  const updated: string[] = [];
  const hashes: Record<string, string> = {};

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (['node_modules', '.git', 'dist', '.vite'].includes(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        let header: string | null = null;
        if (['.ts', '.tsx', '.js', '.jsx', '.css', '.jsonc', '.rs'].includes(ext)) {
          header = PROVENANCE_HEADER_JS;
        } else if (['.py', '.sh', '.yaml', '.yml', '.env', '.toml', '.txt', '.md'].includes(ext) || entry.name.endsWith('.env.example') || entry.name === 'CODEOWNERS') {
          header = PROVENANCE_HEADER_HASH;
        } else if (['.html', '.xml', '.svg'].includes(ext)) {
          header = PROVENANCE_HEADER_XML;
        }

        if (header) {
          try {
            const rawContent = fs.readFileSync(fullPath, 'utf8');
            if (!rawContent.includes('#NoExploitRobot') || !rawContent.includes('#NoExploitAlbert')) {
              const cleanedContent = stripOldProvenanceHeader(rawContent);
              fs.writeFileSync(fullPath, header + cleanedContent, 'utf8');
              updated.push(fullPath);
            }
            const finalBuf = fs.readFileSync(fullPath);
            const sha256 = crypto.createHash('sha256').update(finalBuf).digest('hex');
            hashes[path.relative(rootDir, fullPath)] = sha256;
          } catch (e) {
            // Binary or unreadable
          }
        }
      }
    }
  }

  walk(rootDir);

  // Update SCAFFOLD-MANIFEST.sha256.txt with complete verification of repository and engine files
  const manifestPath = path.join(rootDir, 'Joules-Supply-Chain', 'SCAFFOLD-MANIFEST.sha256.txt');
  if (fs.existsSync(manifestPath)) {
    const lines = Object.entries(hashes).map(([rel, h]) => `${h}  ${rel}`);
    fs.writeFileSync(manifestPath, PROVENANCE_HEADER_HASH + lines.join('\n') + '\n', 'utf8');
    updated.push(manifestPath);
  }

  return { updated, hashes };
}

if (process.argv[1] && process.argv[1].endsWith('upstream_scaffolder.ts')) {
  const result = applyUpstreamProvenance();
  console.log(`Applied upstream provenance to ${result.updated.length} files. Total checksums: ${Object.keys(result.hashes).length}`);
}
