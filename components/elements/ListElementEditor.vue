<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Button from '@admin/components/ui/button/Button.vue'
import { Plus, Trash } from 'lucide-vue-next'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const items = ref<string[]>(props.modelValue?.items || [])
const listType = ref(props.modelValue?.type || 'ul')

// Initialize if empty
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0 || !props.modelValue.items) {
    emit('update:modelValue', { items: [''], type: 'ul' })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    items.value = newVal.items || ['']
    listType.value = newVal.type || 'ul'
  }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', {
    items: items.value.filter(item => item.trim() !== ''),
    type: listType.value
  })
}

watch([items, listType], updateValue, { deep: true })

const addItem = () => {
  items.value.push('')
}

const removeItem = (index: number) => {
  items.value.splice(index, 1)
  if (items.value.length === 0) {
    items.value.push('')
  }
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium">Lista elemek</label>
        <Button type="button" variant="outline" size="sm" @click="addItem">
          <Plus class="w-3 h-3 mr-1" />
          Elem hozzáadása
        </Button>
      </div>
      <div class="space-y-2">
        <div v-for="(_item, index) in items" :key="index" class="flex gap-2">
          <input
            v-model="items[index]"
            type="text"
            class="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :placeholder="`${index + 1}. elem`"
          />
          <Button type="button" variant="ghost" size="icon" @click="removeItem(index)" :disabled="items.length === 1">
            <Trash class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>


