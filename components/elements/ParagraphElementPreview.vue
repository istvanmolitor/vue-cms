<script setup lang="ts">
import type { ContentElement } from '../../services/contentRegionService'
import ElementPreviewWrapper from './ElementPreviewWrapper.vue'

interface Props {
  settings: Record<string, any>
  contentElements?: ContentElement[]
}

const props = defineProps<Props>()
</script>

<template>
  <ElementPreviewWrapper :has-content="!!props.settings.content">
    <div class="text-sm leading-relaxed paragraph-preview" v-html="props.settings.content" />
  </ElementPreviewWrapper>
</template>

<style scoped>
.paragraph-preview :deep(strong) {
  font-weight: 600;
}

.paragraph-preview :deep(em) {
  font-style: italic;
}

.paragraph-preview :deep(a) {
  color: hsl(var(--primary));
  text-decoration: underline;
}

.paragraph-preview :deep(p) {
  margin: 0 0 0.5em;
}

.paragraph-preview :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
