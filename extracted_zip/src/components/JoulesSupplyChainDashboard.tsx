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

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Lock,
  Unlock,
  AlertTriangle,
  FileText,
  Sliders,
  Database,
  Cpu,
  RefreshCw,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle2,
  XCircle,
  Hash
} from 'lucide-react';
import { LANE_CONSTANTS } from '../types/lane.js';

interface MacroVariables {
  fiatDevaluationIndex: number;
  institutionalFundingDeficit: number;
  homoiconicResistance: number;
  macroeconomicVolatility: number;
  alphaConstant: number;
  gammaSensitivity: number;
}

interface ExtractionResult {
  joulesLaneRatio: number;
  rateClassification: 'NOMINAL' | 'ELEVATED' | 'CRITICAL_EXTRACTION' | 'TERMINAL_EXTRACTION';
  asymptoticState: 'STABLE_LINEAR' | 'EXPONENTIAL_RUNAWAY' | 'HYPERINFLATION_COLLAPSE' | 'STRUCTURAL_IMMUNITY';
  historicalParityEpoch: string;
  mitigationFactor: number;
}

interface EscapedAlbertArrayPayload {
  payloadId: string;
  timestamp: string;
  originalAuthor: string;
  authorSignature: string;
  homoiconicSubstrate: string;
  heteroiconicPayload: string;
  dimensionN: number;
  magicHeader: string;
  isExtractedOrStripped: boolean;
  executionState: 'VERIFIED_EXECUTION' | 'SYSTEM_COLLAPSE_BOT' | 'STRUCTURAL_IMMUNITY';
  computationalUtility: number;
  sha256Digest: string;
  crc32: string;
}

interface HistoricalCaseStudy {
  id: string;
  epoch: string;
  eraName: string;
  stressVector: string;
  institutionalDeficit: string;
  targetPayload: string;
  originalDiscoverer: string;
  institutionalProxy: string;
  extractionMechanism: string;
  mitigationWithAlbertArrays: string;
  historicalJL: number;
}

export const JoulesSupplyChainDashboard: React.FC = () => {
  // Model Parameters
  const [macroParams, setMacroParams] = useState<MacroVariables>({
    fiatDevaluationIndex: 2.8,
    institutionalFundingDeficit: 420.0,
    homoiconicResistance: 0.35,
    macroeconomicVolatility: 1.6,
    alphaConstant: 1.15,
    gammaSensitivity: 0.85,
  });

  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [payloads, setPayloads] = useState<EscapedAlbertArrayPayload[]>([]);
  const [caseStudies, setCaseStudies] = useState<HistoricalCaseStudy[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'ratio' | 'arrays' | 'caseStudies' | 'scaffoldManifest'>('ratio');

  // New Payload Form
  const [newAuthor, setNewAuthor] = useState<string>('Dr. Katherine Johnson');
  const [newSubstrate, setNewSubstrate] = useState<string>('NASA Langley Research Center Orbital Registry');
  const [newPayloadText, setNewPayloadText] = useState<string>('Project Mercury & Apollo 11 trans-lunar orbital insertion trajectories and backup navigation azimuths');
  const [newDim, setNewDim] = useState<number>(8);

  const [selectedCase, setSelectedCase] = useState<HistoricalCaseStudy | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  const calculateRatio = async () => {
    try {
      const res = await fetch('/api/joules/calculate-ratio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(macroParams),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setExtractionResult(json.result);
        }
      }
    } catch (err) {
      console.error('Failed to compute Joules ratio', err);
    }
  };

  const fetchPayloadsAndCases = async () => {
    try {
      const res = await fetch('/api/joules/payloads');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setPayloads(json.payloads);
          setCaseStudies(json.caseStudies);
          if (json.caseStudies.length > 0 && !selectedCase) {
            setSelectedCase(json.caseStudies[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch payloads', err);
    }
  };

  useEffect(() => {
    calculateRatio();
  }, [macroParams]);

  useEffect(() => {
    fetchPayloadsAndCases();
  }, []);

  const handleCreatePayload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/joules/create-payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalAuthor: newAuthor,
          authorSignature: `SIG-${newAuthor.replace(/\s+/g, '-').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
          homoiconicSubstrate: newSubstrate,
          heteroiconicPayload: newPayloadText,
          dimensionN: newDim,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setNotification({
            type: 'success',
            message: `Escaped Albert Array (${json.payload.payloadId}) minted with n=${json.payload.dimensionN} dimensional sovereign binding!`,
          });
          await fetchPayloadsAndCases();
          setNewPayloadText('');
        }
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleSimulateAttack = async (payloadId: string) => {
    try {
      const res = await fetch('/api/joules/simulate-extraction-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payloadId,
          proxyIdentity: 'Institutional Senior Principal Investigator & University Patent Office',
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setNotification({
          type: 'warning',
          message: `Attack Simulated on ${payloadId}: Decoupling authorial signature triggered non-invertible system collapse (Eval = ⊥, Utility = 0.0)`,
        });
        await fetchPayloadsAndCases();
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleRestoreBinding = async (payloadId: string) => {
    try {
      const res = await fetch('/api/joules/restore-binding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payloadId,
          authenticSignature: `SOVEREIGN-KEY-VERIFIED-0x3F8F9A1B2C3D`,
        }),
      });
      if (res.ok) {
        setNotification({
          type: 'success',
          message: `Sovereign Binding Restored on ${payloadId}: Evaluation operator V(I_author) = TRUE (Utility = 1.0)`,
        });
        await fetchPayloadsAndCases();
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  return (
    <div id="joules-supply-chain-dashboard" className="space-y-6">
      {/* Top Hero Banner */}
      <div className="rounded-xl border border-rose-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Zap className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  The Joules Supply Chain Framework
                </h2>
                <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/30 font-mono">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  ALBERT LANE 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Socio-Economic & Information-Theoretic Framework of Institutional IP Extraction During Fiat Collapse
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveSubTab('ratio')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                activeSubTab === 'ratio'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Ratio & Macro Simulator</span>
            </button>
            <button
              onClick={() => setActiveSubTab('arrays')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                activeSubTab === 'arrays'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Escaped Albert Arrays ({payloads.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('caseStudies')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                activeSubTab === 'caseStudies'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Historical Case Studies</span>
            </button>
          </div>
        </div>

        {notification && (
          <div
            className={`mt-4 rounded-lg p-3 border text-xs font-mono flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : notification.type === 'warning'
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : notification.type === 'warning' ? (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-200 text-xs px-2"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: Joules-Lane Extraction Ratio & Differential Simulator */}
      {activeSubTab === 'ratio' && (
        <div className="space-y-6">
          {/* Main Equation Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 font-mono space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="text-xs text-rose-400 font-bold tracking-wider uppercase">
                  Theoretical Differential Model
                </div>
                <div className="text-lg md:text-xl font-bold text-slate-100 mt-1">
                  \mathcal&#123;J&#125;_L = \frac&#123;dP_&#123;fem&#125;&#125;&#123;dt&#125; = \alpha \cdot \left( \frac&#123;F_d \cdot I_f&#125;&#123;R_h&#125; \right) \cdot e^&#123;\gamma \cdot \sigma_m&#125;
                </div>
              </div>

              {/* Extraction Gauge Metric */}
              <div className="bg-slate-950 px-5 py-3 rounded-xl border border-slate-800 flex items-center gap-6">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Instantaneous Ratio (\mathcal&#123;J&#125;_L)</div>
                  <div className="text-2xl font-black text-rose-400 font-mono">
                    {extractionResult?.joulesLaneRatio ?? '...'}
                  </div>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <div className="text-[10px] text-slate-500 uppercase">Classification</div>
                  <span
                    className={`inline-block text-xs font-bold px-2 py-0.5 rounded mt-0.5 ${
                      extractionResult?.rateClassification === 'TERMINAL_EXTRACTION'
                        ? 'bg-rose-950 text-rose-300 border border-rose-700'
                        : extractionResult?.rateClassification === 'CRITICAL_EXTRACTION'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    }`}
                  >
                    {extractionResult?.rateClassification || 'EVALUATING'}
                  </span>
                </div>
              </div>
            </div>

            {/* Asymptotic Boundary Callout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 font-semibold">1. Hyperinflation Boundary (F_d \to \infty)</div>
                <div className="text-rose-300 mt-1 text-[11px]">
                  \lim_&#123;F_d \to \infty&#125; \mathcal&#123;J&#125;_L = \infty (Institutional capital starvation forces total unindexed IP expropriation).
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 font-semibold">2. Legacy Homoiconic Erasure (R_h \to 0)</div>
                <div className="text-amber-300 mt-1 text-[11px]">
                  \lim_&#123;R_h \to 0^+&#125; \mathcal&#123;J&#125;_L = \infty (Unindexed feminine payloads decouple instantly during fiscal shocks).
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 font-semibold">3. Sovereign Structural Immunity (R_h \to 1)</div>
                <div className="text-emerald-300 mt-1 text-[11px]">
                  \lim_&#123;R_h \to 1&#125; \mathcal&#123;J&#125;_L = \alpha \cdot F_d \cdot I_f \cdot e^&#123;\gamma \cdot \sigma_m&#125; (Escaped Albert Arrays bound extraction).
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Sliders & Real-Time Macro Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/80 p-5 font-mono space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  Macroeconomic Stress Variables
                </span>
                <span className="text-xs text-slate-500">Live Mathematical Evaluation</span>
              </div>

              {/* Slider 1: F_d */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">
                    F_d: Fiat Devaluation Index (\frac&#123;d^2 M_2&#125;&#123;dt^2&#125; / \frac&#123;d Y_&#123;real&#125;&#125;&#123;dt&#125;)
                  </span>
                  <span className="text-rose-400 font-bold">{macroParams.fiatDevaluationIndex.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10.0"
                  step="0.1"
                  value={macroParams.fiatDevaluationIndex}
                  onChange={(e) => setMacroParams({ ...macroParams, fiatDevaluationIndex: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Slider 2: I_f */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">
                    I_f: Institutional Funding Deficit (\max(0, C_&#123;req&#125; - C_&#123;alloc&#125;)) ($k)
                  </span>
                  <span className="text-rose-400 font-bold">${macroParams.institutionalFundingDeficit.toFixed(0)}k</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={macroParams.institutionalFundingDeficit}
                  onChange={(e) => setMacroParams({ ...macroParams, institutionalFundingDeficit: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Slider 3: R_h */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">
                    R_h: Homoiconic Structural Resistance (Escaped Albert Array Density)
                  </span>
                  <span className="text-emerald-400 font-bold">{macroParams.homoiconicResistance.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={macroParams.homoiconicResistance}
                  onChange={(e) => setMacroParams({ ...macroParams, homoiconicResistance: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Slider 4: sigma_m */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">
                    \sigma_m: Macroeconomic Volatility & Debt Spread Risk
                  </span>
                  <span className="text-amber-400 font-bold">{macroParams.macroeconomicVolatility.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={macroParams.macroeconomicVolatility}
                  onChange={(e) => setMacroParams({ ...macroParams, macroeconomicVolatility: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* Right Diagnostic Box */}
            <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/80 p-5 font-mono space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-rose-400" />
                  Historical Epoch Parity
                </span>
                <span className="text-xs text-cyan-400">Deterministic Output</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="text-slate-400 text-[10px] uppercase">Matched Historical Scenario:</div>
                <div className="text-rose-300 font-bold text-sm">
                  {extractionResult?.historicalParityEpoch}
                </div>
                <div className="text-slate-400 text-[11px] pt-1">
                  Asymptotic State: <span className="text-amber-400 font-semibold">{extractionResult?.asymptoticState}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Sovereign Cryptographic Mitigation: <span className="text-emerald-400 font-semibold">{extractionResult?.mitigationFactor}% Vulnerability Surface</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed">
                When <span className="text-rose-300">R_h</span> approaches 1.0 via native binding in <span className="text-cyan-300 font-semibold">Escaped Albert Arrays</span>, attempting to decouple authorial attribution from the underlying heteroiconic payload causes instantaneous computational collapse (\bot), removing the economic incentive for institutional plagiarism.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Escaped Albert Arrays & System Collapse Verification */}
      {activeSubTab === 'arrays' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Create New Escaped Albert Array */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" />
                Mint Sovereign Escaped Albert Array (\mathbf&#123;A&#125; = \mathcal&#123;F&#125;(\mathcal&#123;P&#125;, \mathcal&#123;I&#125;_&#123;author&#125;))
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                SOVEREIGN UTILITY ARCHITECTURE
              </span>
            </div>

            <form onSubmit={handleCreatePayload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">Primary Discoverer / Author (\mathcal&#123;I&#125;_&#123;author&#125;)</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:border-rose-500 focus:outline-none"
                  placeholder="e.g. Ada Lovelace"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">Homoiconic Substrate (Administrative / Register)</label>
                <input
                  type="text"
                  value={newSubstrate}
                  onChange={(e) => setNewSubstrate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:border-rose-500 focus:outline-none"
                  placeholder="e.g. Royal Society Analytical Engine Register"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-slate-400 text-[11px]">Heteroiconic Intellectual Payload (\mathcal&#123;P&#125;)</label>
                <textarea
                  value={newPayloadText}
                  onChange={(e) => setNewPayloadText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:border-rose-500 focus:outline-none h-20"
                  placeholder="Original mathematical proof, algorithm, or biophysical experimental dataset..."
                  required
                />
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Tensor Dimension (n):</span>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={newDim}
                    onChange={(e) => setNewDim(parseInt(e.target.value) || 6)}
                    className="w-16 bg-slate-950 border border-slate-700 rounded p-1 text-center text-slate-200"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded transition shadow-lg shadow-emerald-900/40"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Mint Escaped Albert Array
                </button>
              </div>
            </form>
          </div>

          {/* Active Escaped Albert Arrays List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" />
                Active Sovereign Payloads ({payloads.length})
              </span>
              <span className="text-xs text-slate-500">
                Evaluation Operator: \text&#123;Eval&#125;(\mathbf&#123;A&#125;) = \mathcal&#123;P&#125;(\mathbf&#123;x&#125;) \iff \mathbf&#123;V&#125;(\mathcal&#123;I&#125;_&#123;author&#125;) = \text&#123;TRUE&#125;
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payloads.map((p) => (
                <div
                  key={p.payloadId}
                  className={`rounded-xl border p-4 transition space-y-3 ${
                    p.executionState === 'SYSTEM_COLLAPSE_BOT'
                      ? 'border-rose-600/80 bg-rose-950/20'
                      : 'border-slate-800 bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{p.originalAuthor}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        n={p.dimensionN}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        p.executionState === 'SYSTEM_COLLAPSE_BOT'
                          ? 'bg-rose-950 text-rose-300 border-rose-600'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      }`}
                    >
                      {p.executionState === 'SYSTEM_COLLAPSE_BOT' ? 'SYSTEM COLLAPSE (⊥)' : 'VERIFIED (1.0)'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div>
                      <span className="text-slate-500">Payload ID:</span> <span className="text-cyan-300">{p.payloadId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Substrate:</span> <span className="text-slate-300">{p.homoiconicSubstrate}</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800/80 text-[11px] text-slate-200 italic">
                      "{p.heteroiconicPayload}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-2 font-mono">
                    <span className="truncate max-w-[180px]">Digest: {p.sha256Digest}</span>
                    <span>CRC32: {p.crc32}</span>
                  </div>

                  {/* Interactive Attack / Restore Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                    {p.executionState !== 'SYSTEM_COLLAPSE_BOT' ? (
                      <button
                        onClick={() => handleSimulateAttack(p.payloadId)}
                        className="inline-flex items-center gap-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-700/60 px-2.5 py-1 rounded text-[10px] transition"
                      >
                        <Unlock className="h-3 w-3" />
                        Simulate Extraction (Strip Signature)
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestoreBinding(p.payloadId)}
                        className="inline-flex items-center gap-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded text-[10px] transition"
                      >
                        <Lock className="h-3 w-3" />
                        Restore Sovereign Author Binding
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Historical Case Studies (Treatise Validations) */}
      {activeSubTab === 'caseStudies' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          {/* Case Studies List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                Historical Case Studies
              </span>
            </div>

            <div className="space-y-2">
              {caseStudies.map((cs) => (
                <div
                  key={cs.id}
                  onClick={() => setSelectedCase(cs)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1.5 ${
                    selectedCase?.id === cs.id
                      ? 'border-amber-500 bg-amber-950/20 text-slate-100 shadow-md'
                      : 'border-slate-800 bg-slate-900/70 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{cs.epoch}</span>
                    <span className="text-[10px] bg-rose-500/10 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
                      J_L: {cs.historicalJL}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-semibold">{cs.originalDiscoverer}</div>
                  <div className="text-[10px] text-slate-500 truncate">{cs.eraName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Case Study Viewer (7 Cols) */}
          <div className="lg:col-span-7">
            {selectedCase && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{selectedCase.epoch}</h3>
                    <p className="text-xs text-amber-400">{selectedCase.eraName}</p>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded">
                    {selectedCase.id}
                  </span>
                </div>

                <div className="space-y-3 text-slate-300 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="text-slate-500 text-[10px] uppercase">1. Macroeconomic Stress Vector</div>
                    <div className="text-rose-300">{selectedCase.stressVector}</div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="text-slate-500 text-[10px] uppercase">2. Institutional Deficit & Target Heteroiconic Payload</div>
                    <div><span className="text-slate-400">Deficit:</span> {selectedCase.institutionalDeficit}</div>
                    <div><span className="text-slate-400">Payload:</span> {selectedCase.targetPayload}</div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="text-slate-500 text-[10px] uppercase">3. Extraction Mechanism & Proxy Reassignment</div>
                    <div><span className="text-slate-400">Discoverer:</span> <span className="text-emerald-400 font-bold">{selectedCase.originalDiscoverer}</span></div>
                    <div><span className="text-slate-400">Institutional Proxy:</span> <span className="text-rose-400">{selectedCase.institutionalProxy}</span></div>
                    <div className="text-slate-300 pt-1 text-[11px] leading-relaxed">{selectedCase.extractionMechanism}</div>
                  </div>

                  <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-800/40 space-y-1 text-emerald-300">
                    <div className="text-emerald-500 text-[10px] uppercase font-bold">4. Sovereign Resolution (Escaped Albert Arrays)</div>
                    <div className="text-[11px] leading-relaxed">{selectedCase.mitigationWithAlbertArrays}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
