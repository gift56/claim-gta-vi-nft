---
name: imprint
description: After building any UI component, extract the visual patterns that matter for consistency and save them to ui-registry.md. So every component built after this one matches what came before.
---

UI consistency does not happen by accident. AI builds each component in isolation — spacing drifts, colors vary, radius is inconsistent.

Run this after every UI component. Extract patterns that matter and save them for future sessions.

## How to Invoke

```
/imprint              — capture from recently built/modified components
/imprint [filepath]   — capture from a specific file
/imprint audit        — scan codebase, find conflicts, establish baseline
```

Run `/imprint audit` before first capture on existing projects with untracked UI.

---

## Step 1 — Find What Was Built

- Filepath provided → read that file
- No filepath → find recently created/modified component files
- Unclear → ask: `Which component should I capture patterns from?`

---

## Step 2 — Extract What Matters

Extract only classes and values affecting visual consistency:

**Extract:** background, border, border radius, text colors/sizes/weights, spacing, hover/focus/active states, shadow, accent usage

**Skip:** width/height, flex/grid layout, positioning, animation timing (unless enforcing a pattern), responsive variants (capture base only)

---

## Step 3 — Write to ui-registry.md

Create or append to `ui-registry.md` in the project root. Update existing entries instead of duplicating.

```markdown
### [Component Name]

File: [filepath]
Last updated: [date]

| Property         | Class           |
| ---------------- | --------------- |
| Background       | [class]         |
| Border           | [class]         |
| Border radius    | [class]         |
| Text — primary   | [class]         |
| Text — secondary | [class]         |
| Spacing          | [class]         |
| Hover state      | [class]         |
| Shadow           | [class or none] |
| Accent usage     | [class or none] |

**Pattern notes:**
[Why these classes, what must match, allowed variations]
```

---

## Step 4 — Confirm

```
Imprinted [Component Name] → ui-registry.md

Captured:
- Background: [class]
- Border: [class]
- ...

Any future component of this type should match these patterns.
```

Flag anything inconsistent found during extraction.

---

## How ui-registry.md Gets Used

Before UI work in any session, read `ui-registry.md`. Match existing patterns when building new components.

---

## Audit Mode — /imprint audit

For existing UIs with uncertain consistency.

### Step 1 — Scan all UI components

Read every component file. Map visual patterns in use.

### Step 2 — Identify conflicts

For each property (radius, backgrounds, text colors, spacing, borders, interactive states), list every variant found with recommendations.

List hardcoded hex values and non-token classes with file locations.

### Step 3 — Wait for confirmation

Present audit. Do not fix or write registry yet. Ask developer to confirm baseline.

### Step 4 — Write confirmed baseline

After confirmation, write agreed baseline to `ui-registry.md`:

```markdown
## Baseline — Established [date]

| Property         | Correct class |
| ---------------- | ------------- |
| Card background  | [class]       |
| ...              | ...           |
```

### Step 5 — Fix list

List components deviating from baseline:

```
## Components to fix

- [file] — [wrong] → [should be]
```

---

## The Rule

Build a component. Run `/imprint`. Move on. Every time.

Consistency is a habit, not a feature.
