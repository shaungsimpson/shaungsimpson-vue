<script setup>
import dragJsImg from '/src/assets/img/improve-ux.jpg?format=webp'
import applicationImg from '/src/assets/img/application-live.jpg?format=webp'
import devHeadphonesImg from '/src/assets/img/test-and-refine.jpg?format=webp'
import vueCodeImg from '/src/assets/img/building-the-base.jpg?format=webp'
import coffeeImg from '/src/assets/img/coffee.jpg?format=webp'
const images = [
    {
        src: coffeeImg,
        alt: 'Photo by Pankaj Patel',
        classes: 'rotate-2',
        credit: 'Photo by <a href="https://unsplash.com/@nate_dumlao?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nathan Dumlao</a> on <a href="https://unsplash.com/photos/2z3MOB3kfJU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
    },
    {
        src: dragJsImg,
        alt: 'Photo by Pankaj Patel',
        classes: '-rotate-2',
        credit: 'Photo by <a href="https://unsplash.com/@nublson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nubelson Fernandes</a> on <a href="https://unsplash.com/photos/MuukuDZu3Vs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
    },
    {
        src: devHeadphonesImg,
        alt: 'Photo by Pankaj Patel',
        classes: '-rotate-2',
        credit: 'Photo by <a href="https://unsplash.com/@pankajpatel?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Pankaj Patel</a> on <a href="https://unsplash.com/photos/vxgt_Zu0O00?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
    },
    {
        src: vueCodeImg,
        alt: 'Photo by Pankaj Patel',
        classes: 'rotate-2',
        credit: 'Photo by <a href="https://unsplash.com/@afgprogrammer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mohammad Rahmani</a> on <a href="https://unsplash.com/photos/8qEB0fTe9Vw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
    },
    {
        src: applicationImg,
        alt: 'Photo by Carlos Muza',
        classes: '-rotate-2',
        credit: 'Photo by <a href="https://unsplash.com/@kmuza?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Carlos Muza</a> on <a href="https://unsplash.com/photos/hpjSkU2UYSU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
    },
]
</script>

<template>
  <!-- Images section -->
  <div class="mt-16 sm:mt-20">
    <div class="flex justify-center gap-5 py-4 -my-4 overflow-hidden sm:gap-8">
      <div
        v-for="image in images"
        :key="image.src"
        class="relative aspect-[9/10] ring-2 ring-gray-900 w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl"
        :class="image.classes"
      >
        <img
          :alt="image.alt"
          class="absolute inset-0 object-cover w-full h-full"
          style="color:transparent"
          :src="image.src"
        >
      </div>
    </div>
  </div>
  <!-- ./ Images section -->
</template>
