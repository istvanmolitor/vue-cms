<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
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
  router.push(`/cms/regions/${id}/edit`)
}

onMounted(() => {
  fetchRegions()
})
</script>

<template>
  <AdminLayout page-title="Régiók">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold tracking-tight">Régiók</h2>
      <Button @click="router.push('/cms/regions/create')">
        <Icon name="plus" :size="16" class="mr-2" />
        Új régió
      </Button>
    </div>

    <DataTable
      :columns="columns"
      :data="regions"
      :loading="isLoading"
      @fetch="fetchRegions"
    >
      <template #row-actions="{ row }">
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" @click="editRegion(row.id!)">Szerkesztés</Button>
          <Button variant="destructive" size="sm" @click="deleteRegion(row.id!)">Törlés</Button>
        </div>
      </template>
      <template #empty>
        Nincs megjeleníthető régió.
      </template>
    </DataTable>
  </AdminLayout>
</template>
