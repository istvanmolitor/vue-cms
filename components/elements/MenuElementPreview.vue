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
  <ElementPreviewWrapper :has-content="!!settings.name">
    <div class="text-xs">
      <span class="font-medium">Menü:</span>
      <span class="ml-1">{{ settings.name }}</span>
    </div>
  </ElementPreviewWrapper>
</template>
