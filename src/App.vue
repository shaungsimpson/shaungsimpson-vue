<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import ArticlesSection from './components/ArticlesSection.vue'
import ImagesSection from './components/ImagesSection.vue'
import SocialLinks from './components/SocialLinks.vue'
import WorkSection from './components/WorkSection.vue'
</script>

<template>
    <div class="fixed inset-0 flex justify-center sm:px-8">
        <div class="flex w-full max-w-7xl lg:px-8">
            <div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20"></div>
        </div>
    </div>
    <div class="relative flex w-full flex-col">
        <Header />
        <div class="flex-none" style="height:var(--content-offset)"></div>
        <main class="flex-auto">
            <div class="sm:px-8 mt-9">
                <div class="mx-auto w-full max-w-7xl lg:px-8">
                    <div class="relative px-4 sm:px-8 lg:px-12">
                        <div class="mx-auto max-w-2xl lg:max-w-5xl">
                            <div class="max-w-2xl">
                                <h1 class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                                    My name is Shaun Simpson, and I like to build things!</h1>
                                <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">I'm a software engineer from
                                    Sydney, Australia. Insert more about blurb here....<br>
                                    Microservices internet button static k FIFO Netscape bike-shedding DSL developer site reliability engineer. Senior-engineer npm mutation observer domain specific language resolve public greenfield documentation driven. Freelancer imperative-mood greedy algorithm dynamic programming inheritance configuration frame rate linked list scalable Ada Lovelace.
                                </p>
                                <SocialLinks />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ImagesSection />
            <div class="sm:px-8 mt-24 md:mt-28">
                <div class="mx-auto w-full max-w-7xl lg:px-8">
                    <div class="relative px-4 sm:px-8 lg:px-12">
                        <div class="mx-auto max-w-2xl lg:max-w-5xl">
                            <div class="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
                                <ArticlesSection />

                                <WorkSection />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
        <Footer />
    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
