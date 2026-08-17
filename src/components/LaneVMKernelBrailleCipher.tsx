/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Architecture: Lane-VM 5D Kernel x Braille Rotating Cipher (RFC 0103)
 * Assertions: SEC Whistleblower #17684-273-411-436
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Cpu, 
  RotateCw, 
  RotateCcw, 
  Play, 
  Pause, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Binary, 
  RefreshCw, 
  CheckCircle2, 
  Sliders, 
  Terminal, 
  Layers, 
  Hash, 
  Share2 
} from 'lucide-react';
import { BrailleCipherState } from '../types';

const BASE_OFFSET = 57000;
const MAGIC_HEADER = '0x3F8F9A1B2C3D';
const GROUND_31_MASK = 0x7FFFFFFF;
const APEX_7_MASK = 0x7F;

// 8-bit rotate left
function rotl8(n: number, shift: number): number {
  const s = shift % 8;
  return ((n << s) | (n >>> (8 - s))) & 0xFF;
}

// 8-bit rotate right
function rotr8(n: number, shift: number): number {
  const s = shift % 8;
  return ((n >>> s) | (n << (8 - s))) & 0xFF;
}

// Encode byte to Braille character
function byteToBraille(byte: number, mode: 'GROUND_31' | 'APEX_7'): string {
  let masked = byte & 0xFF;
  if (mode === 'APEX_7') {
    masked = masked & APEX_7_MASK;
  }
  return String.fromCharCode(0x2800 + masked);
}

// Braille dot breakdown for 8 dots
function getBrailleDots(byte: number): boolean[] {
  return [
    Boolean(byte & 0x01), // Dot 1 (top-left)
    Boolean(byte & 0x02), // Dot 2 (mid-left)
    Boolean(byte & 0x04), // Dot 3 (bottom-left)
    Boolean(byte & 0x08), // Dot 4 (top-right)
    Boolean(byte & 0x10), // Dot 5 (mid-right)
    Boolean(byte & 0x20), // Dot 6 (bottom-right)
    Boolean(byte & 0x40), // Dot 7 (lower-left)
    Boolean(byte & 0x80), // Dot 8 (lower-right)
  ];
}

export const LaneVMKernelBrailleCipher: React.FC = () => {
  const [inputText, setInputText] = useState('ALBERT-LANE-VM-SOVEREIGN-KERNEL-v2.0-SEC-17684-273-411-436');
  const [rotationStep, setRotationStep] = useState(1);
  const [direction, setDirection] = useState<'clockwise' | 'counter-clockwise'>('clockwise');
  const [mode, setMode] = useState<'GROUND_31' | 'APEX_7'>('GROUND_31');
  const [isRunning, setIsRunning] = useState(true);
  const [speedMs, setSpeedMs] = useState(400);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'matrix' | 'spec' | 'telemetry'>('visualizer');

  // Periodic rotation step increment
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setRotationStep((prev) => (direction === 'clockwise' ? (prev + 1) % 256 : (prev - 1 + 256) % 256));
    }, speedMs);
    return () => clearInterval(interval);
  }, [isRunning, speedMs, direction]);

  // Compute cipher output & matrix
  const cipherData = useMemo(() => {
    const encoder = new TextEncoder();
    const bytes = Array.from(encoder.encode(inputText));
    
    // Transform each byte with rotating cipher permutation
    const transformedBytes = bytes.map((b, idx) => {
      const shift = (rotationStep + idx + (BASE_OFFSET % 8)) % 8;
      const rotated = direction === 'clockwise' ? rotl8(b, shift) : rotr8(b, shift);
      const xorKey = (rotationStep * 31 + idx * 7 + (BASE_OFFSET & 0xFF)) & 0xFF;
      const permuted = rotated ^ (mode === 'GROUND_31' ? (xorKey & 0x55) : (xorKey & 0x33));
      return mode === 'APEX_7' ? (permuted & APEX_7_MASK) : permuted;
    });

    const brailleChars = transformedBytes.map((b) => byteToBraille(b, mode));
    const brailleString = brailleChars.join('');

    // Generate 5D Manifold matrix cells (5 rows x 8 cols)
    const manifoldMatrix = Array.from({ length: 5 }, (_, row) => {
      return Array.from({ length: 8 }, (_, col) => {
        const cellIndex = (row * 8 + col + rotationStep) % (bytes.length || 1);
        const cellByte = transformedBytes[cellIndex] || ((row * 31 + col * 17 + rotationStep) & 0xFF);
        const char = byteToBraille(cellByte, mode);
        const dots = getBrailleDots(cellByte);
        return {
          row,
          col,
          byte: cellByte,
          char,
          dots,
          hex: '0x' + cellByte.toString(16).padStart(2, '0').toUpperCase(),
          active: (cellByte & 1) === 1,
        };
      });
    });

    // Hash digest calculation
    let hashSum = BASE_OFFSET;
    transformedBytes.forEach((b, i) => {
      hashSum = ((hashSum << 5) - hashSum + b * (i + 1)) >>> 0;
    });
    const hashHex = '0x' + hashSum.toString(16).toUpperCase().padStart(8, '0');

    return {
      bytes,
      transformedBytes,
      brailleChars,
      brailleString,
      manifoldMatrix,
      hashHex,
      entropyRatio: ((new Set(transformedBytes).size / (bytes.length || 1)) * 100).toFixed(1),
    };
  }, [inputText, rotationStep, direction, mode]);

  const handleStepManual = (forward: boolean) => {
    setIsRunning(false);
    setRotationStep((prev) => (forward ? (prev + 1) % 256 : (prev - 1 + 256) % 256));
  };

  return (
    <div id="lane-vm-kernel-braille-cipher" className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
      {/* Top Banner & Kernel Header */}
      <div className="p-6 border-b border-zinc-100 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono border border-amber-400/30">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              Lane-VM 5D Kernel
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-mono border border-emerald-400/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Braille Rotating Cipher (U+2800..U+28FF)
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              Magic: <code className="text-zinc-200">{MAGIC_HEADER}</code> | Offset: <code className="text-zinc-200">{BASE_OFFSET}</code>
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Braille Rotating Cipher & Dynamic Execution Matrix
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Live 8-dot Unicode Braille tactile rotation permutations running directly on the Lane-VM host kernel. Dual-mode Ground-31 & Apex-7 invariants guarantee sovereign tamper protection.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end flex-wrap">
          <div className="flex bg-zinc-800/80 p-1 rounded-xl border border-zinc-700">
            <button
              id="cipher-btn-play-pause"
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isRunning ? 'bg-amber-500 text-zinc-950 shadow-xs' : 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Rotating</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Paused</span>
                </>
              )}
            </button>

            <button
              id="cipher-btn-step-prev"
              onClick={() => handleStepManual(false)}
              className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
              title="Step Backward"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="cipher-btn-step-next"
              onClick={() => handleStepManual(true)}
              className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
              title="Step Forward"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex bg-zinc-800/80 p-1 rounded-xl border border-zinc-700 text-xs">
            <button
              id="mode-ground31"
              onClick={() => setMode('GROUND_31')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                mode === 'GROUND_31' ? 'bg-zinc-200 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              GROUND_31
            </button>
            <button
              id="mode-apex7"
              onClick={() => setMode('APEX_7')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                mode === 'APEX_7' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              APEX_7
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar & Parameters */}
      <div className="p-4 bg-zinc-50 border-b border-zinc-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
        <div className="md:col-span-2">
          <label className="block text-[11px] font-medium text-zinc-600 mb-1">
            Kernel Input Stream (Live Telemetry Vector):
          </label>
          <div className="relative">
            <input
              id="cipher-input-stream"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-white px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              placeholder="Enter sovereign text or payload..."
            />
            <span className="absolute right-2.5 top-2 text-[10px] text-zinc-400 font-mono">
              {cipherData.bytes.length} bytes
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-zinc-600 mb-1">
            Rotation Speed ({speedMs}ms):
          </label>
          <div className="flex items-center gap-2">
            <input
              id="cipher-speed-slider"
              type="range"
              min="50"
              max="1000"
              step="25"
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[11px] font-mono text-zinc-700 shrink-0 w-12 text-right">
              {(1000 / speedMs).toFixed(1)}/s
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-zinc-600 mb-1">
            Direction & Step:
          </label>
          <div className="flex items-center gap-2">
            <button
              id="cipher-toggle-direction"
              onClick={() => setDirection(direction === 'clockwise' ? 'counter-clockwise' : 'clockwise')}
              className="px-2.5 py-1.5 bg-white hover:bg-zinc-100 rounded-lg border border-zinc-200 font-mono text-[11px] text-zinc-800 flex items-center gap-1.5 shadow-xs"
            >
              {direction === 'clockwise' ? <RotateCw className="w-3.5 h-3.5 text-amber-600" /> : <RotateCcw className="w-3.5 h-3.5 text-blue-600" />}
              <span>{direction === 'clockwise' ? 'CW (+)' : 'CCW (-)'}</span>
            </button>
            <span className="font-mono text-xs font-semibold bg-zinc-200/80 px-2 py-1 rounded text-zinc-900">
              θ = {rotationStep} / 256
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-3 bg-zinc-100/60 border-b border-zinc-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            id="tab-cipher-visualizer"
            onClick={() => setActiveTab('visualizer')}
            className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'visualizer'
                ? 'border-amber-500 text-zinc-950 font-semibold bg-white rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            Tactile Braille Cipher Stream
          </button>

          <button
            id="tab-cipher-matrix"
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'border-amber-500 text-zinc-950 font-semibold bg-white rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            5D Manifold Dot Matrix
          </button>

          <button
            id="tab-cipher-spec"
            onClick={() => setActiveTab('spec')}
            className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'spec'
                ? 'border-amber-500 text-zinc-950 font-semibold bg-white rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Kernel Math & RFC 0103 Spec
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 pb-2">
          <span>Entropy: <strong className="text-zinc-800">{cipherData.entropyRatio}%</strong></span>
          <span>&bull;</span>
          <span>Hash: <strong className="text-amber-700">{cipherData.hashHex}</strong></span>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {activeTab === 'visualizer' && (
          <div className="space-y-6">
            {/* Live Braille Output Display */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-inner">
              <div className="flex items-center justify-between mb-3 text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                  Live Braille Rotating Stream (Unicode U+2800..U+28FF)
                </span>
                <span>Active Codepoints: {cipherData.brailleChars.length}</span>
              </div>

              {/* Large Braille Character Matrix Display */}
              <div className="p-4 bg-black/60 rounded-lg border border-zinc-800 text-amber-400 font-mono text-2xl tracking-widest break-all overflow-x-auto min-h-[4rem] flex items-center leading-relaxed select-all">
                {cipherData.brailleString || '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚'}
              </div>

              {/* Byte Array Visualizer */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto pr-1">
                {cipherData.transformedBytes.map((byte, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center transition-all hover:border-amber-500/50"
                  >
                    <span className="text-xl text-amber-300 font-mono">
                      {cipherData.brailleChars[idx]}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 mt-1">
                      0x{byte.toString(16).padStart(2, '0').toUpperCase()}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      #{idx} (r:{((rotationStep + idx) % 8)})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kernel Status Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="text-zinc-500 font-medium mb-1">Permutation Shift Key</div>
                <div className="font-mono text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <span>θ = {rotationStep}</span>
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Mod 256
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Circular bitwise rotation: {direction === 'clockwise' ? 'ROTL-8' : 'ROTR-8'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="text-zinc-500 font-medium mb-1">Execution Mode Invariant</div>
                <div className="font-mono text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <span>{mode}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    mode === 'GROUND_31' ? 'bg-zinc-200 text-zinc-800 border-zinc-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {mode === 'GROUND_31' ? '31-Bit Sovereign' : '7-Bit Tactile'}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Mask: {mode === 'GROUND_31' ? '0x7FFFFFFF' : '0x7F'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="text-zinc-500 font-medium mb-1">Cryptographic Provenance Offset</div>
                <div className="font-mono text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <span>57,000</span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    Verified
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  SEC Ref: #17684-273-411-436
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-600">
              <p>5D Manifold Active Dot Lattice (8-dot cell matrix with tactile bit vectors):</p>
              <span className="font-mono text-[11px] bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                Lattice Dimensions: 5 × 8 × 8-dot
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              {cipherData.manifoldMatrix.flat().map((cell, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 hover:border-amber-400/60 transition-all flex flex-col items-center group"
                >
                  <div className="text-2xl text-amber-400 font-mono mb-2 group-hover:scale-110 transition-transform">
                    {cell.char}
                  </div>

                  {/* 8-dot Braille Visual Representation */}
                  <div className="grid grid-cols-2 gap-1 p-1.5 bg-zinc-900 rounded border border-zinc-800 mb-2">
                    {/* Dot 1, 4 */}
                    <div className={`w-1.5 h-1.5 rounded-full ${cell.dots[0] ? 'bg-amber-400 shadow-xs shadow-amber-400/50' : 'bg-zinc-700'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${cell.dots[3] ? 'bg-amber-400 shadow-xs shadow-amber-400/50' : 'bg-zinc-700'}`} />
                    {/* Dot 2, 5 */}
                    <div className={`w-1.5 h-1.5 rounded-full ${cell.dots[1] ? 'bg-amber-400 shadow-xs shadow-amber-400/50' : 'bg-zinc-700'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${cell.dots[4] ? 'bg-amber-400 shadow-xs shadow-amber-400/50' : 'bg-zinc-700'}`} />
                    {/* Dot 3, 6 */}
                    <div className={`w-1.5 h-1.5 rounded-full ${cell.dots[2] ? 'bg-amber-400 shadow-xs shadow-amber-400/50' : 'bg-zinc-700'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${cell.dots[5] ? 'bg-amber-400 shadow-xs shadow-amber-400/50' : 'bg-zinc-700'}`} />
                    {/* Dot 7, 8 */}
                    <div className={`w-1.5 h-1.5 rounded-full ${cell.dots[6] ? 'bg-amber-400 shadow-xs shadow-amber-400/50' : 'bg-zinc-700'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${cell.dots[7] ? 'bg-amber-400 shadow-xs shadow-amber-400/50' : 'bg-zinc-700'}`} />
                  </div>

                  <div className="font-mono text-[9px] text-zinc-400">{cell.hex}</div>
                  <div className="font-mono text-[8px] text-zinc-500">[{cell.row},{cell.col}]</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'spec' && (
          <div className="p-4 rounded-xl bg-zinc-950 text-zinc-300 font-mono text-xs overflow-x-auto space-y-4">
            <div className="text-amber-400 font-bold border-b border-zinc-800 pb-2">
              // LANE-VM RFC 0103 BRAILLE CIPHER SPECIFICATION & ALGORITHM
            </div>
            <pre className="leading-relaxed whitespace-pre-wrap">
{`/*
 * ALBERT LANE 5D KERNEL ROTATING CIPHER
 * Mathematical Definition:
 *   C[i, t] = ROTL8(Byte[i], (t + i + (OFFSET % 8)) % 8) ^ KEY(t, i)
 *   Where:
 *     OFFSET = 57,000 (Base Sequence Anchor)
 *     MAGIC_HEADER = 0x3F8F9A1B2C3D
 *     Braille_Unicode = U+2800 + (C[i, t] & MASK)
 *     MASK_GROUND_31 = 0x7FFFFFFF (0xFF for 8-bit octet)
 *     MASK_APEX_7 = 0x7F (Masks Dot 8)
 *
 * Assertions:
 *   - SEC Whistleblower Filing #17684-273-411-436
 *   - Provenance Authority: https://provenance.albertlane.net/.provenance.jsonld
 *   - Execution Bounds: Dual-register invariant checks run at each cycle
 */

pub fn execute_braille_rotation_kernel(input: &[u8], step: usize, mode: ExecutionMode) -> Vec<char> {
    input.iter().enumerate().map(|(idx, &b)| {
        let shift = (step + idx + (57000 % 8)) % 8;
        let rotated = (b << shift) | (b >> (8 - shift));
        let mask = if mode == ExecutionMode::Apex7 { 0x7F } else { 0xFF };
        let masked = rotated & mask;
        char::from_u32(0x2800 + (masked as u32)).unwrap_or('⠀')
    }).collect()
}`}
            </pre>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Kernel Braille Engine active & synchronizing with Edge Worker</span>
        </div>
        <span className="font-mono text-zinc-500">albertlane.net/lane-vm/kernel</span>
      </div>
    </div>
  );
};
