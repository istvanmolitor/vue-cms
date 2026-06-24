<script setup lang="ts">
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import Select from '@admin/components/ui/Select.vue'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
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
      <FieldError :errors="props.errors?.src" />
    </div>
    <div>
      <Label class="text-sm font-medium mb-1 block">Alternatív szöveg</Label>
      <Input
        v-model="alt"
        placeholder="Kép leírása"
      />
      <FieldError :errors="props.errors?.alt" />
    </div>
    <div>
      <Label class="text-sm font-medium mb-1 block">Elrendezés</Label>
      <Select
        v-model="alignment"
        :options="alignmentOptions"
        placeholder="Válassz elrendezést..."
      />
      <FieldError :errors="props.errors?.alignment" />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label class="text-sm font-medium mb-1 block">Szélesség</Label>
        <Input
          v-model="width"
          placeholder="640px vagy üres"
        />
        <FieldError :errors="props.errors?.width" />
      </div>
      <div>
        <Label class="text-sm font-medium mb-1 block">Magasság</Label>
        <Input
          v-model="height"
          placeholder="480px vagy üres"
        />
        <FieldError :errors="props.errors?.height" />
      </div>
    </div>
  </div>
</template>
