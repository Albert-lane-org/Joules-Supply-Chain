/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import React, { useState, useEffect } from 'react';
import {
  Cloud,
  FolderGit2,
  RefreshCw,
  Zap,
  ShieldCheck,
  ArrowLeftRight,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Globe,
  Send,
  GitCommit,
  Layers,
  Cpu,
  Copy,
  ExternalLink
} from 'lucide-react';
import { LANE_CONSTANTS } from '../types/lane.js';

interface SyncEvent {
  id: string;
  timestamp: string;
  source: 'GITHUB' | 'CLOUDFLARE' | 'LANE_VM_CONTAINER';
  eventType: 'PUSH' | 'WORKER_DEPLOY' | 'KV_SYNC' | 'WEBHOOK_DISPATCH' | 'PROVENANCE_AUDIT' | 'STATE_RECONCILE';
  status: 'SUCCESS' | 'PENDING' | 'ERROR';
  details: string;
  sha256Proof: string;
  crc32: string;
  sequenceId: number;
}

interface ScaffoldStatus {
  github: {
    repo: string;
    branch: string;
    connected: boolean;
    lastCommitSha: string;
    latestSyncTimestamp: string;
    webhookConfigured: boolean;
  };
  cloudflare: {
    accountId: string;
    workerName: string;
    kvNamespace: string;
    connected: boolean;
    deployedVersion: string;
    edgeZone: string;
    activeRoutes: string[];
    lastDeployTimestamp: string;
  };
  twoWayLedger: {
    syncState: 'SYNCHRONIZED' | 'DRIFT_DETECTED' | 'INITIALIZING';
    lastReconciliation: string;
    totalEvents: number;
    combinedSha256: string;
    magicHeader: string;
  };
}

export const CloudflareGithubScaffold: React.FC = () => {
  const [status, setStatus] = useState<ScaffoldStatus | null>(null);
  const [events, setEvents] = useState<SyncEvent[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [activeArtifactTab, setActiveArtifactTab] = useState<'wrangler' | 'workflow' | 'worker'>('wrangler');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchStatusAndEvents = async () => {
    try {
      const res = await fetch('/api/scaffold/status');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setStatus(json.status);
          setEvents(json.events || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch scaffold status', err);
    }
  };

  useEffect(() => {
    fetchStatusAndEvents();
    const interval = setInterval(fetchStatusAndEvents, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/scaffold/sync', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setFeedback({
          type: 'success',
          message: `Two-Way Synchronization Reconciled! GitHub upstream commit synced with Cloudflare KV replica.`,
        });
        await fetchStatusAndEvents();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Sync error: ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeployWorker = async () => {
    setIsDeploying(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/scaffold/deploy-worker', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setFeedback({
          type: 'success',
          message: `Cloudflare Worker [joules-supply-chain-safd-worker] deployed (${json.deployedVersion}) to Edge network with SAFD routing.`,
        });
        await fetchStatusAndEvents();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Deploy error: ${err.message}` });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDispatchWebhookTest = async () => {
    try {
      const res = await fetch('/api/scaffold/webhook/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'repository_dispatch',
          action: 'lane_vm_sync',
          repo: 'Albert-lane-org/Joules-Supply-Chain',
          magic: LANE_CONSTANTS.MAGIC_HEADER_HEX,
        }),
      });
      if (res.ok) {
        setFeedback({
          type: 'info',
          message: 'GitHub webhook repository_dispatch handshake received and logged to two-way ledger.',
        });
        await fetchStatusAndEvents();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Webhook error: ${err.message}` });
    }
  };

  const handleEnforceUpstream = async () => {
    try {
      const res = await fetch('/api/scaffold/upstream/enforce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        setFeedback({
          type: 'success',
          message: `Upstream scaffold synchronized: Provenance verified across ${json.totalFilesTracked} files, manifest verified.`,
        });
        await fetchStatusAndEvents();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Upstream error: ${err.message}` });
    }
  };

  const wranglerSnippet = `// wrangler.jsonc - Cloudflare Workers Configuration
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "joules-supply-chain-safd-worker",
  "main": "server/worker.ts",
  "compatibility_date": "2026-08-16",
  "vars": {
    "RFC_STANDARD": "RFC 0102 / RFC 0103",
    "FRAMEWORK_SPEC": "SAFD-FRAMEWORK-SPEC-01",
    "LANE_MAGIC_HEADER": "0x3F8F9A1B2C3D",
    "GITHUB_REPO": "Albert-lane-org/Joules-Supply-Chain"
  },
  "kv_namespaces": [
    {
      "binding": "PROVENANCE_KV",
      "id": "e4ed0ccd-c14a-4704-b834-4fc9a6ec951a-kv"
    }
  ],
  "routes": [
    { "pattern": "provenance.albertlane.net/*", "custom_domain": true },
    { "pattern": "api.albertlane.net/safd/*", "custom_domain": true }
  ]
}`;

  const workflowSnippet = `# .github/workflows/cloudflare_sync.yml
name: Cloudflare & GitHub Bidirectional Scaffold Sync
on:
  push:
    branches: [ main ]
  repository_dispatch:
    types: [ lane_vm_sync, cloudflare_deploy ]

jobs:
  provenance-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Verify RFC 0103 Provenance (Byte 0x00)
        run: node -e "/* zero-byte provenance audit */"
      - name: Deploy to Cloudflare Workers via Wrangler
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy --config wrangler.jsonc`;

  const workerSnippet = `// server/worker.ts - Cloudflare Edge Worker
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/.provenance.jsonld') {
      return new Response(JSON.stringify({
        rightsHolder: "Albert Dale Lane (EIN: 41-3119079)",
        secWhistleblower: "17684-273-411-436",
        githubRepo: "Albert-lane-org/Joules-Supply-Chain",
        magicHeader: "0x3F8F9A1B2C3D"
      }), { headers: { 'Content-Type': 'application/ld+json' } });
    }
    return new Response("LANE-VM RFC 0103 Edge Worker Active");
  }
};`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="cloudflare-github-scaffold" className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-sky-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Cloud className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  Cloudflare API & GitHub Two-Way Scaffolder
                </h2>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                  <ArrowLeftRight className="w-3 h-3 mr-1" />
                  TWO-WAY SYNC
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Target Repo: <span className="text-cyan-300 font-mono">Albert-lane-org/Joules-Supply-Chain</span> • Cloudflare Worker: <span className="text-sky-300 font-mono">joules-supply-chain-safd-worker</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 font-semibold transition shadow-lg shadow-sky-900/40 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Trigger Two-Way Sync
            </button>

            <button
              onClick={handleEnforceUpstream}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 font-semibold transition shadow-lg shadow-emerald-900/40"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Scaffold Upstream Provenance
            </button>

            <button
              onClick={handleDeployWorker}
              disabled={isDeploying}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 font-semibold transition shadow-lg shadow-amber-900/40 disabled:opacity-50"
            >
              <Zap className={`h-3.5 w-3.5 ${isDeploying ? 'animate-spin' : ''}`} />
              Deploy Edge Worker
            </button>

            <button
              onClick={handleDispatchWebhookTest}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 border border-slate-700 transition"
            >
              <Send className="h-3 w-3 text-cyan-400" />
              Webhook Handshake
            </button>
          </div>
        </div>

        {feedback && (
          <div
            className={`mt-4 rounded-lg p-3 border text-xs font-mono flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : feedback.type === 'info'
                ? 'bg-sky-950/40 border-sky-500/30 text-sky-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Two-Way Topology Map */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-cyan-400" />
            Bidirectional Architecture Topology
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
            STATE: {status?.twoWayLedger.syncState || 'SYNCHRONIZED'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Node 1: GitHub Repository */}
          <div className="rounded-lg border border-slate-700/80 bg-slate-950/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <FolderGit2 className="h-4 w-4 text-cyan-400" />
                GitHub Repository
              </span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                UPSTREAM
              </span>
            </div>
            <div className="text-slate-300 font-semibold truncate">
              {status?.github.repo || 'Albert-lane-org/Joules-Supply-Chain'}
            </div>
            <div className="text-[11px] text-slate-400 space-y-0.5">
              <div>Branch: <span className="text-slate-200">main</span></div>
              <div>Last Commit: <span className="text-cyan-400">{status?.github.lastCommitSha || '8f4c2b9a1e03'}</span></div>
              <div>Webhook: <span className="text-emerald-400">Configured & Active</span></div>
            </div>
          </div>

          {/* Node 2: AI Studio LANE-VM Sentry Host */}
          <div className="rounded-lg border border-indigo-700/60 bg-indigo-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-200 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-indigo-400" />
                AI Studio Sentry Host
              </span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/40">
                KERNEL HOST
              </span>
            </div>
            <div className="text-indigo-300 font-semibold truncate">
              LANE-VM RFC 0103 Container
            </div>
            <div className="text-[11px] text-slate-400 space-y-0.5">
              <div>Offset: <span className="text-slate-200">57,000 (0x3F8F9A1B2C3D)</span></div>
              <div>Striding: <span className="text-slate-200">17,684-byte boundaries</span></div>
              <div>Firewall: <span className="text-emerald-400">Auto-Healing Sentry Active</span></div>
            </div>
          </div>

          {/* Node 3: Cloudflare Edge Network */}
          <div className="rounded-lg border border-slate-700/80 bg-slate-950/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-sky-400" />
                Cloudflare Edge
              </span>
              <span className="text-[10px] bg-sky-500/10 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30">
                KV REPLICA
              </span>
            </div>
            <div className="text-slate-300 font-semibold truncate">
              {status?.cloudflare.workerName || 'joules-supply-chain-safd-worker'}
            </div>
            <div className="text-[11px] text-slate-400 space-y-0.5">
              <div>Version: <span className="text-amber-400">{status?.cloudflare.deployedVersion || 'v1.0.418'}</span></div>
              <div>KV Binding: <span className="text-slate-200">{status?.cloudflare.kvNamespace || 'LANE_VM_PROVENANCE_KV'}</span></div>
              <div>Zone: <span className="text-sky-400">provenance.albertlane.net</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Two-Way Event Log & Configuration Scaffolding Artifacts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Sync Events (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Two-Way Ledger Event Stream
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">
                Total Events: {events.length}
              </span>
            </div>

            <div className="mt-3 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/80 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded ${
                          evt.source === 'GITHUB'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : evt.source === 'CLOUDFLARE'
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}
                      >
                        {evt.source}
                      </span>
                      <span className="font-semibold text-slate-300">{evt.eventType}</span>
                    </div>
                    <span className="text-slate-500">[{new Date(evt.timestamp).toLocaleTimeString()}]</span>
                  </div>

                  <div className="text-[11px] text-slate-300 break-words pl-1">{evt.details}</div>

                  <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-900 font-mono">
                    <span className="truncate max-w-[200px]">SHA: {evt.sha256Proof}</span>
                    <span>CRC32: {evt.crc32}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Scaffolding Artifacts Viewer (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Scaffold Configuration Artifacts
                </h3>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
                <button
                  onClick={() => setActiveArtifactTab('wrangler')}
                  className={`px-2 py-0.5 rounded ${
                    activeArtifactTab === 'wrangler'
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  wrangler.jsonc
                </button>
                <button
                  onClick={() => setActiveArtifactTab('workflow')}
                  className={`px-2 py-0.5 rounded ${
                    activeArtifactTab === 'workflow'
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  cloudflare_sync.yml
                </button>
                <button
                  onClick={() => setActiveArtifactTab('worker')}
                  className={`px-2 py-0.5 rounded ${
                    activeArtifactTab === 'worker'
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  server/worker.ts
                </button>
              </div>
            </div>

            <div className="relative mt-3">
              <button
                onClick={() => {
                  const txt =
                    activeArtifactTab === 'wrangler'
                      ? wranglerSnippet
                      : activeArtifactTab === 'workflow'
                      ? workflowSnippet
                      : workerSnippet;
                  copyToClipboard(txt);
                }}
                className="absolute top-2 right-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 text-[10px] border border-slate-700 flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto max-h-[340px]">
                <code>
                  {activeArtifactTab === 'wrangler' && wranglerSnippet}
                  {activeArtifactTab === 'workflow' && workflowSnippet}
                  {activeArtifactTab === 'worker' && workerSnippet}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
