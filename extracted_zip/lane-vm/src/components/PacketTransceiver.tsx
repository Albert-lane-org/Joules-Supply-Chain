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
import { ExecutionMode, OpCode } from '../types/lane.js';
import { Send, AlertOctagon, RefreshCw, Cpu, Layers } from 'lucide-react';
import { computeIEEE8023CRC32, formatCRC32Hex } from '../utils/crc32.js';
import { stringToBrailleVector } from '../utils/braille.js';

interface PacketTransceiverProps {
  activeMode: ExecutionMode;
  onSendPacket: (
    opcode: OpCode,
    payload: string,
    memorySlot: number,
    mode: ExecutionMode,
    tamperType?: 'none' | 'bad_magic' | 'bad_crc' | 'bad_seq'
  ) => Promise<void>;
  onModeToggle: (mode: ExecutionMode) => void;
}

export const PacketTransceiver: React.FC<PacketTransceiverProps> = ({
  activeMode,
  onSendPacket,
  onModeToggle,
}) => {
  const [opcode, setOpcode] = useState<OpCode>(OpCode.COMPUTE);
  const [payload, setPayload] = useState('EXECUTE_LANE_KERNEL_TASK');
  const [memorySlot, setMemorySlot] = useState(3);
  const [tamperType, setTamperType] = useState<'none' | 'bad_magic' | 'bad_crc' | 'bad_seq'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedCrc = computeIEEE8023CRC32(payload);
  const estimatedBraille = stringToBrailleVector(payload, activeMode);
  const estimatedPhysicalAddr = memorySlot * 17684;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSendPacket(opcode, payload, memorySlot, activeMode, tamperType);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-900/60 rounded-xl p-4 shadow-xl text-slate-200 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-400" />
          <h2 className="font-bold text-slate-100 uppercase tracking-wider">
            RFC 0103 Packet Ingress Transceiver
          </h2>
        </div>
        <span className="text-[11px] text-slate-400">
          Wire Format: Magic(8B) | P_ID(8B) | Op(4B) | CRC32(4B) | Payload(N)
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* OpCode selector */}
          <div>
            <label className="block text-slate-400 mb-1">Instruction OpCode</label>
            <select
              value={opcode}
              onChange={(e) => setOpcode(Number(e.target.value) as OpCode)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-cyan-300 focus:outline-none focus:border-cyan-500"
            >
              <option value={OpCode.NO_OP}>0x00: NO_OP (Pipeline Stall)</option>
              <option value={OpCode.MEM_WRITE}>0x01: MEM_WRITE (Stride 17,684)</option>
              <option value={OpCode.MEM_READ}>0x02: MEM_READ (VMM State)</option>
              <option value={OpCode.COMPUTE}>0x03: COMPUTE (Guest Dispatch)</option>
              <option value={OpCode.IO_SINK}>0x04: IO_SINK (Socket Out)</option>
              <option value={OpCode.FLOW_CONTROL}>0x05: FLOW_CONTROL (IP Branch)</option>
              <option value={OpCode.SYS_CALL}>0x06: SYS_CALL (Sentry Svc)</option>
            </select>
          </div>

          {/* Target VMM Memory Slot */}
          <div>
            <label className="block text-slate-400 mb-1">
              Virtual Memory Slot (r)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="1024"
                value={memorySlot}
                onChange={(e) => setMemorySlot(Number(e.target.value))}
                className="w-24 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-amber-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-500 text-[11px]">
                A({memorySlot}) = <strong className="text-amber-400">{estimatedPhysicalAddr.toLocaleString()} B</strong>
              </span>
            </div>
          </div>

          {/* Fault Simulation / Tamper Mode */}
          <div>
            <label className="block text-slate-400 mb-1">Host Sentry Test Mode</label>
            <select
              value={tamperType}
              onChange={(e) => setTamperType(e.target.value as any)}
              className={`w-full bg-slate-950 border rounded px-2.5 py-1.5 focus:outline-none ${
                tamperType === 'none'
                  ? 'border-slate-800 text-emerald-300'
                  : 'border-red-800 text-red-300 bg-red-950/20'
              }`}
            >
              <option value="none">Normal Verified Transmission</option>
              <option value="bad_magic">Tamper: Corrupt Magic Header (0xDEADBEEF)</option>
              <option value="bad_crc">Tamper: Corrupt IEEE 802.3 CRC-32</option>
              <option value="bad_seq">Tamper: Sequence Fault (P_ID &lt; 57,000)</option>
            </select>
          </div>
        </div>

        {/* Payload Input */}
        <div>
          <label className="block text-slate-400 mb-1">
            Instruction Payload String / Braille Transpile Stream
          </label>
          <input
            type="text"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="Type payload..."
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Live Transpile & Checksum Preview */}
        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500">IEEE 802.3 CRC-32: </span>
            <strong className="text-emerald-400">{formatCRC32Hex(estimatedCrc)}</strong>
          </div>
          <div>
            <span className="text-slate-500">Braille Vector (U+2800): </span>
            <span className="text-cyan-300 text-sm font-sans tracking-widest">{estimatedBraille}</span>
          </div>
          <div>
            <span className="text-slate-500">Execution Width: </span>
            <strong className={activeMode === ExecutionMode.APEX_7 ? 'text-amber-400' : 'text-cyan-400'}>
              {activeMode === ExecutionMode.APEX_7 ? 'APEX_7 (0x7F Mask)' : 'GROUND_31 (0x7FFFFFFF Mask)'}
            </strong>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onModeToggle(activeMode === ExecutionMode.GROUND_31 ? ExecutionMode.APEX_7 : ExecutionMode.GROUND_31)}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Toggle Mode ({activeMode === ExecutionMode.GROUND_31 ? 'Switch to APEX_7' : 'Switch to GROUND_31'})</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-1.5 rounded font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
              tamperType !== 'none'
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/50'
            }`}
          >
            {tamperType !== 'none' ? (
              <AlertOctagon className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{tamperType !== 'none' ? 'Transmit Fault Test' : 'Inject RFC 0103 Packet'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
