<script setup lang="ts">
import 'highlight.js/styles/github.min.css'
import 'md-editor-v3/lib/preview.css';
import { MdPreview, config } from 'md-editor-v3';
import MarkdownItAnchor from "markdown-it-anchor";

defineProps({
  source: {
    type: String,
    default: ""
  }
});

config({
  markdownItConfig: (md) => {
    const defaultRender = md.renderer.rules.image || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };


    md.use(MarkdownItAnchor)
    md.renderer.rules.image = function(tokens, idx, options, env, self) {
      const token = tokens[idx];
      token.attrPush(['data-zoomable', '']);
      return defaultRender(tokens, idx, options, env, self);
    };    
  }
})
</script>

<template>
  <MdPreview :model-value="source" preview-theme="github" code-theme="github" language="en-US"  />
</template>

<style>
  /* .md-editor-preview-wrapper {
    padding: 0 !important;
    text-align: left;
    word-break: keep-all !important;
  } */
</style>