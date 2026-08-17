/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * ============================================================================== */

export interface Env {
  PROVENANCE_KV: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { "Allow": "GET, HEAD" } });
    }

    const url = new URL(request.url);

    if (url.pathname === "/.well-known/provenance.jsonld" || url.pathname === "/.provenance.jsonld") {
      const provenanceData = await env.PROVENANCE_KV.get("provenance_jsonld");

      if (!provenanceData) {
        return new Response(JSON.stringify({ error: "Provenance document not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", "X-Content-Type-Options": "nosniff" }
        });
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(provenanceData);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const sha256Hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

      const headers = new Headers({
        "Content-Type": "application/ld+json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Cache-Control": "public, max-age=300, s-maxage=3600",
        "X-Provenance-SHA256": sha256Hex,
        "X-Content-Type-Options": "nosniff"
      });

      if (request.method === "HEAD") {
        return new Response(null, { status: 200, headers });
      }

      return new Response(provenanceData, { status: 200, headers });
    }

    return new Response("Not Found", { status: 404 });
  }
};
