<script setup>
import articlesData from '/src/data/articles.json'
import MarkdownSection from '@/components/common/MarkdownSection.vue'
import SocialLinks from '@/components/SocialLinks.vue'
import { defineProps } from 'vue'

const props = defineProps(['slug'])
const articles = articlesData.articles
const match = props.slug
const article = articles.find((article) => article.slug == match)


</script>

<template>
    <div class="post">

        <div class="sm:px-8 mt-9">
            <div class="flex w-full mx-auto max-w-7xl lg:px-8">

                <div class="relative w-full px-4 sm:px-8 lg:px-12">
                    <div class="max-w-2xl mx-auto lg:max-w-5xl">
                        <div class="w-full">

                            <h1 class="max-w-2xl text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
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
