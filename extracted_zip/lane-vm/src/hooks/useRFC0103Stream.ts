/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ExecutionMode,
  KernelTelemetry,
  LANE_CONSTANTS,
  LanePacket,
  OpCode,
  VmmMemoryCell,
  WebSocketEnvelope,
} from '../types/lane.js';
import { computeIEEE8023CRC32 } from '../utils/crc32.js';

interface UseRFC0103StreamReturn {
  isConnected: boolean;
  isPaused: boolean;
  packets: LanePacket[];
  telemetry: KernelTelemetry | null;
  memoryCells: VmmMemoryCell[];
  activeMode: ExecutionMode;
  errorLog: string | null;
  togglePause: () => void;
  clearPackets: () => void;
  sendPacket: (opcode: OpCode, payload: string, memorySlot?: number, mode?: ExecutionMode, tamperType?: 'none' | 'bad_magic' | 'bad_crc' | 'bad_seq') => Promise<void>;
  setExecutionMode: (mode: ExecutionMode) => Promise<void>;
  refreshVmm: () => Promise<void>;
}

export function useRFC0103Stream(): UseRFC0103StreamReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [packets, setPackets] = useState<LanePacket[]>([]);
  const [telemetry, setTelemetry] = useState<KernelTelemetry | null>(null);
  const [memoryCells, setMemoryCells] = useState<VmmMemoryCell[]>([]);
  const [activeMode, setActiveMode] = useState<ExecutionMode>(ExecutionMode.GROUND_31);
  const [errorLog, setErrorLog] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const packetBufferRef = useRef<LanePacket[]>([]);
  const isScheduledRef = useRef(false);
  const isPausedRef = useRef(false);
  isPausedRef.current = isPaused;

  // Micro-task batch update for high-throughput packet processing
  const flushPacketBuffer = useCallback(() => {
    if (packetBufferRef.current.length > 0 && !isPausedRef.current) {
      const newItems = [...packetBufferRef.current];
      packetBufferRef.current = [];
      setPackets((prev) => {
        const combined = [...prev, ...newItems];
        return combined.slice(-100); // Keep latest 100 packets in memory
      });
    }
    isScheduledRef.current = false;
  }, []);

  const queuePacket = useCallback((packet: LanePacket) => {
    packetBufferRef.current.push(packet);
    if (!isScheduledRef.current) {
      isScheduledRef.current = true;
      queueMicrotask(flushPacketBuffer);
    }
  }, [flushPacketBuffer]);

  // Initial fetch and WebSocket connection
  useEffect(() => {
    // 1. Initial REST polling to guarantee data even if WS upgrade is proxy-filtered
    const fetchInitialData = async () => {
      try {
        const res = await fetch('/api/rfc0103/status');
        if (res.ok) {
          const json = await res.json();
          if (json.telemetry) {
            setTelemetry(json.telemetry);
            setActiveMode(json.telemetry.activeMode);
          }
          if (json.recentPackets && json.recentPackets.length > 0) {
            setPackets(json.recentPackets);
          }
        }
        const vmmRes = await fetch('/api/rfc0103/vmm');
        if (vmmRes.ok) {
          const vmmJson = await vmmRes.json();
          if (vmmJson.cells) {
            setMemoryCells(vmmJson.cells);
          }
        }
      } catch (err) {
        console.warn('[RFC0103] Initial status fetch fallback:', err);
      }
    };

    fetchInitialData();

    // 2. Establish Full-Duplex WebSocket connection
    let isMounted = true;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/rfc0103`;

    let reconnectTimer: NodeJS.Timeout;

    const connectWebSocket = () => {
      try {
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          setErrorLog(null);
        };

        socket.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const envelope: WebSocketEnvelope = JSON.parse(event.data);
            if (envelope.type === 'PACKET_STREAM') {
              queuePacket(envelope.data);
            } else if (envelope.type === 'TELEMETRY') {
              setTelemetry(envelope.data);
              if (envelope.data.activeMode !== undefined) {
                setActiveMode(envelope.data.activeMode);
              }
            } else if (envelope.type === 'VMM_SNAPSHOT') {
              setMemoryCells(envelope.data);
            } else if (envelope.type === 'ERROR') {
              setErrorLog(envelope.data.error || 'Unknown Kernel Fault');
            }
          } catch (e) {
            console.error('[RFC0103 WS] Parse error', e);
          }
        };

        socket.onerror = (err) => {
          if (!isMounted) return;
          console.warn('[RFC0103 WS] Socket error, utilizing HTTP stream fallback');
        };

        socket.onclose = () => {
          if (!isMounted) return;
          setIsConnected(false);
          reconnectTimer = setTimeout(connectWebSocket, 3000);
        };
      } catch (err) {
        console.warn('[RFC0103 WS] Init failed', err);
      }
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [queuePacket]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const clearPackets = useCallback(() => {
    setPackets([]);
    packetBufferRef.current = [];
  }, []);

  const refreshVmm = useCallback(async () => {
    try {
      const res = await fetch('/api/rfc0103/vmm');
      if (res.ok) {
        const json = await res.json();
        setMemoryCells(json.cells || []);
      }
    } catch (e) {
      console.error('VMM refresh failed', e);
    }
  }, []);

  const setExecutionMode = useCallback(async (mode: ExecutionMode) => {
    setActiveMode(mode);
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'SET_MODE', mode }));
      } else {
        await fetch('/api/rfc0103/mode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode }),
        });
      }
    } catch (e) {
      console.error('Set mode failed', e);
    }
  }, []);

  const sendPacket = useCallback(
    async (
      opcode: OpCode,
      payload: string,
      memorySlot: number = 0,
      mode?: ExecutionMode,
      tamperType: 'none' | 'bad_magic' | 'bad_crc' | 'bad_seq' = 'none',
    ) => {
      const targetMode = mode !== undefined ? mode : activeMode;
      let magic: string = LANE_CONSTANTS.MAGIC_HEADER_HEX;
      let packetId = (telemetry?.currentSequenceId || 57000) + 1;
      let crc = computeIEEE8023CRC32(payload);

      if (tamperType === 'bad_magic') {
        magic = '0xDEADBEEF0000';
      } else if (tamperType === 'bad_crc') {
        crc = 0x12345678;
      } else if (tamperType === 'bad_seq') {
        packetId = 1200; // Violates P_0 >= 57,000
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'SEND_PACKET',
            magic,
            packet_id: packetId,
            opcode,
            crc32: crc,
            payload,
            mode: targetMode,
            memory_slot: memorySlot,
          })
        );
      } else {
        // Fallback HTTP POST
        const res = await fetch('/api/rfc0103/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            opcode,
            payload,
            memorySlot,
            mode: targetMode,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.packet) {
            queuePacket(json.packet);
          }
        }
      }
    },
    [activeMode, telemetry, queuePacket]
  );

  return {
    isConnected,
    isPaused,
    packets,
    telemetry,
    memoryCells,
    activeMode,
    errorLog,
    togglePause,
    clearPackets,
    sendPacket,
    setExecutionMode,
    refreshVmm,
  };
}
