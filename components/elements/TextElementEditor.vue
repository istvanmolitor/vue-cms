<script setup lang="ts">
import Label from '@admin/components/ui/Label.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import Select from '@admin/components/ui/Select.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()
const { text, align } = useElementEditor(props, emit, {
  text: '',
  align: 'left'
})

const alignOptions = [
  { value: 'left', label: 'Balra' },
  { value: 'center', label: 'Középre' },
  { value: 'right', label: 'Jobbra' },
  { value: 'justify', label: 'Sorkizárt' },
]
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Tartalom</Label>
      <Textarea
        v-model="text"
        class="min-h-[120px]"
        placeholder="Szöveg tartalom..."
      />
      <FieldError :errors="props.errors?.text" />
    </div>

    <div>
      <Label class="text-sm font-medium mb-1 block">Igazítás</Label>
      <Select v-model="align" :options="alignOptions" />
      <FieldError :errors="props.errors?.align" />
    </div>

    <!-- Preview -->
    <div v-if="text" class="mt-4 p-4 border rounded-md bg-muted/30">
      <p class="text-xs text-muted-foreground mb-2">Előnézet:</p>
      <p :class="`text-${align}`" class="text-preview">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.text-preview {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
