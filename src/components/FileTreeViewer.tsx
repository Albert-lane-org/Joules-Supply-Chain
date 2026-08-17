/**
 * @file FileTreeViewer.tsx
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

import React, { useState, useMemo } from 'react';
import { 
  FolderTree, 
  FileCode, 
  FileJson, 
  FileText, 
  Check, 
  Copy, 
  Lock, 
  Search, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  Code2, 
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { ProjectFile } from '../types';

interface FileTreeViewerProps {
  files: ProjectFile[];
  onSelectFile?: (file: ProjectFile) => void;
}

export const FileTreeViewer: React.FC<FileTreeViewerProps> = ({ files, onSelectFile }) => {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'flat' | 'tree'>('flat');
  const [selectedFileForModal, setSelectedFileForModal] = useState<ProjectFile | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    files.forEach((f) => {
      if (f.category) cats.add(f.category);
    });
    return Array.from(cats);
  }, [files]);

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesCategory = selectedCategory === 'All' || file.category === selectedCategory;
      const matchesSearch =
        file.path.toLowerCase().includes(search.toLowerCase()) ||
        file.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [files, selectedCategory, search]);

  const handleCopyManifest = () => {
    const manifestText = files.map((f) => `${f.path} (${f.size}) - ${f.description}`).join('\n');
    navigator.clipboard.writeText(manifestText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (type: ProjectFile['type']) => {
    switch (type) {
      case 'license':
        return <Lock className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'rust':
        return <Code2 className="w-4 h-4 text-orange-600 shrink-0" />;
      case 'typescript':
        return <FileCode className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'config':
      case 'json':
      case 'yaml':
        return <FileJson className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'style':
        return <FileText className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'sql':
      case 'script':
        return <Terminal className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'python':
        return <FileCode className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <FileText className="w-4 h-4 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <div id="file-tree-viewer-card" className="bg-white rounded-xl border border-zinc-200 shadow-xs p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
            <FolderTree className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-900">Appended Repository Directory Tree</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded">
                {filteredFiles.length} of {files.length} Files
              </span>
            </div>
            <p className="text-xs text-zinc-500">100% of files unzipped, mapped, and appended to active workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-manifest-btn"
            onClick={handleCopyManifest}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 text-zinc-700 rounded-lg text-xs font-medium hover:bg-zinc-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Manifest Copied' : 'Copy Manifest (100% Files)'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pt-2 border-t border-zinc-100">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.slice(0, 7).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${
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
            type="text"
            placeholder="Search all 100+ files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      {/* File List */}
      <div className="max-h-[480px] overflow-y-auto divide-y divide-zinc-100 font-mono text-xs border border-zinc-100 rounded-lg">
        {filteredFiles.map((file) => (
          <div
            key={file.path}
            className="py-2.5 px-3 flex items-center justify-between gap-4 hover:bg-zinc-50/80 transition-colors"
          >
            <div className="flex items-center gap-2.5 truncate">
              {getIcon(file.type)}
              <span className="font-semibold text-zinc-900 truncate">{file.path}</span>
              {file.isUnzipped && (
                <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                  Unzipped
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] text-zinc-500 font-sans hidden md:inline truncate max-w-xs">
                {file.description}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-mono">
                {file.size}
              </span>
              {file.content && (
                <button
                  onClick={() => setSelectedFileForModal(file)}
                  className="p-1 rounded hover:bg-zinc-200 text-zinc-600"
                  title="View File Content"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Code Modal Dialog if requested */}
      {selectedFileForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-zinc-950 text-white rounded-xl border border-zinc-800 w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
                <FileCode className="w-4 h-4" />
                <span>{selectedFileForModal.path}</span>
              </div>
              <button
                onClick={() => setSelectedFileForModal(null)}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-300"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-auto font-mono text-xs leading-relaxed text-zinc-300">
              <pre className="whitespace-pre-wrap">{selectedFileForModal.content || 'Content extracted from archive'}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
