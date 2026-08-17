/**
 * @file App.tsx
 * @license Proprietary
 * @provenance Albert Dale Lane (albertlane.net)
 * @author Albert Dale Lane
 * @source github.com/Albert-lane/GOOGLE-LLC-IS-ANTI-CONSUMER-v2
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @magic_header 0x3F8F9A1B2C3D
 * Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { NpmRegistryGravitationalAuditor } from './components/NpmRegistryGravitationalAuditor';
import { EvidentiaryDocketViewer } from './components/EvidentiaryDocketViewer';
import { MathematicalDerivationModelPanel } from './components/MathematicalDerivationModelPanel';
import { LaneVMJoulesRuntimeEngine } from './components/LaneVMJoulesRuntimeEngine';
import { LaneVMKernelBrailleCipher } from './components/LaneVMKernelBrailleCipher';
import { SecurityHeaderAuditor } from './components/SecurityHeaderAuditor';
import { CloudflareWorkerDeployer } from './components/CloudflareWorkerDeployer';
import { GitHubPushCliConsole } from './components/GitHubPushCliConsole';
import { CloudflareHeadlessAuditor } from './components/CloudflareHeadlessAuditor';
import { GitHubAuthSyncGuide } from './components/GitHubAuthSyncGuide';
import { SelfHostedRunnerSentry } from './components/SelfHostedRunnerSentry';
import { NodeSmokeTestProvenancePanel } from './components/NodeSmokeTestProvenancePanel';
import { CppJuliaArchitecturePanel } from './components/CppJuliaArchitecturePanel';
import { GeminiCoArchitectKernelCLI } from './components/GeminiCoArchitectKernelCLI';
import { ReactToLaneVMScaffoldModal } from './components/ReactToLaneVMScaffoldModal';
import { ConversationDataViewer } from './components/ConversationDataViewer';
import { GitHubIndexHtmlGenerator } from './components/GitHubIndexHtmlGenerator';
import { RFC0103ProvenanceValidator } from './components/RFC0103ProvenanceValidator';
import { TriCloudScaffoldLauncher } from './components/TriCloudScaffoldLauncher';
import { ZipExtractor } from './components/ZipExtractor';
import { AllFilesExtractor } from './components/AllFilesExtractor';
import { FileTreeViewer } from './components/FileTreeViewer';
import { LicenseViewer } from './components/LicenseViewer';
import { DeploymentStatus } from './components/DeploymentStatus';
import { DependencyOverview } from './components/DependencyOverview';
import { ProjectFile } from './types';
import { UNZIPPED_CLONED_FILES } from './data/unzippedClonedFiles';
import { ArrowUpRight, GitBranch, Zap, ShieldCheck, Cpu, Cloud, FileCode, Lock } from 'lucide-react';

export default function App() {
  const [repositoryFiles, setRepositoryFiles] = useState<ProjectFile[]>(UNZIPPED_CLONED_FILES);

  const handleFilesUpdated = (updatedFiles: ProjectFile[]) => {
    setRepositoryFiles(updatedFiles);
  };

  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner with Cloned Repo & Multi-Cloud Scaffolding notice */}
        <div id="system-banner" className="p-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-zinc-800">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-zinc-200 text-xs font-mono backdrop-blur-sm border border-white/10">
                <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                <span>Albert-lane/GOOGLE-LLC-IS-ANTI-CONSUMER-v2</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-mono border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                RFC 0103 Confirmed
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-mono border border-amber-400/30">
                <Zap className="w-3 h-3 text-amber-400" />
                Tri-Cloud Mesh: albertlane.net
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Albert Lane Sovereign Suite & Lane-VM Kernel Engine
            </h2>
            <p className="text-sm text-zinc-300">
              Scaffolding running live on the <strong className="text-amber-300">Lane-VM Kernel</strong> with real-time Unicode Braille rotating ciphers, hardened A+ edge security headers, Cloudflare edge worker deployer, and sovereign GitHub <code className="text-amber-300 bg-white/10 px-1 py-0.5 rounded text-xs font-mono">index.html</code> front end deployed to <code className="text-amber-300 bg-white/10 px-1 py-0.5 rounded text-xs font-mono">albertlane.net</code>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <a
              id="ext-provenance-link"
              href="https://albertlane.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-sm"
            >
              <span>albertlane.net</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 0. npm Registry Derivations Scanner & Gravitational Provenance Engine */}
        <NpmRegistryGravitationalAuditor />

        {/* 0.05 Evidentiary Bates Docket & 89-Page Google Reviews Fraud Transcript Ledger */}
        <EvidentiaryDocketViewer />

        {/* 0.1 Formal 4-Model Mathematical Derivation & Code Similarity Engine */}
        <MathematicalDerivationModelPanel />

        {/* 1. Gemini 3.8 Lane-VM Co-Architect & Native Kernel CLI Execution */}
        <GeminiCoArchitectKernelCLI />

        {/* 2. React to Lane-VM Native Kernel Scaffolding Engine & Transpilation Modality */}
        <ReactToLaneVMScaffoldModal />

        {/* 3. Conversation Data API & Viewer (RFC 0103 Attested) */}
        <ConversationDataViewer />

        {/* 4. Lane-VM & Joules Polyglot Runtime Replacement Engine */}
        <LaneVMJoulesRuntimeEngine />

        {/* 2. Lane-VM Kernel with Braille Rotating Ciphers */}
        <LaneVMKernelBrailleCipher />

        {/* 2. Edge Security Header Auditor & Hardening Enforcer */}
        <SecurityHeaderAuditor />

        {/* 3. Cloudflare Worker Deployer to albertlane.net */}
        <CloudflareWorkerDeployer />

        {/* 4. Sovereign GitHub Push CLI Automation Console */}
        <GitHubPushCliConsole />

        {/* 5. Cloudflare Worker Headless Repo Auditor */}
        <CloudflareHeadlessAuditor />

        {/* 6. GitHub Authentication & Token-Free Push Options */}
        <GitHubAuthSyncGuide />

        {/* 7. Self-Hosted Runner & _NOEXPLOITROBOT Workflow Sentry */}
        <SelfHostedRunnerSentry />

        {/* 8. Node Deprecation Fix, Smoke Test & RFC 0103 Blanket Auditor */}
        <NodeSmokeTestProvenancePanel />

        {/* 9. Lane-VM C++ & Julia Native Binary Architecture */}
        <CppJuliaArchitecturePanel />

        {/* 10. Standalone GitHub index.html Frontend Generator */}
        <GitHubIndexHtmlGenerator />

        {/* 5. RFC 0103 Upstream & Downstream Provenance Confirmation */}
        <RFC0103ProvenanceValidator files={repositoryFiles} />

        {/* 6. Tri-Cloud Scaffolding Launcher (Google Cloud Run + Cloudflare Edge + GitHub) */}
        <TriCloudScaffoldLauncher />

        {/* 7. Live ZIP Extractor & Appended Repo Stats */}
        <ZipExtractor onFilesUpdated={handleFilesUpdated} currentFiles={repositoryFiles} />

        {/* 8. Appended Directory Tree (100% of files from cloned repo and archives) */}
        <FileTreeViewer files={repositoryFiles} />

        {/* 9. 100% Extracted Files Concatenator & Code Inspector */}
        <AllFilesExtractor />

        {/* 10. Official Proprietary License & IP Declaration */}
        <LicenseViewer />

        {/* 11. Diagnostics & Deployment Status */}
        <DeploymentStatus />

        {/* 12. Dependency Overview */}
        <DependencyOverview />
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800">Albert Dale Lane</span>
            <span>&bull;</span>
            <span>All rights reserved</span>
            <span>&bull;</span>
            <span className="text-amber-700 font-medium">SEC Whistleblower Ref #17684-273-411-436</span>
          </div>
          <div className="font-mono text-[11px] text-zinc-400">
            Source: Albert-lane/GOOGLE-LLC-IS-ANTI-CONSUMER-v2 &bull; Domain: albertlane.net
          </div>
        </div>
      </footer>
    </div>
  );
}
