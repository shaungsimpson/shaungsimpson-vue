<script setup lang="ts">
import { workHistory } from '~/data/work'

const logos = new Map([
  ['me', '/assets/img/shaun-pilot.jpeg'],
  ['oo', '/assets/img/logos/oo-logo.png'],
  ['buroserv', '/assets/img/logos/buroserv-logo.png'],
  ['netopia', '/assets/img/logos/netopia-logo.png'],
  ['pounce', '/assets/img/logos/pounce-logo.png'],
  ['sl', '/assets/img/logos/sl-logo.png'],
  ['otivo', '/assets/img/logos/otivo-logo.png'],
])
</script>

<template>
  <section class="lg:pl-16 xl:pl-24" aria-labelledby="work-heading">
    <div class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 id="work-heading" class="flex text-sm font-semibold text-strong">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-6 w-6 flex-none"><path d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z" class="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500" /><path d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5" class="stroke-zinc-400 dark:stroke-zinc-500" /></svg>
        <span class="ml-3">Work</span>
      </h2>
      <ol class="mt-6 space-y-4">
        <li v-for="job in workHistory" :key="`${job.company}-${job.position}-${job.from.date}`" class="flex gap-4">
          <div class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
            <img :src="logos.get(job.code) ?? ''" alt="" width="50" height="50" loading="lazy" class="h-10 w-10 rounded-full object-cover">
          </div>
          <dl class="flex flex-auto flex-wrap gap-x-2"><dd class="w-full text-sm font-medium text-strong">{{ job.company }}</dd><dd class="text-xs text-default">{{ job.position }}</dd><dd class="ml-auto text-xs text-subtle"><time :datetime="job.from.date">{{ job.from.text }}</time> — <time :datetime="job.to.date">{{ job.to.text }}</time></dd></dl>
        </li>
      </ol>
      <a href="/assets/shaun-simpson-software-engineer.pdf" class="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800">
        Download CV
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="h-4 w-4 stroke-zinc-400 transition group-hover:stroke-zinc-600 dark:group-hover:stroke-zinc-50"><path d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </a>
    </div>
  </section>
</template>
