/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import React, { useState, useEffect, useRef } from 'react';
import { ExecutionMode, LanePacket, OpCode } from '../types/lane.js';
import { Terminal, Pause, Play, Trash2, CheckCircle2, AlertTriangle, Search, Hash, Cpu } from 'lucide-react';

interface LiveStreamTerminalProps {
  packets: LanePacket[];
  isPaused: boolean;
  onTogglePause: () => void;
  onClear: () => void;
}

export const LiveStreamTerminal: React.FC<LiveStreamTerminalProps> = ({
  packets,
  isPaused,
  onTogglePause,
  onClear,
}) => {
  const [filterText, setFilterText] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedPacket, setSelectedPacket] = useState<LanePacket | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const filteredPackets = packets.filter((p) => {
    if (!filterText) return true;
    const lower = filterText.toLowerCase();
    return (
      p.packet_id.toString().includes(lower) ||
      p.opcode_name.toLowerCase().includes(lower) ||
      p.payload.toLowerCase().includes(lower) ||
      p.crc32_hex.toLowerCase().includes(lower) ||
      p.braille_vector.includes(filterText)
    );
  });

  useEffect(() => {
    if (autoScroll && terminalEndRef.current && !isPaused) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [packets, autoScroll, isPaused]);

  return (
    <div className="bg-slate-950 border border-cyan-900/60 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
      {/* Terminal Toolbar */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">
            RFC 0103 Wire-Stream [Full-Duplex Sentry]
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400 font-semibold">{packets.length} Packets</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter stream (opcode, ID, hex)..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 pl-7 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={() => setAutoScroll((prev) => !prev)}
            className={`px-2.5 py-1 rounded border transition-colors ${
              autoScroll
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onTogglePause}
            className={`px-2.5 py-1 rounded flex items-center gap-1 border transition-colors ${
              isPaused
                ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3 text-cyan-400" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={onClear}
            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900 transition-colors"
            title="Clear Stream"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal View Container */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1.5 bg-slate-950 selection:bg-cyan-900/60">
        {filteredPackets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
            <Cpu className="w-8 h-8 text-slate-700 animate-spin" />
            <p>Awaiting RFC 0103 Wire Ingress Packets (P₀ ≥ 57,000)...</p>
          </div>
        ) : (
          filteredPackets.map((pkt) => {
            const isApex = pkt.mode === ExecutionMode.APEX_7;
            return (
              <div
                key={`${pkt.packet_id}-${pkt.timestamp_us}`}
                onClick={() => setSelectedPacket(pkt)}
                className={`p-2 rounded border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                  selectedPacket?.packet_id === pkt.packet_id
                    ? 'bg-cyan-950/40 border-cyan-500/80 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                {/* Left: Sequence & Opcode */}
                <div className="flex items-center space-x-2.5 flex-wrap">
                  <span className="text-slate-500 text-[11px]">
                    {new Date(pkt.timestamp_us / 1000).toISOString().substring(11, 23)}
                  </span>

                  <span className="font-bold text-cyan-400 flex items-center gap-0.5">
                    <Hash className="w-3 h-3 text-slate-500" />
                    <span>{pkt.packet_id}</span>
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      pkt.opcode === OpCode.MEM_WRITE
                        ? 'bg-blue-950 text-blue-300 border-blue-800'
                        : pkt.opcode === OpCode.COMPUTE
                        ? 'bg-purple-950 text-purple-300 border-purple-800'
                        : pkt.opcode === OpCode.IO_SINK
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : pkt.opcode === OpCode.SYS_CALL
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {pkt.opcode_name}
                  </span>

                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] ${
                      isApex
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                    }`}
                  >
                    {isApex ? 'APEX_7 (0x7F)' : 'GROUND_31'}
                  </span>

                  {/* VMM Striding Address */}
                  <span className="text-slate-400 text-[11px]">
                    VMM:<strong className="text-slate-200">r={pkt.memory_slot}</strong>
                    <span className="text-slate-600">→</span>
                    <strong className="text-amber-400">
                      A({pkt.memory_slot})={pkt.physical_address.toLocaleString()}B
                    </strong>
                  </span>
                </div>

                {/* Right: Payload, Braille Vector, CRC32 Check */}
                <div className="flex items-center space-x-3 flex-wrap">
                  {/* Braille Visual */}
                  <div className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-base text-cyan-300 tracking-wider font-sans">
                    {pkt.braille_vector}
                  </div>

                  {/* Payload preview */}
                  <span className="text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px] max-w-[200px] truncate">
                    "{pkt.payload}"
                  </span>

                  {/* CRC-32 IEEE 802.3 */}
                  <div
                    className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded border ${
                      pkt.crc32_valid
                        ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
                        : 'bg-red-950 text-red-300 border-red-800'
                    }`}
                    title="IEEE 802.3 CRC-32 Polynomial 0xEDB88320"
                  >
                    {pkt.crc32_valid ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                    )}
                    <span>{pkt.crc32_hex}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Selected Packet Deep-Inspection Bar */}
      {selectedPacket && (
        <div className="bg-slate-900 border-t border-slate-800 p-3 text-xs font-mono text-slate-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <span className="text-slate-500">64-bit Magic: </span>
            <strong className="text-cyan-300">{selectedPacket.magic}</strong>
          </div>
          <div>
            <span className="text-slate-500">Raw Bits: </span>
            <span className="text-slate-200">{selectedPacket.raw_bits_value}</span>
            <span className="text-slate-500"> | Masked: </span>
            <strong className="text-purple-300">{selectedPacket.masked_bits_value}</strong>
          </div>
          <div>
            <span className="text-slate-500">Phase Drift Φ(r, k): </span>
            <span className="text-amber-400">
              Φ₈={selectedPacket.phase_drift?.phi_8}, Φ₁₆={selectedPacket.phase_drift?.phi_16}, Φ₆₄={selectedPacket.phase_drift?.phi_64}
            </span>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedPacket(null)}
              className="text-slate-500 hover:text-slate-300 underline"
            >
              Dismiss Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
