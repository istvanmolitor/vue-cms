<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const quote = ref(props.modelValue?.quote || '')
const author = ref(props.modelValue?.author || '')

// Initialize if empty
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
    emit('update:modelValue', { quote: '', author: '' })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    quote.value = newVal.quote || ''
    author.value = newVal.author || ''
  }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', {
    quote: quote.value,
    author: author.value
  })
}

watch([quote, author], updateValue)
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium mb-1 block">Idézet</label>
      <textarea
        v-model="text"
        rows="4"
        class="flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Az idézet szövege..."
      ></textarea>
    </div>
    <div>
      <label class="text-sm font-medium mb-1 block">Szerző</label>
      <input
        v-model="author"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Szerző neve"
      />
    </div>
  </div>
</template>

