import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    category: z.enum(['tipy', 'finance', 'novinky', 'propagace', 'nastaveni', 'rozhovor']),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    interviewSubject: z.string().optional(),
    interviewInitials: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
