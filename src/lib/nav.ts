export const NAV_ITEMS = [
  { href: '/docs', label: 'Docs' },
  { href: '/quickstart', label: 'Quick start' },
  { href: '/about', label: 'About' },
] as const;

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/docs') {
    return pathname.startsWith('/docs');
  }
  return pathname === href;
}
