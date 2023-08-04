<script setup>
const images = [
    {
        src: 'https://picsum.photos/seed/s/288/320',
        alt: 'A random placeholder from Lorem Picsum',
        classes: '-rotate-2',
    },
    {
        src: 'https://picsum.photos/seed/h/288/320',
        alt: 'A random placeholder from Lorem Picsum',
        classes: '-rotate-2',
    },
    {
        src: 'https://picsum.photos/seed/a/288/320',
        alt: 'A random placeholder from Lorem Picsum',
        classes: 'rotate-2',
    },
    {
        src: 'https://picsum.photos/seed/u/288/320',
        alt: 'A random placeholder from Lorem Picsum',
        classes: 'rotate-2',
    },
    {
        src: 'https://picsum.photos/seed/n/288/320',
        alt: 'A random placeholder from Lorem Picsum',
        classes: '-rotate-2',
    },
]
</script>

<template>
    <!-- Images section -->
    <div class="mt-16 sm:mt-20">
        <div class="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
            <div v-for="image in images"
                class="relative aspect-[9/10] ring-2 ring-gray-900 w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl"
                :class="image.classes">
                <img :alt="image.alt" class="absolute inset-0 h-full w-full object-cover" style="color:transparent"
                    :src="image.src">
            </div>
        </div>
    </div>
    <!-- ./ Images section -->
</template>
