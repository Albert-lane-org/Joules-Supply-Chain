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
import { ExecutionMode, LANE_CONSTANTS } from '../types/lane.js';
import { byteToBrailleChar, getDotPositions } from '../utils/braille.js';
import { Grid, Sparkles, Sliders } from 'lucide-react';

interface BrailleMatrixVisualizerProps {
  activeMode: ExecutionMode;
}

export const BrailleMatrixVisualizer: React.FC<BrailleMatrixVisualizerProps> = ({ activeMode }) => {
  const [selectedByte, setSelectedByte] = useState<number>(0b10101101); // 173

  const dots = getDotPositions(selectedByte);
  const isApex = activeMode === ExecutionMode.APEX_7;
  const maskedByte = isApex ? selectedByte & LANE_CONSTANTS.APEX_7_MASK : selectedByte;
  const brailleChar = byteToBrailleChar(selectedByte, activeMode);

  const toggleDot = (dotIndex: number) => {
    const bitMask = 1 << dotIndex;
    setSelectedByte((prev) => prev ^ bitMask);
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-900/60 rounded-xl p-4 shadow-xl text-slate-200 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-purple-400" />
          <h2 className="font-bold text-slate-100 uppercase tracking-wider">
            8-Dot Unicode Braille Tactile Matrix (U+2800..U+28FF)
          </h2>
        </div>
        <span className="text-[11px] text-slate-400">
          ISA Transpiler: Dot 1..8 → Bits 2⁰..2⁷
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Visual 2x4 Tactile Pin Actuator Grid */}
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-[11px] text-slate-400 mb-2 font-semibold">
            Actuator Pin Array (2×4 Grid)
          </span>
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
            {/* Column 1: Dots 1, 2, 3, 7 */}
            <div className="flex flex-col gap-2.5">
              {[
                { idx: 0, label: 'Dot 1 (2⁰=1)' },
                { idx: 1, label: 'Dot 2 (2¹=2)' },
                { idx: 2, label: 'Dot 3 (2²=4)' },
                { idx: 6, label: 'Dot 7 (2⁶=64)' },
              ].map(({ idx, label }) => {
                const active = dots[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDot(idx)}
                    className={`w-10 h-10 rounded-full flex flex-col items-center justify-center transition-all ${
                      active
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-105'
                        : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                    }`}
                    title={label}
                  >
                    <span className="text-[10px]">{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Column 2: Dots 4, 5, 6, 8 */}
            <div className="flex flex-col gap-2.5">
              {[
                { idx: 3, label: 'Dot 4 (2³=8)', isDot8: false },
                { idx: 4, label: 'Dot 5 (2⁴=16)', isDot8: false },
                { idx: 5, label: 'Dot 6 (2⁵=32)', isDot8: false },
                { idx: 7, label: 'Dot 8 (2⁷=128) - Truncated in APEX_7', isDot8: true },
              ].map(({ idx, label, isDot8 }) => {
                const active = dots[idx];
                const isMaskedOut = isDot8 && isApex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => !isMaskedOut && toggleDot(idx)}
                    disabled={isMaskedOut}
                    className={`w-10 h-10 rounded-full flex flex-col items-center justify-center transition-all ${
                      isMaskedOut
                        ? 'bg-red-950/40 border border-red-800/80 text-red-400 opacity-50 cursor-not-allowed'
                        : active
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-105'
                        : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                    }`}
                    title={label}
                  >
                    <span className="text-[10px]">{idx + 1}</span>
                    {isMaskedOut && <span className="text-[8px] text-red-300">CLR</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Unicode Glyph & Codepoint Output */}
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400">Synthesized Braille Glyph</span>
          <div className="text-6xl text-cyan-400 font-sans p-3 rounded-lg bg-slate-900 border border-cyan-800/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            {brailleChar}
          </div>
          <div className="text-center font-mono">
            <span className="text-slate-400">Codepoint: </span>
            <strong className="text-purple-300">
              U+{(0x2800 + (maskedByte & 0xFF)).toString(16).toUpperCase()}
            </strong>
          </div>
        </div>

        {/* Right: State Space & Truncation Math */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dual-Mode Bitfield Dynamics</span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Raw Byte Value:</span>
              <strong className="text-slate-100">{selectedByte} (0x{selectedByte.toString(16).toUpperCase()})</strong>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Active Mode:</span>
              <strong className={isApex ? 'text-amber-400' : 'text-cyan-400'}>
                {isApex ? 'APEX_7 (7-bit)' : 'GROUND_31 (31-bit)'}
              </strong>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Mask Applied:</span>
              <strong className="text-purple-300">
                {isApex ? '0x7F (Dot 8 Cleared)' : '0x7FFFFFFF'}
              </strong>
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Target Domain:</span>
              <span className="text-slate-400 text-right">
                {isApex ? 'Tactile micro-actuators & 3D die stacking' : 'VMM arithmetic & disassembler obstruction'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
