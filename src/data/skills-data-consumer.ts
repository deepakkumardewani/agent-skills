import type { Skill, SkillsData } from '../data/skills-data';

const sample: Skill = {
  slug: 'sample-skill',
  name: 'sample-skill',
  description: 'Sample skill for type checking.',
  phase: 'define',
  triggers: ['/spec'],
  related: [],
};

const _skillsDataShape: SkillsData = {
  groups: [],
  skills: [sample],
};

export { _skillsDataShape, sample };
