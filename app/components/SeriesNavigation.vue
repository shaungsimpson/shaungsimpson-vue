<script setup lang="ts">
type SeriesArticle = {
  path: string
  title: string
}

defineProps<{
  previous?: SeriesArticle
  next?: SeriesArticle
}>()
</script>

<template>
  <nav v-if="previous || next" class="mt-12 grid gap-4 border-t border-zinc-100 pt-8 sm:grid-cols-2 dark:border-zinc-700/40" aria-label="Series navigation">
    <NuxtLink
      v-if="previous"
      :to="previous.path"
      class="rounded-2xl border border-zinc-200 p-5 transition hover:border-emerald-500 dark:border-zinc-700"
    >
      <span class="block text-sm text-subtle">Previous in the series</span>
      <span class="mt-1 block font-semibold text-strong">{{ previous.title }}</span>
    </NuxtLink>
    <span v-else class="hidden sm:block" />

    <NuxtLink
      v-if="next"
      :to="next.path"
      class="rounded-2xl border border-zinc-200 p-5 text-right transition hover:border-emerald-500 dark:border-zinc-700"
    >
      <span class="block text-sm text-subtle">Next in the series</span>
      <span class="mt-1 block font-semibold text-strong">{{ next.title }}</span>
    </NuxtLink>
  </nav>
</template>