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

import React from 'react';
import { ExecutionMode, KernelTelemetry, LANE_CONSTANTS } from '../types/lane.js';
import { Activity, Cpu, ShieldCheck, Zap, Radio, Lock } from 'lucide-react';

interface HeaderProps {
  telemetry: KernelTelemetry | null;
  isConnected: boolean;
  activeMode: ExecutionMode;
  onModeChange: (mode: ExecutionMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  telemetry,
  isConnected,
  activeMode,
  onModeChange,
}) => {
  return (
    <header className="bg-slate-900/90 border-b border-cyan-900/60 backdrop-blur-md sticky top-0 z-40 px-4 py-3 text-slate-100">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Core Arch */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-mono text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>LANE-VM</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  RFC 0103
                </span>
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>SEC Whistleblower #17684-273-411-436</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span>Magic: <strong className="text-cyan-300 font-semibold">{LANE_CONSTANTS.MAGIC_HEADER_HEX}</strong></span>
              <span className="text-slate-600">|</span>
              <span>Stride: <strong className="text-amber-400">17,684 B</strong></span>
              <span className="text-slate-600">|</span>
              <span>Base Offset: <strong className="text-purple-400">P₀ = 57,000</strong></span>
            </p>
          </div>
        </div>

        {/* Right: Mode Selector & Telemetry */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Socket Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono">
            <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={isConnected ? 'text-emerald-300' : 'text-amber-300'}>
              {isConnected ? 'WSS FULL-DUPLEX' : 'HTTP REST FALLBACK'}
            </span>
          </div>

          {/* Dual-Mode Selector */}
          <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => onModeChange(ExecutionMode.GROUND_31)}
              className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                activeMode === ExecutionMode.GROUND_31
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="31-bit execution width with MSB zeroed (0x7FFFFFFF) to induce decompiler phase drift"
            >
              <Zap className="w-3 h-3" />
              <span>GROUND_31 (31-bit)</span>
            </button>
            <button
              onClick={() => onModeChange(ExecutionMode.APEX_7)}
              className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                activeMode === ExecutionMode.APEX_7
                  ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="7-bit execution width with upper 57 bits cleared (0x7F) for tactile micro-actuator die stacking"
            >
              <Lock className="w-3 h-3" />
              <span>APEX_7 (7-bit)</span>
            </button>
          </div>

          {/* Sequence Counter */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Seq: <strong className="text-white">{telemetry?.currentSequenceId || 57000}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};
