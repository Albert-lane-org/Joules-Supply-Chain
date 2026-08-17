/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, Cpu, ShieldCheck, Play, CornerDownLeft, Sparkles } from 'lucide-react';
import { LANE_CONSTANTS } from '../types/lane.js';

interface CliHistoryItem {
  command: string;
  output: string;
  timestamp: string;
  isError?: boolean;
}

export const Bit31CliConsole: React.FC = () => {
  const [inputCommand, setInputCommand] = useState<string>('');
  const [history, setHistory] = useState<CliHistoryItem[]>([
    {
      command: 'status',
      output: `[LANE-VM SENTRY KERNEL INITIALIZED]
Magic Header: 0x3F8F9A1B2C3D | Sequence Offset: P_0 >= 57000
Physical Stride: 17,684 Bytes | Execution Bit-Widths: 31-bit (GROUND_31) & 7-bit (APEX_7)
Repository: Albert-lane-org/Joules-Supply-Chain (100% Redundancy Pinned)
Type 'help' to inspect available automated reporting and 5D bifurcation commands.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = async (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      setInputCommand('');
      return;
    }

    setIsExecuting(true);
    setInputCommand('');

    try {
      const res = await fetch('/api/cli/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed }),
      });

      if (res.ok) {
        const json = await res.json();
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: json.output || 'Command executed.',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: `Error HTTP ${res.status}: ${res.statusText}`,
            timestamp: new Date().toLocaleTimeString(),
            isError: true,
          },
        ]);
      }
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: `Execution failure: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
          isError: true,
        },
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputCommand);
  };

  const runQuickCommand = (cmd: string) => {
    executeCommand(cmd);
  };

  return (
    <div id="bit31-cli-console" className="space-y-4 font-mono text-xs">
      {/* Quick Launch Buttons */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
          <Terminal className="h-3.5 w-3.5 text-cyan-400" />
          Quick 31/7-Bit Actions:
        </span>

        <button
          onClick={() => runQuickCommand('safd')}
          className="rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1 text-[11px] border border-slate-700 transition"
        >
          safd status
        </button>

        <button
          onClick={() => runQuickCommand('firewall audit')}
          className="rounded bg-slate-800 hover:bg-slate-700 text-rose-300 px-2.5 py-1 text-[11px] border border-slate-700 transition"
        >
          firewall audit
        </button>

        <button
          onClick={() => runQuickCommand('repo sync')}
          className="rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 text-[11px] border border-slate-700 transition"
        >
          repo sync
        </button>

        <button
          onClick={() => runQuickCommand('bifurcate --mode GROUND_31 --stride 17684')}
          className="rounded bg-slate-800 hover:bg-slate-700 text-purple-300 px-2.5 py-1 text-[11px] border border-slate-700 transition"
        >
          bifurcate e=AA
        </button>

        <button
          onClick={() => runQuickCommand('intake --cat AI_WASHING --regulator sec')}
          className="rounded bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 text-[11px] border border-slate-700 transition"
        >
          intake pipeline
        </button>

        <button
          onClick={() => runQuickCommand('provenance mine')}
          className="rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 px-2.5 py-1 text-[11px] border border-slate-700 transition"
        >
          provenance mine
        </button>

        <button
          onClick={() => runQuickCommand('switch --mode 7')}
          className="rounded bg-slate-800 hover:bg-slate-700 text-blue-300 px-2.5 py-1 text-[11px] border border-slate-700 transition"
        >
          switch 7-bit
        </button>

        <button
          onClick={() => runQuickCommand('status')}
          className="rounded bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 text-[11px] border border-slate-700 transition"
        >
          status
        </button>
      </div>

      {/* Terminal Screen */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
            </div>
            <span className="text-slate-300 font-bold ml-2">LANE-VM SENTRY TERMINAL • 31/7-BIT CLI</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-cyan-400">0x3F8F9A1B2C3D</span>
            <button
              onClick={() => setHistory([])}
              className="text-slate-500 hover:text-slate-300 transition"
              title="Clear terminal"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Output */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 select-text">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="text-slate-600">[{item.timestamp}]</span>
                <span className="text-emerald-400 font-bold">lane@kernel:~$</span>
                <span className="text-slate-100 font-semibold">{item.command}</span>
              </div>
              <pre
                className={`p-2.5 rounded bg-slate-900/70 border border-slate-800/80 whitespace-pre-wrap leading-relaxed ${
                  item.isError ? 'text-rose-300 border-rose-900/50' : 'text-slate-300'
                }`}
              >
                {item.output}
              </pre>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold shrink-0">lane@kernel:~$</span>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            disabled={isExecuting}
            placeholder="Type 'help', 'intake', 'bifurcate', 'repo sync', 'provenance mine'..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
            autoFocus
          />
          <button
            type="submit"
            disabled={isExecuting}
            className="rounded bg-cyan-600 hover:bg-cyan-500 text-white p-1.5 transition disabled:opacity-50"
          >
            <CornerDownLeft className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
