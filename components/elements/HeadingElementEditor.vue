<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const text = ref(props.modelValue?.text || '')
const level = ref(props.modelValue?.level || 1)

// Initialize if empty
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
    emit('update:modelValue', { text: '', level: 1 })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    text.value = newVal.text || ''
    level.value = newVal.level || 1
  }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', {
    text: text.value,
    level: parseInt(level.value.toString())
  })
}

watch([text, level], updateValue)
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-9">
        <label class="text-sm font-medium mb-1 block">Szöveg</label>
        <input
          v-model="text"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Címsor szövege"
        />
      </div>
      <div class="col-span-3">
        <label class="text-sm font-medium mb-1 block">Szint</label>
        <select
          v-model="level"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option v-for="l in 6" :key="l" :value="l">H{{ l }}</option>
        </select>
      </div>
    </div>
  </div>
</template>
