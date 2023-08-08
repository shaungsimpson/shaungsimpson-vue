<script setup>
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();
const toggleDark = useToggle(isDark);

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
                      class="flex px-3 text-sm font-medium rounded-full shadow-edge"
                    >
                      <li
                        v-for="link in links"
                        :key="link.link"
                      >
                        <router-link
                          class="relative block px-3 py-2"
                          :to="link.link"
                        >
                          {{ link.label }}
                        </router-link>
                      </li>
                    </ul>
                  </nav>
                </div>
                <button
                  class="flex p-2 text-sm font-medium rounded-full pointer-events-auto shadow-edge text-link theme-toggle"
                  @click="toggleDark()"
                >
                  <svg
                    v-if="isDark"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
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
