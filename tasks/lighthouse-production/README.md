# Lighthouse — production baseline

Audited against **https://addy-osmani-skills.vercel.app** on 2026-06-05.

| URL | Performance | Accessibility | Best Practices | SEO |
|-----|-------------|---------------|------------------|-----|
| `/` | 100 | 100 | 100 | 100 |
| `/docs/skills/spec-driven-development` | 100 | 100 | 100 | 100 |

```bash
bunx lighthouse https://addy-osmani-skills.vercel.app/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --quiet --chrome-flags="--headless" \
  --output=json --output-path=./tasks/lighthouse-production/landing.json
```
