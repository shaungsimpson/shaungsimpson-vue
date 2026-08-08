<script setup lang="ts">
import { currentPublicationDate } from '~/utils/currentPublicationDate'

const route = useRoute()
const siteUrl = 'https://shaungsimpson.com'
const socialImage = siteUrl + '/assets/img/shaun-pilot.jpeg'
const articlePath = `/articles/${route.params.slug}`
const publicationDate = import.meta.dev ? '9999-12-31' : currentPublicationDate()

const { data: article } = await useAsyncData(articlePath, () =>
  queryCollection('articles')
    .where('draft', '=', false)
    .path(articlePath)
    .first(),
)

if (!article.value || article.value.published > publicationDate) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

const { data: seriesArticles } = await useAsyncData(
  `article-series:${article.value.series ?? 'none'}`,
  () => queryCollection('articles')
    .where('draft', '=', false)
    .select('path', 'title', 'published', 'series', 'seriesOrder')
    .all(),
)

const publishedSeriesArticles = computed(() =>
  (seriesArticles.value ?? [])
    .filter((seriesArticle) =>
      seriesArticle.series === article.value?.series
      && seriesArticle.published <= publicationDate,
    )
    .sort((left, right) => (left.seriesOrder ?? 0) - (right.seriesOrder ?? 0)),
)
const currentSeriesIndex = computed(() =>
  publishedSeriesArticles.value.findIndex((seriesArticle) => seriesArticle.path === article.value?.path),
)
const previousSeriesArticle = computed(() =>
  currentSeriesIndex.value > 0
    ? publishedSeriesArticles.value[currentSeriesIndex.value - 1]
    : undefined,
)
const nextSeriesArticle = computed(() =>
  currentSeriesIndex.value >= 0
    ? publishedSeriesArticles.value[currentSeriesIndex.value + 1]
    : undefined,
)

const seoDescription = computed(() => article.value?.seoDescription ?? article.value?.description)
const updatedDate = article.value.updated && article.value.updated > article.value.published
  ? article.value.updated
  : undefined
const effectiveModifiedDate = updatedDate ?? article.value.published

useSeoMeta({
  title: () => article.value?.title,
  description: seoDescription,
  ogType: 'article',
  articlePublishedTime: () => article.value?.published,
  articleModifiedTime: () => effectiveModifiedDate,
  articleAuthor: [siteUrl],
  articleTag: () => article.value?.tags,
})

const articleDateFormatter = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const publishedLabel = articleDateFormatter.format(new Date(article.value.published))
const updatedLabel = updatedDate
  ? articleDateFormatter.format(new Date(updatedDate))
  : undefined

defineOgImage('Article', {
  title: article.value.title,
  description: seoDescription.value,
  published: publishedLabel,
  tags: (article.value.tags ?? []).join(' / '),
}, {
  width: 1200,
  height: 630,
  extension: 'png',
  alt: `${article.value.title} - Shaun Simpson`,
})

useSchemaOrg([
  defineArticle({
    headline: article.value.title,
    description: seoDescription.value,
    datePublished: article.value.published,
    dateModified: effectiveModifiedDate,
    image: socialImage,
    author: { '@id': siteUrl + '/#person' },
  }),
])
</script>

<template>
  <div v-if="article" class="post">
    <div class="mt-9 sm:px-8">
      <div class="mx-auto flex w-full max-w-7xl lg:px-8">
        <div class="relative w-full px-4 sm:px-8 lg:px-12">
          <div class="mx-auto max-w-2xl lg:max-w-5xl">
            <div class="w-full">
              <h1 class="max-w-2xl text-4xl font-bold tracking-tight text-strong sm:text-5xl">
                {{ article.title }}
              </h1>
              <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-subtle">
                <time :datetime="article.published">Published {{ publishedLabel }}</time>
                <time v-if="updatedLabel" :datetime="article.updated">Updated {{ updatedLabel }}</time>
              </div>
              <ContentRenderer :value="article" class="md-prose-section prose prose-zinc dark:prose-invert" />
              <SeriesNavigation :previous="previousSeriesArticle" :next="nextSeriesArticle" />
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>