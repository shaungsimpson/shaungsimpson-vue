<script setup lang="ts">
const siteUrl = 'https://shaungsimpson.com'
const socialImage = siteUrl + '/assets/img/shaun-pilot.jpeg'

useHead({
  htmlAttrs: {
    lang: 'en-AU',
  },
})

useSeoMeta({
  ogLocale: 'en_AU',
  ogSiteName: 'Shaun Simpson',
  ogImage: socialImage,
  ogImageAlt: 'Shaun Simpson, software engineer',
  ogImageWidth: 500,
  ogImageHeight: 500,
  twitterCard: 'summary',
  twitterCreator: '@shaungsimpson',
  twitterSite: '@shaungsimpson',
  twitterImage: socialImage,
  twitterImageAlt: 'Shaun Simpson, software engineer',
})

useSchemaOrg([
  definePerson({
    '@id': siteUrl + '/#person',
    name: 'Shaun Simpson',
    url: siteUrl,
    image: socialImage,
    jobTitle: 'Software Engineer',
    sameAs: [
      'https://github.com/shaungsimpson',
      'https://www.linkedin.com/in/shaungsimpson',
      'https://twitter.com/shaungsimpson',
    ],
  }),
])
</script>

<template>
  <div class="fixed inset-0 flex justify-center sm:px-8">
    <div class="flex w-full max-w-7xl lg:px-8">
      <div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
    </div>
  </div>
  <div class="relative flex min-h-screen w-full flex-col">
    <HeaderSection />
    <main class="grow">
      <NuxtPage />
    </main>
    <FooterSection />
  </div>
</template>
