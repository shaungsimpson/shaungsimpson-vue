<script setup>
const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
  img: {
    type: String,
    default: undefined,
  },
  height: {
    type: String,
    default: 'w-52',
  },
  width: {
    type: String,
    default: 'w-52',
  },
})

const imgClasses = props.height + ' ' + props.width
</script>

<template>
  <div class="mt-9 sm:px-8">
    <div class="mx-auto flex w-full max-w-7xl flex-col-reverse lg:flex-row lg:px-8">
      <div class="px-4 sm:px-8 lg:flex lg:px-12">
        <div class="mx-auto max-w-2xl lg:max-w-6xl">
          <div class="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            <h1 v-if="title" class="text-4xl font-bold tracking-tight text-strong sm:text-5xl">{{ title }}</h1>
            <slot />
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-xl lg:max-w-3xl">
        <div class="mx-auto my-12 max-w-2xl lg:my-4 lg:px-12">
          <img v-if="img" :src="img" alt="Shaun Simpson" width="512" height="512" fetchpriority="high" class="mx-auto rounded-full bg-zinc-100 object-cover dark:bg-zinc-800" :class="imgClasses">
        </div>
      </div>
    </div>
  </div>
</template>
