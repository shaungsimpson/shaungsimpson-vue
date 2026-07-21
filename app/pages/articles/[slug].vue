<script setup lang="ts">
const route = useRoute()
const siteUrl = 'https://shaungsimpson.com'
const socialImage = siteUrl + '/assets/img/shaun-pilot.jpeg'
const articlePath = `/articles/${route.params.slug}`

const { data: article } = await useAsyncData(articlePath, () =>
  queryCollection('articles')
    .where('draft', '=', false)
    .path(articlePath)
    .first(),
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

const seoDescription = computed(() => article.value?.seoDescription ?? article.value?.description)

useSeoMeta({
  title: () => article.value?.title,
  description: seoDescription,
  ogType: 'article',
  articlePublishedTime: () => article.value?.published,
  articleModifiedTime: () => article.value?.updated ?? article.value?.published,
  articleAuthor: [siteUrl],
  articleTag: () => article.value?.tags,
})

const publishedLabel = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(article.value.published))

defineOgImage('Article', {
  title: article.value.title,
  description: seoDescription.value,
  published: publishedLabel,
  tags: (article.value.tags ?? []).join(' · '),
}, {
  width: 1200,
  height: 630,
  extension: 'png',
  alt: `${article.value.title} — Shaun Simpson`,
})

useSchemaOrg([
  defineArticle({
    headline: article.value.title,
    description: seoDescription.value,
    datePublished: article.value.published,
    dateModified: article.value.updated ?? article.value.published,
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
              <ContentRenderer :value="article" class="md-prose-section prose prose-zinc dark:prose-invert" />
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>