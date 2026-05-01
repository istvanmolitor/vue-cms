<script setup lang="ts">
import { ref, watch, onMounted, defineAsyncComponent } from 'vue'
import Label from '@admin/components/ui/Label.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import IconButton from '@admin/components/ui/button/IconButton.vue'
import type { ContentElement } from '../../services/contentRegionService'

// Use async component to avoid circular dependency
const EditContent = defineAsyncComponent(() => import('../EditContent.vue'))

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const columns = ref<ContentElement[]>([])

// Initialize if empty
onMounted(() => {
  if (!props.modelValue?.content_elements || props.modelValue.content_elements.length === 0) {
    // Create default 2 columns
    columns.value = [
      {
        id: null,
        type: 'column',
        settings: { width: '50%' },
        sort: 0,
        content_elements: []
      },
      {
        id: null,
        type: 'column',
        settings: { width: '50%' },
        sort: 1,
        content_elements: []
      }
    ] as unknown as ContentElement[]
    updateValue()
  } else {
    columns.value = props.modelValue.content_elements || []
  }
})

let isUpdating = false

watch(() => props.modelValue, (newVal) => {
  if (newVal && !isUpdating) {
    columns.value = newVal.content_elements || []
  }
}, { deep: true })

const updateValue = () => {
  isUpdating = true
  emit('update:modelValue', {
    type: 'columns',
    settings: props.modelValue?.settings || {},
    content_elements: columns.value
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
    if (col.settings) {
      col.settings.width = newWidth
    }
  })

  // Add new column
  columns.value.push({
    id: null,
    type: 'column',
    settings: { width: newWidth },
    sort: columns.value.length,
    content_elements: []
  } as unknown as ContentElement)

  updateValue()
}

const removeColumn = (index: number) => {
  if (columns.value.length <= 1) return

  columns.value.splice(index, 1)

  // Redistribute widths evenly
  const newWidth = `${Math.floor(100 / columns.value.length)}%`
  columns.value.forEach(col => {
    if (col.settings) {
      col.settings.width = newWidth
    }
  })

  updateValue()
}

const updateColumnContent = (index: number, content: ContentElement[]) => {
  const column = columns.value[index]
  if (column) {
    column.content_elements = content
  }
  updateValue()
}
</script>

<template>
  <div class="space-y-4 p-4">
    <div class="flex items-center justify-between mb-4">
      <Label class="text-sm font-medium">Oszlopok ({{ columns.length }} darab)</Label>
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

    <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }">
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
            v-if="columns.length > 1"
            icon="trash"
            size="sm"
            @click="removeColumn(index)"
          />
        </div>

        <EditContent
          :model-value="column.content_elements || []"
          @update:model-value="updateColumnContent(index, $event)"
        />
      </div>
    </div>

    <div v-if="columns.length === 0" class="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
      Nincsenek oszlopok. Kattints az "Oszlop hozzáadása" gombra.
    </div>
  </div>
</template>
