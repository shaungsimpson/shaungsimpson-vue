<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description: 'Learn more about Shaun Simpson, a software engineer based in Sydney, Australia.',
})
</script>

<template>
  <div class="about">
    <ImageTextBlock title="Hello there!" img="/assets/img/shaun-pilot.jpeg" height="w-44" width="w-44">
      <p class="mt-6 text-base text-default">
        My name is Shaun, and I'm a software engineer living in Sydney, Australia. I have a much-loved wife, two amazing
        children and an incredibly spoiled dog. Away from the keyboard I occasionally build custom furniture, and I love
        catching up with friends and family over a slow-cooked barbecue, ideally from a charcoal offset smoker.
      </p>
    </ImageTextBlock>
    <TextBlock>
      <p class="mt-6 text-base text-default">
        I've worked in software for over a decade, in roles spanning design, development, architecture and system design.
        Along the way I've worked with some amazingly talented people, from designers and copywriters to project managers
        and fellow developers. Every one of them taught me something, and I'm grateful for it.
      </p>

      <p class="mt-6 text-base text-default">
        I came to software from other careers, and they gave me a strong focus on customer experience. I've often been on
        the receiving end of software someone else designed, and that perspective helps me understand the people I build for.
      </p>

      <p class="mt-6 text-base text-default">
        I'm an artist at heart. I look for solutions that meet people's needs and are a pleasure to use, whether that's
        elegant code, simple APIs that are easy to consume, or interfaces that make complex tasks feel simple. Small details
        can make a big difference.
      </p>

      <p class="mt-6 text-base text-default">
        If you'd like to see how I work, my articles are the best place to start, especially
        <NuxtLink to="/articles/subsetting-material-symbols-icon-font/" class="text-link underline">cutting an icon font by 97%</NuxtLink>,
        a case study in fixing a real problem within real constraints.
      </p>
    </TextBlock>
  </div>
</template>
