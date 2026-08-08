# Project_Name_Pending
*(working repo name — see Open Items below)*

Part of the Sovereign Utility Architecture ecosystem, under the
`Albert-lane-org` GitHub organization (Albert Lane Digital Infrastructure™).

## Governance

This repository operates under the **Ground Truth Taxonomy (DEI-GTT-001)**,
an appendix to the Owner's Digital Estate Instructions. Full text, JSON/XML
schema, and heuristic pattern library live in [`docs/governance/`](docs/governance/).
Repo-level rules derived from it are in [`GOVERNANCE.md`](GOVERNANCE.md).

Short version: no output in this repository — human or AI-assisted — obfuscates
truth to deceive, spites a user, or lies for revenue. Every change traces to a
named, accountable owner. See `GOVERNANCE.md` for what that means in practice.

## Structure

```
.
├── GOVERNANCE.md              # Repo-level rules derived from DEI-GTT-001
├── CONTRIBUTING.md            # How to contribute, including AI-assisted work
├── SECURITY.md                # Vulnerability reporting
├── LICENSE                    # Default: all rights reserved — see Open Items
├── CODEOWNERS                 # Placeholder — needs your GitHub username
├── docs/governance/           # The Ground Truth Taxonomy, all formats + hash manifest
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── ground_truth_violation.md
│   │   └── bug_report.md
│   └── workflows/
│       └── verify-governance-manifest.yml   # Fails CI if docs/governance/ drifts from its recorded hashes
└── src/                        # Empty — project code goes here
```

## Open Items
*(Recorded per Absence of Space convention — flagged, not silently decided.)*

- **Final project name.** "Albert Lane Silk Road" was mentioned as a working
  concept name in conversation — unconfirmed whether that's the intended
  title, a codename, or a metaphor for the build sequence (governance first,
  then infrastructure). Repo currently keeps the placeholder name.
- **License.** `LICENSE` defaults to "all rights reserved," the more
  restrictive option, because no license type was specified. Replace it if
  public read access is meant to carry reuse rights (MIT, Apache-2.0, etc.).
- **CODEOWNERS.** Contains a placeholder — swap in your actual GitHub
  username(s).
- **SECURITY.md contact.** Placeholder — add a real reporting address before
  this repo is fully public.
- **Repo visibility.** You mentioned it's still being switched to public —
  everything here was prepared without repo access, so nothing has been
  pushed or verified against the live repo yet.

## Provenance

Scaffolding and governance-adjacent docs in this repo were drafted by Claude
(Anthropic, Claude Sonnet 5) at Albert Lane's direction, 2026-08-08, pending
his review. Per `GOVERNANCE.md`, that attribution is not optional decoration —
it's the taxonomy's own ownerless-attribution rule applied to itself.
