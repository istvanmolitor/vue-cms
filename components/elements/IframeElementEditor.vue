<script setup lang="ts">
import InputField from '@admin/components/ui/InputField.vue'
import CheckboxField from '@admin/components/ui/CheckboxField.vue'
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

const uid = Math.random().toString(36).slice(2, 9)
</script>

<template>
  <div class="space-y-4">
    <div>
      <InputField :id="`${uid}-url`" label="URL" v-model="url" placeholder="https://example.com" :errors="props.errors?.url" />
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
      <InputField :id="`${uid}-title`" label="Cím (title attribútum)" v-model="title" placeholder="Iframe leírása" :errors="props.errors?.title" />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <InputField :id="`${uid}-width`" label="Szélesség" v-model="width" placeholder="100% vagy 640px" :errors="props.errors?.width" />
      <InputField :id="`${uid}-height`" label="Magasság" v-model="height" placeholder="450px" :errors="props.errors?.height" />
    </div>
    <CheckboxField :id="`${uid}-allow-fullscreen`" label="Teljes képernyő engedélyezése" v-model="allowFullscreen" />
  </div>
</template>
