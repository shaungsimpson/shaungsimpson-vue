<script setup lang="ts">
import type { Collections } from '@nuxt/content'

type ArticleSummary = Pick<
  Collections['articles'],
  'path' | 'title' | 'description' | 'published' | 'updated'
>

defineProps<{
  articles: ArticleSummary[]
}>()

function dateLabel(article: ArticleSummary): string {
  const date = article.updated ?? article.published
  const label = dateFormatter.format(new Date(date))

  return article.updated ? `Updated ${label}` : label
}

const dateFormatter = new Intl.DateTimeFormat('en-AU', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
</script>

<template>
  <div class="flex flex-col gap-16">
    <article v-for="article in articles" :key="article.path" class="group relative flex flex-col items-start">
      <h2 class="text-base font-semibold tracking-tight text-strong">
        <span class="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 sm:-inset-x-6 sm:rounded-2xl" />
        <NuxtLink :to="article.path">
          <span class="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
          <span class="relative z-10">{{ article.title }}</span>
        </NuxtLink>
      </h2>
      <time class="relative z-10 order-first mb-3 flex items-center pl-3.5 text-sm text-subtle" :datetime="article.updated ?? article.published">
        <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true"><span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" /></span>
        {{ dateLabel(article) }}
      </time>
      <p class="relative z-10 mt-2 text-sm text-default">{{ article.description }}</p>
      <div aria-hidden="true" class="relative z-10 mt-4 flex items-center text-sm font-medium text-emerald-500">
        Read article
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="ml-1 h-4 w-4 stroke-current"><path d="M6.75 5.75 9.25 8l-2.5 2.25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </div>
    </article>
  </div>
</template>