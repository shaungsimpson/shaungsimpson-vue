<script setup>
defineProps({
  title: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <div class="sm:px-8">
    <div class="mx-auto flex w-full max-w-7xl flex-col-reverse lg:flex-row lg:px-8">
      <div class="px-4 sm:px-8 lg:flex lg:px-12">
        <div class="mx-auto max-w-2xl lg:max-w-6xl">
          <div class="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            <h1 v-if="title" class="text-4xl font-bold tracking-tight text-strong sm:text-5xl">{{ title }}</h1>
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
