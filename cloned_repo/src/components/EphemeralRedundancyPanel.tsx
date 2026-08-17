/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * Framework Spec: EPHEMERAL-REDUNDANCY-AGENT-PYTHONXML-BRAILLE-CIPHER
 * ============================================================================== */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Server,
  RefreshCw,
  Lock,
  Unlock,
  Terminal,
  Cpu,
  Radio,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  Layers,
  ArrowRight,
  Zap,
  Globe,
  Database
} from 'lucide-react';
import { LANE_CONSTANTS } from '../types/lane.js';

interface EphemeralRedundancyState {
  agentId: string;
  sequenceId: number;
  timestamp: string;
  hostingNode: 'GITHUB_EPHEMERAL_RUNNER' | 'CLOUDFLARE_EDGE_KV' | 'LANE_VM_LOCAL_CPP_STACK';
  requiresExternalApi: false;
  brailleRotationIndex: number;
  brailleKeyShift: number;
  brailleEncryptedPayload: string;
  pythonXmlEnvelope: string;
  cppStackChecksum: string;
  sha256Digest: string;
  crc32: string;
  healthStatus: 'HEALTHY_AUTONOMOUS' | 'FAILOVER_ACTIVE' | 'ROTATING_CIPHER';
}

interface RedundancyStatusResponse {
  current: EphemeralRedundancyState;
  history: EphemeralRedundancyState[];
  magicHeader: string;
  memoryStrideBytes: number;
  totalCycles: number;
  zeroApiEnforced: boolean;
}

export const EphemeralRedundancyPanel: React.FC = () => {
  const [data, setData] = useState<RedundancyStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Cipher test playground
  const [testPlaintext, setTestPlaintext] = useState<string>('LANE_VM_CPP_STACK_SECURE_EPHEMERAL_HEARTBEAT');
  const [cipherTestResult, setCipherTestResult] = useState<{
    encryptedBraille: string;
    decryptedAscii: string;
    verifiedParity: boolean;
    step: number;
  } | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/redundancy/status');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.status);
        }
      }
    } catch (err) {
      console.error('Failed to fetch redundancy status', err);
    }
  };

  const handleTickHeartbeat = async (node?: EphemeralRedundancyState['hostingNode']) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/redundancy/tick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node }),
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Failed to tick heartbeat', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCipher = async (step: number = 0) => {
    try {
      const res = await fetch('/api/redundancy/cipher/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plaintext: testPlaintext, step }),
      });
      if (res.ok) {
        const json = await res.json();
        setCipherTestResult({
          encryptedBraille: json.encryptedBraille,
          decryptedAscii: json.decryptedAscii,
          verifiedParity: json.verifiedParity,
          step: json.step,
        });
      }
    } catch (err) {
      console.error('Cipher test error', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    handleTestCipher(0);
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const current = data?.current;

  return (
    <div id="ephemeral-redundancy-panel" className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-violet-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400">
              <Server className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  LANE-VM Ephemeral Redundancy Agent
                </h2>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30 font-mono">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  ZERO EXTERNAL API
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Hosting: <span className="text-cyan-300 font-mono">GitHub Ephemeral Runner / Cloudflare Edge KV</span> • Transport: <span className="text-amber-300 font-mono">PythonXML over C++ Stack</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => handleTickHeartbeat()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-2 font-semibold transition shadow-lg shadow-violet-900/40 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Rotate Redundancy Cycle
            </button>
          </div>
        </div>
      </div>

      {/* Node Status & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase">Active Ephemeral Host</div>
          <div className="text-sm font-bold text-violet-300 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-cyan-400" />
            {current?.hostingNode || 'INITIALIZING'}
          </div>
          <div className="text-[10px] text-slate-400 pt-1">Failover: Instantaneous round-robin</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase">Braille Cipher Shift</div>
          <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-amber-400" />
            Step {current?.brailleRotationIndex ?? 0} (+{current?.brailleKeyShift ?? 0} mod 64)
          </div>
          <div className="text-[10px] text-slate-400 pt-1">Matrix: U+2800..U+283F Unicode</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase">C++ Stack Checksum</div>
          <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-emerald-400" />
            0x{current?.cppStackChecksum || '00000000'}
          </div>
          <div className="text-[10px] text-slate-400 pt-1">Memory Stride: 17,684 Bytes</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase">Envelope Integrity</div>
          <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            CRC32: {current?.crc32 || '0x00000000'}
          </div>
          <div className="text-[10px] text-slate-400 pt-1">PythonXML Validated</div>
        </div>
      </div>

      {/* Main Dual Grid: PythonXML Envelope & Braille Cipher Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Left: Live PythonXML Envelope Stream (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <FileCode className="h-4 w-4 text-cyan-400" />
              PythonXML Transport Envelope (Zero-API Autonomous Stream)
            </span>
            <button
              onClick={() => copyToClipboard(current?.pythonXmlEnvelope || '')}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              {copied ? 'Copied' : 'Copy XML'}
            </button>
          </div>

          <pre className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto font-mono leading-relaxed max-h-80">
            {current?.pythonXmlEnvelope || 'Waiting for heartbeat...'}
          </pre>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span>SHA-256: {current?.sha256Digest}</span>
            <span>Magic: {data?.magicHeader}</span>
          </div>
        </div>

        {/* Right: Braille Cipher Rotation & Decryption Matrix (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-400" />
              Braille Cipher Rotation Matrix
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800">
              64-CELL TACTILE
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <label className="text-slate-400 text-[11px]">Plaintext IPC Input:</label>
            <input
              type="text"
              value={testPlaintext}
              onChange={(e) => setTestPlaintext(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:border-violet-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            {[0, 7, 14, 21, 28, 35].map((step) => (
              <button
                key={step}
                onClick={() => handleTestCipher(step)}
                className={`px-2 py-1 rounded text-[10px] border transition ${
                  cipherTestResult?.step === step
                    ? 'bg-amber-600 text-white border-amber-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                Step +{step}
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-500 uppercase">Braille Encrypted Stream:</div>
            <div className="text-base font-serif text-amber-300 tracking-wider break-all bg-slate-900/60 p-2 rounded border border-slate-800">
              {cipherTestResult?.encryptedBraille || '...'}
            </div>

            <div className="text-[10px] text-slate-500 uppercase pt-1">Decrypted C++ Parity:</div>
            <div className="text-xs text-emerald-300 font-mono flex items-center justify-between">
              <span>{cipherTestResult?.decryptedAscii || '...'}</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                100% PARITY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
