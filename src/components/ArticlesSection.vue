<script setup>
import articleData from '/src/data/articles.json'
const articles = articleData.articles

function dateToString(date) {
    let newDate = new Date(date)
    let options = {
        month: "long",
        day: "numeric",
        year: "numeric",
    }
    return Intl.DateTimeFormat('en-AU', options).format(newDate)
}
</script>

<template>
  <div class="flex flex-col gap-16">
    <article
      v-for="article in articles"
      :key="article.slug"
      class="relative flex flex-col items-start group"
    >
      <h2 class="text-base font-semibold tracking-tight text-strong">
        <div
          class="absolute z-0 transition scale-95 opacity-0 -inset-x-4 -inset-y-6 bg-zinc-50 group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 sm:-inset-x-6 sm:rounded-2xl"
        />
        <router-link :to="article.link">
          <span class="absolute z-20 -inset-x-4 -inset-y-6 sm:-inset-x-6 sm:rounded-2xl" />
          <span class="relative z-10">{{ article.title }}</span>
        </router-link>
      </h2>
      <time
        class="relative z-10 order-first mb-3 flex items-center text-sm text-subtle pl-3.5"
        :datetime="article.published"
      >
        <span
          class="absolute inset-y-0 left-0 flex items-center"
          aria-hidden="true"
        >
          <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
        </span>
        {{ dateToString(article.published) }}
      </time>
      <p class="relative z-10 mt-2 text-sm text-default">
        {{ article.blurb }}
      </p>
      <div
        aria-hidden="true"
        class="relative z-10 flex items-center mt-4 text-sm font-medium text-emerald-500"
      >
        Read article<svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          class="w-4 h-4 ml-1 stroke-current"
        >
          <path
            d="M6.75 5.75 9.25 8l-2.5 2.25"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </article>
  </div>
</template>
