import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lastModified: z.coerce.date().optional(),
    // Meta description / SERP snippet. Falls back to an excerpt of the body.
    description: z.string().optional(),
    // Social card image (path under public/). Falls back to the site card.
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Scott McAllister'),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    // Short one-line summary shown on the projects list.
    summary: z.string(),
    // The canonical link to the project itself (repo, site, article...).
    // Optional — omit for private/unlinked projects (no button is shown).
    url: z.string().url().optional(),
    // Optional label for the outbound link button (e.g. "GitHub", "Live site").
    linkLabel: z.string().default('Visit project'),
    // Social card image (path under public/). Falls back to the site card.
    image: z.string().optional(),
    // Optional year/date used for ordering.
    date: z.coerce.date().optional(),
    // Current state of the project.
    status: z.enum(['active', 'maintained', 'archived', 'complete']).default('active'),
    tags: z.array(z.string()).default([]),
    // Show near the top / on the home page.
    featured: z.boolean().default(false),
    // A silent screen recording of the project in use. When present, the home
    // page can show the project working rather than describing it.
    demo: z
      .object({
        video: z.string(),
        poster: z.string(),
        alt: z.string(),
      })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

const releases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/releases' }),
  schema: z.object({
    // Product the release belongs to, e.g. "GifTamer".
    product: z.string(),
    version: z.string(),
    date: z.coerce.date(),
    // Optional link to the store listing.
    storeUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, projects, releases };
