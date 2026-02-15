<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  settings: Record<string, any>
}

const props = defineProps<Props>()

const items = computed(() => props.settings.items || [])
const listType = computed(() => props.settings.type || 'ul')
</script>

<template>
  <div v-if="items.length > 0" class="mt-2">
    <component :is="listType" class="text-sm pl-5 space-y-1" :class="listType === 'ul' ? 'list-disc' : 'list-decimal'">
      <li v-for="(item, index) in items" :key="index">{{ item }}</li>
    </component>
  </div>
  <div v-else class="text-xs italic">
    Nincsenek beállítások - kattints a <span class="inline-block">⚙️</span> ikonra a szerkesztéshez
  </div>
</template>

