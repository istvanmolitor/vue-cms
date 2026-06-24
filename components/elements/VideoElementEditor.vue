<script setup lang="ts">
import { computed } from 'vue'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
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
      <Input v-model="url" placeholder="https://www.youtube.com/watch?v=..." />
      <FieldError :errors="props.errors?.url" />
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
        <Input v-model="width" placeholder="100% vagy 640px" />
        <FieldError :errors="props.errors?.width" />
      </div>
      <div>
        <Label class="text-sm font-medium mb-1 block">Magasság</Label>
        <Input v-model="height" placeholder="450px" />
        <FieldError :errors="props.errors?.height" />
      </div>
    </div>
  </div>
</template>
