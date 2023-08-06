<script setup>
const props = defineProps(['title', 'img'])
</script>

<template>
    <div class="sm:px-8 mt-9">
        <div class="flex flex-col-reverse w-full mx-auto lg:flex-row max-w-7xl lg:px-8">

            <div class="px-4 sm:px-8 lg:px-12 lg:flex">
                <div class="max-w-2xl mx-auto lg:max-w-6xl">
                    <div class="max-w-2xl xl:max-w-2xl lg:max-w-xl">

                        <h1 v-if="title" class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                            {{ title }}
                        </h1>
                        <slot></slot>
                    </div>
                </div>
            </div>

            <!-- Image section -->
            <div class="max-w-xl mx-auto lg:max-w-3xl">
                <div class="max-w-2xl mx-auto my-12 lg:my-4 lg:px-12">

                    <img alt="" fetchpriority="high" width="512" height="512"
                        class="object-cover mx-auto rounded-full w-52 h-52 bg-zinc-100 dark:bg-zinc-800"
                        style="color:transparent" :src="img">

                </div>
            </div>

        </div>
    </div>
</template>
