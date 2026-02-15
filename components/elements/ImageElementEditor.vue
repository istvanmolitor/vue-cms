<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { MediaFilePicker } from '@/packages/vue-media'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const src = ref(props.modelValue?.src || '')
const alt = ref(props.modelValue?.alt || '')
const width = ref(props.modelValue?.width || '')
const height = ref(props.modelValue?.height || '')

// Initialize if empty
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
    emit('update:modelValue', { src: '', alt: '', width: '', height: '' })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    src.value = newVal.src || ''
    alt.value = newVal.alt || ''
    width.value = newVal.width || ''
    height.value = newVal.height || ''
  }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', {
    src: src.value,
    alt: alt.value,
    width: width.value,
    height: height.value
  })
}

watch([src, alt, width, height], updateValue)
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium mb-1 block">Kép URL</label>
      <MediaFilePicker
        v-model="src"
        :accept-types="['image/*']"
        :show-preview="true"
      />
    </div>
    <div>
      <label class="text-sm font-medium mb-1 block">Alternatív szöveg</label>
      <input
        v-model="alt"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Kép leírása"
      />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="text-sm font-medium mb-1 block">Szélesség</label>
        <input
          v-model="width"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="640px vagy üres"
        />
      </div>
      <div>
        <label class="text-sm font-medium mb-1 block">Magasság</label>
        <input
          v-model="height"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="480px vagy üres"
        />
      </div>
    </div>
  </div>
</template>

