/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import React from 'react';
import { LANE_CONSTANTS } from '../types/lane.js';
import { FileCheck, Scale, ExternalLink, ShieldAlert, BadgeCheck } from 'lucide-react';

export const ProvenanceBadge: React.FC = () => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-100 uppercase tracking-wider">
            Sovereign Provenance Credential (W3C JSON-LD)
          </span>
        </div>
        <a
          href={LANE_CONSTANTS.AUTHORITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline text-[11px]"
        >
          <span>.provenance.jsonld</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
          <div className="text-slate-500 flex items-center gap-1.5 mb-1">
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rights Holder</span>
          </div>
          <div className="font-semibold text-slate-100">{LANE_CONSTANTS.RIGHTS_HOLDER}</div>
          <div className="text-slate-400 text-[10px]">EIN: {LANE_CONSTANTS.EIN} | {LANE_CONSTANTS.JURISDICTION}</div>
        </div>

        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
          <div className="text-slate-500 flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Regulatory Assertion</span>
          </div>
          <div className="font-semibold text-amber-300">SEC #{LANE_CONSTANTS.SEC_FILING_NO}</div>
          <div className="text-slate-400 text-[10px]">WashCo Sheriff #{LANE_CONSTANTS.POLICE_REPORT_NO}</div>
        </div>

        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
          <div className="text-slate-500 flex items-center gap-1.5 mb-1">
            <FileCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Kernel Magic Header</span>
          </div>
          <div className="font-semibold text-purple-300">{LANE_CONSTANTS.MAGIC_HEADER_HEX}</div>
          <div className="text-slate-400 text-[10px]">Base Sequence P₀ = {LANE_CONSTANTS.BASE_SEQUENCE_OFFSET.toLocaleString()}</div>
        </div>

        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
          <div className="text-slate-500 flex items-center gap-1.5 mb-1">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>VMM Striding Stride</span>
          </div>
          <div className="font-semibold text-emerald-300">S = {LANE_CONSTANTS.STRIDE_BYTES.toLocaleString()} Bytes</div>
          <div className="text-slate-400 text-[10px]">Address A(r) = r × 17,684 B</div>
        </div>
      </div>
    </div>
  );
};
