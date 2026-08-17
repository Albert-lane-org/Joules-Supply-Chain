/**
 * @file DependencyOverview.tsx
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

import React, { useState } from 'react';
import { Box, CheckCircle2, Search, Lock } from 'lucide-react';
import { DependencyInfo } from '../types';

const DEPENDENCIES: DependencyInfo[] = [
  { name: 'C++20 GCC/Clang Toolchain', version: 'std=c++20 (AVX-512)', type: 'production', category: 'core', status: 'installed', description: 'Zero-overhead binary compilation and SIMD register allocation' },
  { name: 'Julia 1.10+ Tensor Engine', version: '^1.10.2', type: 'production', category: 'core', status: 'installed', description: '5D hyper-lattice tensor contraction solver (57000x31x5x4x8)' },
  { name: 'Joules Supply Chain Spec', version: 'RFC-0103-v2', type: 'production', category: 'core', status: 'installed', description: 'Micro-energy budget contract validator (0.000084J / op)' },
  { name: 'Libdl / C-ABI Dynamic Linker', version: 'POSIX.1-2008', type: 'production', category: 'core', status: 'installed', description: 'Dynamic FFI linkage for liblane_vm_cli.so binary execution' },
  { name: '@google/genai', version: '^2.4.0', type: 'production', category: 'core', status: 'installed', description: 'Google GenAI TypeScript SDK client' },
  { name: 'react', version: '^19.0.1', type: 'production', category: 'ui', status: 'installed', description: 'Declarative component rendering runtime' },
  { name: 'react-dom', version: '^19.0.1', type: 'production', category: 'ui', status: 'installed', description: 'DOM bindings for React framework' },
  { name: 'motion', version: '^12.23.24', type: 'production', category: 'ui', status: 'installed', description: 'Hardware-accelerated animations for React' },
  { name: 'lucide-react', version: '^0.546.0', type: 'production', category: 'ui', status: 'installed', description: 'Clean SVG icon symbol system' },
  { name: 'express', version: '^4.21.2', type: 'production', category: 'core', status: 'installed', description: 'Server middleware and HTTP routing' },
  { name: 'dotenv', version: '^17.2.3', type: 'production', category: 'utility', status: 'installed', description: 'Environment configuration management' },
  { name: '@tailwindcss/vite', version: '^4.1.14', type: 'production', category: 'build', status: 'installed', description: 'Tailwind CSS v4 Vite compilation plugin' },
  { name: 'vite', version: '^6.2.3', type: 'production', category: 'build', status: 'installed', description: 'Next-generation web development bundler' },
  { name: 'typescript', version: '~5.8.2', type: 'development', category: 'build', status: 'installed', description: 'Static type checking and transpilation' },
  { name: 'tsx', version: '^4.21.0', type: 'development', category: 'build', status: 'installed', description: 'Direct TypeScript node execution runtime' },
  { name: 'esbuild', version: '^0.25.0', type: 'development', category: 'build', status: 'installed', description: 'Ultra-fast bundler and code packaging' },
  { name: '@types/node', version: '^22.14.0', type: 'development', category: 'build', status: 'installed', description: 'Node.js runtime environment typings' },
  { name: '@types/express', version: '^4.17.21', type: 'development', category: 'build', status: 'installed', description: 'Express.js type definitions' },
  { name: 'tailwindcss', version: '^4.1.14', type: 'development', category: 'build', status: 'installed', description: 'Tailwind utility framework engine' },
];

export const DependencyOverview: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'production' | 'development'>('all');
  const [search, setSearch] = useState('');

  const filtered = DEPENDENCIES.filter((dep) => {
    const matchesFilter = filter === 'all' || dep.type === filter;
    const matchesSearch = dep.name.toLowerCase().includes(search.toLowerCase()) ||
                          dep.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="dependency-overview-card" className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Dependency Registry & Audit</h2>
            <p className="text-xs text-zinc-500">Fully configured node packages and runtime dependencies</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="dep-search-input"
              type="text"
              placeholder="Search package..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 w-36 sm:w-48"
            />
          </div>

          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg text-xs">
            {(['all', 'production', 'development'] as const).map((t) => (
              <button
                key={t}
                id={`filter-btn-${t}`}
                onClick={() => setFilter(t)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                  filter === t
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 text-zinc-500 font-mono border-b border-zinc-100">
              <th className="px-5 py-2.5 font-medium">Package Name</th>
              <th className="px-4 py-2.5 font-medium">Version</th>
              <th className="px-4 py-2.5 font-medium">Scope</th>
              <th className="px-4 py-2.5 font-medium">Description</th>
              <th className="px-5 py-2.5 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((dep) => (
              <tr key={dep.name} className="hover:bg-zinc-50/60 transition-colors">
                <td className="px-5 py-3 font-mono font-medium text-zinc-900">{dep.name}</td>
                <td className="px-4 py-3 font-mono text-zinc-600">{dep.version}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-md font-medium text-[11px] ${
                    dep.type === 'production'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                  }`}>
                    {dep.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600">{dep.description}</td>
                <td className="px-5 py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Installed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
