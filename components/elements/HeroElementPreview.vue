<script setup lang="ts">
import { computed } from 'vue'
import type { ContentElement } from '../../services/contentRegionService'
import ElementPreviewWrapper from './ElementPreviewWrapper.vue'

interface Props {
  settings: Record<string, any>
  contentElements?: ContentElement[]
}

const props = defineProps<Props>()

const hasContent = computed(() => !!props.settings.title || !!props.settings.image_src)
</script>

<template>
  <ElementPreviewWrapper :has-content="hasContent">
    <div class="flex items-start gap-3">
      <img
        v-if="settings.image_src"
        :src="settings.image_src"
        alt=""
        class="w-16 h-16 object-cover rounded-md border border-border flex-shrink-0"
      />
      <div class="min-w-0">
        <div v-if="settings.title" class="font-semibold text-sm truncate">{{ settings.title }}</div>
        <div v-if="settings.lead" class="text-xs text-muted-foreground mt-0.5 line-clamp-2">{{ settings.lead }}</div>
      </div>
    </div>
  </ElementPreviewWrapper>
</template>
