<script setup lang="ts">
import { computed } from 'vue'
import type { ContentElement } from '../../services/contentRegionService'

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
  <div v-if="url" class="mt-2">
    <div class="relative overflow-hidden rounded-lg shadow-sm border border-border" :style="{ width: '100%', maxWidth: '400px', height: '200px' }">
      <iframe
        :src="url"
        :title="title || 'Iframe'"
        :allowfullscreen="allowFullscreen"
        class="w-full h-full border-0"
      ></iframe>
    </div>
  </div>
  <div v-else class="text-xs italic">
    Nincsenek beállítások - kattints a <span class="inline-block">⚙️</span> ikonra a szerkesztéshez
  </div>
</template>


