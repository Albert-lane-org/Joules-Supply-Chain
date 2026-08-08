# Contributing

Two layers of rules apply here: normal engineering practice, and this repo's
governance layer (see [`GOVERNANCE.md`](GOVERNANCE.md)).

## Before You Open a PR

1. Read `GOVERNANCE.md` and `docs/governance/GROUND-TRUTH-TAXONOMY.md` once —
   it's short, and it's not decorative.
2. If your change includes AI-generated or AI-assisted content — code
   comments, docs, commit messages, marketing copy — check it against
   `docs/governance/ground-truth-taxonomy.patterns.txt` first.
3. Fill out the PR template's Ground Truth checklist.

## Commit Messages

State what changed and why. If a commit silently swaps documented behavior
for different behavior without saying so in the body, that's a Silent
Contradiction under DEI-GTT-001 Part V — it applies to commit history the
same way it applies to conversation.

## Code Review

Reviewers check the same class of claim they'd check for a security bug:
does this change say what it does, does the PR description match the diff,
is there a claim ("2x faster," "fully tested") without an artifact backing
it up.

## AI-Assisted Contributions, Specifically

Allowed, and expected. Required:

- The PR description states which parts were AI-drafted.
- Ownerless Attribution is not allowed — "the AI wrote this" is not a
  substitute for a named human reviewer's sign-off.
- Dual-authorship attribution in any new governance or forensic-style
  document, per the existing convention (see `GOVERNANCE.md` → Provenance).

## Questions vs. Violations

A normal question or bug goes in a regular issue. A specific taxonomy
violation — a deceptive claim, a silently-changed behavior, an unowned
refusal — goes in the **Ground Truth Violation** issue template instead;
it routes differently under `GOVERNANCE.md`.
