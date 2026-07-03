<script setup lang="ts">
import MediaFilePicker from '@media/components/MediaFilePicker.vue'
import Label from '@admin/components/ui/Label.vue'
import InputField from '@admin/components/ui/InputField.vue'
import TextareaField from '@admin/components/ui/TextareaField.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { image_src, title, lead, link, link_text } = useElementEditor(props, emit, {
  image_src: '',
  title: '',
  lead: '',
  link: '',
  link_text: ''
})
</script>

<template>
  <div class="space-y-4">
    <InputField id="title" label="Cím" v-model="title" placeholder="Hero cím..." :errors="props.errors?.title" />
    <div>
      <Label>Kép</Label>
      <MediaFilePicker
        v-model="image_src"
        :accept-types="['image/*']"
        :show-preview="true"
      />
      <FieldError :errors="props.errors?.image_src" />
    </div>
    <TextareaField id="lead" label="Lead" v-model="lead" :rows="4" placeholder="Bevezető szöveg..." :errors="props.errors?.lead" />
    <InputField id="link" label="Link" v-model="link" placeholder="https://..." :errors="props.errors?.link" />
    <InputField id="link_text" label="Link szövege" v-model="link_text" placeholder="Olvasd tovább" :errors="props.errors?.link_text" />
  </div>
</template>
