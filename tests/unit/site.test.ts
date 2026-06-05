import { describe, expect, it } from 'vitest';
import { addy, maintainer, site } from '../../src/lib/site';

describe('site constants', () => {
  it('exports maintainer profile links', () => {
    expect(maintainer.name).toBe('Deepak Kumar Dewani');
    expect(maintainer.url).toContain('github.com/deepakkumardewani');
  });

  it('exports tribute site repo metadata', () => {
    expect(site.repoUrl).toContain('agent-skills');
  });

  it('exports Addy Osmani attribution links', () => {
    expect(addy.name).toBe('Addy Osmani');
    expect(addy.siteUrl).toBe('https://addyosmani.com');
    expect(addy.repoUrl).toContain('addyosmani/agent-skills');
  });
});
