/** Docs shell sidebar collapses below this width (DESIGN.md). */
export const MOBILE_NAV_BREAKPOINT_PX = 960;

export const MOBILE_NAV_MEDIA_QUERY = `(max-width: ${MOBILE_NAV_BREAKPOINT_PX - 1}px)`;

export function isDocsRoute(pathname: string): boolean {
  return pathname === '/docs' || pathname.startsWith('/docs/');
}

export function shouldShowMobileNav(pathname: string, isMobileViewport: boolean): boolean {
  return isMobileViewport && isDocsRoute(pathname);
}

export function skillHref(slug: string): string {
  return `/docs/skills/${slug}`;
}

export function isSkillActive(pathname: string, slug: string): boolean {
  return pathname === skillHref(slug);
}
