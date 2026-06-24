<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Select from '@admin/components/ui/Select.vue'
import Label from '@admin/components/ui/Label.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { postTypeService, type PostType } from '../services/postTypeService'

const props = withDefaults(defineProps<{
  modelValue?: number | null
  errors?: string | string[] | null
  label?: string
  clearable?: boolean
}>(), {
  label: 'Poszt típus',
  clearable: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const postTypes = ref<PostType[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data } = await postTypeService.getAll()
    postTypes.value = data.data
    if (props.modelValue == null && postTypes.value.length > 0) {
      emit('update:modelValue', postTypes.value[0].id)
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="space-y-2">
    <Label>{{ label }}</Label>
    <Select
      v-if="!isLoading"
      :model-value="modelValue"
      :options="postTypes"
      label-field="name"
      value-field="id"
      placeholder="Válassz típust..."
      :clearable="clearable"
      @update:model-value="emit('update:modelValue', $event as number | null)"
    />
    <div v-else class="text-sm text-[--color-muted-foreground]">
      Poszt típusok betöltése...
    </div>
    <FieldError :errors="errors" />
  </div>
</template>
