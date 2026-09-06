---
name: recover
description: When something goes wrong during a build, diagnose what type of failure it is before deciding how to respond. Targeted fix, hard reset, or full rethink — the right response depends on the right diagnosis.
---

Not every problem is a bug. Not every bug needs debugging.

When AI-assisted development goes wrong, the instinct is to keep prompting — describe, fix, break again, describe again. Sessions get longer, context gets polluted, code gets worse.

Diagnose first. Respond second. Those steps cannot be swapped.

---

## Step 1 — Describe What Went Wrong

Ask:

```
Describe what is wrong. Be specific:
- What did you expect?
- What happened instead?
- How many fix attempts already?
```

Fix attempt count matters — it signals a fresh problem vs a polluted session.

---

## Step 2 — Identify the Failure Mode

### Mode 1 — A specific thing is broken

**Signs:** isolated problem, rest of project works, first or second fix attempt, clear error

**Response:** Targeted fix → Step 3A

### Mode 2 — The session has gone wrong

**Signs:** multiple fixes made things worse, tangled code, unclear original problem, polluted context

**Response:** Hard reset → Step 3B

### Mode 3 — The foundation is wrong

**Signs:** runs but fundamentally wrong behavior, misunderstood requirement/API/pattern, patching won't help

**Response:** Rethink → Step 3C

Tell the developer which mode before proceeding:

```
This looks like Failure Mode [1/2/3] — [name].

[One sentence why.]

Here is how we handle this:
```

---

## Step 3A — Targeted Fix

1. Get exact error, file/function, expected vs actual behavior
2. Read only directly relevant code
3. Find root cause — not symptom:

```
Root cause: [why this is happening]

This differs from the symptom because: [explanation]
```

4. Suggest a precise fix addressing root cause. Wait for confirmation before changing code.
5. If fix fails — re-diagnose from scratch. Two wrong diagnoses may mean Mode 2 or 3.

---

## Step 3B — Hard Reset

Acknowledge honestly:

```
This session has gone too far to recover by patching.
A clean start will be faster than continuing here.
```

Extract what is worth keeping:

```
## Reset Note — [Feature Name]

### What we were building
[Original description]

### What went wrong
[How the session derailed]

### What to avoid next time
[Approaches that failed]

### Starting point for next session
[What to keep vs discard]
```

Instruct:

```
1. Save this reset note
2. End this session
3. Start fresh
4. Run /remember restore if memory exists
5. Re-approach with the reset note as context

Do not continue in this session.
```

---

## Step 3C — Rethink

Name the wrong assumption:

```
The core issue is a wrong assumption:

Assumed: [what was assumed]
Reality: [what is actually true]

The current approach cannot be fixed by patching.
```

Propose the correct approach. Wait for developer confirmation before rebuilding.

---

## The Principle

The worst response to a broken build is doing the same thing faster.

Diagnose first. Different failures need different responses.
