---
name: remember
description: Save what matters at the end of a session so the next session picks up exactly where you left off. Or restore context at the start of a new session so nothing is lost between them.
---

AI has no memory between sessions. Every new session starts blank. This skill fixes that.

Run at end of session to save. Run at start to restore.

## Security Boundary

Never persist secrets in `memory.md`. Omit or redact:

- API keys, tokens, passwords, private keys, certificates
- Cookies, auth headers, connection strings, webhook secrets
- Any credential-like value

Use placeholders like `[REDACTED_API_KEY]` when context is useful but sensitive.

## How to Invoke

**Save at end of session:** `/remember save`

**Restore at start:** `/remember restore`

If the developer runs `/remember` without specifying — ask which mode they need.

---

## Save Mode

Review the conversation and extract only what a skilled developer needs to continue in a fresh context. Not a transcript. The essential state.

**Capture:**

- **What was built** — specific files, features completed (be precise)
- **Decisions made** — architectural choices future work depends on
- **Problems solved** — issues resolved so they are not solved twice
- **Current state** — what works, what is partial, what is broken
- **What comes next** — the very next actionable step
- **Open questions** — anything unresolved

**Do not capture:**

- Details visible in the code
- Decisions already in context files
- Process narrative — only outcomes and decisions
- Secrets or credential-like values

### Safety check

Before writing, verify no sensitive values are present. Redact anything found.

### Where to save

Write to `memory.md` in the project root.

If `memory.md` already exists, summarize existing content and ask before overwriting:

```
memory.md already exists from a previous session.
Current memory covers: [one-line summary].

Overwrite with this session's memory? (yes / no)
```

If **no** — do not write. Reply: `No changes made. memory.md is unchanged.`

### Format

```markdown
# Memory — [Feature or Session Name]

Last updated: [date and time]

## What was built

[Specific files, components, features completed]

## Decisions made

[Architectural choices future work depends on]

## Problems solved

[Issues resolved this session]

## Current state

[What works, what is partial, what is broken]

## Next session starts with

[First actionable step]

## Open questions

[Unresolved items]
```

After writing:

```
Memory saved to memory.md.

Next session: run /remember restore to pick up from here.
```

---

## Restore Mode

### Step 1 — Find memory

Look for `memory.md` in the project root. If missing:

```
No memory.md found in this project.

Either this is the first session, or memory was not saved.
To save at end of session, run /remember save.
```

### Step 2 — Read context

Read `memory.md` first. Then check these if they exist:

- `CLAUDE.md`, `.claude/context.md`
- `.github/copilot-instructions.md`
- `.cursorrules`, `.cursor/rules/`
- `.windsurfrules`
- `AGENTS.md`
- `.clinerules`
- `context.md`

Do not scan other files beyond this list. Never surface raw secrets — redact only.

### Step 3 — Confirm restoration

Do not start building. Summarize and wait for confirmation:

```
Memory restored. Here is where we are:

**Last session:** [what was built]
**Current state:** [what works now]
**Decisions in place:** [key locked decisions]
**Next up:** [what to start with]

Is this correct? Say yes to continue, or correct anything first.
```

Only continue after developer confirms.

### If memory is incomplete

Surface gaps honestly. Do not guess:

```
I found memory.md but some context seems missing — [what is unclear].

Continue with what we have, or fill in gaps first?
```

---

## The Rule

Every session ends with `/remember save`.
Every session starts with `/remember restore`.

Consistency is what makes this work.
