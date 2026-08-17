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

import React, { useEffect, useState } from 'react';
import { SecurityIngressRecord } from '../types/lane.js';
import { ShieldCheck, ShieldAlert, Network, Lock, CheckCircle2, AlertOctagon } from 'lucide-react';

export const SecuritySentryPanel: React.FC = () => {
  const [logs, setLogs] = useState<SecurityIngressRecord[]>([]);
  const [testIp, setTestIp] = useState('2002:c000:0201::'); // 6to4 test IP
  const [testResult, setTestResult] = useState<any>(null);

  const fetchSecurityAudit = async () => {
    try {
      const res = await fetch('/api/rfc0103/security');
      if (res.ok) {
        const json = await res.json();
        if (json.auditLogs) {
          setLogs(json.auditLogs);
        }
      }
    } catch (e) {
      console.warn('Security audit fetch failed', e);
    }
  };

  useEffect(() => {
    fetchSecurityAudit();
    const interval = setInterval(fetchSecurityAudit, 4000);
    return () => clearInterval(interval);
  }, []);

  const runTestIpUnwrap = () => {
    // Client-side simulation of unwrapping and SSRF check
    let unwrapped = testIp.trim();
    let isBlocked = false;
    let reason = 'ALLOWED: Public or Pinned Address';

    if (unwrapped.startsWith('2002:')) {
      const segments = unwrapped.split(':');
      if (segments.length >= 3 && segments[1].length === 4 && segments[2].length === 4) {
        const b1 = parseInt(segments[1].slice(0, 2), 16);
        const b2 = parseInt(segments[1].slice(2, 4), 16);
        const b3 = parseInt(segments[2].slice(0, 2), 16);
        const b4 = parseInt(segments[2].slice(2, 4), 16);
        unwrapped = `${b1}.${b2}.${b3}.${b4}`;
      }
    } else if (unwrapped.startsWith('::ffff:')) {
      unwrapped = unwrapped.replace('::ffff:', '');
    } else if (unwrapped.startsWith('64:ff9b::')) {
      unwrapped = unwrapped.replace('64:ff9b::', '');
    }

    if (unwrapped.startsWith('100.64.') || unwrapped.startsWith('100.127.')) {
      isBlocked = true;
      reason = 'SSRF_BLOCKED: Carrier-Grade NAT (CGNAT 100.64.0.0/10)';
    } else if (unwrapped.startsWith('169.254.')) {
      isBlocked = true;
      reason = 'SSRF_BLOCKED: Cloud Metadata / Link-Local (169.254.0.0/16)';
    } else if (unwrapped.startsWith('fc00:') || unwrapped.startsWith('fd')) {
      isBlocked = true;
      reason = 'SSRF_BLOCKED: IPv6 Unique Local Address (ULA fc00::/7)';
    } else if (unwrapped.startsWith('10.') || unwrapped.startsWith('192.168.')) {
      isBlocked = true;
      reason = 'SSRF_BLOCKED: RFC 1918 Private CIDR';
    }

    setTestResult({
      raw: testIp,
      unwrapped,
      isBlocked,
      reason,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-900/60 rounded-xl p-4 shadow-xl text-slate-200 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="font-bold text-slate-100 uppercase tracking-wider">
            Host Sentry Ingress: Direct-IP Pinning & SSRF Filter
          </h2>
        </div>
        <span className="text-[11px] text-slate-400">
          Enforcing Recursive Subterranean IPv4 Unwrapping
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: SSRF Blocklist Matrix */}
        <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sentry Ingress Filter Constraints</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li className="flex items-center justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">CGNAT Blocklist:</span>
              <strong className="text-rose-400">100.64.0.0/10</strong>
            </li>
            <li className="flex items-center justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">Link-Local Metadata:</span>
              <strong className="text-rose-400">169.254.0.0/16</strong>
            </li>
            <li className="flex items-center justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">IPv6 Unique Local:</span>
              <strong className="text-rose-400">fc00::/7</strong>
            </li>
            <li className="flex items-center justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">Subterranean Formats:</span>
              <span className="text-amber-300">6to4, NAT64, Teredo</span>
            </li>
            <li className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Wire Magic Guard:</span>
              <span className="text-emerald-400">0x3F8F9A1B2C3D</span>
            </li>
          </ul>
        </div>

        {/* Center: Interactive Subterranean IPv4 Unwrapper Tool */}
        <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Subterranean Address Tester</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={testIp}
              onChange={(e) => setTestIp(e.target.value)}
              placeholder="e.g. 2002:a9fe:0101:: or ::ffff:100.64.1.1"
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={runTestIpUnwrap}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold text-xs"
            >
              Analyze
            </button>
          </div>

          {testResult && (
            <div
              className={`p-2 rounded border text-[11px] space-y-1 ${
                testResult.isBlocked
                  ? 'bg-red-950/40 border-red-800 text-red-300'
                  : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {testResult.isBlocked ? (
                  <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{testResult.isBlocked ? 'REJECTED' : 'PERMITTED'}</span>
              </div>
              <div>Unwrapped IPv4: <strong className="text-white">{testResult.unwrapped}</strong></div>
              <div>Verdict: {testResult.reason}</div>
            </div>
          )}
        </div>

        {/* Right: Live Sentry Ingress Audit Log */}
        <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
          <div className="font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Real-Time Ingress Audit</span>
            </span>
            <span className="text-[10px] text-slate-500">Last 10 Events</span>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {logs.length === 0 ? (
              <div className="text-slate-500 text-center py-4">No recent violations recorded.</div>
            ) : (
              logs.slice(0, 8).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800/80 text-[10px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        log.status === 'ACCEPTED' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span className="text-slate-200 font-semibold">{log.unwrappedIpv4}</span>
                    <span className="text-slate-500">({log.transport})</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.2 rounded font-bold ${
                      log.status === 'ACCEPTED'
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-rose-950 text-rose-300'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
