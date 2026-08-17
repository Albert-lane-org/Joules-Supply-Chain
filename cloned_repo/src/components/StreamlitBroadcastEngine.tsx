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
  Radio,
  ShieldCheck,
  ShieldAlert,
  Send,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  Lock,
  ArrowRight,
  Server,
  Zap,
  CheckCircle2,
  AlertOctagon,
  ExternalLink
} from 'lucide-react';
import { LANE_CONSTANTS } from '../types/lane.js';

interface StreamLog {
  id: string;
  sequenceId: number;
  timestamp: string;
  direction: 'INBOUND' | 'OUTBOUND_BROADCAST' | 'SYSTEM' | 'ERROR' | 'SENTRY_DROP';
  payload: string;
  truncated: boolean;
  crc32: string;
  pinnedIp: string;
}

interface ValidationMetadata {
  originalHost: string;
  pinnedIp: string;
  port: number;
  headers: Record<string, string>;
  isSsl: boolean;
  subterraneanUnwrapped: boolean;
  unwrappedIpv4?: string;
  transitionType?: string;
  rfc0103HandshakeDigest: string;
}

export const StreamlitBroadcastEngine: React.FC = () => {
  const [targetUri, setTargetUri] = useState<string>('wss://echo.websocket.org');
  const [testPayload, setTestPayload] = useState<string>('RFC_0102::LANE_VM_BROADCAST_FRAME_TEST');
  const [logs, setLogs] = useState<StreamLog[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [pinnedMetadata, setPinnedMetadata] = useState<ValidationMetadata | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Subterranean IPv6 test vectors
  const testVectors = [
    { label: 'Public Echo (Secure WSS)', uri: 'wss://echo.websocket.org' },
    { label: 'IPv4-Mapped IPv6 (SSRF Trap)', uri: 'ws://[::ffff:127.0.0.1]:80/stream' },
    { label: '6to4 Tunneling (RFC 3056)', uri: 'ws://[2002:7f00:0001::]:8080/feed' },
    { label: 'Teredo 0xFFFFFFFF XOR (RFC 4380)', uri: 'ws://[2001:0000:4136:e378:8000:63bf:3fff:fdd2]:80/ws' },
    { label: 'Cloud Metadata (169.254.169.254)', uri: 'ws://[::ffff:169.254.169.254]:80/meta' },
  ];

  const fetchLogsAndStatus = async () => {
    try {
      const res = await fetch('/api/safd/status');
      if (res.ok) {
        const json = await res.json();
        setStatus(json.status);
        if (json.status.metadata) {
          setPinnedMetadata(json.status.metadata);
        }
      }

      const logRes = await fetch('/api/safd/stream-logs');
      if (logRes.ok) {
        const logJson = await logRes.json();
        setLogs(logJson.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch SAFD status', err);
    }
  };

  useEffect(() => {
    fetchLogsAndStatus();
    const interval = setInterval(fetchLogsAndStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleValidateAndConnect = async (uriToTest?: string) => {
    const uri = uriToTest || targetUri;
    setIsValidating(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/safd/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: uri }),
      });

      const json = await res.json();
      if (json.success && json.result.isValid) {
        setPinnedMetadata(json.result.metadata);
        setFeedback({
          type: 'success',
          message: `Endpoint Verified & Pinned to IP Literal [${json.result.metadata.pinnedIp}] (${json.result.metadata.headers.Host})`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: json.result?.reason || json.error || 'Ingress validation rejected connection.',
        });
      }
      await fetchLogsAndStatus();
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Connection error: ${err.message}` });
    } finally {
      setIsValidating(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPayload.trim()) return;

    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/safd/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: testPayload }),
      });

      if (res.ok) {
        setTestPayload('');
        await fetchLogsAndStatus();
      }
    } catch (err) {
      console.error('Broadcast failed', err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/safd/disconnect', { method: 'POST' });
      setPinnedMetadata(null);
      setFeedback({ type: 'success', message: 'Stream disconnected and worker queues purged.' });
      await fetchLogsAndStatus();
    } catch (err) {
      console.error('Disconnect failed', err);
    }
  };

  return (
    <div id="streamlit-broadcast-engine" className="space-y-6">
      {/* Top Banner Header */}
      <div className="rounded-xl border border-indigo-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Radio className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  RFC 0102 / SAFD-FRAMEWORK-SPEC-01 Broadcast Engine
                </h2>
                <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                  FRAMEWORK SPEC 0100
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Zero-Trust Ingress IP Pinning • Subterranean IPv6 Transition Unwrapping • Bounded Queue OS Worker Decoupling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleValidateAndConnect()}
              disabled={isValidating}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 text-xs font-semibold font-mono transition shadow-lg shadow-indigo-900/40 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isValidating ? 'animate-spin' : ''}`} />
              Connect Stream
            </button>

            <button
              onClick={handleDisconnect}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 text-xs font-semibold font-mono border border-slate-700 transition"
            >
              Disconnect
            </button>
          </div>
        </div>

        {feedback && (
          <div
            className={`mt-4 rounded-lg p-3 border text-xs font-mono flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Target URI Input & Preset Attack/Test Vectors */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-cyan-400" />
            Target WebSocket URI (Pre-Resolution & Anti-SSRF Sentry)
          </span>
          <span className="text-[10px] text-slate-500">
            DNS Timeout: 3.0s • Join Timeout: 3.5s • Payload Cap: 2000B
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={targetUri}
            onChange={(e) => setTargetUri(e.target.value)}
            placeholder="wss://echo.websocket.org"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            onClick={() => handleValidateAndConnect()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold transition"
          >
            Evaluate & Pin
          </button>
        </div>

        {/* Quick Test Vectors */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] text-slate-400">SAFD-FRAMEWORK-SPEC-01 Test & Vulnerability Vector Presets:</div>
          <div className="flex flex-wrap gap-2">
            {testVectors.map((tv, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTargetUri(tv.uri);
                  handleValidateAndConnect(tv.uri);
                }}
                className="rounded bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 text-[11px] border border-slate-700 hover:border-indigo-500/50 transition flex items-center gap-1"
              >
                <span>{tv.label}</span>
                <ArrowRight className="h-3 w-3 text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Direct-IP Pinning & Concurrency Metrics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {/* Card 1: Pinned IP Literal */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Server className="h-4 w-4 text-cyan-400" />
              Direct-IP Literal
            </span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
              PINNED
            </span>
          </div>
          <div className="text-sm font-bold text-cyan-300 truncate">
            {pinnedMetadata?.pinnedIp || 'Awaiting Pinning'}
          </div>
          <div className="text-[10px] text-slate-500">
            SNI Host: {pinnedMetadata?.originalHost || 'N/A'} (Port {pinnedMetadata?.port || 443})
          </div>
        </div>

        {/* Card 2: Subterranean IPv6 Unwrapping */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Subterranean IPv6
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              7 PROTOCOLS
            </span>
          </div>
          <div className="text-[11px] text-slate-300 truncate">
            {pinnedMetadata?.transitionType || 'Native IP Literal (No Tunneling)'}
          </div>
          <div className="text-[10px] text-slate-500">
            Unwrapped IPv4: {pinnedMetadata?.unwrappedIpv4 || 'N/A'}
          </div>
        </div>

        {/* Card 3: Bounded Queue Operational Controls */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-amber-400" />
              Bounded Concurrency
            </span>
            <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
              NON-BLOCKING
            </span>
          </div>
          <div className="text-[11px] text-slate-300">
            Queue Limit: <span className="text-amber-400 font-bold">100 items</span> (Drop on Full)
          </div>
          <div className="text-[10px] text-slate-500">
            Ring-Buffer Logs: Max 15 items (@st.fragment)
          </div>
        </div>

        {/* Card 4: RFC 0103 Provenance Auth */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-purple-400" />
              RFC 0103 Auth
            </span>
            <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
              0x3F8F9A1B2C3D
            </span>
          </div>
          <div className="text-[11px] text-purple-300 font-bold truncate">
            {pinnedMetadata?.rfc0103HandshakeDigest.substring(0, 18) || '0x3F8F9A1B2C3D'}...
          </div>
          <div className="text-[10px] text-slate-500">
            SEC #{LANE_CONSTANTS.SEC_FILING_NO}
          </div>
        </div>
      </div>

      {/* Broadcast Message Form & Live Stream Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Broadcast Payload Composer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Send className="h-4 w-4 text-indigo-400" />
                Broadcast Egress Controller
              </span>
              <span className="text-[10px] text-slate-500">Cap: 2000 chars</span>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  Outbound Frame Payload
                </label>
                <textarea
                  rows={4}
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  placeholder="Enter message to broadcast over direct-IP pinned WebSocket stream..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Length: {testPayload.length} / 2000</span>
                <span>Backpressure: Non-blocking put_nowait()</span>
              </div>

              <button
                type="submit"
                disabled={isBroadcasting || !testPayload.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg font-bold transition shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Broadcast Payload</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Real-Time Full-Duplex Log (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Real-Time Full-Duplex Stream Log (Ring Buffer: 15 items)
                </h3>
              </div>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50">
                @st.fragment (1s poll)
              </span>
            </div>

            <div className="mt-3 space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-1">
                  <div>No stream frames logged in current ring buffer.</div>
                  <div className="text-[10px] text-slate-600">
                    Connect an endpoint or broadcast a payload to initiate full-duplex transmission.
                  </div>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                      log.direction === 'INBOUND'
                        ? 'bg-slate-950 border-cyan-900/50 text-cyan-200'
                        : log.direction === 'OUTBOUND_BROADCAST'
                        ? 'bg-slate-950 border-indigo-900/50 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded ${
                            log.direction === 'INBOUND'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-indigo-500/20 text-indigo-300'
                          }`}
                        >
                          {log.direction}
                        </span>
                        <span className="text-slate-500">[{log.timestamp}]</span>
                      </div>
                      <span className="text-slate-500">CRC32: {log.crc32}</span>
                    </div>

                    <div className="text-[11px] font-mono break-all pl-1">{log.payload}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
