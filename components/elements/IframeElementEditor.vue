<script setup lang="ts">
import Label from '@admin/components/ui/Label.vue'
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
      <input
        v-model="url"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="https://example.com"
      />
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
      <input
        v-model="title"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Iframe leírása"
      />
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
    <div class="flex items-center space-x-2">
      <input
        v-model="allowFullscreen"
        type="checkbox"
        id="allowFullscreen"
        class="w-4 h-4 rounded border-input"
      />
      <Label for="allowFullscreen" class="text-sm font-medium cursor-pointer">
        Teljes képernyő engedélyezése
      </Label>
    </div>
  </div>
</template>
