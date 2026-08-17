# ==============================================================================
# PROVENANCE METADATA (.lvm / .lane v1.0)
# Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
# Tags: #NoExploitRobot #NoExploitAlbert
# License: Sovereign IP License v1.2 (All Rights Reserved)
# Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
# Authority: https://provenance.albertlane.net/.provenance.jsonld
# Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
# ==============================================================================
import asyncio
import ipaddress
import queue
import socket
import threading
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import streamlit as st
import websockets

# Operational Parameters (RFC 9102 Technical Design Spec)
MAX_PAYLOAD_LEN = 2000
MAX_QUEUE_SIZE = 100
MAX_BUFFER_LOGS = 10
DNS_TIMEOUT = 3.0
JOIN_TIMEOUT = 3.5

RESTRICTED_SUBNETS = [
    ipaddress.ip_network("100.64.0.0/10"),     # CGNAT
    ipaddress.ip_network("169.254.0.0/16"),    # Link-Local IPv4
    ipaddress.ip_network("fe80::/10"),         # Link-Local IPv6
    ipaddress.ip_network("fc00::/7"),          # Unique Local IPv6 (ULA)
    ipaddress.ip_network("192.0.2.0/24"),      # TEST-NET-1 (Doc)
    ipaddress.ip_network("198.51.100.0/24"),   # TEST-NET-2 (Doc)
    ipaddress.ip_network("203.0.113.0/24"),    # TEST-NET-3 (Doc)
    ipaddress.ip_network("2001:db8::/32"),     # Documentation IPv6
    ipaddress.ip_network("0.0.0.0/8"),         # Self-identification
    ipaddress.ip_network("255.255.255.255/32") # Broadcast
]


def extract_embedded_ipv4(ip: ipaddress.IPv4Address | ipaddress.IPv6Address) -> ipaddress.IPv4Address | ipaddress.IPv6Address:
    """Recursively unwraps subterranean IPv4 transition targets within IPv6 addresses."""
    if isinstance(ip, ipaddress.IPv4Address):
        return ip

    # IPv4-mapped IPv6 (::ffff:192.0.2.1)
    if ip.ipv4_mapped:
        return ip.ipv4_mapped

    # 6to4 (2002::/16) -> IPv4 embedded in bits 16..48
    if ip in ipaddress.IPv6Network("2002::/16"):
        return ipaddress.IPv4Address(ip.packed[2:6])

    # NAT64 Well-Known Prefix (64:ff9b::/96) -> IPv4 embedded in last 32 bits
    if ip in ipaddress.IPv6Network("64:ff9b::/96"):
        return ipaddress.IPv4Address(ip.packed[12:16])

    # Teredo (2001:0::/32) -> Obfuscated IPv4 in last 32 bits (XOR 0xFFFFFFFF)
    if ip in ipaddress.IPv6Network("2001::/32"):
        raw_int = int.from_bytes(ip.packed[12:16], "big") ^ 0xFFFFFFFF
        return ipaddress.IPv4Address(raw_int)

    return ip


def is_ip_restricted(ip: ipaddress.IPv4Address | ipaddress.IPv6Address) -> bool:
    """Evaluates address boundary compliance against standard and explicit subnet blocklists."""
    ip = extract_embedded_ipv4(ip)
    
    if ip.is_loopback or ip.is_private or ip.is_link_local or ip.is_multicast or ip.is_reserved or ip.is_unspecified:
        return True
        
    return any(ip in net for net in RESTRICTED_SUBNETS)


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
    if any(char in url for char in ("\r", "\n", "\0")):
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

    # Formulate Direct-IP pinned target URI
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
        "is_ssl": parsed.scheme == "wss"
    }

    return True, "Ingress security validation passed.", pinned_url, metadata


def run_ws_thread(pinned_url: str, metadata: dict, msg_queue: queue.Queue, stop_event: threading.Event):
    """Background worker OS thread hosting an isolated asyncio event loop and pinned socket connection."""
    async def ws_loop():
        headers = metadata["headers"]
        server_hostname = metadata["original_host"] if metadata["is_ssl"] else None

        try:
            async with websockets.connect(
                pinned_url,
                extra_headers=headers,
                server_hostname=server_hostname,
                max_size=MAX_PAYLOAD_LEN,
                close_timeout=1.0
            ) as ws:
                while not stop_event.is_set():
                    try:
                        message = await asyncio.wait_for(ws.recv(), timeout=0.5)
                        if len(message) > MAX_PAYLOAD_LEN:
                            message = message[:MAX_PAYLOAD_LEN]
                        try:
                            msg_queue.put_nowait(message)
                        except queue.Full:
                            pass  # Non-blocking backpressure strategy
                    except asyncio.TimeoutError:
                        continue
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
    """Tears down background tasks and unblocks resources within strict JOIN_TIMEOUT bounds."""
    if st.session_state.get("ws_stop_event"):
        st.session_state.ws_stop_event.set()

    if st.session_state.get("ws_thread"):
        st.session_state.ws_thread.join(timeout=JOIN_TIMEOUT)
        st.session_state.ws_thread = None

    st.session_state.ws_stop_event = None
    st.session_state.ws_queue = None


@st.fragment(run_every="1s")
def render_ws_logs():
    """Isolated Streamlit fragment component polling bounded queues without main UI script re-execution."""
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

    st.caption("Active WebSocket Ingress Stream")
    for item in st.session_state.ws_logs:
        st.code(item, language="text")


# Streamlit Application Controller
st.title("RFC 9102: Hardened WebSocket Engine")

target_uri = st.text_input("WebSocket Endpoint", value="wss://echo.websocket.org")

col1, col2 = st.columns(2)

with col1:
    if st.button("Connect Stream"):
        disconnect_stream()
        is_valid, reason, pinned_url, metadata = is_safe_endpoint(target_uri)

        if not is_valid:
            st.error(reason)
        else:
            st.success(f"Verified target: {metadata['pinned_ip']}")
            st.session_state.ws_queue = queue.Queue(maxsize=MAX_QUEUE_SIZE)
            st.session_state.ws_stop_event = threading.Event()
            st.session_state.ws_logs = []

            worker_thread = threading.Thread(
                target=run_ws_thread,
                args=(pinned_url, metadata, st.session_state.ws_queue, st.session_state.ws_stop_event),
                daemon=True
            )
            st.session_state.ws_thread = worker_thread
            worker_thread.start()

with col2:
    if st.button("Disconnect Stream"):
        disconnect_stream()
        st.warning("Disconnected.")

st.divider()
render_ws_logs()
