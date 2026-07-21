<script setup lang="ts">
const images = [
  { src: '/assets/img/coffee.jpg', alt: 'Coffee on a desk', classes: 'rotate-2' },
  { src: '/assets/img/improve-ux.jpg', alt: 'Designing a digital experience', classes: '-rotate-2' },
  { src: '/assets/img/test-and-refine.jpg', alt: 'Developer working with headphones', classes: '-rotate-2' },
  { src: '/assets/img/building-the-base.jpg', alt: 'Code on a laptop screen', classes: 'rotate-2' },
  { src: '/assets/img/application-live.jpg', alt: 'An application running on a screen', classes: '-rotate-2' },
]
</script>

<template>
  <section class="mt-16 sm:mt-20" aria-label="Work and development process">
    <div class="flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
      <div v-for="image in images" :key="image.src" class="relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 ring-2 ring-zinc-900 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl" :class="image.classes">
        <img :src="image.src" :alt="image.alt" width="576" height="640" loading="lazy" class="absolute inset-0 h-full w-full object-cover">
      </div>
    </div>
  </section>
</template>
