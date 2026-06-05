# Website Improvements — SPEC

> Scope: a batch of UI/content/IA fixes across the site to make it faithfully mirror the
> upstream `agent-skills` README. Priority: this SPEC > model defaults. Where this changes a
> locked decision in root `SPEC.md` / `CLAUDE.md`, those files are updated as part of the work
> (see §7).

Source of truth for all copy and grouping: `../agent-skills/README.md`.

---

## 1. Objective

Bring the site's structure and copy in line with Addy Osmani's actual `agent-skills` README, and
polish the shell (header, hero, footer). Today the site invents a "Foundations" group, fabricates
homepage/diagram copy, mislabels skill names, shows slash commands on skills that don't have one,
and repeats the tribute on every page. None of that matches the README.

### Target users

Developers browsing the skills as documentation — they expect what they read here to match the
upstream repo exactly (group names, which skills map to which command, install steps).

### Why now

The README is the canonical description of the pack. Divergence (Foundations vs Meta, fabricated
phase hints, wrong skill→command mapping) makes the site misleading.

### Acceptance criteria (top level)

- [ ] No "Foundations" anywhere in UI, data, tokens, or copy — replaced by **Meta**.
- [ ] Every skill sits in the phase the README assigns it (§3.1).
- [ ] Only the **7 lead skills** display a slash-command trigger; all other skills indicate they
      activate automatically (§3.2).
- [ ] Skill display names are acronym-correct: `CI/CD and Automation`, `API and Interface Design`,
      `Documentation and ADRs`, and "and/or/to/…" are lowercased (§5.3).
- [ ] All homepage copy traces to a line in the README — nothing invented (§5.1).
- [ ] Header: refined brand, search in its own component, GitHub as an icon left of the theme
      toggle, no GitHub nav link (§4).
- [ ] Hero spans the full content container width, not the narrow prose column (§5.1).
- [ ] The tribute line appears only on `/about`; other pages keep a minimal maintainer/repo credit
      (§5.4).
- [ ] A `/quickstart` page reproduces the README's per-tool install instructions (§5.5).
- [ ] `/docs` surfaces How Skills Work, Why Agent Skills, Project Structure, Agent Personas, and
      Reference Checklists, grounded in the README (§5.6).
- [ ] `bun run check` and the e2e suite pass.

---

## 2. Commands (unchanged)

Dev workflow is unchanged. Gate before "done":

```bash
bun run sync-skills    # regenerate skills-data.ts + content from new phase map
bun run check          # biome + tsc + vitest — must pass
bun run test:e2e       # playwright
bun run build          # production build must succeed
```

`sync-skills` is the only way `src/data/skills-data.ts` and `src/content/skills/*` change. Never
hand-edit those. The phase/trigger logic lives in `scripts/skills-phase-map.ts` +
`scripts/sync-skills-lib.ts`; edit those, then re-sync.

---

## 3. Information architecture changes

### 3.1 Phase model: Foundations → Meta + skill reassignment

Rename the `foundations` phase id to `meta` throughout (Phase union, PHASE_ORDER, PHASE_META,
tokens, CSS classes, anchors, diagram filters). Label = **Meta**, no command.

New `SKILL_PHASE_MAP` (matches README "All 23 Skills" table, mapped onto the 7 command-phases):

| Phase | Label | Command | Skills |
|---|---|---|---|
| `meta` | Meta | — | using-agent-skills |
| `define` | Define | `/spec` | interview-me, idea-refine, spec-driven-development |
| `plan` | Plan | `/plan` | planning-and-task-breakdown |
| `build` | Build | `/build` | incremental-implementation, test-driven-development, context-engineering, source-driven-development, doubt-driven-development, frontend-ui-engineering, api-and-interface-design |
| `test` | Test | `/test` | browser-testing-with-devtools, debugging-and-error-recovery |
| `review` | Review | `/review` | code-review-and-quality, security-and-hardening, performance-optimization |
| `simplify` | Simplify | `/code-simplify` | code-simplification |
| `ship` | Ship | `/ship` | git-workflow-and-versioning, ci-cd-and-automation, deprecation-and-migration, documentation-and-adrs, shipping-and-launch |

Total = 23 (1+3+1+7+2+3+1+5). Sidebar order: **Meta → Define → Plan → Build → Test → Review →
Simplify → Ship** (8 groups, unchanged count).

Notes vs README: README's skill table uses the header "Verify" for the Test group and folds
`code-simplification` under "Review". We keep **Test** and **Simplify** as their own phases because
the `/test` and `/code-simplify` commands exist (the README's own Commands table lists both). The
ADLC diagram keeps 7 orbit nodes; **Meta sits outside the loop** (same treatment Foundations had).

### 3.2 Command/trigger accuracy

The README's Commands table maps exactly **7 commands to 7 lead skills**; every other skill
"activate[s] automatically based on what you're doing." Encode that:

| Command | Lead skill |
|---|---|
| `/spec` | spec-driven-development |
| `/plan` | planning-and-task-breakdown |
| `/build` | incremental-implementation |
| `/test` | test-driven-development |
| `/review` | code-review-and-quality |
| `/code-simplify` | code-simplification |
| `/ship` | shipping-and-launch |

- Only the lead skill for a phase gets `triggers: [command]`. All other skills get `triggers: []`.
- `SkillHeaderCard`: when `triggers` is empty, render no `CopyableCommand`; instead show a quiet
  note — "Activates automatically" — (README §Commands). Lead skills render the `CopyableCommand`
  as today.
- The phase **group** still carries its command (used by the phase grid + diagram + docs overview).
  Per-skill is what changes.
- Search index reflects the same triggers (it is regenerated from `skills-data.ts`).

### 3.3 Routes

| Route | Layout | Change |
|---|---|---|
| `/` | Marketing | Hero widened; README-grounded copy; Commands section added |
| `/quickstart` | Marketing | **NEW** — per-tool install from README |
| `/about` | Marketing | Copy: Foundations→Meta; carries the tribute |
| `/docs` | Docs | Meta group; new How-it-works/Why/Structure/Personas/Checklists sections |
| `/docs/skills/[slug]` | Docs | Acronym names; trigger only for lead skills |
| `/404` | Marketing | unchanged |

---

## 4. Header

- **Search → own component.** Extract the search trigger button + its boot script from
  `Header.astro` into `src/components/search/SearchTrigger.astro`. Header imports and renders it.
  Behavior (⌘K, aria) unchanged.
- **GitHub: icon, not nav link.** Remove the GitHub entry from `navItems`. Nav = `Docs`,
  `Quick start`, `About` (internal only). Add a GitHub icon link in `.site-header__actions`,
  positioned **to the left of the theme toggle** (order: Search → GitHub → Theme). `aria-label`
  "GitHub repository", `target="_blank" rel="noopener noreferrer"`, styled identically to the
  theme-toggle icon button.
- **Brand UI.** Improve the `addy-osmani-skills` wordmark — a small mark/accent + intentional type,
  tokens-driven only (no raw hex/px). Must stay accessible (focus ring) and truncate gracefully on
  narrow screens.

Acceptance:
- [ ] No "GitHub" text link in the nav; a GitHub icon button sits immediately left of the theme toggle.
- [ ] Search trigger lives in `SearchTrigger.astro`; Header has no inline search markup/script.
- [ ] Brand renders with refined styling and a visible focus ring.

---

## 5. Page-level requirements

### 5.1 Homepage

- **Width.** Hero breaks out of `--space-prose-max` to the page container width; text block stays
  left-aligned. Subhead may keep a comfortable measure but the section spans the container.
- **README-grounded copy.** Replace fabricated lines:
  - Title/subhead reflect the README's framing: *"Production-grade engineering skills for AI coding
    agents"* and the README's one-line description. No invented phrasing; obey the project's banned
    words.
  - Hero meta + `PhaseGrid` lede: drop "Foundations / seven ADLC phases" invention → "Meta plus
    seven ADLC phases" with correct counts.
  - `ADLCDiagram` lede: Foundations→Meta; keep it factual.
- **Commands section.** Add a homepage section reproducing the README's Commands table — columns
  *What you're doing / Command / Key principle* for the 7 commands. The "Key principle" text comes
  verbatim from the README (Spec before code, Small atomic tasks, One slice at a time, Tests are
  proof, Improve code health, Clarity over cleverness, Faster is safer). This replaces invented
  phase-hint copy.
- **Phase hints.** `ADLC_PHASE_HINTS` in `lib/adlc-cycle.ts` is hand-written. Either replace each
  hint with the README "Key principle" for that command, or remove hints in favor of the Commands
  section. Decision: reuse the README "Key principle" values so the diagram and Commands table agree.

Acceptance:
- [ ] Hero section width == container width (verified visually + e2e bounding check).
- [ ] A Commands section lists all 7 commands with README key-principles.
- [ ] grep for "Foundations", "seven ADLC phases" invention on `/` returns nothing.

### 5.2 (reserved)

### 5.3 Skill name formatting

`formatSkillDisplayName(name)` becomes acronym-aware:

- **Acronyms** upper-cased: `ci`→CI, `cd`→CD, `api`→API, `adr`→ADR, `adrs`→ADRs, `adlc`→ADLC,
  `ui`→UI, `ai`→AI. Special-case the adjacent `ci`+`cd` tokens → render `CI/CD` (one token).
- **Minor words** lowercased unless first: `and, or, to, the, of, for, with, a, an, in, on`.
- Everything else: capitalize first letter.

Expected outputs (acceptance table — drives unit tests):

| slug | display name |
|---|---|
| ci-cd-and-automation | CI/CD and Automation |
| api-and-interface-design | API and Interface Design |
| documentation-and-adrs | Documentation and ADRs |
| code-review-and-quality | Code Review and Quality |
| git-workflow-and-versioning | Git Workflow and Versioning |
| security-and-hardening | Security and Hardening |
| debugging-and-error-recovery | Debugging and Error Recovery |
| deprecation-and-migration | Deprecation and Migration |
| browser-testing-with-devtools | Browser Testing with DevTools |
| using-agent-skills | Using Agent Skills |
| frontend-ui-engineering | Frontend UI Engineering |
| test-driven-development | Test Driven Development |

(`devtools`→DevTools is a nice-to-have; if not trivially generalizable, add it to the acronym/casing
map explicitly.)

### 5.4 Footer / tribute

- The "A tribute to Addy Osmani's agent-skills" line renders **only on `/about`**.
- All other pages keep a **minimal credit**: maintainer line + a quiet link to the upstream repo
  (no "tribute" wording).
- Implementation: `Footer.astro` checks `Astro.url.pathname === '/about'` (or takes a `variant`
  prop) to decide whether to render the tribute paragraph. About page still reads as a tribute.

Acceptance:
- [ ] `/about` footer shows the tribute line; `/` and `/docs` footers do not.
- [ ] Every page footer still links to Addy's repo somewhere (minimal credit) and credits the
      maintainer.

### 5.5 Quick Start page (`/quickstart`)

New page reproducing the README "Quick Start" content faithfully (this is Addy's content — exempt
from the banned-words rule, but keep our own framing copy clean):

- Per-tool install: Claude Code (marketplace + local), Cursor, Gemini CLI, Windsurf, OpenCode,
  GitHub Copilot, Kiro, Codex/Other. Use native `<details>/<summary>` accordions (no new JS).
- Install commands rendered via the existing `CopyableCommand` component where they're copy-paste
  commands; SSH-error note preserved.
- Linked from: header nav ("Quick start") + a secondary CTA on the hero + the docs index.
- Layout: `MarketingLayout`, `.prose`.

Acceptance:
- [ ] `/quickstart` renders all tool sections; commands are copyable; no console errors.
- [ ] Header nav and hero link to it.

### 5.6 Docs getting-started enrichment

Add README-sourced sections to `/docs` (getting started), in this order, each concise and linking to
the relevant upstream file:

1. **How skills work** — expand to the README's "How Skills Work": skill anatomy + the four key
   design choices (Process not prose, Anti-rationalization, Verification non-negotiable, Progressive
   disclosure).
2. **The ADLC framework** — existing; copy updated (Meta replaces Foundations).
3. **Agent Personas** — table: code-reviewer (Senior Staff Engineer), test-engineer (QA), security-
   auditor (Security Engineer) + perspective, linking to upstream `agents/`.
4. **Reference Checklists** — table: testing-patterns, security-checklist, performance-checklist,
   accessibility-checklist, linking to upstream `references/`.
5. **Project Structure** — README's repo tree (the upstream pack layout), as a reference block.
6. **Why Agent Skills?** — README's rationale section.
7. Existing "Find a skill" CTA, with the Meta/anchor fixes.

The `#phase-foundations` anchor + section becomes `#phase-meta` / "Meta".

Acceptance:
- [ ] All five new/expanded sections present, copy traceable to README, links resolve.

---

## 6. Code style & testing

Inherit root `SPEC.md` §4–5. Specifics for this work:

### Unit (Vitest) — required
- [ ] `formatSkillDisplayName` — one assertion per row in §5.3 table.
- [ ] `skills-phase-map` — every slug maps to the §3.1 phase; lead-skill map yields correct command.
- [ ] `sync-skills-lib.buildTriggers` — lead skill → `[command]`; non-lead → `[]`; `meta` → `[]`.
- [ ] `lib/skills` grouping — `groupSkillsByPhase` returns Meta-first order, no `foundations`.

### E2E (Playwright) — required / updated
- [ ] Header: GitHub icon present in actions (left of theme toggle), no "GitHub" nav link; search opens.
- [ ] `/quickstart`: renders, install commands copyable.
- [ ] Footer: tribute on `/about`, absent on `/` and `/docs`.
- [ ] Docs: sidebar shows "Meta" group (not "Foundations"); new sections render.
- [ ] Skill page: `CI/CD and Automation` title; lead skill shows command, a non-lead skill shows
      "Activates automatically" (no copyable command).
- [ ] Homepage: Commands section lists 7 commands; hero spans container width.
- [ ] Update existing specs (landing, about, sidebar-nav) for Meta + new structure.

`bun run check` + e2e must pass. Bug-fix-first rule applies (failing test → fix → green).

---

## 7. Boundaries / docs to update

This work intentionally changes three locked decisions; update the governing docs in the same PR:

- **Schema (Ask-first item):** `Phase` union `foundations`→`meta`. This is a breaking change to the
  `skills-data.ts` schema, performed deliberately as part of this restructure.
- **`CLAUDE.md`:** change "Footer credits Addy on every page; `/about` credits maintainer" →
  "Footer shows the tribute only on `/about`; other pages keep a minimal repo credit + maintainer".
  Update the sidebar-group line "Foundations → Define → …" → "Meta → Define → …". Add `/quickstart`
  to routing.
- **Root `SPEC.md`:** update §3 IA (Meta + reassignments + lead-skill triggers), §3 routes
  (+`/quickstart`), §6 boundaries (footer), and acceptance criteria.

### Always do
- Re-sync after editing the phase map; never hand-edit `skills-data.ts` / `src/content/skills/*`.
- Use tokens for any new color/spacing/type; rename `--phase-foundations*` → `--phase-meta*`.
- Keep copy traceable to the README; obey banned-words list for our own framing.

### Never do
- Add a backend, new runtime dep, UI framework, or analytics.
- Invent skill descriptions/principles not in the README.
- Mimic impeccable's visual identity; frame the site as official/Anthropic-affiliated.

---

## 8. Open interpretation (resolved by maintainer)

- IA: **Keep 7 command-phases, fix Meta** (chosen).
- README content placement: **maintainer's discretion** → resolved as §5.5 (`/quickstart` page) +
  §5.6 (docs sections).
- Footer: **tribute on About only, minimal credit elsewhere** (chosen).
- Hero: **widen to full content container** (chosen).
