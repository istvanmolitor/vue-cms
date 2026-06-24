<script setup lang="ts">
import { computed } from 'vue'
import type { ContentElement } from '../../services/contentRegionService'
import ElementPreviewWrapper from './ElementPreviewWrapper.vue'

interface Props {
  settings: Record<string, any>
  contentElements?: ContentElement[]
}

const props = defineProps<Props>()

const items = computed(() => props.settings.items || [])
const listType = computed(() => props.settings.type || 'ul')
</script>

<template>
  <ElementPreviewWrapper :has-content="items.length > 0">
    <component :is="listType" class="text-sm pl-5 space-y-1" :class="listType === 'ul' ? 'list-disc' : 'list-decimal'">
      <li v-for="(item, index) in items" :key="index">{{ item }}</li>
    </component>
  </ElementPreviewWrapper>
</template>

