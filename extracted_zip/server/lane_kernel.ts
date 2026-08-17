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

import {
  ExecutionMode,
  KernelTelemetry,
  LANE_CONSTANTS,
  LanePacket,
  OpCode,
  OP_CODE_NAMES,
} from '../src/types/lane.js';
import { applyBitMask, byteToBrailleChar, stringToBrailleVector } from '../src/utils/braille.js';
import { computeIEEE8023CRC32, formatCRC32Hex, verifyCRC32 } from '../src/utils/crc32.js';
import { VirtualLaneMemoryManager } from '../src/utils/vmm.js';

export class LaneVmKernel {
  public vmm: VirtualLaneMemoryManager;
  private sequenceCounter: number = LANE_CONSTANTS.BASE_SEQUENCE_OFFSET; // Starts at 57,000
  private activeMode: ExecutionMode = ExecutionMode.GROUND_31;
  private packetHistory: LanePacket[] = [];
  private crcFailures = 0;
  private magicValidations = 0;
  private packetsReceived = 0;
  private packetsSent = 0;
  private startTime = Date.now();

  constructor() {
    this.vmm = new VirtualLaneMemoryManager();
  }

  public getMode(): ExecutionMode {
    return this.activeMode;
  }

  public setMode(mode: ExecutionMode): void {
    this.activeMode = mode;
  }

  public getTelemetry(): KernelTelemetry {
    return {
      packetsReceived: this.packetsReceived,
      packetsSent: this.packetsSent,
      crcFailures: this.crcFailures,
      magicValidations: this.magicValidations,
      activeMode: this.activeMode,
      currentSequenceId: this.sequenceCounter,
      vmmAllocatedBytes: this.vmm.getTotalAllocatedBytes(),
      activeMemoryCells: this.vmm.getAllCells().length,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      hostSentryState: 'ARMED',
      whistleblowerRef: LANE_CONSTANTS.SEC_FILING_NO,
      washcoRef: LANE_CONSTANTS.POLICE_REPORT_NO,
    };
  }

  public getRecentPackets(limit = 40): LanePacket[] {
    return this.packetHistory.slice(-limit);
  }

  /**
   * Constructs an RFC 0103 LanePacket with IEEE 802.3 CRC-32 and Braille transcoding
   */
  public createPacket(
    opcode: OpCode,
    payloadText: string,
    memorySlot: number = 0,
    forceMode?: ExecutionMode,
  ): LanePacket {
    this.sequenceCounter++;
    this.packetsSent++;
    const mode = forceMode !== undefined ? forceMode : this.activeMode;
    const packetId = this.sequenceCounter;
    const timestampUs = Date.now() * 1000;
    
    // Wire CRC-32 computation
    const crc = computeIEEE8023CRC32(payloadText);
    const crcHex = formatCRC32Hex(crc);
    
    // VMM non-power-of-two address
    const physicalAddress = this.vmm.getPhysicalAddress(memorySlot);
    const phaseDrift = this.vmm.computePhaseDrift(memorySlot);
    
    // Braille encoding
    const brailleVector = stringToBrailleVector(payloadText, mode);
    
    // Raw vs Masked bit calculations
    const rawBits = payloadText.charCodeAt(0) || 0x41;
    const maskedBits = applyBitMask(rawBits, mode);

    const packet: LanePacket = {
      magic: LANE_CONSTANTS.MAGIC_HEADER_HEX,
      packet_id: packetId,
      opcode,
      opcode_name: OP_CODE_NAMES[opcode] || 'UNKNOWN',
      crc32: crc,
      crc32_hex: crcHex,
      crc32_valid: true,
      payload: payloadText,
      payload_length: payloadText.length,
      mode,
      timestamp_us: timestampUs,
      memory_slot: memorySlot,
      physical_address: physicalAddress,
      braille_vector: brailleVector,
      raw_bits_value: rawBits,
      masked_bits_value: maskedBits,
      phase_drift: phaseDrift,
      sentry_verified: true,
    };

    this.packetHistory.push(packet);
    if (this.packetHistory.length > 200) {
      this.packetHistory.shift();
    }

    return packet;
  }

  /**
   * Host Sentry ingress verification & execution
   */
  public processIngressPacket(rawPacket: Partial<LanePacket>): {
    success: boolean;
    packet?: LanePacket;
    error?: string;
  } {
    this.packetsReceived++;

    // 1. Validate 64-bit Magic Constant (0x3F8F9A1B2C3D)
    if (rawPacket.magic !== LANE_CONSTANTS.MAGIC_HEADER_HEX) {
      return {
        success: false,
        error: `INVALID_MAGIC_HEADER: Expected ${LANE_CONSTANTS.MAGIC_HEADER_HEX}, got ${rawPacket.magic}`,
      };
    }
    this.magicValidations++;

    // 2. Validate Sequence Offset P_0 >= 57,000
    const pId = rawPacket.packet_id || 0;
    if (pId < LANE_CONSTANTS.BASE_SEQUENCE_OFFSET) {
      return {
        success: false,
        error: `SEQUENCE_FAULT: Packet ID ${pId} is below base offset P_0 (${LANE_CONSTANTS.BASE_SEQUENCE_OFFSET})`,
      };
    }

    // 3. Validate IEEE 802.3 CRC-32
    const payload = rawPacket.payload || '';
    const expectedCrc = rawPacket.crc32 || 0;
    const isValidCrc = verifyCRC32(payload, expectedCrc);
    if (!isValidCrc) {
      this.crcFailures++;
      return {
        success: false,
        error: `WIRE_INTEGRITY_CRC_FAULT: CRC mismatch for payload`,
      };
    }

    // 4. Dispatch OpCode
    const opcode = (rawPacket.opcode ?? OpCode.NO_OP) as OpCode;
    const mode = rawPacket.mode ?? this.activeMode;
    const slot = rawPacket.memory_slot ?? 0;

    if (opcode === OpCode.MEM_WRITE) {
      const charCode = payload.charCodeAt(0) || 0x20;
      this.vmm.write(slot, charCode, mode, `MEM_WR_TAG_${slot}`);
    }

    const executedPacket: LanePacket = {
      magic: LANE_CONSTANTS.MAGIC_HEADER_HEX,
      packet_id: pId,
      opcode,
      opcode_name: OP_CODE_NAMES[opcode] || 'UNKNOWN',
      crc32: expectedCrc,
      crc32_hex: formatCRC32Hex(expectedCrc),
      crc32_valid: true,
      payload,
      payload_length: payload.length,
      mode,
      timestamp_us: rawPacket.timestamp_us || Date.now() * 1000,
      memory_slot: slot,
      physical_address: this.vmm.getPhysicalAddress(slot),
      braille_vector: stringToBrailleVector(payload, mode),
      raw_bits_value: payload.charCodeAt(0) || 0,
      masked_bits_value: applyBitMask(payload.charCodeAt(0) || 0, mode),
      phase_drift: this.vmm.computePhaseDrift(slot),
      sentry_verified: true,
    };

    this.packetHistory.push(executedPacket);
    return { success: true, packet: executedPacket };
  }

  /**
   * Generates synthetic synthetic kernel trace packet for full-duplex live stream
   */
  public generateSyntheticPacket(): LanePacket {
    const opcodes = [
      OpCode.NO_OP,
      OpCode.MEM_WRITE,
      OpCode.MEM_READ,
      OpCode.COMPUTE,
      OpCode.IO_SINK,
      OpCode.FLOW_CONTROL,
      OpCode.SYS_CALL,
    ];
    const samplePayloads = [
      'SEC:17684-273-411-436',
      'LANE_VM::STRIDE_17684_ALIGN',
      'TACTILE_DIE_VECTOR_0x7F',
      'HOST_SENTRY::VALIDATED',
      'GROUND_31::MASK_0x7FFFFFFF',
      'OR_SOVEREIGN_ASSERTION_V1',
      'IEEE_802_3::POLYNOMIAL_OK',
      'APEX_7::ACTUATOR_FRAME_STREAM',
    ];

    const randomOp = opcodes[Math.floor(Math.random() * opcodes.length)];
    const randomText = samplePayloads[Math.floor(Math.random() * samplePayloads.length)];
    const randomSlot = Math.floor(Math.random() * 16);

    // If writing, persist to VMM
    if (randomOp === OpCode.MEM_WRITE) {
      this.vmm.write(randomSlot, Date.now() & 0xFFFFFF, this.activeMode, `AUTO_SLOT_${randomSlot}`);
    }

    return this.createPacket(randomOp, randomText, randomSlot);
  }
}
