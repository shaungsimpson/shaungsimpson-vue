import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: 'articles/*.md',
      schema: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        seoDescription: z.string().min(1).max(160).optional(),
        published: z.string().date(),
        updated: z.string().date().optional(),
        draft: z.boolean().default(false),
        tags: z.array(z.string()).default([]),
      }),
      indexes: [
        { columns: ['draft', 'published'] },
      ],
    }),
  },
})