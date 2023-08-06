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
                            <h1 class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                                Articles
                            </h1>

                            <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">Below you will find a selection of
                                articles I've written. Mostly the topics will be along the lines of web application
                                development, but I may also write about other topics, techniques and
                                concepts that interest me.
                            </p>

                            <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">The main focus of my articles will
                                be to do with writing code with Laravel, PHP and Vue as these are the technologies I use and
                                am passionate
                                about.
                            </p>

                            <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">I have always shied away from writing
                                a blog, as I tend not to crave attention by nature, but I was recently inspired by a Laracon
                                talk by Aaron Francis, whom I have followed for some time now, called <a class="text-link"
                                    href="https://www.youtube.com/watch?v=2YaEtaXYVtI"
                                    title='Aaron Francis "Publishing Your Work" - Laracon US 2023 Nashville'
                                    target="_blank">"Publishing Your
                                    Work"</a>.
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
