# Plan — addy-osmani-skills Website

> Phased build plan derived from `SPEC.md`, `DESIGN.md`, `CLAUDE.md`, and `.impeccable.md`. Slices are vertical — each one ends with something working end-to-end. `tasks/todo.md` is the atomic checkbox list `/build` consumes.

## Goals (locked from SPEC §1)

- ADLC framework understood within 60s on landing.
- Skill discovery in ≤3 clicks via lifecycle-phase sidebar.
- Per-skill page = structured header + rendered SKILL.md + related skills.
- Lighthouse ≥95 across all four categories on landing + a skill page.
- Client-side fuzzy search, dark mode (system default), mobile-responsive to 360px.

## Dependency graph

```
                       ┌─ Slice 1: Bootstrap ───────────────────────┐
                       │  Astro + Bun + TS strict + Biome + Vercel  │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ┌─ Slice 2: Tokens + Base layout ────────────┐
                       │  tokens.css (light + dark) + global.css    │
                       │  fonts loaded, BaseLayout, FOUC-free       │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ┌─ Slice 3: Sync skills ─────────────────────┐
                       │  scripts/sync-skills.ts + content schema   │
                       │  src/data/skills-data.ts (typed)           │
                       │  Vitest unit tests pass                    │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ┌─ Slice 4: First skill page renders ────────┐
                       │  DocsLayout shell, PhaseChip, HeaderCard,  │
                       │  CopyableCommand (island), RelatedSkills   │
                       │  /docs/skills/[slug] live for one slug     │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ── CHECKPOINT 1: design feel review ──
                                        ▼
                       ┌─ Slice 5: Sidebar + docs index ────────────┐
                       │  Sidebar groups (Foundations + 7 phases),  │
                       │  active-state, alphabetical within phases  │
                       │  /docs landing page                        │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ┌─ Slice 6: Landing page ────────────────────┐
                       │  Header, Footer, Hero, ADLCDiagram,        │
                       │  PhaseGrid, /                              │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ┌─ Slice 7: About + 404 ─────────────────────┐
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ── CHECKPOINT 2: full site browsable ──
                                        ▼
                       ┌─ Slice 8: Dark mode toggle ────────────────┐
                       │  ThemeToggle island, system preference,    │
                       │  localStorage persistence                  │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ┌─ Slice 9: Search (Cmd+K) ──────────────────┐
                       │  Pagefind eval → impl; SearchDialog island │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ┌─ Slice 10: Mobile nav drawer ──────────────┐
                       │  Sidebar collapses <960px, drawer overlay  │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ── CHECKPOINT 3: /review pass + design critique ──
                                        ▼
                       ┌─ Slice 11: E2E tests + a11y axe ───────────┐
                       │  All SPEC §5 Playwright specs              │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ┌─ Slice 12: Lighthouse + perf pass ─────────┐
                       │  ≥95 across all categories                 │
                       └────────────────┬───────────────────────────┘
                                        ▼
                       ┌─ Slice 13: Vercel deploy ──────────────────┐
                       │  Preview per PR, production on main        │
                       └────────────────────────────────────────────┘
```

## Slicing rationale

- **Vertical, not horizontal.** Each slice ends with one user-visible thing working end-to-end. Don't write all layouts in one slice and all pages in another — slice 4 cuts straight through layout + content + components + a single page so we see the system run as early as possible.
- **Tokens before chrome.** Slice 2 lands the full design system (including dark mode tokens — the toggle island just comes later). Every later slice references tokens, never raw values.
- **Sync before pages.** No page can render without `src/data/skills-data.ts` + `src/content/skills/*.md`. Slice 3 unblocks every page slice.
- **First skill page before sidebar.** Slice 4 picks ONE slug and renders it end-to-end. Once the per-skill template is right, slice 5 generates all of them and adds the sidebar.
- **Search and dark mode after pages.** Both are "polish layer" — easier to add when the pages they enhance are stable.
- **E2E tests after the feature, not during.** Per SPEC §5, the e2e suite tests user-visible flows. Run them as a final correctness gate, not a TDD harness. Unit tests in `src/lib/**` and `scripts/` *do* go TDD (slice 3 onwards).

## Checkpoints

After **Slice 4** (first skill page renders):
- Visual review against DESIGN.md §1–7 (token usage, hierarchy, the "one feeling").
- Run `/impeccable polish` on the skill header card if anything feels off.
- Confirm with user before generalizing the template.

After **Slice 7** (full site browsable):
- Walk every page in light + dark (visual check; toggle comes in slice 8 but you can set `data-theme` manually).
- Run DESIGN.md §9 "5-minute review checklist" against landing + a skill page.
- Confirm with user before adding search/mobile.

After **Slice 10** (all features functional):
- Run `/code-review` + `/web-design-guidelines` agents.
- Run `/critique` on landing + per-skill page.
- Fix anything flagged before tests + perf pass.

After **Slice 12** (Lighthouse ≥95):
- Verify SPEC §1 acceptance criteria one by one.
- Confirm with user, then ship slice 13.

## Open items resolved during the build

These were deferred from SPEC §8 / DESIGN.md tail. Each gets a concrete slice that picks them:

| Item | Picked in slice |
| --- | --- |
| Search lib (Pagefind vs minisearch vs Fuse.js) | Slice 9 — evaluate Pagefind first |
| Maintainer name + link | Slice 7 — ask user during /about build |
| ADLC diagram treatment | Slice 6 — default static SVG; option to add `/impeccable craft` polish during Checkpoint 2 |

## Out of scope for v1 (locked from SPEC §6 + DESIGN.md §10)

- Blog, changelog, release notes.
- Star count badges, "trending skills" lists, usage stats.
- Newsletter signup, analytics, cookie banners.
- Skill creation/editing UI.
- Server-side search, any backend.
- Dark-mode-specific easter eggs.

## Skill invocation guide

Which skill to reach for during which slice. Defaults below — override per task as needed.

| Slice | Primary skill | Secondary / when |
| --- | --- | --- |
| 1 Bootstrap | `/build` only | — |
| 2 Tokens + Base | `/frontend-ui-engineering` | — |
| 3 Sync skills | `/build` + `agent-skills:test-driven-development` (unit tests TDD) | — |
| 4 First skill page | `/frontend-ui-engineering` | `/impeccable polish` at Checkpoint 1 |
| 5 Sidebar + docs index | `/frontend-ui-engineering` | — |
| 6 Landing page | **`/frontend-design`** (Hero, ADLCDiagram, PhaseGrid) | `/frontend-ui-engineering` for Header/Footer; `/impeccable craft` if hero needs another pass |
| 7 About + 404 | `/frontend-ui-engineering` | `/frontend-design` only if about page wants a distinctive treatment |
| 8 Dark mode toggle | `/frontend-ui-engineering` | — |
| 9 Search (Cmd+K) | `/frontend-ui-engineering` | `/frontend-design` for the empty + no-results state visuals |
| 10 Mobile nav drawer | `/frontend-ui-engineering` | — |
| 11 E2E + a11y | `agent-skills:test-engineer` agent, `playwright-best-practices` skill | — |
| 12 Lighthouse + perf | `vercel:performance-optimizer` agent, `optimize` skill | — |
| 13 Vercel deploy | `vercel:deployment-expert` agent | — |

**Rule of thumb:**
- "Make this component work correctly" → `/frontend-ui-engineering`.
- "Make this surface feel distinctive and premium" → `/frontend-design`.
- "I think this surface is rough, refine it" → `/impeccable polish` or `/critique`.
- Both can be invoked on the same surface in sequence — engineering first, then a design pass.

The design direction is **locked** in DESIGN.md + .impeccable.md. Neither skill should re-derive the palette, typography, or aesthetic. If either one suggests something outside DESIGN.md, the answer is no.

## How `/build` should consume `tasks/todo.md`

- Tasks are ordered. Don't skip ahead unless a blocker forces it.
- Each task is sized to land in one `/build` slice. If a task feels too big mid-build, split it and update todo.md.
- Before marking a task complete: run `bun run check` (per CLAUDE.md "Always do"). For UI-touching tasks, also walk the DESIGN.md §9 checklist.
- At each checkpoint, pause and surface to user before continuing.
- If a structural change becomes necessary, update SPEC.md (and DESIGN.md if visual) before continuing — don't drift silently.
