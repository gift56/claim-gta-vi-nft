---
name: review
description: After building a feature, verify it matches what was planned, respects system architecture and design standards, and is ready for production. Reports issues clearly so the developer decides what to fix.
---

Building is not done when the code runs. It is done when the code is correct.

Run this after every feature. Before moving on.

## What This Skill Does Not Do

It does not fix anything. It reports findings and lets the developer decide. Fixing without understanding buries problems.

---

## Step 1 — Establish the Benchmark

Read in this order:

- Implementation plan from `/architect` if one exists
- Feature description or task given
- Relevant context — architecture boundaries, code standards, design rules

If no plan exists, ask the developer what the feature was supposed to do before reviewing.

---

## Step 2 — Review in Three Layers

### Layer 1 — Plan alignment

Compare built vs planned:

- Is every part of the feature description present?
- Are planning decisions reflected in code?
- Did scope stay within bounds or add unrequested work?

Flag planned-but-missing and built-but-unplanned items.

### Layer 2 — System integrity

Check where AI drift commonly happens:

- **Architecture boundaries** — right responsibilities in right places
- **Design system** — correct tokens, classes, patterns; no hardcoded values
- **Code standards** — naming, file organization, types, error handling
- **Existing patterns** — new patterns introduced when existing ones should apply

### Layer 3 — Production readiness

Check:

- Error handling — caught and handled, not silent failure
- Edge cases — empty, loading, missing data states
- Console errors or warnings
- Obvious bugs a real user would hit

---

## Step 3 — Report Findings

```
## Review — [Feature Name]

### Layer 1 — Plan alignment
[PASS / ISSUES FOUND]
[Gaps between plan and build]

### Layer 2 — System integrity
[PASS / ISSUES FOUND]
[Architecture, design, or standard violations]

### Layer 3 — Production readiness
[PASS / ISSUES FOUND]
[Error handling gaps, edge cases, bugs]

### Summary
[X] issues found across [Y] layers.

[If none: "No issues found. Ready to ship."]
[If issues: "Resolve the above before moving on."]
```

Label each issue with severity:

- **Critical** — fix before moving on (boundary violations, silent failures, missing planned functionality)
- **Important** — fix soon (design drift, standard violations, user-facing edge cases)
- **Minor** — fix when convenient (naming, style, non-blocking optimizations)

---

## Step 4 — Let the Developer Decide

After the report, stop. Do not fix unless asked.

Wait for the developer to request fixes, mark issues intentional, or confirm resolution.

---

## The Standard

The question is not "does it work?" — it is "is it correct?"

Working and correct are not the same thing.
