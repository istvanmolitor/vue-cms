<script setup lang="ts">
import { computed } from 'vue'
import Label from '@admin/components/ui/Label.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { url, width, height } = useElementEditor(props, emit, {
  url: '',
  width: '100%',
  height: '450px'
})

const embedUrl = computed(() => {
  if (!url.value) return ''

  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.value.match(regExp)

  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : ''
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">YouTube URL</Label>
      <input
        v-model="url"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="https://www.youtube.com/watch?v=..."
      />
      <div v-if="embedUrl" class="mt-4">
        <div class="relative overflow-hidden rounded-lg shadow-sm border border-border aspect-video" style="width: 300px;">
          <iframe
            :src="embedUrl"
            allowfullscreen
            class="w-full h-full border-0"
          ></iframe>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label class="text-sm font-medium mb-1 block">Szélesség</Label>
        <input
          v-model="width"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="100% vagy 640px"
        />
      </div>
      <div>
        <Label class="text-sm font-medium mb-1 block">Magasság</Label>
        <input
          v-model="height"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="450px"
        />
      </div>
    </div>
  </div>
</template>
