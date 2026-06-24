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

const embedUrl = computed(() => {
  if (!url.value) return ''

  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.value.match(regExp)

  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : ''
})
</script>

<template>
  <ElementPreviewWrapper :has-content="!!embedUrl">
    <div class="relative overflow-hidden rounded-lg shadow-sm border border-border aspect-video" style="width: 300px;">
      <iframe
        :src="embedUrl"
        allowfullscreen
        class="w-full h-full border-0"
      ></iframe>
    </div>
  </ElementPreviewWrapper>
</template>

