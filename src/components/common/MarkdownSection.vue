<script setup>
import { ref } from 'vue'
import MarkdownIt from 'markdown-it'

const props = {
    source: {
        type: String,
        required: true
    }
}
const mdToRender = ref('')
const markdown = new MarkdownIt()
const content = async () => {
    await fetch('/assets/articles/' + props.source)
    .then(res => res.text())
    .catch(err => console.log(err))
}
mdToRender.value = content
</script>

<template>
  <div
    class="w-full max-w-screen-sm my-16 text-base prose prose-strong:dark:text-zinc-400 prose-strong:text-zinc-600 lg:max-w-none text-default"
  >
    {{ markdown.render(mdToRender) }}
  </div>
</template>
