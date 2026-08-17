/**
 * @file types.ts
 * @license Proprietary
 * @provenance Albert Dale Lane (albertlane.net)
 * @author Albert Dale Lane
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @magic_header 0x3F8F9A1B2C3D
 * Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
 */

/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

export interface DependencyInfo {
  name: string;
  version: string;
  type: 'production' | 'development';
  category: 'core' | 'ui' | 'build' | 'utility';
  status: 'installed' | 'configured';
  description: string;
}

export interface DeploymentCheck {
  id: string;
  name: string;
  status: 'passed' | 'ready' | 'pending';
  category: string;
  details: string;
  timestamp: string;
}

export interface ProjectFile {
  path: string;
  size: string;
  bytes?: number;
  type: 'typescript' | 'rust' | 'config' | 'style' | 'markup' | 'doc' | 'license' | 'json' | 'binary' | 'yaml' | 'sql' | 'python' | 'script' | 'other';
  category?: string;
  lines?: number;
  content?: string;
  description: string;
  isUnzipped?: boolean;
}

export interface ZipArchiveInfo {
  filename: string;
  totalFiles: number;
  totalDirectories: number;
  compressedSize: string;
  uncompressedSize: string;
  extractedAt: string;
}

export interface SecurityHeaderItem {
  key: string;
  value: string;
  recommended: string;
  status: 'optimal' | 'warning' | 'missing';
  category: 'security' | 'provenance' | 'isolation' | 'caching';
  description: string;
  rfcStandard: string;
}

export interface BrailleCipherState {
  rotationStep: number;
  rotationSpeedMs: number;
  direction: 'clockwise' | 'counter-clockwise';
  mode: 'GROUND_31' | 'APEX_7';
  rawInput: string;
  brailleMatrix: string[];
  cipherStream: string;
  hashDigest: string;
  offset: number;
  kernelActive: boolean;
}

export interface CloudflareWorkerConfig {
  domain: string;
  zoneId: string;
  routePattern: string;
  compatibilityDate: string;
  kvBindings: string[];
  environment: 'production' | 'staging';
  securityHeadersEnabled: boolean;
  brailleCipherEdgeEnabled: boolean;
}

export interface JoulesArchitectureSpec {
  moduleName: string;
  polyglotLayer: 'Python-Orchestration' | 'CPP-Binary-Core' | 'Julia-5D-Tensor' | 'XML-Object-Storage';
  memoryOffset: string;
  energyJoulesPerOp: number;
  quantumEfficiency: string;
  executionState: 'ARMED' | 'EXECUTING' | 'REPLACED_AT_RUNTIME' | 'STANDBY';
  sourceSnippet: string;
  binaryOpcodeHash: string;
  xmlSchema: string;
}

export interface JoulesSupplyChainNode {
  id: string;
  stageName: string;
  runtimeLayer: 'C++20 Native Core' | 'Julia 1.10 Tensor Contract' | 'XML Storage Vault' | 'Cloud Edge Worker' | 'AVX-512 Pipeline';
  joulesBudget: number;
  joulesMeasured: number;
  throughputGflops: number;
  magicHeaderAttested: boolean;
  provenanceOwner: string;
  status: 'OPTIMAL' | 'ACTIVE' | 'HOT_SWAPPED' | 'VERIFIED';
  contractAddress: string;
}

export interface CppBinaryMemoryLayout {
  magicHeader: string;
  baseOffset: number;
  secRef: string;
  author: string;
  bufferSizeBytes: number;
  simdVectorWidthBits: number;
  registerSpillCount: number;
  cAbiExportSymbol: string;
}

export interface Julia5DTensorSpace {
  baseOffsetDimension: number;
  groundFieldDimension: number;
  phaseLatticeDimension: number;
  energyQuantaDimension: number;
  simdLaneDimension: number;
  totalContractionNodes: number;
  contractionEnergyJoules: number;
  ffiLinkageSymbol: string;
}

export interface XMLObjectStorageNode {
  id: string;
  tagName: string;
  guid: string;
  joulesAllocated: number;
  byteLength: number;
  checksum: string;
  payloadXml: string;
  targetRuntime: string;
  activeStatus: 'MOUNTED' | 'SEALED' | 'HOT_SWAPPED';
}

export interface CodeRegister {
  registerId: string;
  name: string;
  registerType: 'GZIP_BASE64' | 'RAW_BYTES' | 'HEX_STREAM' | 'TAR_ARCHIVE' | 'ZIP_ARCHIVE';
  rawByteCount: number;
  compressedByteCount: number;
  compressionRatio: string;
  provenanceHash: string;
  magicHeader: string;
  author: string;
  filesContained: number;
  status: 'INITIALIZED' | 'EXTRACTING' | 'INSTALLED' | 'VERIFIED';
  samplePayloadSnippet: string;
}

export interface CompressedInstallResult {
  success: boolean;
  filesReconstructed: number;
  totalBytesInflated: number;
  registersUsed: string[];
  runtimeAudit: {
    node: boolean;
    cpp: boolean;
    julia: boolean;
    rfc0103: boolean;
    joules: boolean;
  };
  installedPaths: string[];
  timestamp: string;
}

