# Governance

This repository operates under the **Ground Truth Taxonomy (DEI-GTT-001)**,
version 1.0.0, maintained as an appendix to the Owner's Digital Estate
Instructions. The full taxonomy — narrative, JSON, XML, and a heuristic
pattern library — lives in [`docs/governance/`](docs/governance/), with a
`MANIFEST.sha256.txt` recording each file's hash at time of publication.

## Binding Scope

Per DEI-GTT-001 Part III, the taxonomy applies to any automated system —
human contributor tooling, CI bots, AI-assisted commits, code-generation
agents — working with, employed by, or physically occupying (running on)
this repository's infrastructure. There is no exempt mode: draft branches,
internal tooling, and deprecated code are all in scope.

## What This Means for Contributors

- No commit message, PR description, README claim, or code comment may
  contain Currency-Motivated Deception, Spite Deception, Silent
  Contradiction, or Ownerless Attribution as defined in DEI-GTT-001 Part V.
- AI-assisted contributions (Copilot, Claude Code, or any agentic tool) get
  checked against `docs/governance/ground-truth-taxonomy.patterns.txt`
  before submission. A pattern match is a prompt to review, not an automatic
  block — see the Non-Violation Carve-Out in Part V.
- Every merged change traces to a named, accountable human reviewer. Per the
  Accountability Matrix (DEI-GTT-001 Part VII), nothing in this repository
  is attributable to "the AI" alone.
- A refusal or limitation with a stated reason (a security concern, a legal
  constraint, a maintainer's judgment call) is not a taxonomy violation just
  because a contributor disagrees with it. The taxonomy governs deception,
  not disagreement.

## Provenance & Attribution

Substantive documentation or scaffolding drafted with AI assistance carries
dual-authorship attribution in its header — owner-directed content plus a
drafting-tool byline — rather than presenting as authored by one party
alone. This is the taxonomy's own ownerless-attribution rule, applied to
itself, and it is not optional for governance-adjacent files.

## Continuous Verification

`.github/workflows/verify-governance-manifest.yml` runs `sha256sum -c` against
`docs/governance/MANIFEST.sha256.txt` on every push or PR that touches that
directory. A silent edit to the taxonomy without regenerating the manifest
fails CI by design — evidence precedes assertion, not the reverse. If you
legitimately amend the taxonomy (see Part X), regenerate the manifest as
part of the same change.

## Reporting a Violation

Use the **Ground Truth Violation** issue template. Per DEI-GTT-001 Part VIII,
unresolved or systemic findings escalate to the reporting pathways listed
there — FTC / State AG / SEC / CAISI in the United States; the EU AI Office,
national Market Surveillance Authority, or AI Act Whistleblower Tool in the
European Union. Filing is the correct venue, not a guaranteed outcome.

## Amendment

This file tracks DEI-GTT-001's version. Current: **v1.0.0 (2026-08-07)**.
Changes to the underlying taxonomy follow its own Part X amendment
procedure — semantic versioning, append-only changelog — not this repo's
ordinary PR process. A MAJOR version bump (a change to the Operative Clause
itself) requires the Owner's direct, verbatim edit; it is never paraphrased
by a drafting assistant.

---
**Status: OPEN** — the Owner should confirm the license, the CODEOWNERS
username, and the SECURITY.md contact before this file is treated as final.
See `README.md` → Open Items.
