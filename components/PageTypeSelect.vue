<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Select from '@admin/components/ui/Select.vue'
import Label from '@admin/components/ui/Label.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { pageTypeService, type PageType } from '../services/pageTypeService'

const props = withDefaults(defineProps<{
  modelValue?: number | null
  errors?: string | string[] | null
  label?: string
  clearable?: boolean
}>(), {
  label: 'Oldal típus',
  clearable: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const pageTypes = ref<PageType[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data } = await pageTypeService.getAll()
    pageTypes.value = data.data
    if (props.modelValue == null && pageTypes.value.length > 0) {
      emit('update:modelValue', pageTypes.value[0].id)
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="space-y-2">
    <Label class="text-sm font-medium">{{ label }}</Label>
    <Select
      v-if="!isLoading"
      :model-value="modelValue"
      :options="pageTypes"
      label-field="name"
      value-field="id"
      placeholder="Válassz típust..."
      :clearable="clearable"
      @update:model-value="emit('update:modelValue', $event as number | null)"
    />
    <div v-else class="text-sm text-[--color-muted-foreground]">
      Oldal típusok betöltése...
    </div>
    <FieldError :errors="errors" />
  </div>
</template>
