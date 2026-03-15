// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import expressiveCode from 'astro-expressive-code';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          headingProperties: {
            className: ['rehype-heading'],
          },
          properties: {
            className: ['rehype-heading-link'],
          },
        },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), expressiveCode(), mdx()],
});
