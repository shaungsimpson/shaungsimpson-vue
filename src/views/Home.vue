<script setup>
import ArticlesSection from '@/components/ArticlesSection.vue'
import ImagesSection from '@/components/ImagesSection.vue'
import ImageTextBlock from '@/components/common/ImageTextBlock.vue'
import SocialLinks from '@/components/SocialLinks.vue'
import WorkSection from '@/components/WorkSection.vue'
import heroImg from '/src/assets/img/shaun-pilot.jpeg'
</script>

<template>
    <div class="home">
        <ImageTextBlock title="My name is Shaun Simpson, and I like to build things!" :img="heroImg">
            <p class="mt-6 text-base text-default">I'm a software engineer and developer from
                Sydney, Australia. I work hard designing and building digital solutions for people to help them
                solve their problems and make their lives easier. I have been working with various digital technologies to
                help people for the last decade and I love it. I am focused on improving the aesthetics and user experience
                of software, and I am always looking for new ways to improve my craft.
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
