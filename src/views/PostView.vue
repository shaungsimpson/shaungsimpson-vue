<script setup>
import articlesData from '/src/data/articles.json'
import MarkdownSection from '@/components/common/MarkdownSection.vue'
import SocialLinks from '@/components/SocialLinks.vue'

const props = defineProps({
    slug: {
        type: String,
        required: true
    }
})
const articles = articlesData.articles
const article = articles.find((article) => article.slug == props.slug)


</script>

<template>
  <div class="post">
    <div class="sm:px-8 mt-9">
      <div class="flex w-full mx-auto max-w-7xl lg:px-8">
        <div class="relative w-full px-4 sm:px-8 lg:px-12">
          <div class="max-w-2xl mx-auto lg:max-w-5xl">
            <div class="w-full">
              <h1 class="max-w-2xl text-4xl font-bold tracking-tight text-strong sm:text-5xl">
                {{ article?.title ?? "I'm sorry Dave, I'm afraid I can't find that" }}
              </h1>

              <Suspense>
                <MarkdownSection :source="article?.mdFile ?? ''" />
              </Suspense>

              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
