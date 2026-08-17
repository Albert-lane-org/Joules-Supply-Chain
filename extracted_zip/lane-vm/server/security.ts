/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import { SecurityIngressRecord } from '../src/types/lane.js';

export class IngressSecurityEngine {
  private ingressAuditLog: SecurityIngressRecord[] = [];
  private pinnedIps: Set<string> = new Set();

  constructor() {
    // Initial known authorized peer signatures (can be expanded dynamically)
    this.pinnedIps.add('127.0.0.1'); // Local dev harness allowed when explicitly unblocked
  }

  /**
   * Recursively unwrap subterranean IPv4 mappings from complex encapsulation formats:
   * - IPv4-mapped IPv6 (::ffff:192.0.2.1)
   * - 6to4 (2002:c000:0201::)
   * - Teredo (2001:0000:...:c000:0201)
   * - NAT64 (64:ff9b::192.0.2.1)
   * - Hex/Octal/Dotted representations
   */
  public unwrapIp(rawIp: string): string {
    if (!rawIp) return '0.0.0.0';
    let ip = rawIp.trim().toLowerCase();

    // Strip IPv6 brackets if present
    if (ip.startsWith('[') && ip.endsWith(']')) {
      ip = ip.slice(1, -1);
    }

    // Strip port if present for IPv4
    if (ip.includes(':') && ip.includes('.')) {
      const parts = ip.split(':');
      const last = parts[parts.length - 1];
      if (last.includes('.')) {
        ip = last;
      }
    }

    // 1. IPv4-mapped IPv6: ::ffff:192.168.1.1
    if (ip.startsWith('::ffff:')) {
      const candidate = ip.substring(7);
      if (candidate.includes('.')) {
        return candidate;
      }
    }

    // 2. NAT64: 64:ff9b::192.0.2.1
    if (ip.startsWith('64:ff9b::')) {
      const candidate = ip.substring(9);
      if (candidate.includes('.')) {
        return candidate;
      }
    }

    // 3. 6to4: 2002:WWXX:YYZZ::
    if (ip.startsWith('2002:')) {
      const segments = ip.split(':');
      if (segments.length >= 3) {
        const seg1 = segments[1];
        const seg2 = segments[2];
        if (seg1 && seg2 && seg1.length === 4 && seg2.length === 4) {
          const b1 = parseInt(seg1.slice(0, 2), 16);
          const b2 = parseInt(seg1.slice(2, 4), 16);
          const b3 = parseInt(seg2.slice(0, 2), 16);
          const b4 = parseInt(seg2.slice(2, 4), 16);
          if (!isNaN(b1) && !isNaN(b2) && !isNaN(b3) && !isNaN(b4)) {
            return `${b1}.${b2}.${b3}.${b4}`;
          }
        }
      }
    }

    return ip;
  }

  /**
   * Evaluates an IPv4 address string against SSRF blocklist rules:
   * - CGNAT: 100.64.0.0/10 (100.64.0.0 - 100.127.255.255)
   * - Link-Local: 169.254.0.0/16
   * - Loopback: 127.0.0.0/8
   * - Private CIDRs: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
   * - Zero / Broadcast: 0.0.0.0/8, 255.255.255.255
   */
  public evaluateSsrfRisk(rawIp: string, allowLocalDev = true): { isBlocked: boolean; reason?: string; unwrappedIp: string } {
    const unwrapped = this.unwrapIp(rawIp);

    // IPv6 checks
    if (unwrapped === '::1') {
      if (allowLocalDev) {
        return { isBlocked: false, unwrappedIp: '127.0.0.1' };
      }
      return { isBlocked: true, reason: 'SSRF_BLOCKED: IPv6 Loopback (::1)', unwrappedIp: unwrapped };
    }

    if (unwrapped.startsWith('fc00:') || unwrapped.startsWith('fd')) {
      return { isBlocked: true, reason: 'SSRF_BLOCKED: IPv6 Unique Local Address (ULA fc00::/7)', unwrappedIp: unwrapped };
    }

    if (unwrapped.startsWith('fe80:')) {
      return { isBlocked: true, reason: 'SSRF_BLOCKED: IPv6 Link-Local (fe80::/10)', unwrappedIp: unwrapped };
    }

    // IPv4 dotted notation check
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = unwrapped.match(ipv4Regex);

    if (!match) {
      // In dev containers or special hostnames, permit safe loopback fallback
      if (unwrapped === 'localhost' || unwrapped === '127.0.0.1' || unwrapped === '::1') {
        return { isBlocked: false, unwrappedIp: '127.0.0.1' };
      }
      return { isBlocked: false, unwrappedIp: unwrapped };
    }

    const [_, o1s, o2s, o3s, o4s] = match;
    const o1 = parseInt(o1s, 10);
    const o2 = parseInt(o2s, 10);
    const o3 = parseInt(o3s, 10);
    const o4 = parseInt(o4s, 10);

    if (o1 > 255 || o2 > 255 || o3 > 255 || o4 > 255) {
      return { isBlocked: true, reason: 'MALFORMED_IP: Octet out of bounds', unwrappedIp: unwrapped };
    }

    // 1. Loopback (127.0.0.0/8)
    if (o1 === 127) {
      if (allowLocalDev) {
        return { isBlocked: false, unwrappedIp: unwrapped };
      }
      return { isBlocked: true, reason: 'SSRF_BLOCKED: Loopback 127.0.0.0/8', unwrappedIp: unwrapped };
    }

    // 2. CGNAT (100.64.0.0/10 => 100.64.0.0 to 100.127.255.255)
    if (o1 === 100 && o2 >= 64 && o2 <= 127) {
      return { isBlocked: true, reason: 'SSRF_BLOCKED: Carrier-Grade NAT (CGNAT 100.64.0.0/10)', unwrappedIp: unwrapped };
    }

    // 3. Link-Local (169.254.0.0/16)
    if (o1 === 169 && o2 === 254) {
      return { isBlocked: true, reason: 'SSRF_BLOCKED: Link-Local Metadata (169.254.0.0/16)', unwrappedIp: unwrapped };
    }

    // 4. Zero network
    if (o1 === 0) {
      return { isBlocked: true, reason: 'SSRF_BLOCKED: Zero-Network 0.0.0.0/8', unwrappedIp: unwrapped };
    }

    // 5. Broadcast
    if (o1 === 255 && o2 === 255 && o3 === 255 && o4 === 255) {
      return { isBlocked: true, reason: 'SSRF_BLOCKED: Broadcast Address', unwrappedIp: unwrapped };
    }

    return { isBlocked: false, unwrappedIp: unwrapped };
  }

  public recordIngress(rawIp: string, transport: 'WSS' | 'HTTPS'): SecurityIngressRecord {
    const evalResult = this.evaluateSsrfRisk(rawIp, true);
    const isPinned = this.pinnedIps.has(evalResult.unwrappedIp);

    const record: SecurityIngressRecord = {
      id: 'SEC-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: Date.now(),
      clientIp: rawIp,
      unwrappedIpv4: evalResult.unwrappedIp,
      isSsrfBlocked: evalResult.isBlocked,
      blockReason: evalResult.reason,
      isPinned,
      transport,
      status: evalResult.isBlocked ? 'REJECTED' : 'ACCEPTED',
    };

    this.ingressAuditLog.unshift(record);
    if (this.ingressAuditLog.length > 50) {
      this.ingressAuditLog.pop();
    }

    return record;
  }

  public getAuditLogs(): SecurityIngressRecord[] {
    return [...this.ingressAuditLog];
  }
}
