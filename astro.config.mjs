// @ts-check

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import { rehypeTaskListA11y } from './src/lib/rehype-task-list-a11y.ts';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://addy-osmani-skills.vercel.app',
  trailingSlash: 'never',
  integrations: [react()],
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
    // Dev-only effect: keep jsxDEV defined when Vite pre-bundles react/jsx-dev-runtime.
    // Without this, optimized deps can set jsxDEV to undefined and island hydration fails.
    optimizeDeps: {
      esbuildOptions: {
        define: {
          'process.env.NODE_ENV': JSON.stringify('development'),
        },
      },
    },
  },
});
