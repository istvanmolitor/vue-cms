<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const url = ref(props.modelValue?.url || '')
const width = ref(props.modelValue?.width || '100%')
const height = ref(props.modelValue?.height || '450px')

const embedUrl = computed(() => {
  if (!url.value) return ''

  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.value.match(regExp)

  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : ''
})

// Initialize if empty
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0 || !props.modelValue.url) {
    emit('update:modelValue', {
      url: url.value,
      width: width.value,
      height: height.value
    })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    url.value = newVal.url || ''
    width.value = newVal.width || '100%'
    height.value = newVal.height || '450px'
  }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', {
    url: url.value,
    width: width.value,
    height: height.value
  })
}

watch([url, width, height], updateValue)
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium mb-1 block">YouTube URL</label>
      <input
        v-model="url"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="https://www.youtube.com/watch?v=..."
      />
      <div v-if="embedUrl" class="mt-4">
        <div class="relative overflow-hidden rounded-lg shadow-sm border border-border aspect-video" style="width: 300px;">
          <iframe
            :src="embedUrl"
            frameborder="0"
            allowfullscreen
            class="w-full h-full"
          ></iframe>
        </div>
      </div>
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
  </div>
</template>
