// @ts-check

import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import { rehypeTaskListA11y } from './src/lib/rehype-task-list-a11y.ts';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://addy-osmani-skills.vercel.app',
  trailingSlash: 'never',
  integrations: [preact({ compat: true })],
  markdown: {
    rehypePlugins: [rehypeTaskListA11y],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  vite: {
    optimizeDeps: {
      include: ['minisearch'],
    },
  },
});
