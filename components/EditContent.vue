<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Button from '@admin/components/ui/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import { contentElementTypeRegistry } from '../registry'
import type { ContentElement } from '../services/contentRegionService'

interface Props {
  modelValue: ContentElement[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const elements = ref<ContentElement[]>([])
const availableTypes = computed(() => contentElementTypeRegistry.getTypes())

const showTypeModal = ref(false)
const showSettingsModal = ref(false)
const editingElementIndex = ref<number | null>(null)

watch(() => props.modelValue, (newVal) => {
  elements.value = JSON.parse(JSON.stringify(newVal || []))
}, { immediate: true, deep: true })

const updateModel = () => {
  emit('update:modelValue', elements.value)
}

const openAddElementModal = () => {
  showTypeModal.value = true
}

const addElementWithType = (type: string) => {
  const nextSort = elements.value.length > 0
    ? Math.max(...elements.value.map(e => e.sort)) + 1
    : 0

  elements.value.push({
    type,
    settings: {},
    sort: nextSort,
    is_visible: true
  })
  updateModel()
  showTypeModal.value = false
}

const closeTypeModal = () => {
  showTypeModal.value = false
}

const openSettingsModal = (index: number) => {
  editingElementIndex.value = index
  showSettingsModal.value = true
}

const closeSettingsModal = () => {
  showSettingsModal.value = false
  editingElementIndex.value = null
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

const getHeadingClass = (level: number) => {
  const baseClasses = 'font-bold text-foreground'
  const sizeClasses = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base'
  }
  return `${baseClasses} ${sizeClasses[level as keyof typeof sizeClasses] || sizeClasses[1]}`
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium">Tartalom elemek</h3>
      <Button type="button" variant="outline" size="sm" @click="openAddElementModal">
        <Icon name="plus" class="w-4 h-4 mr-2" />
        Elem hozzáadása
      </Button>
    </div>

    <div v-if="elements.length === 0" class="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
      Nincsenek tartalom elemek. Kattints az "Elem hozzáadása" gombra.
    </div>

    <div v-else class="border rounded-lg divide-y bg-background shadow-sm">
      <div v-for="(element, index) in elements" :key="index" class="p-4 group relative hover:bg-muted/10 transition-colors">
        <div class="flex items-start gap-3">
          <!-- Move controls - subtle & vertical -->
          <div class="flex flex-col items-center self-stretch pt-1">
            <div class="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors mb-2">
              <Icon name="grip-vertical" class="w-4 h-4" />
            </div>
            <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button type="button" variant="ghost" size="icon" class="h-6 w-6" @click="moveUp(index)" :disabled="index === 0">
                <Icon name="move-up" class="w-3 h-3" />
              </Button>
              <Button type="button" variant="ghost" size="icon" class="h-6 w-6" @click="moveDown(index)" :disabled="index === elements.length - 1">
                <Icon name="move-down" class="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="flex items-center text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-wider">
                  <Icon :name="contentElementTypeRegistry.getIcon(element.type) || 'type'" class="w-3 h-3 mr-1.5" />
                  <span>{{ contentElementTypeRegistry.getType(element.type)?.label || element.type }}</span>
                </div>

                <label class="flex items-center gap-2 cursor-pointer group/label">
                   <input
                    type="checkbox"
                    v-model="element.is_visible"
                    @change="updateModel"
                    class="h-3.5 w-3.5 rounded border-muted-foreground/30 text-primary focus:ring-primary/20"
                  />
                  <span class="text-[11px] text-muted-foreground/70 group-hover/label:text-muted-foreground transition-colors uppercase tracking-widest font-bold">
                    Látható
                  </span>
                </label>
              </div>

              <div class="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" class="text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-all" @click="openSettingsModal(index)">
                  <Icon name="settings" class="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all" @click="removeElement(index)">
                  <Icon name="trash" class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div class="pl-1 text-sm text-muted-foreground">
              <!-- Special preview for heading elements -->
              <div v-if="element.type === 'heading' && element.settings.text" class="mt-2">
                <component
                  :is="`h${element.settings.level || 1}`"
                  :class="getHeadingClass(element.settings.level || 1)"
                >
                  {{ element.settings.text }}
                </component>
              </div>
              <!-- Special preview for text elements -->
              <div v-else-if="element.type === 'text' && element.settings.text" class="mt-2">
                <p :class="`text-${element.settings.align || 'left'} text-sm leading-relaxed`">
                  {{ element.settings.text }}
                </p>
              </div>
              <!-- Special preview for image elements -->
              <div v-else-if="element.type === 'image' && element.settings.url" class="mt-2">
                <img
                  :src="element.settings.url"
                  :alt="element.settings.alt || 'Kép'"
                  :style="{
                    width: element.settings.width || 'auto',
                    height: element.settings.height || 'auto',
                    maxWidth: '300px'
                  }"
                  class="rounded-lg shadow-sm border border-border"
                />
                <div v-if="element.settings.alt" class="text-xs text-muted-foreground mt-1">
                  {{ element.settings.alt }}
                </div>
              </div>
              <!-- Default settings display for other elements -->
              <div v-else-if="Object.keys(element.settings).length > 0" class="space-y-1">
                <div v-for="(value, key) in element.settings" :key="key" class="text-xs">
                  <span class="font-medium">{{ key }}:</span>
                  <span class="ml-1">{{ typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : String(value).substring(0, 50) }}</span>
                  <span v-if="String(value).length > 50">...</span>
                </div>
              </div>
              <div v-else class="text-xs italic">
                Nincsenek beállítások - kattints a <Icon name="settings" class="w-3 h-3 inline" /> ikonra a szerkesztéshez
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Type select modal -->
    <Teleport to="body">
      <div v-if="showTypeModal" class="fixed inset-0 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="closeTypeModal"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-lg p-6">
          <h4 class="text-base font-medium mb-4">Válaszd ki az elem típusát</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Button
              v-for="type in availableTypes"
              :key="type.type"
              type="button"
              variant="outline"
              class="justify-start"
              @click="addElementWithType(type.type)"
            >
              <Icon :name="type.icon" class="w-4 h-4 mr-2" />
              {{ type.label }}
            </Button>
          </div>
          <div class="mt-6 text-right">
            <Button type="button" variant="ghost" @click="closeTypeModal">Mégse</Button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Settings modal -->
    <Teleport to="body">
      <div v-if="showSettingsModal && editingElementIndex !== null" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black/50" @click="closeSettingsModal"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-base font-medium flex items-center gap-2">
              <Icon :name="contentElementTypeRegistry.getIcon(elements[editingElementIndex]!.type) || 'type'" class="w-5 h-5" />
              {{ contentElementTypeRegistry.getType(elements[editingElementIndex]!.type)?.label || elements[editingElementIndex]!.type }} beállítások
            </h4>
          </div>
          <div class="mb-6">
            <component
              :is="contentElementTypeRegistry.getComponent(elements[editingElementIndex]!.type)"
              v-model="elements[editingElementIndex]!.settings"
              @update:modelValue="updateModel"
            />
          </div>
          <div class="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" @click="closeSettingsModal">Bezárás</Button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
