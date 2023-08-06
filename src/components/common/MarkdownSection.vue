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
const content = await fetch('/assets/articles/' + props.source)
    .then(res => res.text())
    .catch(err => console.log(err))
// .then(mdToRender = markdown.render(content))

mdToRender.value = content
console.log(mdToRender.value)
</script>

<template>
    <div class="w-full max-w-screen-sm my-16 text-base prose prose-strong:dark:text-zinc-400 prose-strong:text-zinc-600 lg:max-w-none text-zinc-600 dark:text-zinc-400" v-html="markdown.render(mdToRender)"></div>
</template>
