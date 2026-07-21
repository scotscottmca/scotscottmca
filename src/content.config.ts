import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lastModified: z.coerce.date().optional(),
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
    // Optional year/date used for ordering.
    date: z.coerce.date().optional(),
    // Current state of the project.
    status: z.enum(['active', 'maintained', 'archived', 'complete']).default('active'),
    tags: z.array(z.string()).default([]),
    // Show near the top / on the home page.
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, projects };
