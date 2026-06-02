import { describe, expect, it } from 'vitest';
import {
  isDocsRoute,
  isSkillActive,
  MOBILE_NAV_BREAKPOINT_PX,
  MOBILE_NAV_MEDIA_QUERY,
  shouldShowMobileNav,
  skillHref,
} from '../../src/lib/mobile-nav';

describe('mobile-nav helpers', () => {
  it('uses the 960px docs sidebar breakpoint', () => {
    expect(MOBILE_NAV_BREAKPOINT_PX).toBe(960);
    expect(MOBILE_NAV_MEDIA_QUERY).toBe('(max-width: 959px)');
  });

  it('detects docs routes', () => {
    expect(isDocsRoute('/docs')).toBe(true);
    expect(isDocsRoute('/docs/skills/spec-driven-development')).toBe(true);
    expect(isDocsRoute('/about')).toBe(false);
    expect(isDocsRoute('/')).toBe(false);
  });

  it('shows mobile nav only on docs routes in mobile viewports', () => {
    expect(shouldShowMobileNav('/docs', true)).toBe(true);
    expect(shouldShowMobileNav('/docs/skills/build', true)).toBe(true);
    expect(shouldShowMobileNav('/docs', false)).toBe(false);
    expect(shouldShowMobileNav('/about', true)).toBe(false);
  });

  it('builds skill hrefs and active state from pathname', () => {
    expect(skillHref('build')).toBe('/docs/skills/build');
    expect(isSkillActive('/docs/skills/build', 'build')).toBe(true);
    expect(isSkillActive('/docs/skills/build', 'test')).toBe(false);
  });
});
