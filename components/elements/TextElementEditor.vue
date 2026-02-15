<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const text = ref(props.modelValue?.text || '')
const align = ref(props.modelValue?.align || 'left')

// Initialize if empty
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
    emit('update:modelValue', { text: '', align: 'left' })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    text.value = newVal.text || ''
    align.value = newVal.align || 'left'
  }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', {
    text: text.value,
    align: align.value
  })
}

watch([text, align], updateValue)
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium mb-1 block">Tartalom</label>
      <textarea
        v-model="text"
        rows="5"
        class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Szöveg tartalom..."
      ></textarea>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Igazítás</label>
      <select
        v-model="align"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="left">Balra</option>
        <option value="center">Középre</option>
        <option value="right">Jobbra</option>
        <option value="justify">Sorkizárt</option>
      </select>
    </div>

    <!-- Preview -->
    <div v-if="text" class="mt-4 p-4 border rounded-md bg-muted/30">
      <p class="text-xs text-muted-foreground mb-2">Előnézet:</p>
      <p :class="`text-${align}`" class="text-preview">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.text-preview {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>

