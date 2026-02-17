<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const url = ref(props.modelValue?.url || '')
const width = ref(props.modelValue?.width || '100%')
const height = ref(props.modelValue?.height || '450px')
const title = ref(props.modelValue?.title || '')
const allowFullscreen = ref(props.modelValue?.allowFullscreen ?? true)

// Initialize if empty
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0 || !props.modelValue.url) {
    emit('update:modelValue', {
      url: url.value,
      width: width.value,
      height: height.value,
      title: title.value,
      allowFullscreen: allowFullscreen.value
    })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    url.value = newVal.url || ''
    width.value = newVal.width || '100%'
    height.value = newVal.height || '450px'
    title.value = newVal.title || ''
    allowFullscreen.value = newVal.allowFullscreen ?? true
  }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', {
    url: url.value,
    width: width.value,
    height: height.value,
    title: title.value,
    allowFullscreen: allowFullscreen.value
  })
}

watch([url, width, height, title, allowFullscreen], updateValue)
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium mb-1 block">URL</label>
      <input
        v-model="url"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="https://example.com"
      />
      <div v-if="url" class="mt-4">
        <div class="relative overflow-hidden rounded-lg shadow-sm border border-border" :style="{ width: '100%', maxWidth: '600px', height: '300px' }">
          <iframe
            :src="url"
            :title="title || 'Iframe előnézet'"
            :allowfullscreen="allowFullscreen"
            class="w-full h-full border-0"
          ></iframe>
        </div>
      </div>
    </div>
    <div>
      <label class="text-sm font-medium mb-1 block">Cím (title attribútum)</label>
      <input
        v-model="title"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Iframe leírása"
      />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="text-sm font-medium mb-1 block">Szélesség</label>
        <input
          v-model="width"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="100% vagy 640px"
        />
      </div>
      <div>
        <label class="text-sm font-medium mb-1 block">Magasság</label>
        <input
          v-model="height"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="450px"
        />
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <input
        v-model="allowFullscreen"
        type="checkbox"
        id="allowFullscreen"
        class="w-4 h-4 rounded border-input"
      />
      <label for="allowFullscreen" class="text-sm font-medium cursor-pointer">
        Teljes képernyő engedélyezése
      </label>
    </div>
  </div>
</template>

