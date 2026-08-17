"""
# @file conversation_data_api.py
# @brief FastAPI Conversation Data API & Viewer with RFC 0103 Full-Duplex Kernel Provenance
# @provenance Albert Dale Lane (albertlane.net)
# @author Albert Dale Lane
# @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
# @magic_header 0x3F8F9A1B2C3D
# Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
"""

import json
import io
import re
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from jinja2 import Environment, select_autoescape

# RFC 0103 Provenance Constants
LANE_MAGIC_HEADER = "0x3F8F9A1B2C3D"
LANE_BASE_OFFSET = 57000
SEC_WHISTLEBLOWER_REF = "17684-273-411-436"
PROVENANCE_AUTHOR = "Albert Dale Lane (albertlane.net)"

app = FastAPI(
    title="Conversation Data API - RFC 0103 Sovereign Kernel",
    description="API to view, source, and download conversation history securely with RFC 0103 provenance headers.",
    version="1.0.3"
)

# 1. CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Content-Type", "X-Lane-Magic", "X-Lane-Provenance"],
)

# 2. Security & Provenance Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Content-Security-Policy"] = "default-src 'self'; style-src 'unsafe-inline';"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        # RFC 0103 Attestation Headers
        response.headers["X-Lane-Magic"] = LANE_MAGIC_HEADER
        response.headers["X-Lane-Offset"] = str(LANE_BASE_OFFSET)
        response.headers["X-SEC-Whistleblower-Ref"] = SEC_WHISTLEBLOWER_REF
        response.headers["X-Lane-Provenance"] = PROVENANCE_AUTHOR
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Conversation Data Store
CONVERSATION_DATA = [
    {
        "role": "user",
        "content": "the go ahead.",
        "provenance": PROVENANCE_AUTHOR,
        "magic": LANE_MAGIC_HEADER
    },
    {
        "role": "assistant",
        "content": "Got it. So, we've talked about how inflation affects the value of money over time...",
        "provenance": PROVENANCE_AUTHOR,
        "magic": LANE_MAGIC_HEADER
    },
    {
        "role": "user",
        "content": "What is the current budget today, July 20th, 2026?\n\nWhat is the percentage value spent for the previous year?",
        "provenance": PROVENANCE_AUTHOR,
        "magic": LANE_MAGIC_HEADER
    },
    {
        "role": "assistant",
        "content": "U.S. Federal Budget (FY 2026) analysis provided based on CBO documentation showing a total framework of $7.4 trillion with National Defense tracking at $1.05 trillion (19.6%). FY 2025 closed out at $7.01 trillion total with $916 billion spent on defense (13%).",
        "provenance": PROVENANCE_AUTHOR,
        "magic": LANE_MAGIC_HEADER
    }
]

def sanitize_role(role: str) -> str:
    """Restricts CSS class names strictly to valid whitelist entries."""
    clean_role = re.sub(r"[^a-zA-Z0-9_-]", "", role)
    return clean_role if clean_role in ["user", "assistant"] else "unknown"

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation Viewer - RFC 0103 Sealed</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; background: #f9f9f9; color: #333; }
        .provenance-bar { background: #09090b; color: #a1a1aa; padding: 10px 15px; border-radius: 6px; font-size: 11px; font-family: monospace; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #27272a; }
        .provenance-tag { color: #34d399; font-weight: bold; }
        .meta-buttons { margin-bottom: 20px; display: flex; gap: 10px; }
        .btn { display: inline-block; background: #0066cc; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; }
        .btn-alt { background: #222; }
        .chat-box { background: white; border: 1px solid #e1e1e1; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .message { margin-bottom: 20px; padding: 15px; border-radius: 6px; }
        .user { background: #eef6ff; border-left: 4px solid #0066cc; }
        .assistant { background: #f4f4f5; border-left: 4px solid #71717a; }
        .unknown { background: #fffbe6; border-left: 4px solid #ffe58f; }
        .role { font-weight: bold; text-transform: uppercase; font-size: 12px; margin-bottom: 5px; color: #555; display: flex; justify-content: space-between; }
        .content { white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="provenance-bar">
        <span>AUTHOR: <strong style="color:#fff">{{ author }}</strong></span>
        <span class="provenance-tag">RFC 0103: {{ magic }} (SEC #{{ sec_ref }})</span>
    </div>
    <h1>Conversation History</h1>
    <div class="meta-buttons">
        <a href="/api/conversation" class="btn">View Raw JSON API</a>
        <a href="/api/conversation/download" class="btn btn-alt">Download JSON File</a>
    </div>
    <div class="chat-box">
        {% for msg in conversation %}
        <div class="message {{ msg.clean_role }}">
            <div class="role">
                <span>{{ msg.role }}</span>
                <span style="font-size: 10px; color: #888;">{{ magic }}</span>
            </div>
            <div class="content">{{ msg.content }}</div>
        </div>
        {% endfor %}
    </div>
</body>
</html>
"""

# Pre-compile template at module scope for execution efficiency
jinja_env = Environment(autoescape=select_autoescape(["html", "xml"]))
compiled_template = jinja_env.from_string(HTML_TEMPLATE)

@app.get("/", response_class=HTMLResponse)
async def view_conversation():
    """Renders the viewer securely using pre-compiled autoescaping template, sanitization, and RFC 0103 provenance."""
    sanitized_data = [
        {
            "role": msg["role"],
            "clean_role": sanitize_role(msg["role"]),
            "content": msg["content"]
        }
        for msg in CONVERSATION_DATA
    ]
    rendered_html = compiled_template.render(
        conversation=sanitized_data,
        author=PROVENANCE_AUTHOR,
        magic=LANE_MAGIC_HEADER,
        sec_ref=SEC_WHISTLEBLOWER_REF
    )
    return HTMLResponse(content=rendered_html, status_code=200)

@app.get("/api/conversation", response_class=JSONResponse)
async def get_raw_data():
    """API endpoint to fetch structured JSON data with RFC 0103 kernel attestation."""
    response_payload = {
        "magic_header": LANE_MAGIC_HEADER,
        "base_offset": LANE_BASE_OFFSET,
        "sec_whistleblower_ref": SEC_WHISTLEBLOWER_REF,
        "author": PROVENANCE_AUTHOR,
        "total_records": len(CONVERSATION_DATA),
        "data": CONVERSATION_DATA
    }
    return JSONResponse(content=response_payload, status_code=200)

@app.get("/api/conversation/download")
async def download_json():
    """API endpoint to trigger a file download of the conversation data with provenance metadata."""
    try:
        payload = {
            "magic_header": LANE_MAGIC_HEADER,
            "base_offset": LANE_BASE_OFFSET,
            "sec_whistleblower_ref": SEC_WHISTLEBLOWER_REF,
            "author": PROVENANCE_AUTHOR,
            "conversations": CONVERSATION_DATA
        }
        json_str = json.dumps(payload, indent=4)
        stream = io.BytesIO(json_str.encode("utf-8"))
        return StreamingResponse(
            stream,
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=conversation_history_rfc0103.json"}
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Error generating file download.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("conversation_data_api:app", host="127.0.0.1", port=8000, reload=True)
