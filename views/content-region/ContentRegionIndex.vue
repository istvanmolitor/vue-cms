<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable, { type Column } from '@admin/components/ui/dataTable/DataTable.vue'
// ...existing code...
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { contentRegionService, type ContentRegion } from '../../services/contentRegionService.ts'

const router = useRouter()
const regions = ref<ContentRegion[]>([])
const isLoading = ref(false)

const columns: Column<ContentRegion>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
]

const fetchRegions = async () => {
  try {
    isLoading.value = true
    const response = await contentRegionService.getAll()
    regions.value = response.data.data
  } catch (error) {
    console.error('Hiba a régiók betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteRegion = async (id: number) => {
  if (!confirm('Biztosan törölni szeretné ezt a régiót?')) return
  try {
    await contentRegionService.delete(id)
    await fetchRegions()
  } catch (error) {
    console.error('Hiba a régió törlésekor:', error)
  }
}

const editRegion = (id: number) => {
  router.push(`/admin/cms/region/${id}/edit`)
}

onMounted(() => {
  fetchRegions()
})
</script>

<template>
  <AdminLayout page-title="Régiók">
    <DataTable
      :columns="columns"
      :data="regions"
      :loading="isLoading"
      @fetch="fetchRegions"
    >
      <template #actions>
        <CreateButton to="/admin/cms/region/create">Új régió</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editRegion(row.id!)" />
        <DeleteButton @confirm="deleteRegion(row.id!)" />
      </template>
      <template #empty>
        Nincs megjeleníthető régió.
      </template>
    </DataTable>
  </AdminLayout>
</template>
