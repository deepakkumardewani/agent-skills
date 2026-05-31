import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const phaseSchema = z.enum([
  'foundations',
  'define',
  'plan',
  'build',
  'test',
  'review',
  'simplify',
  'ship',
]);

const skills = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/skills' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    phase: phaseSchema,
    triggers: z.array(z.string()),
    related: z.array(z.string()),
  }),
});

export const collections = { skills };
