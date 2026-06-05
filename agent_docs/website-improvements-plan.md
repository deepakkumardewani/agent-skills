# Website Improvements — PLAN

Companion to [website-improvements-spec.md](website-improvements-spec.md). Task checklist lives in
[website-improvements-tasks.md](website-improvements-tasks.md).

## Strategy

One refactor must land first: the **phase model** (Foundations→Meta, skill reassignment, lead-skill
triggers). Almost every other change reads regenerated `skills-data.ts` or the renamed phase tokens,
so it's the root of the dependency graph and ships as Slice 1. After that, the remaining work is
independent, user-visible slices (header, homepage, footer, quickstart, docs) that can land in any
order. Governance docs (CLAUDE.md / root SPEC.md) land last so they describe the finished state.

Each slice is a complete vertical path: data → component → copy → test. No horizontal "do all the
CSS, then all the tests" layers.

## Dependency graph

```
Slice 1  Data & naming foundation  ─┬─> Slice 2  Header
(phase map rename, reassignment,    ├─> Slice 3  Homepage
 lead-skill triggers, acronym       ├─> Slice 4  Footer / tribute (+ about copy)
 names, token rename, skill-page    ├─> Slice 5  Quick Start page (+ nav link, hero CTA)
 trigger UI)                        └─> Slice 6  Docs enrichment
                                                     │
                          Slice 7  Governance docs <─┘  (describes final state)
```

- Slice 1 blocks everything (type rename won't compile until all `'foundations'` references are fixed;
  regenerated data feeds search, grid, docs).
- Slice 5 creates `/quickstart` **and** adds its nav link + hero CTA, so no dead links exist at any
  point (Slice 2 leaves nav = Docs/About; Slice 5 inserts Quick start).
- Slice 7 (CLAUDE.md, root SPEC.md) is last — it documents what the previous slices built.

## Why this order

1. **Slice 1 first** — it's a cross-cutting refactor that must land atomically (TypeScript won't
   pass with a half-renamed `Phase` union). Everything downstream assumes the new data.
2. **Slices 2–6** are leaf features, each independently testable and revertible.
3. **Slice 7 last** — governance should never lead implementation; update it once behavior is final.

## Checkpoints (stop, run gates, eyeball)

- **CP-A** after Slice 1: `bun run sync-skills` clean diff, `bun run check` green. Sidebar shows
  "Meta", skills in README groups, names acronym-correct, non-lead skills show no command. ← biggest
  risk gate.
- **CP-B** after Slice 3: header + homepage visually correct in browser (GitHub icon, hero width,
  Commands table).
- **CP-C** after Slice 6: full e2e suite green; all README content surfaced and links resolve.
- **CP-D** after Slice 7: governance docs match reality; final `bun run check` + `bun run build`.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| `Phase` rename misses a literal `'foundations'` → runtime/anchor break | grep for `foundations` across `src/` + `scripts/` before CP-A; e2e asserts "Meta" present, "Foundations" absent |
| `SkillHeaderCard` silently falls back to phase command when `triggers=[]` (current behavior) | Slice 1 explicitly changes this to render "Activates automatically" — covered by an e2e on a non-lead skill |
| Re-sync produces a large unintended diff | `sync-skills` is idempotent + diffs before write; review the diff at CP-A |
| Homepage copy drifts from README / uses banned words | Spec §5.1 pins copy to README lines; review against banned-words list |
| Footer tribute logic leaks onto non-about pages | e2e asserts presence on `/about`, absence on `/` and `/docs` |
| Schema/governance change forgotten | Slice 7 is a required task, gated at CP-D |

## Out of scope

Backend/server search, new runtime deps, UI frameworks, analytics, visual-identity changes, ADLC
diagram redesign (Meta stays outside the loop, same as Foundations did).
