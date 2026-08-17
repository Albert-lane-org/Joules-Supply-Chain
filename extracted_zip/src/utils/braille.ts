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

import { ExecutionMode, LANE_CONSTANTS } from '../types/lane.js';

/**
 * Unicode Braille Patterns block spans U+2800 to U+28FF (256 codepoints).
 * Dot 1 -> 2^0 (1)
 * Dot 2 -> 2^1 (2)
 * Dot 3 -> 2^2 (4)
 * Dot 4 -> 2^3 (8)
 * Dot 5 -> 2^4 (16)
 * Dot 6 -> 2^5 (32)
 * Dot 7 -> 2^6 (64)
 * Dot 8 -> 2^7 (128)
 */
export function byteToBrailleChar(byte: number, mode: ExecutionMode = ExecutionMode.GROUND_31): string {
  let maskedByte = byte & 0xFF;
  if (mode === ExecutionMode.APEX_7) {
    // APEX_7 masks upper bit (Dot 8) to constrain to 7-bit tactile range [0, 127]
    maskedByte = maskedByte & LANE_CONSTANTS.APEX_7_MASK;
  }
  return String.fromCharCode(0x2800 + maskedByte);
}

export function brailleCharToByte(char: string): number {
  const code = char.charCodeAt(0);
  if (code < 0x2800 || code > 0x28FF) {
    return 0;
  }
  return code - 0x2800;
}

export function stringToBrailleVector(str: string, mode: ExecutionMode = ExecutionMode.GROUND_31): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return Array.from(bytes)
    .map(b => byteToBrailleChar(b, mode))
    .join('');
}

export function applyBitMask(value: number, mode: ExecutionMode): number {
  if (mode === ExecutionMode.GROUND_31) {
    return (value & LANE_CONSTANTS.GROUND_31_MASK) >>> 0;
  } else {
    return (value & LANE_CONSTANTS.APEX_7_MASK) >>> 0;
  }
}

export function getDotPositions(byte: number): boolean[] {
  // Returns boolean array for dots 1..8
  return [
    Boolean(byte & 1),   // Dot 1
    Boolean(byte & 2),   // Dot 2
    Boolean(byte & 4),   // Dot 3
    Boolean(byte & 8),   // Dot 4
    Boolean(byte & 16),  // Dot 5
    Boolean(byte & 32),  // Dot 6
    Boolean(byte & 64),  // Dot 7
    Boolean(byte & 128), // Dot 8
  ];
}
