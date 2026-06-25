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
  <ElementPreviewWrapper :has-content="!!settings.post_id">
    <div class="text-xs">
      <span class="font-medium">Post Hero:</span>
      <span class="ml-1 text-muted-foreground">Post #{{ settings.post_id }}</span>
    </div>
  </ElementPreviewWrapper>
</template>
