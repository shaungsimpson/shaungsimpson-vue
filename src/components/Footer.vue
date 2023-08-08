<script setup>
const year = new Date().getFullYear()
const links = [
  { link: '/', label: 'Home' },
  { link: '/about', label: 'About' },
  { link: '/articles', label: 'Articles' },
  // { link: '/projects', label: 'Projects' },
]
</script>

<template>
  <footer class="flex-none mt-32">
    <div class="sm:px-8">
      <div class="w-full mx-auto max-w-7xl lg:px-8">
        <div class="pt-10 pb-16 border-t border-zinc-100 dark:border-zinc-700/40">
          <div class="relative px-4 sm:px-8 lg:px-12">
            <div class="max-w-2xl mx-auto lg:max-w-5xl">
              <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <nav>
                  <div
                    class="flex flex-wrap justify-center text-sm font-medium gap-x-6 gap-y-1 ">

                    <router-link v-for="link in links" :to="link.link">
                      {{ link.label }}
                    </router-link>
                  </div>
                </nav>
                <p class="text-sm text-subtle">© <!-- -->{{ year }}<!-- --> Shaun
                  Simpson. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
