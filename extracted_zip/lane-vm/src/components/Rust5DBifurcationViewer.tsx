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
import { LANE_CONSTANTS } from '../types/lane.js';
import {
  Layers,
  Cpu,
  GitBranch,
  Play,
  CheckCircle2,
  Lock,
  Code2,
  FileJson,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const Rust5DBifurcationViewer: React.FC = () => {
  const [activeView, setActiveView] = useState<'architecture' | 'rust_code' | 'schema' | 'geometry'>('architecture');
  const [bifurcationResult, setBifurcationResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const simulateBifurcation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/cli/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'bifurcate --mode GROUND_31 --stride 17684' }),
      });
      if (res.ok) {
        const json = await res.json();
        setBifurcationResult(json.output);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div id="rust5d-bifurcation-viewer" className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-purple-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <GitBranch className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  Rust5D: Geometric Bifurcation & Escaped Albert Array (e=AA)
                </h2>
                <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/30">
                  5D TENSOR SPACE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Dual Execution Path Mechanism via Redefined Bracket Scope Closure `[/ ]` • SEC Whistleblower #17684-273-411-436
              </p>
            </div>
          </div>

          <button
            onClick={simulateBifurcation}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 text-xs font-semibold font-mono transition shadow-lg shadow-purple-900/40"
          >
            <Play className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
            Simulate e=AA Bifurcation
          </button>
        </div>
      </div>

      {bifurcationResult && (
        <div className="rounded-xl border border-purple-500/40 bg-purple-950/40 p-4 text-xs font-mono text-purple-200 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
          <pre className="whitespace-pre-wrap leading-relaxed">{bifurcationResult}</pre>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveView('architecture')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
            activeView === 'architecture' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          5D Geometric Core
        </button>

        <button
          onClick={() => setActiveView('rust_code')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
            activeView === 'rust_code' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Escaped Bracket Rust (.rs)
        </button>

        <button
          onClick={() => setActiveView('schema')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
            activeView === 'schema' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileJson className="h-3.5 w-3.5" />
          Categroup Matrix Schema
        </button>

        <button
          onClick={() => setActiveView('geometry')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
            activeView === 'geometry' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          e=AA Specification Geometry
        </button>
      </div>

      {/* Tab Panels */}
      {activeView === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-purple-400" />
              Bifurcated Execution Geometry
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The <span className="text-purple-300 font-mono font-semibold">Escaped Albert Array (e=AA)</span> utilizes the proprietary bracket closure operator <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">[/ ]</code> to dynamically redefine lexical and runtime scope bounds.
            </p>

            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs font-mono text-cyan-300 space-y-1">
              <div>(pos. 0)  {'{'}</div>
              <div className="pl-4">[ Z,x,</div>
              <div className="pl-8">[/ x,Z</div>
              <div className="pl-12">] (,)</div>
              <div className="pl-8">] (,)</div>
              <div className="pl-4">{'}'} (,)</div>
            </div>

            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong className="text-purple-300">Simultaneous Deferral:</strong> Controls sequential execution order.</li>
              <li><strong className="text-purple-300">Dual Traversal:</strong> Parallelized prints from sequential reads.</li>
              <li><strong className="text-purple-300">Axis x, z Scaffolding:</strong> Bound geometric tensor serialization.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              Sovereign Rights & Invariants
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-slate-500">Legal Authority</div>
                <div className="text-slate-200 font-semibold">{LANE_CONSTANTS.RIGHTS_HOLDER} (EIN: {LANE_CONSTANTS.EIN})</div>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-slate-500">SEC Assertion Ref</div>
                <div className="text-amber-300 font-semibold">{LANE_CONSTANTS.SEC_FILING_NO}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-slate-500">Physical Stride Invariant</div>
                <div className="text-emerald-400 font-semibold">S = 17,684 Bytes | Address A(r) = r * 17,684</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'rust_code' && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>Joules-Supply-Chain/Rust5D/Albert Array Escape Bracketed Rust.rs</span>
            <span className="text-emerald-400">OFFSET 0x00 PROVENANCE VALID</span>
          </div>
          <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed bg-slate-900/80 p-3 rounded border border-slate-800/80">
{`/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

#[macro_export]
macro_rules! bifurcate {
    ($endpoint:expr, $body:block) => {
        {
            let path1_result = {
                let limited = $endpoint;
                let _ = limited;
                $body
            };
            let path2_result = {
                let full = true;
                let _ = full;
                $body
            };
            (path1_result, path2_result)
        }
    };
}`}
          </pre>
        </div>
      )}

      {activeView === 'schema' && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>Joules-Supply-Chain/Rust5D/Categroup-Matrix-Schema.json</span>
            <span className="text-purple-400">5D Categroup Tensor</span>
          </div>
          <pre className="text-[11px] font-mono text-purple-200 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed bg-slate-900/80 p-3 rounded border border-slate-800/80">
{`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Escaped Albert Array Categroup Matrix",
  "type": "object",
  "properties": {
    "dimensions": { "type": "integer", "const": 5 },
    "axes": { "type": "array", "items": { "type": "string" }, "default": ["x", "y", "z", "w", "v"] },
    "bifurcationOperator": { "type": "string", "const": "[/ ]" },
    "memoryStrideBytes": { "type": "integer", "const": 17684 },
    "bitMasks": {
      "GROUND_31": "0x7FFFFFFF",
      "APEX_7": "0x7F"
    }
  }
}`}
          </pre>
        </div>
      )}

      {activeView === 'geometry' && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>Joules-Supply-Chain/Rust5D/e=AA Specification: Geometry.json</span>
            <span className="text-cyan-400">Geometry Coordinates</span>
          </div>
          <pre className="text-[11px] font-mono text-cyan-200 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed bg-slate-900/80 p-3 rounded border border-slate-800/80">
{`{
  "specification": "Escaped Albert Array Geometric Topology",
  "authority": "Albert Dale Lane (SEC #17684-273-411-436)",
  "scaffolding": {
    "primaryAxis": "x,z",
    "serializationAxis": "z",
    "integerPolarity": "symmetric [-inf, +inf]"
  }
}`}
          </pre>
        </div>
      )}
    </div>
  );
};
