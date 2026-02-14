<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Button from '@admin/components/ui/Button.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import { Plus, Trash, MoveUp, MoveDown, GripVertical } from 'lucide-vue-next'
import { contentElementTypeRegistry } from '../registry'

interface ContentElement {
  id?: number
  type: string
  content: any
  sort: number
  is_visible: boolean
}

interface Props {
  modelValue: ContentElement[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const elements = ref<ContentElement[]>([])
const availableTypes = computed(() => contentElementTypeRegistry.getTypes())

const showTypeModal = ref(false)

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
    content: {},
    sort: nextSort,
    is_visible: true
  })
  updateModel()
  showTypeModal.value = false
}

const closeTypeModal = () => {
  showTypeModal.value = false
}

const removeElement = (index: number) => {
  elements.value.splice(index, 1)
  updateModel()
}

const moveUp = (index: number) => {
  if (index > 0) {
    const temp = elements.value[index]
    elements.value[index] = elements.value[index - 1]
    elements.value[index - 1] = temp

    // Update sort values
    elements.value.forEach((el, i) => el.sort = i)
    updateModel()
  }
}

const moveDown = (index: number) => {
  if (index < elements.value.length - 1) {
    const temp = elements.value[index]
    elements.value[index] = elements.value[index + 1]
    elements.value[index + 1] = temp

    // Update sort values
    elements.value.forEach((el, i) => el.sort = i)
    updateModel()
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium">Tartalom elemek</h3>
      <Button type="button" variant="outline" size="sm" @click="openAddElementModal">
        <Plus class="w-4 h-4 mr-2" />
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
              <GripVertical class="w-4 h-4" />
            </div>
            <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button type="button" variant="ghost" size="icon" class="h-6 w-6" @click="moveUp(index)" :disabled="index === 0">
                <MoveUp class="w-3 h-3" />
              </Button>
              <Button type="button" variant="ghost" size="icon" class="h-6 w-6" @click="moveDown(index)" :disabled="index === elements.length - 1">
                <MoveDown class="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="flex items-center text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-wider">
                  <component :is="contentElementTypeRegistry.getIcon(element.type)" class="w-3 h-3 mr-1.5" />
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

              <Button type="button" variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all" @click="removeElement(index)">
                <Trash class="w-4 h-4" />
              </Button>
            </div>

            <div class="pl-1">
              <component
                :is="contentElementTypeRegistry.getComponent(element.type)"
                v-model="element.content"
                @update:modelValue="updateModel"
              />
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
              <component :is="type.icon" class="w-4 h-4 mr-2" />
              {{ type.label }}
            </Button>
          </div>
          <div class="mt-6 text-right">
            <Button type="button" variant="ghost" @click="closeTypeModal">Mégse</Button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
