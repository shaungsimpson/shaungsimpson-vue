<script setup lang="ts">
import { currentPublicationDate } from '~/utils/currentPublicationDate'

useSeoMeta({
  title: 'Articles',
  description: 'Articles about web application development, tools, techniques, and ideas.',
})

const articlesPerPage = 10
const route = useRoute()
const publicationDate = import.meta.dev ? '9999-12-31' : currentPublicationDate()

const { data: articles } = await useAsyncData('articles', () =>
  queryCollection('articles')
    .where('draft', '=', false)
    .order('published', 'DESC')
    .select('path', 'title', 'description', 'published')
    .all()
    .then((articles) => articles.filter((article) => article.published <= publicationDate)),
)

const visibleArticles = computed(() => articles.value ?? [])
const pageCount = computed(() => Math.max(1, Math.ceil(visibleArticles.value.length / articlesPerPage)))
const currentPage = computed(() => {
  const requestedPage = Number(route.query.page ?? 1)

  if (!Number.isInteger(requestedPage) || requestedPage < 1) {
    return 1
  }

  return Math.min(requestedPage, pageCount.value)
})
const paginatedArticles = computed(() => {
  const offset = (currentPage.value - 1) * articlesPerPage

  return visibleArticles.value.slice(offset, offset + articlesPerPage)
})

function pageLink(page: number) {
  return page === 1 ? '/articles/' : { path: '/articles/', query: { page } }
}
</script>

<template>
  <div class="articles">
    <div class="mt-9 sm:px-8">
      <div class="mx-auto flex w-full max-w-7xl lg:px-8">
        <div class="relative px-4 sm:px-8 lg:px-12">
          <div class="mx-auto max-w-2xl lg:max-w-5xl">
            <div class="max-w-2xl">
              <h1 class="text-4xl font-bold tracking-tight text-strong sm:text-5xl">
                Articles
              </h1>
              <p class="mt-6 text-base text-default">
                Below you will find a selection of
                articles I've written. Mostly the topics will be along the lines of web application
                development, but I may also write about other topics, techniques and
                concepts that interest me.
              </p>
            </div>
          </div>

          <div class="mx-auto max-w-2xl lg:max-w-5xl">
            <div class="mt-16 max-w-2xl">
              <ArticleList :articles="paginatedArticles" />

              <nav v-if="pageCount > 1" class="mt-16 flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-700/40" aria-label="Article pagination">
                <NuxtLink
                  v-if="currentPage > 1"
                  :to="pageLink(currentPage - 1)"
                  class="text-sm font-medium text-emerald-500 transition hover:text-emerald-600"
                >
                  Previous
                </NuxtLink>
                <span v-else />

                <span class="text-sm text-subtle">
                  Page {{ currentPage }} of {{ pageCount }}
                </span>

                <NuxtLink
                  v-if="currentPage < pageCount"
                  :to="pageLink(currentPage + 1)"
                  class="text-sm font-medium text-emerald-500 transition hover:text-emerald-600"
                >
                  Next
                </NuxtLink>
                <span v-else />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>