<script setup lang="ts">
import { ref } from 'vue'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { name } = useElementEditor(props, emit, {
  name: ''
})

const touched = ref(false)
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Menü neve</Label>
      <Input
        v-model="name"
        placeholder="pl. main, footer"
        @blur="touched = true"
      />
      <FieldError v-if="touched && !name" errors="A menü neve kötelező." />
    </div>
  </div>
</template>
