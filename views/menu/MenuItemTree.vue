<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, IconButton, Icon, Input, Checkbox } from '@admin'
import type { MenuItem } from '../../services/menuItemService'
import type { Language } from '../../../vue-language/services/languageService'

const props = defineProps<{
  items: MenuItem[]
  languages: Language[]
  level?: number
}>()

const emit = defineEmits<{
  (e: 'update:items', items: MenuItem[]): void
  (e: 'edit', item: MenuItem): void
  (e: 'delete', id: number): void
  (e: 'move', id: number, parentId: number | null, sort: number): void
}>()

const expandedItems = ref<number[]>([])

const toggleExpand = (id: number) => {
  if (expandedItems.value.includes(id)) {
    expandedItems.value = expandedItems.value.filter(itemId => itemId !== id)
  } else {
    expandedItems.value.push(id)
  }
}

const isExpanded = (id: number) => expandedItems.value.includes(id)

const dragStart = (event: DragEvent, item: MenuItem) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify({ id: item.id }))
    event.dataTransfer.effectAllowed = 'move'
  }
}

const onDrop = (event: DragEvent, targetParentId: number | null, targetIndex: number) => {
  event.preventDefault()
  const data = event.dataTransfer?.getData('application/json')
  if (data) {
    const { id } = JSON.parse(data)
    emit('move', id, targetParentId, targetIndex)
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const getLabel = (item: MenuItem) => {
  // Próbáljuk meg a magyar, majd az angol, végül az első elérhető nyelvet
  const labels = item.label || {}
  return labels['hu'] || labels['en'] || Object.values(labels)[0] || 'Névtelen'
}

const currentLevel = computed(() => props.level || 0)
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="select-none"
    >
      <!-- Drop zone before item -->
      <div
        class="h-1 -my-0.5 transition-all duration-200"
        @dragover="onDragOver"
        @drop="onDrop($event, item.parent_id, index)"
        @dragenter="$event.currentTarget.classList.add('bg-primary', 'h-4')"
        @dragleave="$event.currentTarget.classList.remove('bg-primary', 'h-4')"
      ></div>

      <div
        class="flex items-center gap-3 p-3 border rounded-lg bg-white hover:bg-slate-50 transition-colors group"
        draggable="true"
        @dragstart="dragStart($event, item)"
      >
        <div class="cursor-move text-slate-400">
          <Icon name="GripVertical" class="w-4 h-4" />
        </div>

        <button
          v-if="item.children && item.children.length > 0"
          @click="toggleExpand(item.id)"
          class="p-1 hover:bg-slate-200 rounded transition-colors"
        >
          <Icon
            :name="isExpanded(item.id) ? 'ChevronDown' : 'ChevronRight'"
            class="w-4 h-4 text-slate-500"
          />
        </button>
        <div v-else class="w-6"></div>

        <div class="flex-1 flex items-center gap-2">
          <Icon v-if="item.icon" :name="item.icon" class="w-4 h-4 text-slate-400" />
          <span class="font-medium text-slate-700">{{ getLabel(item) }}</span>
          <span v-if="item.is_external" class="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-bold uppercase tracking-wider">Külső</span>
        </div>

        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            variant="ghost"
            size="sm"
            @click="emit('edit', item)"
          >
            <Icon name="Edit2" class="w-4 h-4 text-slate-500" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            @click="emit('delete', item.id)"
          >
            <Icon name="Trash2" class="w-4 h-4 text-red-500" />
          </IconButton>
        </div>
      </div>

      <!-- Nested children -->
      <div
        v-if="isExpanded(item.id) && item.children && item.children.length > 0"
        class="ml-8 mt-2 pl-4 border-l-2 border-slate-100"
      >
        <MenuItemTree
          :items="item.children"
          :languages="languages"
          :level="currentLevel + 1"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
          @move="emit('move', ...$arguments)"
        />
      </div>

      <!-- Drop zone inside (to make it a child) -->
      <div
        v-if="isExpanded(item.id)"
        class="h-4 ml-8 mt-1 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-[10px] text-slate-400 uppercase font-bold"
        @dragover="onDragOver"
        @drop="onDrop($event, item.id, 0)"
      >
        Dobd ide gyermeknek
      </div>

      <!-- Final drop zone for this level -->
      <div
        v-if="index === items.length - 1"
        class="h-1 -my-0.5 transition-all duration-200"
        @dragover="onDragOver"
        @drop="onDrop($event, item.parent_id, index + 1)"
        @dragenter="$event.currentTarget.classList.add('bg-primary', 'h-4')"
        @dragleave="$event.currentTarget.classList.remove('bg-primary', 'h-4')"
      ></div>
    </div>

    <div
      v-if="items.length === 0"
      class="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-400"
      @dragover="onDragOver"
      @drop="onDrop($event, null, 0)"
    >
      Nincsenek menüpontok. Dobd ide az elsőt vagy adj hozzá egyet.
    </div>
  </div>
</template>
