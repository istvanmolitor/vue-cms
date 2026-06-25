<script setup lang="ts">
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { limit } = useElementEditor(props, emit, {
  limit: 5,
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Megjelenített elemek száma</Label>
      <Input
        v-model.number="limit"
        type="number"
        min="1"
        max="50"
        placeholder="5"
        class="w-32"
      />
      <FieldError :errors="props.errors?.limit" />
    </div>
  </div>
</template>
