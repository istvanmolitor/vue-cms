<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, CreateButton } from '@admin'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { contentRegionService } from '../../services/contentRegionService.ts'

const router = useRouter()
const table = ref()

const deleteRegion = async (id: number) => {
  if (!confirm('Biztosan törölni szeretné ezt a régiót?')) return
  try {
    await contentRegionService.delete(id)
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a régió törlésekor:', error)
  }
}

const editRegion = (id: number) => {
  router.push(`/admin/cms/region/${id}/edit`)
}
</script>

<template>
  <AdminLayout page-title="Régiók">
    <DataTable
      ref="table"
      url="/api/cms/regions"
    >
      <template #actions>
        <CreateButton to="/admin/cms/region/create">Új régió</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editRegion((row as any).id)" />
        <DeleteButton @confirm="deleteRegion((row as any).id)" />
      </template>
      <template #empty>
        Nincs megjeleníthető régió.
      </template>
    </DataTable>
  </AdminLayout>
</template>
