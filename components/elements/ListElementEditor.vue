<script setup lang="ts">
import Button from '@admin/components/ui/button/Button.vue'
import Label from '@admin/components/ui/Label.vue'
import { Plus, Trash } from 'lucide-vue-next'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { items, type: listType } = useElementEditor(props, emit, {
  items: [''],
  type: 'ul'
})

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
      <select
        v-model="listType"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="ul">Felsorolás (pontozott)</option>
        <option value="ol">Számozás</option>
      </select>
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <Label class="text-sm font-medium">Lista elemek</Label>
        <Button type="button" variant="outline" size="sm" @click="addItem">
          <Plus class="w-3 h-3 mr-1" />
          Elem hozzáadása
        </Button>
      </div>
      <div class="space-y-2">
        <div v-for="(_item, index) in items" :key="index" class="flex gap-2">
          <input
            v-model="items[index]"
            type="text"
            class="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :placeholder="`${index + 1}. elem`"
          />
          <Button type="button" variant="ghost" size="icon" @click="removeItem(index)" :disabled="items.length === 1">
            <Trash class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

