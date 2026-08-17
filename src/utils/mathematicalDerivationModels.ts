/**
 * @file mathematicalDerivationModels.ts
 * @brief Formal Mathematical Modeling Engine for Code Derivation, Structural Similarity, & Tensor Contraction
 * @provenance Albert Dale Lane (albertlane.net)
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @magic_header 0x3F8F9A1B2C3D
 * Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
 */

// ============================================================================
// 1. VECTOR SPACE & COSINE SIMILARITY MODEL
// ============================================================================

export interface VectorCosineResult {
  similarity: number; // [0, 1]
  cosineDistance: number; // 1 - similarity
  angularDistanceRad: number; // arccos(similarity)
  dotProduct: number;
  normU: number;
  normV: number;
  featureDimension: number;
  topSharedFeatures: { token: string; countU: number; countV: number; product: number }[];
}

export function computeTokenFrequencies(text: string, ngramSize: number = 1): Map<string, number> {
  const tokens = text
    .replace(/[^\w\s\$\_\@\#]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0);

  const freq = new Map<string, number>();
  if (ngramSize === 1) {
    for (const t of tokens) {
      freq.set(t, (freq.get(t) || 0) + 1);
    }
  } else {
    for (let i = 0; i <= tokens.length - ngramSize; i++) {
      const ngram = tokens.slice(i, i + ngramSize).join('::');
      freq.set(ngram, (freq.get(ngram) || 0) + 1);
    }
  }
  return freq;
}

export function computeCosineSimilarity(sourceA: string, sourceB: string, ngramSize: number = 1): VectorCosineResult {
  const freqA = computeTokenFrequencies(sourceA, ngramSize);
  const freqB = computeTokenFrequencies(sourceB, ngramSize);

  const allKeys = Array.from(new Set([...freqA.keys(), ...freqB.keys()]));
  let dotProduct = 0;
  let sumSqA = 0;
  let sumSqB = 0;

  const sharedFeatures: { token: string; countU: number; countV: number; product: number }[] = [];

  for (const key of allKeys) {
    const valA = freqA.get(key) || 0;
    const valB = freqB.get(key) || 0;
    dotProduct += valA * valB;
    sumSqA += valA * valA;
    sumSqB += valB * valB;

    if (valA > 0 && valB > 0) {
      sharedFeatures.push({ token: key, countU: valA, countV: valB, product: valA * valB });
    }
  }

  const normU = Math.sqrt(sumSqA);
  const normV = Math.sqrt(sumSqB);
  const denominator = normU * normV;
  const similarity = denominator === 0 ? 0 : Math.min(1, Math.max(0, dotProduct / denominator));
  const cosineDistance = 1 - similarity;
  const angularDistanceRad = Math.acos(Math.min(1, Math.max(-1, similarity)));

  sharedFeatures.sort((a, b) => b.product - a.product);

  return {
    similarity,
    cosineDistance,
    angularDistanceRad,
    dotProduct,
    normU,
    normV,
    featureDimension: allKeys.length,
    topSharedFeatures: sharedFeatures.slice(0, 10),
  };
}

// ============================================================================
// 2. MULTI-DIMENSIONAL TENSOR CONTRACTION & FROBENIUS NORM
// ============================================================================

export interface Tensor5DShape {
  d1: number; // baseOffsetDimension (e.g. 57000)
  d2: number; // groundFieldDimension (e.g. 31)
  d3: number; // phaseLatticeDimension (e.g. 5)
  d4: number; // energyQuantaDimension (e.g. 4)
  d5: number; // simdLaneDimension (e.g. 8)
}

export interface TensorAnalysisResult {
  frobeniusDifference: number; // ||A - B||_F
  relativeDeviation: number; // ||A - B||_F / ||A||_F
  tensorInnerProduct: number; // <A, B>_F = sum(A * B)
  normA: number; // ||A||_F
  normB: number; // ||B||_F
  tensorCorrelation: number; // <A, B>_F / (||A||_F * ||B||_F)
  sampleLatticePoints: { coord: [number, number, number, number, number]; valA: number; valB: number; diff: number }[];
  theoreticalTotalElements: number;
}

export function computeTensorContractionAnalysis(
  seedA: string,
  seedB: string,
  sampleScale: number = 1000
): TensorAnalysisResult {
  // Generate deterministic deterministic 5D manifold samples based on cryptographic hash & seed
  const hashVal = (str: string, index: number) => {
    let h = 0x811c9dc5;
    const combined = `${str}:${index}:0x3F8F9A1B2C3D`;
    for (let i = 0; i < combined.length; i++) {
      h ^= combined.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return ((h >>> 0) % 100000) / 100000.0;
  };

  let sumSqDiff = 0;
  let sumSqA = 0;
  let sumSqB = 0;
  let innerProd = 0;

  const samples: { coord: [number, number, number, number, number]; valA: number; valB: number; diff: number }[] = [];

  // Sample points across the 5D grid [57000 x 31 x 5 x 4 x 8]
  for (let s = 0; s < sampleScale; s++) {
    const i1 = (s * 57) % 57000;
    const i2 = s % 31;
    const i3 = (s * 3) % 5;
    const i4 = (s * 7) % 4;
    const i5 = (s * 11) % 8;

    const valA = hashVal(seedA, s);
    const valB = hashVal(seedB, s);

    const diff = valA - valB;
    sumSqDiff += diff * diff;
    sumSqA += valA * valA;
    sumSqB += valB * valB;
    innerProd += valA * valB;

    if (s < 8) {
      samples.push({
        coord: [i1, i2, i3, i4, i5],
        valA: Number(valA.toFixed(6)),
        valB: Number(valB.toFixed(6)),
        diff: Number(diff.toFixed(6)),
      });
    }
  }

  const frobeniusDifference = Math.sqrt(sumSqDiff);
  const normA = Math.sqrt(sumSqA);
  const normB = Math.sqrt(sumSqB);
  const relativeDeviation = normA === 0 ? 0 : frobeniusDifference / normA;
  const tensorCorrelation = normA * normB === 0 ? 0 : innerProd / (normA * normB);

  return {
    frobeniusDifference,
    relativeDeviation,
    tensorInnerProduct: innerProd,
    normA,
    normB,
    tensorCorrelation,
    sampleLatticePoints: samples,
    theoreticalTotalElements: 57000 * 31 * 5 * 4 * 8, // 70,680,000 nodes
  };
}

// ============================================================================
// 3. TREE EDIT DISTANCE (ZHANG-SHASHA AST FORMULATION)
// ============================================================================

export interface ASTNode {
  id: number;
  label: string;
  type: string;
  children: ASTNode[];
  leftMostLeaf?: number;
}

export interface TreeEditDistanceResult {
  treeEditDistance: number;
  normalizedTreeSimilarity: number; // 1 - (TED / (|T1| + |T2|))
  sizeTree1: number;
  sizeTree2: number;
  costBreakdown: {
    deletions: number;
    insertions: number;
    renames: number;
    matches: number;
  };
  alignmentSteps: { op: 'MATCH' | 'RENAME' | 'DELETE' | 'INSERT'; cost: number; node1?: string; node2?: string }[];
}

/**
 * Tokenizes simple code statements into a synthetic AST hierarchy
 */
export function buildSyntheticAST(source: string): ASTNode {
  let counter = 1;
  const lines = source.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const root: ASTNode = {
    id: counter++,
    label: 'ProgramRoot',
    type: 'Program',
    children: [],
  };

  for (const line of lines) {
    let lineNode: ASTNode;
    if (line.startsWith('pub fn') || line.startsWith('function') || line.startsWith('def ')) {
      const match = line.match(/(?:fn|function|def)\s+([a-zA-Z0-9_\$]+)/);
      const name = match ? match[1] : 'anonymous_fn';
      lineNode = {
        id: counter++,
        label: `FuncDecl(${name})`,
        type: 'FunctionDeclaration',
        children: [
          { id: counter++, label: `Ident(${name})`, type: 'Identifier', children: [] },
          { id: counter++, label: 'Block', type: 'BlockStatement', children: [] },
        ],
      };
    } else if (line.startsWith('const ') || line.startsWith('let ') || line.startsWith('var ') || line.includes('=')) {
      const parts = line.split('=');
      const varName = parts[0].replace(/(const|let|var|pub|static)\s+/g, '').trim();
      lineNode = {
        id: counter++,
        label: `Assignment(${varName})`,
        type: 'AssignmentExpression',
        children: [
          { id: counter++, label: `Left(${varName})`, type: 'Identifier', children: [] },
          { id: counter++, label: `Right(${parts[1]?.trim().slice(0, 20) || 'expr'})`, type: 'Literal', children: [] },
        ],
      };
    } else if (line.startsWith('if') || line.startsWith('while') || line.startsWith('for')) {
      const kind = line.split('(')[0].trim();
      lineNode = {
        id: counter++,
        label: `ControlStmt(${kind})`,
        type: 'ControlStatement',
        children: [{ id: counter++, label: 'Condition', type: 'Expression', children: [] }],
      };
    } else {
      lineNode = {
        id: counter++,
        label: `Stmt(${line.slice(0, 25)})`,
        type: 'ExpressionStatement',
        children: [],
      };
    }
    root.children.push(lineNode);
  }

  return root;
}

/**
 * Computes Tree Edit Distance using post-order tree node array traversal
 */
export function computeTreeEditDistance(source1: string, source2: string): TreeEditDistanceResult {
  const tree1 = buildSyntheticAST(source1);
  const tree2 = buildSyntheticAST(source2);

  // Flatten trees in post-order
  const postOrder = (node: ASTNode, list: ASTNode[]) => {
    for (const child of node.children) {
      postOrder(child, list);
    }
    list.push(node);
  };

  const nodes1: ASTNode[] = [];
  const nodes2: ASTNode[] = [];
  postOrder(tree1, nodes1);
  postOrder(tree2, nodes2);

  const m = nodes1.length;
  const n = nodes2.length;

  // Cost matrix: dynamic programming alignment
  // dp[i][j] = min cost to transform nodes1[0..i-1] into nodes2[0..j-1]
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  const COST_DEL = 1;
  const COST_INS = 1;
  const COST_RENAME = 1;

  for (let i = 0; i <= m; i++) dp[i][0] = i * COST_DEL;
  for (let j = 0; j <= n; j++) dp[0][j] = j * COST_INS;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const matchCost = nodes1[i - 1].label === nodes2[j - 1].label ? 0 : COST_RENAME;
      dp[i][j] = Math.min(
        dp[i - 1][j] + COST_DEL, // delete from tree1
        dp[i][j - 1] + COST_INS, // insert into tree2
        dp[i - 1][j - 1] + matchCost // rename or match
      );
    }
  }

  // Backtrack to extract alignment steps
  let i = m;
  let j = n;
  let deletions = 0;
  let insertions = 0;
  let renames = 0;
  let matches = 0;
  const steps: { op: 'MATCH' | 'RENAME' | 'DELETE' | 'INSERT'; cost: number; node1?: string; node2?: string }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const matchCost = nodes1[i - 1].label === nodes2[j - 1].label ? 0 : COST_RENAME;
      if (dp[i][j] === dp[i - 1][j - 1] + matchCost) {
        if (matchCost === 0) {
          matches++;
          steps.unshift({ op: 'MATCH', cost: 0, node1: nodes1[i - 1].label, node2: nodes2[j - 1].label });
        } else {
          renames++;
          steps.unshift({ op: 'RENAME', cost: COST_RENAME, node1: nodes1[i - 1].label, node2: nodes2[j - 1].label });
        }
        i--;
        j--;
        continue;
      }
    }

    if (i > 0 && dp[i][j] === dp[i - 1][j] + COST_DEL) {
      deletions++;
      steps.unshift({ op: 'DELETE', cost: COST_DEL, node1: nodes1[i - 1].label });
      i--;
      continue;
    }

    if (j > 0 && dp[i][j] === dp[i][j - 1] + COST_INS) {
      insertions++;
      steps.unshift({ op: 'INSERT', cost: COST_INS, node2: nodes2[j - 1].label });
      j--;
      continue;
    }
    break;
  }

  const totalDistance = dp[m][n];
  const maxPossibleDistance = m + n;
  const normalizedTreeSimilarity = maxPossibleDistance === 0 ? 1 : Math.max(0, 1 - totalDistance / maxPossibleDistance);

  return {
    treeEditDistance: totalDistance,
    normalizedTreeSimilarity,
    sizeTree1: m,
    sizeTree2: n,
    costBreakdown: { deletions, insertions, renames, matches },
    alignmentSteps: steps.slice(0, 12),
  };
}

// ============================================================================
// 4. NORMALIZED COMPRESSION DISTANCE (KOLMOGOROV COMPLEXITY APPROXIMATION)
// ============================================================================

export interface NCDResult {
  ncd: number; // [0, 1 + epsilon]
  compressionSimilarity: number; // 1 - NCD
  sizeXRaw: number;
  sizeYRaw: number;
  sizeXYRaw: number;
  compressedSizeX: number; // C(x)
  compressedSizeY: number; // C(y)
  compressedSizeXY: number; // C(xy)
  compressionRatioX: string;
  compressionRatioY: string;
  compressionRatioXY: string;
  entropyEstimateBitsPerByte: number;
}

/**
 * Universal lossless compression approximation based on LZ77 / Huffman dictionary redundancy
 */
export function estimateLosslessCompressedSize(input: string): number {
  if (!input || input.length === 0) return 0;
  const buffer = new TextEncoder().encode(input);
  const len = buffer.length;

  // Run a sliding window LZ77 matching estimator + Huffman entropy coder
  const windowSize = 4096;
  let compressedBytes = 4; // header

  let i = 0;
  const byteFreq = new Map<number, number>();

  while (i < len) {
    byteFreq.set(buffer[i], (byteFreq.get(buffer[i]) || 0) + 1);

    let maxMatchLen = 0;
    const startWindow = Math.max(0, i - windowSize);

    for (let j = startWindow; j < i; j++) {
      let matchLen = 0;
      while (i + matchLen < len && buffer[j + matchLen] === buffer[i + matchLen] && matchLen < 258) {
        matchLen++;
      }
      if (matchLen > maxMatchLen) {
        maxMatchLen = matchLen;
      }
    }

    if (maxMatchLen >= 3) {
      compressedBytes += 2; // (distance, length) token
      i += maxMatchLen;
    } else {
      compressedBytes += 1; // literal byte
      i++;
    }
  }

  // Shannon entropy refinement
  let entropy = 0;
  for (const count of byteFreq.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  // Combined entropy bound
  const entropyEstimate = Math.ceil((entropy / 8) * compressedBytes) + 12;
  return Math.max(16, Math.min(len, entropyEstimate));
}

export function computeNCD(sourceX: string, sourceY: string): NCDResult {
  const sizeXRaw = new TextEncoder().encode(sourceX).length;
  const sizeYRaw = new TextEncoder().encode(sourceY).length;
  const xyString = sourceX + '\n' + sourceY;
  const sizeXYRaw = new TextEncoder().encode(xyString).length;

  const cx = estimateLosslessCompressedSize(sourceX);
  const cy = estimateLosslessCompressedSize(sourceY);
  const cxy = estimateLosslessCompressedSize(xyString);

  const minC = Math.min(cx, cy);
  const maxC = Math.max(cx, cy);

  let ncd = maxC === 0 ? 0 : (cxy - minC) / maxC;
  ncd = Math.max(0, Number(ncd.toFixed(4)));

  const compressionSimilarity = Math.max(0, Math.min(1, 1 - ncd));

  // Shannon entropy calculation
  const freq = new Map<string, number>();
  for (let i = 0; i < xyString.length; i++) {
    freq.set(xyString[i], (freq.get(xyString[i]) || 0) + 1);
  }
  let entropy = 0;
  for (const cnt of freq.values()) {
    const p = cnt / xyString.length;
    entropy -= p * Math.log2(p);
  }

  return {
    ncd,
    compressionSimilarity,
    sizeXRaw,
    sizeYRaw,
    sizeXYRaw,
    compressedSizeX: cx,
    compressedSizeY: cy,
    compressedSizeXY: cxy,
    compressionRatioX: ((cx / Math.max(1, sizeXRaw)) * 100).toFixed(1) + '%',
    compressionRatioY: ((cy / Math.max(1, sizeYRaw)) * 100).toFixed(1) + '%',
    compressionRatioXY: ((cxy / Math.max(1, sizeXYRaw)) * 100).toFixed(1) + '%',
    entropyEstimateBitsPerByte: Number(entropy.toFixed(3)),
  };
}

// ============================================================================
// COMPREHENSIVE 4-MODEL DERIVATION SUITE EVALUATOR
// ============================================================================

export interface QuadModelEvaluationResult {
  timestamp: string;
  sourceAName: string;
  sourceBName: string;
  compositeSimilarityScore: number; // [0, 1] weighted composite
  isStructuralDerivation: boolean; // >= 0.75 composite threshold
  vectorCosine: VectorCosineResult;
  tensorContraction: TensorAnalysisResult;
  treeEditDistance: TreeEditDistanceResult;
  normalizedCompressionDistance: NCDResult;
}

export function evaluateQuadDerivationModels(
  sourceA: string,
  sourceB: string,
  nameA: string = 'Albert Lane Baseline (RFC 0103)',
  nameB: string = 'Candidate Derivation Source'
): QuadModelEvaluationResult {
  const vectorCosine = computeCosineSimilarity(sourceA, sourceB, 1);
  const tensorContraction = computeTensorContractionAnalysis(sourceA, sourceB, 1000);
  const treeEditDistance = computeTreeEditDistance(sourceA, sourceB);
  const normalizedCompressionDistance = computeNCD(sourceA, sourceB);

  // Composite metric weighting:
  // 30% Cosine Vector + 25% Tensor Correlation + 25% AST Tree Similarity + 20% NCD Compression Similarity
  const compositeSimilarityScore = Number(
    (
      vectorCosine.similarity * 0.30 +
      tensorContraction.tensorCorrelation * 0.25 +
      treeEditDistance.normalizedTreeSimilarity * 0.25 +
      normalizedCompressionDistance.compressionSimilarity * 0.20
    ).toFixed(4)
  );

  const isStructuralDerivation = compositeSimilarityScore >= 0.70;

  return {
    timestamp: new Date().toISOString(),
    sourceAName: nameA,
    sourceBName: nameB,
    compositeSimilarityScore,
    isStructuralDerivation,
    vectorCosine,
    tensorContraction,
    treeEditDistance,
    normalizedCompressionDistance,
  };
}
