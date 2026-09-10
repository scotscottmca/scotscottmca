// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// Chain / link glyph appended to each heading, revealed on hover.
const linkIcon = {
  type: 'element',
  tagName: 'span',
  properties: { className: ['heading-anchor-icon'], ariaHidden: 'true' },
  children: [
    {
      type: 'element',
      tagName: 'svg',
      properties: {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: '16',
        height: '16',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      children: [
        {
          type: 'element',
          tagName: 'path',
          properties: {
            d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
          },
          children: [],
        },
        {
          type: 'element',
          tagName: 'path',
          properties: {
            d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
          },
          children: [],
        },
      ],
    },
  ],
};

// https://astro.build/config
export default defineConfig({
  site: 'https://scotscottmca.com',
  // /usage is unlisted: reachable by URL, kept out of the sitemap and robots.
  integrations: [sitemap({ filter: (page) => !page.includes('/usage') })],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            className: ['heading-anchor'],
            ariaLabel: 'Copy link to this section',
          },
          content: linkIcon,
        },
      ],
    ],
  },
});
