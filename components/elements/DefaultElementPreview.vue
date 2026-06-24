<script setup lang="ts">
import { computed } from 'vue'
import type { ContentElement } from '../../services/contentRegionService'
import ElementPreviewWrapper from './ElementPreviewWrapper.vue'

interface Props {
  settings: Record<string, any>
  contentElements?: ContentElement[]
}

const props = defineProps<Props>()

const hasSettings = computed(() => Object.keys(props.settings).length > 0)
</script>

<template>
  <ElementPreviewWrapper :has-content="hasSettings">
    <div class="space-y-1">
      <div v-for="(value, key) in settings" :key="key" class="text-xs">
        <span class="font-medium">{{ key }}:</span>
        <span class="ml-1">{{ typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : String(value).substring(0, 50) }}</span>
        <span v-if="String(value).length > 50">...</span>
      </div>
    </div>
  </ElementPreviewWrapper>
</template>

