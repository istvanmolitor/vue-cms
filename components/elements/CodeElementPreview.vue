<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  settings: Record<string, any>
}

const props = defineProps<Props>()

const code = computed(() => props.settings.code || '')
const language = computed(() => props.settings.language || 'javascript')
</script>

<template>
  <div v-if="code" class="mt-2">
    <div class="rounded-lg bg-muted p-3 border border-border">
      <div class="text-xs text-muted-foreground mb-1 font-medium">{{ language }}</div>
      <pre class="text-xs overflow-x-auto"><code>{{ code }}</code></pre>
    </div>
  </div>
  <div v-else class="text-xs italic">
    Nincsenek beállítások - kattints a <span class="inline-block">⚙️</span> ikonra a szerkesztéshez
  </div>
</template>

<style scoped>
pre {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>

