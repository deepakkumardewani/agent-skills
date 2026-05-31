# Tasks — addy-osmani-skills

> Atomic checkbox list. `/build` consumes one at a time. Each task ends with **AC** (acceptance criteria) and **Verify** (how to prove it works). See `tasks/plan.md` for phase rationale + checkpoints.

## Slice 1 — Bootstrap

- [x] **1.1 Initialize Astro + Bun project**
  - Run `bun create astro@latest .` in the project root with options: empty / minimal / TypeScript strict / no install.
  - Edit `package.json` to add `"packageManager": "bun@1.x"` and the SPEC §2 script names (`dev`, `build`, `preview`, `lint`, `format`, `test`, `test:watch`, `test:e2e`, `test:e2e:ui`, `sync-skills`, `typecheck`, `check`).
  - **AC:** `bun install` succeeds; `bun run dev` boots Astro at `http://localhost:4321`.
  - **Verify:** browser shows Astro default page; no TS errors in console.

- [x] **1.2 Install + configure Vercel adapter**
  - `bun add @astrojs/vercel`.
  - `astro.config.mjs`: set `output: 'static'`, `adapter: vercel()`, `site` placeholder, `trailingSlash: 'never'`.
  - **AC:** `bun run build` emits `dist/` with `vercel.json` artifacts; no warnings.
  - **Verify:** inspect `dist/` for static HTML.

- [x] **1.3 Configure Biome**
  - `bun add -d @biomejs/biome`.
  - Create `biome.json` with: 2-space indent, single quotes, semicolons on, trailing commas where valid, lint + format enabled, exclude `dist/`, `.astro/`, `src/content/skills/` (synced files).
  - **AC:** `bun run lint` runs and passes on the empty starter; `bun run format` is idempotent.
  - **Verify:** `biome check .` exits 0.

- [x] **1.4 Configure Vitest**
  - `bun add -d vitest @vitest/coverage-v8`.
  - Create `vitest.config.ts` with `test.include: ['tests/unit/**/*.test.ts']`, coverage on `src/lib/**`, `scripts/**`, threshold 80%.
  - Create `tests/unit/.gitkeep`.
  - **AC:** `bun run test` runs with "no tests found" (passes the empty-suite case).
  - **Verify:** exit 0 with empty test dir.

- [x] **1.5 Configure Playwright**
  - `bun add -d @playwright/test`.
  - `bunx playwright install chromium webkit`.
  - Create `playwright.config.ts`: `testDir: 'tests/e2e'`, projects for Chromium + WebKit + mobile-chromium viewport, `webServer: { command: 'bun run preview', url: 'http://localhost:4321' }`.
  - Create `tests/e2e/.gitkeep`.
  - **AC:** `bun run test:e2e` runs and reports no specs.
  - **Verify:** exit 0 with empty dir.

- [x] **1.6 Wire `bun run check`**
  - `package.json` script: `"check": "biome check . && astro check && vitest run"`.
  - **AC:** `bun run check` runs lint + typecheck + unit and passes.
  - **Verify:** exit 0 on the empty project.

- [x] **1.7 `.gitignore` + initial commit**
  - Add `node_modules`, `dist`, `.astro`, `.vercel`, `coverage`, `playwright-report`, `test-results`, `.env*`, OS junk.
  - Initial commit. Do **not** push yet (per CLAUDE.md "Ask first").
  - **AC:** `git status` clean after commit.
  - **Verify:** `git log --oneline` shows initial commit.

## Slice 2 — Tokens + Base layout

> **Skill:** `/frontend-ui-engineering` (engineering-led; design direction locked in DESIGN.md).

- [x] **2.1 Install fonts**
  - `bun add @fontsource/manrope @fontsource/jetbrains-mono`.
  - Import only the weights used (Manrope: 400, 500, 600, 700; JetBrains Mono: 400) in `src/styles/global.css`.
  - **AC:** dev server loads without 404s on font files.
  - **Verify:** check Network tab — fonts served from local bundle.

- [x] **2.2 Write `src/styles/tokens.css`**
  - All tokens from `DESIGN.md` YAML frontmatter as CSS custom properties under `:root` (light mode).
  - Dark mode overrides under `[data-theme="dark"]` (warm dark palette per DESIGN.md "Colors" prose).
  - Naming: `--color-bg-default`, `--color-fg-default`, `--color-fg-muted`, `--color-accent`, `--phase-define`, etc.
  - **AC:** every token from DESIGN.md is reachable as `var(--token-name)`.
  - **Verify:** grep `var(--color` against DESIGN.md token list — no orphans.

- [x] **2.3 Write `src/styles/global.css`**
  - Modern CSS reset (e.g., Andy Bell's, hand-pasted).
  - Body: `font-family: var(--font-sans)`, `color: var(--color-fg-default)`, `background: var(--color-bg-default)`.
  - `.prose` class with full markdown styling per DESIGN.md "Components → Prose" (max-width 68ch, h2/h3 spacing, link underline, code-block styling).
  - `prefers-reduced-motion` media query disabling all transitions.
  - **AC:** dev page using a `.prose` block renders correctly styled markdown.
  - **Verify:** drop a placeholder `.astro` page with h1/h2/p/code — visual check.

- [x] **2.4 Create `BaseLayout.astro`**
  - HTML shell: `<html lang="en" data-theme="">`, `<head>` with viewport, charset, title slot, meta description slot, OG slot.
  - Inline `<script is:inline>` before `<body>` that reads `localStorage.theme || matchMedia('(prefers-color-scheme: dark)')` and sets `document.documentElement.dataset.theme` — FOUC-free.
  - Imports `tokens.css` and `global.css`.
  - Slot for page content. Footer included.
  - **AC:** `data-theme` is set before paint; no FOUC on hard refresh in dark mode.
  - **Verify:** browser devtools shows `data-theme="dark"` on first paint when system is dark.

- [x] **2.5 Placeholder `index.astro` using BaseLayout**
  - Just `<h1>Hello</h1>` + a `<p>` + a `<code>` token-using sample.
  - **AC:** renders in dev with correct fonts, colors, and proper dark mode.
  - **Verify:** toggle OS dark mode → page colors flip without a refresh.

## Slice 3 — Sync skills

> **Skill:** `agent-skills:test-driven-development` for the unit tests; plain `/build` for the script itself.

- [x] **3.1 Write `src/data/skills-data.ts` schema (types only)**
  - Export TS interfaces: `Phase`, `Skill`, `SkillGroup`, `SkillsData`.
  - `Phase` is a union of the 8 lifecycle phases (Foundations + 7 ADLC phases).
  - `Skill` has: `slug`, `name`, `description`, `phase`, `triggers` (string[]), `related` (string[]).
  - **AC:** types compile; importing them in another file gives autocomplete.
  - **Verify:** `astro check` passes.

- [x] **3.2 Write `src/content/config.ts`**
  - Define `skills` content collection with Zod schema matching the SkillsData skill shape.
  - **AC:** `astro check` validates the collection schema.
  - **Verify:** with one fake `.md` file in `src/content/skills/`, `getCollection('skills')` returns it typed.

- [x] **3.3 Write `scripts/sync-skills.ts`**
  - Read `../agent-skills/skills-data.js` (or equivalent path — check actual file structure first).
  - Parse it into typed `SkillsData`.
  - For each skill: locate its `SKILL.md`, extract frontmatter + body, write to `src/content/skills/<slug>.md` with normalized frontmatter matching the content collection schema.
  - Write `src/data/skills-data.ts` with the structured metadata as a typed const export.
  - Idempotent: diff content before writing; print summary at end.
  - **AC:** `bun run sync-skills` runs without errors and produces N markdown files + a populated `skills-data.ts`.
  - **Verify:** running it twice produces no diff in `git status`.

- [x] **3.4 Vitest tests for `sync-skills`**
  - `tests/unit/sync-skills.test.ts`: test slug normalization, frontmatter extraction, phase classification, related-skills resolution. Use fixture files under `tests/unit/fixtures/`.
  - **AC:** ≥4 test cases pass; coverage ≥80% on `scripts/sync-skills.ts`.
  - **Verify:** `bun run test` exits 0 and reports coverage.

- [x] **3.5 Run initial sync**
  - Execute `bun run sync-skills`.
  - Commit the synced output (`src/content/skills/*.md`, `src/data/skills-data.ts`) — these are tracked artifacts.
  - **AC:** all skills from `../agent-skills/` are present in `src/content/skills/`.
  - **Verify:** count matches `ls ../agent-skills/skills | wc -l` (or wherever they live).

## Slice 4 — First skill page renders

> **Skill:** `/frontend-ui-engineering` for all components. Reach for `/impeccable polish` only at Checkpoint 1 if the header card feels rough.

- [x] **4.1 Write `src/lib/skills.ts`**
  - Functions: `groupSkillsByPhase()`, `getRelatedSkills(slug)`, `getPhaseMeta(phase)` (returns name, slug command, color tokens).
  - Pure functions only; no Astro/fs.
  - **AC:** unit tests cover grouping ordering (Foundations first, 7 phases per SPEC), related resolution.
  - **Verify:** `bun run test` passes with new tests.

- [x] **4.2 `src/components/docs/PhaseChip.astro`**
  - Props: `phase: Phase`, optional `size?: 'sm' | 'md'`.
  - Renders pill with `phase-*-subtle` bg + `phase-*` fg + caps-xs label.
  - **AC:** renders correctly for all 8 phases.
  - **Verify:** drop on a test page, visually confirm all colors map.

- [x] **4.3 `src/components/docs/CopyableCommand.tsx` (Preact/React island)**
  - Props: `command: string`.
  - Renders code pill + copy icon button. On click → `navigator.clipboard.writeText(command)`, icon swaps to checkmark for 1.2s, SR-only "Copied" announces.
  - Hydration: `client:visible`.
  - **AC:** clicking copies the command; checkmark animates; honors `prefers-reduced-motion`.
  - **Verify:** manual test in browser.

- [x] **4.4 `src/components/docs/SkillHeaderCard.astro`**
  - Props: skill object.
  - Renders: PhaseChip + breadcrumb on top row, h1 skill name (`headline-lg`), one-line description (`body-lg` muted), copyable command pills row.
  - **AC:** matches DESIGN.md "Components → skill-header-card" exactly.
  - **Verify:** visual review against DESIGN.md §9 hierarchy checklist.

- [x] **4.5 `src/components/docs/RelatedSkills.astro`**
  - Props: array of related skill slugs.
  - Renders a horizontal list of phase-chipped skill links. If empty, render nothing (no empty heading per CLAUDE.md per-skill contract).
  - **AC:** with 0 related → no markup output; with N → N links visible.
  - **Verify:** test both states.

- [x] **4.6 `DocsLayout.astro` (minimal — sidebar comes in slice 5)**
  - Extends Base, centered content area, max-width container.
  - **AC:** renders a slot inside a structured shell.
  - **Verify:** drop placeholder in `/docs` page, view.

- [x] **4.7 `src/pages/docs/skills/[slug].astro`**
  - `getStaticPaths()` from content collection.
  - Render: SkillHeaderCard, prose body via `await render(entry)`, RelatedSkills.
  - Use DocsLayout.
  - **AC:** every skill slug produces a working URL; content collection body renders with `.prose` styling.
  - **Verify:** navigate to 3 random slugs; check structure matches SPEC §3 contract.

- [x] **4.8 ✅ CHECKPOINT 1**
  - Visual review: pick one skill page. Walk DESIGN.md §9 first-impression + hierarchy + system discipline checklists.
  - Run `/impeccable polish` if any rough edges.
  - Confirm with user before generalizing further pages.

## Slice 5 — Sidebar + docs index

> **Skill:** `/frontend-ui-engineering`. Sidebar is a structural/IA piece — engineering, not design generation.

- [x] **5.1 `src/components/layout/Sidebar.astro`**
  - Reads from `src/lib/skills.ts → groupSkillsByPhase()`.
  - Renders: Foundations + 7 phase groups, each with a `caps-xs` label including the slash command in code-sm.
  - Skills alphabetical within each group.
  - Active item via current URL match.
  - **AC:** all 50+ skills appear under their correct phases; active state highlights correct item.
  - **Verify:** navigate from one skill page to another — active state moves; sidebar order matches SPEC §3.

- [x] **5.2 Update `DocsLayout.astro` to include Sidebar**
  - 264px sidebar + content area side-by-side at ≥960px.
  - **AC:** sidebar visible on all `/docs/**` routes.
  - **Verify:** check `/docs` and `/docs/skills/[slug]`.

- [x] **5.3 `src/pages/docs/index.astro`**
  - Getting started + ADLC framework overview (short, ≤4 sections per DESIGN.md).
  - Single column inside DocsLayout.
  - **AC:** content reads well; banned-phrases check passes.
  - **Verify:** read it aloud; nothing AI-generic.

## Slice 6 — Landing page

> **Skill:** **`/frontend-design`** for Hero (6.4), ADLCDiagram (6.5), PhaseGrid (6.6) — these are the highest-leverage creative surfaces. `/frontend-ui-engineering` for Header (6.2), Footer (6.3), MarketingLayout (6.1), index.astro composition (6.7). Run `/impeccable craft` if the hero needs another iteration.

- [ ] **6.1 `MarketingLayout.astro`**
  - Extends Base. Centered shell, no sidebar.
  - Used by `/`, `/about`, `/404`.
  - **AC:** renders.
  - **Verify:** drop placeholder, view.

- [ ] **6.2 `src/components/layout/Header.astro`**
  - Logo/title left, nav links right (Docs, About, GitHub).
  - Search button (placeholder until slice 9).
  - Used in both layouts.
  - **AC:** sticky, ≤5 nav items, mobile-friendly.
  - **Verify:** visual.

- [ ] **6.3 `src/components/layout/Footer.astro`**
  - Two lines per DESIGN.md "Components → Footer".
  - `body-sm` `on-surface-subtle`. Links amber.
  - **AC:** appears on every page.
  - **Verify:** /, /about, /docs, /docs/skills/[slug] all show it.

- [ ] **6.4 `src/components/landing/Hero.astro`**
  - `display-lg` headline, short subhead, ONE primary CTA (`Browse skills →`).
  - No secondary CTA, no social proof bar.
  - **AC:** matches DESIGN.md §1 "one feeling" + §2 "one action".
  - **Verify:** DESIGN.md §9 first-impression checklist passes.

- [ ] **6.5 `src/components/landing/ADLCDiagram.astro`**
  - Static SVG. 7-phase circular flow with phase-colored nodes.
  - Caption explaining the lifecycle in ≤3 sentences.
  - 200ms fade-in once via IntersectionObserver — gated behind `prefers-reduced-motion`.
  - **AC:** legible at all viewport widths; reduced motion = instant.
  - **Verify:** visual + reduced-motion toggle.

- [ ] **6.6 `src/components/landing/PhaseGrid.astro`**
  - 8 cards (Foundations + 7 phases), each links to `/docs#<phase>` or shows top skills.
  - **AC:** grid is scannable; each card uses the phase color.
  - **Verify:** DESIGN.md §9 grouping checklist passes.

- [ ] **6.7 `src/pages/index.astro`**
  - Sections: Hero, ADLC, PhaseGrid, Footer. Four blocks. Not five.
  - **AC:** DESIGN.md §9 cognitive-load checklist passes.
  - **Verify:** count sections; if >4, cut one.

## Slice 7 — About + 404

> **Skill:** `/frontend-ui-engineering`. About copy matters more than visuals here — keep it modest, no design flourishes.

- [ ] **7.1 Get maintainer info from user**
  - Ask: display name + link for `/about` and footer.
  - **AC:** name + link captured.

- [ ] **7.2 `src/pages/about.astro`**
  - Tribute story (short, ≤300 words), link to Addy's site + agent-skills repo, maintainer credit.
  - **AC:** banned-phrase check passes; tribute framing per CLAUDE.md.
  - **Verify:** read aloud — sounds human, modest.

- [ ] **7.3 `src/pages/404.astro`**
  - Headline, one-sentence "this page doesn't exist", CTA back to `/docs`.
  - **AC:** matches MarketingLayout.
  - **Verify:** visit `/nonexistent`.

- [ ] **7.4 ✅ CHECKPOINT 2**
  - Walk every page in light + dark (manually set `data-theme`).
  - Run DESIGN.md §9 5-minute review on landing + a skill page.
  - Confirm with user.

## Slice 8 — Dark mode toggle

> **Skill:** `/frontend-ui-engineering`. Tokens already swap; only the island + persistence remain.

- [ ] **8.1 `src/components/layout/ThemeToggle.tsx` (island)**
  - Sun/moon icon swap. Reads + writes `localStorage.theme`. Updates `document.documentElement.dataset.theme`.
  - Hydration: `client:load` (needs to be interactive immediately).
  - SR-only label "Switch to dark/light mode".
  - **AC:** click flips theme without page refresh; preference persists across nav.
  - **Verify:** test in browser.

- [ ] **8.2 Wire ThemeToggle into Header**
  - **AC:** visible on every page; works in both layouts.
  - **Verify:** all pages.

## Slice 9 — Search (Cmd+K)

> **Skill:** `/frontend-ui-engineering` for dialog + keyboard handling. `/frontend-design` for the empty + no-results state visuals (these are micro-moments where AI-template feel sneaks in).

- [ ] **9.1 Evaluate Pagefind**
  - Try `astro-pagefind` integration with the docs collection.
  - If it works: use Pagefind. If friction is significant: fall back to `minisearch` with hand-built index.
  - Document the decision in `tasks/plan.md` under "Open items resolved".
  - **AC:** decision made + dependency installed.

- [ ] **9.2 Build search index**
  - Pagefind: configure to index `src/content/skills/**`.
  - Minisearch: write `src/lib/search.ts` that builds a JSON index from `skills-data.ts` (name + description + phase) at build time.
  - **AC:** index includes all skills.
  - **Verify:** programmatic search for known skill returns it.

- [ ] **9.3 `src/components/search/SearchDialog.tsx` (island)**
  - Renders dialog per DESIGN.md "Components → search-dialog".
  - Keyboard: `Cmd/Ctrl+K` opens, `Esc` closes, ↑/↓ navigate results, `Enter` navigates to skill.
  - Highlights active result with `primary-subtle` bg.
  - Empty state: "Type to search 50+ skills"; no-results state: "Nothing matches `<query>`".
  - Hydration: `client:idle`.
  - **AC:** all keyboard interactions work; focus trap inside dialog when open.
  - **Verify:** manual test, including keyboard-only navigation.

- [ ] **9.4 Wire SearchDialog into Header**
  - Header search button + global `Cmd/Ctrl+K` listener both open it.
  - **AC:** opens from anywhere on the site.
  - **Verify:** test from /, /about, /docs, /docs/skills/[slug].

- [ ] **9.5 Vitest tests for search relevance**
  - `tests/unit/search.test.ts` (only if using minisearch — Pagefind self-tests).
  - Cover: exact match wins, partial-word matches, phase-name queries.
  - **AC:** ≥4 cases pass.

## Slice 10 — Mobile nav drawer

> **Skill:** `/frontend-ui-engineering`. Pure interaction engineering.

- [ ] **10.1 `src/components/layout/MobileNav.tsx` (island)**
  - At <960px: hamburger button in Header opens sliding sidebar overlay.
  - Backdrop click + `Esc` close.
  - Focus trap when open.
  - **AC:** sidebar accessible on mobile; doesn't break desktop.
  - **Verify:** test at 360px, 768px, 1024px.

- [ ] **10.2 Responsive pass on all pages**
  - Check `/`, `/about`, `/docs`, `/docs/skills/[slug]` at 360px, 768px, 1024px, 1440px.
  - Spacing compresses per DESIGN.md §"Layout & Spacing" mobile rules.
  - **AC:** no horizontal scroll; nothing clipped; type stays readable.
  - **Verify:** Chrome DevTools device emulation.

- [ ] **10.3 ✅ CHECKPOINT 3 — feature-complete review**
  - Run `/code-review` agent on the full diff.
  - Run `/web-design-guidelines` agent.
  - Run `/critique` on landing + per-skill page.
  - Fix flagged items before slice 11.
  - Confirm with user.

## Slice 11 — E2E tests + a11y

> **Skill:** `playwright-best-practices` + `agent-skills:test-engineer` agent for spec authoring.

- [ ] **11.1 `tests/e2e/landing.spec.ts`**
  - Landing renders, ADLC section visible, "Browse skills →" CTA navigates to `/docs`.
  - **AC:** passes Chromium + WebKit.

- [ ] **11.2 `tests/e2e/sidebar-nav.spec.ts`**
  - All 8 groups render; clicking a skill loads its page; active state updates.

- [ ] **11.3 `tests/e2e/skill-page.spec.ts`**
  - Header card shows name + phase chip + trigger; copy-command button copies (intercept clipboard); SKILL.md body renders; related skills appear when present.

- [ ] **11.4 `tests/e2e/search.spec.ts`**
  - `Cmd+K` opens dialog; type → results filter; ↑/↓ + Enter navigate.

- [ ] **11.5 `tests/e2e/theme.spec.ts`**
  - Toggle flips `data-theme`; preference persists across nav and reload.

- [ ] **11.6 `tests/e2e/about.spec.ts`**
  - Tribute copy present, maintainer link works, Addy link works.

- [ ] **11.7 `tests/e2e/a11y.spec.ts`**
  - `@axe-core/playwright` on /, /docs, /docs/skills/[representative-slug], /about.
  - 0 critical violations.

- [ ] **11.8 Mobile viewport specs**
  - Run sidebar-nav + search + theme specs against mobile-chromium project.

- [ ] **11.9 All e2e green**
  - `bun run test:e2e` exits 0 across all projects.
  - **Verify:** CI-equivalent local run.

## Slice 12 — Lighthouse + perf

> **Skill:** `optimize` + `vercel:performance-optimizer` agent.

- [ ] **12.1 Image optimization**
  - Any landing or about-page images use Astro `<Image>` with proper sizing + `loading="lazy"` below the fold.
  - No image > 100KB unoptimized.

- [ ] **12.2 Font subsetting + preload**
  - Preload Manrope 400 + 700 in `<head>` (subset to Latin).
  - JetBrains Mono 400 only.
  - **AC:** no FOUT on landing.

- [ ] **12.3 JS budget check**
  - Landing page total JS ≤ 30KB gzipped (theme bootstrap + ThemeToggle + nothing else).
  - Skill page total JS ≤ 50KB gzipped (adds SearchDialog idle-hydrated + CopyableCommand visible-hydrated).
  - **AC:** measure with `astro build` output + a network panel check on `bun run preview`.

- [ ] **12.4 Run Lighthouse**
  - `bunx lighthouse http://localhost:4321 --only-categories=performance,accessibility,best-practices,seo` against landing + a skill page (use `bun run preview`).
  - **AC:** all four categories ≥95 on both URLs.
  - **Verify:** save reports to `tasks/lighthouse-baseline/`.

- [ ] **12.5 Fix any flagged items**
  - Iterate until ≥95 is solid.

- [ ] **12.6 ✅ Final acceptance walkthrough**
  - Walk SPEC §1 acceptance criteria one by one against the running preview build.
  - Confirm with user.

## Slice 13 — Vercel deploy

> **Skill:** `vercel:deployment-expert` agent + `vercel:deploy` skill.

- [ ] **13.1 Push to GitHub**
  - Confirm repo URL with user.
  - Push branch, open PR if maintainer wants the review flow; else push to `main` per user instruction.
  - **AC:** repo populated.

- [ ] **13.2 Link Vercel project**
  - Connect repo, framework preset Astro (auto-detected), build command `bun run build`.
  - **AC:** preview deploy URL live.

- [ ] **13.3 Set production domain**
  - User decides domain (Vercel-provided or custom).
  - **AC:** prod URL serves the site.

- [ ] **13.4 Sanity check production**
  - Re-run Lighthouse against production URL.
  - **AC:** ≥95 holds in production.

- [ ] **13.5 🚢 SHIP**
  - Announce / share / open for traffic.

## Maintenance tasks (post-launch)

- [ ] **M.1** Document the re-sync flow in `README.md` (when Addy adds/changes skills upstream).
- [ ] **M.2** Consider GitHub Action that runs `bun run sync-skills` weekly + opens a PR if anything changed.
- [ ] **M.3** Monitor any reports from real users; treat the banned-phrase list as a living rule set.
