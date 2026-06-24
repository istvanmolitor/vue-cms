<script setup lang="ts">
import { computed } from 'vue'
import type { ContentElement } from '../../services/contentRegionService'
import ElementPreviewWrapper from './ElementPreviewWrapper.vue'

interface Props {
  settings: Record<string, any>
  contentElements?: ContentElement[]
}

const props = defineProps<Props>()

const url = computed(() => props.settings.url || '')
const title = computed(() => props.settings.title || '')
const allowFullscreen = computed(() => props.settings.allowFullscreen ?? true)
</script>

<template>
  <ElementPreviewWrapper :has-content="!!url">
    <div class="relative overflow-hidden rounded-lg shadow-sm border border-border" :style="{ width: '100%', maxWidth: '400px', height: '200px' }">
      <iframe
        :src="url"
        :title="title || 'Iframe'"
        :allowfullscreen="allowFullscreen"
        class="w-full h-full border-0"
      ></iframe>
    </div>
  </ElementPreviewWrapper>
</template>


