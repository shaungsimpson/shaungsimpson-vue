<script setup>
const links = [
  { link: '/', label: 'Home' },
  { link: '/about', label: 'About' },
  { link: '/articles', label: 'Articles' },
  // { link: '/projects', label: 'Projects' },
]
</script>

<template>
  <header class="relative z-50 flex flex-col flex-none pointer-events-none">

    <div class="top-0 z-10 h-16 pt-6">
      <div class="w-full sm:px-8">
        <div class="w-full mx-auto max-w-7xl lg:px-8">
          <div class="relative px-4 sm:px-8 lg:px-12">
            <div class="max-w-2xl mx-auto lg:max-w-5xl">
              <div class="relative flex gap-4">
                <div class="flex justify-center flex-1">

                  <nav class="pointer-events-auto">
                    <ul
                      class="flex px-3 text-sm font-medium rounded-full shadow-lg bg-white/90 text-zinc-800 shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                      <li v-for="link in links">
                        <router-link
                          class="relative block px-3 py-2 transition hover:text-emerald-500 dark:hover:text-emerald-400"
                          :to="link.link">
                          {{ link.label }}
                        </router-link>
                      </li>
                    </ul>
                  </nav>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </header>
</template>
