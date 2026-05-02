<script setup lang="ts">
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import Select from '@admin/components/ui/Select.vue'
import Label from '@admin/components/ui/Label.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { src, alt, width, height, alignment } = useElementEditor(props, emit, {
  src: '',
  alt: '',
  width: '',
  height: '',
  alignment: 'left'
})

const alignmentOptions = [
  { value: 'left', label: 'Balra' },
  { value: 'center', label: 'Középen' },
  { value: 'right', label: 'Jobbra' }
]
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Kép URL</Label>
      <MediaFilePicker
        v-model="src"
        :accept-types="['image/*']"
        :show-preview="true"
      />
    </div>
    <div>
      <Label class="text-sm font-medium mb-1 block">Alternatív szöveg</Label>
      <input
        v-model="alt"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Kép leírása"
      />
    </div>
    <div>
      <Label class="text-sm font-medium mb-1 block">Elrendezés</Label>
      <Select
        v-model="alignment"
        :options="alignmentOptions"
        placeholder="Válassz elrendezést..."
      />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label class="text-sm font-medium mb-1 block">Szélesség</Label>
        <input
          v-model="width"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="640px vagy üres"
        />
      </div>
      <div>
        <Label class="text-sm font-medium mb-1 block">Magasság</Label>
        <input
          v-model="height"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="480px vagy üres"
        />
      </div>
    </div>
  </div>
</template>
