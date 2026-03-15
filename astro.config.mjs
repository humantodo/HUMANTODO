// @ts-check
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, passthroughImageService } from 'astro/config'
import react from '@astrojs/react'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import expressiveCode from 'astro-expressive-code'
import mdx from '@astrojs/mdx'
import cloudflare from '@astrojs/cloudflare'

export default defineConfig({
  site: 'https://humantodo.dev',

  image: {
    service: passthroughImageService()
  },

  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          headingProperties: {
            className: ['rehype-heading']
          },
          properties: {
            className: ['rehype-heading-link']
          }
        }
      ]
    ]
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), expressiveCode(), mdx()],
  adapter: cloudflare()
})
