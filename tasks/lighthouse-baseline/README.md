# Lighthouse baseline (Slice 12)

Audited with `bun run preview` production build (port 4323) on 2026-06-02.

| URL | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| `/` | 99 | 100 | 100 | 100 |
| `/docs/skills/spec-driven-development` | 99 | 100 | 100 | 100 |

Raw JSON: `landing.json`, `skill-spec-driven-development.json`.

Command:

```bash
bun run build && bun run preview --port 4322
bunx lighthouse http://127.0.0.1:4322/ --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless" --output=json --output-path=./tasks/lighthouse-baseline/landing.json
```
