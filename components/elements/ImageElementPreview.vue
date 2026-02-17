<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  settings: Record<string, any>
}

const props = defineProps<Props>()

const src = computed(() => props.settings.src || '')
const alt = computed(() => props.settings.alt || 'Kép')
const width = computed(() => props.settings.width || 'auto')
const height = computed(() => props.settings.height || 'auto')
const alignment = computed(() => props.settings.alignment || 'left')

const alignmentClass = computed(() => {
  switch (alignment.value) {
    case 'center':
      return 'flex justify-center'
    case 'right':
      return 'flex justify-end'
    default:
      return 'flex justify-start'
  }
})
</script>

<template>
  <div v-if="src" class="mt-2">
    <div :class="alignmentClass">
      <div>
        <img
          :src="src"
          :alt="alt"
          :style="{
            width: width,
            height: height,
            maxWidth: '300px'
          }"
          class="rounded-lg shadow-sm border border-border"
        />
        <div v-if="alt && alt !== 'Kép'" class="text-xs text-muted-foreground mt-1">
          {{ alt }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-xs italic">
    Nincsenek beállítások - kattints a <span class="inline-block">⚙️</span> ikonra a szerkesztéshez
  </div>
</template>

