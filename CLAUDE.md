# Project Instructions — addy-osmani-skills

> SPEC says **what** to build; this file says **how to work**. Priority: SPEC > DESIGN > this file > model defaults.

## What this project is

A static Astro site publishing Addy Osmani's `agent-skills` as a browsable docs site organized by ADLC lifecycle. **Personal tribute** — not official, not Anthropic-affiliated.

## Stack (locked)

| Concern | Tool |
|---|---|
| Runtime / pkg manager | Bun |
| Framework | Astro (static, Vercel adapter) |
| Language | TypeScript strict |
| Lint + format | Biome only (no ESLint, no Prettier) |
| Tests | Vitest (unit), Playwright (e2e) |
| Host | Vercel |
| Skills source | `../agent-skills/` → `scripts/sync-skills.ts` |

Never add: Tailwind, shadcn, MUI, Chakra, any UI-kit/CSS-in-JS, or a backend.

## Astro architecture

**Server-render by default.** Use `.astro` for static surfaces. Only use client islands for interactive UI:

| Static (`.astro`) | Island (client) |
|---|---|
| Header, footer, sidebar, phase chip, skill card | Search dialog, theme toggle, mobile nav, copy button |
| Markdown body, landing hero, ADLC overview | — |

Island hydration order: `client:idle` > `client:visible` > `client:load`. Never default to `client:load`.

**Content collections are the data layer.** Skills live in `src/content/skills/`. Use `getCollection` / `getEntry` — never `fs`.

**Layouts:**
- `BaseLayout.astro` — HTML shell, `<head>`, theme script, footer
- `DocsLayout.astro` — Base + sidebar. For `/docs/**`
- `MarketingLayout.astro` — Base + centered. For `/`, `/about`, `/404`

Don't import layouts inside layouts.

## CSS

Plain CSS only. Two layers:

- **`src/styles/tokens.css`** — CSS custom properties. Light theme default; dark via `[data-theme="dark"]`. Naming: `--{category}-{role}-{modifier?}` (e.g. `--color-fg-default`, `--space-4`, `--radius-md`). Never use raw hex/px in components — add a token first.
- **Component `<style>` blocks** — Astro-scoped. Global selectors only in `src/styles/global.css`.

**Dark mode:** Inline `<script>` in `<head>` reads `localStorage.theme` / `prefers-color-scheme`, sets `data-theme` before paint (no FOUC). Components never branch on theme. Always honor `prefers-reduced-motion`.

## Skills data flow

```
../agent-skills/          (read-only source of truth)
  ├── skills-data.js
  └── skills/<phase>/<skill>/SKILL.md
        ↓
scripts/sync-skills.ts    (idempotent sync)
        ↓
src/data/skills-data.ts   (typed metadata)
src/content/skills/*.md   (synced bodies — never hand-edit)
```

- `bun run sync-skills` is idempotent; diffs before writing.
- `../agent-skills/` is **read-only**. Never write to it.
- Synced files are generated artifacts. Fix upstream, then re-sync.

## Routing (locked — SPEC §3)

Sidebar groups in order: **Foundations → Define → Plan → Build → Test → Review → Simplify → Ship**

Pages: `/`, `/about`, `/docs`, `/docs/skills/[slug]`, `/404`. Don't reorder groups or add routes without updating SPEC.md first.

## Per-skill page contract

Every `/docs/skills/[slug]` renders:
1. `<SkillHeaderCard />` — name (h1), description, `<PhaseChip />`, `<CopyableCommand />`
2. Body — SKILL.md via content collection, `.prose` class only
3. `<RelatedSkills />` — omit section entirely if empty

## Dev commands

```bash
bun install            # deps
bun run sync-skills    # sync from ../agent-skills/
bun run dev            # http://localhost:4321  (usually already running — don't start a second)
bun run check          # lint + typecheck + unit tests (must pass before done)
bun run test           # vitest
bun run test:e2e       # playwright
bun run build          # production build
bun run preview        # preview locally
```

Restart dev server (not just HMR) when changing: `astro.config.mjs`, `src/content/config.ts`, `scripts/sync-skills.ts`.

## Tests

- `src/lib/**` and `scripts/sync-skills.ts` → unit tests required.
- User-visible flows (SPEC §5) → Playwright specs required.
- `bun run check` must pass before any task is done. No `--no-verify`.
- Bug fix workflow: failing test first → fix → green.

## Prose + copy

Voice: warm, plainspoken, developer-honest. Not AI-generic.

**Banned words/phrases:** `seamless`, `robust`, `delve`, `elevate`, `empower`, `pivotal`, `tapestry`, `leverage`, `unlock`, `supercharge`, `next-level`, `game-changing`, `data-driven`, "In today's…", "Gone are the days…", "Whether you're…", "Let's dive in.", hollow confidence ("simply", "just", "effortlessly"), em-dash overuse.

SKILL.md bodies are exempt — those are Addy's words.

## Boundaries

### Always do
- `bun run check` before done.
- Update SPEC.md if a structural decision changes.
- Use design tokens for every repeated color/spacing/type value.
- Footer credits Addy on every page; `/about` credits maintainer.

### Ask first
- New runtime dependency (especially > 5 KB gzipped).
- Changing sidebar groups or order.
- New top-level route.
- Analytics or third-party runtime requests.
- Changing deployment target away from Vercel.
- Push to `main`.
- Breaking change to `skills-data.ts` schema.

### Never do
- Mimic impeccable's visual identity (cream / hairline serif / marbled gold).
- Frame site as official or Anthropic-affiliated.
- Commit secrets, `.env`, API keys.
- `git push --force` or rewrite shared history.
- Skip hooks / bypass Biome/typecheck/test failures.
- Add backend, DB, or server-side search.
- Hand-edit synced skill content.
- Add Tailwind, shadcn, or any UI framework.

## Skill invocations

| Situation | Skill |
|---|---|
| New feature | `/spec` → `/plan` → `/build` → `/test` → `/review` |
| Bug | `/debug` or `agent-skills:debugging-and-error-recovery` |
| Visual work | `/impeccable craft` (`polish`, `typeset`, `colorize`, `layout`) |
| UI review before merge | `/web-design-guidelines` + `/code-review` |
| Verify UI works | `/run` then `/verify` |
| Astro patterns | `.agents/skills/astro/` or `.agents/skills/astro-best-practices/` |
