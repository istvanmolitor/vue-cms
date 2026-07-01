<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import Modal from '@admin/components/ui/Modal.vue'
import { contentElementTypeRegistry } from '../registry'
import type { ContentElement } from '../services/contentRegionService'
import InsertZone from './InsertZone.vue'
import ContentElementItem from './ContentElementItem.vue'

interface Props {
  modelValue: ContentElement[]
  errors?: Record<string, string | string[]>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const elements = ref<ContentElement[]>([])
const availableTypes = computed(() => contentElementTypeRegistry.getTypes())

const showTypeModal = ref(false)
const editingElementIndex = ref<number | null>(null)
const insertAtIndex = ref<number | null>(null)

watch(() => props.modelValue, (newVal) => {
  elements.value = JSON.parse(JSON.stringify(newVal || []))
}, { immediate: true, deep: true })

const updateModel = () => {
  emit('update:modelValue', elements.value)
}

const openAddElementModal = (insertAt?: number) => {
  insertAtIndex.value = insertAt ?? null
  showTypeModal.value = true
}

const addElementWithType = (type: string) => {
  const newElement = { type, settings: {}, sort: 0, content_elements: [] }

  if (insertAtIndex.value !== null) {
    elements.value.splice(insertAtIndex.value, 0, newElement)
    editingElementIndex.value = insertAtIndex.value
  } else {
    elements.value.push(newElement)
    editingElementIndex.value = elements.value.length - 1
  }

  elements.value.forEach((el, i) => el.sort = i)
  updateModel()
  showTypeModal.value = false
  insertAtIndex.value = null
}

const closeTypeModal = () => {
  showTypeModal.value = false
}

const toggleEditMode = (index: number) => {
  if (editingElementIndex.value === index) {
    editingElementIndex.value = null
  } else {
    editingElementIndex.value = index
  }
}

const removeElement = (index: number) => {
  elements.value.splice(index, 1)
  updateModel()
}

const moveUp = (index: number) => {
  if (index > 0 && index < elements.value.length) {
    [elements.value[index - 1], elements.value[index]] = [elements.value[index]!, elements.value[index - 1]!]

    // Update sort values
    elements.value.forEach((el, i) => el.sort = i)
    updateModel()
  }
}

const moveDown = (index: number) => {
  if (index >= 0 && index < elements.value.length - 1) {
    [elements.value[index], elements.value[index + 1]] = [elements.value[index + 1]!, elements.value[index]!]

    // Update sort values
    elements.value.forEach((el, i) => el.sort = i)
    updateModel()
  }
}

const hasSettings = (element: ContentElement) => {
  return element.settings && Object.keys(element.settings).length > 0
}

const shouldShowEditor = (index: number) => {
  return editingElementIndex.value === index || !hasSettings(elements.value[index]!)
}

const getElementErrors = (index: number): Record<string, string | string[]> => {
  if (!props.errors) return {}
  const prefix = `content.content_elements.${index}.settings.`
  const result: Record<string, string | string[]> = {}
  for (const [key, value] of Object.entries(props.errors)) {
    if (key.startsWith(prefix)) {
      result[key.slice(prefix.length)] = value
    }
  }
  return result
}
</script>

<template>
  <div class="space-y-0">
    <div v-if="elements.length === 0" class="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
      Nincsenek tartalom elemek. Kattints az "Elem hozzáadása" gombra.
    </div>

    <template v-else>
      <!-- Insert zone before first element -->
      <InsertZone @click="openAddElementModal(0)" />

      <div class="border rounded-lg divide-y bg-background shadow-sm">
        <template v-for="(element, index) in elements" :key="index">
          <ContentElementItem
            :element="element"
            :is-first="index === 0"
            :is-last="index === elements.length - 1"
            :show-editor="shouldShowEditor(index)"
            :errors="getElementErrors(index)"
            @move-up="moveUp(index)"
            @move-down="moveDown(index)"
            @remove="removeElement(index)"
            @toggle-edit="toggleEditMode(index)"
            @update:settings="element.settings = $event; updateModel()"
            @update:content-elements="element.content_elements = $event; updateModel()"
          />

          <!-- Insert zone after each element -->
          <InsertZone v-if="index < elements.length - 1" inner @click="openAddElementModal(index + 1)" />
        </template>
      </div>
    </template>

    <!-- Type select modal -->
    <Modal :show="showTypeModal" size="2xl" title="Válaszd ki az elem típusát" @close="closeTypeModal">
      <div class="grid grid-cols-4 gap-3">
        <button
          v-for="type in availableTypes"
          :key="type.type"
          type="button"
          class="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary transition-colors p-4 text-center cursor-pointer"
          @click="addElementWithType(type.type)"
        >
          <Icon :name="type.icon" class="w-7 h-7 text-muted-foreground" />
          <span class="text-xs font-medium text-foreground leading-tight">{{ type.label }}</span>
        </button>
      </div>
      <template #footer>
        <Button type="button" variant="ghost" @click="closeTypeModal">Mégse</Button>
      </template>
    </Modal>

    <div class="flex items-center justify-end mt-4">
      <Button type="button" @click="openAddElementModal()">
        <Icon name="plus" class="w-4 h-4 mr-2" />
        Elem hozzáadása
      </Button>
    </div>
  </div>
</template>
