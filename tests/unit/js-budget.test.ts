import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  extractScriptRefsFromHtml,
  JS_BUDGET_BYTES,
  measurePageJsGzip,
} from '../../src/lib/js-budget';

const hasProductionBuild = existsSync('dist/index.html');

describe('js-budget', () => {
  it('extracts unique astro script references from HTML', () => {
    const html = `
      <script type="module" src="/_astro/client.abc.js"></script>
      <script type="module" src="/_astro/client.abc.js"></script>
      <script type="module" src="/_astro/SearchDialog.def.js"></script>
    `;

    expect(extractScriptRefsFromHtml(html)).toEqual([
      '_astro/client.abc.js',
      '_astro/SearchDialog.def.js',
    ]);
  });

  it.skipIf(!hasProductionBuild)(
    'keeps landing and skill pages within gzip budgets after build',
    () => {
      const landing = measurePageJsGzip('dist', 'index.html');
      const skill = measurePageJsGzip('dist', 'docs/skills/spec-driven-development/index.html');

      expect(landing.totalGzipBytes).toBeLessThanOrEqual(JS_BUDGET_BYTES.landing);
      expect(skill.totalGzipBytes).toBeLessThanOrEqual(JS_BUDGET_BYTES.skill);
    },
  );
});
