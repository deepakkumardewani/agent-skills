# Implementation Plan: Search UX & Relevance Improvements

> Follow-up work on Slice 9 (Cmd+K search). Slice 9 shipped a working baseline; this plan covers polish identified in post-ship review. Consumable by `/build` one task at a time.

## Overview

Improve the search dialog from a filter-only input into a command-palette-style discovery surface, tighten mobile and a11y details, and tune minisearch relevance for phase names, slash commands, and exact slug matches. All changes stay client-side — no new routes, no backend, no new runtime deps unless noted.

## Architecture decisions

- **Empty-state list reuses existing index** — when query is empty, render all skills from `createSearchIndex()` (sorted alphabetically or grouped by phase) instead of a separate data path.
- **Trigger indexing lives in `src/lib/search.ts`** — add a computed `triggerText` field (phase slash command + per-skill `triggers[]` from `skills-data.ts`) to the MiniSearch document; display the primary trigger in result rows.
- **UI polish stays in `SearchDialog.tsx`** — scroll lock, keyboard footer, match highlighting, and mobile layout are island-only changes.
- **Relevance tuning is test-driven** — every ranking change gets a case in `tests/unit/search.test.ts` before UI work that depends on it.

## Dependency graph

```
S.1 Body scroll lock          (no deps)
S.2 Keyboard hint footer      (no deps)
S.3 Index + display triggers  (no deps — unlocks S.9 partial overlap)
S.4 Empty-state skill list    (depends on S.3 for trigger display in rows)
S.5 Match highlighting        (depends on S.4 or any query-with-results state)
S.6 Mobile dialog layout      (no deps)
S.7 aria-live result count    (no deps)
S.8 Borderless input chrome     (no deps)
S.9 Phase query boosting      (search.ts only)
S.10 Slug exact-match boost   (search.ts only)
S.11 Trigger query matching   (depends on S.3)
```

Recommended build order: **S.1 → S.2 → S.3 → S.11 → S.10 → S.9 → S.4 → S.5 → S.6 → S.7 → S.8**

---

## Phase 1 — High impact, low effort

### Task S.1: Lock background scroll while dialog is open

**Description:** Prevent the page behind the search modal from scrolling when the dialog is open. Restore overflow on close and unmount.

**Acceptance criteria:**
- [x] With dialog open, wheel/touch scroll does not move the underlying page
- [x] Scroll position is preserved after close
- [x] Works on `/`, `/docs`, and skill pages

**Verification:**
- [x] Manual: open search, scroll — page stays fixed; close — page scrolls normally
- [x] `bun run build` succeeds

**Dependencies:** None

**Files likely touched:**
- `src/components/search/SearchDialog.tsx`

**Estimated scope:** S (1 file)

---

### Task S.2: Keyboard hint footer

**Description:** Add a quiet footer inside the dialog with navigation hints per DESIGN.md interaction patterns.

**Acceptance criteria:**
- [x] Footer visible whenever dialog is open: `↑↓ navigate · ↵ open · esc close` (wording may use symbols)
- [x] Uses design tokens (`body-sm`, `on-surface-subtle`); not visually louder than result rows
- [x] Hidden from accessibility tree as decorative **or** exposed as supplementary text — not duplicated by SR announcements

**Verification:**
- [x] Visual check in light + dark mode
- [x] Keyboard-only flow still works unchanged

**Dependencies:** None

**Files likely touched:**
- `src/components/search/SearchDialog.tsx`

**Estimated scope:** S (1 file)

---

### Task S.3: Index and display trigger commands

**Description:** Include phase slash commands (`/spec`, `/build`, …) and per-skill `triggers[]` in the MiniSearch index. Show the primary trigger (phase command or first skill trigger) as `code-sm` in each result row.

**Acceptance criteria:**
- [x] Searching `/spec` returns Define-phase skills (at minimum `spec-driven-development`)
- [x] Skills with non-empty `triggers[]` are findable by trigger string
- [x] Result row shows trigger pill when one exists (phase command fallback for ADLC skills)
- [x] Foundations skills (empty phase command) omit trigger pill unless `triggers[]` is set

**Verification:**
- [x] `bun run vitest run tests/unit/search.test.ts` — add ≥2 trigger cases
- [x] Browser: search `/build`, confirm expected skill appears

**Dependencies:** None

**Files likely touched:**
- `src/lib/search.ts`
- `src/components/search/SearchDialog.tsx`
- `tests/unit/search.test.ts`

**Estimated scope:** M (3 files)

---

### Task S.4: Browsable skill list when query is empty

**Description:** Replace the text-only empty state with a scrollable list of all skills (grouped by phase label or sorted A–Z). Arrow keys and Enter behave the same as filtered results.

**Acceptance criteria:**
- [x] Opening search with empty input shows all `{N}` skills (N = `skillCount`)
- [x] List is keyboard-navigable (↑/↓/Enter) without typing first
- [x] Status line remains: `Type to search {N} skills` above or below the list
- [x] Typing a query switches to filtered results; clearing query restores full list
- [x] Performance acceptable with current catalog (~23 skills; no jank)

**Verification:**
- [x] Browser: open search, arrow through full list, Enter navigates correctly
- [x] `bun run build` succeeds

**Dependencies:** S.3 (trigger display in rows)

**Files likely touched:**
- `src/lib/search.ts` (optional: `listAll()` helper)
- `src/components/search/SearchDialog.tsx`

**Estimated scope:** M (2 files)

---

### Checkpoint: Phase 1 complete

- [x] Empty query shows browsable skills, not just hint text
- [x] Slash commands find skills
- [x] Background scroll locked; keyboard hints visible
- [x] Relevant unit tests green: `bun run vitest run tests/unit/search.test.ts`

---

## Phase 2 — Medium impact

### Task S.5: Highlight matched text in result names

**Description:** Bold (or `font-weight: 600`) the substring of the skill display name that matches the query. Case-insensitive. Description highlighting optional — name only for v1.

**Acceptance criteria:**
- [x] Query `debug` → "**Debug**ging And Error Recovery" (matched portion emphasized)
- [x] Highlight updates as query changes
- [x] Active/hover row styles still readable in light + dark mode
- [x] No raw HTML injection — escape query before highlight split

**Verification:**
- [x] Manual: partial and exact queries show correct emphasis
- [x] No console errors on special characters in query (e.g. `(` `)`)

**Dependencies:** S.4 (results visible without typing is nice-to-have; filtering path must work)

**Files likely touched:**
- `src/components/search/SearchDialog.tsx`
- `src/lib/search.ts` (optional: export `highlightMatch(text, query)` pure helper + unit test)

**Estimated scope:** S–M (1–2 files)

---

### Task S.6: Mobile dialog layout pass

**Description:** Adjust dialog positioning and width for viewports &lt;640px per DESIGN.md mobile rules (header search is icon-only; dialog should feel native on small screens).

**Acceptance criteria:**
- [x] At 360px width: dialog uses `calc(100vw - 16px)` or equivalent gutter; no horizontal overflow
- [x] Top margin reduced on mobile (e.g. `8vh` or vertically centered) — not stuck under notch with excessive offset
- [x] Touch targets for result rows ≥44px effective height
- [x] Desktop layout (≥640px) unchanged from current 560px centered modal

**Verification:**
- [x] agent-browser or DevTools at 360px, 768px, 1024px — no clip, readable type
- [x] `bun run build` succeeds

**Dependencies:** None

**Files likely touched:**
- `src/components/search/SearchDialog.tsx`

**Estimated scope:** S (1 file)

---

### Task S.7: Screen reader result count announcements

**Description:** Add an `aria-live="polite"` region that announces result count when the query changes.

**Acceptance criteria:**
- [x] After typing, SR users hear e.g. "5 results" or "No results" (not on every keystroke debounced ≥200ms acceptable)
- [x] Empty full list (S.4): announce "{N} skills" once on open, not on every focus
- [x] Does not duplicate dialog `aria-label` or listbox option text

**Verification:**
- [x] VoiceOver or axe: live region present and updates on query
- [x] Visual UI unchanged for sighted users

**Dependencies:** S.4 (count semantics differ for empty vs filtered)

**Files likely touched:**
- `src/components/search/SearchDialog.tsx`

**Estimated scope:** S (1 file)

---

### Task S.8: Borderless input chrome in dialog header

**Description:** Remove the nested bordered input inside the dialog header row. Single header strip: icon + borderless input + Esc hint — closer to Linear/Raycast palette pattern.

**Acceptance criteria:**
- [x] Input has no inner border/box inside the header; focus ring applies to input or header row per DESIGN.md focus tokens
- [x] 40px input height preserved
- [x] Matches DESIGN.md "Inputs" focus behavior (`focus-ring` + shadow)

**Verification:**
- [x] Visual compare before/after in light + dark
- [x] Focus visible via keyboard Tab into input

**Dependencies:** None (can ship independently)

**Files likely touched:**
- `src/components/search/SearchDialog.tsx`

**Estimated scope:** S (1 file)

---

### Checkpoint: Phase 2 complete

- [x] Mobile 360px pass clean
- [x] Match highlighting works; SR announcements present
- [x] Dialog header looks intentional, not double-bordered
- [x] `bun run check` passes (or relevant lint + search tests only if full suite deferred)

---

## Phase 3 — Relevance tuning (search quality)

> UI unchanged unless ranking order affects which result is first. All tasks require unit tests in `tests/unit/search.test.ts`.

### Task S.9: Boost phase-name queries

**Description:** When the query matches a phase label exactly (case-insensitive, e.g. `define`, `build`, `test`), rank skills in that phase higher than skills that merely mention the word in description.

**Acceptance criteria:**
- [x] `define` → top results are Define-phase skills before unrelated description matches
- [x] `foundations` → Foundations skills rank first
- [x] Fuzzy/partial phase names still work (`def` → Define skills via existing prefix/fuzzy)
- [x] Does not break existing exact slug and partial name tests

**Verification:**
- [x] Add ≥2 phase-ranking cases to `tests/unit/search.test.ts`
- [x] `bun run vitest run tests/unit/search.test.ts` green

**Dependencies:** None (logic-only)

**Files likely touched:**
- `src/lib/search.ts`
- `tests/unit/search.test.ts`

**Estimated scope:** S (2 files)

---

### Task S.10: Exact slug match always wins

**Description:** When query equals a skill slug (with or without hyphens normalized), that skill is result #1 regardless of fuzzy scores.

**Acceptance criteria:**
- [x] `test-driven-development` → first result is that slug
- [x] `test driven development` (spaces) → same skill first if feasible without hurting other queries
- [x] Exact match boost does not apply to partial slug prefixes unless they uniquely identify one skill

**Verification:**
- [x] ≥2 slug-priority cases in `tests/unit/search.test.ts`

**Dependencies:** None

**Files likely touched:**
- `src/lib/search.ts`
- `tests/unit/search.test.ts`

**Estimated scope:** S (2 files)

---

### Task S.11: Slash-command query normalization

**Description:** Strip leading `/` from queries before search and boost trigger field matches so `/spec` and `spec` behave consistently for command discovery.

**Acceptance criteria:**
- [x] `/spec` and `spec` return overlapping top results with Define/spec skills ranked high
- [x] Queries without `/` unchanged for name/description search
- [x] Unit tests cover slash-prefixed and bare trigger strings

**Verification:**
- [x] `bun run vitest run tests/unit/search.test.ts` — add slash normalization cases
- [x] Browser: `/debug` finds debugging skill if trigger metadata supports it

**Dependencies:** S.3 (triggers indexed)

**Files likely touched:**
- `src/lib/search.ts`
- `tests/unit/search.test.ts`

**Estimated scope:** S (2 files)

---

### Checkpoint: Phase 3 complete

- [x] Phase, slug, and slash-command queries rank predictably
- [x] `tests/unit/search.test.ts` has ≥12 total cases (6 existing + 6 new minimum across S.3/S.9–S.11)
- [x] No regressions in browser smoke: open → type → Enter → skill page

---

## Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Empty-state full list feels long at 50+ skills | Med | Group by phase with caps; defer until catalog grows |
| Match highlighting XSS | High | Pure string split on escaped query; no `dangerouslySetInnerHTML` |
| Body scroll lock breaks iOS Safari | Med | Use `overflow: hidden` on `html` + `body`; test on mobile WebKit |
| Ranking tweaks conflict | Med | One task per ranking rule; tests assert relative order explicitly |
| Trigger data sparse on Foundations skills | Low | Fall back to phase command only; document in S.3 AC |

## Open questions

- **Empty list sort:** alphabetical by display name vs sidebar phase order — default to **phase order, then alphabetical within phase** (matches sidebar IA).
- **Result cap:** keep 8 for filtered search when catalog &gt;30 skills, or show all matches up to 15 — revisit when `skillCount` exceeds 30.
- **E2E:** Slice 11 `tests/e2e/search.spec.ts` should be updated after S.4 (empty-list keyboard nav) — note for Slice 11, not blocking here.

## Out of scope (defer)

- `/` shortcut to open search (separate from slash in query)
- Client-side navigation without full page load
- Pagefind / full SKILL.md body search
- Search analytics or recent-query persistence (`localStorage`)

## Skill invocation guide

| Phase | Primary skill |
|-------|----------------|
| S.1–S.2, S.6–S.8 | `/frontend-ui-engineering` |
| S.4–S.5 | `/frontend-ui-engineering` + `/frontend-design` (empty list + highlight polish) |
| S.3, S.9–S.11 | `agent-skills:test-driven-development` |
| Pre-merge review | `/web-design-guidelines` on `SearchDialog.tsx` diff |
