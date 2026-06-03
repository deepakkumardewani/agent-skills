import MiniSearch from 'minisearch';
import type { Phase, Skill } from '../data/skills-data';
import { skillsData } from '../data/skills-data';
import { formatSkillDisplayName, getPhaseMeta, PHASE_ORDER } from './skills';

export interface SearchResult {
  slug: string;
  name: string;
  displayName: string;
  description: string;
  phase: Phase;
  phaseLabel: string;
  primaryTrigger?: string;
}

interface SearchDocument {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  phase: Phase;
  phaseLabel: string;
  triggerText: string;
  primaryTrigger?: string;
}

export interface SearchIndex {
  skillCount: number;
  listAll(): SearchResult[];
  search(query: string, limit?: number): SearchResult[];
}

export interface HighlightSegment {
  text: string;
  highlight: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Split display text into plain/highlight segments for a case-insensitive query match. */
export function highlightMatch(text: string, query: string): HighlightSegment[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [{ text, highlight: false }];
  }

  const pattern = new RegExp(escapeRegExp(trimmed), 'gi');
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, index), highlight: false });
    }
    segments.push({ text: match[0], highlight: true });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), highlight: false });
  }

  return segments.length > 0 ? segments : [{ text, highlight: false }];
}

/** ~2 lines of body-sm in the search result row */
const DESCRIPTION_SNIPPET_MAX_CHARS = 150;
/** When the first match is earlier than this, show from the start of the description */
const DESCRIPTION_MATCH_LEAD_CHARS = 72;
const DESCRIPTION_MATCH_CONTEXT_CHARS = 48;

export interface DescriptionSnippet {
  text: string;
  leadingEllipsis: boolean;
  trailingEllipsis: boolean;
}

function findMatchIndex(text: string, query: string): number {
  const trimmed = query.trim();
  if (!trimmed) {
    return -1;
  }
  return text.toLowerCase().indexOf(trimmed.toLowerCase());
}

function snapStartToWord(text: string, start: number): number {
  if (start <= 0) {
    return 0;
  }
  const space = text.lastIndexOf(' ', start);
  return space === -1 ? start : space + 1;
}

function snapEndToWord(text: string, end: number): number {
  if (end >= text.length) {
    return text.length;
  }
  const space = text.indexOf(' ', end);
  return space === -1 ? end : space;
}

/**
 * Picks description text that fits the clamped result row and keeps query matches visible.
 */
export function descriptionSnippetForQuery(
  description: string,
  query: string,
  maxChars = DESCRIPTION_SNIPPET_MAX_CHARS,
): DescriptionSnippet {
  const trimmed = query.trim();
  if (!trimmed) {
    return { text: description, leadingEllipsis: false, trailingEllipsis: false };
  }

  const matchIndex = findMatchIndex(description, trimmed);
  if (matchIndex === -1) {
    const end = Math.min(description.length, maxChars);
    return {
      text: description.slice(0, end),
      leadingEllipsis: false,
      trailingEllipsis: description.length > end,
    };
  }

  const matchEnd = matchIndex + trimmed.length;
  if (matchIndex < DESCRIPTION_MATCH_LEAD_CHARS) {
    const end = Math.min(description.length, maxChars);
    return {
      text: description.slice(0, end),
      leadingEllipsis: false,
      trailingEllipsis: description.length > end,
    };
  }

  let start = snapStartToWord(
    description,
    Math.max(0, matchIndex - DESCRIPTION_MATCH_CONTEXT_CHARS),
  );
  let end = snapEndToWord(
    description,
    Math.min(description.length, matchEnd + DESCRIPTION_MATCH_CONTEXT_CHARS),
  );

  if (end - start > maxChars) {
    const half = Math.floor(maxChars / 2);
    start = snapStartToWord(description, Math.max(0, matchIndex - half));
    end = start + maxChars;
    if (end > description.length) {
      end = description.length;
      start = Math.max(0, snapStartToWord(description, end - maxChars));
    }
  }

  return {
    text: description.slice(start, end),
    leadingEllipsis: start > 0,
    trailingEllipsis: end < description.length,
  };
}

function getPrimaryTrigger(skill: Skill): string | undefined {
  return skill.triggers[0];
}

function getTriggerText(skill: Skill): string {
  return skill.triggers.join(' ');
}

function toSearchDocument(skill: Skill): SearchDocument {
  const meta = getPhaseMeta(skill.phase);
  return {
    id: skill.slug,
    slug: skill.slug,
    name: skill.name,
    displayName: formatSkillDisplayName(skill.name),
    description: skill.description,
    phase: skill.phase,
    phaseLabel: meta.label,
    triggerText: getTriggerText(skill),
    primaryTrigger: getPrimaryTrigger(skill),
  };
}

function toSearchResult(doc: SearchDocument): SearchResult {
  return {
    slug: doc.slug,
    name: doc.name,
    displayName: doc.displayName,
    description: doc.description,
    phase: doc.phase,
    phaseLabel: doc.phaseLabel,
    primaryTrigger: doc.primaryTrigger,
  };
}

/** Strip a leading slash so `/spec` and `spec` share the same MiniSearch query. */
export function normalizeSearchQuery(query: string): string {
  const trimmed = query.trim();
  if (trimmed.startsWith('/')) {
    return trimmed.slice(1);
  }
  return trimmed;
}

/** Slug-shaped queries: lowercase, collapse whitespace to hyphens. */
export function slugFromQuery(query: string): string {
  return normalizeSearchQuery(query).toLowerCase().replace(/\s+/g, '-');
}

function findExactSlugMatch(
  documents: SearchDocument[],
  slugQuery: string,
): SearchDocument | undefined {
  return documents.find((doc) => doc.slug === slugQuery);
}

function isUniqueSlugPrefix(documents: SearchDocument[], prefix: string): boolean {
  const matches = documents.filter(
    (doc) => doc.slug === prefix || doc.slug.startsWith(`${prefix}-`),
  );
  return matches.length === 1;
}

function phasesMatchingQuery(query: string): Phase[] {
  if (query.trim().startsWith('/')) {
    return [];
  }

  const normalized = normalizeSearchQuery(query).toLowerCase();
  if (!normalized) {
    return [];
  }

  const matched = new Set<Phase>();
  for (const phase of PHASE_ORDER) {
    const meta = getPhaseMeta(phase);
    const label = meta.label.toLowerCase();
    const phaseId = phase.toLowerCase();
    if (normalized === label || normalized === phaseId) {
      matched.add(phase);
      continue;
    }
    if (
      normalized.length >= 2 &&
      (label.startsWith(normalized) || phaseId.startsWith(normalized))
    ) {
      matched.add(phase);
    }
  }
  return Array.from(matched);
}

function triggerMatchesQuery(doc: SearchDocument, query: string): boolean {
  const normalized = normalizeSearchQuery(query).toLowerCase();
  if (!normalized) {
    return false;
  }
  const slashForm = `/${normalized}`;
  const triggerLower = doc.triggerText.toLowerCase();
  if (triggerLower.includes(normalized) || triggerLower.includes(slashForm)) {
    return true;
  }
  const primary = doc.primaryTrigger?.toLowerCase();
  if (!primary) {
    return false;
  }
  return (
    primary === slashForm || primary === normalized || primary.replace(/^\//, '') === normalized
  );
}

const RANK_BOOST = {
  phaseExact: 12,
  phasePrefix: 8,
  trigger: 10,
} as const;

interface RankedHit {
  doc: SearchDocument;
  score: number;
}

function rankSearchHits(
  documents: SearchDocument[],
  hits: Array<{ id: string; score: number }>,
  query: string,
): RankedHit[] {
  const slugQuery = slugFromQuery(query);
  const exactSlugDoc = findExactSlugMatch(documents, slugQuery);
  const uniquePrefixDoc =
    !exactSlugDoc && isUniqueSlugPrefix(documents, slugQuery)
      ? documents.find((doc) => doc.slug === slugQuery || doc.slug.startsWith(`${slugQuery}-`))
      : undefined;
  const pinnedSlug = exactSlugDoc ?? uniquePrefixDoc;

  const phaseMatches = phasesMatchingQuery(query);
  const docById = new Map(documents.map((doc) => [doc.id, doc]));

  const ranked: RankedHit[] = [];
  for (const hit of hits) {
    const doc = docById.get(hit.id);
    if (!doc) {
      continue;
    }
    let boost = 0;
    if (phaseMatches.includes(doc.phase)) {
      const label = doc.phaseLabel.toLowerCase();
      const phaseId = doc.phase.toLowerCase();
      const normalized = normalizeSearchQuery(query).toLowerCase();
      const exactPhase = normalized === label || normalized === phaseId;
      boost += exactPhase ? RANK_BOOST.phaseExact : RANK_BOOST.phasePrefix;
    }
    if (triggerMatchesQuery(doc, query)) {
      boost += RANK_BOOST.trigger;
    }
    ranked.push({ doc, score: hit.score + boost });
  }

  ranked.sort((a, b) => b.score - a.score);

  if (pinnedSlug) {
    const withoutPinned = ranked.filter((entry) => entry.doc.id !== pinnedSlug.id);
    return [{ doc: pinnedSlug, score: Number.POSITIVE_INFINITY }, ...withoutPinned];
  }

  return ranked;
}

export function createSearchIndex(): SearchIndex {
  const documents = skillsData.skills.map(toSearchDocument);

  const miniSearch = new MiniSearch<SearchDocument>({
    fields: ['name', 'displayName', 'description', 'phase', 'phaseLabel', 'triggerText'],
    storeFields: [
      'slug',
      'name',
      'displayName',
      'description',
      'phase',
      'phaseLabel',
      'primaryTrigger',
    ],
    searchOptions: {
      boost: {
        name: 4,
        displayName: 4,
        triggerText: 5,
        phaseLabel: 2,
        description: 1,
        phase: 1,
      },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  miniSearch.addAll(documents);

  const allResults = PHASE_ORDER.flatMap((phase) => {
    const phaseSkills = documents
      .filter((doc) => doc.phase === phase)
      .sort((a, b) =>
        a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' }),
      );
    return phaseSkills.map(toSearchResult);
  });

  return {
    skillCount: documents.length,
    listAll(): SearchResult[] {
      return allResults;
    },
    search(query: string, limit = 8): SearchResult[] {
      const trimmed = query.trim();
      if (!trimmed) {
        return [];
      }

      const searchQuery = normalizeSearchQuery(trimmed);
      const hits = miniSearch.search(searchQuery);
      const ranked = rankSearchHits(documents, hits, trimmed);

      const results = trimmed.startsWith('/')
        ? ranked.filter((entry) => triggerMatchesQuery(entry.doc, trimmed))
        : ranked;

      const slice = results.length > 0 ? results : ranked;
      return slice.slice(0, limit).map((entry) => toSearchResult(entry.doc));
    },
  };
}
