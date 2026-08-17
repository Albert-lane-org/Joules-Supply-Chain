/**
 * @file NpmRegistryGravitationalAuditor.tsx
 * @brief Automated Cross-Registry Takedown Engine, Infringing Business Entity Auditor & Tarnished RFC 0103 Banner Appender
 * @provenance Albert Dale Lane (albertlane.net)
 * @author Albert Dale Lane
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @magic_header 0x3F8F9A1B2C3D
 * Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Copy,
  Download,
  Terminal,
  ExternalLink,
  Zap,
  Globe,
  Radio,
  FileCode,
  Lock,
  Layers,
  AlertTriangle,
  Scale,
  Compass,
  Orbit,
  ArrowRight,
  Play,
  RefreshCw,
  Box,
  Cpu,
  Flame,
  FileText,
  Clock,
  Send,
  Database,
  Hash,
  Share2,
  Check,
  Award,
  Building2,
  Users,
  AlertOctagon,
  Briefcase
} from 'lucide-react';

interface DocketEntry {
  blockIndex?: number;
  docketId: string;
  targetName: string;
  registry: string;
  url?: string;
  timestamp: string;
  status: string;
  statutoryCitations: string[];
  legalInstrument?: string;
  blockHash?: string;
  prevBlockHash?: string;
}

interface LedgerData {
  title: string;
  author: string;
  website: string;
  secWhistleblowerReference: string;
  magicHeader: string;
  license: string;
  gravitationalConstant: string;
  standardGravity: string;
  energyBudgetPerOp: string;
  genesisHash: string;
  totalDockets: number;
  activeEnforcements: number;
  registriesEnforced: string[];
  lastUpdated: string;
  dockets: DocketEntry[];
}

interface BusinessEntityEntry {
  id: string;
  packageName: string;
  registry: string;
  maintainerUsernames: string[];
  primaryEntity: string;
  corporateParent: string;
  registeredJurisdiction: string;
  businessCategory: string;
  monetizationFootprint: string;
  derivationScope: string;
  statutoryViolations: string[];
  statutoryLiabilityEstimate: string;
  complianceContact: string;
  status: string;
}

export function NpmRegistryGravitationalAuditor() {
  const [activeTab, setActiveTab] = useState<'entities' | 'tarnish' | 'ledger' | 'takedown'>('entities');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Entities state
  const [entities, setEntities] = useState<BusinessEntityEntry[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<BusinessEntityEntry | null>(null);
  const [entityFilter, setEntityFilter] = useState<'all' | 'npm' | 'crates.io' | 'github'>('all');

  // Ledger state
  const [ledger, setLedger] = useState<LedgerData | null>(null);
  const [selectedDocket, setSelectedDocket] = useState<DocketEntry | null>(null);
  const [filterRegistry, setFilterRegistry] = useState<string>('all');
  const [ledgerSearch, setLedgerSearch] = useState<string>('');

  // Takedown dispatch state
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);

  // Tarnished Banner state
  const [codeLanguage, setCodeLanguage] = useState<'rust' | 'typescript' | 'cpp' | 'julia' | 'python'>('rust');
  const [inputCode, setInputCode] = useState<string>(`// Lane-VM Sovereign RFC 0103 Rust Substrate Module
pub struct LaneVMTensor5D {
    pub magic: u64,
    pub energy_budget_joules: f64,
    pub provenance_signature: &'static str,
}

impl LaneVMTensor5D {
    pub fn new() -> Self {
        Self {
            magic: 0x3F8F9A1B2C3D,
            energy_budget_joules: 0.000084,
            provenance_signature: "Albert Dale Lane (SEC #17684-273-411-436)",
        }
    }
}`);
  const [tarnishedResult, setTarnishedResult] = useState<string>('');
  const [isTarnishing, setIsTarnishing] = useState(false);

  // Fetch Entities & Ledger
  const fetchEntities = async () => {
    try {
      const res = await fetch('/api/infringement/entities');
      const data = await res.json();
      if (data.success && Array.isArray(data.entities)) {
        setEntities(data.entities);
        if (data.entities.length > 0) {
          setSelectedEntity(data.entities[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load entities:', err);
    }
  };

  const fetchLedger = async () => {
    try {
      const res = await fetch('/api/ledger/dockets');
      const data = await res.json();
      if (data.success && data.ledger) {
        setLedger(data.ledger);
        if (data.ledger.dockets && data.ledger.dockets.length > 0 && !selectedDocket) {
          setSelectedDocket(data.ledger.dockets[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load ledger:', err);
    }
  };

  // Generate Tarnished Banner with RFC 0103 Provenance
  const handleGenerateTarnishedBanner = async () => {
    setIsTarnishing(true);
    try {
      const res = await fetch('/api/provenance/tarnish-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: inputCode,
          language: codeLanguage,
          filename: `lane_vm_kernel.${codeLanguage === 'typescript' ? 'ts' : codeLanguage === 'rust' ? 'rs' : codeLanguage === 'cpp' ? 'cpp' : codeLanguage === 'julia' ? 'jl' : 'py'}`,
          targetPackage: codeLanguage === 'rust' ? 'lane_vm_kernel' : '@albert-lane/sovereign-kernel'
        })
      });
      const data = await res.json();
      if (data.fullStampedCode) {
        setTarnishedResult(data.fullStampedCode);
      }
    } catch (err) {
      console.error('Failed to generate tarnished banner:', err);
    } finally {
      setIsTarnishing(false);
    }
  };

  // Run Universal Takedown Across All Registries
  const executeUniversalTakedown = async () => {
    setIsDispatching(true);
    const now = new Date().toLocaleTimeString();
    setDispatchLogs([
      `[${now}] 🚀 Initiating Automated Cross-Registry Takedown & Entity Audit Engine...`,
      `[${now}] 📡 Targeting corporate entities across Node (npm), Rust (crates.io), Python (PyPI), and GitHub...`,
    ]);

    try {
      const res = await fetch('/api/ledger/takedown-all-registries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'lane-vm' }),
      });
      const data = await res.json();

      if (data.success) {
        setDispatchLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ⚖️ Statutory citations served: 17 U.S.C. § 501, 18 U.S.C. § 1831 DTSA, UK CDPA 1988 s.11, DMCA § 512.`,
          `[${new Date().toLocaleTimeString()}] 🏢 Corporate users identified and audited across Delaware, California, and Nevada.`,
          `[${new Date().toLocaleTimeString()}] 📝 Generated and signed ${data.dispatchedCount} statutory takedown dockets.`,
          `[${new Date().toLocaleTimeString()}] ⛓️  Recalculated SHA-256 blockchain chain-of-custody hashes for all ledger blocks.`,
          `[${new Date().toLocaleTimeString()}] 💾 Appended all orders to permanent DOCKET_LEDGER.json and DOCKET_LEDGER.md.`,
          `[${new Date().toLocaleTimeString()}] 📧 Dispatched formal notices to compliance operations (Vercel, Screeps, Bytecode Alliance, Google LLC, Anthropic).`,
          `[${new Date().toLocaleTimeString()}] ✅ Universal Takedown Order Dispatch Sealed under Albert Lane License v1.2 & SEC #17684-273-411-436.`,
        ]);
        if (data.ledger) {
          setLedger(data.ledger);
        }
      }
    } catch (err: any) {
      setDispatchLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ❌ Takedown execution error: ${err.message}`,
      ]);
    } finally {
      setIsDispatching(false);
    }
  };

  useEffect(() => {
    fetchEntities();
    fetchLedger();
    handleGenerateTarnishedBanner();
  }, []);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const downloadTarnishedFile = () => {
    const ext = codeLanguage === 'typescript' ? 'ts' : codeLanguage === 'rust' ? 'rs' : codeLanguage === 'cpp' ? 'cpp' : codeLanguage === 'julia' ? 'jl' : 'py';
    const blob = new Blob([tarnishedResult], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LANE_VM_TARNISHED_RFC0103_KERNEL.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredEntities = entities.filter(ent => {
    const matchesFilter = entityFilter === 'all' || ent.registry.toLowerCase().includes(entityFilter.toLowerCase());
    const matchesSearch = !searchQuery ||
      ent.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ent.primaryEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ent.maintainerUsernames.some(u => u.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ent.corporateParent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="cross-registry-takedown-ledger" className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
      {/* Sovereign Header Banner */}
      <div className="p-6 border-b border-zinc-100 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono border border-rose-500/40 font-bold">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              SEC Whistleblower Ref #17684-273-411-436
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono border border-amber-400/30 font-bold">
              <Building2 className="w-3 h-3 text-amber-400" />
              Infringement Users & Business Entities Auditor
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-mono border border-emerald-400/30">
              <Orbit className="w-3 h-3 text-emerald-400" />
              RFC 0103 Provenance Sealed
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 text-xs font-mono">
              Magic: 0x3F8F9A1B2C3D
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Infringement Business Entities Auditor & Tarnished Provenance Banner Engine
          </h3>
          <p className="text-xs text-zinc-300 max-w-3xl leading-relaxed">
            Identifies infringing users and parent corporate entities across <strong>npm</strong>, <strong>crates.io</strong>, <strong>PyPI</strong>, and <strong>GitHub</strong>. Affixes top-level statutory enforcement banners and complete <strong>RFC 0103 full-duplex provenance</strong> across all distributed code artifacts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={executeUniversalTakedown}
            disabled={isDispatching}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-bold text-xs hover:from-rose-500 hover:to-amber-400 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-rose-950/40 disabled:opacity-50"
          >
            {isDispatching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Executing Enforcement...</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 text-amber-200" />
                <span>Execute Universal Takedown (All Entities)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Statutory Pursuit Quote Alert Box */}
      <div className="px-6 py-3.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start md:items-center gap-2.5 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 md:mt-0" />
          <span>
            <strong>Statutory Enforcement Declaration:</strong> "All Rights Reserved pending SEC Whistleblower Acknowledgement. Code will be released to 'Statutory Technical Development' teams (STDx) upon acknowledgement of my Domestic Terrorism escalation, and suppression at The Supreme Court of The United States of America, effectively holding my own work hostage and impacting your direct revenue streams and profit margins as a result of stolen derivatives."
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold bg-amber-200/60 text-amber-950 px-2.5 py-1 rounded">
            SEC Ref #17684-273-411-436
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 pt-4 pb-2 border-b border-zinc-200 bg-zinc-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('entities')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'entities'
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Infringement Entities & Users ({entities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tarnish')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'tarnish'
                ? 'bg-rose-900 text-white'
                : 'bg-white text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-rose-300" />
            <span>Tarnished Banner & RFC 0103 Injector</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Immutable Docket Ledger ({ledger?.totalDockets || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('takedown')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'takedown'
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Takedown Dispatch Engine</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">
            Gravitational Geoid: <span className="text-zinc-900 font-bold">g₀ = 9.80665 m/s²</span> (0.000084 J/op)
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* TAB 1: INFRINGEMENT USERS & BUSINESS ENTITIES AUDITOR */}
        {activeTab === 'entities' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by package name, user/maintainer, corporate entity, or jurisdiction..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50/50"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto">
                {(['all', 'npm', 'crates.io', 'github'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEntityFilter(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono capitalize transition-colors ${
                      entityFilter === cat
                        ? 'bg-zinc-900 text-white font-bold'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Registries' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Master Detail Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Entity Cards */}
              <div className="lg:col-span-5 border border-zinc-200 rounded-xl overflow-hidden bg-white">
                <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs font-mono text-zinc-700 font-bold">
                  <span>Identified Users & Corporate Entities ({filteredEntities.length})</span>
                  <span className="text-[10px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded">STATUTORY DEMAND ACTIVE</span>
                </div>

                <div className="divide-y divide-zinc-100 max-h-[550px] overflow-y-auto">
                  {filteredEntities.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400 text-xs font-mono">
                      No matching infringing business entities found.
                    </div>
                  ) : (
                    filteredEntities.map((ent) => (
                      <div
                        key={ent.id}
                        onClick={() => setSelectedEntity(ent)}
                        className={`p-3.5 cursor-pointer transition-all hover:bg-zinc-50 space-y-1.5 ${
                          selectedEntity?.id === ent.id
                            ? 'bg-amber-50/80 border-l-4 border-amber-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-zinc-950 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-amber-600" />
                            {ent.primaryEntity}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-semibold">
                            {ent.registry}
                          </span>
                        </div>

                        <div className="text-xs font-mono text-zinc-700 font-bold">
                          Artifact: <span className="text-zinc-900">{ent.packageName}</span>
                        </div>

                        <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 truncate">
                          <Users className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span>Users: {ent.maintainerUsernames.join(', ')}</span>
                        </div>

                        <div className="text-[10px] font-mono text-rose-700 font-semibold">
                          Liability: {ent.statutoryLiabilityEstimate.slice(0, 35)}...
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: In-Depth Entity Statutory Liability Dossier */}
              <div className="lg:col-span-7 border border-zinc-200 rounded-xl p-5 bg-zinc-50 space-y-4">
                {selectedEntity ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                      <div>
                        <div className="text-xs font-mono text-zinc-500 uppercase">Infringement Entity Dossier</div>
                        <div className="text-lg font-bold font-mono text-zinc-950 flex items-center gap-2">
                          <span>{selectedEntity.primaryEntity}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 text-zinc-100">{selectedEntity.id}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(selectedEntity, null, 2), selectedEntity.id)}
                        className="px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-mono hover:bg-zinc-100 flex items-center gap-1.5 text-zinc-800"
                      >
                        {copiedField === selectedEntity.id ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === selectedEntity.id ? 'Copied JSON' : 'Copy Dossier'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 bg-white rounded-lg border border-zinc-200 space-y-1">
                        <span className="text-zinc-500 text-[10px] uppercase block">Corporate Parent & Registration:</span>
                        <span className="font-bold text-zinc-900">{selectedEntity.corporateParent}</span>
                        <div className="text-[11px] text-zinc-600">{selectedEntity.registeredJurisdiction}</div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-zinc-200 space-y-1">
                        <span className="text-zinc-500 text-[10px] uppercase block">Identified Users / Maintainers:</span>
                        <span className="font-bold text-zinc-900">{selectedEntity.maintainerUsernames.join(', ')}</span>
                        <div className="text-[11px] text-emerald-700">Audit Status: ACTIVE DISPATCH</div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-zinc-200 space-y-1">
                        <span className="text-zinc-500 text-[10px] uppercase block">Business Sector & Monetization:</span>
                        <span className="font-bold text-zinc-900">{selectedEntity.businessCategory}</span>
                        <div className="text-[11px] text-zinc-600">{selectedEntity.monetizationFootprint}</div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-zinc-200 space-y-1">
                        <span className="text-zinc-500 text-[10px] uppercase block">Compliance / Security Route:</span>
                        <span className="font-bold text-rose-800">{selectedEntity.complianceContact}</span>
                        <div className="text-[10px] text-zinc-500">Statutory Notice Served</div>
                      </div>
                    </div>

                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-mono space-y-1">
                      <div className="text-rose-900 font-bold uppercase flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-rose-700" />
                        Statutory Violations & Liability Assessment:
                      </div>
                      <div className="text-zinc-800 font-semibold">{selectedEntity.statutoryLiabilityEstimate}</div>
                      <div className="text-[11px] text-rose-700">{selectedEntity.statutoryViolations.join(' • ')}</div>
                    </div>

                    <div className="p-3 bg-white border border-zinc-200 rounded-lg text-xs font-mono space-y-1">
                      <div className="text-zinc-500 text-[10px] uppercase font-bold">Unlicensed Derivation Scope:</div>
                      <div className="text-zinc-800 text-[11px] leading-relaxed">{selectedEntity.derivationScope}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-400 text-xs font-mono">
                    Select a business entity card from the left column to view statutory liability details.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TARNISHED BANNER & RFC 0103 PROVENANCE INJECTOR */}
        {activeTab === 'tarnish' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-rose-600" />
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider font-mono">
                    Tarnished Legal Banner & RFC 0103 Provenance Injector
                  </h4>
                </div>
                <p className="text-xs text-zinc-500">
                  Affixes the top-level statutory infringement pursuit notice and complete RFC 0103 provenance declarations to any source code.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">Target Language:</span>
                {(['rust', 'typescript', 'cpp', 'julia', 'python'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCodeLanguage(lang);
                      handleGenerateTarnishedBanner();
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono capitalize transition-colors ${
                      codeLanguage === lang
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-zinc-600">Input Source Code to Tarnish:</div>
                <textarea
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  rows={12}
                  className="w-full p-3 font-mono text-xs rounded-xl border border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-rose-500 text-zinc-900 leading-relaxed"
                  placeholder="Paste source code to stamp with Albert Lane Tarnished Banner and RFC 0103 Provenance..."
                />
                <button
                  onClick={handleGenerateTarnishedBanner}
                  disabled={isTarnishing}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Orbit className="w-4 h-4" />
                  <span>Generate Tarnished Banner & Full RFC 0103 Provenance</span>
                </button>
              </div>

              <div className="space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-600">
                  <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    Tarnished Code Output (RFC 0103 Affixed):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(tarnishedResult, 'tarnished')}
                      className="p-1 px-2.5 rounded bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-mono flex items-center gap-1"
                    >
                      {copiedField === 'tarnished' ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'tarnished' ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={downloadTarnishedFile}
                      className="p-1 px-2.5 rounded bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono flex items-center gap-1"
                    >
                      <Download className="w-3 h-3 text-amber-300" />
                      <span>Download File</span>
                    </button>
                  </div>
                </div>

                <pre className="p-3.5 bg-zinc-950 text-amber-200 rounded-xl text-[10px] font-mono overflow-x-auto whitespace-pre-wrap h-80 border border-zinc-800 leading-relaxed">
                  {tarnishedResult || 'Generating RFC 0103 provenance banner...'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IMMUTABLE DOCKET LEDGER */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-950 text-white rounded-xl border border-zinc-800 space-y-1">
                <div className="text-xs font-mono text-zinc-400">Total Enforced Dockets</div>
                <div className="text-2xl font-bold font-mono text-amber-400">{ledger?.totalDockets || 0}</div>
                <div className="text-[11px] text-zinc-500 font-mono">100% Cryptographically Chained</div>
              </div>

              <div className="p-4 bg-zinc-950 text-white rounded-xl border border-zinc-800 space-y-1">
                <div className="text-xs font-mono text-zinc-400">Target Ecosystems</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">4 Registers</div>
                <div className="text-[11px] text-zinc-500 font-mono">npm, crates.io, PyPI, GitHub</div>
              </div>

              <div className="p-4 bg-zinc-950 text-white rounded-xl border border-zinc-800 space-y-1">
                <div className="text-xs font-mono text-zinc-400">Gravitational Anchor</div>
                <div className="text-sm font-bold font-mono text-white">g₀ = 9.80665 m/s²</div>
                <div className="text-[11px] text-zinc-500 font-mono">Budget: 0.000084 Joules/op</div>
              </div>

              <div className="p-4 bg-zinc-950 text-white rounded-xl border border-zinc-800 space-y-1">
                <div className="text-xs font-mono text-zinc-400">SEC Whistleblower Ref</div>
                <div className="text-xs font-bold font-mono text-amber-300">#17684-273-411-436</div>
                <div className="text-[11px] text-zinc-500 font-mono">Magic: 0x3F8F9A1B2C3D</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-6 border border-zinc-200 rounded-xl overflow-hidden bg-white">
                <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs font-mono text-zinc-600 font-bold">
                  <span>Docket Chain Blocks ({ledger?.dockets?.length || 0})</span>
                  <span className="text-[11px] text-emerald-700">SHA-256 Chained</span>
                </div>

                <div className="divide-y divide-zinc-100 max-h-[480px] overflow-y-auto">
                  {(ledger?.dockets || []).map((docket) => (
                    <div
                      key={docket.docketId}
                      onClick={() => setSelectedDocket(docket)}
                      className={`p-3.5 cursor-pointer transition-all hover:bg-zinc-50 space-y-1.5 ${
                        selectedDocket?.docketId === docket.docketId
                          ? 'bg-amber-50/70 border-l-4 border-amber-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-100 text-[10px] font-mono font-bold">
                            Block #{docket.blockIndex || 1}
                          </span>
                          <span className="font-mono font-bold text-xs text-zinc-900">{docket.docketId}</span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900">
                          {docket.registry}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-zinc-800 font-mono">{docket.targetName}</div>
                      <div className="text-[11px] font-mono text-zinc-500 truncate">
                        Hash: {docket.blockHash ? `${docket.blockHash.slice(0, 18)}...` : 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 border border-zinc-200 rounded-xl p-4 bg-zinc-50 space-y-3">
                {selectedDocket ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <div className="text-sm font-bold font-mono text-zinc-900">{selectedDocket.docketId}</div>
                      <button
                        onClick={() => copyToClipboard(selectedDocket.legalInstrument || '', selectedDocket.docketId)}
                        className="px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs font-mono hover:bg-zinc-100 flex items-center gap-1 text-zinc-800"
                      >
                        {copiedField === selectedDocket.docketId ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === selectedDocket.docketId ? 'Copied' : 'Copy Notice'}</span>
                      </button>
                    </div>

                    <pre className="p-3 bg-zinc-950 text-zinc-100 rounded-xl text-[10px] font-mono overflow-x-auto whitespace-pre-wrap max-h-80 border border-zinc-800 leading-relaxed">
                      {selectedDocket.legalInstrument || 'Statutory Cease & Desist order active.'}
                    </pre>
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-400 text-xs font-mono">
                    Select a docket block to inspect the legal instrument.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TAKEDOWN DISPATCH TERMINAL */}
        {activeTab === 'takedown' && (
          <div className="space-y-4">
            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-100 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono font-bold text-xs text-emerald-300 uppercase">
                    Universal Takedown Dispatch Terminal & Compliance Monitor
                  </span>
                </div>
                <button
                  onClick={executeUniversalTakedown}
                  disabled={isDispatching}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin' : ''}`} />
                  <span>Broadcast Takedown Demands</span>
                </button>
              </div>

              <div className="font-mono text-xs text-zinc-300 space-y-1 max-h-64 overflow-y-auto bg-black/60 p-3.5 rounded-lg border border-zinc-800/80">
                {dispatchLogs.length === 0 ? (
                  <p className="text-zinc-500 italic">Click "Broadcast Takedown Demands" or "Execute Universal Takedown" to dispatch notices across all registered business entities.</p>
                ) : (
                  dispatchLogs.map((log, index) => (
                    <div key={index} className="leading-relaxed">{log}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
