<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  settings: Record<string, any>
}

const props = defineProps<Props>()

const text = computed(() => props.settings.text || '')
const align = computed(() => props.settings.align || 'left')
</script>

<template>
  <div v-if="text" class="mt-2">
    <p :class="`text-${align} text-sm leading-relaxed`">
      {{ text }}
    </p>
  </div>
  <div v-else class="text-xs italic">
    Nincsenek beállítások - kattints a <span class="inline-block">⚙️</span> ikonra a szerkesztéshez
  </div>
</template>

