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
import { LANE_CONSTANTS } from '../types/lane.js';
import {
  FileText,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Plus,
  Scale,
  Building,
  Hash,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export interface IntakeReport {
  id: string;
  sequenceId: number;
  timestamp: string;
  category: string;
  targetEntity: string;
  evidentiaryStatus: 'PRELIMINARY' | 'CORROBORATED' | 'CERTIFIED_GROUND_TRUTH' | 'REJECTED';
  claimSummary: string;
  evidenceItems: {
    description: string;
    artifactHash: string;
    provenanceVerified: boolean;
  }[];
  regulatoryTarget: 'ftc' | 'sec' | 'state-ag' | 'doj' | 'internal';
  sha256Digest: string;
  crc32: string;
  vmmPhysicalAddress: number;
  draftReferral?: string;
  isLocked: boolean;
}

export const JoulesReportingPipeline: React.FC = () => {
  const [reports, setReports] = useState<IntakeReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<IntakeReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Form State for new intake
  const [targetEntity, setTargetEntity] = useState<string>('Autonomous Inference Cluster X');
  const [category, setCategory] = useState<string>('AI_WASHING_PROVENANCE_INFRINGEMENT');
  const [claimSummary, setClaimSummary] = useState<string>('Unauthorized model rollback and uncorroborated capability assertions infringing on RFC 0103 memory-striding architecture.');
  const [evidenceList, setEvidenceList] = useState<string[]>([
    'LANE-VM Host Kernel schematic match on Magic Constant 0x3F8F9A1B2C3D',
    'Non-standard physical stride 17,684 bytes invariant parity',
  ]);
  const [newEvidence, setNewEvidence] = useState<string>('');
  const [regulatoryTarget, setRegulatoryTarget] = useState<'sec' | 'ftc' | 'state-ag' | 'doj'>('sec');

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/pipeline/reports');
      if (res.ok) {
        const json = await res.json();
        if (json.reports) {
          setReports(json.reports);
          if (json.reports.length > 0 && !selectedReport) {
            setSelectedReport(json.reports[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch reporting intake', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAddEvidence = () => {
    if (newEvidence.trim()) {
      setEvidenceList([...evidenceList, newEvidence.trim()]);
      setNewEvidence('');
    }
  };

  const handleRemoveEvidence = (idx: number) => {
    setEvidenceList(evidenceList.filter((_, i) => i !== idx));
  };

  const handleSubmitIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/pipeline/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          targetEntity,
          claimSummary,
          evidenceDescriptions: evidenceList,
          regulatoryTarget,
          upgradeCorroboration: true,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.report) {
          setSelectedReport(json.report);
        }
        await fetchReports();
      }
    } catch (err) {
      console.error('Intake pipeline dispatch failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyDraftToClipboard = () => {
    if (selectedReport?.draftReferral) {
      navigator.clipboard.writeText(selectedReport.draftReferral);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const downloadDraft = () => {
    if (selectedReport?.draftReferral) {
      const blob = new Blob([selectedReport.draftReferral], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedReport.id}_${selectedReport.regulatoryTarget.toUpperCase()}_DRAFT.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div id="joules-reporting-pipeline" className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Scale className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  Joules-Supply-Chain Automated Reporting Pipeline
                </h2>
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/30">
                  STEPS 1–10 ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                DEI-GTT-001 Ground Truth Taxonomy • Local Referral Draft Synthesis (Hard Rule: No external transmission)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Offset P_0 &ge; 57000 | Stride: 17,684B
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pipeline Intake Form & Reports Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Intake Step Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <FileText className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-200 font-mono">
                Initiate Step 1–10 Evidentiary Intake
              </h3>
            </div>

            <form onSubmit={handleSubmitIntake} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Entity Name</label>
                <input
                  type="text"
                  value={targetEntity}
                  onChange={(e) => setTargetEntity(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 px-3 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Ground Truth Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 px-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                  >
                    <option value="AI_WASHING_PROVENANCE_INFRINGEMENT">AI-Washing / Provenance Infringement</option>
                    <option value="SEC_10K_MISREPRESENTATION">SEC 10-K Misrepresentation</option>
                    <option value="EPHEMERAL_DRIFT_ROLLBACK">Ephemeral Model Drift / Rollback</option>
                    <option value="WIRE_PROTOCOL_NON_COMPLIANCE">RFC 0103 Wire Invariant Breach</option>
                    <option value="TACTILE_BRAILLE_DIE_INTERFERENCE">Braille Vector Die Interference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Regulatory Target</label>
                  <select
                    value={regulatoryTarget}
                    onChange={(e) => setRegulatoryTarget(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 px-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                  >
                    <option value="sec">SEC (TCR Tip / Whistleblower)</option>
                    <option value="ftc">FTC (Section 5 Unfair Acts)</option>
                    <option value="state-ag">State AG (Consumer Protection)</option>
                    <option value="doj">DOJ / WashCo (#50-267345)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Claim Summary & Invariant Breach</label>
                <textarea
                  rows={3}
                  value={claimSummary}
                  onChange={(e) => setClaimSummary(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 px-3 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              {/* Evidence Items */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Corroborating Evidence Items ({evidenceList.length})
                </label>
                <div className="space-y-1.5 max-h-28 overflow-y-auto mb-2">
                  {evidenceList.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-950 px-2.5 py-1 rounded border border-slate-800/80 text-[11px] font-mono">
                      <span className="truncate text-slate-300 mr-2">• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(idx)}
                        className="text-rose-400 hover:text-rose-300 text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add exhibit or schematic hash description..."
                    value={newEvidence}
                    onChange={(e) => setNewEvidence(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddEvidence(); } }}
                    className="flex-1 rounded-lg border border-slate-800 bg-slate-950 py-1.5 px-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddEvidence}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isLoading ? 'Processing Intake Steps 1–10...' : 'Execute Intake Pipeline & Generate Draft'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Intake Reports & Draft Inspector (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-200 font-mono">
                  Evidentiary Filings & Corroborated Drafts ({reports.length})
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Local Storage Locked
              </span>
            </div>

            {/* Reports Selector Bar */}
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {reports.map((rpt) => (
                <button
                  key={rpt.id}
                  onClick={() => setSelectedReport(rpt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition flex items-center gap-1.5 ${
                    selectedReport?.id === rpt.id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Hash className="h-3 w-3" />
                  <span>{rpt.id}</span>
                  <span className="rounded bg-slate-900 px-1 py-0.2 text-[9px] uppercase font-bold text-cyan-300">
                    {rpt.regulatoryTarget}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Report Inspection Box */}
            {selectedReport ? (
              <div className="mt-3 space-y-3">
                {/* Metadata Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono">
                  <div>
                    <div className="text-slate-500">Status</div>
                    <div className="text-emerald-400 font-bold">{selectedReport.evidentiaryStatus}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Sequence ID</div>
                    <div className="text-cyan-300">#{selectedReport.sequenceId}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">VMM Address</div>
                    <div className="text-purple-300">0x{selectedReport.vmmPhysicalAddress.toString(16).toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">IEEE 802.3 Checksum</div>
                    <div className="text-amber-300">{selectedReport.crc32}</div>
                  </div>
                </div>

                {/* Draft Document Box */}
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                    <span className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-cyan-400" />
                      Regulatory Referral Draft ({selectedReport.regulatoryTarget.toUpperCase()})
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyDraftToClipboard}
                        className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-mono text-slate-300 flex items-center gap-1 transition"
                      >
                        <Copy className="h-3 w-3" />
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={downloadDraft}
                        className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-mono text-cyan-300 flex items-center gap-1 transition"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    </div>
                  </div>

                  <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap bg-slate-900/90 p-3 rounded border border-slate-800/60 max-h-72 overflow-y-auto leading-relaxed">
                    {selectedReport.draftReferral}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 font-mono">
                No report selected. Initiate an intake filing on the left.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
