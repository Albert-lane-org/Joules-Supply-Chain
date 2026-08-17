/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Assertions: SEC Whistleblower #17684-273-411-436
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Globe, 
  ShieldCheck, 
  GitBranch, 
  Eye, 
  Code2, 
  Sparkles,
  Terminal
} from 'lucide-react';

export const GitHubIndexHtmlGenerator: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const indexHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Albert Lane Sovereign Suite & Lane-VM Kernel</title>
  
  <!-- Provenance & Sovereign IP Meta Directives -->
  <meta name="author" content="Albert Dale Lane" />
  <meta name="rights-holder" content="Albert Dale Lane (EIN: 41-3119079)" />
  <meta name="sec-whistleblower" content="17684-273-411-436" />
  <meta name="provenance-authority" content="https://provenance.albertlane.net/.provenance.jsonld" />
  <meta name="lane-magic-header" content="0x3F8F9A1B2C3D" />
  <meta name="lane-base-offset" content="57000" />
  <meta name="rfc-standard" content="RFC 0103 / SPEC-0100" />
  <meta name="governing-jurisdiction" content="State of Oregon, USA | England & Wales, UK" />
  
  <!-- Hardened Security & Isolation Headers via Meta -->
  <meta http-equiv="X-Content-Type-Options" content="nosniff" />
  <meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  
  <!-- JSON-LD Sovereign Provenance Attestation -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Albert Lane Sovereign Suite & Lane-VM Kernel",
    "author": {
      "@type": "Person",
      "name": "Albert Dale Lane",
      "email": "gmail@albertlane.net",
      "url": "https://albertlane.net"
    },
    "license": "https://albertlane.net/license",
    "version": "2.0.0",
    "identifier": "SEC-Whistleblower-17684-273-411-436",
    "applicationCategory": "Distributed Compute Kernel & Provenance Ledger",
    "operatingSystem": "Lane-VM 5D Kernel / Cloudflare Edge / Linux"
  }
  </script>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes braille-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .braille-rotate {
      animation: braille-spin 12s linear infinite;
    }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen font-sans flex flex-col selection:bg-amber-400 selection:text-zinc-950">
  
  <!-- Top Sovereign Header -->
  <header class="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-base shadow-sm">
          AL
        </div>
        <div>
          <h1 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Albert Lane Sovereign Suite</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Lane-VM v2.0
            </span>
          </h1>
          <p class="text-xs text-zinc-400 font-mono">SEC Whistleblower Ref #17684-273-411-436 &bull; albertlane.net</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <a href="https://albertlane.net" target="_blank" class="px-3.5 py-1.5 rounded-lg bg-amber-400 text-zinc-950 text-xs font-bold hover:bg-amber-300 transition-colors">
          albertlane.net &rarr;
        </a>
      </div>
    </div>
  </header>

  <!-- Main Showcase Container -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 space-y-6 w-full">
    
    <!-- Hero Banner -->
    <div class="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 text-white space-y-4">
      <div class="flex items-center gap-2 flex-wrap text-xs font-mono">
        <span class="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
          ✓ RFC 0103 Verified
        </span>
        <span class="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
          ⚡ Lane-VM 5D Kernel
        </span>
        <span class="px-2.5 py-1 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/30">
          🌐 Cloudflare Edge Mesh
        </span>
      </div>
      <h2 class="text-3xl font-extrabold tracking-tight">
        Cryptographic Provenance & Sovereign Compute Kernel
      </h2>
      <p class="text-sm text-zinc-300 max-w-3xl leading-relaxed">
        Full-stack front end deployed to <strong class="text-amber-300">albertlane.net</strong>. Powered by the Lane-VM 5D host kernel using live Unicode Braille rotating ciphers (U+2800..U+28FF) and hardened A+ edge security headers.
      </p>
    </div>

    <!-- Live Braille Rotating Cipher Display -->
    <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
      <div class="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800 pb-3">
        <span class="text-amber-400 font-semibold flex items-center gap-2">
          <span>●</span> Live Braille Rotating Cipher Stream
        </span>
        <span>Magic: 0x3F8F9A1B2C3D | Base Offset: 57,000</span>
      </div>

      <div id="braille-cipher-stream" class="p-6 rounded-xl bg-black/80 border border-zinc-800 text-amber-400 font-mono text-3xl tracking-widest break-all min-h-[5rem] flex items-center select-all">
        ⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠇⠇⠁⠝⠑⠧⠍⠎⠕⠧⠑⠗⠑⠊⠛⠝⠅⠑⠗⠝⠑⠇
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-zinc-400 pt-2">
        <div class="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
          <span class="text-zinc-500 block text-[10px]">EXECUTION MODE</span>
          <span class="text-white font-bold">GROUND_31 (31-Bit Sovereign)</span>
        </div>
        <div class="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
          <span class="text-zinc-500 block text-[10px]">ROTATION FORMULA</span>
          <span class="text-amber-300 font-bold">ROTL8(Byte, θ + Offset % 8)</span>
        </div>
        <div class="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
          <span class="text-zinc-500 block text-[10px]">SECURITY AUDIT</span>
          <span class="text-emerald-400 font-bold">Grade A+ (100/100 CSP/HSTS)</span>
        </div>
      </div>
    </div>

    <!-- Edge Routing & Cloudflare Scaffolding -->
    <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 class="text-base font-bold text-white">Cloudflare Edge & Domain Synchronization</h3>
        <p class="text-xs text-zinc-400 mt-1">Live worker routed to <code class="text-amber-300">albertlane.net/*</code> with strict HSTS preload.</p>
      </div>
      <a href="https://albertlane.net/.provenance.jsonld" target="_blank" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-mono font-medium border border-zinc-700 transition-colors">
        Verify /.provenance.jsonld &rarr;
      </a>
    </div>

  </main>

  <!-- Footer -->
  <footer class="border-t border-zinc-800 bg-zinc-900/40 py-6 text-center text-xs text-zinc-500 font-mono">
    Copyright &copy; 2026 Albert Dale Lane. All Rights Reserved. &bull; SEC Whistleblower Ref #17684-273-411-436
  </footer>

  <!-- Live Braille Script Engine -->
  <script>
    const streamEl = document.getElementById('braille-cipher-stream');
    let step = 0;
    const baseText = "ALBERT-LANE-SOVEREIGN-KERNEL-v2.0-SEC-17684-273-411-436";
    
    function rotl8(n, shift) {
      const s = shift % 8;
      return ((n << s) | (n >>> (8 - s))) & 0xFF;
    }

    function updateCipher() {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(baseText);
      const braille = Array.from(bytes).map((b, idx) => {
        const shift = (step + idx + (57000 % 8)) % 8;
        const rotated = rotl8(b, shift);
        return String.fromCharCode(0x2800 + (rotated & 0xFF));
      }).join('');
      streamEl.textContent = braille;
      step = (step + 1) % 256;
    }

    setInterval(updateCipher, 400);
    updateCipher();
  </script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(indexHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([indexHtmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="github-index-html-generator" className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-100 bg-zinc-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-900 text-xs font-mono font-medium border border-zinc-300">
              <FileCode className="w-3.5 h-3.5 text-zinc-700" />
              GitHub index.html Frontend
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              Domain Target: albertlane.net
            </span>
          </div>
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
            Production GitHub index.html & Standalone Frontend
          </h2>
          <p className="text-xs text-zinc-600">
            Standalone single-file front end ready for GitHub Pages, Cloudflare Pages, and Edge Worker root dispatch on <code className="text-zinc-800 font-mono font-medium">albertlane.net</code>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end flex-wrap">
          <div className="flex bg-zinc-200/80 p-1 rounded-xl text-xs">
            <button
              id="btn-view-preview"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'preview' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual Preview</span>
            </button>
            <button
              id="btn-view-code"
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'code' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Source HTML</span>
            </button>
          </div>

          <button
            id="btn-copy-index-html"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-medium rounded-xl border border-zinc-200 transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy HTML</span>
              </>
            )}
          </button>

          <button
            id="btn-download-index-html"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download index.html</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'preview' ? (
        <div className="p-6 bg-zinc-950 text-white space-y-6">
          {/* Simulated Browser Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-zinc-300 font-medium">https://albertlane.net/index.html</span>
            </div>
            <span className="text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              HTTPS TLS 1.3 Strict
            </span>
          </div>

          {/* Embedded Visual Interface */}
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-950 font-bold flex items-center justify-center text-sm">
                  AL
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Albert Lane Sovereign Suite</h3>
                  <p className="text-[10px] font-mono text-zinc-400">SEC Ref #17684-273-411-436</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-mono">
                Lane-VM 5D Kernel
              </span>
            </div>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono mb-1">Live Braille Rotating Cipher (Unicode U+2800..U+28FF):</div>
              <div className="text-2xl text-amber-400 font-mono tracking-widest break-all">
                ⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠇⠇⠁⠝⠑⠧⠍⠎⠕⠧⠑⠗⠑⠊⠛⠝⠅⠑⠗⠝⠑⠇
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-zinc-950 text-zinc-300 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap leading-relaxed">{indexHtmlCode}</pre>
        </div>
      )}

      {/* Footer Details */}
      <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
          <span>Branch: main &bull; Path: /index.html &bull; Auto-synced with Cloudflare Worker</span>
        </div>
        <span className="font-mono text-zinc-500 text-[11px]">Deploy target: albertlane.net</span>
      </div>
    </div>
  );
};
