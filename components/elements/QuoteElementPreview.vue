<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  settings: Record<string, any>
}

const props = defineProps<Props>()

const quote = computed(() => props.settings.quote || '')
const author = computed(() => props.settings.author || '')
</script>

<template>
  <div v-if="quote" class="mt-2">
    <blockquote class="border-l-4 border-primary pl-4 py-2 italic text-sm text-muted-foreground">
      <p class="mb-1">{{ quote }}</p>
      <footer v-if="author" class="text-xs not-italic font-medium text-foreground">
        — {{ author }}
      </footer>
    </blockquote>
  </div>
  <div v-else class="text-xs italic">
    Nincsenek beállítások - kattints a <span class="inline-block">⚙️</span> ikonra a szerkesztéshez
  </div>
</template>

