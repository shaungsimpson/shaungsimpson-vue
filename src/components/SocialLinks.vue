<script setup>
import TwitterLogo from '@/components/svg/social/TwitterLogo.vue'
import LinkedInLogo from '@/components/svg/social/LinkedInLogo.vue'
import GithubLogo from '@/components/svg/social/GithubLogo.vue'

const links = [
  { link: '/about', label: 'About' },
  { link: '/articles', label: 'Articles' },
  { link: '/projects', label: 'Projects' },
]
</script>

<template>
  <div class="mt-6 flex gap-6">
    <a class="group -m-1 p-1" aria-label="Follow on Twitter" href="https://twitter.com">
      <TwitterLogo />
    </a>
    <a class="group -m-1 p-1" aria-label="Follow on GitHub" href="https://github.com">
      <GithubLogo />
    </a>
    <a class="group -m-1 p-1" aria-label="Follow on LinkedIn" href="https://linkedin.com">
      <LinkedInLogo />
    </a>
  </div>
</template>
