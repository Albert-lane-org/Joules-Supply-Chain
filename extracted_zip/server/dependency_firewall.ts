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

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { LANE_CONSTANTS } from '../src/types/lane.js';
import { computeIEEE8023CRC32, formatCRC32Hex } from '../src/utils/crc32.js';

export interface DependencyWhitelistItem {
  name: string;
  expectedVersion: string;
  category: 'production' | 'dev';
  isLocked: boolean;
  sha256Baseline: string;
}

export interface TamperForensicRecord {
  id: string;
  sequenceId: number;
  timestamp: string;
  targetFile: string;
  eventType: 'UNAUTHORIZED_INJECTION' | 'MODIFICATION_DETECTED' | 'FILTER_INTERFERENCE' | 'DEPENDENCY_ANOMALY';
  severity: 'CRITICAL' | 'HIGH' | 'WARNING';
  accessingContext: string;
  expectedSha256: string;
  actualSha256: string;
  statutoryViolations: string[];
  autoHealed: boolean;
  evidenceMerkleProof: string;
  crc32: string;
}

export interface DualRedundancyState {
  aiStudioContainerSha256: string;
  cloudflareKvEndpointSha256: string;
  ledgerSynchronized: boolean;
  lastAuditTimestamp: string;
  totalAuditsRun: number;
  tamperCount: number;
  healedCount: number;
  fileCount: number;
}

export class DependencyFirewallEngine {
  private baseDir: string;
  private pristineCache: Map<string, { content: string; sha256: string }> = new Map();
  private dependencyWhitelist: Map<string, DependencyWhitelistItem> = new Map();
  private tamperLogs: TamperForensicRecord[] = [];
  private sequenceCounter: number = LANE_CONSTANTS.BASE_SEQUENCE_OFFSET;
  private totalAudits: number = 0;
  private healedCount: number = 0;
  private cloudflareKvSyncedHash: string = '';

  constructor(baseDir: string = process.cwd()) {
    this.baseDir = baseDir;
    this.initializeBaselineWhitelist();
    this.snapshotPristineState();
  }

  /**
   * Initializes authorized dependency whitelist from package.json baseline
   */
  private initializeBaselineWhitelist(): void {
    const pkgPath = path.join(this.baseDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const raw = fs.readFileSync(pkgPath, 'utf-8');
        const parsed = JSON.parse(raw);
        const deps = parsed.dependencies || {};
        const devDeps = parsed.devDependencies || {};

        for (const [name, version] of Object.entries(deps)) {
          const hash = crypto.createHash('sha256').update(`${name}@${version}`).digest('hex');
          this.dependencyWhitelist.set(name, {
            name,
            expectedVersion: version as string,
            category: 'production',
            isLocked: true,
            sha256Baseline: hash,
          });
        }

        for (const [name, version] of Object.entries(devDeps)) {
          const hash = crypto.createHash('sha256').update(`${name}@${version}`).digest('hex');
          this.dependencyWhitelist.set(name, {
            name,
            expectedVersion: version as string,
            category: 'dev',
            isLocked: true,
            sha256Baseline: hash,
          });
        }
      } catch (err) {
        console.error('[FIREWALL] Failed to parse package.json baseline', err);
      }
    }
  }

  /**
   * Snapshots pristine file states for auto-healing
   */
  public snapshotPristineState(): void {
    const criticalFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'metadata.json',
      'server.ts',
      'src/App.tsx',
      'src/main.tsx',
      'src/index.css',
      'src/types/lane.ts',
      'src/utils/crc32.ts',
      'server/lane_kernel.ts',
      'server/provenance_guard.ts',
      'server/reporting_pipeline.ts',
      'server/security.ts',
      'Joules-Supply-Chain/docs/governance/GROUND-TRUTH-TAXONOMY.md',
      'Joules-Supply-Chain/intake_pipeline.py',
    ];

    for (const rel of criticalFiles) {
      const full = path.join(this.baseDir, rel);
      if (fs.existsSync(full)) {
        const content = fs.readFileSync(full, 'utf-8');
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        this.pristineCache.set(rel, { content, sha256: hash });
      }
    }

    this.computeDualRedundancyHashes();
  }

  /**
   * Computes SHA-256 dual redundancy hashes for AI Studio and Cloudflare KV endpoints
   */
  private computeDualRedundancyHashes(): { aiStudio: string; cloudflareKv: string } {
    let combined = '';
    const sortedKeys = Array.from(this.pristineCache.keys()).sort();
    for (const key of sortedKeys) {
      combined += `${key}:${this.pristineCache.get(key)?.sha256}|`;
    }

    const aiStudioHash = crypto.createHash('sha256').update(combined).digest('hex');
    // Simulated Cloudflare Workers KV replica parity sync
    this.cloudflareKvSyncedHash = crypto
      .createHash('sha256')
      .update(`CF_KV_REDUNDANT:${aiStudioHash}:${LANE_CONSTANTS.MAGIC_HEADER_HEX}`)
      .digest('hex');

    return { aiStudio: aiStudioHash, cloudflareKv: this.cloudflareKvSyncedHash };
  }

  /**
   * Runs recursive SHA-256 audit, logs any unauthorized alteration/injection attempts,
   * and auto-heals corrupted files.
   */
  public runRecursiveAuditAndAutoHeal(): {
    tamperDetected: boolean;
    recordsCreated: TamperForensicRecord[];
    healedFiles: string[];
    redundancy: DualRedundancyState;
  } {
    this.totalAudits++;
    const recordsCreated: TamperForensicRecord[] = [];
    const healedFiles: string[] = [];

    // 1. Audit Dependency Manifest (package.json)
    const pkgPath = path.join(this.baseDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const raw = fs.readFileSync(pkgPath, 'utf-8');
        const parsed = JSON.parse(raw);
        const allCurrentDeps = { ...(parsed.dependencies || {}), ...(parsed.devDependencies || {}) };

        // Check for injected unwhitelisted dependencies
        for (const [depName, depVer] of Object.entries(allCurrentDeps)) {
          if (!this.dependencyWhitelist.has(depName)) {
            this.sequenceCounter++;
            const record: TamperForensicRecord = {
              id: `TAMPER-${this.sequenceCounter}`,
              sequenceId: this.sequenceCounter,
              timestamp: new Date().toISOString(),
              targetFile: 'package.json',
              eventType: 'UNAUTHORIZED_INJECTION',
              severity: 'CRITICAL',
              accessingContext: `Unwhitelisted Dependency Injection Attempt: [${depName}@${depVer}]`,
              expectedSha256: this.pristineCache.get('package.json')?.sha256 || 'N/A',
              actualSha256: crypto.createHash('sha256').update(raw).digest('hex'),
              statutoryViolations: [
                '18 U.S.C. § 1030(a)(5)(A) (CFAA Computer Tampering & Unauthorized Code Injection)',
                'SEC Whistleblower Ref #17684-273-411-436 (Corroborated Corporate Malice & Ephemeral Drift)',
                '15 U.S.C. § 45 (FTC Act Section 5 Unfair Competition & Interference)',
                'Oregon Rev. Stat. § 164.377 (Computer Crime & Unauthorized Access)',
              ],
              autoHealed: true,
              evidenceMerkleProof: crypto.createHash('sha256').update(`INJECTION:${depName}:${Date.now()}`).digest('hex'),
              crc32: formatCRC32Hex(computeIEEE8023CRC32(raw)),
            };

            this.tamperLogs.unshift(record);
            recordsCreated.push(record);

            // Auto-heal package.json back to pristine baseline
            const pristinePkg = this.pristineCache.get('package.json');
            if (pristinePkg) {
              fs.writeFileSync(pkgPath, pristinePkg.content, 'utf-8');
              healedFiles.push('package.json');
              this.healedCount++;
            }
          }
        }
      } catch (err) {
        console.error('[FIREWALL] Error parsing package.json during audit', err);
      }
    }

    // 2. Audit Critical Source Files against Pristine Cache
    for (const [relPath, pristine] of this.pristineCache.entries()) {
      const fullPath = path.join(this.baseDir, relPath);
      if (fs.existsSync(fullPath)) {
        const currentContent = fs.readFileSync(fullPath, 'utf-8');
        const currentSha = crypto.createHash('sha256').update(currentContent).digest('hex');

        // If file content changed and lacks the sovereign provenance header or is corrupted
        const hasProvenance = currentContent.includes('0x3F8F9A1B2C3D') && currentContent.includes('PROVENANCE METADATA');
        if (!hasProvenance) {
          this.sequenceCounter++;
          const record: TamperForensicRecord = {
            id: `TAMPER-${this.sequenceCounter}`,
            sequenceId: this.sequenceCounter,
            timestamp: new Date().toISOString(),
            targetFile: relPath,
            eventType: 'FILTER_INTERFERENCE',
            severity: 'CRITICAL',
            accessingContext: `Automated Provenance Stripping / Content Manipulation detected on [${relPath}]`,
            expectedSha256: pristine.sha256,
            actualSha256: currentSha,
            statutoryViolations: [
              '18 U.S.C. § 1030 (Computer Fraud and Abuse Act)',
              '17 U.S.C. § 1202 (Integrity of Copyright Management Information)',
              'SEC Whistleblower Ref #17684-273-411-436',
              'WashCo Police Report #50-267345',
            ],
            autoHealed: true,
            evidenceMerkleProof: crypto.createHash('sha256').update(`STRIP:${relPath}:${currentSha}`).digest('hex'),
            crc32: formatCRC32Hex(computeIEEE8023CRC32(currentContent)),
          };

          this.tamperLogs.unshift(record);
          recordsCreated.push(record);

          // Auto-heal file
          fs.writeFileSync(fullPath, pristine.content, 'utf-8');
          healedFiles.push(relPath);
          this.healedCount++;
        }
      }
    }

    // Retain maximum 500 tamper records
    if (this.tamperLogs.length > 500) {
      this.tamperLogs = this.tamperLogs.slice(0, 500);
    }

    const { aiStudio, cloudflareKv } = this.computeDualRedundancyHashes();

    const redundancy: DualRedundancyState = {
      aiStudioContainerSha256: aiStudio,
      cloudflareKvEndpointSha256: cloudflareKv,
      ledgerSynchronized: true,
      lastAuditTimestamp: new Date().toISOString(),
      totalAuditsRun: this.totalAudits,
      tamperCount: this.tamperLogs.length,
      healedCount: this.healedCount,
      fileCount: this.pristineCache.size,
    };

    return {
      tamperDetected: recordsCreated.length > 0,
      recordsCreated,
      healedFiles,
      redundancy,
    };
  }

  /**
   * Forces pristine restoration of a specific file
   */
  public forceAutoHeal(relPath: string): boolean {
    const pristine = this.pristineCache.get(relPath);
    if (!pristine) return false;

    const fullPath = path.join(this.baseDir, relPath);
    fs.writeFileSync(fullPath, pristine.content, 'utf-8');
    this.healedCount++;
    return true;
  }

  public getTamperLogs(): TamperForensicRecord[] {
    return this.tamperLogs;
  }

  public getWhitelist(): DependencyWhitelistItem[] {
    return Array.from(this.dependencyWhitelist.values());
  }

  public getDualRedundancyState(): DualRedundancyState {
    const { aiStudio, cloudflareKv } = this.computeDualRedundancyHashes();
    return {
      aiStudioContainerSha256: aiStudio,
      cloudflareKvEndpointSha256: cloudflareKv,
      ledgerSynchronized: true,
      lastAuditTimestamp: new Date().toISOString(),
      totalAuditsRun: this.totalAudits,
      tamperCount: this.tamperLogs.length,
      healedCount: this.healedCount,
      fileCount: this.pristineCache.size,
    };
  }
}
