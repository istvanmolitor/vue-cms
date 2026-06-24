<script setup lang="ts">
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { url, width, height, title, allowFullscreen } = useElementEditor(props, emit, {
  url: '',
  width: '100%',
  height: '450px',
  title: '',
  allowFullscreen: true
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">URL</Label>
      <Input v-model="url" placeholder="https://example.com" />
      <FieldError :errors="props.errors?.url" />
      <div v-if="url" class="mt-4">
        <div class="relative overflow-hidden rounded-lg shadow-sm border border-border" :style="{ width: '100%', maxWidth: '600px', height: '300px' }">
          <iframe
            :src="url"
            :title="title || 'Iframe előnézet'"
            :allowfullscreen="allowFullscreen"
            class="w-full h-full border-0"
          ></iframe>
        </div>
      </div>
    </div>
    <div>
      <Label class="text-sm font-medium mb-1 block">Cím (title attribútum)</Label>
      <Input v-model="title" placeholder="Iframe leírása" />
      <FieldError :errors="props.errors?.title" />
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
    <div class="flex items-center space-x-2">
      <Checkbox v-model="allowFullscreen" />
      <Label class="text-sm font-medium cursor-pointer">
        Teljes képernyő engedélyezése
      </Label>
    </div>
  </div>
</template>
