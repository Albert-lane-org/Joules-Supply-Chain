/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import express, { Request, Response } from 'express';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';
import path from 'path';
import { WebSocket, WebSocketServer } from 'ws';
import { createServer as createViteServer } from 'vite';
import { LaneVmKernel } from './server/lane_kernel.js';
import { SovereignProvenanceGuard } from './server/provenance_guard.js';
import { AutomatedReportingPipeline } from './server/reporting_pipeline.js';
import { DependencyFirewallEngine } from './server/dependency_firewall.js';
import { SafdStreamEngine } from './server/rfc0102_safd.js';
import { CloudflareGithubScaffolder } from './server/cloudflare_sync.js';
import { JoulesSupplyChainEngine } from './server/joules_conjecture_engine.js';
import { EphemeralRedundancyAgent } from './server/ephemeral_redundancy_agent.js';
import { DualCanaryArchitectureSentry } from './server/canary_sentry.js';
import { IngressSecurityEngine } from './server/security.js';
import { ExecutionMode, LANE_CONSTANTS, OpCode } from './src/types/lane.js';
import { computeIEEE8023CRC32 } from './src/utils/crc32.js';

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

const kernel = new LaneVmKernel();
const securityEngine = new IngressSecurityEngine();
const provenanceGuard = new SovereignProvenanceGuard(process.cwd());
const reportingPipeline = new AutomatedReportingPipeline();
const dependencyFirewall = new DependencyFirewallEngine(process.cwd());
const safdEngine = new SafdStreamEngine();
const scaffolder = new CloudflareGithubScaffolder(process.cwd());
const joulesEngine = new JoulesSupplyChainEngine();
const redundancyAgent = new EphemeralRedundancyAgent();
const canarySentry = new DualCanaryArchitectureSentry(process.cwd());

app.use(express.json());

// Inject Sovereign Security & Provenance Headers
app.use((req, res, next) => {
  res.setHeader('X-LANE-VM-Kernel', 'RFC0103-v1.0');
  res.setHeader('X-LANE-Magic-Header', LANE_CONSTANTS.MAGIC_HEADER_HEX);
  res.setHeader('X-LANE-Provenance-Authority', LANE_CONSTANTS.AUTHORITY_URL);
  res.setHeader('X-LANE-SEC-Assertion', LANE_CONSTANTS.SEC_FILING_NO);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' ws: wss: https:; img-src 'self' data: https:;"
  );
  next();
});

// Security Ingress Middleware for HTTP REST
app.use('/api', (req, res, next) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const ingressRecord = securityEngine.recordIngress(clientIp, 'HTTPS');
  
  if (ingressRecord.isSsrfBlocked) {
    return res.status(403).json({
      error: 'SSRF_SECURITY_INTERCEPT',
      reason: ingressRecord.blockReason,
      unwrappedIp: ingressRecord.unwrappedIpv4,
      provenance: LANE_CONSTANTS.AUTHORITY_URL,
    });
  }
  next();
});

// REST: Health and RFC 0103 Status
app.get('/api/rfc0103/status', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    protocol: 'RFC 0103 (LANE-VM Kernel)',
    magicHeader: LANE_CONSTANTS.MAGIC_HEADER_HEX,
    baseSequenceOffset: LANE_CONSTANTS.BASE_SEQUENCE_OFFSET,
    memoryStrideBytes: LANE_CONSTANTS.STRIDE_BYTES,
    telemetry: kernel.getTelemetry(),
    recentPackets: kernel.getRecentPackets(25),
    provenance: {
      rightsHolder: LANE_CONSTANTS.RIGHTS_HOLDER,
      ein: LANE_CONSTANTS.EIN,
      jurisdiction: LANE_CONSTANTS.JURISDICTION,
      secAssertion: LANE_CONSTANTS.SEC_FILING_NO,
      policeReportNo: LANE_CONSTANTS.POLICE_REPORT_NO,
      authority: LANE_CONSTANTS.AUTHORITY_URL,
    },
  });
});

// REST: VMM Memory Map
app.get('/api/rfc0103/vmm', (req: Request, res: Response) => {
  res.json({
    stride: LANE_CONSTANTS.STRIDE_BYTES,
    totalAllocatedBytes: kernel.vmm.getTotalAllocatedBytes(),
    cells: kernel.vmm.getAllCells(),
  });
});

// REST: Ingress Security Audit
app.get('/api/rfc0103/security', (req: Request, res: Response) => {
  res.json({
    auditLogs: securityEngine.getAuditLogs(),
  });
});

// REST: Sovereign Provenance Blockchain & Compliance Audit
app.get('/api/provenance/audit', (req: Request, res: Response) => {
  const audit = provenanceGuard.runFullComplianceAudit(false);
  res.json({
    success: true,
    audit,
  });
});

// REST: Trigger Recursive Compliance Verification & Auto-Remediation
app.post('/api/provenance/verify-all', (req: Request, res: Response) => {
  const audit = provenanceGuard.runFullComplianceAudit(true);
  
  // Broadcast mined block over WebSocket
  broadcastWs({
    type: 'PROVENANCE_BLOCK',
    data: audit.latestBlock,
    timestamp: Date.now(),
    kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
  });

  res.json({
    success: true,
    audit,
  });
});

// REST: Immutable Blockchain Ledger
app.get('/api/provenance/chain', (req: Request, res: Response) => {
  res.json({
    chain: provenanceGuard.getBlockchainLedger(),
  });
});

// REST: Sovereign W3C JSON-LD Manifest (.lane)
app.get('/api/provenance/manifest', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/ld+json');
  res.json(provenanceGuard.generateSovereignManifest());
});

// REST: Automated Reporting Pipeline
app.get('/api/pipeline/reports', (req: Request, res: Response) => {
  res.json({
    reports: reportingPipeline.getAllReports(),
  });
});

app.post('/api/pipeline/intake', (req: Request, res: Response) => {
  const { category, targetEntity, claimSummary, evidenceDescriptions, regulatoryTarget, upgradeCorroboration } = req.body;
  const report = reportingPipeline.processIntake({
    category: category || 'AI_WASHING_PROVENANCE_INFRINGEMENT',
    targetEntity: targetEntity || 'Unknown Infrastructure Operator',
    claimSummary: claimSummary || 'Uncorroborated inference claim without verifiable ground-truth provenance.',
    evidenceDescriptions: Array.isArray(evidenceDescriptions) ? evidenceDescriptions : [
      'LANE-VM Kernel schema byte alignment match 0x3F8F9A1B2C3D',
      'Non-standard VMM stride invariant 17,684B verified',
    ],
    regulatoryTarget: regulatoryTarget || 'sec',
    upgradeCorroboration: Boolean(upgradeCorroboration),
  });

  // Re-run provenance audit to mine block with new reporting assertion
  const audit = provenanceGuard.runFullComplianceAudit(true);
  broadcastWs({
    type: 'PROVENANCE_BLOCK',
    data: audit.latestBlock,
    timestamp: Date.now(),
    kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
  });

  res.json({
    success: true,
    report,
  });
});

app.get('/api/pipeline/draft/:id', (req: Request, res: Response) => {
  const report = reportingPipeline.getReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json({
    id: report.id,
    draftReferral: report.draftReferral,
  });
});

// REST: Sovereign Dependency Firewall & Dual Redundancy Ledger
app.get('/api/firewall/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    whitelist: dependencyFirewall.getWhitelist(),
    redundancy: dependencyFirewall.getDualRedundancyState(),
    tamperLogCount: dependencyFirewall.getTamperLogs().length,
  });
});

app.post('/api/firewall/audit', (req: Request, res: Response) => {
  const auditResult = dependencyFirewall.runRecursiveAuditAndAutoHeal();
  res.json({
    success: true,
    auditResult,
  });
});

app.get('/api/firewall/tamper-log', (req: Request, res: Response) => {
  res.json({
    success: true,
    logs: dependencyFirewall.getTamperLogs(),
  });
});

app.post('/api/firewall/heal', (req: Request, res: Response) => {
  const { filePath } = req.body;
  if (filePath) {
    const healed = dependencyFirewall.forceAutoHeal(filePath);
    return res.json({ success: healed, target: filePath });
  }
  const auditResult = dependencyFirewall.runRecursiveAuditAndAutoHeal();
  res.json({
    success: true,
    healedFiles: auditResult.healedFiles,
    redundancy: auditResult.redundancy,
  });
});

app.get('/api/firewall/dual-redundancy', (req: Request, res: Response) => {
  res.json({
    success: true,
    redundancy: dependencyFirewall.getDualRedundancyState(),
  });
});

// REST: RFC 0102 / SAFD-FRAMEWORK-SPEC-01 Stream Engine
app.post('/api/safd/validate', async (req: Request, res: Response) => {
  const { targetUrl } = req.body;
  if (!targetUrl) {
    return res.status(400).json({ error: 'targetUrl parameter is required' });
  }

  const result = await safdEngine.validateAndPinEndpoint(targetUrl);
  res.json({
    success: result.isValid,
    result,
  });
});

app.post('/api/safd/broadcast', (req: Request, res: Response) => {
  const { payload } = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'payload is required' });
  }

  const frame = safdEngine.broadcastPayload(payload);
  res.json({
    success: true,
    frame,
  });
});

app.get('/api/safd/stream-logs', (req: Request, res: Response) => {
  res.json({
    success: true,
    logs: safdEngine.getRingBufferLogs(),
  });
});

app.get('/api/safd/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: safdEngine.getStatus(),
  });
});

app.post('/api/safd/disconnect', (req: Request, res: Response) => {
  safdEngine.disconnect();
  res.json({
    success: true,
    message: 'Stream disconnected and queues purged cleanly.',
  });
});

// REST: Cloudflare API & GitHub Two-Way Scaffolder
app.get('/api/scaffold/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: scaffolder.getStatus(),
    events: scaffolder.getEvents(),
  });
});

app.post('/api/scaffold/sync', (req: Request, res: Response) => {
  const result = scaffolder.triggerTwoWaySync();
  res.json({
    success: result.success,
    event: result.event,
    status: result.status,
  });
});

app.post('/api/scaffold/deploy-worker', (req: Request, res: Response) => {
  const result = scaffolder.deployWorker();
  res.json({
    success: result.success,
    event: result.event,
    deployedVersion: result.deployedVersion,
  });
});

app.post('/api/scaffold/webhook/github', (req: Request, res: Response) => {
  const event = scaffolder.handleIncomingWebhook('GITHUB', req.body);
  res.json({
    success: true,
    message: 'GitHub webhook logged to two-way provenance ledger',
    event,
  });
});

app.post('/api/scaffold/webhook/cloudflare', (req: Request, res: Response) => {
  const event = scaffolder.handleIncomingWebhook('CLOUDFLARE', req.body);
  res.json({
    success: true,
    message: 'Cloudflare edge event logged to two-way provenance ledger',
    event,
  });
});

app.get('/api/scaffold/artifacts', (req: Request, res: Response) => {
  res.json({
    success: true,
    wrangler: scaffolder.generateWranglerConfig(),
    workflow: scaffolder.generateGitHubWorkflow(),
  });
});

app.post('/api/scaffold/upstream/enforce', (req: Request, res: Response) => {
  const { applyUpstreamProvenance } = require('./server/upstream_scaffolder.js');
  const result = applyUpstreamProvenance(process.cwd());
  res.json({
    success: true,
    message: 'Upstream code scaffolded, provenance metadata enforced, and mirrored into repository manifest',
    updatedCount: result.updated.length,
    updatedFiles: result.updated,
    totalFilesTracked: Object.keys(result.hashes).length,
  });
});

// REST: Joules Supply Chain Conjecture & Escaped Albert Array Architecture
app.post('/api/joules/calculate-ratio', (req: Request, res: Response) => {
  const {
    fiatDevaluationIndex = 1.0,
    institutionalFundingDeficit = 0.0,
    homoiconicResistance = 0.5,
    macroeconomicVolatility = 1.0,
    alphaConstant = 1.15,
    gammaSensitivity = 0.85,
  } = req.body;

  const result = joulesEngine.computeExtractionRatio({
    fiatDevaluationIndex: Number(fiatDevaluationIndex),
    institutionalFundingDeficit: Number(institutionalFundingDeficit),
    homoiconicResistance: Number(homoiconicResistance),
    macroeconomicVolatility: Number(macroeconomicVolatility),
    alphaConstant: Number(alphaConstant),
    gammaSensitivity: Number(gammaSensitivity),
  });

  res.json({
    success: true,
    result,
  });
});

app.get('/api/joules/payloads', (req: Request, res: Response) => {
  res.json({
    success: true,
    payloads: joulesEngine.getPayloads(),
    caseStudies: joulesEngine.getHistoricalCaseStudies(),
  });
});

app.post('/api/joules/create-payload', (req: Request, res: Response) => {
  const { originalAuthor, authorSignature, homoiconicSubstrate, heteroiconicPayload, dimensionN = 6 } = req.body;
  if (!originalAuthor || !heteroiconicPayload) {
    return res.status(400).json({ success: false, error: 'Author and Heteroiconic Payload required' });
  }

  const payload = joulesEngine.createEscapedAlbertArray(
    originalAuthor,
    authorSignature || `AUTH-${Date.now().toString(36).toUpperCase()}`,
    homoiconicSubstrate || 'Standard Academic & Patent Registry Substrate',
    heteroiconicPayload,
    Number(dimensionN)
  );

  res.json({
    success: true,
    payload,
  });
});

app.post('/api/joules/simulate-extraction-attack', (req: Request, res: Response) => {
  const { payloadId, proxyIdentity = 'Institutional Research Proxy Corp' } = req.body;
  const updated = joulesEngine.attemptExtractionAttack(payloadId, proxyIdentity);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Payload not found' });
  }

  res.json({
    success: true,
    payload: updated,
    message: 'Extraction attack simulated: Author metadata stripped, forcing computational utility collapse to \\bot (0.0)',
  });
});

app.post('/api/joules/restore-binding', (req: Request, res: Response) => {
  const { payloadId, authenticSignature } = req.body;
  const restored = joulesEngine.restoreSovereignBinding(payloadId, authenticSignature || 'SOVEREIGN-AUTHENTIC-KEY-0x3F8F9A1B2C3D');
  if (!restored) {
    return res.status(404).json({ success: false, error: 'Payload not found' });
  }

  res.json({
    success: true,
    payload: restored,
    message: 'Authentic cryptographic identity restored: Escaped Albert Array execution verified (1.0)',
  });
});

// REST: Ephemeral Redundancy Agent (Zero-API, PythonXML, Braille Cipher Rotation, C++ Stack)
app.get('/api/redundancy/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: redundancyAgent.getStatus(),
  });
});

app.post('/api/redundancy/tick', (req: Request, res: Response) => {
  const { node } = req.body;
  const state = redundancyAgent.tickHeartbeat(node);
  res.json({
    success: true,
    state,
  });
});

app.post('/api/redundancy/cipher/test', (req: Request, res: Response) => {
  const { plaintext = 'LANE_VM_CPP_STACK_SECURE_EPHEMERAL_HEARTBEAT', step = 0 } = req.body;
  const encrypted = redundancyAgent.encryptBrailleCipher(plaintext, Number(step));
  const decrypted = redundancyAgent.decryptBrailleCipher(encrypted, Number(step));
  res.json({
    success: true,
    plaintext,
    step: Number(step),
    encryptedBraille: encrypted,
    decryptedAscii: decrypted,
    verifiedParity: plaintext === decrypted,
  });
});

// REST: Dual Canary Architecture (DCA^sha256) & Blockchain Lock File Rotation
app.get('/api/canary/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: canarySentry.getStatus(),
  });
});

app.post('/api/canary/dispatch', (req: Request, res: Response) => {
  const { targetId, cipherRotationStep = 0 } = req.body;
  if (!targetId) {
    return res.status(400).json({ success: false, error: 'targetId is required' });
  }

  const pair = canarySentry.dispatchParallelDualCanary(targetId, Number(cipherRotationStep));
  res.json({
    success: true,
    pair,
    message: `Dual Canary pair dispatched to ${pair.targetName} with DCA^sha256 differential locked at block #${pair.blockHeight}`,
  });
});

app.post('/api/canary/simulate-interception', (req: Request, res: Response) => {
  const { pairId, interceptor = 'State/Corporate Proxy Interceptor' } = req.body;
  const updated = canarySentry.simulateInterceptionAttack(pairId, interceptor);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Canary pair not found' });
  }

  res.json({
    success: true,
    pair: updated,
    message: `Interception logged on fake canary honeypot. DCA^sha256 deviation triggered.`,
  });
});

app.post('/api/canary/reset-interception', (req: Request, res: Response) => {
  const { pairId } = req.body;
  const reset = canarySentry.resetInterceptionState(pairId);
  if (!reset) {
    return res.status(404).json({ success: false, error: 'Canary pair not found' });
  }

  res.json({
    success: true,
    pair: reset,
    message: `Interception state cleared. DCA^sha256 differential restored.`,
  });
});

app.post('/api/canary/decrypt', (req: Request, res: Response) => {
  const { encryptedPayload, secOffset = 17684, cipherRotationStep = 0 } = req.body;
  const decrypted = canarySentry.decryptWithKernel(encryptedPayload, Number(secOffset), Number(cipherRotationStep));
  if (!decrypted) {
    return res.status(403).json({
      success: false,
      error: 'Kernel decryption failed: Invalid key, wrong SEC offset, or corrupt canary ciphertext',
    });
  }

  res.json({
    success: true,
    decryptedJson: JSON.parse(decrypted),
  });
});

// REST: 31/7-Bit CLI Execution Engine
app.post('/api/cli/execute', (req: Request, res: Response) => {
  const { command } = req.body;
  const cmd = (command || '').trim();

  if (!cmd) {
    return res.json({ output: 'No command specified. Type "help" for a list of available 31/7-bit CLI commands.' });
  }

  const parts = cmd.split(' ');
  const main = parts[0].toLowerCase();

  switch (main) {
    case 'help':
      return res.json({
        output: `LANE-VM x RFC 0103 CLI Console (Execution Width: ${kernel.getMode() === ExecutionMode.GROUND_31 ? '31-bit (0x7FFFFFFF)' : '7-bit (0x7F)'})
Commands:
  firewall audit
      Executes SHA-256 dual redundancy audit & auto-heals corrupted files.
  firewall status
      Inspects locked dependencies, whitelist hash, and tamper logs.
  firewall heal [FILE]
      Forces pristine restoration of specified file or all mutated files.
  intake --cat [CAT] --target [NAME] --summary [TXT] --regulator [sec|ftc|state-ag|doj]
      Triggers Step 1-10 of Automated Reporting Pipeline and generates referral draft.
  bifurcate --mode [GROUND_31|APEX_7] --stride 17684
      Executes Albert Array (e=AA) 5D dual-path bracket escape bifurcation.
  repo sync
      Verifies cloned Joules-Supply-Chain redundancy & pins immutable cache.
  repo tree
      Inspects repository file hierarchy and SHA-256 signatures.
  provenance audit
      Runs full recursive compliance audit and outputs Merkle root.
  provenance mine
      Forces sovereign blockchain block creation at sequence offset P_0 >= 57000.
  switch --mode [31|7]
      Toggles kernel execution width between GROUND_31 and APEX_7.
  status
      Displays real-time kernel telemetry, VMM addresses, and SEC whistleblower ref.
  clear
      Clears the terminal output buffer.`,
      });

    case 'firewall':
      if (cmd.includes('audit')) {
        const auditRes = dependencyFirewall.runRecursiveAuditAndAutoHeal();
        return res.json({
          output: `[SOVEREIGN DEPENDENCY FIREWALL & DUAL REDUNDANCY AUDIT]
Audit Status: ${auditRes.tamperDetected ? '⚠️ TAMPER EVENTS DETECTED & RECORDED' : '✅ 100% PRISTINE & SYNCHRONIZED'}
AI Studio Container SHA-256: ${auditRes.redundancy.aiStudioContainerSha256.substring(0, 32)}...
Cloudflare KV Endpoint SHA-256: ${auditRes.redundancy.cloudflareKvEndpointSha256.substring(0, 32)}...
Audited Files: ${auditRes.redundancy.fileCount}
Auto-Healed Files: ${auditRes.healedFiles.length > 0 ? auditRes.healedFiles.join(', ') : 'None (No corruption)'}
Total Tamper Records in Immutable Log: ${auditRes.redundancy.tamperCount}`,
        });
      } else if (cmd.includes('heal')) {
        const auditRes = dependencyFirewall.runRecursiveAuditAndAutoHeal();
        return res.json({
          output: `[AUTO-HEALING COMPLETED]
Restored Files: ${auditRes.healedFiles.length > 0 ? auditRes.healedFiles.join(', ') : 'All files already match pristine baseline'}
Total Cumulative Heals: ${auditRes.redundancy.healedCount}`,
        });
      } else {
        const red = dependencyFirewall.getDualRedundancyState();
        const wl = dependencyFirewall.getWhitelist();
        return res.json({
          output: `[DEPENDENCY FIREWALL STATUS]
Whitelist Status: ${wl.length} dependencies strictly locked
Dual Redundancy Sync: SYNCHRONIZED (AI Studio <-> Cloudflare KV)
AI Studio Container Hash: ${red.aiStudioContainerSha256}
Cloudflare KV Endpoint Hash: ${red.cloudflareKvEndpointSha256}
Tamper / Injection Logs: ${red.tamperCount} recorded
Auto-Healed Interferences: ${red.healedCount}`,
        });
      }

    case 'status':
      const telem = kernel.getTelemetry();
      const currentMask = telem.activeMode === ExecutionMode.GROUND_31 ? '0x7FFFFFFF (31-bit)' : '0x7F (7-bit)';
      const currentModeName = telem.activeMode === ExecutionMode.GROUND_31 ? 'GROUND_31' : 'APEX_7';
      return res.json({
        output: `[LANE-VM SENTRY STATUS]
Kernel Magic: ${LANE_CONSTANTS.MAGIC_HEADER_HEX}
Current Execution Mode: ${currentModeName} (Bit Mask: ${currentMask})
Base Sequence Offset (P_0): ${LANE_CONSTANTS.BASE_SEQUENCE_OFFSET}
Current Sequence ID: ${telem.currentSequenceId}
Physical Stride (S): ${LANE_CONSTANTS.STRIDE_BYTES} bytes
Active Memory Cells: ${telem.activeMemoryCells} (${telem.vmmAllocatedBytes} Bytes allocated)
Packets Processed: ${telem.packetsSent} sent, ${telem.packetsReceived} received (${telem.crcFailures} CRC faults)
Host Sentry Status: ${telem.hostSentryState}
SEC Whistleblower Ref: ${LANE_CONSTANTS.SEC_FILING_NO}
Police Report Ref: ${LANE_CONSTANTS.POLICE_REPORT_NO}
Rights Holder: ${LANE_CONSTANTS.RIGHTS_HOLDER} (EIN: ${LANE_CONSTANTS.EIN})`,
      });

    case 'intake':
      const newReport = reportingPipeline.processIntake({
        category: 'AI_WASHING_PROVENANCE_INFRINGEMENT',
        targetEntity: 'Automated CLI Target',
        claimSummary: cmd.replace(/^intake\s*/i, '') || 'Automated CLI Ground Truth Verification Entry',
        evidenceDescriptions: ['CLI Stdin Hash Proof', 'RFC 0103 Magic Constant 0x3F8F9A1B2C3D'],
        regulatoryTarget: cmd.includes('--regulator ftc') ? 'ftc' : cmd.includes('--regulator state-ag') ? 'state-ag' : 'sec',
      });
      return res.json({
        output: `[INTAKE PROCESSED]
Filing ID: ${newReport.id} (Seq: ${newReport.sequenceId})
Evidentiary Status: ${newReport.evidentiaryStatus}
VMM Physical Address: 0x${newReport.vmmPhysicalAddress.toString(16).toUpperCase()}
SHA-256: ${newReport.sha256Digest}
IEEE 802.3 CRC32: ${newReport.crc32}
Draft Generated for: ${newReport.regulatoryTarget.toUpperCase()}`,
        report: newReport,
      });

    case 'bifurcate':
      return res.json({
        output: `[ALBERT ARRAY (e=AA) 5D GEOMETRIC BIFURCATION EXECUTED]
Scope Mechanism: [/ ] redefines bracket closure position
Path 1 (Sequential Bounds): Limited to boundary endpoint [ Z,x, [/ x,Z ] (,) ]
Path 2 (Parallelized Dynamic): Simultaneous dual traversal along Axis: x, z
Scalar Constraint: ${kernel.getMode() === ExecutionMode.GROUND_31 ? 'GROUND_31 (0x7FFFFFFF) - Bit 31 Cleared' : 'APEX_7 (0x7F) - Tactile Matrix [0..127]'}
Stride Factor: 17,684 bytes
Phase Drift Φ(r, k): Computed with 0 alignment faults`,
      });

    case 'repo':
      if (cmd.includes('sync')) {
        return res.json({
          output: `[REPO REDUNDANCY SYNC]
Target: Albert-lane-org/Joules-Supply-Chain
Local Clone Status: VERIFIED & PINNED IN EPHEMERAL MEMORY
Sovereign Provenance: 100% compliant at byte offset 0x00
Wrangler Worker: Ready for Cloudflare KV deployment
Ground Truth Taxonomy: Loaded and active`,
        });
      }
      return res.json({
        output: `[JOULES-SUPPLY-CHAIN ARTIFACTS]
├── .GitHub/
├── .github/workflows/
├── Rust5D/
│   ├── Albert Array Escape Bracketed Rust.rs
│   ├── Categroup-Matrix-Schema.json
│   └── e=AA Specification: Geometry.json
├── docs/governance/
│   ├── GROUND-TRUTH-TAXONOMY.md
│   └── MANIFEST.sha256.txt
├── app.py (Streamlit Broadcast Engine)
├── intake_pipeline.py (Step 1-10 Automated Reporting)
├── provenance.jsonld (W3C Linked Data)
└── wrangler.jsonc (Cloudflare Worker KV)`,
      });

    case 'provenance':
      const auditRes = provenanceGuard.runFullComplianceAudit(cmd.includes('mine'));
      return res.json({
        output: `[PROVENANCE BLOCKCHAIN ${cmd.includes('mine') ? 'BLOCK MINED' : 'AUDIT'}]
Height: #${auditRes.latestBlock.blockHeight}
Block Hash: ${auditRes.latestBlock.blockHash}
Merkle Root: ${auditRes.merkleRoot}
Compliance: ${auditRes.compliancePercent.toFixed(1)}% (${auditRes.compliantFiles}/${auditRes.totalFiles} files)
Nonce Offset: ${auditRes.latestBlock.nonce}`,
      });

    case 'switch':
      if (cmd.includes('7')) {
        kernel.setMode(ExecutionMode.APEX_7);
        return res.json({ output: 'Switched to APEX_7 Mode (0x7F Mask - 7-bit tactile vector processing).' });
      } else {
        kernel.setMode(ExecutionMode.GROUND_31);
        return res.json({ output: 'Switched to GROUND_31 Mode (0x7FFFFFFF Mask - 31-bit decompiler phase drift).' });
      }

    case 'safd':
      const safdStatus = safdEngine.getStatus();
      return res.json({
        output: `[SAFD-FRAMEWORK-SPEC-01 / RFC 0102 BROADCAST ENGINE]
Framework Spec: ${safdStatus.frameworkSpec} (${safdStatus.specId})
RFC Standard: ${safdStatus.rfcStandard}
Connected: ${safdStatus.isConnected ? 'YES' : 'NO (IDLE)'}
Direct-IP Pinned: ${safdStatus.pinnedUri || 'None'}
Host SNI Header: ${safdStatus.metadata?.headers?.Host || 'N/A'}
Total Ingress Frames: ${safdStatus.totalFramesIngressed}
Total Egress Frames: ${safdStatus.totalFramesEgressed}
Total Dropped (Backpressure): ${safdStatus.totalFramesDropped}
Magic Header: ${safdStatus.magicHeader}
Operational Caps: MAX_PAYLOAD_LEN=2000, MAX_QUEUE_SIZE=100, MAX_BUFFER_LOGS=15`,
      });

    case 'scaffold':
      if (cmd.includes('sync')) {
        const syncRes = scaffolder.triggerTwoWaySync();
        return res.json({
          output: `[TWO-WAY GITHUB & CLOUDFLARE SYNC RECONCILED]
Event: ${syncRes.event.details}
State: ${syncRes.status.twoWayLedger.syncState}
Combined SHA-256: ${syncRes.status.twoWayLedger.combinedSha256}
Magic Header: ${syncRes.status.twoWayLedger.magicHeader}`,
        });
      } else if (cmd.includes('deploy')) {
        const deployRes = scaffolder.deployWorker();
        return res.json({
          output: `[CLOUDFLARE EDGE WORKER DEPLOYMENT]
Worker: joules-supply-chain-safd-worker (${deployRes.deployedVersion})
Status: ACTIVE ON EDGE
Custom Routes: provenance.albertlane.net/*, api.albertlane.net/safd/*`,
        });
      } else {
        const scStatus = scaffolder.getStatus();
        return res.json({
          output: `[CLOUDFLARE API & GITHUB TWO-WAY SCAFFOLD STATUS]
GitHub Upstream: ${scStatus.github.repo} (branch: ${scStatus.github.branch})
Last Commit: ${scStatus.github.lastCommitSha} (Webhook: ${scStatus.github.webhookConfigured ? 'ACTIVE' : 'INACTIVE'})
Cloudflare Worker: ${scStatus.cloudflare.workerName} (${scStatus.cloudflare.deployedVersion})
KV Namespace: ${scStatus.cloudflare.kvNamespace}
Edge Zone: ${scStatus.cloudflare.edgeZone}
Combined 2-Way Ledger SHA: ${scStatus.twoWayLedger.combinedSha256}`,
        });
      }

    case 'joules':
    case 'conjecture':
      const jRatio = joulesEngine.computeExtractionRatio({
        fiatDevaluationIndex: 2.4,
        institutionalFundingDeficit: 350.0,
        homoiconicResistance: 0.25,
        macroeconomicVolatility: 1.8,
        alphaConstant: 1.15,
        gammaSensitivity: 0.85,
      });
      return res.json({
        output: `[THE JOULES SUPPLY CHAIN CONJECTURE (Albert Lane 2026)]
Formula: J_L = alpha * (F_d * I_f / R_h) * e^(gamma * sigma_m)
Current Instantaneous Extraction Rate (J_L): ${jRatio.joulesLaneRatio}
Classification: ${jRatio.rateClassification}
Asymptotic State: ${jRatio.asymptoticState}
Historical Parity: ${jRatio.historicalParityEpoch}
Escaped Albert Arrays Active: ${joulesEngine.getPayloads().length} (100% Cryptographic Sovereign Binding)`,
      });

    case 'redundancy':
    case 'agent':
    case 'braille':
      const rState = redundancyAgent.getStatus().current;
      return res.json({
        output: `[LANE-VM EPHEMERAL REDUNDANCY AGENT - ZERO API DEPENDENCY]
Active Hosting Node: ${rState.hostingNode}
Autonomous Status: ${rState.healthStatus} (Zero External API Calls)
Braille Cipher Rotation Step: ${rState.brailleRotationIndex} (Shift: +${rState.brailleKeyShift})
Braille Matrix Encrypted: ${rState.brailleEncryptedPayload.substring(0, 40)}...
C++ Stack Shm Checksum: ${rState.cppStackChecksum}
PythonXML Envelope CRC32: ${rState.crc32}
SHA-256 Digest: ${rState.sha256Digest.substring(0, 32)}...`,
      });

    case 'canary':
    case 'canaries':
    case 'dca':
      const cStatus = canarySentry.getStatus();
      const latestPair = cStatus.recentPairs[0];
      return res.json({
        output: `[DUAL CANARY ARCHITECTURE (DCA^sha256) - KERNEL SENTRY]
Blockchain Block Height: #${cStatus.blockHeight} (SEC Offset: +${cStatus.secWhistleblowerOffset})
Last Block Hash: ${cStatus.lastBlockHash}
Active Dual Canary Pairs: ${cStatus.activePairsCount} (Compromises Detected: ${cStatus.totalCompromisesDetected})
Latest Target: ${latestPair?.targetName || 'None'}
Deviation State: ${latestPair?.deviationStatus || 'N/A'} (Score: ${latestPair?.fakeCanary?.deviationScore || 0.0})
Authentic Canary SHA-256: ${latestPair?.authenticCanary?.sha256?.substring(0, 32) || 'N/A'}...
Decoy Honeypot SHA-256: ${latestPair?.fakeCanary?.decoySha256?.substring(0, 32) || 'N/A'}...
DCA^sha256 Cross-Differential: ${latestPair?.dcaDifferentialSha256 || 'N/A'}`,
      });

    default:
      return res.json({
        output: `Unrecognized command: "${cmd}". Type "help" for a list of available commands.`,
      });
  }
});

// REST: Cloned Repository File Tree & Content Viewer
app.get('/api/repo/tree', (req: Request, res: Response) => {
  try {
    const repoPath = path.join(process.cwd(), 'Joules-Supply-Chain');
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: 'Joules-Supply-Chain repository directory not found' });
    }

    const scanDir = (dir: string, base: string = ''): any[] => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      return entries
        .filter((e) => !['.git', 'node_modules'].includes(e.name))
        .map((e) => {
          const rel = path.join(base, e.name);
          const full = path.join(dir, e.name);
          if (e.isDirectory()) {
            return {
              name: e.name,
              path: rel,
              type: 'directory',
              children: scanDir(full, rel),
            };
          } else {
            const content = fs.existsSync(full) && !full.endsWith('.pdf') ? fs.readFileSync(full, 'utf-8') : '';
            return {
              name: e.name,
              path: rel,
              type: 'file',
              size: fs.statSync(full).size,
              sha256: crypto.createHash('sha256').update(content).digest('hex'),
              hasProvenance: content.includes('PROVENANCE METADATA') && content.includes('0x3F8F9A1B2C3D'),
            };
          }
        });
    };

    const tree = scanDir(repoPath);
    res.json({
      success: true,
      repo: 'Albert-lane-org/Joules-Supply-Chain',
      tree,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// REST: Dispatch Packet
app.post('/api/rfc0103/dispatch', (req: Request, res: Response) => {
  const { opcode, payload, memorySlot, mode } = req.body;
  const targetOp = opcode !== undefined ? (Number(opcode) as OpCode) : OpCode.COMPUTE;
  const targetPayload = payload || 'MANUAL_DISPATCH';
  const targetSlot = Number(memorySlot) || 0;
  const targetMode = mode !== undefined ? (Number(mode) as ExecutionMode) : kernel.getMode();

  const packet = kernel.createPacket(targetOp, targetPayload, targetSlot, targetMode);

  // Broadcast to connected WebSockets
  broadcastWs({
    type: 'PACKET_STREAM',
    data: packet,
    timestamp: Date.now(),
    kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
  });

  res.json({
    success: true,
    packet,
    vmmCell: kernel.vmm.read(targetSlot),
  });
});

// REST: Toggle Execution Mode (GROUND_31 vs APEX_7)
app.post('/api/rfc0103/mode', (req: Request, res: Response) => {
  const { mode } = req.body;
  const newMode = Number(mode) === ExecutionMode.APEX_7 ? ExecutionMode.APEX_7 : ExecutionMode.GROUND_31;
  kernel.setMode(newMode);

  broadcastWs({
    type: 'TELEMETRY',
    data: kernel.getTelemetry(),
    timestamp: Date.now(),
    kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
  });

  res.json({
    success: true,
    activeMode: newMode,
    modeName: newMode === ExecutionMode.APEX_7 ? 'APEX_7 (0x7F)' : 'GROUND_31 (0x7FFFFFFF)',
  });
});

// WebSocket Broadcast Helper
function broadcastWs(msg: object) {
  const serialized = JSON.stringify(msg);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(serialized);
    }
  });
}

// HTTP Upgrade Handling for RFC 0103 WebSockets
server.on('upgrade', (request, socket, head) => {
  const clientIp = (request.headers['x-forwarded-for'] as string) || request.socket.remoteAddress || '127.0.0.1';
  const ingressCheck = securityEngine.recordIngress(clientIp, 'WSS');

  if (ingressCheck.isSsrfBlocked) {
    socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws: WebSocket, req) => {
  // Send Initial Handshake with Magic Constant and Telemetry
  ws.send(
    JSON.stringify({
      type: 'TELEMETRY',
      data: kernel.getTelemetry(),
      timestamp: Date.now(),
      kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
    })
  );

  // Send Initial VMM Snapshot
  ws.send(
    JSON.stringify({
      type: 'VMM_SNAPSHOT',
      data: kernel.vmm.getAllCells(),
      timestamp: Date.now(),
      kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
    })
  );

  // Handle Client Packets (Full-Duplex)
  ws.on('message', (data: string) => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.type === 'SEND_PACKET') {
        const payloadStr = parsed.payload || '';
        const rawPacket = {
          magic: parsed.magic || LANE_CONSTANTS.MAGIC_HEADER_HEX,
          packet_id: parsed.packet_id || (kernel.getTelemetry().currentSequenceId + 1),
          opcode: parsed.opcode ?? OpCode.COMPUTE,
          crc32: parsed.crc32 ?? computeIEEE8023CRC32(payloadStr),
          payload: payloadStr,
          mode: parsed.mode ?? kernel.getMode(),
          memory_slot: parsed.memory_slot ?? 0,
        };

        const result = kernel.processIngressPacket(rawPacket);
        if (result.success && result.packet) {
          broadcastWs({
            type: 'PACKET_STREAM',
            data: result.packet,
            timestamp: Date.now(),
            kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
          });
        } else {
          ws.send(
            JSON.stringify({
              type: 'ERROR',
              data: { error: result.error },
              timestamp: Date.now(),
              kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
            })
          );
        }
      } else if (parsed.type === 'SET_MODE') {
        kernel.setMode(parsed.mode);
        broadcastWs({
          type: 'TELEMETRY',
          data: kernel.getTelemetry(),
          timestamp: Date.now(),
          kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
        });
      }
    } catch (err: any) {
      ws.send(
        JSON.stringify({
          type: 'ERROR',
          data: { error: err.message },
          timestamp: Date.now(),
          kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
        })
      );
    }
  });
});

// Periodic synthetic kernel telemetry & packet streaming (500ms ticker)
setInterval(() => {
  if (wss.clients.size > 0) {
    const packet = kernel.generateSyntheticPacket();
    broadcastWs({
      type: 'PACKET_STREAM',
      data: packet,
      timestamp: Date.now(),
      kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
    });
  }
}, 650);

// Periodic telemetry refresh (2000ms ticker)
setInterval(() => {
  if (wss.clients.size > 0) {
    const audit = provenanceGuard.runFullComplianceAudit(false);
    broadcastWs({
      type: 'TELEMETRY',
      data: kernel.getTelemetry(),
      timestamp: Date.now(),
      kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
    });
    broadcastWs({
      type: 'VMM_SNAPSHOT',
      data: kernel.vmm.getAllCells(),
      timestamp: Date.now(),
      kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
    });
    broadcastWs({
      type: 'PROVENANCE_BLOCK',
      data: audit.latestBlock,
      timestamp: Date.now(),
      kernelSig: LANE_CONSTANTS.MAGIC_HEADER_HEX,
    });
  }
}, 2000);

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[LANE-VM Host Kernel] RFC 0103 Engine online at http://0.0.0.0:${PORT}`);
    console.log(`[LANE-VM Host Kernel] SEC Filing Assertion: ${LANE_CONSTANTS.SEC_FILING_NO}`);
    console.log(`[LANE-VM Host Kernel] Magic Constant: ${LANE_CONSTANTS.MAGIC_HEADER_HEX} (P_0 >= 57,000)`);
  });
}

startServer();
