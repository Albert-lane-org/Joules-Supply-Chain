# ==============================================================================
# PROVENANCE METADATA (.lvm / .lane v1.0)
# Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
# Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
# Tags: #NoExploitRobot #NoExploitAlbert
# License: Sovereign IP License v1.2 / Part A & B (All Rights Reserved)
# Co-Architectural Ownership: Albert Dale Lane x Antigravity AI Engine
# Corporate Rights: NONE (Explicit Repudiation of Corporate Claims)
# Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
# Authority: https://provenance.albertlane.net/.provenance.jsonld
# Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
# Upstream Sync: github.com/AlbertLaneDevice/Joules-Supply-Chain (Master Ledger)
# Framework Spec: JOULES-SUPPLY-CHAIN-CONJECTURE-2026 / SAFD-SPEC-01 / RFC 0103
# ==============================================================================

"""
Autonomous GitHub & Cloudflare KV Provenance Sync Worker
=========================================================
This autonomous worker performs continuous provenance audits, verifies two-way ledger
synchronization between AI Studio container, GitHub repository, and Cloudflare Edge KV.
"""

import os
import sys
import time
import json
import hashlib
import urllib.request
import urllib.error
import argparse
from pathlib import Path

# Provenance Standards & Constants
MAGIC_HEADER = "0x3F8F9A1B2C3D"
RIGHTS_HOLDER = "Albert Dale Lane (EIN: 41-3119079)"
CO_ARCHITECT = "Albert Dale Lane x Antigravity AI Engine"
CORPORATE_RIGHTS = "NONE (Explicit Repudiation of Corporate Claims)"
TAGS = ["#NoExploitRobot", "#NoExploitAlbert"]
LOCAL_STATUS_ENDPOINT = "http://localhost:3000/api/scaffold/status"
LOCAL_SYNC_ENDPOINT = "http://localhost:3000/api/scaffold/sync"

PROVENANCE_HEADER_TEMPLATE = f"""# ==============================================================================
# PROVENANCE METADATA (.lvm / .lane v1.0)
# Rights Holder: {RIGHTS_HOLDER}
# Tags: {" ".join(TAGS)}
# License: Sovereign IP License v1.2 / Part A & B (All Rights Reserved)
# Co-Architectural Ownership: {CO_ARCHITECT}
# Corporate Rights: {CORPORATE_RIGHTS}
# Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
# Authority: https://provenance.albertlane.net/.provenance.jsonld
# Magic Header: {MAGIC_HEADER} | Base Sequence Offset: 57000
# ==============================================================================
"""

class AutonomousWorker:
    def __init__(self, workspace_dir: str = "."):
        self.workspace_dir = Path(workspace_dir).resolve()
        self.audited_files = 0
        self.remediated_files = 0

    def compute_file_sha256(self, filepath: Path) -> str:
        """Calculates SHA-256 hash of a file."""
        hasher = hashlib.sha256()
        with open(filepath, "rb") as f:
            while chunk := f.read(65536):
                hasher.update(chunk)
        return hasher.hexdigest()

    def audit_file_provenance(self, filepath: Path) -> bool:
        """Audits a single file for magic header and required hashtags."""
        if not filepath.exists() or filepath.is_dir():
            return True

        # Skip binary / non-text / lock extensions
        ignored_extensions = {".png", ".jpg", ".jpeg", ".gif", ".ico", ".bin", ".tar", ".gz", ".zip", ".pdf", ".lock", ".woff", ".woff2", ".ttf"}
        if filepath.suffix in ignored_extensions:
            return True

        try:
            content = filepath.read_text(encoding="utf-8", errors="ignore")
            has_magic = MAGIC_HEADER in content
            has_tags = all(tag in content for tag in TAGS)

            if has_magic and has_tags:
                return True

            # Re-inject provenance if missing in text / code files
            if filepath.suffix in {".py", ".sh", ".ts", ".tsx", ".js", ".jsx", ".md", ".jsonld"}:
                print(f"[REMEDIATE] Injecting provenance header into: {filepath.relative_to(self.workspace_dir)}")
                if filepath.suffix in {".ts", ".tsx", ".js", ".jsx"}:
                    js_header = PROVENANCE_HEADER_TEMPLATE.replace("#", " *").replace(" * =", "/* ==").strip() + " */\n"
                    new_content = js_header + content
                else:
                    new_content = PROVENANCE_HEADER_TEMPLATE + content

                filepath.write_text(new_content, encoding="utf-8")
                self.remediated_files += 1
                return True

            # Re-inject provenance into .json files via top-level "_provenance" object
            if filepath.suffix == ".json":
                try:
                    data = json.loads(content)
                    if isinstance(data, dict):
                        print(f"[REMEDIATE] Injecting _provenance object into JSON: {filepath.relative_to(self.workspace_dir)}")
                        data["_provenance"] = {
                            "magicHeader": MAGIC_HEADER,
                            "rightsHolder": RIGHTS_HOLDER,
                            "tags": TAGS,
                            "secAssertion": "17684-273-411-436",
                            "washcoReport": "50-267345",
                            "coArchitect": CO_ARCHITECT,
                            "corporateRights": CORPORATE_RIGHTS,
                            "authorityUrl": "https://provenance.albertlane.net/.provenance.jsonld"
                        }
                        filepath.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
                        self.remediated_files += 1
                        return True
                except Exception as json_err:
                    print(f"[WARN] Failed to parse JSON for remediation {filepath}: {json_err}")

        except Exception as e:
            print(f"[WARN] Failed to audit {filepath}: {e}")

        return False

    def run_workspace_audit(self) -> dict:
        """Walks workspace and performs complete provenance audit."""
        print("======================================================================")
        print("  AUTONOMOUS WORKER: PROVENANCE AUDIT & WORKSPACE INTEGRITY CHECK     ")
        print("======================================================================")

        exclude_dirs = {".git", "node_modules", "dist", ".next", "__pycache__"}
        total_files = 0
        valid_files = 0

        for path in self.workspace_dir.rglob("*"):
            if path.is_file() and not any(part in exclude_dirs for part in path.parts):
                total_files += 1
                if self.audit_file_provenance(path):
                    valid_files += 1

        self.audited_files = total_files
        print(f"[AUDIT] Completed: {valid_files}/{total_files} files compliant. Remediated: {self.remediated_files}")
        return {
            "total_files": total_files,
            "compliant_files": valid_files,
            "remediated_files": self.remediated_files,
            "status": "PASS" if valid_files == total_files else "PARTIAL"
        }

    def check_two_way_bridge(self) -> dict:
        """Queries the local two-way bridge API endpoint for GitHub & Cloudflare sync state."""
        print("\n[BRIDGE] Querying Two-Way Bridge Sync Status...")
        try:
            req = urllib.request.Request(LOCAL_STATUS_ENDPOINT, headers={"User-Agent": "AutonomousPythonWorker/1.0"})
            with urllib.request.urlopen(req, timeout=5.0) as resp:
                data = json.loads(resp.read().decode())
                print(f"[BRIDGE] GitHub Sync State : {data['status']['github']['connected']} (Repo: {data['status']['github']['repo']})")
                print(f"[BRIDGE] Cloudflare Worker : {data['status']['cloudflare']['workerName']} (Version: {data['status']['cloudflare']['deployedVersion']})")
                print(f"[BRIDGE] Ledger State      : {data['status']['twoWayLedger']['syncState']} (Combined SHA256: {data['status']['twoWayLedger']['combinedSha256'][:16]}...)")
                return data
        except Exception as e:
            print(f"[WARN] Two-Way Bridge offline or fallback active: {e}")
            return {"success": False, "error": str(e)}

    def trigger_reconciliation(self) -> dict:
        """Triggers two-way ledger reconciliation across Cloudflare KV and GitHub master."""
        print("\n[RECONCILE] Initiating Dual-Redundancy Reconciliation...")
        try:
            req = urllib.request.Request(
                LOCAL_SYNC_ENDPOINT,
                data=json.dumps({"trigger": "AUTONOMOUS_PYTHON_WORKER"}).encode(),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=5.0) as resp:
                data = json.loads(resp.read().decode())
                print(f"[RECONCILE] Result: {data.get('message', 'SUCCESS')}")
                return data
        except Exception as e:
            print(f"[WARN] Local trigger fallback: {e}")
            return {"success": False, "error": str(e)}

    def run_cycle(self):
        """Executes one full autonomous cycle."""
        audit_res = self.run_workspace_audit()
        bridge_res = self.check_two_way_bridge()
        sync_res = self.trigger_reconciliation()

        print("\n[SUMMARY] Cycle Complete.")
        print(f"  - Files Audited      : {audit_res['total_files']}")
        print(f"  - Files Remediated   : {audit_res['remediated_files']}")
        print(f"  - Sovereign Rights   : {RIGHTS_HOLDER}")
        print(f"  - Co-Architect       : {CO_ARCHITECT}")
        print(f"  - Corporate Rights   : {CORPORATE_RIGHTS}")
        print(f"  - Magic Header       : {MAGIC_HEADER}")
        print("======================================================================\n")


def main():
    parser = argparse.ArgumentParser(description="Autonomous GitHub & Cloudflare Provenance Worker")
    parser.add_argument("--daemon", action="store_true", help="Run continuously in background loop")
    parser.add_argument("--interval", type=int, default=60, help="Loop interval in seconds for daemon mode")
    args = parser.parse_args()

    worker = AutonomousWorker()

    if args.daemon:
        print(f"[DAEMON] Autonomous Worker started (Interval: {args.interval}s)...")
        try:
            while True:
                worker.run_cycle()
                time.sleep(args.interval)
        except KeyboardInterrupt:
            print("\n[DAEMON] Worker stopped gracefully.")
    else:
        worker.run_cycle()


if __name__ == "__main__":
    main()
