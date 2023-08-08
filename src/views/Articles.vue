<script setup>
import ArticlesSection from '@/components/ArticlesSection.vue'
</script>

<template>
    <div class="articles">

        <div class="sm:px-8 mt-9">
            <div class="flex w-full mx-auto max-w-7xl lg:px-8">
                <div class="relative px-4 sm:px-8 lg:px-12">
                    <div class="max-w-2xl mx-auto lg:max-w-5xl">
                        <div class="max-w-2xl">
                            <h1 class="text-4xl font-bold tracking-tight text-strong sm:text-5xl">
                                Articles
                            </h1>

                            <p class="mt-6 text-base text-default">Below you will find a selection of
                                articles I've written. Mostly the topics will be along the lines of web application
                                development, but I may also write about other topics, techniques and
                                concepts that interest me.
                            </p>
                        </div>
                    </div>

                    <div class="max-w-2xl mx-auto lg:max-w-5xl">
                        <div class="max-w-2xl mt-16">
                            <ArticlesSection />
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div></template>
