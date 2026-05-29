<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import LoadingSpinner from '@admin/components/ui/LoadingSpinner.vue'
import Icon from '@admin/components/ui/Icon.vue'
import { postService, type Post } from '../services/postService'

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
const posts = ref<Post[]>([])
const isLoading = ref(false)
const selectedPost = ref<Post | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const triggerLabel = computed(() => {
  return selectedPost.value?.title ?? props.placeholder ?? 'Válassz posztot...'
})

const hasSelection = computed(() => selectedPost.value !== null)

const fetchPosts = async (q: string) => {
  try {
    isLoading.value = true
    const response = await postService.getAll({ search: q, per_page: 20 } as any)
    posts.value = response.data.data
  } catch {
    posts.value = []
  } finally {
    isLoading.value = false
  }
}

const onSearchInput = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    fetchPosts(search.value)
  }, 300)
}

const open = () => {
  isOpen.value = true
  search.value = ''
  fetchPosts('')
}

const select = (post: Post) => {
  selectedPost.value = post
  emit('update:modelValue', post.id ?? null)
  isOpen.value = false
}

const clear = (event: Event) => {
  event.stopPropagation()
  selectedPost.value = null
  emit('update:modelValue', null)
}

const loadInitialPost = async (id: number) => {
  try {
    const response = await postService.getById(id)
    selectedPost.value = response.data.data
  } catch {
    selectedPost.value = null
  }
}

const truncateLead = (lead?: string) => {
  if (!lead) {
    return ''
  }
  return lead.length > 100 ? lead.substring(0, 100) + '…' : lead
}

watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal === null) {
      selectedPost.value = null
      return
    }
    if (selectedPost.value?.id !== newVal) {
      await loadInitialPost(newVal)
    }
  },
)

onMounted(async () => {
  if (props.modelValue !== null && props.modelValue !== undefined) {
    await loadInitialPost(props.modelValue)
  }
})
</script>

<template>
  <div class="relative">
    <!-- Trigger -->
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

    <!-- Dropdown -->
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
          @input="onSearchInput"
        />
      </div>

      <div class="max-h-72 overflow-auto p-1">
        <div v-if="isLoading" class="py-3 px-3 text-sm text-muted-foreground text-center"><LoadingSpinner label="Betöltés..." /></div>
        <div v-else-if="posts.length === 0" class="py-3 px-3 text-sm text-muted-foreground text-center">
          Nincs találat.
        </div>
        <div
          v-for="post in posts"
          v-else
          :key="post.id"
          role="button"
          tabindex="0"
          class="flex w-full items-start gap-3 rounded-sm px-2 py-2 text-left cursor-pointer hover:bg-accent hover:text-accent-foreground"
          :class="{ 'bg-accent/50': modelValue === post.id }"
          @click="select(post)"
          @keydown.enter.space.prevent="select(post)"
        >
          <div class="shrink-0 w-12 h-12 rounded overflow-hidden bg-muted">
            <img
              v-if="post.main_image_url"
              :src="post.main_image_url"
              :alt="post.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
              <Icon name="image" class="h-5 w-5" />
            </div>
          </div>
           <div class="flex-1 min-w-0">
             <p class="text-sm font-medium truncate">{{ post.title }}</p>
             <p v-if="post.lead" class="text-xs text-muted-foreground line-clamp-2 mt-0.5">{{ truncateLead(post.lead) }}</p>
           </div>
           <Icon v-if="modelValue === post.id" name="check" class="h-4 w-4 shrink-0 mt-1 text-primary" />
        </div>
      </div>
    </div>

    <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false" />
  </div>
</template>





