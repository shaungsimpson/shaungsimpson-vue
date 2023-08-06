<script setup>
import ArticlesSection from '@/components/ArticlesSection.vue'
import ImagesSection from '@/components/ImagesSection.vue'
import ImageTextBlock from '@/components/common/ImageTextBlock.vue'
import SocialLinks from '@/components/SocialLinks.vue'
import WorkSection from '@/components/WorkSection.vue'
</script>

<template>
    <div class="home">
        <ImageTextBlock title="My name is Shaun Simpson, and I like to build things!"
            img="\src\assets\img\shaun-pilot.jpeg">
            <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">I'm a software engineer from
                Sydney, Australia. Insert more about blurb here....<br>
                Microservices internet button static k FIFO Netscape bike-shedding DSL developer site
                reliability engineer. Senior-engineer npm mutation observer domain specific language resolve
                public greenfield documentation driven. Freelancer imperative-mood greedy algorithm dynamic
                programming inheritance configuration frame rate linked list scalable Ada Lovelace.
            </p>

            <SocialLinks />

        </ImageTextBlock>

        <ImagesSection />

        <div class="mt-24 sm:px-8 md:mt-28">
            <div class="w-full mx-auto max-w-7xl lg:px-8">
                <div class="relative px-4 sm:px-8 lg:px-12">
                    <div class="max-w-2xl mx-auto lg:max-w-5xl">
                        <div class="grid max-w-xl grid-cols-1 mx-auto gap-y-20 lg:max-w-none lg:grid-cols-2">
                            <ArticlesSection />

                            <WorkSection />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
