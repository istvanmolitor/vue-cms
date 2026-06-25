<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import LoadingSpinner from '@admin/components/ui/LoadingSpinner.vue'
import Icon from '@admin/components/ui/Icon.vue'
import { postTypeService, type PostType } from '../services/postTypeService'

const props = defineProps<{
  modelValue: number | null
  placeholder?: string
  searchPlaceholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const isOpen = ref(false)
const search = ref('')
const postTypes = ref<PostType[]>([])
const isLoading = ref(false)
const selectedPostType = ref<PostType | null>(null)

const triggerLabel = computed(() => {
  return selectedPostType.value?.name ?? props.placeholder ?? 'Válassz poszt típust...'
})

const hasSelection = computed(() => selectedPostType.value !== null)

const filteredPostTypes = computed(() => {
  if (!search.value) return postTypes.value
  const q = search.value.toLowerCase()
  return postTypes.value.filter(
    (pt) => pt.name.toLowerCase().includes(q) || pt.slug.toLowerCase().includes(q),
  )
})

const fetchPostTypes = async () => {
  try {
    isLoading.value = true
    const response = await postTypeService.getAll()
    postTypes.value = response.data.data
  } catch {
    postTypes.value = []
  } finally {
    isLoading.value = false
  }
}

const open = () => {
  isOpen.value = true
  search.value = ''
  if (postTypes.value.length === 0) {
    fetchPostTypes()
  }
}

const select = (postType: PostType) => {
  selectedPostType.value = postType
  emit('update:modelValue', postType.id ?? null)
  isOpen.value = false
}

const clear = (event: Event) => {
  event.stopPropagation()
  selectedPostType.value = null
  emit('update:modelValue', null)
}

const loadInitial = async (id: number) => {
  try {
    const response = await postTypeService.getById(id)
    selectedPostType.value = response.data.data
  } catch {
    selectedPostType.value = null
  }
}

watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal === null || newVal === undefined) {
      selectedPostType.value = null
      return
    }
    if (selectedPostType.value?.id !== newVal) {
      await loadInitial(newVal)
    }
  },
)

onMounted(async () => {
  if (props.modelValue !== null && props.modelValue !== undefined) {
    await loadInitial(props.modelValue)
  }
})
</script>

<template>
  <div class="relative">
    <div
      role="button"
      tabindex="0"
      class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      @click="open"
      @keydown.enter.space.prevent="open"
    >
      <span :class="hasSelection ? '' : 'text-muted-foreground'" class="truncate">
        {{ triggerLabel }}
      </span>
      <span class="flex items-center gap-1 ml-2 shrink-0">
        <span
          v-if="hasSelection"
          role="button"
          tabindex="0"
          class="text-muted-foreground hover:text-foreground"
          @click.stop="clear"
          @keydown.enter.space.prevent.stop="clear"
        >
          <Icon name="close" class="h-3.5 w-3.5" />
        </span>
        <Icon name="chevron-down" class="h-4 w-4 opacity-50" />
      </span>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md"
    >
      <div class="p-2">
        <input
          v-model="search"
          type="text"
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          :placeholder="searchPlaceholder ?? 'Keresés...'"
        />
      </div>

      <div class="max-h-60 overflow-auto p-1">
        <div v-if="isLoading" class="py-3 px-3 text-sm text-muted-foreground text-center">
          <LoadingSpinner label="Betöltés..." />
        </div>
        <div
          v-else-if="filteredPostTypes.length === 0"
          class="py-3 px-3 text-sm text-muted-foreground text-center"
        >
          Nincs találat.
        </div>
        <div
          v-for="postType in filteredPostTypes"
          v-else
          :key="postType.id"
          role="button"
          tabindex="0"
          class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
          :class="{ 'bg-accent/50': modelValue === postType.id }"
          @click="select(postType)"
          @keydown.enter.space.prevent="select(postType)"
        >
          <div class="min-w-0">
            <p class="font-medium truncate">{{ postType.name }}</p>
            <p class="text-xs text-muted-foreground truncate">{{ postType.slug }}</p>
          </div>
          <Icon v-if="modelValue === postType.id" name="check" class="h-4 w-4 shrink-0 ml-2 text-primary" />
        </div>
      </div>
    </div>

    <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false" />
  </div>
</template>
