# addy-osmani-skills

[![CI](https://github.com/deepakkumardewani/agent-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/deepakkumardewani/agent-skills/actions/workflows/ci.yml)
[![Live site](https://img.shields.io/badge/live-addy--osmani--skills.vercel.app-D97706?style=flat-square)](https://addy-osmani-skills.vercel.app)

A static docs site for [Addy Osmani](https://addyosmani.com)'s [agent-skills](https://github.com/addyosmani/agent-skills) collection — organized by the AI Development Lifecycle (ADLC), searchable, and readable on any screen.

**Live:** [addy-osmani-skills.vercel.app](https://addy-osmani-skills.vercel.app)

> Personal tribute project. Not official, not affiliated with Addy Osmani or Anthropic.

## What you get

- **Landing + ADLC diagram** — understand the lifecycle in under a minute
- **`/docs`** — sidebar grouped Meta → Define → Plan → Build → Test → Review → Simplify → Ship
- **Per-skill pages** — header, full synced `SKILL.md` body, related skills
- **Client-side search** — fuzzy lookup across names, descriptions, phases, and slash commands (`⌘K` on docs routes)
- **Dark mode** — system default, persisted preference, no flash on load
- **`/quickstart`** — install instructions per AI coding tool
- **`/about`** — credits Addy and the maintainer

## Quality gates

| Gate | Target | How we verify |
| --- | --- | --- |
| **Unit coverage** | **≥80%** on `src/lib` + `scripts` (enforced in CI) | `bun run test:coverage` |
| **Lint + types** | Zero Biome issues, strict TypeScript | `bun run check` |
| **E2E** | User-visible flows across desktop + mobile | `bun run test:e2e` (12 specs · Chromium · WebKit · mobile) |
| **Accessibility** | axe-core checks in Playwright | `tests/e2e/a11y.spec.ts` |
| **JS budget** | Landing ≤30 KB gzip · skill page ≤50 KB gzip | `tests/unit/js-budget.test.ts` |
| **Lighthouse** | **100** Accessibility · Best Practices · SEO | Audited on production build (see below) |

### Lighthouse (production build)

Audited with `bun run build && bun run preview` against the static output. Raw reports live in [`tasks/lighthouse-baseline/`](tasks/lighthouse-baseline/).

| Page | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| `/` | 99 | **100** | **100** | **100** |
| `/docs/skills/spec-driven-development` | 99 | **100** | **100** | **100** |

Re-run locally:

```bash
bun run build && bun run preview --port 4322
bunx lighthouse http://127.0.0.1:4322/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --quiet --chrome-flags="--headless" \
  --output=json --output-path=./tasks/lighthouse-baseline/landing.json
```

## CI and deployment

Two systems, two jobs:

| System | When it runs | What it does |
| --- | --- | --- |
| **[GitHub Actions](.github/workflows/ci.yml)** | Every push to `main` and every pull request | Lint (Biome) → Astro typecheck → Vitest + coverage thresholds → production build → Playwright e2e |
| **Vercel** | After merge to `main` (and preview deploys per PR) | Runs **`bun run build`** and publishes static output — **does not** run lint or tests by itself |

The **CI badge** at the top reflects GitHub Actions. That workflow is the full verification gate. Vercel is the host.

**Recommended:** enable [branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) on `main` and require the **CI** checks to pass before merge. Optionally set Vercel's production deploy to wait on those checks (Vercel → Settings → Git → Deployment Checks).

## Stack

| Layer | Choice |
| --- | --- |
| Runtime / package manager | [Bun](https://bun.sh) |
| Framework | [Astro 6](https://astro.build) static output + [Vercel adapter](https://docs.astro.build/en/guides/integrations-guide/vercel) |
| Interactive UI | [Preact](https://preactjs.com) islands (`client:idle` / `client:visible`) |
| Styling | Plain CSS + design tokens ([`src/styles/tokens.css`](src/styles/tokens.css)) — no Tailwind |
| Content | Astro content collections synced from upstream `agent-skills` |
| Search | [MiniSearch](https://github.com/lucaong/minisearch) (client-side index) |
| Lint / format | [Biome](https://biomejs.dev) only |
| Unit tests | [Vitest](https://vitest.dev) + `@vitest/coverage-v8` |
| E2E | [Playwright](https://playwright.dev) + `@axe-core/playwright` |

Node **≥22.12** (see `package.json` engines).

## Commands

| Command | Action |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Dev server at [localhost:4321](http://localhost:4321) |
| `bun run build` | Production build to `./dist/` |
| `bun run preview` | Serve the production build locally |
| `bun run sync-skills` | Sync `SKILL.md` + metadata from `../agent-skills/` (read-only source) |
| `bun run lint` | Biome check |
| `bun run format` | Biome format (write) |
| `bun run typecheck` | `astro check` |
| `bun run test` | Vitest unit tests |
| `bun run test:coverage` | Unit tests + coverage report (thresholds in `vitest.config.ts`) |
| `bun run test:e2e` | Playwright (starts preview on port 4322) |
| `bun run check` | **Pre-merge gate:** lint + typecheck + unit tests |

## Project structure

```text
├── .github/workflows/ci.yml   # GitHub Actions — full verification
├── scripts/sync-skills.ts     # Idempotent sync from ../agent-skills/
├── src/
│   ├── content/skills/        # Generated markdown (do not hand-edit)
│   ├── data/skills-data.ts    # Generated typed metadata
│   ├── lib/                   # Pure logic (unit-tested, coverage-gated)
│   ├── components/            # Astro + Preact islands
│   ├── layouts/               # Base, Docs, Marketing
│   └── pages/                 # /, /about, /quickstart, /docs, /docs/skills/[slug], /404
├── tests/
│   ├── unit/                  # Vitest — lib + sync script
│   └── e2e/                   # Playwright — user flows
├── SPEC.md                    # Product spec (source of truth)
├── DESIGN.md                  # Visual system + tokens
└── CLAUDE.md                  # Agent / contributor conventions
```

Skills source of truth: [`../agent-skills/`](../agent-skills/) (sibling repo). Run `bun run sync-skills` after upstream changes.

## Testing strategy

- **`src/lib/**` and `scripts/**`** — unit tests required; **≥80%** coverage enforced in CI
- **Components and pages** — Playwright e2e (static Astro surfaces + hydrated islands)
- **Bug fixes** — failing test first, then fix (`bun run check` must stay green)

```bash
# Quick local gate (matches most of CI minus e2e and coverage thresholds)
bun run check

# Full local verification
bun run test:coverage && bun run build && bun run test:e2e
```

## Conventions

- **Spec-driven** — routing, sidebar order, and page contracts live in [`SPEC.md`](SPEC.md); change the spec before changing structure
- **No hand-edited sync artifacts** — fix upstream `agent-skills`, then `bun run sync-skills`
- **Design tokens only** — no raw hex/px in components; extend [`tokens.css`](src/styles/tokens.css) first
- **Islands sparingly** — search, theme toggle, mobile nav; everything else is server-rendered Astro
- **Accessibility by default** — focus rings, reduced motion, semantic landmarks, axe in e2e
- **Small diffs** — one concern per PR; `bun run check` before push

## Credits

- **Skills content** — [Addy Osmani](https://addyosmani.com) · [github.com/addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- **Site** — [Deepak Kumar Dewani](https://github.com/deepakkumardewani) · [github.com/deepakkumardewani/agent-skills](https://github.com/deepakkumardewani/agent-skills)

## Further reading

- [`SPEC.md`](SPEC.md) — requirements and acceptance criteria
- [`DESIGN.md`](DESIGN.md) — typography, color, layout tokens
- [`CLAUDE.md`](CLAUDE.md) — stack rules and agent guidance
