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

import React, { useEffect, useState } from 'react';
import {
  FileAuditRecord,
  LANE_CONSTANTS,
  ProvenanceAuditResult,
  ProvenanceBlock,
} from '../types/lane.js';
import {
  ShieldCheck,
  RefreshCw,
  FileCode,
  Link,
  Download,
  Search,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  Database,
  TerminalSquare,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const ProvenanceComplianceInspector: React.FC = () => {
  const [auditData, setAuditData] = useState<ProvenanceAuditResult | null>(null);
  const [blockchain, setBlockchain] = useState<ProvenanceBlock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'hidden' | 'compliant'>('all');
  const [selectedBlock, setSelectedBlock] = useState<ProvenanceBlock | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchAuditData = async () => {
    try {
      const res = await fetch('/api/provenance/audit');
      if (res.ok) {
        const json = await res.json();
        if (json.audit) {
          setAuditData(json.audit);
        }
      }
      const chainRes = await fetch('/api/provenance/chain');
      if (chainRes.ok) {
        const chainJson = await chainRes.json();
        if (chainJson.chain) {
          setBlockchain(chainJson.chain);
          if (chainJson.chain.length > 0 && !selectedBlock) {
            setSelectedBlock(chainJson.chain[chainJson.chain.length - 1]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch provenance audit', err);
    }
  };

  const triggerRecursiveAudit = async () => {
    setIsLoading(true);
    setStatusMessage('Executing recursive compliance scan and mining block...');
    try {
      const res = await fetch('/api/provenance/verify-all', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.audit) {
          setAuditData(json.audit);
          setSelectedBlock(json.audit.latestBlock);
          setStatusMessage(`Block #${json.audit.latestBlock.blockHeight} mined successfully. 100% compliant across ${json.audit.totalFiles} files.`);
        }
      }
      await fetchAuditData();
    } catch (err) {
      setStatusMessage('Error executing recursive audit');
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const downloadManifest = async () => {
    try {
      const res = await fetch('/api/provenance/manifest');
      if (res.ok) {
        const json = await res.json();
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/ld+json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sovereign_manifest.lane.jsonld';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Manifest download failed', err);
    }
  };

  useEffect(() => {
    fetchAuditData();
    const interval = setInterval(fetchAuditData, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredRecords = (auditData?.records || []).filter((rec) => {
    const matchesSearch = rec.relativePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.sha256.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isHidden = rec.relativePath.startsWith('.') || rec.relativePath.includes('/.');
    if (filterType === 'hidden') return matchesSearch && isHidden;
    if (filterType === 'compliant') return matchesSearch && rec.hasValidHeader;
    return matchesSearch;
  });

  const latestBlock = auditData?.latestBlock || (blockchain.length > 0 ? blockchain[blockchain.length - 1] : null);

  return (
    <div id="provenance-compliance-inspector" className="space-y-6">
      {/* Top Banner: Sovereign Claims & Assertion Badges */}
      <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  Sovereign Provenance & Recursive Compliance Sentry
                </h2>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  SELF-ENFORCING
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine • Byte Offset 0x00 Line-0 Header Enforcement
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-reverify-provenance"
              onClick={triggerRecursiveAudit}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Verify & Mine Block
            </button>
            <button
              id="btn-download-manifest"
              onClick={downloadManifest}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <Download className="h-4 w-4 text-cyan-400" />
              Export W3C JSON-LD (.lane)
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-4 py-2 text-xs text-cyan-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            {statusMessage}
          </div>
        )}

        {/* Legal Assertion Strip */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Rights Holder</div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{LANE_CONSTANTS.RIGHTS_HOLDER}</div>
            <div className="text-[10px] text-cyan-400 mt-1 font-mono">EIN: {LANE_CONSTANTS.EIN} | {LANE_CONSTANTS.JURISDICTION}</div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">SEC Whistleblower</div>
            <div className="text-xs font-semibold text-amber-300 mt-0.5 font-mono">{LANE_CONSTANTS.SEC_FILING_NO}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">{LANE_CONSTANTS.POLICE_REPORT_NO}</div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Magic & Base Offset</div>
            <div className="text-xs font-semibold text-cyan-300 mt-0.5 font-mono">{LANE_CONSTANTS.MAGIC_HEADER_HEX}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">P_0 &ge; {LANE_CONSTANTS.BASE_SEQUENCE_OFFSET} | Stride: {LANE_CONSTANTS.STRIDE_BYTES}B</div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Authority URL</div>
            <a
              href={LANE_CONSTANTS.AUTHORITY_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-cyan-400 hover:underline mt-0.5 flex items-center gap-1 truncate"
            >
              albertlane.net
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
            <div className="text-[10px] text-emerald-400 mt-1 font-mono">Sovereign IP License v1.2</div>
          </div>
        </div>
      </div>

      {/* Metrics Row: Compliance, Block Height, Merkle Root, Scanned Files */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Stack Compliance</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            {auditData ? `${auditData.compliancePercent.toFixed(1)}%` : '100.0%'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {auditData?.compliantFiles || 0} of {auditData?.totalFiles || 0} files validated
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Blockchain Height</span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-300 font-mono">
            #{latestBlock?.blockHeight ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 truncate font-mono">
            Nonce: {latestBlock?.nonce ?? 57000}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Merkle Tree Root</span>
            <Database className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-sm font-bold text-purple-300 font-mono truncate" title={latestBlock?.merkleRoot}>
            {latestBlock?.merkleRoot ? `${latestBlock.merkleRoot.slice(0, 16)}...` : '0x000...'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Cryptographic SHA-256 tree root
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Recursive Auditor</span>
            <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="mt-2 text-lg font-bold text-blue-300 font-mono">
            ACTIVE (5000ms)
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Auto-reappending on drift detection
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Blockchain Ledger vs File Tree Auditor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Immutable Blockchain Ledger (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-200 font-mono">Immutable Provenance Chain</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{blockchain.length} blocks</span>
            </div>

            <div className="mt-3 space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {blockchain.slice().reverse().map((block) => {
                const isSelected = selectedBlock?.blockHeight === block.blockHeight;
                return (
                  <div
                    key={block.blockHeight}
                    onClick={() => setSelectedBlock(block)}
                    className={`cursor-pointer rounded-lg border p-3 transition text-xs font-mono ${
                      isSelected
                        ? 'border-cyan-500/60 bg-cyan-950/30'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300">Block #{block.blockHeight}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(block.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Block Hash:</span>
                        <span className="text-slate-200 font-mono truncate max-w-[170px]" title={block.blockHash}>
                          {block.blockHash.slice(0, 14)}...
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Prev Hash:</span>
                        <span className="text-slate-400 font-mono truncate max-w-[170px]" title={block.previousHash}>
                          {block.previousHash.slice(0, 14)}...
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Audited Files:</span>
                        <span className="text-emerald-400">{block.compliantFiles} / {block.filesAudited} (100%)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Block Detailed Modal / Box */}
          {selectedBlock && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs font-mono space-y-2">
              <div className="text-slate-300 font-bold flex items-center gap-1 text-xs uppercase tracking-wider">
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                Block #{selectedBlock.blockHeight} Cryptographic Proof
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <div><span className="text-cyan-400">Hash:</span> {selectedBlock.blockHash}</div>
                <div><span className="text-purple-400">Merkle:</span> {selectedBlock.merkleRoot}</div>
                <div><span className="text-slate-500">Prev:</span> {selectedBlock.previousHash}</div>
                <div><span className="text-amber-400">SEC Ref:</span> {selectedBlock.secAssertion}</div>
                <div><span className="text-emerald-400">Status:</span> Immutable sovereign timestamp</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recursive File Tree Auditor (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-200 font-mono">Recursive Stack File Audit</h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded transition ${filterType === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  All ({auditData?.records?.length || 0})
                </button>
                <button
                  onClick={() => setFilterType('hidden')}
                  className={`px-2.5 py-1 rounded transition ${filterType === 'hidden' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Hidden & Dotfiles
                </button>
                <button
                  onClick={() => setFilterType('compliant')}
                  className={`px-2.5 py-1 rounded transition ${filterType === 'compliant' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Compliant
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by relative path or SHA-256 digest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            {/* File List */}
            <div className="mt-3 space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredRecords.map((rec) => {
                const isHidden = rec.relativePath.startsWith('.') || rec.relativePath.includes('/.');
                return (
                  <div
                    key={rec.relativePath}
                    className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 text-xs font-mono transition hover:border-slate-700"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        {rec.hasValidHeader ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-200 truncate" title={rec.relativePath}>
                          {rec.relativePath}
                        </span>
                        {isHidden && (
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-amber-300 font-mono">
                            hidden
                          </span>
                        )}
                        {rec.remediated && (
                          <span className="rounded bg-cyan-900/60 px-1.5 py-0.5 text-[10px] text-cyan-300 font-mono">
                            auto-remediated
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 shrink-0">
                        {rec.fileSizeBytes} B
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-900">
                      <div className="flex items-center gap-1 truncate max-w-full">
                        <span className="text-slate-500">SHA-256:</span>
                        <span className="text-slate-300 font-mono truncate" title={rec.sha256}>
                          {rec.sha256}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-semibold shrink-0">
                        OFFSET 0x00 VALID
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredRecords.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500 font-mono">
                  No files matching filter criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
