<script setup lang="ts">
import { ref, watch, onMounted, defineAsyncComponent } from 'vue'
import Label from '@admin/components/ui/Label.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import IconButton from '@admin/components/ui/button/IconButton.vue'
import type { ContentElement } from '../../services/contentRegionService'

// Use async component to avoid circular dependency
const EditContent = defineAsyncComponent(() => import('../EditContent.vue'))

interface ColumnData {
  content_elements: ContentElement[]
  width?: string
}

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const columns = ref<ColumnData[]>([])
const columnsCount = ref(2)

// Initialize if empty
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
    // Create default 2 columns
    columns.value = [
      { content_elements: [], width: '50%' },
      { content_elements: [], width: '50%' }
    ]
    columnsCount.value = 2
    updateValue()
  } else {
    columns.value = props.modelValue.columns || []
    columnsCount.value = props.modelValue.columns_count || 2
  }
})

let isUpdating = false

watch(() => props.modelValue, (newVal) => {
  if (newVal && !isUpdating) {
    columns.value = newVal.columns || []
    columnsCount.value = newVal.columns_count || 2
  }
}, { deep: true })

const updateValue = () => {
  isUpdating = true
  emit('update:modelValue', {
    columns: columns.value,
    columns_count: columnsCount.value
  })
  // Reset flag after a tick to allow prop updates
  setTimeout(() => {
    isUpdating = false
  }, 0)
}

const addColumn = () => {
  const newWidth = `${Math.floor(100 / (columns.value.length + 1))}%`

  // Adjust existing columns widths
  columns.value.forEach(col => {
    col.width = newWidth
  })

  // Add new column
  columns.value.push({
    content_elements: [],
    width: newWidth
  })

  columnsCount.value = columns.value.length
  updateValue()
}

const removeColumn = (index: number) => {
  if (columns.value.length <= 1) return

  columns.value.splice(index, 1)

  // Redistribute widths evenly
  const newWidth = `${Math.floor(100 / columns.value.length)}%`
  columns.value.forEach(col => {
    col.width = newWidth
  })

  columnsCount.value = columns.value.length
  updateValue()
}

const updateColumnContent = (index: number, content: ContentElement[]) => {
  columns.value[index]!.content_elements = content
  updateValue()
}
</script>

<template>
  <div class="space-y-4 p-4">
    <div class="flex items-center justify-between mb-4">
      <Label class="text-sm font-medium">Oszlopok ({{ columnsCount }} darab)</Label>
      <Button
        type="button"
        size="sm"
        variant="outline"
        @click="addColumn"
      >
        <Icon name="plus" class="w-4 h-4 mr-2" />
        Oszlop hozzáadása
      </Button>
    </div>

    <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }">
      <div
        v-for="(column, index) in columns"
        :key="index"
        class="border rounded-lg p-4 bg-white dark:bg-gray-900 relative"
      >
        <div class="flex items-center justify-between mb-3 pb-2 border-b">
          <Label class="text-xs font-bold uppercase text-muted-foreground">
            Oszlop {{ index + 1 }}
          </Label>
          <IconButton
            v-if="columnsCount > 1"
            icon="trash"
            size="sm"
            @click="removeColumn(index)"
          />
        </div>

        <EditContent
          :model-value="column.content_elements"
          @update:model-value="updateColumnContent(index, $event)"
        />
      </div>
    </div>

    <div v-if="columns.length === 0" class="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
      Nincsenek oszlopok. Kattints az "Oszlop hozzáadása" gombra.
    </div>
  </div>
</template>

