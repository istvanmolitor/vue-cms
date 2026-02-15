<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const content = ref(props.modelValue || '')

watch(() => props.modelValue, (newVal) => {
  content.value = newVal || ''
})

watch(content, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">Tartalom</label>
    <textarea
      v-model="text"
      rows="5"
      class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="Szöveg tartalom..."
    ></textarea>
  </div>
</template>

