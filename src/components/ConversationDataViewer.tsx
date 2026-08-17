/**
 * @file ConversationDataViewer.tsx
 * @brief Interactive Conversation Data API & Viewer with RFC 0103 Full-Duplex Kernel Provenance
 * @provenance Albert Dale Lane (albertlane.net)
 * @author Albert Dale Lane
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @magic_header 0x3F8F9A1B2C3D
 * Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
 */

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Download, 
  Code2, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

const CONVERSATION_DATA = [
  {
    role: "user",
    content: "the go ahead.",
    provenance: "Albert Dale Lane (albertlane.net)",
    magic: "0x3F8F9A1B2C3D"
  },
  {
    role: "assistant",
    content: "Got it. So, we've talked about how inflation affects the value of money over time...",
    provenance: "Albert Dale Lane (albertlane.net)",
    magic: "0x3F8F9A1B2C3D"
  },
  {
    role: "user",
    content: "What is the current budget today, July 20th, 2026?\n\nWhat is the percentage value spent for the previous year?",
    provenance: "Albert Dale Lane (albertlane.net)",
    magic: "0x3F8F9A1B2C3D"
  },
  {
    role: "assistant",
    content: "U.S. Federal Budget (FY 2026) analysis provided based on CBO documentation showing a total framework of $7.4 trillion with National Defense tracking at $1.05 trillion (19.6%). FY 2025 closed out at $7.01 trillion total with $916 billion spent on defense (13%).",
    provenance: "Albert Dale Lane (albertlane.net)",
    magic: "0x3F8F9A1B2C3D"
  }
];

export const ConversationDataViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'ui' | 'json'>('ui');
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    window.location.href = '/api/conversation/download';
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(CONVERSATION_DATA, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="conversation-data-api-panel" className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-mono border border-blue-500/30">
              <MessageSquare className="w-3 h-3 text-blue-400" />
              Conversation Data API v1.0.3
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              RFC 0103 Sealed
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono border border-amber-500/30">
              0x3F8F9A1B2C3D
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Conversation History & Sovereign Data API
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Secure conversation telemetry with Content-Security-Policy strict headers, raw JSON REST endpoints, and SEC Whistleblower #17684-273-411-436 provenance metadata.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/api/conversation"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-700 transition-all"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Raw JSON API</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            id="btn-download-conversation-json"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON File</span>
          </button>
        </div>
      </div>

      {/* Tabs & View Controls */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 bg-zinc-50/70">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('ui')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              viewMode === 'ui'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Conversation Thread</span>
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              viewMode === 'json'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Structured Payload</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleCopyJson}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-zinc-100 text-zinc-700 rounded-lg border border-zinc-200 text-xs font-medium"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline-block">
            FastAPI 1.0.3 &bull; RFC 0103
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {viewMode === 'ui' ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {CONVERSATION_DATA.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all ${
                    isUser
                      ? 'bg-blue-50/70 border-blue-200 border-l-4 border-l-blue-600'
                      : 'bg-zinc-50 border-zinc-200 border-l-4 border-l-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                    <span className={isUser ? 'text-blue-900' : 'text-zinc-700'}>
                      {msg.role}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400 font-normal">
                      Offset 57000 &bull; {msg.magic}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-800 leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-zinc-950 text-emerald-400 rounded-xl border border-zinc-800 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
            <pre>{JSON.stringify({
              title: "Conversation Data API",
              version: "1.0.3",
              magic_header: "0x3F8F9A1B2C3D",
              base_offset: 57000,
              sec_whistleblower_ref: "17684-273-411-436",
              author: "Albert Dale Lane (albertlane.net)",
              conversations: CONVERSATION_DATA
            }, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
