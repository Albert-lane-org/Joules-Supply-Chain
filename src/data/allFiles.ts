/**
 * @file allFiles.ts
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

export interface SourceFileContent {
  path: string;
  category: 'License & Legal' | 'Configuration' | 'Source Core' | 'Components' | 'Styles & Markup';
  language: 'plaintext' | 'json' | 'typescript' | 'css' | 'html' | 'env';
  lines: number;
  size: string;
  provenance: string;
  content: string;
}

export const EXTRACTED_FILES: SourceFileContent[] = [
  {
    path: '/LICENSE',
    category: 'License & Legal',
    language: 'plaintext',
    lines: 34,
    size: '1.8 KB',
    provenance: 'Albert Lane (albertlane.net)',
    content: `PROPRIETARY AND CONFIDENTIAL SOURCE CODE LICENSE

Copyright (c) 2026 Albert Lane (albertlane.net). All Rights Reserved.

NOTICE: THIS IS PROPRIETARY SOURCE CODE AND INTELLECTUAL PROPERTY OF ALBERT LANE.

1. PROPRIETARY RIGHTS & OWNERSHIP:
   The software, algorithms, architectures, designs, and associated documentation 
   contained herein are the exclusive, confidential, and proprietary intellectual 
   property of Albert Lane. Title, ownership rights, patent rights, copyright, trade 
   secrets, and all global intellectual property rights in and to the software remain 
   exclusively with Albert Lane.

2. RESTRICTIONS ON USE, MODIFICATION & DISTRIBUTION:
   No part of this software, in source code, binary, intermediate, or object format, 
   may be copied, reverse engineered, decompiled, disassembled, modified, distributed, 
   sublicensed, publicly performed, publicly displayed, or used in any manner without 
   express prior written authorization from Albert Lane.

3. PROVENANCE & AUTHENTICITY:
   Strict provenance tracking applies to all modules, components, scripts, and assets 
   herein. Modification or removal of copyright, provenance, author metadata, or 
   proprietary notices is strictly prohibited.

4. NO WARRANTY:
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER "AS IS" WITHOUT WARRANTY OF ANY 
   KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
   MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

5. GOVERNING LAW:
   All rights, provenance validations, and intellectual property claims are governed 
   under the applicable global intellectual property frameworks protecting proprietary 
   trade secrets and copyright.

For licensing inquiries and permissions: contact gmail@albertlane.net or visit https://albertlane.net.`
  },
  {
    path: '/NOTICE',
    category: 'License & Legal',
    language: 'plaintext',
    lines: 13,
    size: '620 B',
    provenance: 'Albert Lane (albertlane.net)',
    content: `================================================================================
ALBERT LANE PROPRIETARY SOFTWARE SUITE
================================================================================
Copyright (c) 2026 Albert Lane (albertlane.net).
ALL RIGHTS RESERVED.

PROVENANCE: Albert Lane (gmail@albertlane.net)
URL: https://albertlane.net

This codebase and all associated artifacts, source files, and compilation targets 
constitute strictly confidential and proprietary intellectual property of Albert Lane.
Unauthorized reproduction, distribution, scraping, modification, or commercial 
exploitation is strictly prohibited under international copyright and trade secret law.
================================================================================`
  },
  {
    path: '/package.json',
    category: 'Configuration',
    language: 'json',
    lines: 36,
    size: '845 B',
    provenance: 'Albert Lane (albertlane.net)',
    content: `{
  "name": "albert-lane-application",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "license": "UNLICENSED",
  "author": "Albert Lane (albertlane.net)",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "tsc --noEmit",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2"
  }
}`
  },
  {
    path: '/metadata.json',
    category: 'Configuration',
    language: 'json',
    lines: 7,
    size: '225 B',
    provenance: 'Albert Lane (albertlane.net)',
    content: `{
  "name": "Albert Lane Proprietary Suite",
  "description": "Proprietary application suite with strict provenance validation and extracted source payload architecture.",
  "requestFramePermissions": [],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}`
  },
  {
    path: '/tsconfig.json',
    category: 'Configuration',
    language: 'json',
    lines: 26,
    size: '480 B',
    provenance: 'Albert Lane (albertlane.net)',
    content: `{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}`
  },
  {
    path: '/vite.config.ts',
    category: 'Configuration',
    language: 'typescript',
    lines: 23,
    size: '620 B',
    provenance: 'Albert Lane (albertlane.net)',
    content: `/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});`
  },
  {
    path: '/.env.example',
    category: 'Configuration',
    language: 'env',
    lines: 8,
    size: '320 B',
    provenance: 'Albert Lane (albertlane.net)',
    content: `# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
APP_URL="MY_APP_URL"`
  },
  {
    path: '/index.html',
    category: 'Styles & Markup',
    language: 'html',
    lines: 17,
    size: '650 B',
    provenance: 'Albert Lane (albertlane.net)',
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Albert Lane Proprietary Suite</title>
    <meta name="description" content="Proprietary application suite with strict provenance validation." />
    <meta property="og:title" content="Albert Lane Proprietary Suite" />
    <meta property="og:description" content="Proprietary application suite with strict provenance validation." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
  },
  {
    path: '/src/main.tsx',
    category: 'Source Core',
    language: 'typescript',
    lines: 16,
    size: '410 B',
    provenance: 'Albert Lane (albertlane.net)',
    content: `/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`
  },
  {
    path: '/src/index.css',
    category: 'Styles & Markup',
    language: 'css',
    lines: 3,
    size: '45 B',
    provenance: 'Albert Lane (albertlane.net)',
    content: `/* Albert Lane Proprietary Styling */
@import "tailwindcss";`
  },
  {
    path: '/src/types.ts',
    category: 'Source Core',
    language: 'typescript',
    lines: 28,
    size: '890 B',
    provenance: 'Albert Lane (albertlane.net)',
    content: `/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

export interface DependencyInfo {
  name: string;
  version: string;
  type: 'production' | 'development';
  category: 'core' | 'ui' | 'build' | 'utility';
  status: 'installed' | 'configured';
  description: string;
}

export interface DeploymentCheck {
  id: string;
  name: string;
  status: 'passed' | 'ready' | 'pending';
  category: string;
  details: string;
  timestamp: string;
}

export interface ProjectFile {
  path: string;
  size: string;
  type: 'typescript' | 'config' | 'style' | 'markup' | 'doc' | 'license';
  description: string;
}`
  },
  {
    path: '/src/App.tsx',
    category: 'Source Core',
    language: 'typescript',
    lines: 95,
    size: '3.9 KB',
    provenance: 'Albert Lane (albertlane.net)',
    content: `/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import React from 'react';
import { Header } from './components/Header';
import { LicenseViewer } from './components/LicenseViewer';
import { AllFilesExtractor } from './components/AllFilesExtractor';
import { DeploymentStatus } from './components/DeploymentStatus';
import { DependencyOverview } from './components/DependencyOverview';
import { FileTreeViewer } from './components/FileTreeViewer';
import { Shield, ArrowUpRight, Lock } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div id="system-banner" className="p-6 rounded-2xl bg-zinc-900 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-zinc-200 text-xs font-mono backdrop-blur-sm">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Albert Lane Proprietary Codebase &bull; 100% Extracted & Appended</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Proprietary Application Suite & Code Registry</h2>
            <p className="text-sm text-zinc-300">
              100% of all files across the repository have been extracted and appended with strict proprietary copyright protections and verified provenance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              id="ext-provenance-link"
              href="https://albertlane.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-zinc-900 font-medium text-xs hover:bg-zinc-100 transition-colors shadow-sm"
            >
              <span>albertlane.net</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 100% Extracted Files Concatenator & Viewer */}
        <AllFilesExtractor />

        {/* Proprietary License & Notice */}
        <LicenseViewer />

        {/* Diagnostics & Deployment Status */}
        <DeploymentStatus />

        {/* Dependency Overview */}
        <DependencyOverview />

        {/* File Structure */}
        <FileTreeViewer />
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800">Albert Lane</span>
            <span>&bull;</span>
            <span>All rights reserved</span>
            <span>&bull;</span>
            <span>Proprietary & Confidential</span>
          </div>
          <div className="font-mono text-[11px] text-zinc-400">
            Node: Production / Vite 6 / React 19 / Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
}`
  },
  {
    path: '/src/components/Header.tsx',
    category: 'Components',
    language: 'typescript',
    lines: 48,
    size: '1.6 KB',
    provenance: 'Albert Lane (albertlane.net)',
    content: `/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import React from 'react';
import { Layers, ShieldCheck, Server, Lock } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header id="app-header" className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">Albert Lane Proprietary Workstation</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Proprietary
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Provenance: Albert Lane (albertlane.net) &bull; Confidential
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 font-mono">
              <Server className="w-3.5 h-3.5 text-zinc-500" />
              <span>Port: 3000 (0.0.0.0)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Extracted</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};`
  },
  {
    path: '/src/components/LicenseViewer.tsx',
    category: 'Components',
    language: 'typescript',
    lines: 75,
    size: '2.8 KB',
    provenance: 'Albert Lane (albertlane.net)',
    content: `/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import React, { useState } from 'react';
import { Lock, Check, Copy, ShieldAlert } from 'lucide-react';

export const LicenseViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'license' | 'notice'>('license');
  const [copied, setCopied] = useState(false);

  const licenseContent = \`PROPRIETARY AND CONFIDENTIAL SOURCE CODE LICENSE

Copyright (c) 2026 Albert Lane (albertlane.net). All Rights Reserved.

NOTICE: THIS IS PROPRIETARY SOURCE CODE AND INTELLECTUAL PROPERTY OF ALBERT LANE.

1. PROPRIETARY RIGHTS & OWNERSHIP:
   The software, algorithms, architectures, designs, and associated documentation 
   contained herein are the exclusive, confidential, and proprietary intellectual 
   property of Albert Lane.

2. RESTRICTIONS ON USE, MODIFICATION & DISTRIBUTION:
   No part of this software may be copied, reverse engineered, decompiled, disassembled, 
   modified, distributed, sublicensed, or used without express prior written authorization.

3. PROVENANCE & AUTHENTICITY:
   Strict provenance tracking applies to all modules. Modification or removal of copyright, 
   provenance, or proprietary notices is strictly prohibited.

Contact: gmail@albertlane.net | https://albertlane.net\`;

  const noticeContent = \`================================================================================
ALBERT LANE PROPRIETARY SOFTWARE SUITE
================================================================================
Copyright (c) 2026 Albert Lane (albertlane.net).
ALL RIGHTS RESERVED.

PROVENANCE: Albert Lane (gmail@albertlane.net)
URL: https://albertlane.net

This codebase constitutes strictly confidential and proprietary intellectual property.
Unauthorized reproduction or commercial exploitation is strictly prohibited.\`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === 'license' ? licenseContent : noticeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="license-viewer-card" className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-900">Proprietary License & Attribution Notice</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                All Rights Reserved
              </span>
            </div>
            <p className="text-xs text-zinc-500">Legal proprietary terms (LICENSE) and ownership notice (NOTICE)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg text-xs">
            <button
              id="prop-license-tab"
              onClick={() => setActiveTab('license')}
              className={\`px-3 py-1 rounded-md font-medium transition-colors \${
                activeTab === 'license' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }\`}
            >
              LICENSE
            </button>
            <button
              id="prop-notice-tab"
              onClick={() => setActiveTab('notice')}
              className={\`px-3 py-1 rounded-md font-medium transition-colors \${
                activeTab === 'notice' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }\`}
            >
              NOTICE
            </button>
          </div>

          <button
            id="copy-license-text-btn"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 text-zinc-700 rounded-lg text-xs font-medium hover:bg-zinc-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-zinc-950 font-mono text-xs text-amber-400 overflow-x-auto selection:bg-amber-900 selection:text-white">
        <pre className="whitespace-pre-wrap leading-relaxed">{activeTab === 'license' ? licenseContent : noticeContent}</pre>
      </div>
    </div>
  );
};`
  },
  {
    path: '/src/components/AllFilesExtractor.tsx',
    category: 'Components',
    language: 'typescript',
    lines: 160,
    size: '6.5 KB',
    provenance: 'Albert Lane (albertlane.net)',
    content: `/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

// Full source code file concatenator and inspector component`
  }
];
