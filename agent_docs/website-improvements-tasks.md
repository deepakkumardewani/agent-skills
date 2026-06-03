# Website Improvements — TASKS

Ordered, vertically-sliced task list. See [plan](website-improvements-plan.md) +
[spec](website-improvements-spec.md). Gate every slice with `bun run check`. Commit per slice.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done.

---

## Slice 1 — Data & naming foundation  ⟶ CP-A
**Goal:** Foundations→Meta, README skill→phase mapping, lead-skill-only triggers, acronym names. The
prerequisite for every other slice. Must compile + pass unit tests.

- [x] **1.1 Phase map** — `scripts/skills-phase-map.ts`: rename `foundations`→`meta` in
  `PHASE_ORDER` + `PHASE_META` (label "Meta", command ""). Rewrite `SKILL_PHASE_MAP` to spec §3.1
  (interview-me→define; context-engineering/source-driven-development/doubt-driven-development→build;
  using-agent-skills→meta). Add `LEAD_SKILL_BY_COMMAND` (or `COMMAND_LEAD_SKILL`) per spec §3.2.
- [x] **1.2 Trigger logic** — `scripts/sync-skills-lib.ts`: `buildTriggers` assigns `[command]` only
  when the slug is the phase's lead skill; otherwise `[]`. `meta` always `[]`. Update
  `generateSkillsDataSource` `Phase` union template `foundations`→`meta`.
- [x] **1.3 Display names** — `src/lib/skills.ts`: rewrite `formatSkillDisplayName` to be
  acronym/minor-word aware (spec §5.3), including `ci`+`cd`→`CI/CD` and `devtools`→`DevTools`.
- [x] **1.4 Tokens** — `src/styles/tokens.css`: rename `--phase-foundations` /
  `--phase-foundations-subtle` → `--phase-meta` / `--phase-meta-subtle` (both light + dark blocks).
- [x] **1.5 Fix all `'foundations'` references to compile** — `src/lib/adlc-cycle.ts` (filter `meta`,
  type `Exclude<Phase,'meta'>`, `ADLC_PHASE_HINTS`), `src/components/landing/PhaseGrid.astro`
  (`--foundations`→`--meta` class + accent), `src/components/landing/ADLCDiagram.astro`,
  `src/pages/docs/index.astro` (`#phase-foundations`→`#phase-meta`), `PhaseChip.astro` if it branches
  on the phase. (Rich copy rewrites happen in their own slices; here just make it compile + render.)
- [x] **1.6 Skill-page trigger UI** — `src/components/docs/SkillHeaderCard.astro`: stop falling back
  to `phaseMeta.command` when `triggers` is empty; render a quiet "Activates automatically" note
  instead. Lead skills render `CopyableCommand` as before.
- [x] **1.7 Re-sync** — `bun run sync-skills`; review the diff (idempotent). `skills-data.ts` now has
  `meta`, new mapping, lead-only triggers; content frontmatter `phase:` updated.
- [x] **1.8 Unit tests** — `formatSkillDisplayName` (one assert per spec §5.3 row); phase-map (each
  slug→phase; lead map→command); `buildTriggers` (lead→`[command]`, non-lead→`[]`, meta→`[]`);
  `groupSkillsByPhase` (Meta-first, no `foundations`).

**Verify / AC:** `grep -rn "foundations" src scripts` → none (except changelog). `bun run check`
green. Dev: sidebar group reads "Meta"; `CI/CD and Automation` title; a non-lead skill (e.g.
`api-and-interface-design`) shows "Activates automatically", `incremental-implementation` shows
`/build`.

---

## Slice 2 — Header
**Goal:** refined brand, search in its own component, GitHub icon left of theme toggle, no GitHub nav
link.

- [x] **2.1 Extract search** — create `src/components/search/SearchTrigger.astro` containing the
  trigger button markup + the `setupSearchLauncher` script; render it from `Header.astro`. Remove the
  inline search markup/script from Header.
- [x] **2.2 GitHub icon** — remove the GitHub entry from `navItems` (nav = Docs, About). Add a GitHub
  icon `<a>` in `.site-header__actions`, **left of `<ThemeToggle />`** (order: Search → GitHub →
  Theme). `aria-label="GitHub repository"`, `target="_blank" rel="noopener noreferrer"`, styled like
  the theme-toggle icon button. Use `site.repoUrl`/`addy.repoUrl` from `lib/site.ts`.
- [x] **2.3 Brand UI** — improve the `.site-header__brand` wordmark (mark/accent + intentional type),
  tokens only, keep focus ring + narrow-screen truncation.
- [x] **2.4 E2E** — header spec: no "GitHub" nav link; GitHub icon present immediately before theme
  toggle; search opens via click + ⌘K.

**Verify / AC:** `bun run check` + header e2e green; visual check at CP-B.

---

## Slice 3 — Homepage  ⟶ CP-B
**Goal:** wider hero, README-grounded copy, Commands section.

- [ ] **3.1 Hero width** — `src/components/landing/Hero.astro`: section spans the page container (drop
  `--space-prose-max` cap on the section; keep readable measure on the subhead). Left-aligned.
- [ ] **3.2 Hero copy** — title/subhead/meta from README ("Production-grade engineering skills for AI
  coding agents" + README description); "Meta plus seven ADLC phases" with correct counts. No banned
  words.
- [ ] **3.3 Commands section** — new component (e.g. `src/components/landing/CommandsTable.astro`)
  reproducing the README Commands table (What you're doing / Command / Key principle) for the 7
  commands, verbatim key-principles. Render on `/`.
- [ ] **3.4 Phase hints** — set `ADLC_PHASE_HINTS` (lib/adlc-cycle.ts) to the README "Key principle"
  values so the diagram + Commands table agree.
- [ ] **3.5 Landing copy cleanup** — `PhaseGrid.astro` lede + `ADLCDiagram.astro` lede:
  Foundations→Meta, factual counts.
- [ ] **3.6 E2E** — landing spec: Commands section lists 7 commands; hero bounding box ≈ container
  width; "Foundations" absent.

**Verify / AC:** `bun run check` + landing e2e green; browser check (CP-B).

---

## Slice 4 — Footer / tribute (+ about copy)
**Goal:** tribute only on `/about`; minimal credit elsewhere.

- [ ] **4.1 Footer logic** — `src/components/layout/Footer.astro`: render the "A tribute to…" line
  only when `Astro.url.pathname === '/about'` (or a `variant` prop). All pages keep maintainer line +
  a quiet upstream-repo link.
- [ ] **4.2 About copy** — `src/pages/about.astro`: Foundations→Meta in the ADLC sentence; ensure the
  page reads as the tribute home.
- [ ] **4.3 E2E** — footer spec: tribute present on `/about`, absent on `/` and `/docs`; every footer
  links to Addy's repo + credits maintainer.

**Verify / AC:** `bun run check` + footer e2e green.

---

## Slice 5 — Quick Start page
**Goal:** `/quickstart` reproducing README install steps; linked from nav + hero + docs.

- [ ] **5.1 Page** — `src/pages/quickstart.astro` (MarketingLayout, `.prose`): per-tool sections
  (Claude Code, Cursor, Gemini CLI, Windsurf, OpenCode, GitHub Copilot, Kiro, Codex/Other) as native
  `<details>/<summary>`; install commands via `CopyableCommand`; preserve the SSH-error note.
- [ ] **5.2 Links** — add "Quick start" to header `navItems` (now Docs, Quick start, About); add a
  secondary CTA on the hero; link from the docs index.
- [ ] **5.3 E2E** — quickstart spec: page renders all tool sections; a command is copyable; nav +
  hero link resolve; no console errors.

**Verify / AC:** `bun run check` + quickstart e2e green.

---

## Slice 6 — Docs enrichment  ⟶ CP-C
**Goal:** surface README's How Skills Work, Agent Personas, Reference Checklists, Project Structure,
Why Agent Skills on `/docs`.

- [ ] **6.1 How skills work** — expand the section to README anatomy + 4 design choices.
- [ ] **6.2 ADLC + Meta** — update "The ADLC framework" + `#phase-foundations`→`#phase-meta` section
  copy.
- [ ] **6.3 Agent Personas** — table (code-reviewer / test-engineer / security-auditor + perspective)
  linking upstream `agents/`.
- [ ] **6.4 Reference Checklists** — table (testing/security/performance/accessibility) linking
  upstream `references/`.
- [ ] **6.5 Project Structure** — README repo tree as a reference block.
- [ ] **6.6 Why Agent Skills?** — README rationale section.
- [ ] **6.7 E2E** — docs spec: each new section present, links resolve, copy traceable to README.

**Verify / AC:** `bun run check` + full e2e suite green (CP-C).

---

## Slice 7 — Governance docs  ⟶ CP-D
**Goal:** make CLAUDE.md + root SPEC.md describe the finished state.

- [ ] **7.1 CLAUDE.md** — footer rule → tribute on `/about` only; sidebar line Foundations→Meta;
  add `/quickstart` to routing.
- [ ] **7.2 Root SPEC.md** — §3 IA (Meta + reassignment + lead-skill triggers), §3 routes
  (+`/quickstart`), §6 boundaries (footer), acceptance criteria.
- [ ] **7.3 Final gate** — `bun run check`, `bun run test:e2e`, `bun run build` all green (CP-D).

**Verify / AC:** docs match behavior; full check + build + e2e green.

---

## Definition of done
- [ ] All slices complete; CP-A→CP-D passed.
- [ ] `grep -rn "foundations" src scripts` returns nothing.
- [ ] `bun run check`, `bun run test:e2e`, `bun run build` green.
- [ ] No new runtime dependency added.
