<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  settings: Record<string, any>
}

const props = defineProps<Props>()

const getHeadingClass = (level: number) => {
  const baseClasses = 'font-bold text-foreground'
  const sizeClasses = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base'
  }
  return `${baseClasses} ${sizeClasses[level as keyof typeof sizeClasses] || sizeClasses[1]}`
}

const level = computed(() => props.settings.level || 1)
const text = computed(() => props.settings.text || '')
</script>

<template>
  <div v-if="text" class="mt-2">
    <component
      :is="`h${level}`"
      :class="getHeadingClass(level)"
    >
      {{ text }}
    </component>
  </div>
  <div v-else class="text-xs italic">
    Nincsenek beállítások - kattints a <span class="inline-block">⚙️</span> ikonra a szerkesztéshez
  </div>
</template>

