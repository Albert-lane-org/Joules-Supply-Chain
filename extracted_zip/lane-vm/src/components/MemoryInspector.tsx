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
import { ExecutionMode, LANE_CONSTANTS, VmmMemoryCell } from '../types/lane.js';
import { Database, RefreshCw, Layers, Binary, ShieldAlert, Cpu } from 'lucide-react';

interface MemoryInspectorProps {
  cells: VmmMemoryCell[];
  onRefresh: () => void;
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({ cells, onRefresh }) => {
  const [selectedCell, setSelectedCell] = useState<VmmMemoryCell | null>(null);

  return (
    <div className="bg-slate-900/90 border border-cyan-900/60 rounded-xl p-4 shadow-xl text-slate-200 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          <h2 className="font-bold text-slate-100 uppercase tracking-wider">
            VMM Non-Power-of-Two Memory Striding (S = 17,684 Bytes)
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">
            Total Allocated: <strong className="text-amber-400">{(cells.length * LANE_CONSTANTS.STRIDE_BYTES).toLocaleString()} B</strong>
          </span>
          <button
            onClick={onRefresh}
            className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
            title="Refresh VMM State"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Architectural Callout: Decompiler Alignment Fault Math */}
      <div className="p-3 rounded bg-amber-950/30 border border-amber-800/60 text-amber-200/90 mb-3 text-[11px] space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-300">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Anti-Decompiler Memory Alignment Principle:</span>
        </div>
        <p>
          Standard binary disassemblers assume word alignments of <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">2^k</code> (8, 16, 64-byte).
          Factoring the LANE-VM stride: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">17,684 = 2^2 × 4421 = 4 × 4421</code>.
          For odd indices <code className="text-white">r</code>, <code className="text-amber-300">Φ(r, k) = (r × 17,684) mod 2^k ≠ 0</code>, inducing persistent unaligned memory faults in reverse-engineering frameworks.
        </p>
      </div>

      {/* Memory Cells Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {cells.map((cell) => {
          const phi8 = (cell.virtualIndex * LANE_CONSTANTS.STRIDE_BYTES) % 8;
          const phi16 = (cell.virtualIndex * LANE_CONSTANTS.STRIDE_BYTES) % 16;
          const phi64 = (cell.virtualIndex * LANE_CONSTANTS.STRIDE_BYTES) % 64;

          return (
            <div
              key={cell.virtualIndex}
              onClick={() => setSelectedCell(cell)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                selectedCell?.virtualIndex === cell.virtualIndex
                  ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-cyan-300">Slot r = {cell.virtualIndex}</span>
                <span className="text-slate-400 text-[10px] bg-slate-900 px-1.5 py-0.5 rounded">
                  {cell.tag}
                </span>
              </div>

              <div className="text-amber-300 font-semibold text-[11px] mb-1">
                A({cell.virtualIndex}) = {cell.physicalAddress.toLocaleString()} B
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>
                  Masked: <strong className="text-purple-300">0x{cell.maskedValue.toString(16).toUpperCase()}</strong>
                </span>
                <span className="text-lg text-cyan-300 font-sans">{cell.braillePattern}</span>
              </div>

              <div className="mt-1 pt-1 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between">
                <span>Φ₈: {phi8}</span>
                <span>Φ₁₆: {phi16}</span>
                <span>Φ₆₄: {phi64}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Cell Deep Inspector Modal / Box */}
      {selectedCell && (
        <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-slate-500">Virtual Index: </span>
            <strong className="text-cyan-300">r = {selectedCell.virtualIndex}</strong>
            <br />
            <span className="text-slate-500">Physical Address: </span>
            <strong className="text-amber-300">A(r) = {selectedCell.physicalAddress.toLocaleString()} Bytes</strong>
          </div>
          <div>
            <span className="text-slate-500">Raw Value: </span>
            <span className="text-slate-200">0x{selectedCell.rawValue.toString(16).toUpperCase()} ({selectedCell.rawValue})</span>
            <br />
            <span className="text-slate-500">Mask Applied: </span>
            <span className="text-purple-300">
              {selectedCell.mode === ExecutionMode.APEX_7 ? '0x7F (APEX_7)' : '0x7FFFFFFF (GROUND_31)'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Tactile Braille Dot: </span>
            <span className="text-cyan-300 text-base font-sans ml-1">{selectedCell.braillePattern}</span>
            <br />
            <span className="text-slate-500">Segment Stride: </span>
            <span className="text-emerald-400">17,684 Bytes</span>
          </div>
        </div>
      )}
    </div>
  );
};
