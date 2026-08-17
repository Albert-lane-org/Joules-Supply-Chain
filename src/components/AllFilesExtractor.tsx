/**
 * @file AllFilesExtractor.tsx
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
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { EXTRACTED_FILES, SourceFileContent } from '../data/allFiles';

export const AllFilesExtractor: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    EXTRACTED_FILES.forEach((f) => {
      init[f.path] = true;
    });
    return init;
  });
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const categories = ['All', 'License & Legal', 'Configuration', 'Source Core', 'Components', 'Styles & Markup'];

  const filteredFiles = EXTRACTED_FILES.filter((file) => {
    const matchesCategory = selectedCategory === 'All' || file.category === selectedCategory;
    const matchesSearch =
      file.path.toLowerCase().includes(search.toLowerCase()) ||
      file.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalLines = EXTRACTED_FILES.reduce((acc, f) => acc + f.lines, 0);

  const handleToggle = (path: string) => {
    setExpandedFiles((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleToggleAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    EXTRACTED_FILES.forEach((f) => {
      next[f.path] = expand;
    });
    setExpandedFiles(next);
  };

  const handleCopyFile = (path: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(path);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleCopyAllExtracted = () => {
    const aggregated = EXTRACTED_FILES.map(
      (f) =>
        `/* ==========================================================================\n   FILE: ${f.path}\n   PROVENANCE: ${f.provenance}\n   LICENSE: Proprietary (All Rights Reserved)\n   ========================================================================== */\n\n${f.content}\n\n`
    ).join('\n');

    navigator.clipboard.writeText(aggregated);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadPayload = () => {
    const aggregated = EXTRACTED_FILES.map(
      (f) =>
        `/* ==========================================================================\n   FILE: ${f.path}\n   PROVENANCE: ${f.provenance}\n   LICENSE: Proprietary (All Rights Reserved)\n   ========================================================================== */\n\n${f.content}\n\n`
    ).join('\n');

    const blob = new Blob([aggregated], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `albert-lane-extracted-source-bundle.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="all-files-extractor" className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
      {/* Extractor Header */}
      <div className="p-5 border-b border-zinc-100 bg-zinc-50/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900">Extracted Proprietary Codebase (100% Appended)</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                <Lock className="w-3 h-3 text-amber-700" />
                {EXTRACTED_FILES.length} Files &bull; {totalLines} Lines
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              100% complete source code payload with Albert Lane provenance tags
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="toggle-expand-all-btn"
            onClick={() => handleToggleAll(true)}
            className="px-2.5 py-1.5 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-xs font-medium hover:bg-zinc-50"
          >
            Expand All
          </button>
          <button
            id="toggle-collapse-all-btn"
            onClick={() => handleToggleAll(false)}
            className="px-2.5 py-1.5 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-xs font-medium hover:bg-zinc-50"
          >
            Collapse All
          </button>
          <button
            id="copy-all-payload-btn"
            onClick={handleCopyAllExtracted}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors shadow-xs"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Appended Code Copied!' : 'Copy 100% Code Payload'}</span>
          </button>
          <button
            id="download-payload-btn"
            onClick={handleDownloadPayload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold rounded-lg text-xs transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-zinc-950" />
            <span>Export Bundle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`cat-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-code-input"
            type="text"
            placeholder="Search code or files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      {/* Appended Files List with Full Code Display */}
      <div className="divide-y divide-zinc-200">
        {filteredFiles.map((file) => {
          const isExpanded = expandedFiles[file.path] ?? true;
          return (
            <div key={file.path} id={`file-section-${file.path.replace(/[/.]/g, '-')}`} className="bg-white">
              {/* File header row */}
              <div
                onClick={() => handleToggle(file.path)}
                className="p-3.5 px-5 flex items-center justify-between gap-3 hover:bg-zinc-50/80 cursor-pointer select-none transition-colors border-l-4 border-amber-400"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-zinc-400 hover:text-zinc-600">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                  <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-mono text-xs font-bold text-zinc-900 truncate">{file.path}</span>
                  <span className="hidden sm:inline-flex text-[10px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                    {file.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <div className="text-[11px] font-mono text-zinc-500 hidden md:flex items-center gap-2">
                    <span>{file.lines} lines</span>
                    <span>&bull;</span>
                    <span>{file.size}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    Proprietary
                  </span>

                  <button
                    id={`copy-single-file-${file.path.replace(/[/.]/g, '-')}`}
                    onClick={() => handleCopyFile(file.path, file.content)}
                    className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors"
                    title="Copy File Content"
                  >
                    {copiedFile === file.path ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Code block body */}
              {isExpanded && (
                <div className="border-t border-zinc-100 bg-zinc-950 p-4 font-mono text-xs overflow-x-auto relative">
                  <div className="absolute top-2 right-3 text-[10px] font-mono text-zinc-500 select-none">
                    {file.language.toUpperCase()} &bull; {file.provenance}
                  </div>
                  <pre className="text-zinc-200 leading-relaxed font-mono selection:bg-amber-900 selection:text-white">
                    {file.content}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
