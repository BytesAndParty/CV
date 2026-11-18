// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Astro 7 defaults to 'jsx', which drops the space between text and an inline
  // element (e.g. "E-Mail: <a>"); `true` keeps the Astro 5/6 whitespace handling.
  compressHTML: true,

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});