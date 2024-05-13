<template>
  <div v-html="markdown.render(source)" />
</template>

<script setup lang="ts">
import '~/assets/hljs.css'

import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import MarkdownItNamedCodeBlock from 'markdown-it-named-code-blocks'
//@ts-ignore
import MarkdownItToc from 'markdown-it-table-of-contents'
import MarkdownItTocDoneRight from 'markdown-it-toc-done-right'

const markdown = new MarkdownIt()
  .use(MarkdownItAnchor, {
    permalink: MarkdownItAnchor.permalink.linkInsideHeader({
      symbol: `
        <svg data-v-4fa0a2a1="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="icon text-lg" width="1em" height="1em" viewBox="0 0 16 16"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M8.914 6.025a.75.75 0 0 1 1.06 0a3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402a.75.75 0 0 1 1.251.827a2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828a.75.75 0 0 1 0-1.06"></path><path d="M7.086 9.975a.75.75 0 0 1-1.06 0a3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402a.75.75 0 0 1-1.251-.827a2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828a.75.75 0 0 1 0 1.06"></path></g></svg>
      `,
      placement: 'before',
      class: 'test'
    })
  })
  .use(MarkdownItHighlightjs)
  .use(MarkdownItNamedCodeBlock)
  .use(MarkdownItTocDoneRight, {})

defineProps({
  source: {
    type: String,
    default: ""
  }
});
</script>