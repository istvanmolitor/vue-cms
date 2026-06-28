<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import IconButton from '@admin/components/ui/button/IconButton.vue'
import { contentElementTypeRegistry } from '../registry'
import type { ContentElement } from '../services/contentRegionService'
import DefaultElementPreview from './elements/DefaultElementPreview.vue'

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

const getPreviewComponent = (type: string) => {
  return contentElementTypeRegistry.getPreviewComponent(type) || DefaultElementPreview
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
      <div class="group/insert flex items-center gap-2 py-1">
        <div class="flex-1 h-px bg-border group-hover/insert:bg-primary/40 transition-colors" />
        <button
          type="button"
          class="opacity-0 group-hover/insert:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted-foreground hover:text-primary border border-border hover:border-primary rounded px-2 py-0.5 bg-background"
          @click="openAddElementModal(0)"
        >
          <Icon name="plus" class="w-3 h-3" />
          Elem ide
        </button>
        <div class="flex-1 h-px bg-border group-hover/insert:bg-primary/40 transition-colors" />
      </div>

      <div class="border rounded-lg divide-y bg-background shadow-sm">
        <template v-for="(element, index) in elements" :key="index">
          <div class="p-4 group relative hover:bg-muted/10 transition-colors">
            <div class="flex items-start gap-3">
              <!-- Move controls - subtle & vertical -->
              <div class="flex flex-col items-center self-stretch pt-1">
                <div class="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors mb-2">
                  <Icon name="grip-vertical" class="w-4 h-4" />
                </div>
                <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton icon="move-up" @click="moveUp(index)" :disabled="index === 0" />
                  <IconButton icon="move-down" @click="moveDown(index)" :disabled="index === elements.length - 1" />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="flex items-center min-w-0 text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-wider">
                      <Icon :name="contentElementTypeRegistry.getIcon(element.type) || 'type'" class="w-3 h-3 mr-1.5 shrink-0" />
                      <span class="truncate">{{ contentElementTypeRegistry.getType(element.type)?.label || element.type }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-1">
                    <IconButton
                      v-if="hasSettings(element)"
                      :icon="shouldShowEditor(index) ? 'show' : 'edit'"
                      @click="toggleEditMode(index)"
                    />
                    <IconButton
                      icon="trash"
                      @click="removeElement(index)"
                    />
                  </div>
                </div>

                <div class="pl-1 text-sm">
                  <!-- Show editor when editing or when no settings exist -->
                  <div v-if="shouldShowEditor(index)" class="bg-muted/30 rounded-lg p-3">
                    <component
                      :is="contentElementTypeRegistry.getComponent(element.type)"
                      v-model:settings="element.settings"
                      v-model:content-elements="element.content_elements"
                      :errors="getElementErrors(index)"
                      @update:settings="updateModel"
                      @update:content-elements="updateModel"
                    />
                  </div>
                  <!-- Show preview otherwise -->
                  <div v-else class="text-muted-foreground">
                    <component
                      :is="getPreviewComponent(element.type)"
                      :settings="element.settings"
                      :content-elements="element.content_elements"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Insert zone after each element -->
          <div v-if="index < elements.length - 1" class="group/insert flex items-center gap-2 py-1 px-4 border-t">
            <div class="flex-1 h-px bg-transparent group-hover/insert:bg-primary/40 transition-colors" />
            <button
              type="button"
              class="opacity-0 group-hover/insert:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted-foreground hover:text-primary border border-border hover:border-primary rounded px-2 py-0.5 bg-background"
              @click="openAddElementModal(index + 1)"
            >
              <Icon name="plus" class="w-3 h-3" />
              Elem ide
            </button>
            <div class="flex-1 h-px bg-transparent group-hover/insert:bg-primary/40 transition-colors" />
          </div>
        </template>
      </div>
    </template>

    <!-- Type select modal -->
    <Teleport to="body">
      <div v-if="showTypeModal" class="fixed inset-0 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="closeTypeModal"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-3xl p-8">
          <h4 class="text-base font-medium mb-6">Válaszd ki az elem típusát</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Button
              v-for="type in availableTypes"
              :key="type.type"
              type="button"
              variant="outline"
              class="justify-start h-auto py-4 px-4 text-sm"
              @click="addElementWithType(type.type)"
            >
              <Icon :name="type.icon" class="w-5 h-5 mr-3 shrink-0" />
              {{ type.label }}
            </Button>
          </div>
          <div class="mt-6 text-right">
            <Button type="button" variant="ghost" @click="closeTypeModal">Mégse</Button>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="flex items-center justify-end mt-4">
      <Button type="button" @click="openAddElementModal()">
        <Icon name="plus" class="w-4 h-4 mr-2" />
        Elem hozzáadása
      </Button>
    </div>
  </div>
</template>
