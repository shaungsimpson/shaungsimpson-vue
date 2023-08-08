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

let fetchContent = async () => {
    try {
        mdToRender.value = await fetch('/assets/articles/' + props.source)
            .then(res => res.text())
    } catch (error) {
        console.warn(error)
    }
}

fetchContent()
</script>

<template>
  <div
    class="md-prose-section"
    v-html="markdown.render(mdToRender)"
  />
</template>
