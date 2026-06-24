<script setup lang="ts">
import { computed } from 'vue'
import type { ContentElement } from '../../services/contentRegionService'
import ElementPreviewWrapper from './ElementPreviewWrapper.vue'

interface Props {
  settings: Record<string, any>
  contentElements?: ContentElement[]
}

const props = defineProps<Props>()

const quote = computed(() => props.settings.quote || '')
const author = computed(() => props.settings.author || '')
</script>

<template>
  <ElementPreviewWrapper :has-content="!!quote">
    <blockquote class="border-l-4 border-primary pl-4 py-2 italic text-sm text-muted-foreground">
      <p class="mb-1">{{ quote }}</p>
      <footer v-if="author" class="text-xs not-italic font-medium text-foreground">
        — {{ author }}
      </footer>
    </blockquote>
  </ElementPreviewWrapper>
</template>

