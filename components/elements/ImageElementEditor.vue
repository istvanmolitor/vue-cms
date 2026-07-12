<script setup lang="ts">
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import Select from '@admin/components/ui/Select.vue'
import Label from '@admin/components/ui/Label.vue'
import InputField from '@admin/components/ui/InputField.vue'
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

const uid = Math.random().toString(36).slice(2, 9)

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
      <InputField :id="`${uid}-alt`" label="Alternatív szöveg" v-model="alt" placeholder="Kép leírása" :errors="props.errors?.alt" />
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
        <InputField :id="`${uid}-width`" label="Szélesség" v-model="width" placeholder="640px vagy üres" :errors="props.errors?.width" />
      </div>
      <div>
        <InputField :id="`${uid}-height`" label="Magasság" v-model="height" placeholder="480px vagy üres" :errors="props.errors?.height" />
      </div>
    </div>
  </div>
</template>
