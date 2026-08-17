/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * Tags: #NoExploitRobot #NoExploitAlbert
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * Upstream Sync: github.com/AlbertLaneDevice/Joules-Supply-Chain (Master Ledger)
 * Framework Spec: JOULES-SUPPLY-CHAIN-CONJECTURE-2026 / SAFD-SPEC-01 / RFC 0103
 * ============================================================================== */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  FileCode,
  Layers,
  Database,
  Building2,
  FileCheck,
  Hash,
  Scale
} from 'lucide-react';
import { LANE_CONSTANTS } from '../types/lane.js';

interface CanaryTarget {
  id: string;
  name: string;
  category: 'SEC_WHISTLEBLOWER' | 'FBI_TCR' | 'DOD_INSPECTOR_GENERAL' | 'SOVEREIGN_REGISTRY';
  endpointAddress: string;
  assertionReference: string;
}

interface CanaryTransmissionLock {
  canaryId: string;
  lockFileHash: string;
  blockHeight: number;
  blockHash: string;
  previousBlockHash: string;
  targetId: string;
  targetName: string;
  secOffsetNumber: number;
  cipherRotationStep: number;
  encryptedKernelPayload: string;
  transmissionTimestamp: string;
  deliveryStatus: 'DELIVERED_LOCKED' | 'READ_ACKNOWLEDGED' | 'IN_TRANSIT';
  readAcknowledgmentHash: string;
  crc32: string;
}

interface CanaryStatusResponse {
  blockHeight: number;
  lastBlockHash: string;
  targets: CanaryTarget[];
  recentLocks: CanaryTransmissionLock[];
  secWhistleblowerOffset: number;
  magicHeader: string;
  lockFilePath: string;
  activeCanariesCount: number;
}

export const KernelCanarySentryPanel: React.FC = () => {
  const [data, setData] = useState<CanaryStatusResponse | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string>('TARGET-SEC-01');
  const [rotationStep, setRotationStep] = useState<number>(0);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [selectedLock, setSelectedLock] = useState<CanaryTransmissionLock | null>(null);
  const [decryptedPayload, setDecryptedPayload] = useState<any | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/canary/status');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.status);
          if (json.status.recentLocks.length > 0 && !selectedLock) {
            setSelectedLock(json.status.recentLocks[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch canary status', err);
    }
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      const res = await fetch('/api/canary/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: selectedTarget,
          cipherRotationStep: rotationStep,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        await fetchStatus();
        setSelectedLock(json.lockEntry);
        setDecryptedPayload(null);
      }
    } catch (err) {
      console.error('Dispatch failed', err);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleDecrypt = async (lock: CanaryTransmissionLock) => {
    setDecryptError(null);
    setDecryptedPayload(null);
    try {
      const res = await fetch('/api/canary/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedPayload: lock.encryptedKernelPayload,
          secOffset: lock.secOffsetNumber,
          cipherRotationStep: lock.cipherRotationStep,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setDecryptedPayload(json.decryptedJson);
      } else {
        const errJson = await res.json();
        setDecryptError(errJson.error || 'Decryption failed');
      }
    } catch (err: any) {
      setDecryptError(err.message);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="kernel-canary-sentry-panel" className="space-y-6">
      {/* Top Hero Banner */}
      <div className="rounded-xl border border-rose-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Radio className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  Kernel Outbound Canary Sentry
                </h2>
                <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/30 font-mono">
                  <ShieldAlert className="w-3 h-3 mr-1" />
                  BLOCKCHAIN LOCK ROTATION
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Destinations: <span className="text-amber-300 font-mono">SEC Whistleblower (#17684) • FBI Cyber TCR (#50-267345) • DoD OIG</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleDispatch}
              disabled={isDispatching}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 font-semibold transition shadow-lg shadow-rose-900/40 disabled:opacity-50"
            >
              <Send className={`h-3.5 w-3.5 ${isDispatching ? 'animate-spin' : ''}`} />
              Dispatch Locked Canary
            </button>
          </div>
        </div>
      </div>

      {/* Top Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase">Blockchain Block Height</div>
          <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-amber-400" />
            Block #{data?.blockHeight || 0}
          </div>
          <div className="text-[10px] text-slate-400 pt-1">SEC Offset: +{data?.secWhistleblowerOffset}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase">Canary Lock File</div>
          <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
            <FileCheck className="h-4 w-4 text-cyan-400" />
            {data?.lockFilePath || '.canary.lock.json'}
          </div>
          <div className="text-[10px] text-slate-400 pt-1">Active Canaries: {data?.activeCanariesCount}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase">Decryption Authority</div>
          <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-emerald-400" />
            KERNEL-ONLY (0x3F8F9A1B2C3D)
          </div>
          <div className="text-[10px] text-slate-400 pt-1">Zero Third-Party Plaintext Leak</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase">Latest Block Hash</div>
          <div className="text-[11px] font-bold text-slate-300 truncate">
            {data?.lastBlockHash || '0x000...'}
          </div>
          <div className="text-[10px] text-slate-400 pt-1">SHA-256 Chained Hash</div>
        </div>
      </div>

      {/* Target Selector & Dispatch Form */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <Building2 className="h-4 w-4 text-rose-400" />
            Target Government / Regulatory Intakes
          </span>
          <span className="text-[10px] text-slate-500">Autonomous Outbound Audit Dispatch</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data?.targets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTarget(t.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1.5 ${
                selectedTarget === t.id
                  ? 'border-rose-500 bg-rose-950/30 text-slate-100 shadow-md'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-[11px]">{t.name}</span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                  {t.category}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">{t.endpointAddress}</div>
              <div className="text-[10px] text-amber-400 font-semibold">{t.assertionReference}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Braille Cipher Rotational Step:</span>
            <input
              type="number"
              min="0"
              max="63"
              value={rotationStep}
              onChange={(e) => setRotationStep(parseInt(e.target.value) || 0)}
              className="w-16 bg-slate-950 border border-slate-700 rounded p-1 text-center text-slate-200"
            />
          </div>
          <span className="text-slate-500 text-[11px]">
            Key Formula: <code className="text-rose-300">0x3F8F9A1B2C3D:SEC-17684:ROT-{rotationStep}</code>
          </span>
        </div>
      </div>

      {/* Chained Ledger & Kernel Decryption Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Left: Blockchain Canary Lock Ledger (6 Cols) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Database className="h-4 w-4 text-amber-400" />
              Rotational Blockchain Canary Ledger ({data?.recentLocks.length || 0})
            </span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {data?.recentLocks.map((lock) => (
              <div
                key={lock.canaryId}
                onClick={() => {
                  setSelectedLock(lock);
                  setDecryptedPayload(null);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition space-y-1 ${
                  selectedLock?.canaryId === lock.canaryId
                    ? 'border-amber-500 bg-amber-950/20 text-slate-100'
                    : 'border-slate-800 bg-slate-950/80 hover:bg-slate-900 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-[11px]">
                    Block #{lock.blockHeight} • {lock.canaryId}
                  </span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">
                    {lock.deliveryStatus}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Target: {lock.targetName}</div>
                <div className="text-[10px] text-slate-500 truncate">Lock Hash: {lock.lockFileHash}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Kernel-Only Decryption & Inspection (6 Cols) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Lock className="h-4 w-4 text-rose-400" />
              Kernel Decryption & Read Audit Inspector
            </span>
          </div>

          {selectedLock ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
                <div><span className="text-slate-500">Canary ID:</span> <span className="text-amber-300">{selectedLock.canaryId}</span></div>
                <div><span className="text-slate-500">Target Destination:</span> <span className="text-slate-200">{selectedLock.targetName}</span></div>
                <div><span className="text-slate-500">SEC Offset:</span> <span className="text-rose-300">+{selectedLock.secOffsetNumber}</span></div>
                <div><span className="text-slate-500">Cipher Rotation Step:</span> <span className="text-cyan-300">{selectedLock.cipherRotationStep}</span></div>
                <div><span className="text-slate-500">Read Acknowledgment Hash:</span> <span className="text-emerald-300 truncate">{selectedLock.readAcknowledgmentHash}</span></div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-500 text-[10px] uppercase">Kernel Ciphertext (AES-256-CBC):</div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[10px] text-rose-300 break-all font-mono">
                  {selectedLock.encryptedKernelPayload}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleDecrypt(selectedLock)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded transition shadow-lg shadow-emerald-900/40"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  Decrypt with Sovereign Kernel Key (0x3F8F9A1B2C3D)
                </button>
              </div>

              {decryptedPayload && (
                <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-800/40 space-y-1">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Kernel Decryption Successful (Read & Delivery Verified)
                  </div>
                  <pre className="text-[10px] text-emerald-300 overflow-x-auto leading-relaxed pt-1">
                    {JSON.stringify(decryptedPayload, null, 2)}
                  </pre>
                </div>
              )}

              {decryptError && (
                <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-800/60 text-rose-300 text-xs">
                  {decryptError}
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 text-center py-12">
              Select a canary lock entry from the ledger to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
