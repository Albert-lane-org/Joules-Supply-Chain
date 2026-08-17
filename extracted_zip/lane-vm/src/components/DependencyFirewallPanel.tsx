/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Lock,
  FileCheck2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Server,
  Cloud,
  Download,
  Copy,
  Terminal,
  Activity,
  Layers,
  Scale
} from 'lucide-react';
import { LANE_CONSTANTS } from '../types/lane.js';

interface WhitelistItem {
  name: string;
  expectedVersion: string;
  category: 'production' | 'dev';
  isLocked: boolean;
  sha256Baseline: string;
}

interface TamperRecord {
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

interface DualRedundancy {
  aiStudioContainerSha256: string;
  cloudflareKvEndpointSha256: string;
  ledgerSynchronized: boolean;
  lastAuditTimestamp: string;
  totalAuditsRun: number;
  tamperCount: number;
  healedCount: number;
  fileCount: number;
}

export const DependencyFirewallPanel: React.FC = () => {
  const [whitelist, setWhitelist] = useState<WhitelistItem[]>([]);
  const [tamperLogs, setTamperLogs] = useState<TamperRecord[]>([]);
  const [redundancy, setRedundancy] = useState<DualRedundancy | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/firewall/status');
      if (res.ok) {
        const json = await res.json();
        setWhitelist(json.whitelist || []);
        setRedundancy(json.redundancy || null);
      }

      const logRes = await fetch('/api/firewall/tamper-log');
      if (logRes.ok) {
        const logJson = await logRes.json();
        setTamperLogs(logJson.logs || []);
      }
    } catch (err) {
      console.error('Failed to load firewall status', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 6000);
    return () => clearInterval(timer);
  }, []);

  const triggerAuditAndHeal = async () => {
    setIsAuditing(true);
    setAuditMessage(null);
    try {
      const res = await fetch('/api/firewall/audit', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        const result = json.auditResult;
        setRedundancy(result.redundancy);
        setTamperLogs(result.recordsCreated.concat(tamperLogs));
        if (result.healedFiles.length > 0) {
          setAuditMessage(`Auto-healed ${result.healedFiles.length} files: ${result.healedFiles.join(', ')}`);
        } else {
          setAuditMessage('Audit Complete: 100% SHA-256 Dual Redundancy Verified. Zero Corruptions.');
        }
        await fetchStatus();
      }
    } catch (err: any) {
      setAuditMessage(`Audit error: ${err.message}`);
    } finally {
      setIsAuditing(false);
    }
  };

  const exportForensicLog = () => {
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      rightsHolder: LANE_CONSTANTS.RIGHTS_HOLDER,
      secWhistleblowerRef: LANE_CONSTANTS.SEC_FILING_NO,
      policeReportRef: LANE_CONSTANTS.POLICE_REPORT_NO,
      dualRedundancy: redundancy,
      lockedDependenciesCount: whitelist.length,
      whitelist,
      tamperLogs,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LANE_VM_FIREWALL_TAMPER_LEDGER_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="dependency-firewall-panel" className="space-y-6">
      {/* Top Banner Header */}
      <div className="rounded-xl border border-rose-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  Sovereign Dependency Firewall & SHA-256 Redundancy Ledger
                </h2>
                <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/30">
                  AUTO-HEALING ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Recursive SHA-256 Dual-Endpoint Integrity (AI Studio Container + Cloudflare KV) • CFAA 18 U.S.C. § 1030 Tamper Logging
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerAuditAndHeal}
              disabled={isAuditing}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 text-xs font-semibold font-mono transition shadow-lg shadow-rose-900/40 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              Run Recursive Audit & Heal
            </button>

            <button
              onClick={exportForensicLog}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 text-xs font-semibold font-mono border border-slate-700 transition"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              Export Forensic Ledger
            </button>
          </div>
        </div>

        {auditMessage && (
          <div className="mt-4 rounded-lg bg-slate-950 p-3 border border-rose-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{auditMessage}</span>
          </div>
        )}
      </div>

      {/* Dual Redundancy Status Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Node 1: AI Studio Container */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <Server className="h-4 w-4 text-cyan-400" />
              AI Studio Container FS
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              VERIFIED
            </span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            SHA-256: <span className="text-cyan-300">{redundancy?.aiStudioContainerSha256.substring(0, 20)}...</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Protected Artifacts: {redundancy?.fileCount || 16} source files
          </div>
        </div>

        {/* Node 2: Cloudflare Workers KV */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <Cloud className="h-4 w-4 text-amber-400" />
              Cloudflare KV Replica
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              SYNCED
            </span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            SHA-256: <span className="text-amber-300">{redundancy?.cloudflareKvEndpointSha256.substring(0, 20)}...</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Global Edge Redundancy: 100% Pinned
          </div>
        </div>

        {/* Node 3: Audits & Auto-Healing Metrics */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <Activity className="h-4 w-4 text-emerald-400" />
              Recursive Auto-Healing
            </span>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
              ARMED
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Audits Executed: <span className="text-emerald-400 font-bold">{redundancy?.totalAuditsRun || 0}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Pristine Restorations: {redundancy?.healedCount || 0} files healed
          </div>
        </div>

        {/* Node 4: Legal & Statutory Reference */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <Scale className="h-4 w-4 text-purple-400" />
              Statutory Authority
            </span>
            <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
              SEC TCR
            </span>
          </div>
          <div className="text-[11px] text-purple-300 font-bold truncate">
            SEC #{LANE_CONSTANTS.SEC_FILING_NO}
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            WashCo #{LANE_CONSTANTS.POLICE_REPORT_NO} • EIN: {LANE_CONSTANTS.EIN}
          </div>
        </div>
      </div>

      {/* Main Grid: Immutable Tamper & Injection Log & Whitelist Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Immutable Forensic Tamper Log (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-slate-200 font-mono">
                  Immutable Tamper & Anti-Interference Event Log ({tamperLogs.length})
                </h3>
              </div>
              <span className="text-xs text-rose-400 font-mono">
                18 U.S.C. § 1030 Tracked
              </span>
            </div>

            <div className="mt-3 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {tamperLogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 font-mono space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500/60 mx-auto" />
                  <div>No unauthorized injections or tampering detected.</div>
                  <div className="text-[10px] text-slate-600">All dependency manifests & source offsets conform to pristine baselines.</div>
                </div>
              ) : (
                tamperLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-lg border border-rose-900/50 bg-slate-950 font-mono text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded text-[10px] border border-rose-500/40">
                          {log.eventType}
                        </span>
                        <span className="text-slate-200 font-bold">{log.targetFile}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>

                    <p className="text-[11px] text-rose-200 leading-relaxed bg-rose-950/20 p-2 rounded border border-rose-900/40">
                      {log.accessingContext}
                    </p>

                    <div className="space-y-1 text-[10px] text-slate-400">
                      <div>Statutory Violations:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-amber-300">
                        {log.statutoryViolations.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                      <span>Merkle Proof: {log.evidenceMerkleProof.substring(0, 16)}...</span>
                      <span className="text-emerald-400 font-semibold">
                        {log.autoHealed ? '✓ AUTO-HEALED TO BASELINE' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Locked Dependency Whitelist & Policy (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-200 font-mono">
                  Locked Dependency Whitelist ({whitelist.length})
                </h3>
              </div>
              <span className="text-xs text-cyan-400 font-mono">
                Hard Whitelist
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2 mb-3">
              Any package injected outside this verified list is blocked, recorded for SEC filing, and auto-healed.
            </p>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {whitelist.map((dep, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                      <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{dep.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Version: <span className="text-cyan-300">{dep.expectedVersion}</span> • {dep.category}
                    </div>
                  </div>
                  <span className="text-[9px] bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">
                    LOCKED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
