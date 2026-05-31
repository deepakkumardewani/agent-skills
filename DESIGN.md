---
name: addy-osmani-skills
description: Design system for the addy-osmani-skills tribute site — modern dev-docs with a warm amber accent.
colors:
  background: "#FAFAF9"
  surface: "#FFFFFF"
  surface-elevated: "#F5F5F4"
  surface-sunken: "#F5F5F4"
  primary: "#D97706"
  on-primary: "#FFFFFF"
  primary-hover: "#B45309"
  primary-subtle: "#FEF3C7"
  on-primary-subtle: "#92400E"
  secondary: "#1C1917"
  on-secondary: "#FAFAF9"
  on-surface: "#1C1917"
  on-surface-muted: "#57534E"
  on-surface-subtle: "#78716C"
  on-surface-inverse: "#FAFAF9"
  outline: "#E7E5E4"
  outline-strong: "#D6D3D1"
  divider: "#F5F5F4"
  focus-ring: "#F59E0B"
  link: "#B45309"
  link-hover: "#92400E"
  selection: "#FDE68A"
  success: "#15803D"
  warning: "#B45309"
  error: "#B91C1C"
  info: "#0369A1"
  code-bg: "#F5F5F4"
  code-fg: "#1C1917"
  code-comment: "#78716C"
  code-keyword: "#B45309"
  code-string: "#15803D"
  code-fn: "#0369A1"
  phase-foundations: "#57534E"
  phase-define: "#D97706"
  phase-plan: "#EA580C"
  phase-build: "#E11D48"
  phase-test: "#059669"
  phase-review: "#7C3AED"
  phase-simplify: "#0284C7"
  phase-ship: "#65A30D"
  phase-foundations-subtle: "#F5F5F4"
  phase-define-subtle: "#FEF3C7"
  phase-plan-subtle: "#FFEDD5"
  phase-build-subtle: "#FFE4E6"
  phase-test-subtle: "#D1FAE5"
  phase-review-subtle: "#EDE9FE"
  phase-simplify-subtle: "#E0F2FE"
  phase-ship-subtle: "#ECFCCB"
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 72px
    fontWeight: "700"
    lineHeight: 76px
    letterSpacing: -0.035em
  display-md:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: "700"
    lineHeight: 60px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: "700"
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: "600"
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: "600"
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 30px
    letterSpacing: 0em
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 26px
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 22px
    letterSpacing: 0em
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 18px
    letterSpacing: 0.005em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.02em
  caps-xs:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: "600"
    lineHeight: 14px
    letterSpacing: 0.08em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 22px
    letterSpacing: 0em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12.5px
    fontWeight: "400"
    lineHeight: 20px
    letterSpacing: 0em
rounded:
  none: "0"
  sm: "4px"
  DEFAULT: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  "2xl": "20px"
  full: "9999px"
spacing:
  unit: "8px"
  px-1: "4px"
  px-2: "8px"
  px-3: "12px"
  px-4: "16px"
  px-5: "20px"
  px-6: "24px"
  px-8: "32px"
  px-10: "40px"
  px-12: "48px"
  px-16: "64px"
  px-20: "80px"
  px-24: "96px"
  container-padding: "24px"
  container-max: "1280px"
  prose-max: "68ch"
  sidebar-width: "264px"
  card-gap: "16px"
  section-margin: "96px"
  page-gutter: "32px"
shadows:
  xs: "0 1px 1px rgba(28, 25, 23, 0.04)"
  sm: "0 1px 2px rgba(28, 25, 23, 0.06), 0 1px 1px rgba(28, 25, 23, 0.04)"
  md: "0 4px 8px rgba(28, 25, 23, 0.06), 0 2px 4px rgba(28, 25, 23, 0.04)"
  lg: "0 12px 24px rgba(28, 25, 23, 0.08), 0 4px 8px rgba(28, 25, 23, 0.04)"
  focus: "0 0 0 3px rgba(245, 158, 11, 0.35)"
motion:
  duration-instant: "80ms"
  duration-fast: "140ms"
  duration-base: "200ms"
  duration-slow: "320ms"
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-in-out: "cubic-bezier(0.65, 0, 0.35, 1)"
  ease-spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
components:
  card-standard:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.px-6}"
    shadow: "{shadows.xs}"
  card-elevated:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.xl}"
    padding: "{spacing.px-8}"
    shadow: "{shadows.md}"
  skill-header-card:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.xl}"
    padding: "{spacing.px-8}"
    gap: "{spacing.px-4}"
  phase-chip:
    height: "24px"
    padding: "0 10px"
    rounded: "{rounded.full}"
    textColor: "{colors.on-primary-subtle}"
    typography: "{typography.caps-xs}"
    backgroundColor: "{colors.primary-subtle}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.DEFAULT}"
    height: "40px"
    padding: "0 18px"
    typography: "{typography.label-md}"
    shadow: "{shadows.xs}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.DEFAULT}"
    height: "40px"
    padding: "0 16px"
    typography: "{typography.label-md}"
  button-ghost-hover:
    backgroundColor: "{colors.surface-elevated}"
  copyable-command:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.code-fg}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.DEFAULT}"
    padding: "8px 12px"
    typography: "{typography.code-md}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.DEFAULT}"
    height: "40px"
    padding: "0 14px"
    typography: "{typography.body-md}"
  input-field-focus:
    border: "1px solid {colors.focus-ring}"
    shadow: "{shadows.focus}"
  search-dialog:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.xl}"
    shadow: "{shadows.lg}"
    padding: "{spacing.px-4}"
    width: "560px"
  search-result-item:
    padding: "10px 12px"
    rounded: "{rounded.DEFAULT}"
    typography: "{typography.body-sm}"
  search-result-item-active:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.on-primary-subtle}"
  sidebar-section-label:
    typography: "{typography.caps-xs}"
    textColor: "{colors.on-surface-subtle}"
    padding: "0 12px"
    marginTop: "{spacing.px-6}"
    marginBottom: "{spacing.px-2}"
  sidebar-item:
    padding: "6px 12px"
    rounded: "{rounded.DEFAULT}"
    typography: "{typography.body-sm}"
    textColor: "{colors.on-surface-muted}"
  sidebar-item-active:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.on-primary-subtle}"
  prose-body:
    typography: "{typography.body-lg}"
    textColor: "{colors.on-surface}"
    maxWidth: "{spacing.prose-max}"
  code-block:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.code-fg}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.px-4}"
    typography: "{typography.code-md}"
---

## Brand & Style

addy-osmani-skills is a **tribute site**, not a corporate product. The visual language has to do two things at once: feel like a credible, modern dev-docs site (so engineers trust the content), and feel like a personal, hand-built thing (so it doesn't blur into the Vercel/Linear/shadcn template aesthetic that has homogenized 2025 dev-docs).

The chosen direction is **warm amber on a stone-neutral canvas**. Stone-warm grays (rather than cool zinc or slate) give every surface a hint of paper. Amber as the single saturated accent reads as confident, earthy, and lived-in — closer to a craftsman's sign than a SaaS marketing site. The result is "well-built, made by hand, takes its work seriously, doesn't take itself too seriously."

Personality keywords: **warm, plainspoken, considered, generous, modest**. We are *not* trying to be: clinical, futuristic, luxurious, playful, or maximalist.

Emotional response we want from a first-time visitor: *"This is somebody's careful work. I'll trust what it says."*

## Colors

The palette has one accent, one neutral spine, and eight phase-mapped chip colors.

**Neutral spine (Stone family):** The background is `Warm Off-White` (`#FAFAF9`), close to bleached newsprint. Body text sits at `Ink` (`#1C1917`) — near-black but with a brown undertone that pairs softly with amber. Muted text is `Stone 600` (`#57534E`) for relationships and secondary metadata; `Stone 500` (`#78716C`) for the lightest captions. The outline color is `Stone 200` (`#E7E5E4`) — visible enough to structure cards, light enough to never feel "boxed in."

**Accent (Amber):** The single saturated brand color is `Amber 600` (`#D97706`), used for primary buttons, the active sidebar item, focus rings (lightened to `Amber 500` with 35% alpha), links (in `Amber 700` for AA contrast on the warm background), and the `Define` phase chip. Hover for primary actions deepens to `Amber 700` (`#B45309`). Subtle backgrounds for selected states use `Amber 100` (`#FEF3C7`). Never use raw orange, raw gold, or anything saturated outside this scale — the warmth must come from the amber accent, not from competing warm hues.

**Phase chips (the 8 sidebar groups):** Each phase gets a distinct hue so chips are scannable in lists. Subtle chip backgrounds (`*-subtle` tokens) are 100-level tints; chip text uses the corresponding 700–800 level for contrast.

| Phase | Accent | Subtle bg |
| --- | --- | --- |
| Foundations | Stone 600 `#57534E` | Stone 100 |
| Define `/spec` | Amber 600 `#D97706` | Amber 100 |
| Plan `/plan` | Orange 600 `#EA580C` | Orange 100 |
| Build `/build` | Rose 600 `#E11D48` | Rose 100 |
| Test `/test` | Emerald 600 `#059669` | Emerald 100 |
| Review `/review` | Violet 600 `#7C3AED` | Violet 100 |
| Simplify `/code-simplify` | Sky 600 `#0284C7` | Sky 100 |
| Ship `/ship` | Lime 600 `#65A30D` | Lime 100 |

**Status colors** (`success`, `warning`, `error`, `info`) are tuned to harmonize with the warm background: warmer reds, deeper greens, slightly muted blues. They are reserved for actual semantic states, never decoration.

**Code coloring** in copyable command pills + code blocks uses Ink for default text, Stone 500 for comments, Amber 700 for keywords, Emerald 700 for strings, Sky 700 for function names. This is the same hue family as phase chips — the site has one color story end to end.

**Dark mode** (defined in `tokens.css` overrides, not in this YAML) keeps the same hue identity but inverts the neutrals: background becomes `Stone 950` (`#0C0A09`) with a faint warm undertone (not pure black), surface is `Stone 900` (`#1C1917`), elevated surfaces `Stone 800`, body text is `Stone 100`, muted text is `Stone 400`. Amber accent stays at `Amber 500` (slightly lighter for contrast). Phase subtle backgrounds drop to 800-level with 20% opacity overlays. The dark palette stays *warm dark*, never blue-cold dark.

## Typography

Two families, both open-source via Google Fonts: **Manrope** for all UI + reading text, **JetBrains Mono** for code.

**Manrope** was chosen over Inter/Geist deliberately. Inter is the default — using it makes the site look like every other 2025 dev-docs site. Manrope is a humanist sans with slightly rounded counters and a touch of warmth in the lowercase apertures, which pairs with the stone-amber palette without losing readability. It scales gracefully from 11px caps labels up to 72px display headlines. Weights used: 400 (body), 500 (labels, small UI), 600 (mid headings), 700 (display).

**JetBrains Mono** for code. Distinctive enough to feel hand-picked, ligature-friendly (we disable ligatures inside copyable commands because users will copy literal characters), excellent at 12–14px.

**Type levels and what each is for:**

- `display-lg` (72/76): landing hero headline only. One per page max.
- `display-md` (56/60): about-page headline, large section openers on landing.
- `headline-lg` (36/42): top-level page titles on `/docs` and skill pages (the skill name in the header card).
- `headline-md` (28/34): major section breaks inside long-form pages.
- `headline-sm` (22/28): subsection headers inside skill SKILL.md bodies (h2).
- `title-md` (18/24): card titles, sidebar group headings (rendered in caps-xs in practice, but title-md is the fallback weight reference).
- `body-lg` (18/30): reading body in prose. Skill SKILL.md content uses this.
- `body-md` (16/26): UI body, default for cards and most surfaces.
- `body-sm` (14/22): secondary descriptions, sidebar items, metadata.
- `label-md` (14/18): button labels, form labels.
- `label-sm` (12/16): small UI labels, badges.
- `caps-xs` (11/14, +0.08em tracking): sidebar group labels (FOUNDATIONS, DEFINE, etc.), phase chip text.
- `code-md` (14/22): copyable commands, inline `code`.
- `code-sm` (12.5/20): caption-level code, search dialog matches.

**Tracking** is negative on display/headline levels (-0.035em down to -0.005em) for tighter, more confident large text. Body sits at 0em. Labels get a small positive (0.005em). Caps get a deliberate +0.08em to feel like editorial small-caps.

## Layout & Spacing

The grid is built on an **8px unit**. Every padding, margin, and gap snaps to a multiple of 8 (with 4px allowed for chip and inline-code padding).

**Container widths:**
- `container-max: 1280px` for the docs shell (sidebar + content).
- `prose-max: 68ch` for reading content — long enough for code blocks to breathe, short enough to keep paragraph eye-travel comfortable.
- `sidebar-width: 264px` — wide enough for the longest skill name + a phase chip without truncation.

**Page rhythm:**
- `section-margin: 96px` between major landing sections.
- `card-gap: 16px` between cards in a grid.
- `container-padding: 24px` horizontal page gutter on mobile; `page-gutter: 32px` on desktop.

**Mobile** drops the sidebar into a slide-in drawer at <960px. Content padding compresses to 16–20px. The header collapses the search trigger into an icon button.

The site is generous with whitespace but not luxurious about it. Compare to impeccable: impeccable's negative space communicates "rare, considered, look slowly." Ours communicates "easy to scan, easy to find the thing." Less air, more density of useful content.

## Elevation & Depth

Hierarchy is conveyed primarily by **borders and tonal contrast**, not by heavy shadows. The site reads "structured, well-organized" — not "floating glass elements."

- `xs` shadow on default cards — barely visible, just enough to lift them off the page.
- `sm` shadow on inputs to imply tappability.
- `md` shadow on the skill-header card and search dialog when active/focused.
- `lg` shadow only on the search dialog when open over the page — clearly modal.
- `focus` shadow is a 3px amber ring at 35% opacity, used on every interactive element on focus-visible.

No frosted glass, no backdrop blur, no neon glows. Depth is structural, not theatrical.

## Shapes

Soft corners throughout — neither sharp (Linear-style) nor pillowy (consumer app style). The base radius is **8px (DEFAULT)** for most interactive elements: buttons, inputs, command pills, sidebar items.

- `4px (sm)` — inline code, small badges.
- `8px (DEFAULT/md)` — buttons, inputs, sidebar items, copyable commands.
- `12px (lg)` — standard cards.
- `16px (xl)` — featured/elevated cards (skill header card, search dialog).
- `20px (2xl)` — landing hero element edges.
- `9999px (full)` — phase chips, avatar, pill buttons.

The 8/12/16 step gives a clear hierarchy: small things have small corners, big things have bigger corners, but the ratio stays consistent so nothing looks out of family.

## Components

**Phase chip** (`<PhaseChip phase="..." />`): a `caps-xs` label inside a `full`-rounded pill, 24px tall, 10px horizontal padding. Background uses the matching `phase-*-subtle` token, text uses the `phase-*` token at full saturation. Sits inline with skill names, in the skill header card, and in search results.

**Skill header card** (`<SkillHeaderCard />`): elevated card (`rounded.xl`, `shadow.md`, `outline` border), 32px padding. Contains: phase chip + breadcrumb above the h1, skill name (`headline-lg`), one-line description (`body-lg`, `on-surface-muted`), and one or more copyable command pills below.

**Copyable command** (`<CopyableCommand command="/spec" />`): `code-bg` background, 1px outline, `rounded.DEFAULT`, `code-md` typography, 8/12 padding. A copy icon sits on the right; on click, the icon swaps to a checkmark for 1.2s and a screen-reader-only "Copied" announces.

**Buttons:**
- *Primary* (amber background, white text) for the main landing CTA and the search-open action.
- *Ghost* (outlined, no fill) for secondary actions like "Read on GitHub."
- Both: 40px tall, 8px corners, `label-md` typography, focus ring on focus-visible.

**Inputs** (search field, any text input): 40px tall, 8px corners, outline border. On focus, the border switches to `focus-ring` (amber) and a 3px shadow ring appears.

**Search dialog**: appears on `Cmd/Ctrl+K`. 560px wide, `rounded.xl`, `shadow.lg`, centered with a subtle backdrop dim (8% opacity ink overlay, no blur). Active result item gets `primary-subtle` background.

**Sidebar:**
- Group labels rendered as `caps-xs` in `on-surface-subtle`, with the slash command (`/spec`, `/plan`, etc.) appended in `code-sm` at the same color.
- Skill items at `body-sm`, padding 6/12, `rounded.DEFAULT`, color `on-surface-muted`. Active item swaps to `primary-subtle` bg + `on-primary-subtle` text.

**Prose** (rendered SKILL.md bodies): max-width `prose-max (68ch)`, `body-lg` line height. h2/h3 spacing scales with the type scale. Inline `code` uses `code-bg` + 4px corners + 2px padding. Pre-blocks use the `code-block` token. Blockquotes have a 3px left border in `outline-strong`. Links are amber, underline on hover. Lists use 8px gaps.

**Footer (every page):** plain text, `on-surface-subtle`, `body-sm`. Two lines: "A tribute to Addy Osmani's agent-skills" with a link to the source repo, and "Built by [maintainer]" with a link to the maintainer's site. No social icons, no newsletter signup, no marketing chrome.

## Design principles & build guardrails

These are the load-bearing rules for every build, polish, and review pass. They translate generic "premium design" psychology to **this** project, with the warm-amber-stone-Manrope direction already chosen. When two rules conflict, the earlier one wins.

### 1. The one feeling

A first-time visitor lands on `/` and has ~50ms to form a snap judgment that colors everything they read next. The single feeling we want them to leave with is:

> *"Somebody built this carefully. It takes its work seriously. It doesn't take itself too seriously."*

Every choice on the hero — type size, image, color, copy length, whitespace — gets judged against that one sentence. If a choice doesn't actively support it, cut the choice. If it actively undermines it (e.g., a flashing banner, a gradient hero illustration, breathless marketing copy), it's wrong even if it tests "well."

What this feeling rules out: futurism, luxury, playfulness, urgency, hype, "10x your X" copy, any signal of corporate scale.

### 2. The one action above the fold

There is exactly one primary CTA on the landing hero: **Browse skills →** (links to `/docs`). One. Not two, not "or learn more." The ADLC diagram lives below the hero as a supporting *educational* element, not as a competing CTA. The "View on GitHub" link sits in the header nav and the footer — it is never a primary action.

Forbidden on the landing hero: newsletter signup, social icons, "as seen in," analytics badges, multi-CTA rows, carousels, scrolling marquees, animated counters, stat bars, anything that implies the page is selling something.

### 3. Every section defends its existence

For every section on every page, ask: *if I deleted this, would the page be worse?* If the answer is "no" or "I'm not sure," delete it. The site has roughly four pages — each one should be ruthlessly short.

Default page section budgets (treat as hard caps):

- `/` (landing): hero + ADLC framework explainer + browse-by-phase grid + footer. Four sections. **Not** five.
- `/about`: tribute story + maintainer credit + how-to-help link + footer. Four sections.
- `/docs` (getting started): single content column. No sidebar callouts, no "what's next" cards beyond a single "browse skills" link at the bottom.
- `/docs/skills/[slug]`: header card + rendered SKILL.md + related skills + footer. Four blocks.

### 4. Hierarchy: one focal element per section

In any single viewport, the eye should land on exactly one element first. Build hierarchy in this order:

1. **Size** first. Bump `body-md` to `headline-sm` before reaching for color.
2. **Weight** second. 600 vs 400 does most of the work.
3. **Color contrast** third. The amber accent is for *focal* elements, never decoration.
4. **Space** fourth. Whitespace around an element emphasizes it.

`display-lg` (72px) appears at most **once per page**, and only on `/` and `/about`. `headline-lg` (36px) is the h1 on docs pages. If you find yourself using two `display-lg`s on a page, the second one is wrong.

The 25%-zoom test: at 25% browser zoom (or eyes-squinted), the focal element of each section should still be obviously focal. If hierarchy disappears at squint distance, fix size/weight before adding color.

### 5. Whitespace is a confidence move

The 96px `section-margin` and 68ch `prose-max` are deliberate. Start spacious. Never "tighten things up" in a later polish pass — that's how dev-docs sites end up edge-to-edge and looking cheap. If a section feels empty, the answer is usually fewer words, not more elements.

Mobile (<960px) compresses spacing — but never below 16px container padding or 48px section margin. Below those, the site reads as built-on-a-budget.

### 6. Micro-interactions are the memory

Every interactive element must have these states designed (not added later):

| State | Visual contract |
| --- | --- |
| **Default** | Per the component token. |
| **Hover** | Subtle: background tint shift to `surface-elevated`, or 1 step of accent for primary buttons. ~140ms ease-out. |
| **Focus-visible** | Always the 3px amber `focus-ring` shadow. Never remove the outline without replacement. |
| **Active / pressed** | Slight scale (0.98) or 1 step deeper color. Instant (no transition). |
| **Disabled** | 50% opacity + `cursor: not-allowed`. Hover does nothing. |
| **Loading** | Inline spinner or shimmer — never a full-page blocker. Text stays in place. |
| **Success** | Brief checkmark or color flash (≤1.2s), then return to default. |
| **Empty** | Designed surface: short headline + one CTA. Never a blank white area. |
| **Error** | Warm, non-punitive copy. Errors use the `error` token, never red-screaming red. |

The peaks of memory we explicitly design for:

- **Copy command → checkmark swap** (~1.2s peak)
- **Search open via `Cmd/Ctrl+K`** (fades in 140ms, search field auto-focuses)
- **Theme toggle** (icon morphs sun↔moon; tokens swap, no flash, no flicker)
- **First scroll past the hero** (the ADLC diagram fades in once, not on every scroll-back — `IntersectionObserver` with `once: true`)
- **Sidebar item activation** (active state animates from underline to filled background, ~200ms)

All animations respect `prefers-reduced-motion` — when set, animations become instant token swaps with no transitions.

### 7. Respect the user

The site has **no** modals on first visit, **no** cookie banner (we don't track), **no** newsletter chasers, **no** analytics that need consent, **no** autoplay video, **no** scroll hijacking, **no** "do you want notifications" prompts, **no** auto-popping demo CTAs.

If we ever add analytics, it's privacy-respecting and self-hosted (Plausible, Umami, or none). This decision belongs to SPEC.md and requires an "ask first" before adoption.

Copy assumes the reader is a senior developer: no breathless intros, no "the future of X," no "imagine if…," no hollow superlatives. The banned-phrase list in CLAUDE.md is the floor, not the ceiling.

### 8. Premium signal economy

These are the *cheap* signals of premium we lean on, in order of leverage:

1. **Type discipline** — Manrope + JetBrains Mono only, scale locked, never one-off sizes.
2. **Whitespace generosity** — 96px between major sections.
3. **One accent** — amber for focal only, nothing decorative.
4. **Smooth micro-interactions** — 140–200ms eases on hover, focus, active.
5. **Considered loading + empty states** — not blank white.
6. **Image and SVG craft** — only hand-curated assets. No stock photography, no generic gradient meshes, no AI-generated illustrations.

These are the *cheap* signals of NOT-premium we delete on sight:

- More than one primary CTA per viewport.
- Stock photo people pointing at laptops.
- "Powered by AI ✨" / "next-generation" / "supercharge" copy.
- Decorative emoji in headings.
- Gradient backgrounds on cards that aren't the focal element.
- Drop shadows on everything.
- Icon-only buttons with no aria-label.
- Three-CTA hero rows.
- Fake reviews / fake testimonials / fake company logos.
- Marquee scrolls of "trusted by" logos.

### 9. The 5-minute review checklist (for `/build` and `/polish` passes)

Run this whenever finishing a page or major component. Walk top to bottom; any "fail" blocks the merge.

#### First impression
- [ ] On `/` hero: within 3 seconds, can a new visitor state what the site does and who it's for?
- [ ] Exactly one primary CTA above the fold? (Not zero, not two.)
- [ ] At 25% browser zoom, does the hero still read clearly?
- [ ] Does the hero convey one coherent feeling matching §1 above?

#### Cognitive load
- [ ] Can any element be removed without losing meaning? (If yes — remove it.)
- [ ] Is whitespace generous enough that the eye has room to rest?
- [ ] Are related elements visibly grouped — closer to each other than to unrelated ones?
- [ ] Is the top nav predictable and short (≤5 items)?

#### Hierarchy
- [ ] Does each section have one obvious focal element?
- [ ] At 25% zoom, is the hierarchy still readable?
- [ ] Is size + weight doing the work before color?
- [ ] Are non-primary elements actively de-emphasized (not just "not emphasized")?

#### System discipline
- [ ] Every spacing value comes from the token scale (no ad-hoc `padding: 13px`).
- [ ] Every type size + weight from the locked scale.
- [ ] Every color is a token, no hardcoded hex anywhere in components.
- [ ] Body text left-aligned, ~60–80ch measure.

#### Polish + depth
- [ ] Shadows + tonal lift only on focal elements.
- [ ] Every interactive element has hover, focus-visible, active states.
- [ ] Transitions 140–200ms where present; instant where they should be (active/pressed).
- [ ] Loading, empty, error states designed — not afterthoughts.
- [ ] `prefers-reduced-motion` honored.

#### Respect
- [ ] No modals, popups, cookie banners, autoplay video, fake urgency.
- [ ] Copy assumes a smart reader; no banned phrases (see CLAUDE.md).
- [ ] Page works without JavaScript: HTML renders, content is readable, navigation works.
- [ ] Page is fast on slow connections: no >100KB JS on landing, no blocking third-party requests.

### 10. Things to deliberately avoid (project-specific)

- **Don't ape Linear / Vercel / shadcn docs.** Their visual language is great, but copying it makes us look like an AI template. We share *principles* (clarity, typography discipline, restraint) — we don't share *aesthetics* (cool-gray surfaces, Inter, indigo accent).
- **Don't copy impeccable.** Their editorial register (cream parchment, hairline serif, marbled gold, hand-drawn diagrams) is the strongest single design choice in the space. Reusing it dilutes both sites. Our register is *modern dev-docs with warmth*, not editorial.
- **Don't make the site about Anthropic.** This is a tribute to Addy's work that happens to be most useful to Claude Code users. The framing is *agent-skills*, not "Claude Code skills."
- **Don't add a blog, changelog, or release notes** to v1. The skills *are* the content. Anything else is scope creep.
- **Don't gamify or quantify usage.** No "x skills used by y devs," no GitHub star count badges in the hero, no trending lists. The work speaks for itself.
- **Don't add dark-mode-specific easter eggs** (different illustrations, different copy) — the only thing that changes in dark mode is tokens.

## Open items deferred from SPEC §8

- **Search library** (`Fuse.js` vs `minisearch` vs `Pagefind`) — to be picked during `/plan`. Pagefind has the strongest Astro integration story; evaluate first.
- **Maintainer name + link** for `/about` and the footer — placeholder `[maintainer]` everywhere until you confirm.
- **ADLC diagram treatment** on the landing — defer to `/impeccable craft` during the build phase. Default: a static SVG showing the 7-phase cycle with the phase chip colors mapped, no animation beyond a 200ms intro fade.
