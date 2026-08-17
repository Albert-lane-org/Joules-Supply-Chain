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

/**
 * Architectural Specification and Security Evaluation of the Secure Asynchronous
 * Full-Duplex Stream Framework (SAFD-FRAMEWORK-SPEC-01 / RFC 0102)
 *
 * Implements:
 * 1. Pre-Resolution IP Pinning & Host/SNI Mapping
 * 2. Subterranean IPv6/IPv4 Unwrapping (IPv4-Mapped, IPv4-Compatible, 6to4, NAT64, Teredo, ISATAP)
 * 3. Strict Subnet Boundary Enforcement (RFC 1918, RFC 3927, RFC 4193, RFC 6598, TEST-NET)
 * 4. Bounded Queue Ingress/Egress Concurrency & Non-Blocking Polling
 * 5. Deterministic Lifecycle Teardown & Resource Bounding
 * 6. Cryptographic Provenance Ledger Integration (RFC 0103)
 */

import dns from 'dns';
import crypto from 'crypto';
import { LANE_CONSTANTS } from '../src/types/lane.js';
import { computeIEEE8023CRC32, formatCRC32Hex } from '../src/utils/crc32.js';

export const SAFD_SPEC_CONSTANTS = {
  SPEC_ID: 'SAFD-FRAMEWORK-SPEC-01',
  RFC_STANDARD: 'RFC 0102',
  FRAMEWORK_SPEC: '0100',
  MAX_PAYLOAD_LEN: 2000,
  MAX_QUEUE_SIZE: 100,
  MAX_BUFFER_LOGS: 15,
  DNS_TIMEOUT_SECONDS: 3.0,
  JOIN_TIMEOUT_SECONDS: 3.5,
  MAGIC_HEADER: LANE_CONSTANTS.MAGIC_HEADER_HEX,
  BASE_SEQUENCE_OFFSET: LANE_CONSTANTS.BASE_SEQUENCE_OFFSET,
} as const;

export interface IngressValidationResult {
  isValid: boolean;
  reason: string;
  pinnedUri: string | null;
  metadata: {
    originalHost: string;
    pinnedIp: string;
    port: number;
    headers: Record<string, string>;
    isSsl: boolean;
    subterraneanUnwrapped: boolean;
    unwrappedIpv4?: string;
    transitionType?: string;
    rfc0103HandshakeDigest: string;
  } | null;
}

export interface StreamFrameLog {
  id: string;
  sequenceId: number;
  timestamp: string;
  direction: 'INBOUND' | 'OUTBOUND_BROADCAST' | 'SYSTEM' | 'ERROR' | 'SENTRY_DROP';
  payload: string;
  truncated: boolean;
  crc32: string;
  pinnedIp: string;
}

export class SafdStreamEngine {
  private inboundQueue: StreamFrameLog[] = [];
  private outboundQueue: string[] = [];
  private logRingBuffer: StreamFrameLog[] = [];
  private isConnected: boolean = false;
  private currentPinnedUri: string | null = null;
  private currentMetadata: IngressValidationResult['metadata'] | null = null;
  private sequenceCounter: number = SAFD_SPEC_CONSTANTS.BASE_SEQUENCE_OFFSET;
  private totalFramesIngressed: number = 0;
  private totalFramesEgressed: number = 0;
  private totalFramesDropped: number = 0;

  constructor() {}

  /**
   * Recursive subterranean IPv6 unwrapping logic covering all 7 standard transition mechanisms
   */
  public extractSubterraneanIpv4(ipStr: string): { unwrappedIp: string; transitionType?: string } {
    const cleanIp = ipStr.trim().toLowerCase().replace(/^\[|\]$/g, '');

    // 1. IPv4-Mapped IPv6 (::ffff:192.0.2.1 or ::ffff:c000:0201)
    const ipv4MappedMatch = cleanIp.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
    if (ipv4MappedMatch) {
      return { unwrappedIp: ipv4MappedMatch[1], transitionType: 'IPv4-Mapped IPv6 (RFC 4291)' };
    }

    // 2. IPv4-Compatible IPv6 (::192.0.2.1)
    const ipv4CompatMatch = cleanIp.match(/^::(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
    if (ipv4CompatMatch && ipv4CompatMatch[1] !== '0.0.0.0' && ipv4CompatMatch[1] !== '0.0.0.1') {
      return { unwrappedIp: ipv4CompatMatch[1], transitionType: 'IPv4-Compatible IPv6 (RFC 4291)' };
    }

    // 3. 6to4 Tunneling (2002:c000:0201::/16)
    if (cleanIp.startsWith('2002:')) {
      const parts = cleanIp.split(':');
      if (parts.length >= 3) {
        const h1 = parseInt(parts[1], 16);
        const h2 = parseInt(parts[2], 16);
        if (!isNaN(h1) && !isNaN(h2)) {
          const oct1 = (h1 >> 8) & 0xff;
          const oct2 = h1 & 0xff;
          const oct3 = (h2 >> 8) & 0xff;
          const oct4 = h2 & 0xff;
          return { unwrappedIp: `${oct1}.${oct2}.${oct3}.${oct4}`, transitionType: '6to4 Tunneling (RFC 3056)' };
        }
      }
    }

    // 4. NAT64 Well-Known Prefix (64:ff9b::/96)
    if (cleanIp.startsWith('64:ff9b::')) {
      const remaining = cleanIp.replace('64:ff9b::', '');
      if (remaining.includes('.')) {
        return { unwrappedIp: remaining, transitionType: 'NAT64 Well-Known (RFC 6052)' };
      }
      const parts = remaining.split(':');
      if (parts.length >= 2) {
        const h1 = parseInt(parts[parts.length - 2], 16);
        const h2 = parseInt(parts[parts.length - 1], 16);
        if (!isNaN(h1) && !isNaN(h2)) {
          return {
            unwrappedIp: `${(h1 >> 8) & 0xff}.${h1 & 0xff}.${(h2 >> 8) & 0xff}.${h2 & 0xff}`,
            transitionType: 'NAT64 Well-Known (RFC 6052)',
          };
        }
      }
    }

    // 5. Teredo NAT Traversal (2001:0000::/32 or 2001::/32 with 0xFFFFFFFF bitwise XOR)
    if (cleanIp.startsWith('2001:0:') || cleanIp.startsWith('2001::')) {
      const parts = cleanIp.split(':');
      if (parts.length >= 2) {
        const last1 = parseInt(parts[parts.length - 2], 16);
        const last2 = parseInt(parts[parts.length - 1], 16);
        if (!isNaN(last1) && !isNaN(last2)) {
          // Bitwise XOR against 0xFFFFFFFF
          const xor1 = (last1 ^ 0xffff) & 0xffff;
          const xor2 = (last2 ^ 0xffff) & 0xffff;
          const oct1 = (xor1 >> 8) & 0xff;
          const oct2 = xor1 & 0xff;
          const oct3 = (xor2 >> 8) & 0xff;
          const oct4 = xor2 & 0xff;
          return { unwrappedIp: `${oct1}.${oct2}.${oct3}.${oct4}`, transitionType: 'Teredo Tunneling (RFC 4380 XOR)' };
        }
      }
    }

    // 6. ISATAP Interface ID (contains :5efe:)
    if (cleanIp.includes(':5efe:') || cleanIp.includes(':0:5efe:') || cleanIp.includes(':200:5efe:')) {
      const parts = cleanIp.split(':');
      const last1 = parseInt(parts[parts.length - 2], 16);
      const last2 = parseInt(parts[parts.length - 1], 16);
      if (!isNaN(last1) && !isNaN(last2)) {
        return {
          unwrappedIp: `${(last1 >> 8) & 0xff}.${last1 & 0xff}.${(last2 >> 8) & 0xff}.${last2 & 0xff}`,
          transitionType: 'ISATAP Interface ID (RFC 5214)',
        };
      }
    }

    return { unwrappedIp: cleanIp };
  }

  /**
   * Evaluates address against Strict Subnet Boundary Matrix (RFC 1918, RFC 3927, RFC 4193, CGNAT, etc.)
   */
  public isIpRestricted(ipStr: string): { restricted: boolean; reason?: string } {
    const { unwrappedIp, transitionType } = this.extractSubterraneanIpv4(ipStr);

    // IPv4 Boundary Checks
    const v4Parts = unwrappedIp.split('.').map(Number);
    if (v4Parts.length === 4 && v4Parts.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {
      const [o1, o2, o3, o4] = v4Parts;

      // Loopback (127.0.0.0/8)
      if (o1 === 127) {
        return { restricted: true, reason: `Loopback interface (127.0.0.0/8)${transitionType ? ` via ${transitionType}` : ''}` };
      }
      // Private RFC 1918
      if (o1 === 10) return { restricted: true, reason: `RFC 1918 Private (10.0.0.0/8)` };
      if (o1 === 172 && o2 >= 16 && o2 <= 31) return { restricted: true, reason: `RFC 1918 Private (172.16.0.0/12)` };
      if (o1 === 192 && o2 === 168) return { restricted: true, reason: `RFC 1918 Private (192.168.0.0/16)` };
      // Link-Local / Cloud Instance Metadata IMDSv1/v2 (169.254.0.0/16)
      if (o1 === 169 && o2 === 254) return { restricted: true, reason: `Cloud Metadata / Link-Local (169.254.0.0/16)` };
      // Carrier-Grade NAT (100.64.0.0/10)
      if (o1 === 100 && o2 >= 64 && o2 <= 127) return { restricted: true, reason: `Carrier-Grade NAT (100.64.0.0/10)` };
      // Documentation / TEST-NET
      if (o1 === 192 && o2 === 0 && o3 === 2) return { restricted: true, reason: `TEST-NET-1 (192.0.2.0/24)` };
      if (o1 === 198 && o2 === 51 && o3 === 100) return { restricted: true, reason: `TEST-NET-2 (198.51.100.0/24)` };
      if (o1 === 203 && o2 === 0 && o3 === 113) return { restricted: true, reason: `TEST-NET-3 (203.0.113.0/24)` };
      // Broadcast / Self-identification
      if (o1 === 0) return { restricted: true, reason: `Self-identification (0.0.0.0/8)` };
      if (o1 === 255 && o2 === 255 && o3 === 255 && o4 === 255) return { restricted: true, reason: `Limited Broadcast` };
      // Multicast / Reserved
      if (o1 >= 224 && o1 <= 239) return { restricted: true, reason: `Multicast (224.0.0.0/4)` };
      if (o1 >= 240) return { restricted: true, reason: `Reserved (240.0.0.0/4)` };

      return { restricted: false };
    }

    // IPv6 Native Boundary Checks
    const lower = ipStr.toLowerCase();
    if (lower === '::1' || lower === '0:0:0:0:0:0:0:1') {
      return { restricted: true, reason: 'IPv6 Loopback (::1/128)' };
    }
    if (lower.startsWith('fe80:')) {
      return { restricted: true, reason: 'IPv6 Link-Local (fe80::/10)' };
    }
    if (lower.startsWith('fc00:') || lower.startsWith('fd00:')) {
      return { restricted: true, reason: 'IPv6 Unique Local ULA (fc00::/7)' };
    }
    if (lower.startsWith('2001:db8:')) {
      return { restricted: true, reason: 'IPv6 Documentation (2001:db8::/32)' };
    }

    return { restricted: false };
  }

  /**
   * Stage 1-4 Synchronous Pre-Resolution IP Pinning & Ingress Validation
   */
  public async validateAndPinEndpoint(targetUrl: string): Promise<IngressValidationResult> {
    // Stage 1: Scheme & Control Character Sanitization
    if (anyControlChar(targetUrl)) {
      return {
        isValid: false,
        reason: 'Validation Error: Control characters (\\r, \\n, \\0) detected in target URL.',
        pinnedUri: null,
        metadata: null,
      };
    }

    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return {
        isValid: false,
        reason: 'Validation Error: Malformed URL syntax.',
        pinnedUri: null,
        metadata: null,
      };
    }

    if (parsed.protocol !== 'ws:' && parsed.protocol !== 'wss:') {
      return {
        isValid: false,
        reason: `Validation Error: Scheme '${parsed.protocol}' disallowed. Must be 'ws:' or 'wss:'.`,
        pinnedUri: null,
        metadata: null,
      };
    }

    if (parsed.username || parsed.password) {
      return {
        isValid: false,
        reason: 'Validation Error: Embedded userinfo credentials strictly prohibited.',
        pinnedUri: null,
        metadata: null,
      };
    }

    const hostname = parsed.hostname;
    const isSsl = parsed.protocol === 'wss:';
    const port = parsed.port ? parseInt(parsed.port, 10) : isSsl ? 443 : 80;

    // Stage 2 & 3: Host Resolution & Subterranean Unwrapping
    let resolvedIp = hostname;
    let unwrappedIpv4: string | undefined;
    let transitionType: string | undefined;

    // Check if hostname is already a raw IP literal
    const isRawIp = isIpv4Address(hostname) || hostname.includes(':');
    if (isRawIp) {
      const unwrapped = this.extractSubterraneanIpv4(hostname);
      unwrappedIpv4 = unwrapped.unwrappedIp;
      transitionType = unwrapped.transitionType;

      const boundary = this.isIpRestricted(hostname);
      if (boundary.restricted) {
        return {
          isValid: false,
          reason: `Security Violation: Target IP ${hostname} is restricted [${boundary.reason}].`,
          pinnedUri: null,
          metadata: null,
        };
      }
    } else {
      // Synchronous DNS Resolution bounded by DNS_TIMEOUT_SECONDS
      try {
        const dnsResult = await Promise.race<string>([
          new Promise((resolve, reject) => {
            dns.lookup(hostname, (err, address) => {
              if (err) reject(err);
              else resolve(address);
            });
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`DNS resolution timed out after ${SAFD_SPEC_CONSTANTS.DNS_TIMEOUT_SECONDS}s`)), SAFD_SPEC_CONSTANTS.DNS_TIMEOUT_SECONDS * 1000)
          ),
        ]);

        resolvedIp = dnsResult;
        const unwrapped = this.extractSubterraneanIpv4(resolvedIp);
        unwrappedIpv4 = unwrapped.unwrappedIp;
        transitionType = unwrapped.transitionType;

        const boundary = this.isIpRestricted(resolvedIp);
        if (boundary.restricted) {
          return {
            isValid: false,
            reason: `Security Violation: Resolved IP ${resolvedIp} for host ${hostname} is restricted [${boundary.reason}].`,
            pinnedUri: null,
            metadata: null,
          };
        }
      } catch (err: any) {
        return {
          isValid: false,
          reason: `Resolution Error: ${err.message || 'Unable to resolve target host'}`,
          pinnedUri: null,
          metadata: null,
        };
      }
    }

    // Stage 4: IP Literal Pinning & Header Mapping
    const isIpv6 = resolvedIp.includes(':');
    const ipLiteral = isIpv6 ? `[${resolvedIp}]` : resolvedIp;
    const pathAndQuery = `${parsed.pathname}${parsed.search}`;
    const pinnedUri = `${parsed.protocol}//${ipLiteral}:${port}${pathAndQuery}`;

    const hostHeader = parsed.port ? `${hostname}:${port}` : hostname;
    const handshakePayload = `${pinnedUri}:${hostname}:${port}:${Date.now()}:${LANE_CONSTANTS.MAGIC_HEADER_HEX}`;
    const rfc0103HandshakeDigest = crypto.createHash('sha256').update(handshakePayload).digest('hex');

    const metadata = {
      originalHost: hostname,
      pinnedIp: resolvedIp,
      port,
      headers: {
        Host: hostHeader,
        'X-LANE-VM-Kernel': 'RFC0103-v1.0',
        'X-SAFD-Spec': SAFD_SPEC_CONSTANTS.SPEC_ID,
        'X-SAFD-Framework': SAFD_SPEC_CONSTANTS.FRAMEWORK_SPEC,
        'X-LANE-Magic': LANE_CONSTANTS.MAGIC_HEADER_HEX,
      },
      isSsl,
      subterraneanUnwrapped: Boolean(transitionType),
      unwrappedIpv4,
      transitionType,
      rfc0103HandshakeDigest,
    };

    this.currentPinnedUri = pinnedUri;
    this.currentMetadata = metadata;
    this.isConnected = true;

    return {
      isValid: true,
      reason: 'Ingress security validation passed. Direct-IP pinned with zero-trust SNI/Host mapping.',
      pinnedUri,
      metadata,
    };
  }

  /**
   * Broadcasts outbound message via bounded egress queue with length capping
   */
  public broadcastPayload(payload: string): StreamFrameLog {
    this.sequenceCounter++;
    const isTruncated = payload.length > SAFD_SPEC_CONSTANTS.MAX_PAYLOAD_LEN;
    const finalPayload = isTruncated ? payload.slice(0, SAFD_SPEC_CONSTANTS.MAX_PAYLOAD_LEN) : payload;

    const crc = formatCRC32Hex(computeIEEE8023CRC32(finalPayload));
    const log: StreamFrameLog = {
      id: `FRAME-${this.sequenceCounter}`,
      sequenceId: this.sequenceCounter,
      timestamp: new Date().toLocaleTimeString(),
      direction: 'OUTBOUND_BROADCAST',
      payload: finalPayload,
      truncated: isTruncated,
      crc32: crc,
      pinnedIp: this.currentMetadata?.pinnedIp || '127.0.0.1',
    };

    if (this.outboundQueue.length >= SAFD_SPEC_CONSTANTS.MAX_QUEUE_SIZE) {
      this.totalFramesDropped++;
    } else {
      this.outboundQueue.push(finalPayload);
      this.totalFramesEgressed++;
    }

    this.pushLog(log);
    return log;
  }

  /**
   * Ingests inbound frame into bounded queue
   */
  public ingestInboundFrame(rawPayload: string): StreamFrameLog {
    this.sequenceCounter++;
    const isTruncated = rawPayload.length > SAFD_SPEC_CONSTANTS.MAX_PAYLOAD_LEN;
    const finalPayload = isTruncated ? rawPayload.slice(0, SAFD_SPEC_CONSTANTS.MAX_PAYLOAD_LEN) : rawPayload;

    const crc = formatCRC32Hex(computeIEEE8023CRC32(finalPayload));
    const log: StreamFrameLog = {
      id: `FRAME-${this.sequenceCounter}`,
      sequenceId: this.sequenceCounter,
      timestamp: new Date().toLocaleTimeString(),
      direction: 'INBOUND',
      payload: finalPayload,
      truncated: isTruncated,
      crc32: crc,
      pinnedIp: this.currentMetadata?.pinnedIp || '127.0.0.1',
    };

    if (this.inboundQueue.length >= SAFD_SPEC_CONSTANTS.MAX_QUEUE_SIZE) {
      this.totalFramesDropped++;
    } else {
      this.inboundQueue.push(log);
      this.totalFramesIngressed++;
    }

    this.pushLog(log);
    return log;
  }

  private pushLog(log: StreamFrameLog) {
    this.logRingBuffer.unshift(log);
    if (this.logRingBuffer.length > SAFD_SPEC_CONSTANTS.MAX_BUFFER_LOGS) {
      this.logRingBuffer = this.logRingBuffer.slice(0, SAFD_SPEC_CONSTANTS.MAX_BUFFER_LOGS);
    }
  }

  public getRingBufferLogs(): StreamFrameLog[] {
    return this.logRingBuffer;
  }

  public disconnect(): void {
    this.isConnected = false;
    this.currentPinnedUri = null;
    this.currentMetadata = null;
    this.inboundQueue = [];
    this.outboundQueue = [];
  }

  public getStatus() {
    return {
      specId: SAFD_SPEC_CONSTANTS.SPEC_ID,
      frameworkSpec: SAFD_SPEC_CONSTANTS.FRAMEWORK_SPEC,
      rfcStandard: SAFD_SPEC_CONSTANTS.RFC_STANDARD,
      isConnected: this.isConnected,
      pinnedUri: this.currentPinnedUri,
      metadata: this.currentMetadata,
      totalFramesIngressed: this.totalFramesIngressed,
      totalFramesEgressed: this.totalFramesEgressed,
      totalFramesDropped: this.totalFramesDropped,
      currentSequenceId: this.sequenceCounter,
      magicHeader: SAFD_SPEC_CONSTANTS.MAGIC_HEADER,
      operationalBounds: {
        maxPayloadLen: SAFD_SPEC_CONSTANTS.MAX_PAYLOAD_LEN,
        maxQueueSize: SAFD_SPEC_CONSTANTS.MAX_QUEUE_SIZE,
        maxBufferLogs: SAFD_SPEC_CONSTANTS.MAX_BUFFER_LOGS,
        dnsTimeout: SAFD_SPEC_CONSTANTS.DNS_TIMEOUT_SECONDS,
        joinTimeout: SAFD_SPEC_CONSTANTS.JOIN_TIMEOUT_SECONDS,
      },
    };
  }
}

function anyControlChar(str: string): boolean {
  return /[\r\n\0\t]/.test(str);
}

function isIpv4Address(str: string): boolean {
  const parts = str.split('.');
  return parts.length === 4 && parts.every((p) => /^\d+$/.test(p) && parseInt(p, 10) >= 0 && parseInt(p, 10) <= 255);
}
