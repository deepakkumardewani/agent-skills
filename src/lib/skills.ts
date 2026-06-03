import type { Phase, Skill, SkillGroup } from '../data/skills-data';
import { skillsData } from '../data/skills-data';

/** Sidebar / docs phase order per SPEC §3. */
export const PHASE_ORDER: readonly Phase[] = [
  'meta',
  'define',
  'plan',
  'build',
  'test',
  'review',
  'simplify',
  'ship',
] as const;

export interface PhaseMeta {
  phase: Phase;
  label: string;
  command: string;
  fgVar: string;
  subtleVar: string;
}

export function getPhaseMeta(phase: Phase): PhaseMeta {
  const group = skillsData.groups.find((entry) => entry.phase === phase);
  return {
    phase,
    label: group?.label ?? phase,
    command: group?.command ?? '',
    fgVar: `--phase-${phase}`,
    subtleVar: `--phase-${phase}-subtle`,
  };
}

export function groupSkillsByPhase(): SkillGroup[] {
  const groupByPhase = new Map(skillsData.groups.map((group) => [group.phase, group]));
  return PHASE_ORDER.map((phase) => {
    const group = groupByPhase.get(phase);
    if (!group) {
      throw new Error(`Missing skill group for phase: ${phase}`);
    }
    return group;
  });
}

export function getSkillBySlug(slug: string): Skill | undefined {
  return skillsData.skills.find((skill) => skill.slug === slug);
}

const DISPLAY_ACRONYMS = new Set(['ci', 'cd', 'api', 'adr', 'adrs', 'adlc', 'ui', 'ai']);
const DISPLAY_MINOR_WORDS = new Set([
  'and',
  'or',
  'to',
  'the',
  'of',
  'for',
  'with',
  'a',
  'an',
  'in',
  'on',
]);

/** Readable page title from synced kebab-case skill names (spec §5.3). */
export function formatSkillDisplayName(name: string): string {
  const parts = name.split('-');
  const words: string[] = [];

  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index] ?? '';
    if (!part) {
      continue;
    }

    if (part === 'ci' && parts[index + 1] === 'cd') {
      words.push('CI/CD');
      index += 1;
      continue;
    }

    if (part === 'devtools') {
      words.push('DevTools');
      continue;
    }

    if (part === 'adrs') {
      words.push('ADRs');
      continue;
    }

    if (DISPLAY_ACRONYMS.has(part)) {
      words.push(part.toUpperCase());
      continue;
    }

    if (index > 0 && DISPLAY_MINOR_WORDS.has(part)) {
      words.push(part);
      continue;
    }

    words.push(`${part.charAt(0).toUpperCase()}${part.slice(1)}`);
  }

  return words.join(' ');
}

/** Sidebar display order — alphabetical by formatted skill name. */
export function sortSkillsAlphabetically(skills: readonly Skill[]): Skill[] {
  return [...skills].sort((a, b) =>
    formatSkillDisplayName(a.name).localeCompare(formatSkillDisplayName(b.name), undefined, {
      sensitivity: 'base',
    }),
  );
}

export function getRelatedSkills(slug: string): Skill[] {
  const skill = getSkillBySlug(slug);
  if (!skill || skill.related.length === 0) {
    return [];
  }

  return skill.related
    .map((relatedSlug) => getSkillBySlug(relatedSlug))
    .filter((related): related is Skill => related !== undefined);
}
