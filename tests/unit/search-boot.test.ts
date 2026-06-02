import { describe, expect, it } from 'vitest';

function isDocsRoute(pathname: string): boolean {
  return pathname === '/docs' || pathname.startsWith('/docs/');
}

describe('search-boot route gating', () => {
  it('treats docs index and skill pages as docs routes', () => {
    expect(isDocsRoute('/docs')).toBe(true);
    expect(isDocsRoute('/docs/skills/spec-driven-development')).toBe(true);
  });

  it('does not preload search on marketing routes', () => {
    expect(isDocsRoute('/')).toBe(false);
    expect(isDocsRoute('/about')).toBe(false);
    expect(isDocsRoute('/404')).toBe(false);
  });
});
