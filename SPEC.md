# addy-osmani-skills Website — SPEC

> Source of truth for what we're building. Consumed by `/plan` to produce the task breakdown. Derived from confirmed intent at `~/.claude/plans/addy-osmani-skills-intent.md`.

## 1. Objective

Build a polished, browsable docs website for Addy Osmani's `agent-skills` collection — a personal tribute that makes ~50+ skills discoverable to any AI-coding-tool user (Claude Code, Codex, Cursor, etc.) and teaches the ADLC (AI Development Lifecycle) framework just by browsing.

### Target users

1. **Existing AI-coding-tool users** doing task-driven skill discovery.
2. **Developers new to the ADLC framework** who learn it by exploring the site's lifecycle-phase IA.

### Why it exists

Addy's work currently lives only as a GitHub repo. It deserves a dedicated, beautiful, shareable home. This site is volunteered, not commissioned.

### Acceptance criteria

- [ ] A first-time visitor understands the ADLC framework within 60 seconds of landing.
- [ ] A visitor can find a relevant skill for a stated task in ≤3 clicks via the lifecycle-phase sidebar.
- [ ] Each skill page renders a structured header (name, one-line description) followed by the full `SKILL.md` content and a related-skills section.
- [ ] Client-side fuzzy search returns relevant skills for partial-keyword queries across name + description.
- [ ] Dark mode toggle works, defaults to system preference.
- [ ] Site is mobile-responsive down to 360px width.
- [ ] Lighthouse scores ≥95 for Performance, Accessibility, Best Practices, SEO on landing + a representative skill page.
- [ ] `/about` page credits Addy with a link to his work and credits the maintainer.
- [ ] `/docs` surfaces How Skills Work, Agent Personas, Reference Checklists, Project Structure, and Why Agent Skills from the upstream README.
- [ ] `/quickstart` reproduces per-tool install instructions from the upstream README.
- [ ] Footer tribute line appears only on `/about`; other pages keep a minimal maintainer + upstream-repo credit.
- [ ] Sidebar group is **Meta** (not "Foundations"); skill display names are acronym-correct (e.g. `CI/CD and Automation`).
- [ ] Only lead skills show a slash-command trigger; non-lead skills show "Activates automatically".

## 2. Commands

Built and run with Bun + Astro. Linted/formatted with Biome. Tested with Vitest (unit) and Playwright (e2e).

| Task                    | Command                                                                          |
| ----------------------- | -------------------------------------------------------------------------------- |
| Install deps            | `bun install`                                                                    |
| Dev server              | `bun run dev`                                                                    |
| Build for prod          | `bun run build`                                                                  |
| Preview prod build      | `bun run preview`                                                                |
| Lint                    | `bun run lint` (alias: `biome check .`)                                          |
| Format                  | `bun run format` (alias: `biome format --write .`)                               |
| Unit tests              | `bun run test` (alias: `vitest run`)                                             |
| Unit tests (watch)      | `bun run test:watch`                                                             |
| E2E tests               | `bun run test:e2e` (alias: `playwright test`)                                    |
| E2E tests (UI)          | `bun run test:e2e:ui`                                                            |
| Sync skills from source | `bun run sync-skills` (copies SKILL.md + skills-data.js from `../agent-skills/`) |
| Type check              | `bun run typecheck` (alias: `astro check`)                                       |
| Pre-commit gate         | `bun run check` (runs lint + typecheck + unit tests)                             |

## 3. Project structure

```
addy-osmani-skills/
├── SPEC.md                       # This document
├── CLAUDE.md                     # Agent guidance (Astro patterns, conventions)
├── README.md                     # Public-facing project intro
├── package.json
├── bun.lockb
├── biome.json                    # Biome config
├── astro.config.mjs              # Astro config (Vercel adapter, integrations)
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── public/                       # Static assets (favicon, og images)
├── scripts/
│   └── sync-skills.ts            # Copies SKILL.md + skills-data.js from ../agent-skills/
├── src/
│   ├── content/
│   │   ├── config.ts             # Astro content collection schema for skills
│   │   └── skills/               # Synced SKILL.md files (one per skill)
│   ├── data/
│   │   └── skills-data.ts        # Synced + typed skill metadata (groups, phases, slugs)
│   ├── components/
│   │   ├── layout/               # Header, Footer, Sidebar, ThemeToggle, MobileNav
│   │   ├── docs/                 # SkillHeaderCard, RelatedSkills, PhaseChip
│   │   ├── landing/              # Hero, ADLCDiagram, PhaseGrid, CTASection
│   │   ├── search/               # SearchDialog, SearchResults (client-island)
│   │   └── ui/                   # Button, Chip, Card primitives
│   ├── layouts/
│   │   ├── BaseLayout.astro      # HTML shell, meta, theme bootstrap
│   │   ├── DocsLayout.astro      # Sidebar + content shell for /docs/**
│   │   └── MarketingLayout.astro # Centered shell for /, /about
│   ├── pages/
│   │   ├── index.astro           # Landing
│   │   ├── about.astro
│   │   ├── quickstart.astro      # Per-tool install from upstream README
│   │   ├── docs/
│   │   │   ├── index.astro       # Getting started + ADLC overview
│   │   │   └── skills/
│   │   │       └── [slug].astro  # Per-skill page (dynamic route)
│   │   └── 404.astro
│   ├── styles/
│   │   ├── tokens.css            # CSS custom properties (color, type, spacing)
│   │   └── global.css            # Resets, base typography
│   └── lib/
│       ├── skills.ts             # Grouping + phase utilities, source of truth queries
│       ├── search.ts             # Client-side fuzzy index (Fuse.js or minisearch)
│       └── theme.ts              # Theme toggle logic
└── tests/
    ├── unit/                     # Vitest tests for src/lib/**
    └── e2e/                      # Playwright tests (landing, docs, skill page, search, theme)
```

### Information architecture

**Sidebar groups** (in this order):

1. **Meta** (cross-cutting): `using-agent-skills` — no slash command
2. **Define** — trigger: `/spec` (lead skill: `spec-driven-development`)
3. **Plan** — trigger: `/plan` (lead skill: `planning-and-task-breakdown`)
4. **Build** — trigger: `/build` (lead skill: `incremental-implementation`)
5. **Test** — trigger: `/test` (lead skill: `test-driven-development`)
6. **Review** — trigger: `/review` (lead skill: `code-review-and-quality`)
7. **Simplify** — trigger: `/code-simplify` (lead skill: `code-simplification`)
8. **Ship** — trigger: `/ship` (lead skill: `shipping-and-launch`)

Only the **7 lead skills** display a slash-command trigger on their skill page. All other skills show "Activates automatically". Phase headers still show the group command in the sidebar, diagram, and docs overview.

Each phase header shows the slash command as part of the label. Skills inside each group are alphabetical.

### Routes

| Route                 | Layout          | Purpose                                 |
| --------------------- | --------------- | --------------------------------------- |
| `/`                   | MarketingLayout | Hero + ADLC framework + CTA to browse   |
| `/quickstart`         | MarketingLayout | Per-tool install from upstream README   |
| `/about`              | MarketingLayout | Tribute story + maintainer + Addy links |
| `/docs`               | DocsLayout      | Getting started + ADLC overview + README sections (How Skills Work, Personas, Checklists, Structure, Why) |
| `/docs/skills/[slug]` | DocsLayout      | Per-skill page                          |
| `/404`                | MarketingLayout | Not found                               |

## 4. Code style

### Language + framework

- **TypeScript strict mode** everywhere. No `any` without a justifying comment.
- **Astro components (`.astro`)** for static surfaces. Use **island components** (React, lit, vanilla) only where interactivity is required: search dialog, theme toggle, mobile nav, copy-to-clipboard buttons.
- Default to **`.astro` over framework components** unless interactivity is needed.

### Formatting + linting

- **Biome** is the only formatter + linter. No Prettier, no ESLint.
- 2-space indent, single quotes, semicolons on, trailing commas where valid.
- `biome check .` must pass in CI; `biome format --write .` is the format command.

### Naming conventions

- Components: `PascalCase.astro` / `PascalCase.tsx`.
- Utility modules: `kebab-case.ts`.
- Constants: `SCREAMING_SNAKE_CASE`.
- Route files: lowercase + Astro conventions (`[slug].astro`, `index.astro`).
- CSS custom properties: `--token-category-name` (e.g., `--color-fg-muted`, `--space-4`).

### Styling

- **CSS custom properties** for design tokens in `src/styles/tokens.css`.
- **Scoped styles** inside `.astro` files for component-local CSS.
- **No CSS-in-JS, no Tailwind, no UI libs.** Hand-rolled tokens-driven CSS keeps the bundle tiny and the aesthetic distinct from generic shadcn-clones.
- Dark mode via `[data-theme="dark"]` attribute on `<html>`; tokens swap, components don't change.

### Markdown rendering

- Skill content lives in `src/content/skills/*.md` (Astro content collections).
- Use `astro:content` with a Zod schema validated against `skills-data.ts`.
- Rendered markdown styled via a single `prose` CSS class in `global.css` (no plugin chain).

### File length + responsibility

- Components ≤150 lines. If longer, extract subcomponents.
- One responsibility per module. No "utils.ts" dumping grounds.

### Comments

- Explain _why_, never _what_. Most code should need no comments.

## 5. Testing strategy

### Unit tests (Vitest)

Scope: pure logic in `src/lib/**` and any data transformations in `scripts/sync-skills.ts`.

Mandatory coverage:

- [ ] `lib/skills.ts` — grouping by phase, meta filtering, slug generation, related-skills resolution.
- [ ] `lib/search.ts` — index building, query relevance for representative inputs.
- [ ] `scripts/sync-skills.ts` — parsing skills-data.js, frontmatter extraction, write target paths.

Run in CI on every PR. Coverage target: ≥80% on `src/lib/**`.

### E2E tests (Playwright)

Scope: user-visible flows on a production build.

Mandatory specs:

- [ ] **landing.spec.ts** — landing renders, ADLC framework section visible, CTA navigates to `/docs`.
- [ ] **sidebar-nav.spec.ts** — all 8 sidebar groups render; clicking a skill loads the right page.
- [ ] **skill-page.spec.ts** — header card shows name + description only (phase lives in sidebar); SKILL.md body renders; related-skills section appears.
- [ ] **search.spec.ts** — opening search via shortcut (e.g., `Cmd+K`), typing a partial query, navigating with arrow keys, pressing Enter goes to the right skill.
- [ ] **theme.spec.ts** — theme toggle flips `data-theme`; preference persists across navigation.
- [ ] **about.spec.ts** — `/about` shows tribute copy + maintainer credit + Addy link.
- [ ] **a11y.spec.ts** — axe-core run on landing + docs index + a skill page; no critical violations.

Run on Chromium + WebKit. Mobile viewport projects for sidebar/mobile-nav specs.

### Visual + performance

- [ ] Lighthouse CI check on landing + a representative skill page; thresholds ≥95 on all four categories.
- [ ] No console errors on any e2e spec run.

## 6. Boundaries

### Always do

- Run `bun run check` (lint + typecheck + unit) before declaring a task done.
- Update `SPEC.md` if a decision changes the structure or contract; don't silently drift.
- Keep `skills-data.ts` and `src/content/skills/` in sync via `scripts/sync-skills.ts` — never hand-edit synced files.
- Treat `agent-skills/` (the source repo) as **read-only** from this project. Sync pulls from it; nothing writes back.
- Use CSS custom properties for any color/spacing/type value that appears more than once.
- Server-render by default; opt into client islands only when interactivity is required.
- Honor `prefers-reduced-motion` for any animation.
- Credit Addy + link to his work on `/about` (tribute) and via a minimal upstream-repo link on every layout footer; credit the maintainer on every page.

### Ask first

- Before adding any **new runtime dependency** (especially UI libs, animation libs, anything > 5KB gzipped).
- Before changing the **sidebar IA** (the 8 groups + ordering are locked).
- Before adding a **new top-level route** beyond what's listed in §3.
- Before introducing **client-side JS frameworks** beyond what's already approved (Astro + minimal React islands).
- Before adding **third-party analytics, tracking, or any external requests** at runtime.
- Before changing the **deployment target** away from Vercel.
- Before pushing to the `main` branch on the GitHub remote.

### Never do

- Never replicate impeccable's editorial visual identity (cream parchment, hairline display serif, marbled gold) — this site is modern dev-docs, not editorial.
- Never frame the site as official or Anthropic-affiliated. Tribute language only.
- Never duplicate full install/setup instructions from the source repo — link out to GitHub.
- Never commit secrets, API keys, `.env` files, or credentials.
- Never use `git push --force` or rewrite shared history without explicit instruction.
- Never skip git hooks (`--no-verify`) or bypass Biome/typecheck failures.
- Never add a backend, database, or server-side search — site is static.
- Never edit synced skill content (`src/content/skills/*.md`) directly; fix upstream + re-sync.
- Never introduce Tailwind, shadcn, MUI, Chakra, or any opinionated UI framework.
- Never use AI-generic clip-art / stock illustrations on the landing — distinctive visual elements only.

## 7. Deployment

- **Host:** Vercel.
- **Framework preset:** Astro (auto-detected).
- **Build command:** `bun run build`.
- **Output:** static (`dist/`). No SSR functions unless a future feature requires it.
- **Preview deploys:** every PR.
- **Production:** `main` branch.
- **Env vars:** none required at runtime for v1.

## 8. Open items deferred to `/plan`

- Concrete tokens (palette, type scale, spacing scale) — to be decided during the design pass via `/premium-website-design` + `/impeccable craft`. yes
- Search library choice — Fuse.js vs minisearch vs Pagefind (Pagefind has best Astro story, evaluate first). see what works best
- ADLC diagram visual treatment for the landing — static SVG vs subtle animation. subtke animation
- Maintainer name/handle for `/about` and footer credit. Deepak Kumar Dewani (https://github.com/deepakkumardewani)

## 9. Confirmation

Once the user confirms this spec, `/plan` consumes it to produce a sequenced task breakdown.

**Yes / refine?**
