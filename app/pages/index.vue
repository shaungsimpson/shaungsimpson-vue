<script setup lang="ts">
useSeoMeta({
  title: 'Software Engineer in Sydney',
  description: 'Portfolio of Shaun Simpson, a software engineer and developer based in Sydney, Australia.',
})

const { data: latestArticles } = await useAsyncData('home-articles', () =>
  queryCollection('articles')
    .where('draft', '=', false)
    .order('published', 'ASC')
    .select('path', 'title', 'description', 'published')
    .all(),
)
</script>

<template>
  <div class="home">
    <ImageTextBlock title="My name is Shaun Simpson, and I like to build things!" img="/assets/img/shaun-pilot.jpeg">
      <p class="mt-6 text-base text-default">
        I'm a software engineer and developer from Sydney, Australia. I work hard designing and building digital solutions for people to help them solve their problems and make their lives easier. I have been working with various digital technologies to help people for the last decade and I love it. I am focused on improving the aesthetics and user experience of software, and I am always looking for new ways to improve my craft.
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