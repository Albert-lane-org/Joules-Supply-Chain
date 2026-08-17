# ==============================================================================
# PROVENANCE METADATA (.lvm / .lane v1.0)
# Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
# Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
# License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
# Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
# Authority: https://provenance.albertlane.net/.provenance.jsonld
# Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
# Framework Spec: SAFD-FRAMEWORK-SPEC-01 / RFC 0102 / SPEC-0100
# ==============================================================================

import asyncio
import ipaddress
import queue
import socket
import threading
import time
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import streamlit as st
import websockets

# Operational Parameters (RFC 0102 Technical Design Spec / SAFD-FRAMEWORK-SPEC-01)
MAX_PAYLOAD_LEN = 2000
MAX_QUEUE_SIZE = 100
MAX_BUFFER_LOGS = 15
DNS_TIMEOUT = 3.0
JOIN_TIMEOUT = 3.5

RESTRICTED_SUBNETS = [
    ipaddress.ip_network("10.0.0.0/8"),          # RFC 1918 Private
    ipaddress.ip_network("172.16.0.0/12"),       # RFC 1918 Private
    ipaddress.ip_network("192.168.0.0/16"),      # RFC 1918 Private
    ipaddress.ip_network("100.64.0.0/10"),       # Carrier-Grade NAT (RFC 6598)
    ipaddress.ip_network("169.254.0.0/16"),      # Link-Local IPv4 (RFC 3927)
    ipaddress.ip_network("fe80::/10"),           # Link-Local IPv6 (RFC 4291)
    ipaddress.ip_network("fc00::/7"),            # Unique Local IPv6 ULA (RFC 4193)
    ipaddress.ip_network("192.0.2.0/24"),        # TEST-NET-1 Documentation (RFC 5737)
    ipaddress.ip_network("198.51.100.0/24"),     # TEST-NET-2 Documentation (RFC 5737)
    ipaddress.ip_network("203.0.113.0/24"),      # TEST-NET-3 Documentation (RFC 5737)
    ipaddress.ip_network("2001:db8::/32"),       # Documentation IPv6 (RFC 3849)
    ipaddress.ip_network("0.0.0.0/8"),           # Self-Identification (RFC 1122)
    ipaddress.ip_network("255.255.255.255/32"),  # Limited Broadcast (RFC 8190)
    ipaddress.ip_network("127.0.0.0/8"),         # IPv4 Loopback
    ipaddress.ip_network("::1/128"),             # IPv6 Loopback
]


def extract_embedded_ipv4(ip: ipaddress.IPv4Address | ipaddress.IPv6Address) -> ipaddress.IPv4Address | ipaddress.IPv6Address:
    """Recursively unwraps subterranean IPv4 transition targets within IPv6 addresses."""
    if isinstance(ip, ipaddress.IPv4Address):
        return ip

    if ip.ipv4_mapped:
        return ip.ipv4_mapped

    if ip in ipaddress.IPv6Network("2002::/16"):
        return ipaddress.IPv4Address(ip.packed[2:6])

    if ip in ipaddress.IPv6Network("64:ff9b::/96"):
        return ipaddress.IPv4Address(ip.packed[12:16])

    if ip in ipaddress.IPv6Network("64:ff9b:1::/48"):
        b = ip.packed
        return ipaddress.IPv4Address(bytes([b[9], b[6], b[5], b[4]]))

    if ip in ipaddress.IPv6Network("2001::/32") or ip in ipaddress.IPv6Network("2001:0::/32"):
        raw_int = int.from_bytes(ip.packed[12:16], "big") ^ 0xFFFFFFFF
        return ipaddress.IPv4Address(raw_int)

    # ISATAP (RFC 5214): Interface ID with 0x5EFE marker in octets 8-9
    if len(ip.packed) >= 16 and (ip.packed[8:10] == b"\x00\x5e\xfe" or ip.packed[8:10] == b"\x02\x5e\xfe"):
        return ipaddress.IPv4Address(ip.packed[12:16])

    return ip


def is_ip_restricted(ip: ipaddress.IPv4Address | ipaddress.IPv6Address) -> bool:
    """Evaluates address boundary compliance against standard and explicit subnet blocklists."""
    unwrapped_ip = extract_embedded_ipv4(ip)
    if (
        unwrapped_ip.is_loopback
        or unwrapped_ip.is_private
        or unwrapped_ip.is_link_local
        or unwrapped_ip.is_multicast
        or unwrapped_ip.is_reserved
        or unwrapped_ip.is_unspecified
    ):
        return True
    return any(unwrapped_ip in net for net in RESTRICTED_SUBNETS)


def resolve_host_ip_sync(hostname: str, port: int) -> str:
    """Executes DNS resolution inside an isolated thread pool enforcing strict DNS_TIMEOUT."""
    def _resolve() -> str:
        infos = socket.getaddrinfo(hostname, port, socket.AF_UNSPEC, socket.SOCK_STREAM)
        for family, _, _, _, sockaddr in infos:
            ip_str = sockaddr[0]
            ip_obj = ipaddress.ip_address(ip_str)
            if not is_ip_restricted(ip_obj):
                return ip_str
        raise ValueError("All DNS-resolved target IP addresses fell within restricted subnetwork boundaries.")

    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(_resolve)
        return future.result(timeout=DNS_TIMEOUT)


def is_safe_endpoint(url: str) -> tuple[bool, str, str | None, dict | None]:
    """Ingress validation engine preventing SSRF, DNS Rebinding, and control injection."""
    if any(char in url for char in ("\r", "\n", "\0", "\t")):
        return False, "Validation Error: Control characters detected in target URL.", None, None

    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ("ws", "wss"):
        return False, f"Validation Error: Scheme '{parsed.scheme}' disallowed. Must be 'ws' or 'wss'.", None, None

    if parsed.username or parsed.password:
        return False, "Validation Error: Embedded userinfo credentials strictly prohibited.", None, None

    hostname = parsed.hostname
    if not hostname:
        return False, "Validation Error: Hostname absent from target URI.", None, None

    port = parsed.port or (443 if parsed.scheme == "wss" else 80)

    try:
        ip_obj = ipaddress.ip_address(hostname)
        if is_ip_restricted(ip_obj):
            return False, f"Security Violation: Target IP {hostname} is restricted.", None, None
        resolved_ip = hostname
    except ValueError:
        try:
            resolved_ip = resolve_host_ip_sync(hostname, port)
        except TimeoutError:
            return False, f"Timeout Error: DNS resolution exceeded bound of {DNS_TIMEOUT}s.", None, None
        except Exception as err:
            return False, f"Resolution Error: {err}", None, None

    is_ipv6 = ":" in resolved_ip
    ip_literal = f"[{resolved_ip}]" if is_ipv6 else resolved_ip
    path_and_query = parsed.path if parsed.path else "/"
    if parsed.query:
        path_and_query += f"?{parsed.query}"

    pinned_url = f"{parsed.scheme}://{ip_literal}:{port}{path_and_query}"
    metadata = {
        "original_host": hostname,
        "pinned_ip": resolved_ip,
        "port": port,
        "headers": {"Host": f"{hostname}:{port}" if parsed.port else hostname},
        "is_ssl": parsed.scheme == "wss",
        "provenance_magic": "0x3F8F9A1B2C3D",
        "rfc_standard": "RFC 0102 / RFC 0103",
        "framework_spec": "SAFD-FRAMEWORK-SPEC-01",
    }
    return True, "Ingress security validation passed.", pinned_url, metadata


def run_ws_engine(
    pinned_url: str,
    metadata: dict,
    msg_queue: queue.Queue,
    send_queue: queue.Queue,
    stop_event: threading.Event,
):
    """Worker thread hosting full-duplex WebSocket stream (Ingress & Broadcast Egress)."""
    async def ws_loop():
        headers = metadata["headers"]
        server_hostname = metadata["original_host"] if metadata["is_ssl"] else None
        try:
            async with websockets.connect(
                pinned_url,
                extra_headers=headers,
                server_hostname=server_hostname,
                max_size=MAX_PAYLOAD_LEN,
                close_timeout=1.0,
            ) as ws:
                async def recv_task():
                    while not stop_event.is_set():
                        try:
                            message = await asyncio.wait_for(ws.recv(), timeout=0.5)
                            if len(message) > MAX_PAYLOAD_LEN:
                                message = message[:MAX_PAYLOAD_LEN]
                            try:
                                msg_queue.put_nowait(f"INBOUND [{time.strftime('%H:%M:%S')}]: {message}")
                            except queue.Full:
                                pass
                        except asyncio.TimeoutError:
                            continue
                        except Exception as e:
                            msg_queue.put_nowait(f"INGRESS ERROR: {e}")
                            break

                async def send_task():
                    while not stop_event.is_set():
                        try:
                            payload = send_queue.get_nowait()
                            await ws.send(payload)
                            msg_queue.put_nowait(f"OUTBOUND BROADCAST [{time.strftime('%H:%M:%S')}]: {payload}")
                        except queue.Empty:
                            await asyncio.sleep(0.1)
                        except Exception as e:
                            msg_queue.put_nowait(f"EGRESS ERROR: {e}")
                            break

                await asyncio.gather(recv_task(), send_task(), return_exceptions=True)
        except Exception as err:
            try:
                msg_queue.put_nowait(f"STREAM TERMINATED: {err}")
            except queue.Full:
                pass

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(ws_loop())
    finally:
        loop.close()


def disconnect_stream():
    """Tears down active threads and unblocks session state."""
    if st.session_state.get("ws_stop_event"):
        st.session_state.ws_stop_event.set()
    if st.session_state.get("ws_thread"):
        st.session_state.ws_thread.join(timeout=JOIN_TIMEOUT)
    st.session_state.ws_thread = None
    st.session_state.ws_stop_event = None
    st.session_state.ws_queue = None
    st.session_state.ws_send_queue = None


# Streamlit UI Rendering Layer
st.set_page_config(page_title="RFC 0102 Broadcast Engine", layout="wide")
st.title("RFC 0102: Full-Duplex Broadcast Engine (SAFD-FRAMEWORK-SPEC-01)")
st.caption("RFC 0103 Sovereign Provenance Header: 0x3F8F9A1B2C3D | Rights Holder: Albert Dale Lane (EIN: 41-3119079)")

target_uri = st.text_input("WebSocket Endpoint", value="wss://echo.websocket.org")
col1, col2 = st.columns(2)

with col1:
    if st.button("Connect Stream"):
        disconnect_stream()
        is_valid, reason, pinned_url, metadata = is_safe_endpoint(target_uri)
        if not is_valid:
            st.error(reason)
        else:
            st.success(f"Verified & Pinned: {metadata['pinned_ip']}")
            st.session_state.ws_queue = queue.Queue(maxsize=MAX_QUEUE_SIZE)
            st.session_state.ws_send_queue = queue.Queue(maxsize=MAX_QUEUE_SIZE)
            st.session_state.ws_stop_event = threading.Event()
            st.session_state.ws_logs = []

            worker_thread = threading.Thread(
                target=run_ws_engine,
                args=(
                    pinned_url,
                    metadata,
                    st.session_state.ws_queue,
                    st.session_state.ws_send_queue,
                    st.session_state.ws_stop_event,
                ),
                daemon=True,
            )
            st.session_state.ws_thread = worker_thread
            worker_thread.start()

with col2:
    if st.button("Disconnect Stream"):
        disconnect_stream()
        st.warning("Disconnected.")

st.divider()

# Broadcast Input Controller
if st.session_state.get("ws_send_queue") is not None:
    with st.form("broadcast_form", clear_on_submit=True):
        broadcast_msg = st.text_input("Broadcast Message Payload")
        submitted = st.form_submit_button("Broadcast Payload")
        if submitted and broadcast_msg:
            if len(broadcast_msg) > MAX_PAYLOAD_LEN:
                st.error(f"Payload exceeds limit of {MAX_PAYLOAD_LEN} characters.")
            else:
                try:
                    st.session_state.ws_send_queue.put_nowait(broadcast_msg)
                    st.toast("Payload queued for broadcast.")
                except queue.Full:
                    st.error("Egress queue full. Backpressure engaged.")


@st.fragment(run_every="1s")
def render_ws_stream():
    """Streamlit fragment polling inbound/outbound queues without triggering full script reruns."""
    if st.session_state.get("ws_queue") is None:
        st.info("Status: Disconnected")
        return

    msg_queue = st.session_state.ws_queue
    if "ws_logs" not in st.session_state:
        st.session_state.ws_logs = []

    while not msg_queue.empty():
        try:
            msg = msg_queue.get_nowait()
            st.session_state.ws_logs.append(msg)
        except queue.Empty:
            break

    st.session_state.ws_logs = st.session_state.ws_logs[-MAX_BUFFER_LOGS:]
    st.caption("Real-Time Full-Duplex Stream Log (Max 15 entries ring-buffer)")
    for item in st.session_state.ws_logs:
        st.code(item, language="text")


render_ws_stream()
