<script setup>
const props = defineProps(['title'])
</script>

<template>
  <div class="sm:px-8">
    <div class="flex flex-col-reverse w-full mx-auto lg:flex-row max-w-7xl lg:px-8">
      <div class="px-4 sm:px-8 lg:px-12 lg:flex">
        <div class="max-w-2xl mx-auto lg:max-w-6xl">
          <div class="max-w-2xl xl:max-w-2xl lg:max-w-xl">
            <h1
              v-if="title"
              class="text-4xl font-bold tracking-tight text-strong sm:text-5xl"
            >
              {{ title }}
            </h1>
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
