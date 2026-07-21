<script setup lang="ts">
import { useDark } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
})
const isHydrated = ref(false)
const displayedDark = computed(() => isHydrated.value && isDark.value)

onMounted(() => {
  isHydrated.value = true
})

function toggleDark() {
  isDark.value = !isDark.value
}

const links = [
  { link: '/', label: 'Home' },
  { link: '/about', label: 'About' },
  { link: '/articles', label: 'Articles' },
]
</script>

<template>
  <header class="relative z-50 flex flex-none flex-col pointer-events-none">
    <div class="top-0 z-10 h-16 pt-6">
      <div class="w-full sm:px-8">
        <div class="mx-auto w-full max-w-7xl lg:px-8">
          <div class="relative px-4 sm:px-8 lg:px-12">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
              <div class="relative flex gap-4">
                <div class="flex flex-1 justify-center">
                  <nav class="pointer-events-auto">
                    <ul class="flex rounded-full px-3 text-sm font-medium shadow-edge">
                      <li v-for="link in links" :key="link.link">
                        <NuxtLink class="relative block px-3 py-2" :to="link.link">
                          {{ link.label }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </nav>
                </div>
                <button
                  class="theme-toggle flex rounded-full p-2 text-sm font-medium pointer-events-auto shadow-edge text-link"
                  type="button"
                  :aria-label="displayedDark ? 'Use light theme' : 'Use dark theme'"
                  @click="toggleDark()"
                >
                  <svg v-if="displayedDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
