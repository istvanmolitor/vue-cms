<script setup lang="ts">
import Label from '@admin/components/ui/Label.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import InputField from '@admin/components/ui/InputField.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { quote, author } = useElementEditor(props, emit, {
  quote: '',
  author: ''
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Idézet</Label>
      <Textarea v-model="quote" class="min-h-[96px]" placeholder="Az idézet szövege..." />
      <FieldError :errors="props.errors?.quote" />
    </div>
    <InputField id="author" label="Szerző" v-model="author" placeholder="Szerző neve" :errors="props.errors?.author" />
  </div>
</template>
