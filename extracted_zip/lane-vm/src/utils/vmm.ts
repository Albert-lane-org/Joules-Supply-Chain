/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import { ExecutionMode, LANE_CONSTANTS, VmmMemoryCell } from '../types/lane.js';
import { applyBitMask, byteToBrailleChar } from './braille.js';

export class VirtualLaneMemoryManager {
  private cells: Map<number, VmmMemoryCell> = new Map();
  private readonly stride = LANE_CONSTANTS.STRIDE_BYTES; // 17,684 bytes

  constructor() {
    this.seedDefaultSegments();
  }

  private seedDefaultSegments(): void {
    const initialTags = [
      'SYS_BOOT_SECTOR',
      'CRYPTO_CANARY_ROTOR',
      'SEC_FILING_ASSERTION',
      'RO_PROVENANCE_LEDGER',
      'IO_RING_BUFFER_ALPHA',
      'VMM_ALIGNMENT_GUARD',
      'BRAILLE_TACTILE_FIFO',
      'SENTRY_DIRECT_IP_MAP',
    ];

    initialTags.forEach((tag, idx) => {
      this.write(idx, (idx + 1) * 1337 + 0x41424344, ExecutionMode.GROUND_31, tag);
    });
  }

  /**
   * Calculates physical address A(r) = r * 17,684
   */
  public getPhysicalAddress(virtualIndex: number): number {
    return virtualIndex * this.stride;
  }

  /**
   * Evaluates phase drift modulo 2^k
   * Phi(r, k) = (r * 17684) mod (2^k)
   */
  public computePhaseDrift(virtualIndex: number): { phi_8: number; phi_16: number; phi_64: number } {
    const r = virtualIndex;
    return {
      phi_8: (r * this.stride) % 8,
      phi_16: (r * this.stride) % 16,
      phi_64: (r * this.stride) % 64,
    };
  }

  public write(virtualIndex: number, rawValue: number, mode: ExecutionMode, tag = 'USER_DATA'): VmmMemoryCell {
    const physicalAddress = this.getPhysicalAddress(virtualIndex);
    const maskedValue = applyBitMask(rawValue, mode);
    const braillePattern = byteToBrailleChar(maskedValue & 0xFF, mode);

    const cell: VmmMemoryCell = {
      virtualIndex,
      physicalAddress,
      stride: this.stride,
      tag,
      rawValue,
      maskedValue,
      mode,
      braillePattern,
      lastUpdated: Date.now(),
      allocatedBytes: this.stride,
    };

    this.cells.set(virtualIndex, cell);
    return cell;
  }

  public read(virtualIndex: number): VmmMemoryCell | undefined {
    return this.cells.get(virtualIndex);
  }

  public getAllCells(): VmmMemoryCell[] {
    return Array.from(this.cells.values()).sort((a, b) => a.virtualIndex - b.virtualIndex);
  }

  public getTotalAllocatedBytes(): number {
    return this.cells.size * this.stride;
  }
}
