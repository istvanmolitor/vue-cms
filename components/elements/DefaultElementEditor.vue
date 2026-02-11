<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string | Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const content = ref(typeof props.modelValue === 'object' ? props.modelValue.content || '' : props.modelValue)

watch(() => props.modelValue, (newVal) => {
  content.value = typeof newVal === 'object' ? newVal.content || '' : newVal
})

watch(content, (newVal) => {
  if (typeof props.modelValue === 'object') {
    emit('update:modelValue', { ...props.modelValue, content: newVal })
  } else {
    emit('update:modelValue', newVal)
  }
})
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">Tartalom</label>
    <textarea
      v-model="content"
      rows="3"
      class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    ></textarea>
  </div>
</template>
