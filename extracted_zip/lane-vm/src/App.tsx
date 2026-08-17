/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import React, { useState } from 'react';
import { useRFC0103Stream } from './hooks/useRFC0103Stream.js';
import { Header } from './components/Header.js';
import { ProvenanceBadge } from './components/ProvenanceBadge.js';
import { LiveStreamTerminal } from './components/LiveStreamTerminal.js';
import { PacketTransceiver } from './components/PacketTransceiver.js';
import { MemoryInspector } from './components/MemoryInspector.js';
import { BrailleMatrixVisualizer } from './components/BrailleMatrixVisualizer.js';
import { SecuritySentryPanel } from './components/SecuritySentryPanel.js';
import { ProtoSchematicView } from './components/ProtoSchematicView.js';
import { ProvenanceComplianceInspector } from './components/ProvenanceComplianceInspector.js';
import { JoulesReportingPipeline } from './components/JoulesReportingPipeline.js';
import { Bit31CliConsole } from './components/Bit31CliConsole.js';
import { Rust5DBifurcationViewer } from './components/Rust5DBifurcationViewer.js';
import { DependencyFirewallPanel } from './components/DependencyFirewallPanel.js';
import { StreamlitBroadcastEngine } from './components/StreamlitBroadcastEngine.js';
import { CloudflareGithubScaffold } from './components/CloudflareGithubScaffold.js';
import { JoulesSupplyChainDashboard } from './components/JoulesSupplyChainDashboard.js';
import { EphemeralRedundancyPanel } from './components/EphemeralRedundancyPanel.js';
import { KernelCanarySentryPanel } from './components/KernelCanarySentryPanel.js';
import {
  Activity,
  ShieldCheck,
  Database,
  Grid,
  Terminal,
  AlertTriangle,
  Layers,
  FileCode2,
  Scale,
  GitBranch,
  FolderGit2,
  ShieldAlert,
  Radio,
  Cloud,
  Zap,
  Server,
  Send
} from 'lucide-react';

export default function App() {
  const {
    isConnected,
    isPaused,
    packets,
    telemetry,
    memoryCells,
    activeMode,
    errorLog,
    togglePause,
    clearPackets,
    sendPacket,
    setExecutionMode,
    refreshVmm,
  } = useRFC0103Stream();

  const [activeTab, setActiveTab] = useState<
    'canary' | 'redundancy' | 'joules' | 'scaffold' | 'safd' | 'firewall' | 'pipeline' | 'cli' | 'rust5d' | 'stream' | 'provenance' | 'memory' | 'tactile' | 'sentry' | 'proto'
  >('canary');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-900 selection:text-cyan-200">
      {/* Top Header Navigation */}
      <Header
        telemetry={telemetry}
        isConnected={isConnected}
        activeMode={activeMode}
        onModeChange={setExecutionMode}
      />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Sovereign Provenance Credential Banner */}
        <ProvenanceBadge />

        {/* Kernel Error Banner (If any) */}
        {errorLog && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 font-mono text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>
                <strong>HOST SENTRY FAULT:</strong> {errorLog}
              </span>
            </div>
            <span className="text-[10px] text-red-400">Packet Rejected by Sentry Engine</span>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('canary')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'canary'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-rose-300" />
            <span>Kernel Canary Sentry (SEC Offset)</span>
          </button>

          <button
            onClick={() => setActiveTab('redundancy')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'redundancy'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-violet-300" />
            <span>Autonomous Redundancy Agent (Zero-API)</span>
          </button>

          <button
            onClick={() => setActiveTab('joules')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'joules'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-300" />
            <span>Joules Supply Chain (Albert Lane 2026)</span>
          </button>

          <button
            onClick={() => setActiveTab('scaffold')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'scaffold'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-sky-300" />
            <span>Cloudflare & GitHub Scaffold</span>
          </button>

          <button
            onClick={() => setActiveTab('safd')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'safd'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-indigo-300" />
            <span>Streamlit Broadcast (RFC 0102)</span>
          </button>

          <button
            onClick={() => setActiveTab('firewall')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'firewall'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
            <span>Dependency Firewall (Auto-Heal)</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'pipeline'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-300" />
            <span>Automated Reporting (Intake 1–10)</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'cli'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-300" />
            <span>31/7-Bit CLI Console</span>
          </button>

          <button
            onClick={() => setActiveTab('rust5d')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'rust5d'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-300" />
            <span>Rust5D (e=AA Bifurcation)</span>
          </button>

          <button
            onClick={() => setActiveTab('stream')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'stream'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Wire Stream & Ingress</span>
          </button>

          <button
            onClick={() => setActiveTab('provenance')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'provenance'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Provenance Blockchain</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'memory'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>VMM Striding (17,684 B)</span>
          </button>

          <button
            onClick={() => setActiveTab('tactile')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'tactile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>8-Dot Braille Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('sentry')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'sentry'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SSRF & Sentry</span>
          </button>

          <button
            onClick={() => setActiveTab('proto')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold shrink-0 ${
              activeTab === 'proto'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Protobuf Schematic</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'canary' && (
          <KernelCanarySentryPanel />
        )}

        {activeTab === 'redundancy' && (
          <EphemeralRedundancyPanel />
        )}

        {activeTab === 'joules' && (
          <JoulesSupplyChainDashboard />
        )}

        {activeTab === 'scaffold' && (
          <CloudflareGithubScaffold />
        )}

        {activeTab === 'safd' && (
          <StreamlitBroadcastEngine />
        )}

        {activeTab === 'firewall' && (
          <DependencyFirewallPanel />
        )}

        {activeTab === 'pipeline' && (
          <JoulesReportingPipeline />
        )}

        {activeTab === 'cli' && (
          <Bit31CliConsole />
        )}

        {activeTab === 'rust5d' && (
          <Rust5DBifurcationViewer />
        )}

        {activeTab === 'stream' && (
          <div className="space-y-5">
            {/* Packet Transceiver (Composer) */}
            <PacketTransceiver
              activeMode={activeMode}
              onSendPacket={sendPacket}
              onModeToggle={setExecutionMode}
            />

            {/* Live Wire-Stream Terminal */}
            <LiveStreamTerminal
              packets={packets}
              isPaused={isPaused}
              onTogglePause={togglePause}
              onClear={clearPackets}
            />
          </div>
        )}

        {activeTab === 'provenance' && (
          <ProvenanceComplianceInspector />
        )}

        {activeTab === 'memory' && (
          <MemoryInspector cells={memoryCells} onRefresh={refreshVmm} />
        )}

        {activeTab === 'tactile' && (
          <BrailleMatrixVisualizer activeMode={activeMode} />
        )}

        {activeTab === 'sentry' && (
          <SecuritySentryPanel />
        )}

        {activeTab === 'proto' && (
          <ProtoSchematicView />
        )}
      </main>
    </div>
  );
}
