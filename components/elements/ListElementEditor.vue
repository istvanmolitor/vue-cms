<script setup lang="ts">
import Button from '@admin/components/ui/button/Button.vue'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import Select from '@admin/components/ui/Select.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { Plus, Trash } from 'lucide-vue-next'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { items, type: listType } = useElementEditor(props, emit, {
  items: [''],
  type: 'ul'
})

const listTypeOptions = [
  { value: 'ul', label: 'Felsorolás (pontozott)' },
  { value: 'ol', label: 'Számozás' },
]

const addItem = () => {
  items.value.push('')
}

const removeItem = (index: number) => {
  items.value.splice(index, 1)
  if (items.value.length === 0) {
    items.value.push('')
  }
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Lista típusa</Label>
      <Select v-model="listType" :options="listTypeOptions" />
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <Label>Lista elemek</Label>
        <Button type="button" variant="outline" size="sm" @click="addItem">
          <Plus class="w-3 h-3 mr-1" />
          Elem hozzáadása
        </Button>
      </div>
      <FieldError :errors="props.errors?.items" />
      <div class="space-y-2">
        <div v-for="(_item, index) in items" :key="index" class="flex gap-2">
          <Input v-model="items[index]" class="flex-1" :placeholder="`${index + 1}. elem`" />
          <Button type="button" variant="ghost" size="icon" @click="removeItem(index)" :disabled="items.length === 1">
            <Trash class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

