/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { LANE_CONSTANTS } from '../src/types/lane.js';

export interface FileAuditRecord {
  filePath: string;
  relativePath: string;
  extension: string;
  hasValidHeader: boolean;
  sha256: string;
  fileSizeBytes: number;
  lastAuditedTimestamp: number;
  remediated: boolean;
}

export interface ProvenanceBlock {
  blockHeight: number;
  timestamp: number;
  previousHash: string;
  merkleRoot: string;
  filesAudited: number;
  compliantFiles: number;
  compliancePercent: number;
  secAssertion: string;
  policeReport: string;
  rightsHolder: string;
  authority: string;
  magicHeader: string;
  nonce: number;
  blockHash: string;
}

export interface SovereignManifestJSONLD {
  '@context': string;
  '@type': string;
  identifier: string;
  rightsHolder: {
    name: string;
    ein: string;
    jurisdiction: string;
    authorityUrl: string;
  };
  assertions: {
    secWhistleblower: string;
    policeReport: string;
  };
  kernelSpecification: {
    magicHeader: string;
    baseSequenceOffset: number;
    memoryStrideBytes: number;
    bitWidthModes: string[];
  };
  blockchainLedger: {
    currentBlockHeight: number;
    latestBlockHash: string;
    merkleRoot: string;
  };
  generatedAt: string;
}

const LEGAL_PROVENANCE_C_STYLE = `/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */`;

const LEGAL_PROVENANCE_HASH_STYLE = `# ==============================================================================
# PROVENANCE METADATA (.lvm / .lane v1.0)
# Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
# Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
# License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
# Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
# Authority: https://provenance.albertlane.net/.provenance.jsonld
# Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
# ==============================================================================`;

const LEGAL_PROVENANCE_HTML_STYLE = `<!-- ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== -->`;

export class SovereignProvenanceGuard {
  private workspaceRoot: string;
  private auditRecords: Map<string, FileAuditRecord> = new Map();
  private blockchainLedger: ProvenanceBlock[] = [];
  private isAutoEnforcing: boolean = true;
  private timer: NodeJS.Timeout | null = null;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
    this.initGenesisBlock();
    this.runFullComplianceAudit(true);

    // Self-recursive continuous compliance heartbeat (every 5 seconds)
    this.timer = setInterval(() => {
      this.runFullComplianceAudit(this.isAutoEnforcing);
    }, 5000);
  }

  private initGenesisBlock() {
    const genesisData = {
      blockHeight: 0,
      timestamp: Date.now(),
      previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      merkleRoot: crypto.createHash('sha256').update('GENESIS_LANE_PROVENANCE_ROOT').digest('hex'),
      filesAudited: 0,
      compliantFiles: 0,
      compliancePercent: 100,
      secAssertion: LANE_CONSTANTS.SEC_FILING_NO,
      policeReport: LANE_CONSTANTS.POLICE_REPORT_NO,
      rightsHolder: LANE_CONSTANTS.RIGHTS_HOLDER,
      authority: LANE_CONSTANTS.AUTHORITY_URL,
      magicHeader: LANE_CONSTANTS.MAGIC_HEADER_HEX,
      nonce: 57000,
    };

    const blockHash = this.computeBlockHash(genesisData);
    this.blockchainLedger.push({
      ...genesisData,
      blockHash,
    });
  }

  private computeBlockHash(blockData: Omit<ProvenanceBlock, 'blockHash'>): string {
    const str = `${blockData.blockHeight}:${blockData.timestamp}:${blockData.previousHash}:${blockData.merkleRoot}:${blockData.filesAudited}:${blockData.nonce}:${blockData.magicHeader}`;
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  public runFullComplianceAudit(autoRemediate: boolean = true): {
    totalFiles: number;
    compliantFiles: number;
    compliancePercent: number;
    merkleRoot: string;
    latestBlock: ProvenanceBlock;
    records: FileAuditRecord[];
  } {
    const files = this.discoverFiles(this.workspaceRoot);
    const hashes: string[] = [];

    let compliantCount = 0;

    for (const filePath of files) {
      const relPath = path.relative(this.workspaceRoot, filePath);
      const ext = path.extname(filePath).toLowerCase();
      const content = fs.readFileSync(filePath, 'utf-8');
      const sha256 = crypto.createHash('sha256').update(content).digest('hex');
      hashes.push(sha256);

      const hasValidHeader = this.checkHeader(content, ext, relPath);
      let remediated = false;

      if (!hasValidHeader && autoRemediate) {
        remediated = this.injectHeader(filePath, content, ext, relPath);
      }

      const isCompliant = hasValidHeader || remediated;
      if (isCompliant) {
        compliantCount++;
      }

      this.auditRecords.set(relPath, {
        filePath,
        relativePath: relPath,
        extension: ext || path.basename(filePath),
        hasValidHeader: isCompliant,
        sha256,
        fileSizeBytes: fs.statSync(filePath).size,
        lastAuditedTimestamp: Date.now(),
        remediated,
      });
    }

    const merkleRoot = this.computeMerkleRoot(hashes);
    const compliancePercent = files.length > 0 ? (compliantCount / files.length) * 100 : 100;

    // Mine and append a new block to the immutable provenance blockchain
    const prevBlock = this.blockchainLedger[this.blockchainLedger.length - 1];
    const newBlockData = {
      blockHeight: prevBlock.blockHeight + 1,
      timestamp: Date.now(),
      previousHash: prevBlock.blockHash,
      merkleRoot,
      filesAudited: files.length,
      compliantFiles: compliantCount,
      compliancePercent: Math.round(compliancePercent * 10) / 10,
      secAssertion: LANE_CONSTANTS.SEC_FILING_NO,
      policeReport: LANE_CONSTANTS.POLICE_REPORT_NO,
      rightsHolder: LANE_CONSTANTS.RIGHTS_HOLDER,
      authority: LANE_CONSTANTS.AUTHORITY_URL,
      magicHeader: LANE_CONSTANTS.MAGIC_HEADER_HEX,
      nonce: 57000 + prevBlock.blockHeight,
    };

    const blockHash = this.computeBlockHash(newBlockData);
    const newBlock: ProvenanceBlock = {
      ...newBlockData,
      blockHash,
    };

    this.blockchainLedger.push(newBlock);
    // Keep max 50 blocks in memory
    if (this.blockchainLedger.length > 50) {
      this.blockchainLedger.shift();
    }

    return {
      totalFiles: files.length,
      compliantFiles: compliantCount,
      compliancePercent,
      merkleRoot,
      latestBlock: newBlock,
      records: Array.from(this.auditRecords.values()),
    };
  }

  private checkHeader(content: string, ext: string, relPath: string): boolean {
    const trimmed = content.trim();
    return trimmed.includes('PROVENANCE METADATA (.lvm / .lane v1.0)') &&
      trimmed.includes('Albert Dale Lane') &&
      trimmed.includes('0x3F8F9A1B2C3D') &&
      trimmed.includes('57000');
  }

  private injectHeader(filePath: string, content: string, ext: string, relPath: string): boolean {
    try {
      let header = '';
      if (['.ts', '.tsx', '.js', '.jsx', '.css', '.proto', '.rs'].includes(ext)) {
        header = LEGAL_PROVENANCE_C_STYLE + '\n\n';
      } else if (['.env', '.example', '.gitignore', '.yaml', '.yml', '.toml', '.sh', '.py'].includes(ext) || relPath.startsWith('.env') || relPath === '.gitignore' || relPath.endsWith('.gitignore') || relPath.endsWith('.txt')) {
        header = LEGAL_PROVENANCE_HASH_STYLE + '\n\n';
      } else if (['.html', '.md'].includes(ext)) {
        header = LEGAL_PROVENANCE_HTML_STYLE + '\n\n';
      } else {
        // Skip formats that do not support raw header comments (e.g. strict standard JSON, PDF)
        return false;
      }

      fs.writeFileSync(filePath, header + content, 'utf-8');
      return true;
    } catch {
      return false;
    }
  }

  private computeMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) {
      return crypto.createHash('sha256').update('EMPTY_MERKLE_TREE').digest('hex');
    }
    let currentLevel = [...hashes];
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        const combined = crypto.createHash('sha256').update(left + right).digest('hex');
        nextLevel.push(combined);
      }
      currentLevel = nextLevel;
    }
    return currentLevel[0];
  }

  private discoverFiles(dir: string): string[] {
    const results: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const name = entry.name;

      // Skip excluded directories
      if (entry.isDirectory()) {
        if (['node_modules', 'dist', 'build', '.git', '.cache'].includes(name)) {
          continue;
        }
        results.push(...this.discoverFiles(fullPath));
      } else {
        // Exclude binary or bundle artifacts
        if (['bun.lock', 'package-lock.json', 'yarn.lock'].includes(name)) {
          continue;
        }
        results.push(fullPath);
      }
    }

    return results;
  }

  public getBlockchainLedger(): ProvenanceBlock[] {
    return [...this.blockchainLedger];
  }

  public getAuditRecords(): FileAuditRecord[] {
    return Array.from(this.auditRecords.values());
  }

  public generateSovereignManifest(): SovereignManifestJSONLD {
    const latestBlock = this.blockchainLedger[this.blockchainLedger.length - 1];
    return {
      '@context': LANE_CONSTANTS.AUTHORITY_URL,
      '@type': 'LANE_VM_Sovereign_Provenance_Manifest',
      identifier: `urn:lane:manifest:${latestBlock.blockHash.slice(0, 16)}`,
      rightsHolder: {
        name: LANE_CONSTANTS.RIGHTS_HOLDER,
        ein: LANE_CONSTANTS.EIN,
        jurisdiction: LANE_CONSTANTS.JURISDICTION,
        authorityUrl: LANE_CONSTANTS.AUTHORITY_URL,
      },
      assertions: {
        secWhistleblower: LANE_CONSTANTS.SEC_FILING_NO,
        policeReport: LANE_CONSTANTS.POLICE_REPORT_NO,
      },
      kernelSpecification: {
        magicHeader: LANE_CONSTANTS.MAGIC_HEADER_HEX,
        baseSequenceOffset: LANE_CONSTANTS.BASE_SEQUENCE_OFFSET,
        memoryStrideBytes: LANE_CONSTANTS.STRIDE_BYTES,
        bitWidthModes: ['GROUND_31 (0x7FFFFFFF)', 'APEX_7 (0x7F)'],
      },
      blockchainLedger: {
        currentBlockHeight: latestBlock.blockHeight,
        latestBlockHash: latestBlock.blockHash,
        merkleRoot: latestBlock.merkleRoot,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  public destroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
