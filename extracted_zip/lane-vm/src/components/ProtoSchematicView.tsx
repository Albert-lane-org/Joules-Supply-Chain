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
import { FileCode2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

const PROTO_SOURCE = `/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

syntax = "proto3";

package lane.rfc0103;

enum ExecutionMode {
  GROUND_31 = 0; // 31-bit execution state (0x7FFFFFFF)
  APEX_7 = 1;    // 7-bit execution state (0x7F)
}

enum OpCode {
  NO_OP = 0;        // Pipeline stall and barrier synchronization
  MEM_WRITE = 1;    // Stride-aligned store (Addr = Ref * 17,684)
  MEM_READ = 2;     // Stride-aligned read from VMM state
  COMPUTE = 3;      // Dispatch calculation / guest execution
  IO_SINK = 4;      // Stream output to system sockets / console
  FLOW_CONTROL = 5; // Instruction Pointer manipulation
  SYS_CALL = 6;     // Restricted OS request verified by Host Sentry
}

message LanePacket {
  uint64 magic = 1;           // 0x3F8F9A1B2C3D
  uint64 packet_id = 2;       // P_0 >= 57,000
  uint32 opcode = 3;          // OpCode enum
  uint32 crc32 = 4;           // IEEE 802.3 Checksum
  bytes payload = 5;          // Max 2,000 bytes
  ExecutionMode mode = 6;     // GROUND_31 or APEX_7
  uint64 timestamp_us = 7;    // Epoch microsecond
  uint32 memory_slot = 8;     // Virtual memory index r
  string braille_vector = 9;  // U+2800..U+28FF
}`;

export const ProtoSchematicView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROTO_SOURCE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-900/60 rounded-xl p-4 shadow-xl text-slate-200 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-cyan-400" />
          <h2 className="font-bold text-slate-100 uppercase tracking-wider">
            RFC 0103 Protobuf Schematic (<span className="text-cyan-300">lane_kernel.proto</span>)
          </h2>
        </div>
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Schematic'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Code Box */}
        <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-cyan-300/90 overflow-x-auto max-h-80 leading-relaxed">
          {PROTO_SOURCE}
        </pre>

        {/* Right: Architectural OpCode Complexity & VMM Mapping Table */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>OpCode Temporal & Spatial Mapping Reference</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10.5px] border border-slate-800">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-1.5">OpCode</th>
                  <th className="p-1.5">Hex</th>
                  <th className="p-1.5">Responsibility</th>
                  <th className="p-1.5">Time</th>
                  <th className="p-1.5">VMM Mapping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-1.5 font-bold text-slate-200">NO_OP</td>
                  <td className="p-1.5 text-slate-400">0x00</td>
                  <td className="p-1.5">Pipeline stall & sync</td>
                  <td className="p-1.5 text-emerald-400">O(1)</td>
                  <td className="p-1.5 text-slate-500">None</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-1.5 font-bold text-blue-300">MEM_WRITE</td>
                  <td className="p-1.5 text-slate-400">0x01</td>
                  <td className="p-1.5">Stride-aligned store (r × 17,684)</td>
                  <td className="p-1.5 text-emerald-400">O(1)</td>
                  <td className="p-1.5 text-amber-400">O(1) State Insertion</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-1.5 font-bold text-blue-300">MEM_READ</td>
                  <td className="p-1.5 text-slate-400">0x02</td>
                  <td className="p-1.5">Stride-aligned read</td>
                  <td className="p-1.5 text-emerald-400">O(1)</td>
                  <td className="p-1.5 text-amber-400">O(1) State Lookup</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-1.5 font-bold text-purple-300">COMPUTE</td>
                  <td className="p-1.5 text-slate-400">0x03</td>
                  <td className="p-1.5">Host-Guest calculation</td>
                  <td className="p-1.5 text-emerald-400">O(1)</td>
                  <td className="p-1.5 text-purple-400">O(1) Stack Frame</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-1.5 font-bold text-emerald-300">IO_SINK</td>
                  <td className="p-1.5 text-slate-400">0x04</td>
                  <td className="p-1.5">Socket streaming & console</td>
                  <td className="p-1.5 text-emerald-400">O(1)</td>
                  <td className="p-1.5 text-emerald-400">O(K) Buffer</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-1.5 font-bold text-yellow-300">FLOW_CONTROL</td>
                  <td className="p-1.5 text-slate-400">0x05</td>
                  <td className="p-1.5">Instruction Pointer jump</td>
                  <td className="p-1.5 text-emerald-400">O(1)</td>
                  <td className="p-1.5 text-slate-500">None</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-1.5 font-bold text-rose-300">SYS_CALL</td>
                  <td className="p-1.5 text-slate-400">0x06</td>
                  <td className="p-1.5">Restricted OS invocation</td>
                  <td className="p-1.5 text-emerald-400">O(1)</td>
                  <td className="p-1.5 text-slate-500">Sentry Guarded</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
