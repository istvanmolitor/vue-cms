<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Select from '@admin/components/ui/Select.vue'
import Label from '@admin/components/ui/Label.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { layoutService } from '../services/layoutService'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  errors?: string | string[] | null
  label?: string
  required?: boolean
  clearable?: boolean
}>(), {
  label: 'Layout',
  required: false,
  clearable: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const layouts = ref<Array<{ value: string; label: string }>>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data } = await layoutService.getAll()
    layouts.value = Object.entries(data.data).map(([value, layout]) => ({
      value,
      label: layout.name,
    }))
    if (!props.modelValue && layouts.value.length > 0) {
      emit('update:modelValue', layouts.value[0].value)
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="space-y-2">
    <Label>{{ label }} <span v-if="required" class="text-destructive">*</span></Label>
    <Select
      v-if="!isLoading"
      :model-value="modelValue"
      :options="layouts"
      placeholder="Válassz layoutot..."
      :clearable="clearable"
      @update:model-value="emit('update:modelValue', $event as string | null)"
    />
    <div v-else class="text-sm text-[--color-muted-foreground]">
      Layoutok betöltése...
    </div>
    <FieldError :errors="errors" />
  </div>
</template>
