<script setup lang="ts">
import InputField from '@admin/components/ui/InputField.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { limit } = useElementEditor(props, emit, {
  limit: 5,
})

const uid = Math.random().toString(36).slice(2, 9)
</script>

<template>
  <div class="space-y-4">
    <div>
      <InputField
        :id="`${uid}-limit`"
        label="Megjelenített elemek száma"
        v-model.number="limit"
        type="number"
        min="1"
        max="50"
        placeholder="5"
        class="w-32"
        :errors="props.errors?.limit"
      />
    </div>
  </div>
</template>
