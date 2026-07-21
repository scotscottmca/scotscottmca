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

export const collections = { posts };
