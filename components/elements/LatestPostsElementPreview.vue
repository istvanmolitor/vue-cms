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
  <ElementPreviewWrapper :has-content="!!settings.limit">
    <div class="text-xs">
      <span class="font-medium">Legfrissebb posztok:</span>
      <span class="ml-1 text-muted-foreground">{{ settings.limit ?? 5 }} elem</span>
    </div>
  </ElementPreviewWrapper>
</template>
