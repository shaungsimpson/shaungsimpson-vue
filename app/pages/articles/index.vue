<script setup lang="ts">
useSeoMeta({
  title: 'Articles',
  description: 'Articles about web application development, tools, techniques, and ideas.',
})

const { data: articles } = await useAsyncData('articles', () =>
  queryCollection('articles')
    .where('draft', '=', false)
    .order('published', 'ASC')
    .select('path', 'title', 'description', 'published')
    .all(),
)
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
              <ArticleList :articles="articles ?? []" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>