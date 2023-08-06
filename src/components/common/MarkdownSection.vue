<script setup>
import { ref } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps({
    source: {
        type: String,
        required: true
    }
})
const mdToRender = ref('')
const markdown = new MarkdownIt()
const content = await fetch('/src/assets/articles/' + props.source)
    .then(res => res.text())
    .catch(err => console.log(err))
// .then(mdToRender = markdown.render(content))

mdToRender.value = content
console.log(mdToRender.value)
</script>

<template>
    <div class="w-full my-16 text-base prose max-w-none prose-3xl text-zinc-600 dark:text-zinc-400 prose-a:font-semibold prose-a:no-underline" v-html="markdown.render(mdToRender)"></div>
</template>
