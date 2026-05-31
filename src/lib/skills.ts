import type { Phase, Skill, SkillGroup } from '../data/skills-data';
import { skillsData } from '../data/skills-data';

/** Sidebar / docs phase order per SPEC §3. */
export const PHASE_ORDER: readonly Phase[] = [
  'foundations',
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

/** Readable page title from synced kebab-case skill names. */
export function formatSkillDisplayName(name: string): string {
  return name
    .split('-')
    .map((part) => (part.length > 0 ? `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}` : part))
    .join(' ');
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
