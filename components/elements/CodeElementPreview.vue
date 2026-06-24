<script setup lang="ts">
import { computed } from 'vue'
import type { ContentElement } from '../../services/contentRegionService'
import ElementPreviewWrapper from './ElementPreviewWrapper.vue'

interface Props {
  settings: Record<string, any>
  contentElements?: ContentElement[]
}

const props = defineProps<Props>()

const code = computed(() => props.settings.code || '')
const language = computed(() => props.settings.language || 'javascript')
</script>

<template>
  <ElementPreviewWrapper :has-content="!!code">
    <div class="rounded-lg bg-muted p-3 border border-border">
      <div class="text-xs text-muted-foreground mb-1 font-medium">{{ language }}</div>
      <pre class="text-xs overflow-x-auto"><code>{{ code }}</code></pre>
    </div>
  </ElementPreviewWrapper>
</template>

<style scoped>
pre {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>

