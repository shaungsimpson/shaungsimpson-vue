import { readdirSync, readFileSync } from 'node:fs'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'
import { currentPublicationDate } from './app/utils/currentPublicationDate'

// Every article in the collection ships to browsers in full in sql_dump.txt, so drafts and
// (outside dev) future-dated articles must stay out of the collection, not just out of queries.
const today = currentPublicationDate()
const unpublishedArticles = readdirSync('content/articles').filter((file) => {
  const source = readFileSync(`content/articles/${file}`, 'utf8')
  const published = source.match(/^published:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1] ?? ''
  return /^draft:\s*true$/m.test(source) || (process.env.NODE_ENV === 'production' && published > today)
})

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: {
        include: 'articles/*.md',
        exclude: unpublishedArticles.map((file) => `articles/${file}`),
      },
      schema: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        seoDescription: z.string().min(1).max(160).optional(),
        published: z.string().date(),
        updated: z.string().date().optional(),
        draft: z.boolean().default(false),
        series: z.string().min(1).optional(),
        seriesOrder: z.number().int().positive().optional(),
        tags: z.array(z.string()).default([]),
      }),
      indexes: [
        { columns: ['draft', 'published'] },
      ],
    }),
  },
})
