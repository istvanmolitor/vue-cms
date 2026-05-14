<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Label from '@admin/components/ui/Label.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'
import { pageGroupService, type PageGroup } from '../../services/pageGroupService'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { page_group_id, limit, updateValue } = useElementEditor(props, emit, {
  page_group_id: null,
  limit: 5
})

const pageGroups = ref<PageGroup[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const response = await pageGroupService.getAll()
    pageGroups.value = response.data.data
  } catch (error) {
    console.error('Failed to load page groups', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-8">
        <Label class="text-sm font-medium mb-1 block">Oldal csoport</Label>
        <select
          v-model="page_group_id"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="loading"
        >
          <option :value="null">Válassz csoportot...</option>
          <option v-for="group in pageGroups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
        <p v-if="loading" class="text-xs text-muted-foreground mt-1">Betöltés...</p>
      </div>
      <div class="col-span-4">
        <Label class="text-sm font-medium mb-1 block">Limit</Label>
        <input
          v-model.number="limit"
          type="number"
          min="1"
          max="100"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  </div>
</template>
