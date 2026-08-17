/**
 * @file Header.tsx
 * @license Proprietary
 * @provenance Albert Dale Lane (albertlane.net)
 * @author Albert Dale Lane
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @magic_header 0x3F8F9A1B2C3D
 * Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
 */

/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import React from 'react';
import { Layers, ShieldCheck, Server, Lock, Cpu, Zap, Binary } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header id="app-header" className="border-b border-zinc-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center text-white shadow-sm border border-zinc-800">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold tracking-tight text-zinc-900">Albert Lane Sovereign Workstation</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Proprietary Sovereign IP
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-cyan-50 text-cyan-800 border border-cyan-200">
                  <Binary className="w-3 h-3 text-cyan-600" />
                  C++20 &bull; Julia 1.10
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                <span>Provenance: Albert Dale Lane (albertlane.net)</span>
                <span>&bull;</span>
                <span className="text-zinc-700 font-semibold">SEC #17684-273-411-436</span>
                <span>&bull;</span>
                <span className="text-emerald-600 font-bold">Magic: 0x3F8F9A1B2C3D</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Joules Supply Chain: 0.000084J / op</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 font-mono">
              <Server className="w-3.5 h-3.5 text-zinc-500" />
              <span>Port 3000 (0.0.0.0)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 text-white font-medium shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>RFC 0103 Verified</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
