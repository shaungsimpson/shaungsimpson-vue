<script setup>
import TwitterLogo from '@/components/svg/social/TwitterLogo.vue'
import LinkedInLogo from '@/components/svg/social/LinkedInLogo.vue'
import GithubLogo from '@/components/svg/social/GithubLogo.vue'
</script>

<template>
  <div class="flex gap-6 mt-6">
    <a
      class="p-1 -m-1 group"
      aria-label="Follow on Twitter"
      href="https://twitter.com/shaungsimpson"
    >
      <TwitterLogo />
    </a>
    <a
      class="p-1 -m-1 group"
      aria-label="Find me on Github"
      href="https://github.com/shaungsimpson"
    >
      <GithubLogo />
    </a>
    <a
      class="p-1 -m-1 group"
      aria-label="Find me on LinkedIn"
      href="https://www.linkedin.com/in/shaun-simpson-66983759"
    >
      <LinkedInLogo />
    </a>
  </div>
</template>
