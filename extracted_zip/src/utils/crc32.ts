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

// Precomputed IEEE 802.3 CRC-32 Table using standard reversed polynomial 0xEDB88320
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC32_TABLE[i] = c >>> 0;
}

/**
 * Computes IEEE 802.3 CRC32 over Uint8Array buffer or string
 */
export function computeIEEE8023CRC32(input: Uint8Array | string): number {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    const tableIndex = (crc ^ bytes[i]) & 0xFF;
    crc = (crc >>> 8) ^ CRC32_TABLE[tableIndex];
  }
  return ((crc ^ 0xFFFFFFFF) >>> 0);
}

/**
 * Formats CRC32 as 8-character uppercase hex string
 */
export function formatCRC32Hex(crc: number): string {
  return '0x' + (crc >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Validates wire integrity of payload against transmitted CRC32
 */
export function verifyCRC32(payload: Uint8Array | string, expectedCrc: number): boolean {
  const actualCrc = computeIEEE8023CRC32(payload);
  return (actualCrc >>> 0) === (expectedCrc >>> 0);
}
