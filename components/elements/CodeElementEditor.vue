<script setup lang="ts">
import Label from '@admin/components/ui/Label.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import Select from '@admin/components/ui/Select.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { code, language } = useElementEditor(props, emit, {
  code: '',
  language: 'javascript'
})

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'php', label: 'PHP' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
]
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Nyelv</Label>
      <Select v-model="language" :options="languageOptions" />
      <FieldError :errors="props.errors?.language" />
    </div>
    <div>
      <Label class="text-sm font-medium mb-1 block">Kód</Label>
      <Textarea v-model="code" class="min-h-[240px] font-mono" placeholder="// Írd be a kódot..." />
      <FieldError :errors="props.errors?.code" />
    </div>
  </div>
</template>
