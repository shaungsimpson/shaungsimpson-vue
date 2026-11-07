<script setup lang="ts">
import { currentPublicationDate } from '~/utils/currentPublicationDate'
useSeoMeta({
  title: 'Software Engineer in Sydney',
  description: 'Portfolio of Shaun Simpson, a software engineer and developer based in Sydney, Australia.',
})

const publicationDate = currentPublicationDate()

const { data: latestArticles } = await useAsyncData('home-articles', () =>
  queryCollection('articles')
    .where('draft', '=', false)
    .order('published', 'DESC')
    .select('path', 'title', 'description', 'published', 'updated')
    .all().then((articles) =>
      articles
        .filter((article) => article.published <= publicationDate)
        .slice(0, 10),
    ),
)
</script>

<template>
  <div class="home">
    <ImageTextBlock title="My name is Shaun Simpson, and I like to build things!" img="/assets/img/shaun-pilot.jpeg">
      <p class="mt-6 text-base text-default">
        I'm a senior software engineer in Sydney, Australia, with over a decade of building software that makes people's lives and work easier. I care about the whole job: maintainable code, fast and accessible pages, and honest trade-offs when the perfect fix isn't on the table. Here I write about what I build, what I learn, and the decisions behind both.
      </p>
      <SocialLinks />
    </ImageTextBlock>

    <ImageGallery />

    <div class="mt-24 sm:px-8 md:mt-28">
      <div class="mx-auto w-full max-w-7xl lg:px-8">
        <div class="relative px-4 sm:px-8 lg:px-12">
          <div class="mx-auto max-w-2xl lg:max-w-5xl">
            <div class="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
              <ArticleList :articles="latestArticles ?? []" />
              <WorkSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>