<script setup>
import meLogo from '/src/assets/img/shaun-pilot.jpeg?format=webp&width=50'
import ooLogo from '/src/assets/img/logos/oo-logo.png?format=webp'
import buroservLogo from '/src/assets/img/logos/buroserv-logo.png?format=webp'
import netopiaLogo from '/src/assets/img/logos/netopia-logo.png?format=webp'
import pounceLogo from '/src/assets/img/logos/pounce-logo.png?format=webp'
import slLogo from '/src/assets/img/logos/sl-logo.png?format=webp'
import resumePdf from '/src/assets/ShaunSimpson-SoftwareEngineer.pdf'
import workData from '/src/data/work.json'

const jobs = workData.jobs

function jobLogo( job ) {
    const logos = {
        me: meLogo,
        oo: ooLogo,
        buroserv: buroservLogo,
        netopia: netopiaLogo,
        pounce: pounceLogo,
        sl: slLogo,
    }

    return logos[job.code]
}

jobs.forEach( job => job.logo = jobLogo( job ) )
</script>

<template>
  <!-- Work section -->
  <div class="space-y-10 lg:pl-16 xl:pl-24">
    <div class="p-6 border rounded-2xl border-zinc-100 dark:border-zinc-700/40">
      <h2 class="flex text-sm font-semibold text-strong">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="flex-none w-6 h-6"
        >
          <path
            d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
            class="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
          />
          <path
            d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
            class="stroke-zinc-400 dark:stroke-zinc-500"
          />
        </svg><span class="ml-3">Work</span>
      </h2>
      <ol class="mt-6 space-y-4">
        <li
          v-for="job in jobs"
          :key="job.code"
          class="flex gap-4"
        >
          <div
            class="relative flex items-center justify-center flex-none w-10 h-10 mt-1 rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0"
          >
            <img
              alt=""
              width="50"
              height="50"
              class="w-10 h-10 rounded-full"
              style="color:transparent"
              :src="job.logo"
            >
          </div>
          <dl class="flex flex-wrap flex-auto gap-x-2">
            <dt class="sr-only">
              Company
            </dt>
            <dd class="flex-none w-full text-sm font-medium text-strong">
              {{ job.company }}
            </dd>
            <dt class="sr-only">
              Role
            </dt>
            <dd class="text-xs text-default">
              {{ job.position }}
            </dd>
            <dt class="sr-only">
              Date
            </dt>
            <dd
              class="ml-auto text-xs text-subtle"
              :aria-label="`${job.from.text} until ${job.to.text}`"
            >
              <time
                :datetime="job.from.date"
              >{{ job.from.text }}</time>
              <span aria-hidden="true">—</span> <time :datetime="job.to.date">{{ job.to.text }}</time>
            </dd>
          </dl>
        </li>
      </ol><a
        class="inline-flex items-center justify-center w-full gap-2 px-3 py-2 mt-6 text-sm font-medium transition rounded-md outline-offset-2 active:transition-none bg-zinc-50 text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70 group"
        :href="resumePdf"
      >Download CV<svg
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        class="w-4 h-4 transition stroke-zinc-400 group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50"
      >
        <path
          d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg></a>
    </div>
  </div>
  <!-- ./ Work section -->
</template>
