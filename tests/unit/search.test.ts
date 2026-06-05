import { describe, expect, it } from 'vitest';
import { skillsData } from '../../src/data/skills-data';
import {
  createSearchIndex,
  descriptionSnippetForQuery,
  highlightMatch,
  normalizeSearchQuery,
  slugFromQuery,
} from '../../src/lib/search';

describe('highlightMatch', () => {
  it('emphasizes a case-insensitive substring in display names', () => {
    const segments = highlightMatch('Debugging And Error Recovery', 'debug');
    expect(segments).toEqual([
      { text: 'Debug', highlight: true },
      { text: 'ging And Error Recovery', highlight: false },
    ]);
  });

  it('returns plain text when the query is empty', () => {
    expect(highlightMatch('Spec Driven Development', '   ')).toEqual([
      { text: 'Spec Driven Development', highlight: false },
    ]);
  });

  it('treats regex metacharacters in the query as literals', () => {
    const segments = highlightMatch('Foo (bar)', '(bar)');
    expect(segments).toEqual([
      { text: 'Foo ', highlight: false },
      { text: '(bar)', highlight: true },
    ]);
  });
});

describe('descriptionSnippetForQuery', () => {
  const longDescription =
    'Optimizes agent context setup. Use when starting a new session, when agent output quality degrades, when switching between tasks, or when you need to configure rules files and context for a project.';

  it('returns the full description when the query is empty', () => {
    expect(descriptionSnippetForQuery(longDescription, '')).toEqual({
      text: longDescription,
      leadingEllipsis: false,
      trailingEllipsis: false,
    });
  });

  it('keeps an early description match at the start of the snippet', () => {
    const snippet = descriptionSnippetForQuery(longDescription, 'context');
    expect(snippet.leadingEllipsis).toBe(false);
    expect(snippet.text.toLowerCase()).toContain('context');
    expect(snippet.text.startsWith('Optimizes agent')).toBe(true);
  });

  it('centers a late description match with leading ellipsis', () => {
    const snippet = descriptionSnippetForQuery(longDescription, 'switching');
    expect(snippet.leadingEllipsis).toBe(true);
    expect(snippet.trailingEllipsis).toBe(true);
    expect(snippet.text.toLowerCase()).toContain('switching');
    expect(snippet.text.startsWith('Optimizes agent')).toBe(false);
  });

  it('returns a prefix snippet when the query does not match the description', () => {
    const snippet = descriptionSnippetForQuery(longDescription, 'nomatch');
    expect(snippet.leadingEllipsis).toBe(false);
    expect(snippet.text).toBe(longDescription.slice(0, 150));
  });

  it('recenters long matches near the end of very long descriptions', () => {
    const tailMatchDescription = `${'word '.repeat(80)}terminal anchor phrase here`;
    const snippet = descriptionSnippetForQuery(tailMatchDescription, 'anchor', 60);
    expect(snippet.text.toLowerCase()).toContain('anchor');
    expect(snippet.leadingEllipsis).toBe(true);
    expect(snippet.text.length).toBeLessThanOrEqual(65);
  });
});

describe('search lib', () => {
  const index = createSearchIndex();

  it('indexes every synced skill', () => {
    expect(index.skillCount).toBe(skillsData.skills.length);
    expect(index.skillCount).toBeGreaterThanOrEqual(20);
  });

  it('returns an exact slug match at the top of results', () => {
    const results = index.search('test-driven-development');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.slug).toBe('test-driven-development');
  });

  it('returns an exact slug match first when the query uses spaces instead of hyphens', () => {
    const results = index.search('test driven development');
    expect(results[0]?.slug).toBe('test-driven-development');
  });

  it('does not pin a skill when a slug prefix matches multiple skills', () => {
    const results = index.search('code', 8);
    const slugs = results.map((result) => result.slug);
    expect(slugs).toContain('code-review-and-quality');
    expect(slugs).toContain('code-simplification');
  });

  it('pins the skill when a slug prefix uniquely identifies one skill', () => {
    const results = index.search('test-driven', 8);
    expect(results[0]?.slug).toBe('test-driven-development');
  });

  it('matches partial words in skill names and descriptions', () => {
    const results = index.search('debug');
    const slugs = results.map((result) => result.slug);
    expect(slugs).toContain('debugging-and-error-recovery');
  });

  it('finds skills when searching by phase name', () => {
    const results = index.search('define');
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((result) => result.phase === 'define' || result.phaseLabel === 'Define'),
    ).toBe(true);
    expect(results.some((result) => result.slug === 'spec-driven-development')).toBe(true);
  });

  it('ranks Define-phase skills first for the phase label query "define"', () => {
    const results = index.search('define', 8);
    const defineSlugs = results.filter((result) => result.phase === 'define').map((r) => r.slug);
    const nonDefine = results.filter((result) => result.phase !== 'define');
    expect(defineSlugs.length).toBeGreaterThan(0);
    if (nonDefine.length > 0) {
      const firstNonDefineIndex = results.findIndex((result) => result.phase !== 'define');
      const lastDefineIndex = results.findLastIndex((result) => result.phase === 'define');
      expect(lastDefineIndex).toBeLessThan(firstNonDefineIndex);
    }
  });

  it('ranks Meta skills first for the "meta" query', () => {
    const results = index.search('meta', 8);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.phase).toBe('meta');
    expect(results.every((result) => result.phase === 'meta')).toBe(true);
  });

  it('ranks Define-phase skills ahead of unrelated partial matches for "def"', () => {
    const results = index.search('def', 8);
    const defineIndex = results.findIndex((result) => result.phase === 'define');
    const apiIndex = results.findIndex((result) => result.slug === 'api-and-interface-design');
    expect(defineIndex).toBeGreaterThanOrEqual(0);
    if (apiIndex >= 0) {
      expect(defineIndex).toBeLessThan(apiIndex);
    }
  });

  it('returns no results for nonsense queries', () => {
    expect(index.search('zzzznotaskill')).toEqual([]);
  });

  it('returns no results for blank queries', () => {
    expect(index.search('')).toEqual([]);
    expect(index.search('   ')).toEqual([]);
  });

  it('returns no results for slash-only queries', () => {
    expect(index.search('/')).toEqual([]);
  });

  it('finds Define-phase skills when searching by slash command /spec', () => {
    const results = index.search('/spec');
    const slugs = results.map((result) => result.slug);
    expect(slugs).toContain('spec-driven-development');
  });

  it('normalizes slash-prefixed queries and matches lead skills by trigger only', () => {
    expect(normalizeSearchQuery('/spec')).toBe('spec');
    const slashResults = index.search('/spec', 5).map((result) => result.slug);
    expect(slashResults).toEqual(['spec-driven-development']);
    const bareResults = index.search('spec', 5).map((result) => result.slug);
    expect(bareResults[0]).toBe('spec-driven-development');
    expect(bareResults.length).toBeGreaterThan(slashResults.length);
  });

  it('finds TDD for /test via trigger metadata', () => {
    const results = index.search('/test', 8);
    expect(results.map((result) => result.slug)).toContain('test-driven-development');
    expect(results[0]?.slug).toBe('test-driven-development');
  });

  it('maps slug-shaped queries with slugFromQuery', () => {
    expect(slugFromQuery('Test Driven Development')).toBe('test-driven-development');
  });

  it('finds the lead skill by slash command /build', () => {
    const results = index.search('/build');
    const slugs = results.map((result) => result.slug);
    expect(slugs).toContain('incremental-implementation');
    expect(slugs).not.toContain('frontend-ui-engineering');
  });

  it('includes primaryTrigger on results for ADLC skills', () => {
    const results = index.search('spec-driven-development');
    expect(results[0]?.primaryTrigger).toBe('/spec');
  });

  it('omits primaryTrigger for Meta skills without triggers', () => {
    const all = index.listAll();
    const contextEngineering = all.find((result) => result.slug === 'using-agent-skills');
    expect(contextEngineering?.primaryTrigger).toBeUndefined();
  });

  it('listAll returns every skill in phase order then alphabetical', () => {
    const all = index.listAll();
    expect(all).toHaveLength(skillsData.skills.length);
    expect(all[0]?.phase).toBe('meta');
    const defineStart = all.findIndex((result) => result.phase === 'define');
    const planStart = all.findIndex((result) => result.phase === 'plan');
    expect(defineStart).toBeGreaterThan(-1);
    expect(planStart).toBeGreaterThan(defineStart);
  });
});
