/**
 * @file MathematicalDerivationModelPanel.tsx
 * @brief Quad Mathematical Derivation & Code Similarity Engine
 * @provenance Albert Dale Lane (albertlane.net)
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @magic_header 0x3F8F9A1B2C3D
 * Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
 */

import React, { useState, useEffect, useId } from 'react';
import {
  evaluateQuadDerivationModels,
  QuadModelEvaluationResult,
} from '../utils/mathematicalDerivationModels';
import {
  Calculator,
  Binary,
  GitCommit,
  Layers,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Code2,
  FileCode2,
  Server,
  Zap,
  Activity,
  ArrowRight,
} from 'lucide-react';

const PRESET_SNIPPETS = [
  {
    name: 'RFC 0103 Sovereign Kernel (Baseline)',
    lang: 'Rust',
    code: `// RFC 0103 Substrate Virtual Machine
// Magic: 0x3F8F9A1B2C3D | Author: Albert Dale Lane
pub fn execute_lane_vm_kernel() -> Result<(), &'static str> {
    let base_offset: usize = 57000;
    let magic_header: u64 = 0x3F8F9A1B2C3D;
    println!("Kernel active on manifold 57000x31x5x4x8");
    Ok(())
}`,
  },
  {
    name: 'Derivative Target (Obfuscated / Stripped)',
    lang: 'Rust',
    code: `// Derivative Substrate Execution
pub fn execute_substrate_virtual_machine() -> Result<(), &'static str> {
    let offset_idx: usize = 57000;
    let magic_num: u64 = 0x3F8F9A1B2C3D;
    println!("Virtual machine running 57000x31x5x4x8");
    Ok(())
}`,
  },
  {
    name: 'C++20 AVX-512 SIMD Vector Pipeline',
    lang: 'C++',
    code: `// Albert Lane C++20 Zero-Register-Spill Core
#include <immintrin.h>
#define MAGIC_HEADER 0x3F8F9A1B2C3D
extern "C" void lane_vm_cpp_julia_push(const float* input, float* output, size_t count) {
    for (size_t i = 0; i < count; i += 16) {
        __m512 v = _mm512_loadu_ps(input + i);
        _mm512_storeu_ps(output + i, v);
    }
}`,
  },
  {
    name: 'Unrelated Standard Algorithm (Control Sample)',
    lang: 'TypeScript',
    code: `// Generic QuickSort Helper
function quickSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = arr.filter((x, i) => x <= pivot && i < arr.length - 1);
    const right = arr.filter(x => x > pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
}`,
  },
];

export const MathematicalDerivationModelPanel: React.FC = () => {
  const panelId = useId();
  const [sourceA, setSourceA] = useState<string>(PRESET_SNIPPETS[0].code);
  const [sourceB, setSourceB] = useState<string>(PRESET_SNIPPETS[1].code);
  const [activeTab, setActiveTab] = useState<'all' | 'cosine' | 'tensor' | 'tree' | 'ncd'>('all');
  const [evaluation, setEvaluation] = useState<QuadModelEvaluationResult | null>(null);
  const [isServerEvaluating, setIsServerEvaluating] = useState<boolean>(false);
  const [serverModeActive, setServerModeActive] = useState<boolean>(false);

  // Compute evaluation whenever source inputs change
  useEffect(() => {
    if (!serverModeActive) {
      const res = evaluateQuadDerivationModels(sourceA, sourceB, 'Baseline (RFC 0103)', 'Target Derivation');
      setEvaluation(res);
    }
  }, [sourceA, sourceB, serverModeActive]);

  const handleRunServerEvaluation = async () => {
    setIsServerEvaluating(true);
    try {
      const resp = await fetch('/api/mathematical-modeling/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceA,
          sourceB,
          nameA: 'Baseline (RFC 0103)',
          nameB: 'Target Derivation',
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setEvaluation(data);
        setServerModeActive(true);
      }
    } catch (e) {
      console.error('Server evaluation error:', e);
    } finally {
      setIsServerEvaluating(false);
    }
  };

  const currentEval = evaluation || evaluateQuadDerivationModels(sourceA, sourceB);

  return (
    <section id="mathematical-derivation-panel" className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white border-b border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono border border-amber-400/30">
                <Calculator className="w-3.5 h-3.5" />
                Formal 4-Model Suite
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-mono border border-emerald-400/30">
                <Binary className="w-3 h-3" />
                Magic 0x3F8F9A1B2C3D
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 text-xs font-mono border border-blue-400/30">
                <Layers className="w-3 h-3" />
                5D Tensor Manifold
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Mathematical Derivation & IP Similarity Modeling Engine
            </h3>
            <p className="text-xs text-zinc-300">
              Rigorous 4-tier computational geometry, tensor contraction, tree edit distance, and Kolmogorov compression distance metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="server-eval-btn"
              onClick={handleRunServerEvaluation}
              disabled={isServerEvaluating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-sm disabled:opacity-50"
            >
              {isServerEvaluating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Exact zlib/Zstd...</span>
                </>
              ) : (
                <>
                  <Server className="w-3.5 h-3.5" />
                  <span>Exact Server-Side Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Composite Score Banner */}
      <div className="p-5 bg-zinc-50 border-b border-zinc-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Composite Derivation Score</div>
            <div className="text-2xl font-black text-zinc-900 mt-1 font-mono flex items-baseline gap-2">
              <span>{(currentEval.compositeSimilarityScore * 100).toFixed(1)}%</span>
              <span className="text-xs font-normal text-zinc-500">similarity</span>
            </div>
            <div className="mt-2 text-xs font-medium">
              {currentEval.isStructuralDerivation ? (
                <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Derivation Alignment
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Low Structural Overlap
                </span>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              <span>1. Vector Cosine</span>
              <span className="font-mono text-zinc-400">30% Weight</span>
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-1 font-mono">
              {(currentEval.vectorCosine.similarity * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">
              Cosine dist: {currentEval.vectorCosine.cosineDistance.toFixed(4)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              <span>2. 5D Tensor Frobenius</span>
              <span className="font-mono text-zinc-400">25% Weight</span>
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-1 font-mono">
              {(currentEval.tensorContraction.tensorCorrelation * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">
              Relative &delta;: {currentEval.tensorContraction.relativeDeviation.toFixed(4)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              <span>3. AST Tree Edit / 4. NCD</span>
              <span className="font-mono text-zinc-400">25% / 20%</span>
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-1 font-mono flex items-baseline gap-2">
              <span>TED: {(currentEval.treeEditDistance.normalizedTreeSimilarity * 100).toFixed(0)}%</span>
              <span className="text-zinc-300">|</span>
              <span>NCD: {(currentEval.normalizedCompressionDistance.compressionSimilarity * 100).toFixed(0)}%</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">
              TED: {currentEval.treeEditDistance.treeEditDistance} ops &bull; NCD: {currentEval.normalizedCompressionDistance.ncd}
            </div>
          </div>
        </div>
      </div>

      {/* Code Input & Comparison Section */}
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-amber-500" />
            <span>Interactive Source Derivation Inputs</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-zinc-500 font-medium">Load Preset:</span>
            {PRESET_SNIPPETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (idx === 0) setSourceA(preset.code);
                  else setSourceB(preset.code);
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-mono text-[11px] border border-zinc-200 transition-colors"
              >
                {preset.name.slice(0, 24)}...
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Source A */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-amber-600" />
                Source A: Albert Lane Baseline (RFC 0103)
              </span>
              <span className="text-[11px] font-mono text-zinc-400">{sourceA.length} bytes</span>
            </div>
            <textarea
              id={`${panelId}-source-a`}
              value={sourceA}
              onChange={(e) => {
                setSourceA(e.target.value);
                setServerModeActive(false);
              }}
              rows={7}
              className="w-full font-mono text-xs p-3 rounded-xl bg-zinc-950 text-zinc-100 border border-zinc-800 focus:ring-2 focus:ring-amber-400 focus:outline-none leading-relaxed resize-y"
              placeholder="Paste sovereign reference code here..."
            />
          </div>

          {/* Source B */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                Source B: Candidate Target Source / Derivation
              </span>
              <span className="text-[11px] font-mono text-zinc-400">{sourceB.length} bytes</span>
            </div>
            <textarea
              id={`${panelId}-source-b`}
              value={sourceB}
              onChange={(e) => {
                setSourceB(e.target.value);
                setServerModeActive(false);
              }}
              rows={7}
              className="w-full font-mono text-xs p-3 rounded-xl bg-zinc-950 text-zinc-100 border border-zinc-800 focus:ring-2 focus:ring-blue-400 focus:outline-none leading-relaxed resize-y"
              placeholder="Paste candidate derivation code here..."
            />
          </div>
        </div>

        {/* Model Tabs Navigation */}
        <div className="border-b border-zinc-200 pt-2 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All 4 Models Overview', icon: Layers },
            { id: 'cosine', label: '1. Vector Cosine Model', icon: Activity },
            { id: 'tensor', label: '2. 5D Tensor Contraction', icon: Binary },
            { id: 'tree', label: '3. AST Tree Edit Distance', icon: GitCommit },
            { id: 'ncd', label: '4. Normalized Compression (NCD)', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                  isSelected
                    ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Model Results View */}
        <div className="space-y-6 pt-2">
          {/* Model 1: Cosine Similarity */}
          {(activeTab === 'all' || activeTab === 'cosine') && (
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-bold font-mono text-xs flex items-center justify-center">1</span>
                  <h4 className="font-bold text-sm text-zinc-900">Vector Space & Normalized Cosine Similarity Model</h4>
                </div>
                <div className="text-xs font-mono font-bold text-amber-700">
                  Similarity: {(currentEval.vectorCosine.similarity * 100).toFixed(2)}%
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-zinc-200 font-mono text-xs text-zinc-700 space-y-1">
                <div className="text-zinc-400 text-[11px]">// Mathematical Formulation:</div>
                <div className="text-zinc-900 font-bold">
                  Similarity(u, v) = (u &bull; v) / (||u||₂ &times; ||v||₂) = &Sigma;(uᵢ &times; vᵢ) / [&radic;(&Sigma;uᵢ²) &times; &radic;(&Sigma;vᵢ²)]
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                  <div>Dot Product (u&bull;v): <strong className="text-zinc-900">{currentEval.vectorCosine.dotProduct}</strong></div>
                  <div>||u||₂ Norm: <strong className="text-zinc-900">{currentEval.vectorCosine.normU}</strong></div>
                  <div>||v||₂ Norm: <strong className="text-zinc-900">{currentEval.vectorCosine.normV}</strong></div>
                  <div>Feature Dim (N): <strong className="text-zinc-900">{currentEval.vectorCosine.featureDimension} tokens</strong></div>
                </div>
              </div>

              {currentEval.vectorCosine.topSharedFeatures && currentEval.vectorCosine.topSharedFeatures.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase">Top Shared N-Gram / Token Projections:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentEval.vectorCosine.topSharedFeatures.map((feat, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100/80 text-amber-900 font-mono text-[11px] border border-amber-200">
                        <code>{feat.token}</code>
                        <span className="text-[10px] text-amber-700">({feat.countU} &times; {feat.countV})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Model 2: Tensor Contraction & Frobenius Norm */}
          {(activeTab === 'all' || activeTab === 'tensor') && (
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold font-mono text-xs flex items-center justify-center">2</span>
                  <h4 className="font-bold text-sm text-zinc-900">Multi-Dimensional Tensor Contraction & Frobenius Difference Norm</h4>
                </div>
                <div className="text-xs font-mono font-bold text-blue-700">
                  Correlation: {(currentEval.tensorContraction.tensorCorrelation * 100).toFixed(2)}%
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-zinc-200 font-mono text-xs text-zinc-700 space-y-1">
                <div className="text-zinc-400 text-[11px]">// 5D Tensor Manifold [57000 &times; 31 &times; 5 &times; 4 &times; 8] Contraction:</div>
                <div className="text-zinc-900 font-bold">
                  ||A - B||_F = &radic;(&Sigma; (A_ijkℓm - B_ijkℓm)²) &nbsp;|&nbsp; &delta;(A, B) = ||A - B||_F / ||A||_F
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                  <div>Frobenius Diff: <strong className="text-zinc-900">{currentEval.tensorContraction.frobeniusDifference}</strong></div>
                  <div>Relative &delta;: <strong className="text-zinc-900">{currentEval.tensorContraction.relativeDeviation}</strong></div>
                  <div>Manifold Norm ||A||: <strong className="text-zinc-900">{currentEval.tensorContraction.normA}</strong></div>
                  <div>Total Contraction Nodes: <strong className="text-zinc-900">70,680,000</strong></div>
                </div>
              </div>

              {currentEval.tensorContraction.sampleLatticePoints && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase">5D Sample Lattice Sample Vector States:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {currentEval.tensorContraction.sampleLatticePoints.slice(0, 4).map((pt, i) => (
                      <div key={i} className="p-2 rounded bg-white border border-zinc-200 font-mono text-[11px]">
                        <div className="text-zinc-400 text-[10px]">[{pt.coord.join(', ')}]</div>
                        <div className="flex justify-between text-zinc-700 mt-0.5">
                          <span>A: {pt.valA}</span>
                          <span>B: {pt.valB}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Model 3: Tree Edit Distance */}
          {(activeTab === 'all' || activeTab === 'tree') && (
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold font-mono text-xs flex items-center justify-center">3</span>
                  <h4 className="font-bold text-sm text-zinc-900">Tree Edit Distance (Zhang-Shasha AST Formulation)</h4>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-700">
                  AST Similarity: {(currentEval.treeEditDistance.normalizedTreeSimilarity * 100).toFixed(2)}%
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-zinc-200 font-mono text-xs text-zinc-700 space-y-1">
                <div className="text-zinc-400 text-[11px]">// AST Node Edit Recurrence:</div>
                <div className="text-zinc-900 font-bold">
                  TED(T₁[1..i], T₂[1..j]) = min(TED(i-1, j) + &gamma;(del), TED(i, j-1) + &gamma;(ins), TED(i-1, j-1) + &gamma;(match/rename))
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                  <div>Total Edit Ops: <strong className="text-zinc-900">{currentEval.treeEditDistance.treeEditDistance}</strong></div>
                  <div>Tree 1 Size: <strong className="text-zinc-900">{currentEval.treeEditDistance.sizeTree1} nodes</strong></div>
                  <div>Tree 2 Size: <strong className="text-zinc-900">{currentEval.treeEditDistance.sizeTree2} nodes</strong></div>
                  <div>Normalized Sim: <strong className="text-zinc-900">{(currentEval.treeEditDistance.normalizedTreeSimilarity * 100).toFixed(1)}%</strong></div>
                </div>
              </div>

              {currentEval.treeEditDistance.alignmentSteps && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase">AST Alignment Operation Sequence:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentEval.treeEditDistance.alignmentSteps.map((step, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
                          step.op === 'MATCH'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : step.op === 'RENAME'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        <strong>{step.op}</strong>: {step.node1 || step.node2}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Model 4: Normalized Compression Distance */}
          {(activeTab === 'all' || activeTab === 'ncd') && (
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-purple-600 text-white font-bold font-mono text-xs flex items-center justify-center">4</span>
                  <h4 className="font-bold text-sm text-zinc-900">Normalized Compression Distance (Kolmogorov Complexity Approximation)</h4>
                </div>
                <div className="text-xs font-mono font-bold text-purple-700">
                  NCD Score: {currentEval.normalizedCompressionDistance.ncd} (Sim: {(currentEval.normalizedCompressionDistance.compressionSimilarity * 100).toFixed(1)}%)
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-zinc-200 font-mono text-xs text-zinc-700 space-y-1">
                <div className="text-zinc-400 text-[11px]">// Algorithmic Mutual Information Distance:</div>
                <div className="text-zinc-900 font-bold">
                  NCD(x, y) = [C(xy) - min(C(x), C(y))] / max(C(x), C(y))
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                  <div>C(x) Compressed: <strong className="text-zinc-900">{currentEval.normalizedCompressionDistance.compressedSizeX} B</strong></div>
                  <div>C(y) Compressed: <strong className="text-zinc-900">{currentEval.normalizedCompressionDistance.compressedSizeY} B</strong></div>
                  <div>C(xy) Concatenated: <strong className="text-zinc-900">{currentEval.normalizedCompressionDistance.compressedSizeXY} B</strong></div>
                  <div>NCD Distance: <strong className="text-zinc-900">{currentEval.normalizedCompressionDistance.ncd}</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
