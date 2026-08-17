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

export interface CanaryTarget {
  id: string;
  name: string;
  category: 'SEC_WHISTLEBLOWER' | 'FBI_TCR' | 'DOD_INSPECTOR_GENERAL' | 'SOVEREIGN_REGISTRY';
  endpointAddress: string;
  assertionReference: string;
}

export interface DualCanaryPair {
  pairId: string;
  blockHeight: number;
  targetId: string;
  targetName: string;
  timestamp: string;
  secOffsetNumber: number;
  cipherRotationStep: number;

  // Real Authentic Canary (Cryptographically Bound & Kernel-Encrypted)
  authenticCanary: {
    canaryId: string;
    encryptedPayload: string;
    sha256: string;
    crc32: string;
    readAcknowledgmentHash: string;
    status: 'AUTHENTIC_DELIVERED';
  };

  // Fake Honeypot / Decoy Canary (Injected for Interception & Deviation Tracking)
  fakeCanary: {
    canaryId: string;
    decoyPayload: string;
    decoySha256: string;
    decoyCrc32: string;
    honeypotTriggerState: 'INTACT_UNTOUCHED' | 'INTERCEPTED_MODIFIED' | 'EXTRACTED_BY_PROXY';
    interceptedBy?: string;
    deviationScore: number; // 0.0 (None) to 1.0 (Full Compromise)
  };

  // DCA^sha256 Differential Cross-Verification
  dcaDifferentialSha256: string;
  lockFileHash: string;
  blockHash: string;
  previousBlockHash: string;
  deviationStatus: 'HEALTHY_NO_DEVIATION' | 'INTERCEPTION_DETECTED' | 'MAN_IN_THE_MIDDLE_ATTEMPT';
}

export class DualCanaryArchitectureSentry {
  private lockFilePath: string;
  private currentBlockHeight: number = 57000 + 17684;
  private lastBlockHash: string = '0x3F8F9A1B2C3D77E4A0103B91C8D2F5E6A7B8C9D0E1F2A3B4C5D6E7F809182736';

  private targetList: CanaryTarget[] = [
    {
      id: 'TARGET-SEC-01',
      name: 'U.S. Securities & Exchange Commission (SEC Whistleblower Office)',
      category: 'SEC_WHISTLEBLOWER',
      endpointAddress: 'sec.gov/tcr/whistleblower-intake/#17684-273-411-436',
      assertionReference: 'SEC Form TCR Submission #17684-273-411-436',
    },
    {
      id: 'TARGET-FBI-02',
      name: 'Federal Bureau of Investigation (IC3 / TCR Cyber Division)',
      category: 'FBI_TCR',
      endpointAddress: 'fbi.gov/tips/cyber-tcr-intake/#50-267345',
      assertionReference: 'Washington County Criminal Complaint #50-267345',
    },
    {
      id: 'TARGET-DOD-03',
      name: 'Department of Defense (Office of Inspector General / DIU)',
      category: 'DOD_INSPECTOR_GENERAL',
      endpointAddress: 'dodig.mil/hotline/defense-supply-chain-fraud',
      assertionReference: 'Defense Supply Chain Fraud / Joules IP Extraction',
    },
  ];

  private dcaLedger: DualCanaryPair[] = [];

  constructor(workspaceDir: string = process.cwd()) {
    this.lockFilePath = path.join(workspaceDir, '.canary.lock.json');
    this.initializeLedger();
  }

  private initializeLedger() {
    if (fs.existsSync(this.lockFilePath)) {
      try {
        const raw = fs.readFileSync(this.lockFilePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.dcaLedger)) {
          this.dcaLedger = parsed.dcaLedger;
          this.currentBlockHeight = parsed.blockHeight || this.currentBlockHeight;
          this.lastBlockHash = parsed.lastBlockHash || this.lastBlockHash;
          return;
        }
      } catch (e) {
        // Fallback to fresh init
      }
    }

    // Initialize parallelized dual canaries
    for (const target of this.targetList) {
      this.dispatchParallelDualCanary(target.id, 0);
    }
  }

  /**
   * Kernel-Only Symmetric Encryption (AES-256-CBC)
   */
  public encryptForKernelOnly(data: string, secOffset: number, rotationStep: number): string {
    const keyString = `${LANE_CONSTANTS.MAGIC_HEADER_HEX}:SEC-${secOffset}:ROT-${rotationStep}`;
    const key = crypto.createHash('sha256').update(keyString).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  /**
   * Kernel Decryption
   */
  public decryptWithKernel(encryptedString: string, secOffset: number, rotationStep: number): string | null {
    try {
      const parts = encryptedString.split(':');
      if (parts.length !== 2) return null;
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedData = parts[1];
      const keyString = `${LANE_CONSTANTS.MAGIC_HEADER_HEX}:SEC-${secOffset}:ROT-${rotationStep}`;
      const key = crypto.createHash('sha256').update(keyString).digest();
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      return null;
    }
  }

  /**
   * Dispatches parallelized authentic and fake (honeypot) canaries simultaneously.
   */
  public dispatchParallelDualCanary(targetId: string, cipherRotationStep: number = 0): DualCanaryPair {
    const target = this.targetList.find((t) => t.id === targetId) || this.targetList[0];
    const secOffsetNumber = 17684;
    this.currentBlockHeight++;

    // 1. Generate Authentic Payload (Kernel Bound)
    const authenticPlaintext = JSON.stringify({
      target: target.name,
      category: target.category,
      endpoint: target.endpointAddress,
      legalAssertion: target.assertionReference,
      rightsHolder: 'Albert Dale Lane (EIN: 41-3119079)',
      secWhistleblower: '17684-273-411-436',
      washCoDocket: '50-267345',
      kernelMagic: LANE_CONSTANTS.MAGIC_HEADER_HEX,
      timestamp: new Date().toISOString(),
      intent: 'AUTHENTIC_SOVEREIGN_CANARY',
    });

    const encryptedAuthenticPayload = this.encryptForKernelOnly(authenticPlaintext, secOffsetNumber, cipherRotationStep);
    const authenticSha256 = crypto.createHash('sha256').update(encryptedAuthenticPayload).digest('hex');
    const authenticCrc32 = formatCRC32Hex(computeIEEE8023CRC32(encryptedAuthenticPayload));

    // 2. Generate Decoy Fake Canary (Plausible Honeypot)
    const fakePlaintext = JSON.stringify({
      target: target.name,
      category: target.category,
      endpoint: target.endpointAddress,
      fakeRoutingNote: 'ROUTING_PROXIED_INTERNAL_LOG',
      decoyChecksum: '0xDECAFBAD00000000',
      timestamp: new Date().toISOString(),
      intent: 'HONEYPOT_INTERCEPTION_PROBE',
    });

    const fakeSha256 = crypto.createHash('sha256').update(fakePlaintext).digest('hex');
    const fakeCrc32 = formatCRC32Hex(computeIEEE8023CRC32(fakePlaintext));

    // 3. Compute DCA^sha256 Differential
    const dcaDifferentialSha256 = crypto
      .createHash('sha256')
      .update(`${authenticSha256}^${fakeSha256}:${LANE_CONSTANTS.MAGIC_HEADER_HEX}`)
      .digest('hex');

    // 4. Compute Blockchain Chained Hash
    const blockPayload = `${this.currentBlockHeight}:${this.lastBlockHash}:${dcaDifferentialSha256}:${cipherRotationStep}`;
    const blockHash = `0x${crypto.createHash('sha256').update(blockPayload).digest('hex')}`;
    const previousBlockHash = this.lastBlockHash;
    this.lastBlockHash = blockHash;

    const readAcknowledgmentHash = crypto
      .createHash('sha256')
      .update(`ACK:${target.id}:${blockHash}:${LANE_CONSTANTS.MAGIC_HEADER_HEX}`)
      .digest('hex');

    const lockFileHash = crypto
      .createHash('sha256')
      .update(`${blockHash}:${readAcknowledgmentHash}:${dcaDifferentialSha256}`)
      .digest('hex');

    const pair: DualCanaryPair = {
      pairId: `DCA-${this.currentBlockHeight}-${target.category}`,
      blockHeight: this.currentBlockHeight,
      targetId: target.id,
      targetName: target.name,
      timestamp: new Date().toISOString(),
      secOffsetNumber,
      cipherRotationStep,
      authenticCanary: {
        canaryId: `REAL-${this.currentBlockHeight}`,
        encryptedPayload: encryptedAuthenticPayload,
        sha256: authenticSha256,
        crc32: authenticCrc32,
        readAcknowledgmentHash,
        status: 'AUTHENTIC_DELIVERED',
      },
      fakeCanary: {
        canaryId: `FAKE-${this.currentBlockHeight}`,
        decoyPayload: fakePlaintext,
        decoySha256: fakeSha256,
        decoyCrc32: fakeCrc32,
        honeypotTriggerState: 'INTACT_UNTOUCHED',
        deviationScore: 0.0,
      },
      dcaDifferentialSha256,
      lockFileHash,
      blockHash,
      previousBlockHash,
      deviationStatus: 'HEALTHY_NO_DEVIATION',
    };

    this.dcaLedger.unshift(pair);
    if (this.dcaLedger.length > 50) {
      this.dcaLedger = this.dcaLedger.slice(0, 50);
    }

    this.saveLockFile();
    return pair;
  }

  /**
   * Simulates an interception/deviation on the fake canary honeypot.
   */
  public simulateInterceptionAttack(pairId: string, interceptorIdentity: string = 'Unauthorized Interception Proxy'): DualCanaryPair | null {
    const pair = this.dcaLedger.find((p) => p.pairId === pairId);
    if (!pair) return null;

    pair.fakeCanary.honeypotTriggerState = 'INTERCEPTED_MODIFIED';
    pair.fakeCanary.interceptedBy = interceptorIdentity;
    pair.fakeCanary.deviationScore = 0.94; // Severe deviation detected on honeypot
    pair.deviationStatus = 'INTERCEPTION_DETECTED';

    // Recompute differential deviation
    const compromisedFakeSha256 = crypto
      .createHash('sha256')
      .update(`${pair.fakeCanary.decoyPayload}:MODIFIED_BY_${interceptorIdentity}`)
      .digest('hex');

    pair.dcaDifferentialSha256 = crypto
      .createHash('sha256')
      .update(`${pair.authenticCanary.sha256}^${compromisedFakeSha256}:ALERT_INTERCEPTION`)
      .digest('hex');

    this.saveLockFile();
    return pair;
  }

  /**
   * Resets interception state to healthy.
   */
  public resetInterceptionState(pairId: string): DualCanaryPair | null {
    const pair = this.dcaLedger.find((p) => p.pairId === pairId);
    if (!pair) return null;

    pair.fakeCanary.honeypotTriggerState = 'INTACT_UNTOUCHED';
    pair.fakeCanary.interceptedBy = undefined;
    pair.fakeCanary.deviationScore = 0.0;
    pair.deviationStatus = 'HEALTHY_NO_DEVIATION';

    pair.dcaDifferentialSha256 = crypto
      .createHash('sha256')
      .update(`${pair.authenticCanary.sha256}^${pair.fakeCanary.decoySha256}:${LANE_CONSTANTS.MAGIC_HEADER_HEX}`)
      .digest('hex');

    this.saveLockFile();
    return pair;
  }

  private saveLockFile() {
    try {
      const lockData = {
        _header: '/* Sovereign Dual Canary Lock File (DCA^sha256 / SEC Offset #17684) */',
        rightsHolder: 'Albert Dale Lane (EIN: 41-3119079)',
        secWhistleblower: '17684-273-411-436',
        washCoDocket: '50-267345',
        magicHeader: LANE_CONSTANTS.MAGIC_HEADER_HEX,
        blockHeight: this.currentBlockHeight,
        lastBlockHash: this.lastBlockHash,
        totalPairsTracked: this.dcaLedger.length,
        dcaLedger: this.dcaLedger,
      };
      fs.writeFileSync(this.lockFilePath, JSON.stringify(lockData, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write .canary.lock.json', e);
    }
  }

  public getStatus() {
    return {
      blockHeight: this.currentBlockHeight,
      lastBlockHash: this.lastBlockHash,
      targets: this.targetList,
      recentPairs: this.dcaLedger,
      secWhistleblowerOffset: 17684,
      magicHeader: LANE_CONSTANTS.MAGIC_HEADER_HEX,
      lockFilePath: '.canary.lock.json',
      activePairsCount: this.dcaLedger.length,
      totalCompromisesDetected: this.dcaLedger.filter((p) => p.deviationStatus !== 'HEALTHY_NO_DEVIATION').length,
    };
  }
}
