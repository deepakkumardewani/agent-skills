import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const phaseSchema = z.enum([
  'meta',
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

const setupGuides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/setup-guides' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    tool: z.string(),
    source: z.string(),
  }),
});

export const collections = { skills, setupGuides };
