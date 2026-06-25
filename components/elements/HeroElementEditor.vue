<script setup lang="ts">
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { image_src, title, lead } = useElementEditor(props, emit, {
  image_src: '',
  title: '',
  lead: ''
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Kép</Label>
      <MediaFilePicker
        v-model="image_src"
        :accept-types="['image/*']"
        :show-preview="true"
      />
      <FieldError :errors="props.errors?.image_src" />
    </div>
    <div>
      <Label class="text-sm font-medium mb-1 block">Cím</Label>
      <Input v-model="title" placeholder="Hero cím..." />
      <FieldError :errors="props.errors?.title" />
    </div>
    <div>
      <Label class="text-sm font-medium mb-1 block">Lead</Label>
      <Textarea v-model="lead" class="min-h-[96px]" placeholder="Bevezető szöveg..." />
      <FieldError :errors="props.errors?.lead" />
    </div>
  </div>
</template>
