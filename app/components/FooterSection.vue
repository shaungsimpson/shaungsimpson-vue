<script setup lang="ts">
const year = new Date().getFullYear()
const links = [
  { link: '/', label: 'Home' },
  { link: '/about', label: 'About' },
  { link: '/articles', label: 'Articles' },
]
</script>

<template>
  <footer class="mt-32 flex-none">
    <div class="sm:px-8">
      <div class="mx-auto w-full max-w-7xl lg:px-8">
        <div class="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <div class="relative px-4 sm:px-8 lg:px-12">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
              <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <nav>
                  <div class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium">
                    <NuxtLink v-for="link in links" :key="link.link" :to="link.link">
                      {{ link.label }}
                    </NuxtLink>
                  </div>
                </nav>
                <p class="text-sm text-subtle">© {{ year }} Shaun Simpson. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
