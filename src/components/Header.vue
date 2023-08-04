<script setup>
const links = [
  { link: '/about', label: 'About' },
  { link: '/articles', label: 'Articles' },
  { link: '/projects', label: 'Projects' },
]
</script>

<template>
  <header class="pointer-events-none relative z-50 flex flex-none flex-col"
    style="height:var(--header-height);margin-bottom:var(--header-mb)">
    <div class="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"></div>
    <div class="sm:px-8 top-0 order-last -mb-3 pt-3" style="position:var(--header-position)">
      <div class="mx-auto w-full max-w-7xl lg:px-8">
        <div class="relative px-4 sm:px-8 lg:px-12">
          <div class="mx-auto max-w-2xl lg:max-w-5xl">
            <div class="w-full" style="position:var(--header-inner-position)">
              <div class="relative">
                <div
                  class="absolute left-0 top-3 origin-left transition-opacity h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10"
                  style="opacity:var(--avatar-border-opacity, 0);transform:var(--avatar-border-transform)">
                </div><a aria-label="Home" class="block h-16 w-16 origin-left pointer-events-auto"
                  style="transform:var(--avatar-image-transform)" href="/"><img alt="" fetchpriority="high" width="512"
                    height="512"
                    class="rounded-full bg-zinc-100 object-cover dark:bg-zinc-800 h-16 w-16" style="color:transparent"
                    src="\src\assets\shaun-pilot.jpeg"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="top-0 z-10 h-16 pt-6" style="position:var(--header-position)">
      <div class="sm:px-8 top-[var(--header-top,theme(spacing.6))] w-full" style="position:var(--header-inner-position)">
        <div class="mx-auto w-full max-w-7xl lg:px-8">
          <div class="relative px-4 sm:px-8 lg:px-12">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
              <div class="relative flex gap-4">
                <div class="flex flex-1 justify-end md:justify-center">

                  <nav class="pointer-events-auto hidden md:block">
                    <ul
                      class="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                      <li v-for="link in links"><a class="relative block px-3 py-2 transition hover:text-emerald-500 dark:hover:text-emerald-400"
                          href="{{ link.link }}">{{ link.label }}</a></li>
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
