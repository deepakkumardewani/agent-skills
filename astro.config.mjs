// @ts-check
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://addy-osmani-skills.vercel.app',
  trailingSlash: 'never',
});
