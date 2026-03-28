<script setup lang="ts">
import { computed } from 'vue'
import type { MenuItem } from '../../services/menuItemService'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'

interface Props {
  item: MenuItem
  isExpanded: boolean
  siblings: MenuItem[]
  depth?: number
  expandedItems?: Set<number>
}

interface Emits {
  (e: 'toggle', itemId: number): void
  (e: 'edit', item: MenuItem): void
  (e: 'delete', item: MenuItem): void
  (e: 'createChild', parentId: number): void
  (e: 'moveUp', item: MenuItem, siblings: MenuItem[]): void
  (e: 'moveDown', item: MenuItem, siblings: MenuItem[]): void
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
  expandedItems: () => new Set<number>(),
})

const emit = defineEmits<Emits>()

const hasChildren = computed(() => props.item.children && props.item.children.length > 0)

const indentClass = computed(() => {
  const indent = props.depth * 24
  return `padding-left: ${indent}px;`
})

const canMoveUp = computed(() => {
  const index = props.siblings.findIndex(s => s.id === props.item.id)
  return index > 0
})

const canMoveDown = computed(() => {
  const index = props.siblings.findIndex(s => s.id === props.item.id)
  return index < props.siblings.length - 1
})
</script>

<template>
  <div class="border border-gray-200 rounded-lg">
    <div
      class="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      :style="indentClass"
    >
      <div class="flex items-center space-x-3 flex-1">
        <button
          v-if="hasChildren"
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
          @click="emit('toggle', item.id)"
        >
          <Icon
            :name="isExpanded ? 'chevron-down' : 'chevron-right'"
            class="w-4 h-4"
          />
        </button>
        <div v-else class="w-4" />

        <Icon v-if="item.icon" :name="item.icon" class="w-4 h-4 text-gray-500" />

        <div class="flex-1">
          <div class="font-medium text-gray-900">
            {{ item.label }}
          </div>
          <div v-if="item.url" class="text-sm text-gray-500">
            {{ item.url }}
            <span v-if="item.is_external" class="ml-1 text-xs text-blue-500">(külső)</span>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          :disabled="!canMoveUp"
          @click="emit('moveUp', item, siblings)"
          title="Fel"
        >
          <Icon name="arrow-up" class="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          :disabled="!canMoveDown"
          @click="emit('moveDown', item, siblings)"
          title="Le"
        >
          <Icon name="arrow-down" class="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          @click="emit('createChild', item.id)"
          title="Gyerek elem hozzáadása"
        >
          <Icon name="plus" class="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          @click="emit('edit', item)"
          title="Szerkesztés"
        >
          <Icon name="pencil" class="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          @click="emit('delete', item)"
          title="Törlés"
        >
          <Icon name="trash" class="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>

    <div v-if="isExpanded && hasChildren" class="border-t border-gray-100">
      <MenuItemTreeNode
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :is-expanded="expandedItems.has(child.id)"
        :siblings="item.children!"
        :depth="(depth || 0) + 1"
        :expanded-items="expandedItems"
        @toggle="emit('toggle', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @create-child="emit('createChild', $event)"
        @move-up="(childItem, childSiblings) => emit('moveUp', childItem, childSiblings)"
        @move-down="(childItem, childSiblings) => emit('moveDown', childItem, childSiblings)"
      />
    </div>
  </div>
</template>





