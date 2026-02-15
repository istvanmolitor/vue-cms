<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const code = ref(props.modelValue?.code || '')
const language = ref(props.modelValue?.language || 'javascript')

// Initialize if empty
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
    emit('update:modelValue', { code: '', language: 'javascript' })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    code.value = newVal.code || ''
    language.value = newVal.language || 'javascript'
  }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', {
    code: code.value,
    language: language.value
  })
}

watch([code, language], updateValue)
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium mb-1 block">Nyelv</label>
      <select
        v-model="language"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="php">PHP</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="bash">Bash</option>
        <option value="sql">SQL</option>
        <option value="json">JSON</option>
      </select>
    </div>
    <div>
      <label class="text-sm font-medium mb-1 block">Kód</label>
      <textarea
        v-model="code"
        rows="10"
        class="flex min-h-[240px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="// Írd be a kódot..."
      ></textarea>
    </div>
  </div>
</template>

