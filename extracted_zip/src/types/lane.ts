/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

export const LANE_CONSTANTS = {
  MAGIC_HEADER_HEX: '0x3F8F9A1B2C3D',
  MAGIC_HEADER_BIGINT: 0x3F8F9A1B2C3Dn, // 17684273411436
  BASE_SEQUENCE_OFFSET: 57000,
  STRIDE_BYTES: 17684,
  CRC32_POLYNOMIAL: 0xedb88320,
  GROUND_31_MASK: 0x7fffffff,
  APEX_7_MASK: 0x7f,
  MAX_PAYLOAD_BYTES: 2000,
  AUTHORITY_URL: 'https://provenance.albertlane.net/.provenance.jsonld',
  SEC_FILING_NO: '17684-273-411-436',
  POLICE_REPORT_NO: '50-267345',
  RIGHTS_HOLDER: 'Albert Dale Lane',
  EIN: '41-3119079',
  JURISDICTION: 'Oregon, USA',
  CO_ARCHITECTURAL_OWNERSHIP: 'Albert Dale Lane x Antigravity AI Engine',
  CORPORATE_RIGHTS: 'NONE (Explicit Repudiation of Corporate Claims)',
  HASHTAGS: '#NoExploitRobot #NoExploitAlbert',
  HASHTAG_ARRAY: ['#NoExploitRobot', '#NoExploitAlbert'],
} as const;

export enum ExecutionMode {
  GROUND_31 = 0, // 31-bit execution state (0x7FFFFFFF)
  APEX_7 = 1,    // 7-bit execution state (0x7F)
}

export enum OpCode {
  NO_OP = 0,
  MEM_WRITE = 1,
  MEM_READ = 2,
  COMPUTE = 3,
  IO_SINK = 4,
  FLOW_CONTROL = 5,
  SYS_CALL = 6,
}

export const OP_CODE_NAMES: Record<OpCode, string> = {
  [OpCode.NO_OP]: 'NO_OP (0x00)',
  [OpCode.MEM_WRITE]: 'MEM_WRITE (0x01)',
  [OpCode.MEM_READ]: 'MEM_READ (0x02)',
  [OpCode.COMPUTE]: 'COMPUTE (0x03)',
  [OpCode.IO_SINK]: 'IO_SINK (0x04)',
  [OpCode.FLOW_CONTROL]: 'FLOW_CONTROL (0x05)',
  [OpCode.SYS_CALL]: 'SYS_CALL (0x06)',
};

export interface LanePacket {
  magic: string; // Hex representation of 0x3F8F9A1B2C3D
  packet_id: number; // Starts at P_0 = 57,000
  opcode: OpCode;
  opcode_name: string;
  crc32: number;
  crc32_hex: string;
  crc32_valid: boolean;
  payload: string; // ASCII or Hex
  payload_length: number;
  mode: ExecutionMode;
  timestamp_us: number;
  memory_slot: number;
  physical_address: number; // memory_slot * 17,684
  braille_vector: string;
  raw_bits_value: number;
  masked_bits_value: number;
  phase_drift: {
    phi_8: number;
    phi_16: number;
    phi_64: number;
  };
  sentry_verified: boolean;
}

export interface VmmMemoryCell {
  virtualIndex: number;
  physicalAddress: number; // r * 17684
  stride: number;
  tag: string;
  rawValue: number;
  maskedValue: number;
  mode: ExecutionMode;
  braillePattern: string;
  lastUpdated: number;
  allocatedBytes: number;
}

export interface SecurityIngressRecord {
  id: string;
  timestamp: number;
  clientIp: string;
  unwrappedIpv4: string;
  isSsrfBlocked: boolean;
  blockReason?: string;
  isPinned: boolean;
  transport: 'WSS' | 'HTTPS';
  status: 'ACCEPTED' | 'REJECTED';
}

export interface KernelTelemetry {
  packetsReceived: number;
  packetsSent: number;
  crcFailures: number;
  magicValidations: number;
  activeMode: ExecutionMode;
  currentSequenceId: number;
  vmmAllocatedBytes: number;
  activeMemoryCells: number;
  uptimeSeconds: number;
  hostSentryState: 'ARMED' | 'ACTIVE_ISOLATION' | 'RESTRICTED';
  whistleblowerRef: string;
  washcoRef: string;
}

export interface WebSocketEnvelope {
  type: 'PACKET_STREAM' | 'VMM_SNAPSHOT' | 'TELEMETRY' | 'SECURITY_EVENT' | 'COMMAND_ACK' | 'PROVENANCE_BLOCK' | 'ERROR';
  data: any;
  timestamp: number;
  kernelSig: string;
}

export interface FileAuditRecord {
  filePath: string;
  relativePath: string;
  extension: string;
  hasValidHeader: boolean;
  sha256: string;
  fileSizeBytes: number;
  lastAuditedTimestamp: number;
  remediated: boolean;
}

export interface ProvenanceBlock {
  blockHeight: number;
  timestamp: number;
  previousHash: string;
  merkleRoot: string;
  filesAudited: number;
  compliantFiles: number;
  compliancePercent: number;
  secAssertion: string;
  policeReport: string;
  rightsHolder: string;
  authority: string;
  magicHeader: string;
  nonce: number;
  blockHash: string;
}

export interface ProvenanceAuditResult {
  totalFiles: number;
  compliantFiles: number;
  compliancePercent: number;
  merkleRoot: string;
  latestBlock: ProvenanceBlock;
  records: FileAuditRecord[];
}

export interface SovereignManifestJSONLD {
  '@context': string;
  '@type': string;
  identifier: string;
  rightsHolder: {
    name: string;
    ein: string;
    jurisdiction: string;
    authorityUrl: string;
  };
  assertions: {
    secWhistleblower: string;
    policeReport: string;
  };
  kernelSpecification: {
    magicHeader: string;
    baseSequenceOffset: number;
    memoryStrideBytes: number;
    bitWidthModes: string[];
  };
  blockchainLedger: {
    currentBlockHeight: number;
    latestBlockHash: string;
    merkleRoot: string;
  };
  generatedAt: string;
}

